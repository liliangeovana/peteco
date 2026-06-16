import {
  View, Text, Image, ImageBackground, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, useWindowDimensions, Dimensions,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../constants/bairros';
import { RACAS, SEM_RACA } from '../../constants/racas';
import useDetalhePetController from '../../modules/pet/controller/useDetalhePetController';
import useCompartilharController from '../../modules/pet/controller/useCompartilharController';
import PostSocialModal from '../../modules/pet/components/PostSocialModal';
import DatePickerField from '../../shared/components/DatePickerField';
import SelectModal from '../../shared/components/SelectModal';
import LoadingCentro from '../../shared/components/LoadingCentro';
import { useMascaraTelefone } from '../../shared/hooks/useMascaraTelefone';
import { useFormatarData } from '../../shared/hooks/useFormatarData';

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

export default function DetalhePet() {
  const { id }   = useLocalSearchParams();
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const { mascaraTelefone } = useMascaraTelefone();
  const { isoParaPtBR }     = useFormatarData();
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
  const [modalPost, setModalPost]             = useState(false);

  const {
    template, setTemplate,
    campos, toggleCampo,
    overrides, atualizarOverride,
    contatoNomes, atualizarContatoNome,
    contatoAvulso, atualizarContatoAvulso,
    contatosExtras, adicionarContatoExtra, removerContatoExtra, atualizarContatoExtra,
    ocultarInstaNoPost, setOcultarInstaNoPost,
    inicializarComPet,
    gerando, gerarECompartilhar,
    shotRef,
  } = useCompartilharController();

  const {
    pet, loading, usuario, salvando,
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
    contatoEditAtivado, setContatoEditAtivado,
    contatosEdit, adicionarContatoEdit, removerContatoEdit, atualizarContatoEdit,
  } = useDetalhePetController(id, () => router.back());

  if (loading) return <LoadingCentro />;

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
          <TouchableOpacity style={s.btnVoltar} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/feed')}>
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
                  style={s.btnShare}
                  onPress={() => setModalPost(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-social-outline" size={17} color={colors.primary} />
                </TouchableOpacity>
              )}
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
            {pet.recompensa && (
              <View style={[s.infoCard, { backgroundColor: '#FFF7E6', borderWidth: 1, borderColor: '#F59E0B' }]}>
                <Ionicons name="gift-outline" size={18} color="#F59E0B" style={{ marginBottom: 4 }} />
                <Text style={[s.infoLabel, { color: '#92400E' }]}>Recompensa</Text>
                <Text style={[s.infoValor, { color: '#92400E' }]}>
                  {pet.valor_recompensa ? `R$ ${pet.valor_recompensa}` : 'Sim'}
                </Text>
              </View>
            )}
          </View>

          {/* Descrição */}
          {pet.descricao ? (
            <View style={s.descricaoCard}>
              <Text style={s.descricaoTitulo}>Descrição</Text>
              <Text style={s.descricaoTexto}>{pet.descricao}</Text>
            </View>
          ) : null}

          {/* Contatos */}
          {(() => {
            let contatosData = [];
            try { contatosData = JSON.parse(pet.contatos || '[]'); if (!Array.isArray(contatosData)) contatosData = []; } catch {}
            if (contatosData.length === 0) return null;
            return (
              <View style={s.contatosCard}>
                <Text style={s.contatosTitulo}>Entre em contato</Text>
                {contatosData.map((c, idx) => (
                  <View key={idx} style={s.contatoItem}>
                    <View style={[s.contatoIcone,
                      c.tipo === 'whatsapp' ? { backgroundColor: '#dcfce7' }
                      : c.tipo === 'instagram' ? { backgroundColor: '#fce7f3' }
                      : { backgroundColor: colors.primaryLight }
                    ]}>
                      {c.tipo === 'whatsapp'
                        ? <Ionicons name="logo-whatsapp" size={18} color="#16a34a" />
                        : c.tipo === 'instagram'
                        ? <Ionicons name="logo-instagram" size={18} color="#db2777" />
                        : <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                      }
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.contatoTipoLabel}>
                        {c.tipo === 'whatsapp' ? 'WhatsApp' : c.tipo === 'instagram' ? 'Instagram' : 'Contato'}
                      </Text>
                      <Text style={s.contatoValorTexto}>{c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor}</Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })()}

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

      <PostSocialModal
        visible={modalPost}
        onClose={() => setModalPost(false)}
        pet={pet}
        shotRef={shotRef}
        template={template}
        setTemplate={setTemplate}
        campos={campos}
        toggleCampo={toggleCampo}
        overrides={overrides}
        atualizarOverride={atualizarOverride}
        contatoNomes={contatoNomes}
        atualizarContatoNome={atualizarContatoNome}
        contatoAvulso={contatoAvulso}
        atualizarContatoAvulso={atualizarContatoAvulso}
        contatosExtras={contatosExtras}
        adicionarContatoExtra={adicionarContatoExtra}
        removerContatoExtra={removerContatoExtra}
        atualizarContatoExtra={atualizarContatoExtra}
        ocultarInstaNoPost={ocultarInstaNoPost}
        setOcultarInstaNoPost={setOcultarInstaNoPost}
        inicializarComPet={inicializarComPet}
        gerando={gerando}
        onGerar={gerarECompartilhar}
      />

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
          style={{ flex: 1, justifyContent: 'flex-end' }}
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

      <SelectModal
        visible={modalBairro}
        title="Selecione o bairro"
        data={OPCOES_BAIRRO}
        value={bairroAvistSel}
        onSelect={item => {
          setBairroAvistSel(item);
          if (item !== OPCAO_OUTRO) setBairroAvistOutro('');
          setModalBairro(false);
        }}
        onClose={() => setModalBairro(false)}
      />

      {/* Popover de ações do dono */}
      {modalAcoes && (
        <>
          <TouchableOpacity
            style={s.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalAcoes(false)}
          />
          <View style={s.popover}>
            <TouchableOpacity
              style={s.acaoItem}
              onPress={() => { setModalAcoes(false); iniciarEditar(); setModalEditar(true); }}
              activeOpacity={0.75}
            >
              <Ionicons name="create-outline" size={18} color={colors.textDark} />
              <Text style={s.acaoTexto}>Editar informações</Text>
            </TouchableOpacity>
            <View style={s.acaoDivisor} />
            <TouchableOpacity
              style={s.acaoItem}
              onPress={() => { setModalAcoes(false); confirmarExcluir(); }}
              activeOpacity={0.75}
              disabled={excluindo}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[s.acaoTexto, { color: colors.danger }]}>
                {excluindo ? 'Excluindo...' : 'Excluir pet'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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

            {/* Contatos */}
            <Text style={[s.formLabel, { marginTop: 14 }]}>Contato para quem encontrar</Text>
            <View style={s.editContatoToggle}>
              {[{ valor: false, label: 'Não' }, { valor: true, label: 'Sim' }].map(({ valor, label }) => {
                const ativo = contatoEditAtivado === valor;
                return (
                  <TouchableOpacity
                    key={String(valor)}
                    style={[s.chipEspecie, ativo && s.chipEspecieAtivo]}
                    onPress={() => setContatoEditAtivado(valor)}
                  >
                    <Text style={[s.chipEspecieTexto, ativo && { color: '#fff' }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {contatoEditAtivado && (
              <>
                {contatosEdit.map((c, idx) => (
                  <View key={idx} style={[s.editContatoRow, { marginTop: 10 }]}>
                    <View style={s.editContatoTipos}>
                      {[
                        { tipo: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp' },
                        { tipo: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
                        { tipo: 'outro', label: 'Outro', icon: 'ellipsis-horizontal' },
                      ].map(({ tipo, label, icon }) => {
                        const ativo = c.tipo === tipo;
                        return (
                          <TouchableOpacity
                            key={tipo}
                            style={[s.editContatoChip, ativo && s.editContatoChipAtivo]}
                            onPress={() => atualizarContatoEdit(idx, 'tipo', tipo)}
                          >
                            <Ionicons name={icon} size={13} color={ativo ? '#fff' : colors.textMid} />
                            <Text style={[s.editContatoChipTexto, ativo && { color: '#fff' }]}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <TextInput
                        style={[s.formInput, { flex: 1 }]}
                        value={c.valor}
                        onChangeText={v => atualizarContatoEdit(idx, 'valor', c.tipo === 'whatsapp' ? mascaraTelefone(v) : v)}
                        placeholder={
                          c.tipo === 'whatsapp' ? 'Ex: 95 99999-9999'
                          : c.tipo === 'instagram' ? 'Ex: @perfil'
                          : 'Descreva o contato'
                        }
                        placeholderTextColor={colors.textLight}
                        keyboardType={c.tipo === 'whatsapp' ? 'phone-pad' : 'default'}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity onPress={() => removerContatoEdit(idx)} style={{ padding: 8 }}>
                        <Ionicons name="trash-outline" size={16} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, alignSelf: 'flex-start' }}
                  onPress={adicionarContatoEdit}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                  <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>Adicionar contato</Text>
                </TouchableOpacity>
              </>
            )}

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

      <SelectModal
        visible={modalBairroEdit}
        title="Selecione o bairro"
        data={OPCOES_BAIRRO}
        value={bairroEditSel}
        onSelect={item => { setBairroEditSel(item); if (item !== OPCAO_OUTRO) setBairroEditOutro(''); setModalBairroEdit(false); }}
        onClose={() => setModalBairroEdit(false)}
      />

      <SelectModal
        visible={modalRacaEdit}
        title="Selecione a raça"
        data={RACAS[formEdit.especie] ?? [SEM_RACA]}
        value={racaEditSel}
        onSelect={item => { setRacaEditSel(item); setModalRacaEdit(false); }}
        onClose={() => setModalRacaEdit(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
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
  contatosCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    ...shadow.card,
  },
  contatosTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
    marginBottom: 2,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contatoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contatoTipoLabel: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
    letterSpacing: 0.5,
  },
  contatoValorTexto: {
    fontSize: 14,
    color: colors.textDark,
    ...font.bold,
    marginTop: 1,
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
  btnShare: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popover: {
    position: 'absolute',
    top: 310,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  acaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
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
  editContatoToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  editContatoRow: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editContatoTipos: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  editContatoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.background,
  },
  editContatoChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  editContatoChipTexto: {
    fontSize: 11,
    color: colors.textMid,
    ...font.medium,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
  },
  btnPost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 11,
    marginTop: 8,
    backgroundColor: colors.primaryLight,
  },
  btnPostTexto: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
  },
});
