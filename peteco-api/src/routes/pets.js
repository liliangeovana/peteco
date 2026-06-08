import { Router } from 'express';
import Groq from 'groq-sdk';
import { supabase } from '../lib/supabase.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

function toDataUrl(imagemBase64) {
  if (imagemBase64.startsWith('data:')) return imagemBase64;
  return `data:image/jpeg;base64,${imagemBase64}`;
}

function comTimeout(promise, ms, mensagem) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(mensagem)), ms)),
  ]);
}

function parseGroqJson(resposta) {
  return JSON.parse(
    resposta.choices[0].message.content.trim().replace(/```json|```/g, '').trim()
  );
}

// GET /pets — lista pets com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { status, cidade, especie, usuario_id } = req.query;
    let query = supabase
      .from('pets_perdidos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (status)     query = query.eq('status', status);
    if (cidade)     query = query.eq('cidade', cidade);
    if (especie)    query = query.eq('especie', especie);
    if (usuario_id) query = query.eq('usuario_id', usuario_id);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets/validar-foto — verifica se imagem contém animal e não tem conteúdo sensível
router.post('/validar-foto', autenticar, async (req, res) => {
  try {
    const { imagemBase64 } = req.body;
    if (!imagemBase64) return res.status(400).json({ erro: 'imagemBase64 é obrigatório' });

    const tamanhoKB = Math.round(imagemBase64.length * 0.75 / 1024);
    console.log(`[validar-foto] base64 recebido: ~${tamanhoKB}KB`);

    console.log('[validar-foto] chamando Groq...');
    const result = await comTimeout(
      groq.chat.completions.create({
        model: VISION_MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: toDataUrl(imagemBase64) } },
            { type: 'text', text: 'Analise esta imagem. Responda APENAS com JSON válido, sem markdown: {"ehAnimal": boolean, "temConteudoSensivel": boolean, "motivo": string_ou_null}. ehAnimal=true se a imagem contém um animal doméstico (cachorro, gato, coelho, hamster, etc). temConteudoSensivel=true se há nudez, violência ou conteúdo impróprio. motivo=null se aprovada, ou uma frase curta em português explicando a reprovação.' },
          ],
        }],
        max_tokens: 200,
      }),
      50000,
      'Groq não respondeu em 50s'
    );
    console.log('[validar-foto] Groq respondeu');

    const json = parseGroqJson(result);
    const aprovada = json.ehAnimal === true && json.temConteudoSensivel === false;

    res.json({
      data: { aprovada, ehAnimal: json.ehAnimal, temConteudoSensivel: json.temConteudoSensivel, motivo: json.motivo ?? null },
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets/buscar-similares — busca visual por similares usando Gemini (requer imagem)
router.post('/buscar-similares', autenticar, async (req, res) => {
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

    console.log('[buscar-similares] chamando Groq...');
    const result = await comTimeout(
      groq.chat.completions.create({
        model: VISION_MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: toDataUrl(imagemBase64) } },
            { type: 'text', text: `Esta foto é de um pet: especie="${especie || '?'}", cor="${cor || '?'}", raca="${raca || '?'}". Compare visualmente e por atributos com os pets cadastrados abaixo. Retorne APENAS JSON array sem markdown com os até 3 mais similares (score >= 5, escala 1-10): [{"id":"uuid_exato","score":number,"justificativa":"frase curta em português"}]. Se nenhum tiver score >= 5, retorne []. Pets cadastrados:\n${listaPets}` },
          ],
        }],
        max_tokens: 500,
      }),
      50000,
      'Groq não respondeu em 50s'
    );
    console.log('[buscar-similares] Groq respondeu');

    const similares = parseGroqJson(result);

    const resultado = similares
      .filter(s => s.score >= 5)
      .slice(0, 3)
      .map(s => ({
        pet: candidatos.find(c => c.id === s.id),
        score: s.score,
        justificativa: s.justificativa,
      }));

    res.json({ data: resultado });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /pets/:id/similares — similares por espécie/cidade (filtro SQL, sem análise de imagem)
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
        usuario_id: req.usuario.id,
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
      .eq('usuario_id', req.usuario.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
