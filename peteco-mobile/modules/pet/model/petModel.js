import * as FileSystem from 'expo-file-system';
import api from '../../../shared/lib/api';
import { supabase } from '../../../shared/lib/supabase';

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
  const { data } = await api.get('/pets');
  return data.filter(p => p.usuario_id === user.id);
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

export async function validarFoto(imagemBase64) {
  const { data } = await api.post('/pets/validar-foto', { imagemBase64 });
  return data;
}

export async function buscarSimilares(payload) {
  const { data } = await api.post('/pets/buscar-similares', payload);
  return data;
}

export async function listarSimilares(id) {
  const { data } = await api.get(`/pets/${id}/similares`);
  return data || [];
}

export async function uploadFoto(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const nome = `pets/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from('fotos-pets')
    .upload(nome, blob, { contentType: 'image/jpeg' });
  if (error) throw error;
  const { data } = supabase.storage.from('fotos-pets').getPublicUrl(nome);
  return data.publicUrl;
}

export async function lerBase64(uri) {
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}
