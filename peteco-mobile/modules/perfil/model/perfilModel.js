import { supabase } from '../../../shared/lib/supabase';

export async function buscarPerfil(userId) {
  const { data } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function salvarPerfil(userId, nome, telefone) {
  await supabase.from('perfis').upsert({ id: userId, nome, telefone });
  await supabase.auth.updateUser({ data: { nome } });
}
