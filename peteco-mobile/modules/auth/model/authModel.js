import { supabase } from '../../../shared/lib/supabase';

export async function login(email, senha) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
}

export async function cadastrar(email, senha, nome, telefone) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, telefone } },
  });
  if (error) throw error;
  if (data.user) {
    await supabase.from('perfis').upsert({
      id: data.user.id,
      nome,
      telefone: telefone || null,
    });
  }
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function obterUsuario() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function obterSessao() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
