import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      user_metadata: { nome },
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
      id:    data.user.id,
      email: data.user.email,
      nome:  data.user.user_metadata?.nome,
      token: data.session.access_token,
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

router.get('/me', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  res.json(req.session.usuario);
});

router.patch('/perfil', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  try {
    const { nome, telefone, senha } = req.body;
    const updates = {};

    if (nome || telefone) {
      updates.data = {};
      if (nome) updates.data.nome = nome;
      if (telefone) updates.data.telefone = telefone;
    }
    if (senha) updates.password = senha;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.session.usuario.id,
      updates
    );
    if (error) return res.status(400).json({ erro: error.message });

    req.session.usuario = {
      ...req.session.usuario,
      nome: data.user.user_metadata?.nome ?? req.session.usuario.nome,
    };

    res.json({ mensagem: 'Perfil atualizado', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
