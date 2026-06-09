import {
  View, Text, Image, ImageBackground, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, useWindowDimensions, Dimensions,
  Modal, TextInput, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../constants/bairros';
import { RACAS, SEM_RACA } from '../../constants/racas';
import useDetalhePetController from '../../modules/pet/controller/useDetalhePetController';
import DatePickerField from '../../shared/components/DatePickerField';

const OPCOES_BAIRRO = [...BAIRROS_BOA_VISTA.map(b => b.nome), OPCAO_OUTRO];

function formatarDataHora(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function parseFotoUrls(fotoUrl) {
  if (!fotoUrl) return [];
  try {
    const parsed = JSON.parse(fotoUrl);
    return Array.isArray(parsed) ? parsed : [fotoUrl];
  } catch {
    return [fotoUrl];
  }
}

function isoParaPtBR(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${a}`;
}

export default function DetalhePet() {
  const { id }   = useLocalSearchParams();
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const [fotoAtiva, setFotoAtiva]             = useState(0);
  const [modalAvist, setModalAvist]           = useState(false);
  const [modalBairro, setModalBairro]         = useState(false);
  const [fotosAnexo, setFotosAnexo]           = useState([]);
  const [modalAnexos, setModalAnexos]         = useState(false);
  const [anexoAtivo, setAnexoAtivo]           = useState(0);
  const [modalAcoes, setModalAcoes]           = useState(false);
  const [modalEditar, setModalEditar]         = useState(false);
  const [modalBairroEdit, setModalBairroEdit] = useState(false);
  const [modalRacaEdit, setModalRacaEdit]     = useState(false);

  const {
    pet, loading, usuario, salvando,
    similares, loadingSimilares,
    avistamentos, loadingAvist,
    formAvist, setAvist,
    bairroAvistSel, setBairroAvistSel,
    bairroAvistOutro, setBairroAvistOutro,
    fotosAvist, selecionarFotoAvist, removerFotoAvist,
    enviandoAvist, registrarAvistamento,
    marcarEncontrado,
    formEdit, setEdit,
    dataEditPerda, setDataEditPerda,
    fotosEdit, fotosEditValidadas, validandoFotoEdit,
    selecionarFotoEdit, removerFotoEdit,
    bairroEditSel, setBairroEditSel,
    bairroEditOutro, setBairroEditOutro,
    racaEditSel, setRacaEditSel,
    selecionarEspecieEdit,
    salvandoEdicao, salvarEdicao, iniciarEditar,
    excluindo, confirmarExcluir,
  } = useDetalhePetController(id, () => router.back());

  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const ehDono   = usuario?.id === pet?.usuario_id;
  const perdido  = pet?.status === 'perdido';
  const fotoUrls = parseFotoUrls(pet?.foto_url);

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fotos / carrossel */}
        <View style={s.fotoContainer}>
          {fotoUrls.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={e => setFotoAtiva(Math.round(e.nativeEvent.contentOffset.x / width))}
                scrollEventThrottle={16}
              >
                {fotoUrls.map((url, idx) => (
                  <Image key={idx} source={{ uri: url }} style={[s.foto, { width }]} />
                ))}
              </ScrollView>
              {fotoUrls.length > 1 && (
                <View style={s.dots}>
                  {fotoUrls.map((_, idx) => (
                    <View key={idx} style={[s.dot, fotoAtiva === idx && s.dotAtivo]} />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[s.foto, s.fotoVazia]}>
              {pet.especie === 'cachorro'
                ? <MaterialCommunityIcons name="dog" size={80} color={colors.primary} />
                : pet.especie === 'gato'
                ? <MaterialCommunityIcons name="cat" size={80} color={colors.primary} />
                : <Ionicons name="paw-outline" size={80} color={colors.primary} />
              }
            </View>
          )}
          <TouchableOpacity style={s.btnVoltar} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.textDark} />
          </TouchableOpacity>
          <View style={[s.statusBadge, perdido ? s.badgePerdido : s.badgeEncontrado]}>
            <Ionicons name="ellipse" size={8} color={perdido ? colors.danger : colors.success} />
            <Text style={s.statusTexto}>{perdido ? 'Perdido' : 'Encontrado'}</Text>
          </View>
        </View>

        <View style={s.conteudo}>
          {/* Nome, dono e espécie */}
          <View style={s.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={s.nome}>{pet.nome}</Text>
              {pet.nome_dono && (
                <Text style={s.nomeDono}>de {pet.nome_dono}</Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={s.especieTag}>
                {pet.especie === 'cachorro'
                  ? <MaterialCommunityIcons name="dog" size={14} color={colors.primary} />
                  : pet.especie === 'gato'
                  ? <MaterialCommunityIcons name="cat" size={14} color={colors.primary} />
                  : <Ionicons name="paw-outline" size={14} color={colors.primary} />
                }
                <Text style={s.especieTexto}>{pet.especie}</Text>
              </View>
              {ehDono && (
                <TouchableOpacity
                  style={s.btnAcoes}
                  onPress={() => setModalAcoes(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color={colors.textMid} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Informações em grid */}
          <View style={s.infoGrid}>
            {[
              { icon: 'pricetag-outline',     label: 'Raça',       valor: pet.raca   || 'Sem raça definida' },
              { icon: 'color-palette-outline', label: 'Cor',        valor: pet.cor    || '—' },
              { icon: 'location-outline',      label: 'Bairro',     valor: pet.bairro || '—' },
              { icon: 'calendar-outline',      label: 'Perdido em', valor: isoParaPtBR(pet.data_perda) },
            ].map(({ icon, label, valor }) => (
              <View key={label} style={s.infoCard}>
                <Ionicons name={icon} size={18} color={colors.primary} style={{ marginBottom: 4 }} />
                <Text style={s.infoLabel}>{label}</Text>
                <Text style={s.infoValor} numberOfLines={1}>{valor}</Text>
              </View>
            ))}
          </View>

          {/* Descrição */}
          {pet.descricao ? (
            <View style={s.descricaoCard}>
              <Text style={s.descricaoTitulo}>Descrição</Text>
              <Text style={s.descricaoTexto}>{pet.descricao}</Text>
            </View>
          ) : null}

          {/* Histórico de avistamentos */}
          {(loadingAvist || avistamentos.length > 0) && (
            <View style={s.avistSecao}>
              <Text style={s.avistTitulo}>Histórico de avistamentos</Text>
              {loadingAvist ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
              ) : (
                avistamentos.map((a, idx) => (
                  <View key={a.id} style={s.avistItem}>
                    <View style={s.avistLinha}>
                      <View style={s.avistDot} />
                      {idx < avistamentos.length - 1 && <View style={s.avistConector} />}
                    </View>
                    <View style={s.avistConteudo}>
                      <View style={s.avistCabecalho}>
                        <Text style={s.avistLocal}>
                          {a.bairro}{a.rua ? ` · ${a.rua}` : ''}
                        </Text>
                        <Text style={s.avistData}>{formatarDataHora(a.criado_em)}</Text>
                      </View>
                      {a.descricao && <Text style={s.avistDesc}>{a.descricao}</Text>}
                      {(() => {
                        try {
                          const fotos = JSON.parse(a.fotos_url);
                          if (Array.isArray(fotos) && fotos.length > 0) return (
                            <TouchableOpacity
                              style={s.btnAnexos}
                              onPress={() => { setFotosAnexo(fotos); setAnexoAtivo(0); setModalAnexos(true); }}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="images-outline" size={14} color={colors.primary} />
                              <Text style={s.btnAnexosTexto}>
                                {fotos.length} foto{fotos.length > 1 ? 's' : ''}
                              </Text>
                            </TouchableOpacity>
                          );
                        } catch { }
                        return null;
                      })()}
                      {a.nome_usuario && (
                        <Text style={s.avistUsuario}>por {a.nome_usuario}</Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Pets similares */}
          {(loadingSimilares || similares.length > 0) && (
            <View style={s.similaresSecao}>
              <Text style={s.similaresTitulo}>Pets similares na região</Text>
              {loadingSimilares ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {similares.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={s.similarCard}
                      onPress={() => router.push(`/pet/${item.id}`)}
                      activeOpacity={0.85}
                    >
                      {parseFotoUrls(item.foto_url)[0] ? (
                        <Image source={{ uri: parseFotoUrls(item.foto_url)[0] }} style={s.similarFoto} />
                      ) : (
                        <View style={[s.similarFoto, s.similarFotoVazia]}>
                          <Ionicons name="paw-outline" size={22} color={colors.primary} />
                        </View>
                      )}
                      <View style={s.similarInfo}>
                        <Text style={s.similarNome} numberOfLines={1}>{item.nome}</Text>
                        <Text style={s.similarBairro} numberOfLines={1}>
                          {item.bairro || '—'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Rodapé de ações */}
      <View style={s.rodape}>
        {!ehDono && perdido && usuario && (
          <TouchableOpacity
            style={s.btnAvist}
            onPress={() => setModalAvist(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="eye-outline" size={20} color={colors.primary} />
            <Text style={s.btnAvistTexto}>Vi este pet!</Text>
          </TouchableOpacity>
        )}
        {ehDono && perdido && (
          <TouchableOpacity
            style={s.btnEncontrado}
            onPress={marcarEncontrado}
            disabled={salvando}
            activeOpacity={0.85}
          >
            {salvando
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={s.btnEncontradoTexto}>Encontrei meu pet!</Text>
                </>
            }
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de fotos dos anexos */}
      <Modal
        visible={modalAnexos}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAnexos(false)}
      >
        <ImageBackground
          source={{ uri: fotosAnexo[anexoAtivo] ?? undefined }}
          style={{ flex: 1 }}
          blurRadius={22}
        >
          <View style={s.anexosOverlay}>
            <TouchableOpacity style={s.anexosBtnFechar} onPress={() => setModalAnexos(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={e => setAnexoAtivo(Math.round(e.nativeEvent.contentOffset.x / width))}
              scrollEventThrottle={16}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              {fotosAnexo.map((url, idx) => (
                <View key={idx} style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={{ uri: url }}
                    style={s.anexoImagem}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            {fotosAnexo.length > 1 && (
              <View style={s.anexosDots}>
                {fotosAnexo.map((_, idx) => (
                  <View key={idx} style={[s.dot, anexoAtivo === idx && s.dotAtivo]} />
                ))}
              </View>
            )}
            <Text style={s.anexosContador}>{anexoAtivo + 1} / {fotosAnexo.length}</Text>
          </View>
        </ImageBackground>
      </Modal>

      {/* Modal de avistamento */}
      <Modal
        visible={modalAvist}
        transparent
        animationType="slide"
        onRequestClose={() => setModalAvist(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalAvist(false)} />
        <View style={s.modalSheet}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitulo}>Registrar avistamento</Text>
            <TouchableOpacity onPress={() => setModalAvist(false)}>
              <Ionicons name="close" size={22} color={colors.textMid} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 16 }} keyboardShouldPersistTaps="handled">
            <Text style={s.formLabel}>Bairro *</Text>
            <TouchableOpacity
              style={s.formSelect}
              onPress={() => setModalBairro(true)}
              activeOpacity={0.8}
            >
              <Text style={bairroAvistSel ? s.formSelectTexto : s.formSelectPlaceholder}>
                {bairroAvistSel || 'Selecione o bairro'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textLight} />
            </TouchableOpacity>

            {bairroAvistSel === OPCAO_OUTRO && (
              <>
                <Text style={[s.formLabel, { marginTop: 12 }]}>Qual bairro?</Text>
                <TextInput
                  style={s.formInput}
                  value={bairroAvistOutro}
                  onChangeText={setBairroAvistOutro}
                  placeholder="Digite o bairro"
                  placeholderTextColor={colors.textLight}
                />
              </>
            )}

            <Text style={[s.formLabel, { marginTop: 12 }]}>Fotos (opcional, máx. 3)</Text>
            <View style={s.fotosAvistRow}>
              {fotosAvist.map((uri, idx) => (
                <View key={idx} style={s.fotoAvistThumb}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
                  <TouchableOpacity style={s.fotoAvistLixeira} onPress={() => removerFotoAvist(idx)}>
                    <Ionicons name="trash-outline" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {fotosAvist.length < 3 && (
                <TouchableOpacity style={s.fotoAvistAdd} onPress={selecionarFotoAvist} activeOpacity={0.8}>
                  <Ionicons name="camera-outline" size={22} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={[s.formLabel, { marginTop: 12 }]}>Rua / Referência</Text>
            <TextInput
              style={s.formInput}
              value={formAvist.rua}
              onChangeText={v => setAvist('rua', v)}
              placeholder="Ex: Rua das Flores, próximo ao mercado"
              placeholderTextColor={colors.textLight}
            />

            <Text style={[s.formLabel, { marginTop: 12 }]}>Descrição *</Text>
            <TextInput
              style={[s.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
              value={formAvist.descricao}
              onChangeText={v => setAvist('descricao', v)}
              placeholder="Descreva onde e como viu o pet..."
              placeholderTextColor={colors.textLight}
              multiline
            />

            <TouchableOpacity
              style={[s.btnEncontrado, { marginTop: 20, marginBottom: 8 }]}
              onPress={async () => {
                const ok = await registrarAvistamento();
                if (ok) setModalAvist(false);
              }}
              disabled={enviandoAvist}
              activeOpacity={0.85}
            >
              {enviandoAvist
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="eye-outline" size={18} color="#fff" />
                    <Text style={s.btnEncontradoTexto}>Registrar avistamento</Text>
                  </>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal select de bairro para avistamento */}
      <Modal
        visible={modalBairro}
        transparent
        animationType="slide"
        onRequestClose={() => setModalBairro(false)}
      >
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalBairro(false)} />
        <View style={s.modalSheet}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitulo}>Selecione o bairro</Text>
            <TouchableOpacity onPress={() => setModalBairro(false)}>
              <Ionicons name="close" size={22} color={colors.textMid} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={OPCOES_BAIRRO}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.modalItem, bairroAvistSel === item && s.modalItemAtivo]}
                onPress={() => {
                  setBairroAvistSel(item);
                  if (item !== OPCAO_OUTRO) setBairroAvistOutro('');
                  setModalBairro(false);
                }}
              >
                <Text style={[s.modalItemTexto, bairroAvistSel === item && s.modalItemTextoAtivo]}>
                  {item}
                </Text>
                {bairroAvistSel === item && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Modal de ações do dono */}
      <Modal
        visible={modalAcoes}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAcoes(false)}
      >
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalAcoes(false)} />
        <View style={s.acoesSheet}>
          <TouchableOpacity
            style={s.acaoItem}
            onPress={() => { setModalAcoes(false); iniciarEditar(); setModalEditar(true); }}
            activeOpacity={0.75}
          >
            <Ionicons name="create-outline" size={20} color={colors.textDark} />
            <Text style={s.acaoTexto}>Editar informações</Text>
          </TouchableOpacity>
          <View style={s.acaoDivisor} />
          <TouchableOpacity
            style={s.acaoItem}
            onPress={() => { setModalAcoes(false); confirmarExcluir(); }}
            activeOpacity={0.75}
            disabled={excluindo}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={[s.acaoTexto, { color: colors.danger }]}>
              {excluindo ? 'Excluindo...' : 'Excluir pet'}
            </Text>
          </TouchableOpacity>
          <View style={s.acaoDivisor} />
          <TouchableOpacity style={[s.acaoItem, { justifyContent: 'center' }]} onPress={() => setModalAcoes(false)}>
            <Text style={[s.acaoTexto, { color: colors.textMid }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal de edição do pet */}
      <Modal
        visible={modalEditar}
        animationType="slide"
        onRequestClose={() => setModalEditar(false)}
      >
        <View style={s.editContainer}>
          <View style={s.editHeader}>
            <TouchableOpacity onPress={() => setModalEditar(false)}>
              <Ionicons name="close" size={22} color={colors.textMid} />
            </TouchableOpacity>
            <Text style={s.editTitulo}>Editar pet</Text>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.editForm} keyboardShouldPersistTaps="handled">
            {/* Nome */}
            <Text style={s.formLabel}>Nome *</Text>
            <TextInput
              style={s.formInput}
              value={formEdit.nome}
              onChangeText={v => setEdit('nome', v)}
              placeholder="Nome do pet"
              placeholderTextColor={colors.textLight}
            />

            {/* Espécie */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Espécie *</Text>
            <View style={s.chipRow}>
              {['cachorro', 'gato', 'outro'].map(esp => {
                const ativo = formEdit.especie === esp;
                return (
                  <TouchableOpacity
                    key={esp}
                    style={[s.chipEspecie, ativo && s.chipEspecieAtivo]}
                    onPress={() => selecionarEspecieEdit(esp)}
                    activeOpacity={0.75}
                  >
                    {esp === 'cachorro'
                      ? <MaterialCommunityIcons name="dog" size={16} color={ativo ? '#fff' : colors.textMid} />
                      : esp === 'gato'
                      ? <MaterialCommunityIcons name="cat" size={16} color={ativo ? '#fff' : colors.textMid} />
                      : <Ionicons name="paw-outline" size={16} color={ativo ? '#fff' : colors.textMid} />
                    }
                    <Text style={[s.chipEspecieTexto, ativo && { color: '#fff' }]}>
                      {esp.charAt(0).toUpperCase() + esp.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Raça */}
            {(formEdit.especie === 'cachorro' || formEdit.especie === 'gato') && (
              <>
                <Text style={[s.formLabel, { marginTop: 14 }]}>Raça</Text>
                <TouchableOpacity style={s.formSelect} onPress={() => setModalRacaEdit(true)} activeOpacity={0.8}>
                  <Text style={racaEditSel ? s.formSelectTexto : s.formSelectPlaceholder}>
                    {racaEditSel || 'Selecione a raça'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textLight} />
                </TouchableOpacity>
              </>
            )}

            {/* Cor */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Cor</Text>
            <TextInput
              style={s.formInput}
              value={formEdit.cor}
              onChangeText={v => setEdit('cor', v)}
              placeholder="Ex: preto e branco, caramelo..."
              placeholderTextColor={colors.textLight}
            />

            {/* Bairro */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Bairro</Text>
            <TouchableOpacity style={s.formSelect} onPress={() => setModalBairroEdit(true)} activeOpacity={0.8}>
              <Text style={bairroEditSel ? s.formSelectTexto : s.formSelectPlaceholder}>
                {bairroEditSel || 'Selecione o bairro'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textLight} />
            </TouchableOpacity>
            {bairroEditSel === OPCAO_OUTRO && (
              <TextInput
                style={[s.formInput, { marginTop: 8 }]}
                value={bairroEditOutro}
                onChangeText={setBairroEditOutro}
                placeholder="Digite o bairro"
                placeholderTextColor={colors.textLight}
              />
            )}

            {/* Data da perda */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Data da perda</Text>
            <DatePickerField
              value={dataEditPerda}
              onChange={setDataEditPerda}
              placeholder="Selecionar data"
            />

            {/* Fotos */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Fotos (máx. 3)</Text>
            <View style={s.fotosAvistRow}>
              {fotosEdit.map((uri, idx) => (
                <View key={idx} style={s.fotoAvistThumb}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
                  {validandoFotoEdit && idx === fotosEdit.length - 1 ? (
                    <View style={s.fotoEditOverlay}>
                      <ActivityIndicator color="#fff" size="small" />
                    </View>
                  ) : fotosEditValidadas[idx] ? (
                    <View style={s.fotoEditCheck}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    </View>
                  ) : null}
                  <TouchableOpacity style={s.fotoAvistLixeira} onPress={() => removerFotoEdit(idx)}>
                    <Ionicons name="trash-outline" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {fotosEdit.length < 3 && (
                <TouchableOpacity
                  style={s.fotoAvistAdd}
                  onPress={selecionarFotoEdit}
                  disabled={validandoFotoEdit}
                  activeOpacity={0.8}
                >
                  {validandoFotoEdit && fotosEdit.length > 0
                    ? <ActivityIndicator color={colors.primary} />
                    : <Ionicons name="add" size={22} color={colors.primary} />
                  }
                </TouchableOpacity>
              )}
            </View>

            {/* Descrição */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Descrição</Text>
            <TextInput
              style={[s.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
              value={formEdit.descricao}
              onChangeText={v => setEdit('descricao', v)}
              placeholder="Descreva características do pet..."
              placeholderTextColor={colors.textLight}
              multiline
            />

            <TouchableOpacity
              style={[s.btnEncontrado, { marginTop: 24, marginBottom: 8, backgroundColor: colors.primary }]}
              onPress={async () => { const ok = await salvarEdicao(); if (ok) setModalEditar(false); }}
              disabled={salvandoEdicao}
              activeOpacity={0.85}
            >
              {salvandoEdicao
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-outline" size={18} color="#fff" />
                    <Text style={s.btnEncontradoTexto}>Salvar alterações</Text>
                  </>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal select de bairro para edição */}
      <Modal
        visible={modalBairroEdit}
        transparent
        animationType="slide"
        onRequestClose={() => setModalBairroEdit(false)}
      >
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalBairroEdit(false)} />
        <View style={s.modalSheet}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitulo}>Selecione o bairro</Text>
            <TouchableOpacity onPress={() => setModalBairroEdit(false)}>
              <Ionicons name="close" size={22} color={colors.textMid} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={OPCOES_BAIRRO}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.modalItem, bairroEditSel === item && s.modalItemAtivo]}
                onPress={() => { setBairroEditSel(item); if (item !== OPCAO_OUTRO) setBairroEditOutro(''); setModalBairroEdit(false); }}
              >
                <Text style={[s.modalItemTexto, bairroEditSel === item && s.modalItemTextoAtivo]}>{item}</Text>
                {bairroEditSel === item && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Modal select de raça para edição */}
      <Modal
        visible={modalRacaEdit}
        transparent
        animationType="slide"
        onRequestClose={() => setModalRacaEdit(false)}
      >
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalRacaEdit(false)} />
        <View style={s.modalSheet}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitulo}>Selecione a raça</Text>
            <TouchableOpacity onPress={() => setModalRacaEdit(false)}>
              <Ionicons name="close" size={22} color={colors.textMid} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={RACAS[formEdit.especie] ?? [SEM_RACA]}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.modalItem, racaEditSel === item && s.modalItemAtivo]}
                onPress={() => { setRacaEditSel(item); setModalRacaEdit(false); }}
              >
                <Text style={[s.modalItemTexto, racaEditSel === item && s.modalItemTextoAtivo]}>{item}</Text>
                {racaEditSel === item && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  fotoContainer: {
    position: 'relative',
  },
  foto: {
    width: '100%',
    height: 300,
  },
  fotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotAtivo: {
    backgroundColor: '#fff',
    width: 18,
  },
  btnVoltar: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  statusBadge: {
    position: 'absolute',
    top: 48,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgePerdido: {
    backgroundColor: colors.dangerLight,
  },
  badgeEncontrado: {
    backgroundColor: colors.successLight,
  },
  statusTexto: {
    fontSize: 12,
    ...font.bold,
  },
  conteudo: {
    padding: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nome: {
    fontSize: 28,
    ...font.black,
    color: colors.textDark,
  },
  nomeDono: {
    fontSize: 13,
    color: colors.textLight,
    ...font.medium,
    marginTop: 2,
  },
  especieTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  especieTexto: {
    fontSize: 13,
    color: colors.primary,
    ...font.bold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    width: '47%',
    ...shadow.card,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
    letterSpacing: 0.5,
  },
  infoValor: {
    fontSize: 14,
    color: colors.textDark,
    ...font.bold,
    marginTop: 2,
  },
  descricaoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  descricaoTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
    marginBottom: 6,
  },
  descricaoTexto: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 21,
  },
  similaresSecao: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  similaresTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
  },
  similarCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  similarFoto: {
    width: 120,
    height: 90,
  },
  similarFotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarInfo: {
    padding: 8,
    gap: 2,
  },
  similarNome: {
    fontSize: 12,
    ...font.bold,
    color: colors.textDark,
  },
  similarBairro: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
  },
  rodape: {
    padding: 16,
    paddingBottom: 32,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  btnEncontrado: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.success,
    borderRadius: radius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnEncontradoTexto: {
    color: '#fff',
    fontSize: 15,
    ...font.bold,
  },
  btnAvist: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  btnAvistTexto: {
    fontSize: 15,
    color: colors.primary,
    ...font.bold,
  },
  avistSecao: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  avistTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
    marginBottom: 12,
  },
  avistItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  avistLinha: {
    alignItems: 'center',
    width: 16,
  },
  avistDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
  avistConector: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: -4,
  },
  avistConteudo: {
    flex: 1,
    paddingBottom: 16,
  },
  avistCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  avistLocal: {
    fontSize: 13,
    ...font.bold,
    color: colors.textDark,
    flex: 1,
  },
  avistData: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
  },
  avistDesc: {
    fontSize: 13,
    color: colors.textMid,
    lineHeight: 18,
    marginBottom: 4,
  },
  btnAnexos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  btnAnexosTexto: {
    fontSize: 12,
    color: colors.primary,
    ...font.bold,
  },
  anexosOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  anexosBtnFechar: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },
  anexoImagem: {
    width: SCREEN_WIDTH - 48,
    height: SCREEN_WIDTH - 48,
    borderRadius: radius.lg,
  },
  anexosDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  anexosContador: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 8,
    ...font.medium,
  },
  avistUsuario: {
    fontSize: 11,
    color: colors.textLight,
    ...font.medium,
    fontStyle: 'italic',
  },
  fotosAvistRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  fotoAvistThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  fotoEditOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoEditCheck: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    padding: 2,
  },
  fotoAvistLixeira: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.full,
    padding: 4,
  },
  fotoAvistAdd: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '75%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemAtivo: {
    backgroundColor: colors.primaryLight,
  },
  modalItemTexto: {
    fontSize: 14,
    color: colors.textDark,
  },
  modalItemTextoAtivo: {
    color: colors.primary,
    ...font.bold,
  },
  btnAcoes: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoesSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: 32,
    paddingTop: 8,
  },
  acaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  acaoTexto: {
    fontSize: 15,
    color: colors.textDark,
    ...font.medium,
  },
  acaoDivisor: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  editContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  editTitulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
  },
  editForm: {
    padding: 20,
    paddingBottom: 40,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipEspecie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipEspecieAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipEspecieTexto: {
    fontSize: 13,
    color: colors.textMid,
    ...font.medium,
  },
  formLabel: {
    fontSize: 11,
    color: colors.textMid,
    ...font.bold,
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textDark,
    backgroundColor: colors.background,
  },
  formSelect: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  formSelectTexto: {
    fontSize: 14,
    color: colors.textDark,
  },
  formSelectPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
});
