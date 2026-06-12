import { File } from 'expo-file-system/next';
import api from '../../../shared/lib/api';
import { supabase } from '../../../shared/lib/supabase';

const authHeaders = (token) => token ? { Authorization: `Bearer ${token}` } : {};

export async function listarPets(params = {}) {
  const { data } = await api.get('/pets', { params });
  return data;
}

export async function buscarPetPorId(id) {
  const { data } = await api.get(`/pets/${id}`);
  return data;
}

export async function listarPetsDoUsuario() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');
  const { data } = await api.get('/pets', { params: { usuario_id: user.id } });
  return data;
}

export async function criarPet(payload, accessToken) {
  const { data } = await api.post('/pets', payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true,
  });
  return data;
}

export async function marcarEncontrado(id, accessToken) {
  const { data } = await api.patch(
    `/pets/${id}/encontrado`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return data;
}

export async function validarFoto(imagemBase64, accessToken) {
  const { data } = await api.post('/pets/validar-foto', { imagemBase64 }, { timeout: 60000, headers: authHeaders(accessToken) });
  return data;
}

export async function buscarSimilares(payload, accessToken) {
  const { data } = await api.post('/pets/buscar-similares', payload, { timeout: 60000, headers: authHeaders(accessToken) });
  return data;
}

export async function listarSimilares(id) {
  const { data } = await api.get(`/pets/${id}/similares`);
  return data || [];
}

export async function listarAvistamentos(id) {
  const { data } = await api.get(`/pets/${id}/avistamentos`);
  return data || [];
}

export async function criarAvistamento(id, payload, accessToken) {
  const { data } = await api.post(`/pets/${id}/avistamentos`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

export async function buscarNotificacoes(accessToken) {
  const { data } = await api.get('/pets/notificacoes', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data || [];
}

export async function marcarAvistamentosVistos(id, accessToken) {
  await api.patch(`/pets/${id}/avistamentos/marcar-vistos`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function atualizarPet(id, payload, accessToken) {
  const { data } = await api.put(`/pets/${id}`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

export async function excluirPet(id, accessToken) {
  await api.delete(`/pets/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function uploadFoto(uri) {
  const file = new File(uri);
  const bytes = await file.bytes();
  const nome = `pets/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from('fotos-pets')
    .upload(nome, bytes, { contentType: 'image/jpeg' });
  if (error) throw error;
  const { data } = supabase.storage.from('fotos-pets').getPublicUrl(nome);
  return data.publicUrl;
}

export async function lerBase64(uri) {
  const file = new File(uri);
  const bytes = await file.bytes();
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
