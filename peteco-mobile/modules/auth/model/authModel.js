import { supabase } from '../../../shared/lib/supabase';

export async function login(email, senha) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
}

export async function cadastrar(email, senha, nome, telefone, bairro) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, telefone, bairro } },
  });
  if (error) throw error;
  if (data.user) {
    await supabase.from('perfis').upsert({
      id: data.user.id,
      nome,
      telefone: telefone || null,
      bairro:   bairro   || null,
    });
  }
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function obterUsuario() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      await supabase.auth.signOut();
      return null;
    }
    return user;
  } catch {
    await supabase.auth.signOut();
    return null;
  }
}

export async function obterSessao() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      await supabase.auth.signOut();
      return null;
    }
    return session;
  } catch {
    await supabase.auth.signOut();
    return null;
  }
}
