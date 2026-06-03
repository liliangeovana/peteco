import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /pets — lista pets com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { status, cidade, especie } = req.query;
    let query = supabase
      .from('pets_perdidos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (status)  query = query.eq('status', status);
    if (cidade)  query = query.eq('cidade', cidade);
    if (especie) query = query.eq('especie', especie);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets/validar-foto — verifica se imagem contém animal e não tem conteúdo sensível
router.post('/validar-foto', async (req, res) => {
  try {
    const { imagemBase64 } = req.body;
    if (!imagemBase64) return res.status(400).json({ erro: 'imagemBase64 é obrigatório' });

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imagemBase64 },
          },
          {
            type: 'text',
            text: 'Analise esta imagem. Responda APENAS com JSON válido, sem markdown: {"ehAnimal": boolean, "temConteudoSensivel": boolean, "motivo": string_ou_null}. ehAnimal=true se a imagem contém um animal doméstico (cachorro, gato, coelho, hamster, etc). temConteudoSensivel=true se há nudez, violência ou conteúdo impróprio. motivo=null se aprovada, ou uma frase curta explicando a reprovação.',
          },
        ],
      }],
    });

    const texto = response.content[0].text.trim().replace(/```json|```/g, '').trim();
    const json = JSON.parse(texto);
    const aprovada = json.ehAnimal === true && json.temConteudoSensivel === false;

    res.json({
      mensagem: aprovada ? 'Imagem aprovada.' : 'Imagem reprovada.',
      status: 200,
      data: { aprovada, ehAnimal: json.ehAnimal, temConteudoSensivel: json.temConteudoSensivel, motivo: json.motivo ?? null },
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets/buscar-similares — encontra pets similares usando Claude
router.post('/buscar-similares', async (req, res) => {
  try {
    const { imagemBase64, especie, cor, raca, cidade } = req.body;
    if (!imagemBase64) return res.status(400).json({ erro: 'imagemBase64 é obrigatório' });

    let query = supabase
      .from('pets_perdidos')
      .select('id, nome, especie, raca, cor, foto_url, bairro, cidade, status')
      .eq('status', 'perdido');

    if (especie) query = query.eq('especie', especie);
    if (cidade)  query = query.eq('cidade', cidade);

    const { data: candidatos } = await query.limit(10);
    if (!candidatos?.length) {
      return res.json({ mensagem: '0 pet(s) similar(es) encontrado(s).', status: 200, data: [] });
    }

    const listaPets = candidatos
      .map((p, i) => `${i + 1}. id="${p.id}" nome="${p.nome}" especie="${p.especie}" raca="${p.raca || '?'}" cor="${p.cor || '?'}" cidade="${p.cidade || '?'}"`)
      .join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imagemBase64 },
          },
          {
            type: 'text',
            text: `Esta foto é de um pet: especie="${especie || '?'}", cor="${cor || '?'}", raca="${raca || '?'}". Compare visualmente e por atributos com os pets cadastrados abaixo. Retorne APENAS JSON array sem markdown com os até 3 mais similares (score >= 5, escala 1-10): [{"id":"uuid_exato","score":number,"justificativa":"frase curta"}]. Se nenhum tiver score >= 5, retorne []. Pets cadastrados:\n${listaPets}`,
          },
        ],
      }],
    });

    const texto = response.content[0].text.trim().replace(/```json|```/g, '').trim();
    const similares = JSON.parse(texto);

    const resultado = similares
      .filter(s => s.score >= 5)
      .slice(0, 3)
      .map(s => ({
        pet: candidatos.find(c => c.id === s.id),
        score: s.score,
        justificativa: s.justificativa,
      }))
      .filter(s => s.pet);

    res.json({
      mensagem: `${resultado.length} pet(s) similar(es) encontrado(s).`,
      status: 200,
      data: resultado,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /pets/:id/similares — retorna até 3 pets similares por espécie e cidade
router.get('/:id/similares', async (req, res) => {
  try {
    const { data: pet, error: errPet } = await supabase
      .from('pets_perdidos')
      .select('id, especie, cidade')
      .eq('id', req.params.id)
      .single();

    if (errPet || !pet) return res.status(404).json({ erro: 'Pet não encontrado' });

    let query = supabase
      .from('pets_perdidos')
      .select('id, nome, especie, raca, cor, foto_url, bairro, cidade, status, data_perda')
      .eq('status', 'perdido')
      .neq('id', req.params.id)
      .limit(3);

    if (pet.especie) query = query.eq('especie', pet.especie);
    if (pet.cidade)  query = query.eq('cidade', pet.cidade);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /pets/:id — detalhe de um pet
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets_perdidos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ erro: 'Pet não encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets — cadastra novo pet (requer sessão)
router.post('/', autenticar, async (req, res) => {
  try {
    const { nome, especie, raca, cor, descricao,
            latitude, longitude, endereco, bairro, cidade,
            foto_url, data_perda } = req.body;

    const { data, error } = await supabase
      .from('pets_perdidos')
      .insert({
        usuario_id: req.session.usuario.id,
        nome, especie, raca, cor, descricao,
        foto_url, data_perda, endereco, bairro, cidade,
        localizacao: latitude && longitude ? `POINT(${longitude} ${latitude})` : null,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PATCH /pets/:id/encontrado — marca pet como encontrado
router.patch('/:id/encontrado', autenticar, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets_perdidos')
      .update({ status: 'encontrado', atualizado_em: new Date() })
      .eq('id', req.params.id)
      .eq('usuario_id', req.session.usuario.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
