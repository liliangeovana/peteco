const TRADUCOES = [
  { match: /already registered|already exists|user already/i,        msg: 'Este e-mail já está cadastrado.' },
  { match: /invalid login credentials|invalid credentials/i,         msg: 'E-mail ou senha incorretos.' },
  { match: /email not confirmed/i,                                    msg: 'E-mail não confirmado. Verifique sua caixa de entrada.' },
  { match: /password should be at least/i,                           msg: 'A senha precisa ter pelo menos 6 caracteres.' },
  { match: /unable to validate email|invalid format/i,               msg: 'Formato de e-mail inválido.' },
  { match: /email rate limit exceeded/i,                             msg: 'Muitas tentativas. Aguarde alguns minutos.' },
  { match: /network request failed|failed to fetch/i,                msg: 'Sem conexão. Verifique sua internet.' },
  { match: /token has expired|refresh token/i,                       msg: 'Sessão expirada. Faça login novamente.' },
  { match: /weak password/i,                                         msg: 'Senha muito fraca. Use letras, números e símbolos.' },
];

export function traduzirErro(err) {
  const mensagem = err?.message || String(err);
  const encontrado = TRADUCOES.find(t => t.match.test(mensagem));
  return encontrado ? encontrado.msg : 'Ocorreu um erro. Tente novamente.';
}
