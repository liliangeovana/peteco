import { supabase } from '../lib/supabase.js';

export async function autenticar(req, res, next) {
  // sessão cookie (web)
  if (req.session?.usuario) {
    req.usuario = req.session.usuario;
    return next();
  }

  // Bearer JWT (mobile) — não persiste em sessão para manter stateless
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      req.usuario = user;
      return next();
    }
  }

  return res.status(401).json({ erro: 'Sessão inativa. Faça login.' });
}
