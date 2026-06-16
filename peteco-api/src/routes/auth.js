import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, bairro, telefone } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
    }
    if (!bairro) {
      return res.status(400).json({ erro: 'Bairro é obrigatório' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      user_metadata: { nome, bairro, ...(telefone ? { telefone } : {}) },
      email_confirm: true,
    });
    if (error) return res.status(400).json({ erro: error.message });

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso', id: data.user.id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) return res.status(401).json({ erro: 'Credenciais inválidas' });

    req.session.usuario = {
      id:     data.user.id,
      email:  data.user.email,
      nome:   data.user.user_metadata?.nome,
      bairro: data.user.user_metadata?.bairro ?? null,
      token:  data.session.access_token,
    };

    res.json({ mensagem: 'Login realizado com sucesso', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão' });
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Logout realizado' });
  });
});

router.get('/me', autenticar, (req, res) => {
  const u = req.usuario;
  res.json({
    id:       u.id,
    email:    u.email,
    nome:     u.nome     ?? u.user_metadata?.nome     ?? null,
    bairro:   u.bairro   ?? u.user_metadata?.bairro   ?? null,
    telefone: u.telefone ?? u.user_metadata?.telefone ?? null,
    token:    u.token    ?? null,
  });
});

router.patch('/perfil', autenticar, async (req, res) => {
  try {
    const { nome, telefone, senha, bairro } = req.body;
    const meta = {
      ...(nome     !== undefined && { nome }),
      ...(telefone !== undefined && { telefone }),
      ...(bairro   !== undefined && { bairro }),
    };
    const updates = {
      ...(Object.keys(meta).length > 0 && { user_metadata: meta }),
      ...(senha && { password: senha }),
    };

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
    }

    const { error } = await supabase.auth.admin.updateUserById(req.usuario.id, updates);
    if (error) {
      console.error('[PATCH /perfil] Supabase error:', error);
      return res.status(400).json({ erro: error.message });
    }

    // Atualiza sessão se existir (web legacy)
    if (req.session?.usuario) {
      if (nome     !== undefined) req.session.usuario.nome     = nome;
      if (bairro   !== undefined) req.session.usuario.bairro   = bairro;
      if (telefone !== undefined) req.session.usuario.telefone = telefone;
    }

    const usuarioAtualizado = {
      id:       req.usuario.id,
      email:    req.usuario.email,
      nome:     nome     ?? req.usuario.nome     ?? req.usuario.user_metadata?.nome     ?? null,
      bairro:   bairro   ?? req.usuario.bairro   ?? req.usuario.user_metadata?.bairro   ?? null,
      telefone: telefone ?? req.usuario.telefone ?? req.usuario.user_metadata?.telefone ?? null,
      token:    req.usuario.token ?? null,
    };

    res.json({ mensagem: 'Perfil atualizado', usuario: usuarioAtualizado });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
