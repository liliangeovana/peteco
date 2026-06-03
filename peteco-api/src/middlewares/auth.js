export function autenticar(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Sessão inativa. Faça login.' });
  }
  next();
}
