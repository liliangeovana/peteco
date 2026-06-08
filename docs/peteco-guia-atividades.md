# PETECO — Guia de Atividades do Projeto Final 2026
## DAMU + DAW · Prof. George Oliveira · IFRR

---

## Semana 1 — Definição do Projeto

### Nomes dos Integrantes da Equipe

> Preencher com os nomes completos dos membros da equipe.

---

### Tema

**Tema central:** Plataforma de monitoramento e reencontro de animais domésticos perdidos com geolocalização e inteligência artificial.

**Por que é relevante?**
O desaparecimento de animais domésticos é um problema recorrente e emocionalmente impactante para famílias brasileiras. Em cidades de médio porte como Boa Vista — RR, não existe nenhuma solução centralizada, georreferenciada e inteligente para esse problema. As alternativas atuais — grupos de WhatsApp, cartazes físicos e publicações em redes sociais — são fragmentadas, não estruturam dados e não permitem identificar padrões geográficos de desaparecimento. O PETECO resolve isso combinando cadastro georreferenciado, mapas interativos e análise por IA.

---

### Problemática

**Qual problema a aplicação busca resolver?**
O PETECO resolve a ausência de uma plataforma centralizada, georreferenciada e inteligente para o cadastro e monitoramento de animais domésticos perdidos em Boa Vista — RR. Atualmente, tutores recorrem a métodos fragmentados como grupos de WhatsApp, cartazes físicos e publicações em redes sociais, sem qualquer estruturação de dados ou análise de padrões. O sistema permite o registro de ocorrências com coordenadas GPS precisas (obtidas via CEP oficial pela BrasilAPI), visualização em mapa interativo, geração de heatmaps de densidade e aplicação do algoritmo DBSCAN para identificar automaticamente regiões críticas da cidade onde desaparecimentos se concentram.

**Quem é o público-alvo?**
O público-alvo principal são tutores de animais domésticos residentes em Boa Vista — RR, com perfil predominantemente jovem-adulto (18 a 45 anos), habituados a smartphones e aplicativos móveis. Sua principal necessidade no momento de um desaparecimento é velocidade e precisão na divulgação da informação. Um segundo público relevante são agentes municipais, ONGs de proteção animal e voluntários de resgate, que se beneficiam especialmente do dashboard analítico e dos mapas de calor para identificar onde concentrar esforços de busca.

**Como essa problemática impacta a sociedade?**
O impacto é simultâneo em três dimensões. Na dimensão social, o desaparecimento de um pet gera sofrimento emocional real para as famílias e frequentemente resulta em animais soltos nas ruas, aumentando a população de errantes urbanos. Na dimensão da saúde pública, animais sem identificação contribuem para riscos de zoonoses e acidentes de trânsito. Na dimensão tecnológica e acadêmica, o problema demonstra como técnicas de IA aplicadas a dados georreferenciados — normalmente associadas a logística e segurança pública — podem ser adaptadas para resolver questões do cotidiano com impacto humano direto e mensurável.

---

### Descrição da Proposta

**Ideia principal:**
O PETECO é uma plataforma composta por um aplicativo mobile (para tutores cadastrarem pets perdidos com validação por IA) e um painel web B2G (para gestores municipais e ONGs visualizarem dados analíticos — mapas de calor, clusters geográficos e estatísticas). Os dois sistemas compartilham a mesma base de dados georreferenciada e se comunicam por uma API REST centralizada.

**Como resolve a problemática:**
- Centraliza ocorrências em um único sistema com coordenadas GPS precisas
- Exibe ocorrências em mapa interativo com pins e heatmap de densidade
- Aplica o algoritmo DBSCAN para identificar automaticamente zonas críticas
- Painel web B2G com heatmap, clusters DBSCAN e estatísticas analíticas
- Permite busca por CEP para preenchimento automático de bairro e cidade

**Funcionalidades essenciais:**
- Cadastro e login de usuários
- Cadastro de pet perdido com foto, localização GPS e CEP
- Validação automática da foto por IA (é animal? tem conteúdo sensível?)
- Busca de pets similares ao cadastrar (Groq Vision)
- Feed de pets perdidos com filtros
- Mapa com pins georreferenciados
- Painel B2G com heatmap, clusters DBSCAN e dashboard analítico

---

### Tecnologias Envolvidas

**Campo de IA utilizado:** Análise de dados (clustering) + Detecção e segurança (moderação de imagem) + Recomendação com base em histórico (pets similares)

**Como a aplicação contribui para o campo:**
O PETECO utiliza IA em três camadas complementares:

**1. Validação de imagem (Groq API (Llama 3.2 Vision))** — ao fazer upload da foto do pet, a IA verifica se a imagem contém de fato um animal doméstico e se não há conteúdo sensível (ferimentos graves, conteúdo impróprio). Isso garante a integridade dos dados cadastrados e a segurança da plataforma.

**2. Recomendação de pets similares (Groq API (Llama 3.2 Vision))** — ao cadastrar um pet perdido, a IA compara a foto e os dados textuais (espécie, raça, cor) com pets já cadastrados no sistema e retorna uma lista ordenada por similaridade (score 0-10 com justificativa). Isso evita duplicidade de cadastros e aumenta as chances de reencontro. A mesma funcionalidade aparece no detalhe de cada pet.

**3. Clustering geográfico (DBSCAN via Scikit-learn)** — no painel web B2G, o algoritmo DBSCAN analisa a distribuição espacial das ocorrências e identifica automaticamente agrupamentos geográficos de alto risco. Os resultados alimentam o mapa de calor, os clusters e o dashboard analítico, transformando dados brutos em informação estratégica para gestores municipais e ONGs.

---

## Semana 2 — Detalhamento Web e Mobile

### Aplicativo Mobile

**1. Fluxo do usuário:**

```
Splash Screen
    ↓
Login / Cadastro
    ↓
Feed de pets perdidos (tela principal)
    ↓ (tab bar)
┌─────────────────────────────────────┐
│  Feed │ Mapa │ Cadastrar │ Meus Pets │ Perfil  │
└─────────────────────────────────────┘
    ↓ (ao tocar num pet)
Detalhe do Pet → "Encontrei este pet!"
    ↓ (ao cadastrar)
Cadastrar Pet (câmera + GPS + CEP)
```

**2. As 10 telas essenciais:**

| # | Tela | Propósito | Elementos principais |
|---|------|-----------|----------------------|
| 1 | Splash / Onboarding | Apresentar o app e redirecionar para login ou cadastro | Logo, headline, botões "Começar" e "Já tenho conta" |
| 2 | Login | Autenticar usuário existente | Campos email/senha, botão entrar, link para cadastro |
| 3 | Cadastro de usuário | Criar nova conta | Campos nome, email, telefone, senha e confirmação |
| 4 | Feed de pets | Tela principal — lista de ocorrências próximas | FlatList com cards, filtro por espécie, busca |
| 5 | Detalhe do pet | Exibir informações completas de uma ocorrência | Foto, chips de raça/idade/sexo, descrição, botões de contato e "Encontrei!" |
| 6 | Cadastrar pet | Registrar novo pet perdido | Câmera, campos nome/espécie/raça/cor, campo CEP com busca automática, GPS |
| 7 | Mapa de ocorrências | Visualização geográfica dos pets perdidos | Mapa com pins, toggle heatmap/pins, sheet inferior com lista próximos |
| 8 | Busca e filtros | Encontrar pets por características | Campo de busca, chips de filtro (espécie, status), lista de resultados |
| 9 | Meus pets | Gerenciar pets cadastrados pelo usuário logado | Lista de pets do usuário, botão "Marcar como encontrado", editar |
| 10 | Perfil | Visualizar e editar dados do usuário | Avatar, nome, email, estatísticas, edição de telefone e senha, logout |

**3. Principais ações do usuário:**
- Cadastrar pet perdido com foto, localização e CEP
- Marcar pet como encontrado
- Visualizar ocorrências no mapa
- Filtrar pets por espécie, cidade ou status
- Contatar o dono do pet via WhatsApp ou ligação
- Editar dados do próprio perfil

**4. MVP (Mínimo Produto Viável):**
- Login e cadastro de usuário
- Cadastro de pet perdido com GPS e CEP
- Feed com lista de pets
- Mapa com pins georreferenciados
- Marcar pet como encontrado

**5. Relação com a problemática:**
O app mobile é o ponto de entrada do dado — sem ele, não há ocorrências para analisar. A captura de localização via GPS e a obtenção do bairro/cidade via CEP (BrasilAPI) garantem que cada registro tenha coordenadas precisas e padronizadas, base para o heatmap e o DBSCAN no dashboard web.

---

### Sistema Web

**1. Papel do sistema web:**
O sistema web é o painel analítico **B2G (Business to Government)** do PETECO. É utilizado por gestores municipais (prefeitura, vigilância sanitária), agentes públicos e ONGs de proteção animal para visualizar a distribuição geográfica das ocorrências, identificar zonas críticas e tomar decisões baseadas em dados. O foco não é no cadastro (responsabilidade do mobile), mas na **transformação dos dados em informação estratégica**: mapas de calor, clusters geográficos, estatísticas por bairro, período e espécie.

**2. As 10 telas essenciais:**

| # | Rota | Tela | Propósito | Elementos principais |
|---|------|------|-----------|----------------------|
| 1 | `/login` | Login | Autenticar usuário no sistema web | Formulário email/senha, opções de login social |
| 2 | `/cadastro` | Cadastro de pet | Registrar pet perdido pelo web | Formulário completo com CEP automático |
| 3 | `/` | Mapa com pins | Visualizar ocorrências no mapa | Leaflet, painel filtros, popup nos pins, legenda |
| 4 | `/heatmap` | Heatmap | Visualizar densidade geográfica | Mapa de calor (KDE), legenda de intensidade |
| 5 | `/clusters` | Clusters DBSCAN | Agrupamentos identificados pela IA | Círculos por criticidade, parâmetros do algoritmo |
| 6 | `/dashboard` | Dashboard B2G | Painel analítico para gestores e ONGs | Tiles de totais, gráfico por bairro, por período |
| 7 | `/analise` | Análise de dados | Estatísticas numéricas detalhadas | Tabelas, gráficos por espécie/cidade, sem narrativa IA |
| 8 | `/pets` | Lista de pets | Tabela HTML de todas as ocorrências | Tabela com filtros, paginação, badges de status |
| 9 | `/perfil` | Perfil | Dados do usuário logado | Avatar, estatísticas, links de edição |
| 10 | `/perfil/editar` | Editar perfil | Editar dados pessoais e senha | Formulário com sessão ativa |

**3. Principais ações do administrador/usuário gerencial:**
- Visualizar mapa de ocorrências com filtros por espécie, status e período
- Alternar entre visualização de pins e heatmap
- Consultar clusters geográficos identificados pelo DBSCAN
- Consultar estatísticas numéricas por bairro, espécie e período
- Filtrar e exportar tabela de pets perdidos
- Acompanhar indicadores de zonas críticas por criticidade

**4. MVP web:**
- Login com sessão persistente
- Mapa com pins georreferenciados
- Heatmap de densidade
- Dashboard B2G com estatísticas por bairro
- Clusters DBSCAN funcionando

**5. Relação com a problemática:**
O painel B2G transforma dados brutos do mobile em informação estratégica. O heatmap e os clusters permitem que gestores municipais identifiquem zonas de risco sem precisar analisar cada ocorrência individualmente. A tela de análise de dados fornece estatísticas por bairro, espécie e período que podem embasar políticas públicas de controle de animais errantes e ações preventivas — algo impossível com os métodos tradicionais de divulgação em grupos de WhatsApp.

---

### API e Dados

**1. Dados compartilhados entre mobile e web:**

| Entidade | Atributos-chave |
|----------|----------------|
| `perfis` | id, nome, telefone, criado_em |
| `pets_perdidos` | id, usuario_id, nome, especie, raca, cor, descricao, foto_url, localizacao (PostGIS), lat, lng, bairro, cidade, status, data_perda |
| `clusters_ia` | id, gerado_em, algoritmo, parametros, total_clusters, total_ruido, resultado (JSONB) |

**2. Arquitetura da API:**
Uma única API REST centralizada (Node.js + Express) serve tanto o app mobile quanto o sistema web. Não há APIs distintas — ambos consomem os mesmos endpoints com os mesmos padrões de resposta. A autenticação é dual: o frontend web usa **cookie de sessão** (`express-session`) e o app mobile usa **Bearer Token JWT** (Supabase Auth). O microsserviço de IA (Python Flask) é interno — chamado apenas pelo Node, nunca diretamente pelo frontend.

```
Mobile ──────┐
             ├──► API Node.js + Express ──► Supabase (PostgreSQL + PostGIS)
Web ─────────┘         │
                       └──► Microsserviço Python (DBSCAN)
```

---

## Semana 3 — Implementação das Funcionalidades

### Telas Implementadas — Aplicativo Mobile

---

**Tela 1: Splash / Onboarding**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Fundo bege (#F7F3EE), emoji de animal em destaque, tag de localização (Boa Vista · RR), headline em tipografia bold, subtítulo descritivo, botão primário verde e botão secundário com borda
- **Ações do usuário:** Navegar para "Cadastro" ou "Login"
- **Objetivo:** Apresentar o PETECO, contextualizar a proposta e direcionar o usuário para o fluxo de autenticação

---

**Tela 2: Login**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde com logo, campos de email e senha, link "Esqueci a senha", botão entrar, divider com opções sociais, link para cadastro
- **Ações do usuário:** Preencher credenciais e fazer login, acessar cadastro, recuperar senha
- **Objetivo:** Autenticar o usuário e criar sessão persistente via Supabase Auth

---

**Tela 3: Cadastro de Usuário**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde, seletor de avatar, campos nome, sobrenome, email, telefone e senha
- **Ações do usuário:** Preencher dados, criar conta, aceitar termos
- **Objetivo:** Criar nova conta e perfil no sistema

---

**Tela 4: Feed de Pets**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Saudação personalizada, barra de busca, chips de filtro por espécie, grid de cards com foto, nome, raça, distância e badge de status
- **Ações do usuário:** Buscar pets, filtrar por espécie, tocar em card para ver detalhe, puxar para atualizar (pull to refresh)
- **Objetivo:** Exibir lista de ocorrências próximas ao usuário — tela principal do app

---

**Tela 5: Detalhe do Pet**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Foto em destaque, botões voltar e favoritar, nome e badge de status, localização e distância, chips coloridos (sexo, idade, raça), descrição textual, botões de ação, seção "Pode ser o mesmo pet?" com cards de similares identificados pela IA
- **Ações do usuário:** Ver informações completas, ligar, enviar mensagem WhatsApp, marcar como encontrado, tocar em pet similar para ver seu detalhe
- **Objetivo:** Fornecer todas as informações necessárias para identificação e contato, além de cruzar com pets similares para aumentar as chances de reencontro

---

**Tela 6: Cadastrar Pet**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde, área de upload de foto, campos nome/espécie/raça/cor/sexo, campo CEP com botão "Buscar" e resultado automático (bairro + cidade + UF), campo de descrição
- **Ações do usuário:** Tirar ou selecionar foto → IA valida automaticamente (é animal? tem conteúdo sensível?) → se aprovada, IA busca pets similares já cadastrados → usuário confirma se é o mesmo ou prossegue com novo cadastro
- **Objetivo:** Registrar novo pet perdido com dados completos, localização precisa e validação por IA para garantir integridade dos dados

---

**Tela 7: Mapa de Ocorrências**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Mapa com pins vermelhos (perdidos) e verdes (encontrados), clusters em amber, toggle Pins/Heatmap, popup com nome e bairro do pet, bottom sheet com lista dos pets próximos
- **Ações do usuário:** Visualizar ocorrências no mapa, alternar entre pins e heatmap, tocar em pin para ver popup, selecionar pet na lista inferior
- **Objetivo:** Oferecer visualização geográfica das ocorrências para facilitar buscas presenciais

---

**Tela 8: Busca e Filtros**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Campo de busca ativo, chips de filtro (Todos, Cachorros, Gatos, Perdidos, Encontrados), lista de resultados com distância e badge
- **Ações do usuário:** Digitar busca por nome ou raça, selecionar filtros combinados, tocar em resultado para ver detalhe
- **Objetivo:** Permitir busca rápida e filtrada por características específicas do pet

---

**Tela 9: Meus Pets**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header com botão de adicionar, tabs "Ativos" e "Encontrados", cards com foto, nome, raça, bairro e data de cadastro, botões "Editar" e "Marcar como encontrado"
- **Ações do usuário:** Visualizar pets cadastrados, marcar como encontrado, editar dados de um pet
- **Objetivo:** Gerenciar as ocorrências registradas pelo próprio usuário

---

**Tela 10: Perfil**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde com avatar, nome e email, estatísticas (cadastrados, encontrados, dias ativo), seções "Minha conta" e "Notificações" com itens de lista, botão de logout
- **Ações do usuário:** Editar perfil, alterar telefone, mudar senha, configurar notificações, sair da conta
- **Objetivo:** Centralizar dados pessoais e configurações do usuário

---

### Telas Implementadas — Sistema Web

---

**Tela 1: Login Web**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Layout duas colunas — esquerda com hero verde e estatísticas do sistema, direita com formulário email/senha, opções de login social, link para cadastro
- **Ações do usuário:** Fazer login com email/senha ou Google/Facebook
- **Objetivo:** Autenticar o usuário e criar sessão com cookie (`express-session`)

---

**Tela 2: Cadastro de Pet (Web)**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Formulário em grid de duas colunas, área de upload de foto, campos completos do pet, campo CEP com busca automática (BrasilAPI), textarea de descrição
- **Ações do usuário:** Preencher dados, buscar endereço por CEP, enviar cadastro
- **Objetivo:** Permitir cadastro de pet perdido pelo sistema web

---

**Tela 3: Mapa com Pins**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Mapa Leaflet em tela cheia (OpenStreetMap), painel lateral com filtros (espécie, status, período, visualização), alerta de zona crítica, popup nos pins, legenda de cores
- **Ações do usuário:** Filtrar ocorrências, alternar pins/heatmap, clicar em pins para ver detalhes
- **Objetivo:** Visualização geográfica principal de todas as ocorrências

---

**Tela 4: Heatmap**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Mapa com camada de calor (leaflet.heat), gradiente azul→verde→laranja→vermelho, legenda de densidade, painel lateral com período e nota explicativa sobre KDE
- **Ações do usuário:** Filtrar por período e espécie, alternar visualizações
- **Objetivo:** Visualizar densidade de ocorrências por região — identifica visualmente as zonas mais afetadas

---

**Tela 5: Clusters DBSCAN**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Mapa com círculos coloridos por criticidade (vermelho=alta, amber=média, verde=baixa), painel lateral com lista de clusters e parâmetros do algoritmo
- **Ações do usuário:** Visualizar clusters no mapa, consultar parâmetros usados (eps, min_samples)
- **Objetivo:** Exibir resultado do algoritmo DBSCAN — agrupamentos geográficos identificados automaticamente pela IA

---

**Tela 6: Dashboard B2G**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Sidebar de navegação, 4 tiles de estatísticas (perdidos, encontrados, clusters, usuários ativos), gráfico de barras por bairro, gráfico de linha por período, tabela de zonas críticas por criticidade
- **Ações do usuário:** Navegar entre seções, filtrar por período, exportar dados
- **Objetivo:** Painel analítico voltado a gestores municipais e ONGs — transforma ocorrências cadastradas no mobile em informação estratégica para tomada de decisão

---

**Tela 7: Análise de Dados**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Tabelas e gráficos com estatísticas numéricas — ocorrências por bairro, por espécie, por período, taxa de retorno, total de clusters por criticidade
- **Ações do usuário:** Filtrar por período, cidade e espécie, consultar dados numéricos dos clusters DBSCAN
- **Objetivo:** Painel de dados puros sem narrativa gerada por IA — os números falam por si para gestores e analistas

---

**Tela 8: Lista de Pets**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header com título e botão "Cadastrar pet", barra de filtros (busca, espécie, status, cidade), tabela HTML com avatar, nome, raça, bairro, cidade, data e badge de status, paginação
- **Ações do usuário:** Buscar pets, filtrar por múltiplos critérios, visualizar detalhes, paginar resultados
- **Objetivo:** Gestão tabular completa de todas as ocorrências — cobre item 2 do edital DAW (tabelas HTML + formulários)

---

**Tela 9: Perfil**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde com avatar e estatísticas, seções "Minha conta" e "Notificações" com itens de lista, toggle de alertas
- **Ações do usuário:** Navegar para edição, configurar notificações
- **Objetivo:** Exibir dados do usuário logado via sessão ativa

---

**Tela 10: Editar Perfil**

> *[Inserir print da tela aqui]*

- **Elementos visuais:** Header verde com dados do usuário, formulário com campos nome, sobrenome, telefone, nova senha e confirmação, botões salvar e cancelar, feedback de sucesso/erro
- **Ações do usuário:** Editar nome, telefone e senha, salvar alterações via API autenticada
- **Objetivo:** Permitir atualização de dados pessoais — demonstra sessão ativa (item 6 do edital DAW)

---

### Acesso para Usuários Não Logados

**Mobile:** A tela de Splash, Login e Cadastro são acessíveis sem autenticação. O Feed de pets também pode ser visualizado sem login (leitura pública configurada via RLS no Supabase), porém o cadastro de pets e o acesso ao perfil exigem autenticação.

**Web:** A tela de Login e a página inicial (Home) são públicas. O mapa de ocorrências é de leitura pública — qualquer pessoa pode visualizar os pets perdidos sem precisar de conta. As demais telas (dashboard, clusters, análise de dados, lista completa, perfil) exigem login.

Essa decisão é intencional: ampliar o alcance da informação sobre pets perdidos, sem exigir cadastro para quem apenas quer consultar.

---

### Ferramentas de Desenvolvimento

#### Frontend Mobile

| Biblioteca/Framework | Função | Documentação |
|----------------------|--------|-------------|
| **React Native** | Framework para desenvolvimento mobile multiplataforma (iOS e Android) com JavaScript | https://reactnative.dev |
| **Expo (SDK 54)** | Plataforma que simplifica o desenvolvimento React Native, eliminando configurações nativas | https://docs.expo.dev |
| **Expo Go** | App para testar o projeto em dispositivo físico via QR code, sem publicar na loja | https://expo.dev/go |
| **React Navigation** | Biblioteca de navegação entre telas (Stack Navigator + Bottom Tab Navigator) | https://reactnavigation.org |
| **expo-location** | Captura coordenadas GPS do dispositivo e realiza geocoding reverso | https://docs.expo.dev/versions/latest/sdk/location |
| **expo-image-picker** | Acesso à câmera e galeria para upload de fotos dos pets | https://docs.expo.dev/versions/latest/sdk/imagepicker |
| **@supabase/supabase-js** | Cliente oficial do Supabase para autenticação e acesso ao banco | https://supabase.com/docs/reference/javascript |
| **@react-native-async-storage** | Persistência da sessão do usuário entre fechamentos do app | https://react-native-async-storage.github.io |
| **axios** | Cliente HTTP para consumo da API REST | https://axios-http.com/docs/intro |

#### Frontend Web

| Biblioteca/Framework | Função | Documentação |
|----------------------|--------|-------------|
| **Vue 3** | Framework JavaScript progressivo para construção de interfaces reativas | https://vuejs.org |
| **Vite** | Bundler e servidor de desenvolvimento moderno e rápido | https://vitejs.dev |
| **Vue Router 4** | Roteamento oficial do Vue — gerencia as 10 páginas do dashboard | https://router.vuejs.org |
| **Tailwind CSS** | Framework CSS utility-first para estilização sem escrever CSS customizado | https://tailwindcss.com |
| **Leaflet.js** | Biblioteca open source para mapas interativos (OpenStreetMap, sem chave de API) | https://leafletjs.com |
| **@vue-leaflet/vue-leaflet** | Wrapper Vue 3 para o Leaflet | https://github.com/vue-leaflet/vue-leaflet |
| **leaflet.heat** | Plugin do Leaflet para geração de heatmaps (Estimativa de Densidade Kernel) | https://github.com/Leaflet/Leaflet.heat |
| **Chart.js + vue-chartjs** | Biblioteca de gráficos com wrapper oficial para Vue | https://www.chartjs.org / https://vue-chartjs.org |
| **axios** | Cliente HTTP para consumo da API REST | https://axios-http.com |
| **@supabase/supabase-js** | Cliente Supabase para autenticação no frontend web | https://supabase.com/docs/reference/javascript |

#### Backend (API)

| Biblioteca/Framework | Função | Documentação |
|----------------------|--------|-------------|
| **Node.js** | Ambiente de execução JavaScript no servidor | https://nodejs.org/docs |
| **Express.js** | Framework web para construção da API REST | https://expressjs.com |
| **express-session** | Gerenciamento de sessão com cookie no servidor (item 6 do edital DAW) | https://github.com/expressjs/session |
| **cookie-parser** | Leitura e parsing de cookies nas requisições | https://github.com/expressjs/cookie-parser |
| **cors** | Middleware para liberação de origens cruzadas (CORS) | https://github.com/expressjs/cors |
| **@supabase/supabase-js** | Cliente Supabase com chave service_role para acesso irrestrito ao banco | https://supabase.com/docs/reference/javascript |
| **axios** | Chamadas HTTP para o microsserviço de IA (Python Flask) | https://axios-http.com |
| **dotenv** | Carregamento de variáveis de ambiente do arquivo `.env` | https://github.com/motdotla/dotenv |
| **nodemon** | Reinício automático do servidor em desenvolvimento | https://nodemon.io |

#### Banco de Dados

| Ferramenta | Função | Documentação |
|------------|--------|-------------|
| **Supabase** | Plataforma BaaS com PostgreSQL gerenciado, autenticação JWT, storage e API automática | https://supabase.com/docs |
| **PostgreSQL 15** | Banco de dados relacional principal | https://www.postgresql.org/docs |
| **PostGIS** | Extensão geográfica do PostgreSQL — armazena e consulta coordenadas espaciais | https://postgis.net/documentation |

#### Inteligência Artificial

| Biblioteca/Framework | Função | Documentação |
|----------------------|--------|-------------|
| **Python 3** | Linguagem do microsserviço de IA geográfica | https://docs.python.org |
| **Flask** | Micro-framework web Python para expor os endpoints de clustering | https://flask.palletsprojects.com |
| **Scikit-learn** | Implementação do algoritmo DBSCAN para clustering geográfico | https://scikit-learn.org/stable/modules/clustering.html#dbscan |
| **NumPy** | Operações matriciais para processamento das coordenadas | https://numpy.org/doc |
| **Groq API (llama-3.2-11b-vision-preview)** | Modelo multimodal (imagem + texto) para validação de foto, detecção de conteúdo sensível e busca de pets similares. Free tier: 14.400 req/dia. | https://console.groq.com/docs/vision |

#### CEP e Endereço

| API | Função | Documentação |
|-----|--------|-------------|
| **BrasilAPI** | API primária para busca de endereço por CEP (base dos Correios, gratuita, sem chave) | https://brasilapi.com.br/docs |
| **ViaCEP** | API de fallback para busca de endereço por CEP | https://viacep.com.br |

---

## Semana 4 — Revisão e Entrega Final

### 1. Checklist de testes

- [ ] Cadastro de usuário (mobile e web)
- [ ] Login e logout (mobile e web)
- [ ] Sessão persistente após fechar e reabrir o app
- [ ] Validação de foto por IA (é animal? conteúdo sensível?)
- [ ] Busca de pets similares ao cadastrar (mobile)
- [ ] Pets similares no detalhe do pet (mobile e web)
- [ ] Cadastro de pet com foto, GPS e CEP
- [ ] Listagem de pets com filtros
- [ ] Marcar pet como encontrado
- [ ] Mapa com pins georreferenciados
- [ ] Heatmap de densidade
- [ ] Clusters DBSCAN com mapa
- [ ] Dashboard B2G com estatísticas
- [ ] Tela de análise de dados numéricos
- [ ] Proteção de rotas (401 sem autenticação)
- [ ] Responsividade do sistema web

### 2. Banner

Conteúdo sugerido para o banner:

- **Título:** PETECO — Plataforma de Monitoramento de Pets Perdidos
- **Integrantes:** *[preencher nomes]*
- **Tecnologias de IA:** (1) Groq Vision — validação de imagem e busca de pets similares · (2) DBSCAN (Scikit-learn) — clustering geográfico para identificação de zonas críticas
- **Problemática:** Ausência de plataforma centralizada e georreferenciada para monitoramento de animais domésticos perdidos em Boa Vista — RR
- **Solução:** App mobile para cadastro com validação por IA + Painel web B2G com heatmaps e clustering geográfico para gestores municipais e ONGs

### 3. Link e QR Code

> Após o deploy:
> - **Web:** `https://peteco.vercel.app`
> - **Backend:** `https://peteco-production.up.railway.app`
> - **IA:** `https://peteco-ia.up.railway.app`
> - **QR Code:** gerar em https://qr.io com o link da aplicação web

---

*Documento gerado para o projeto PETECO — IFRR · DAMU + DAW · Prof. George Oliveira · 2026*
