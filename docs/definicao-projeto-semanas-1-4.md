# Peteco — Definição do Projeto (Semanas 1 a 4)

---

## Semana 1 — Perguntas para a Definição do Projeto

### Nome dos Integrantes da Equipe

> **Atenção:** insira aqui os nomes completos de todos os integrantes.

| # | Nome Completo |
|---|---------------|
| 1 | *(nome completo)* |
| 2 | *(nome completo)* |
| 3 | *(nome completo)* |

---

### Tema

**Qual é o tema central?**

O tema central é o **rastreamento e recuperação de animais domésticos perdidos**, com foco em facilitar a comunicação entre tutores e a comunidade por meio de geolocalização e inteligência artificial para validação de imagens.

**Por que este tema é relevante?**

A perda de animais de estimação é um problema recorrente e emocionalmente devastador para famílias. Segundo estimativas do setor pet brasileiro, o mercado de animais de companhia movimenta mais de R$ 60 bilhões por ano e cresce continuamente, mas ainda há uma lacuna expressiva em soluções tecnológicas que conectem tutores, comunidade e dados de forma rápida e acessível. Atualmente, o processo de busca se resume a panfletos físicos, publicações esparsas em grupos de redes sociais e sites desatualizados, sem padronização, geolocalização precisa nem triagem inteligente de informações. O **Peteco** endereça exatamente essa lacuna, tornando o processo de reporte e busca de pets perdidos mais eficiente, centralizado e impulsionado por IA.

---

### Problemática

**Qual problema específico a aplicação busca resolver?**

Atualmente, quando um animal de estimação se perde, os tutores não dispõem de uma plataforma centralizada e inteligente para reportar o desaparecimento e mobilizar a comunidade próxima. O processo é fragmentado: publicações em grupos do WhatsApp/Facebook, impressão de cartazes e dependência de intermediários humanos sem nenhuma triagem automatizada. Isso gera:

- **Baixo alcance geográfico:** informações ficam presas em grupos fechados sem visibilidade na vizinhança exata onde o animal foi visto.
- **Falta de padronização:** reportes sem foto validada, localização precisa ou dados de contato claros dificultam a identificação.
- **Demora na resposta:** avistamentos da comunidade não chegam ao tutor de forma estruturada e notificada.

**Quem é o público-alvo?**

- **Tutores de animais domésticos** (cães, gatos e outros) que perderam seus pets e precisam de uma ferramenta ágil para publicar o alerta.
- **Cidadãos e voluntários** da comunidade local que avistam animais e desejam ajudar, mas precisam de uma forma estruturada de reportar.
- Perfil geral: adultos de 18 a 45 anos, com smartphone, residentes em centros urbanos e periferias.

**Impacto na sociedade e no mercado:**

A solução reduz o sofrimento emocional de famílias e o tempo médio de recuperação dos animais. Socialmente, fortalece redes de solidariedade comunitária. No mercado pet, abre oportunidades para integração com serviços complementares (veterinários, abrigos, pet shops) e consolida um ecossistema digital ainda pouco explorado no Brasil.

---

### Descrição da Proposta

**Ideia principal:**

O **Peteco** é uma plataforma composta por um aplicativo mobile (para cidadãos) e um sistema web (para gestão e administração), integrados por uma API REST, que permite:

1. Reportar a perda de um animal com fotos, localização GPS, dados de identificação e informações de contato.
2. Visualizar animais perdidos no feed e em agrupamentos por bairro.
3. Registrar avistamentos do animal, notificando o tutor automaticamente.
4. Validar fotos com IA antes do envio, garantindo qualidade e segurança do conteúdo.
5. Gerar posts e stories personalizados para divulgação nas redes sociais.

**Como resolve a problemática:**

- Centraliza todos os reportes em uma única plataforma acessível por smartphone.
- Geolocaliza ocorrências por bairro, facilitando a busca na área onde o pet foi visto por último.
- Integra IA (Groq LLaMA Vision) para validar imagens em tempo real, garantindo qualidade dos registros.
- Permite que qualquer cidadão registre avistamentos de forma estruturada, gerando uma linha do tempo de rastreamento.
- Notifica tutores sobre novos avistamentos com badges de alerta no feed.
- Gera posts e stories prontos para compartilhamento em redes sociais, ampliando o alcance da busca.

**Funcionalidades essenciais (MVP):**

| Funcionalidade | App Mobile | Sistema Web |
|---|---|---|
| Cadastro e login de usuários | ✅ | ✅ |
| Reportar pet perdido (foto + localização + contato) | ✅ | ✅ |
| Visualizar feed de pets perdidos | ✅ | ✅ |
| Mapa/agrupamento por bairro | ✅ | ✅ |
| Registrar avistamento | ✅ | — |
| Gerenciar próprios pets (editar, excluir, marcar encontrado) | ✅ | ✅ |
| Validação de fotos via IA | ✅ | ✅ |
| Busca por cidade e espécie | ✅ | ✅ |
| Perfil de usuário | ✅ | ✅ |
| Notificações de avistamentos | ✅ | ✅ |
| Gerar post/story para redes sociais | ✅ | — |

---

### Tecnologias Envolvidas

**Campos de aplicação de IA utilizados:**

| # | Campo de Aplicação | Como é usado no Peteco |
|---|---|---|
| 1 | **Análise de imagem e visão computacional** | O modelo Groq LLaMA 4 Scout 17B Vision analisa cada foto enviada antes do cadastro, verificando se é realmente um animal e se não contém conteúdo sensível. |
| 2 | **Tomada de decisão orientada a dados** | A plataforma web exibe estatísticas e distribuição de pets por bairro, espécie e status, auxiliando gestores e órgãos municipais na tomada de decisões sobre campanhas de castração, adoção e vigilância animal. |
| 3 | **Personalização de experiências** | O feed mobile prioriza automaticamente os pets do bairro do próprio usuário, personalizando a visualização com base no perfil cadastrado. |

**Contribuição para melhorias no campo escolhido:**

- A **validação por IA** elimina registros com fotos inadequadas (objetos, imagens ofensivas), elevando a qualidade do banco de dados.
- A **geolocalização + agrupamento por bairro** direciona cidadãos e voluntários para agirem na área certa, aumentando a taxa de recuperação.
- O **registro estruturado de avistamentos** cria uma linha do tempo colaborativa, dando ao tutor dados concretos para rastrear o deslocamento do animal.
- A **geração de posts e stories** amplifica o alcance da busca nas redes sociais sem esforço manual de design.

---

## Semana 2 — Detalhamento Web e Mobile

### Para o Aplicativo Mobile

**Fluxo principal do usuário:**

```
1. Primeiro acesso → Tela de Boas-Vindas (Splash)
        ↓
2. Escolha → "Já tenho conta" (Login) | "Começar agora" (Cadastro)
        ↓
3. Login/Cadastro → Autenticação via Supabase Auth
        ↓
4. Feed Principal → Lista de pets perdidos filtrada pelo bairro do usuário
        ↓
5. Visualização de detalhe → Fotos, informações, contatos, avistamentos
        ↓
6. Registro de avistamento (cidadão) ou marcar como encontrado (tutor)
        ↓
7. Aba "Cadastrar" → Reportar pet perdido com foto (validada por IA) + localização GPS
        ↓
8. Aba "Mapa" → Visualizar pets por bairro
        ↓
9. Aba "Meus Pets" → Gerenciar pets próprios (editar, excluir, marcar encontrado)
        ↓
10. Aba "Perfil" → Editar dados pessoais | Logout
```

---

**Telas Essenciais — App Mobile**

---

**Tela 1: Splash / Boas-Vindas**

*Propósito:* Apresentar o aplicativo ao usuário antes do login, transmitindo identidade visual e direcionando para autenticação.

*Elementos interativos:*
- Logotipo e nome "Peteco"
- Círculos decorativos com emojis de animais (🐶🐱)
- Botão "Já tenho uma conta" → navega para Login
- Botão "Começar agora" → navega para Cadastro

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│  🐾  P E T E C O            │
│                             │
│     ○  🐶   ○  🐱           │
│   ○         ○  🐰           │
│                             │
│   Encontre seu pet perdido  │
│   com ajuda da comunidade   │
│                             │
│  ┌─────────────────────┐    │
│  │  Já tenho uma conta │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │   Começar agora     │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

**Tela 2: Login**

*Propósito:* Autenticar usuários cadastrados.

*Elementos interativos:*
- Campo e-mail
- Campo senha com ícone de visibilidade
- Botão "Entrar"
- Link "Não tem conta? Cadastre-se"

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│        ← Voltar             │
│                             │
│  🐾  Entrar no Peteco       │
│                             │
│  ┌─────────────────────┐    │
│  │ ✉ E-mail            │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 🔒 Senha         👁 │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │       Entrar        │    │
│  └─────────────────────┘    │
│                             │
│  Não tem conta? Cadastre-se │
└─────────────────────────────┘
```

---

**Tela 3: Cadastro**

*Propósito:* Criar nova conta de usuário com dados básicos e bairro de residência.

*Elementos interativos:*
- Campos: Nome, E-mail, Telefone, Bairro (seletor modal), Senha
- Botão "Criar conta"
- Link "Já tem conta? Entrar"

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│        ← Voltar             │
│                             │
│  Criar conta no Peteco      │
│                             │
│  ┌───────────┐ ┌──────────┐ │
│  │ Nome      │ │ Telefone │ │
│  └───────────┘ └──────────┘ │
│  ┌─────────────────────┐    │
│  │ E-mail              │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Bairro         ▼   │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Senha            👁 │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │     Criar conta     │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

**Tela 4: Feed Principal**

*Propósito:* Exibir todos os pets perdidos, com busca e filtro por espécie. É o dashboard principal do usuário.

*Elementos interativos:*
- Caixa de busca por nome/bairro
- Chips de filtro: Todos | Cachorros | Gatos | Outros
- Lista de cards de pets (foto, nome, bairro, tempo desde a perda, badge de avistamentos)
- Pull-to-refresh

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ 🔍 Buscar por nome...       │
│                             │
│ [Todos][Cachorros][Gatos]   │
│ [Outros]                    │
│                             │
│ 47 pets perdidos            │
│                             │
│ ┌─────────┐ ┌─────────┐    │
│ │ [foto]  │ │ [foto]  │    │
│ │ Rex     │ │ Mia     │    │
│ │ Cachorro│ │ Gato    │    │
│ │ Caçari  │ │ Centro  │    │
│ │ 🔴 2h  │ │ 🔴 1d  │    │
│ └─────────┘ └─────────┘    │
│                             │
│ 🏠  🗺️  ➕  🐾  👤         │
└─────────────────────────────┘
```

---

**Tela 5: Mapa / Bairros**

*Propósito:* Exibir pets perdidos agrupados por bairro, facilitando a busca na vizinhança.

*Elementos interativos:*
- Seções expansíveis por bairro (accordion)
- Badge com contagem de pets por bairro
- Destaque no bairro do próprio usuário
- Mini-cards de pets dentro de cada seção

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ Pets por bairro             │
│                             │
│ ▼ Caçari (seu bairro)  [8] │
│   ┌──────┐ ┌──────┐        │
│   │ Rex  │ │ Bidu │        │
│   └──────┘ └──────┘        │
│                             │
│ ▶ Asa Branca           [5] │
│ ▶ Centro               [4] │
│ ▶ Pintolândia          [3] │
│ ▶ Raiar do Sol         [2] │
│                             │
│ 🏠  🗺️  ➕  🐾  👤         │
└─────────────────────────────┘
```

---

**Tela 6: Cadastrar Pet Perdido**

*Propósito:* Formulário completo para reportar um animal desaparecido, com validação de fotos via IA e captura de GPS.

*Elementos interativos:*
- Upload de até 3 fotos com validação em tempo real (spinner → ✓ aprovado / ✗ rejeitado)
- Nome, Espécie (radio), Raça (seletor), Cor, Descrição
- Data de perda (DatePicker)
- Bairro (seletor modal), Capturar GPS (botão)
- Toggle recompensa + valor em R$
- Toggle contatos + adicionar WhatsApp/Instagram/Tel
- Botão "Cadastrar pet"

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ ← Cadastrar Pet Perdido     │
│                             │
│ 📷 Fotos (até 3)            │
│ ┌────┐ ┌────┐ ┌────┐        │
│ │ + │ │    │ │    │        │
│ └────┘ └────┘ └────┘        │
│                             │
│ Nome do pet *               │
│ ┌─────────────────────┐     │
│ │                     │     │
│ └─────────────────────┘     │
│                             │
│ Espécie *                   │
│ ○ Cachorro  ○ Gato  ○ Outro │
│                             │
│ Bairro *    [GPS 📍]        │
│ ┌──────────────┐            │
│ │ Selecionar ▼ │            │
│ └──────────────┘            │
│                             │
│ Recompensa  ○ Sim  ○ Não    │
│                             │
│ ┌─────────────────────┐     │
│ │   Cadastrar pet     │     │
│ └─────────────────────┘     │
│                             │
│ 🏠  🗺️  ➕  🐾  👤          │
└─────────────────────────────┘
```

---

**Tela 7: Detalhe do Pet**

*Propósito:* Exibir todas as informações do pet, histórico de avistamentos e permitir ações (contatar tutor, registrar avistamento, marcar como encontrado, gerar post para redes sociais).

*Elementos interativos:*
- Carrossel de fotos com pontos de navegação
- Badge de status (🔴 Perdido / 🟢 Encontrado)
- Grid de informações (Raça, Cor, Bairro, Data)
- Cards de contato (WhatsApp, Instagram, Tel)
- Timeline de avistamentos
- Botão "Vi este pet!" (cidadão) ou "Encontrei meu pet!" (tutor)
- Botão "Gerar post" → abre modal para criação de post/story para redes sociais
- Ações do tutor: Editar | Excluir | Compartilhar

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ ←  Rex              🔴 Perdido
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │        [FOTO]           │ │
│ │                         │ │
│ └─────────────────────────┘ │
│           • ○ ○             │
│                             │
│ Rex — Cachorro              │
│                             │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│ │Raça│ │ Cor│ │Bair│ │Data│ │
│ └────┘ └────┘ └────┘ └────┘ │
│                             │
│ Recompensa: R$ 200,00       │
│                             │
│ Contatos:                   │
│ 📱 WhatsApp  📷 Instagram   │
│                             │
│ Avistamentos (2):           │
│ ● Caçari — 2h atrás        │
│   "Vi perto do mercado..."  │
│                             │
│ ┌──────────┐ ┌────────────┐ │
│ │Vi este 👁│ │ Gerar post │ │
│ └──────────┘ └────────────┘ │
└─────────────────────────────┘
```

---

**Tela 8: Registrar Avistamento (Modal)**

*Propósito:* Permitir que qualquer cidadão registre onde e quando avistou o animal, com fotos opcionais.

*Elementos interativos:*
- Bairro (seletor), Rua (texto livre)
- Descrição (obrigatório)
- Upload de até 3 fotos
- Botão "Enviar avistamento"

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ Registrar Avistamento       │
│ ─────────────────────────── │
│                             │
│ Bairro *                    │
│ ┌──────────────────────┐    │
│ │ Selecionar bairro ▼  │    │
│ └──────────────────────┘    │
│                             │
│ Rua (opcional)              │
│ ┌──────────────────────┐    │
│ │                      │    │
│ └──────────────────────┘    │
│                             │
│ Descrição *                 │
│ ┌──────────────────────┐    │
│ │ Conte o que viu...   │    │
│ └──────────────────────┘    │
│                             │
│ Fotos (até 3)               │
│ ┌────┐ ┌────┐ ┌────┐        │
│ │ + │ │    │ │    │        │
│ └────┘ └────┘ └────┘        │
│                             │
│ ┌──────────────────────┐    │
│ │  Enviar avistamento  │    │
│ └──────────────────────┘    │
└─────────────────────────────┘
```

---

**Tela 9: Meus Pets**

*Propósito:* Painel do tutor para visualizar e gerenciar todos os pets reportados.

*Elementos interativos:*
- Cards de estatísticas (Total, Perdidos, Encontrados)
- Filtros: Todos | Perdidos | Encontrados
- Grid de cards de pets com ações rápidas
- Pull-to-refresh
- Botão flutuante: "Reportar novo pet"

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ Meus Pets                   │
│                             │
│ ┌──────┐ ┌───────┐ ┌──────┐ │
│ │Total │ │Perdido│ │Achado│ │
│ │  3   │ │   2   │ │  1   │ │
│ └──────┘ └───────┘ └──────┘ │
│                             │
│ [Todos][Perdidos][Encontrados]
│                             │
│ ┌─────────┐ ┌─────────┐    │
│ │ [foto]  │ │ [foto]  │    │
│ │ Rex 🔴  │ │ Bidu 🟢 │    │
│ └─────────┘ └─────────┘    │
│                             │
│             ┌─────────────┐ │
│             │ + Reportar  │ │
│             └─────────────┘ │
│ 🏠  🗺️  ➕  🐾  👤         │
└─────────────────────────────┘
```

---

**Tela 10: Perfil do Usuário**

*Propósito:* Visualizar e editar dados pessoais do usuário e fazer logout.

*Elementos interativos:*
- Avatar com inicial do nome
- Campos exibição: Nome, E-mail, Telefone, Bairro
- Botão "Editar" → habilita campos para edição
- Botão "Salvar" / "Cancelar" no modo edição
- Links rápidos: Meus pets, Busca avançada
- Botão "Sair" (logout)

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ Meu Perfil           Editar │
│                             │
│         ┌────┐              │
│         │ L  │              │
│         └────┘              │
│                             │
│ Nome                        │
│ Lílian Geovana              │
│                             │
│ E-mail                      │
│ lilian@email.com            │
│                             │
│ Telefone                    │
│ (95) 99999-9999             │
│                             │
│ Bairro                      │
│ Caçari                      │
│                             │
│ ── Acesso rápido ──         │
│ 🐾 Meus pets                │
│ 🔍 Busca avançada           │
│                             │
│ ┌─────────────────────┐     │
│ │       Sair          │     │
│ └─────────────────────┘     │
│ 🏠  🗺️  ➕  🐾  👤         │
└─────────────────────────────┘
```

---

**Tela 11: Gerar Post / Story (Modal)**

*Propósito:* Gerar imagem personalizada do pet para compartilhamento em redes sociais (Instagram, WhatsApp e outros), aumentando o alcance da busca.

*Elementos interativos:*
- Alternância de formato: Post (1:1) | Story (9:16)
- Preview em tempo real do layout gerado
- Toggles para exibir/ocultar campos: raça, cor, bairro, data, descrição, recompensa, contatos
- Edição de contatos para exibição no post (até 3 contatos, incluindo custom)
- Botão "Compartilhar" → gera PNG via ViewShot e abre compartilhamento nativo do dispositivo

*Wireframe (ASCII):*
```
┌─────────────────────────────┐
│ Gerar Post para Divulgação  │
│ ─────────────────────────── │
│                             │
│  [  Post  ] [  Story  ]     │
│                             │
│ ┌─────────────────────────┐ │
│ │      [preview do        │ │
│ │       post/story]       │ │
│ │   Rex — Cachorro        │ │
│ │   Caçari • 2h           │ │
│ │   📱 (95) 99999-9999    │ │
│ └─────────────────────────┘ │
│                             │
│ Mostrar no post:            │
│ ☑ Raça  ☑ Cor  ☑ Bairro   │
│ ☑ Data  ☑ Contatos         │
│ ☐ Descrição  ☑ Recompensa  │
│                             │
│ ┌─────────────────────┐     │
│ │   📤 Compartilhar   │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

---

**Ações principais do usuário no app mobile:**

- Cadastrar-se e fazer login
- Reportar pet perdido com foto validada por IA, localização GPS e contatos
- Buscar pets no feed por nome, bairro e espécie
- Visualizar pets agrupados por bairro
- Visualizar detalhes de um pet e entrar em contato com o tutor
- Registrar avistamento de um pet (com local, descrição e fotos)
- Gerar post ou story para divulgação nas redes sociais
- Gerenciar próprios pets: editar, marcar como encontrado, excluir
- Editar perfil pessoal

**Funcionalidades MVP do app mobile:**

1. Autenticação (cadastro/login/logout)
2. Reportar pet perdido (fotos, localização, dados, contatos)
3. Feed de pets perdidos com busca e filtros
4. Detalhe do pet com contatos do tutor
5. Registro de avistamento pela comunidade
6. Gerenciamento de pets próprios (Meus Pets)
7. Validação de fotos por IA (Groq)
8. Geração de post/story para divulgação em redes sociais

**Conexão funcionalidades → problemática:**

As funcionalidades MVP atacam diretamente os quatro problemas centrais: o feed centralizado resolve a fragmentação de informações; a geolocalização por bairro resolve o baixo alcance geográfico; o avistamento estruturado resolve a lentidão na resposta comunitária; e a validação por IA resolve a baixa qualidade dos registros.

---

### Para o Sistema Web

**Papel do sistema web:**

O sistema web é orientado à **gestão e visualização gerencial** dos dados da plataforma. É utilizado por:
- **Tutores** que preferem a interface desktop para gerenciar seus pets.
- **Administradores** e potencialmente órgãos municipais/ONGs que precisam de visão consolidada de pets perdidos por região, espécie e status.

---

**Telas Essenciais — Sistema Web**

---

**Tela 1: Landing Page (Pública)**

*Propósito:* Apresentar a plataforma para visitantes não autenticados.

*Elementos:* Hero com chamada para ação, explicação das funcionalidades principais, botão para login/cadastro.

---

**Tela 2: Login / Autenticação**

*Propósito:* Autenticar usuários existentes no sistema web.

*Elementos:* Campos e-mail e senha, botão Entrar, link para Cadastro. Layout dividido: formulário + imagem/ilustração.

*Wireframe (ASCII):*
```
┌──────────────┬──────────────────────────┐
│              │                          │
│  [LOGO]      │  Entrar no Peteco        │
│  Peteco      │                          │
│              │  E-mail                  │
│  [Imagem ou  │  ┌──────────────────┐    │
│   Ilustração]│  └──────────────────┘    │
│              │                          │
│              │  Senha                   │
│              │  ┌──────────────────┐    │
│              │  └──────────────────┘    │
│              │                          │
│              │  ┌──────────────────┐    │
│              │  │     Entrar       │    │
│              │  └──────────────────┘    │
│              │                          │
│              │  Não tem conta?          │
│              │  Cadastre-se             │
└──────────────┴──────────────────────────┘
```

---

**Tela 3: Cadastro de Usuário**

*Propósito:* Criar nova conta via sistema web.

*Elementos:* Formulário com Nome, E-mail, Telefone, Bairro (select), Senha. Botão "Criar conta".

---

**Tela 4: Feed / Dashboard Principal**

*Propósito:* Exibir todos os pets perdidos em formato de grade, com filtros. É a tela principal após login.

*Elementos:*
- Barra de filtros: busca por nome, filtro de espécie (Todos/Cachorro/Gato/Outro)
- Grade responsiva de cards (3 colunas desktop, 2 tablet, 1 mobile)
- Card de pet: foto, nome, espécie, bairro, data de perda, status
- Contagem de resultados

*Wireframe (ASCII):*
```
┌─────────────────────────────────────────────────────────┐
│ PETECO  Feed  Mapa  Meus Pets  Cadastrar  Perfil  Sair  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔍 Buscar pet...   [Todos ▼]   47 pets perdidos        │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   [foto]   │  │   [foto]   │  │   [foto]   │         │
│  │            │  │            │  │            │         │
│  │ Rex        │  │ Mia        │  │ Thor       │         │
│  │ 🐕 Caçari  │  │ 🐈 Centro  │  │ 🐕 Asa Br. │         │
│  │ 🔴 Perdido │  │ 🔴 Perdido │  │ 🔴 Perdido │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   [foto]   │  │   ...      │  │   ...      │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

**Tela 5: Cadastrar Pet (Web)**

*Propósito:* Formulário completo para reportar pet perdido via desktop.

*Elementos:* Layout em duas colunas. Coluna esquerda: upload de fotos com preview. Coluna direita: campos do formulário (nome, espécie, raça, cor, descrição, data, bairro, recompensa, contatos). Botão "Cadastrar pet".

---

**Tela 6: Mapa / Bairros (Web)**

*Propósito:* Visão gerencial de pets agrupados por bairro, ideal para identificar áreas de maior incidência.

*Elementos:*
- Lista de bairros em accordion
- Badge com contagem de pets por bairro
- Pet cards dentro de cada bairro

*Wireframe (ASCII):*
```
┌─────────────────────────────────────────────────────────┐
│ PETECO  Feed  Mapa  Meus Pets  Cadastrar  Perfil  Sair  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Pets por Bairro                                        │
│                                                         │
│  ▼ Caçari ─────────────────────────────────────── [8]  │
│    ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│    │ Rex  │ │ Bidu │ │ Mel  │ │ Bob  │                 │
│    └──────┘ └──────┘ └──────┘ └──────┘                 │
│                                                         │
│  ▶ Asa Branca ──────────────────────────────────── [5] │
│  ▶ Centro ──────────────────────────────────────── [4] │
│  ▶ Pintolândia ─────────────────────────────────── [3] │
│  ▶ Raiar do Sol ────────────────────────────────── [2] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Tela 7: Meus Pets (Web)**

*Propósito:* Painel de gestão dos pets reportados pelo usuário autenticado.

*Elementos:*
- Cards de estatísticas no topo: Total, Perdidos, Encontrados
- Chips de filtro: Todos | Perdidos | Encontrados
- Grade de pet cards com botão de refresh
- Estado vazio com link para cadastrar

---

**Tela 8: Detalhe do Pet (Web)**

*Propósito:* Visão completa de um pet com carrossel de fotos, informações, timeline de avistamentos e ações do tutor.

*Elementos:*
- Layout duas colunas: esquerda (carrossel), direita (informações + ações)
- Grid de dados: raça, cor, bairro, data
- Seção de contatos com ícones coloridos
- Timeline de avistamentos com localização e descrição
- Botões tutor: Editar | Excluir | Marcar Encontrado | Compartilhar

*Wireframe (ASCII):*
```
┌────────────────────────────────────────────────────────┐
│ ← Voltar                              🔴 Perdido       │
├───────────────────────┬────────────────────────────────┤
│                       │ Rex — Cachorro                  │
│                       │ Tutor: João Silva              │
│       [FOTO]          │                                │
│                       │ ┌──────┬──────┬──────┬──────┐  │
│     • ○ ○             │ │Raça  │ Cor  │Bairro│Data  │  │
│                       │ └──────┴──────┴──────┴──────┘  │
│                       │                                │
│                       │ Recompensa: R$ 200,00          │
│                       │                                │
│                       │ Contatos:                      │
│                       │ 📱 WhatsApp  📷 Instagram      │
│                       │                                │
│                       │ [Editar] [Excluir] [Encontrado]│
├───────────────────────┴────────────────────────────────┤
│ Avistamentos (2)                                       │
│ ● Caçari • 2 horas atrás • "Vi perto do mercado..."   │
│ ● Centro • 1 dia atrás  • "Estava na calçada..."      │
└────────────────────────────────────────────────────────┘
```

---

**Tela 9: Perfil do Usuário (Web)**

*Propósito:* Visualizar dados da conta e acessar funcionalidades rápidas.

*Elementos:*
- Card com avatar, nome, e-mail, bairro
- Links rápidos: Feed, Cadastrar, Meus Pets
- Botão "Editar perfil"

---

**Tela 10: Editar Perfil (Web)**

*Propósito:* Formulário para atualizar dados do usuário (nome, telefone, bairro, senha).

*Elementos:*
- Campos editáveis: Nome, Telefone, Bairro (select), Nova Senha
- Botão "Salvar alterações"
- Botão "Cancelar"

---

**Ações principais do administrador/usuário web:**

- Visualizar todos os pets perdidos em dashboard com filtros
- Visualizar distribuição geográfica por bairro (Mapa)
- Gerenciar próprios pets (editar, excluir, marcar encontrado)
- Cadastrar novo pet perdido
- Visualizar timeline de avistamentos de qualquer pet
- Editar perfil pessoal
- Acessar detalhes de contato dos tutores

**Funcionalidades MVP do sistema web:**

1. Autenticação (login/logout/cadastro)
2. Feed de pets com busca e filtros
3. Visualização por bairro (Mapa)
4. Cadastro de pet perdido com validação por IA
5. Gerenciamento de pets próprios
6. Detalhe completo do pet com avistamentos
7. Edição de perfil

---

## Semana 3 — Implementação das Funcionalidades

### Aplicativo Móvel — Telas Implementadas

---

**Tela 1: Splash / Boas-Vindas**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Logotipo Peteco, círculos decorativos com emojis de animais, dois botões de ação (cor roxa primária #7C3AED).
- **Ações do usuário:** Navegar para Login ou Cadastro.
- **Objetivo:** Primeiro ponto de contato com o app; cria identidade visual e direciona o usuário para autenticação.

---

**Tela 2: Login**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Campos de e-mail e senha com ícone de olho para visibilidade, botão primário roxo, link para cadastro.
- **Ações do usuário:** Digitar credenciais, alternar visibilidade da senha, fazer login, ir para cadastro.
- **Objetivo:** Autenticar o usuário existente via Supabase Auth e redirecioná-lo para o feed.

---

**Tela 3: Cadastro**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Formulário com 5 campos, seletor modal de bairro (lista dos bairros de Boa Vista/RR), botão "Criar conta".
- **Ações do usuário:** Preencher dados pessoais, selecionar bairro em modal, criar conta.
- **Objetivo:** Registrar novo usuário no sistema com dados essenciais para personalizar a experiência (bairro é obrigatório para priorização no feed).

---

**Tela 4: Feed Principal**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** SearchBar, chips de filtro por espécie, contador de resultados, FlatList de CardPets com foto, nome, bairro, tempo desde a perda e badge de avistamentos não lidos.
- **Ações do usuário:** Pesquisar por nome/bairro, filtrar por espécie, puxar para atualizar, tocar em card para ver detalhe.
- **Objetivo:** Permitir que cidadãos e tutores encontrem rapidamente pets perdidos, priorizando os do próprio bairro.

---

**Tela 5: Mapa / Bairros**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Lista de seções expansíveis por bairro, badge com contagem, bairro do usuário destacado com cor diferente, mini-cards de pets internos.
- **Ações do usuário:** Expandir/recolher bairros, tocar em pet para ver detalhe.
- **Objetivo:** Oferecer visão geográfica rápida para cidadãos verificarem se há pets perdidos na vizinhança.

---

**Tela 6: Cadastrar Pet Perdido**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Área de upload com 3 slots (indicador de validação IA: spinner → ✓ aprovado), radios de espécie, seletores modais para raça/bairro, DatePicker, botão GPS, toggles para recompensa e contato, campos de valor e contatos com máscara.
- **Ações do usuário:** Selecionar fotos (validação automática por IA), preencher dados, capturar GPS, adicionar contatos, enviar formulário.
- **Objetivo:** Registrar um pet perdido com dados completos e fotos validadas, maximizando as chances de recuperação.

---

**Tela 7: Detalhe do Pet**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Carrossel de fotos com pontos, badge de status colorido, grid de informações (4 cards), card de recompensa, cards de contato com ícones coloridos por tipo, timeline vertical de avistamentos com fotos.
- **Ações do usuário:** Navegar fotos, tocar em contato (abre WhatsApp/Instagram/Tel), registrar avistamento (botão "Vi este pet!"), gerar post/story para divulgação (botão "Gerar post"), ou marcar como encontrado (tutor).
- **Objetivo:** Centralizar todas as informações de um pet, facilitar a comunicação entre cidadãos e o tutor, e ampliar o alcance da busca via redes sociais.

---

**Tela 8: Registrar Avistamento**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Modal bottom sheet com seletor de bairro, campo de rua (livre), campo de descrição, upload de até 3 fotos, botão "Enviar avistamento".
- **Ações do usuário:** Informar bairro, rua e descrição do avistamento, adicionar fotos, enviar.
- **Objetivo:** Capturar informações estruturadas de avistamentos comunitários para montar a trilha de rastreamento do animal.

---

**Tela 9: Meus Pets**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** 3 cards de estatísticas (Total, Perdidos em vermelho, Encontrados em verde), chips de filtro, grade de CardPets, pull-to-refresh, estado vazio com CTA.
- **Ações do usuário:** Filtrar por status, tocar em pet para ver detalhe, puxar para atualizar.
- **Objetivo:** Dar ao tutor visão consolidada de todos os seus registros e acesso rápido para gerenciá-los.

---

**Tela 10: Perfil do Usuário**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Avatar com inicial do nome em círculo roxo, campos de dados pessoais, botão "Editar" (alterna modo visualização/edição), links rápidos, botão "Sair" com borda vermelha.
- **Ações do usuário:** Editar nome/telefone/bairro/senha, salvar ou cancelar edição, acessar atalhos de navegação, fazer logout.
- **Objetivo:** Permitir que o usuário mantenha seus dados atualizados (especialmente o bairro, que impacta a personalização do feed).

---

**Tela 11: Gerar Post / Story (Modal)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Modal com dois formatos selecionáveis (Post 1:1 e Story 9:16), preview ao vivo do layout, lista de campos com toggles (raça, cor, bairro, data, descrição, recompensa, contatos), seção de edição de contatos para exibição.
- **Ações do usuário:** Selecionar formato, ativar/desativar campos desejados, editar contatos que aparecerão no post, tocar em "Compartilhar" para gerar o PNG e abrir o compartilhamento nativo do dispositivo.
- **Objetivo:** Ampliar o alcance da busca pelo animal gerando uma arte de divulgação profissional para Instagram Stories, feed e WhatsApp, sem necessidade de edição manual de imagens.

---

### Aplicativo Web — Telas Implementadas

---

**Tela 1: Landing Page**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Navbar com logo e links, seção hero com chamada "Encontre pets perdidos perto de você", botões de ação, seção explicativa das funcionalidades.
- **Ações do usuário:** Navegar para login/cadastro.
- **Objetivo:** Apresentar a plataforma para visitantes não autenticados e converter em cadastros.

---

**Tela 2: Login**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Layout de duas colunas (ilustração + formulário), campos e-mail/senha, botão "Entrar", link de cadastro.
- **Ações do usuário:** Inserir credenciais, fazer login, navegar para cadastro.
- **Objetivo:** Autenticar usuários para acesso ao sistema web.

---

**Tela 3: Cadastro**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Formulário centralizado com campos Nome, E-mail, Telefone, Bairro (select), Senha. Botão "Criar conta".
- **Ações do usuário:** Preencher dados, selecionar bairro, criar conta.
- **Objetivo:** Registrar novo usuário no sistema.

---

**Tela 4: Feed / Dashboard Principal**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Navbar fixa, barra de busca, filtros de espécie, contador de resultados, grade de 3 colunas de PetCards com foto, nome, espécie, bairro, status.
- **Ações do usuário:** Buscar pets, filtrar por espécie, clicar em card para ver detalhe.
- **Objetivo:** Visão geral de todos os pets perdidos para tutores e cidadãos via desktop.

---

**Tela 5: Cadastrar Pet (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Layout duas colunas. Área de upload de fotos (left). Formulário completo à direita (nome, espécie, raça, cor, descrição, data, bairro, recompensa, contatos).
- **Ações do usuário:** Upload de fotos (validação IA), preencher formulário completo, capturar GPS, adicionar contatos, submeter.
- **Objetivo:** Registrar novo pet perdido via interface desktop com todas as informações necessárias.

---

**Tela 6: Mapa / Bairros (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Lista de seções expansíveis por bairro, badges de contagem, pet cards internos com status colorido.
- **Ações do usuário:** Expandir/recolher bairros, navegar para detalhe do pet.
- **Objetivo:** Visão gerencial da distribuição geográfica de pets perdidos por bairro.

---

**Tela 7: Meus Pets (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Cards de estatísticas no topo (Total/Perdidos/Encontrados com bordas coloridas), filtros, grade de pet cards, botão refresh, estado vazio.
- **Ações do usuário:** Filtrar por status, atualizar lista, navegar para detalhe do pet.
- **Objetivo:** Painel de gestão dos pets do tutor em desktop.

---

**Tela 8: Detalhe do Pet (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Layout duas colunas (carrossel de fotos | informações), grid de dados, seção de recompensa, cards de contato, timeline de avistamentos. Ações do tutor: Editar, Excluir, Marcar Encontrado, Compartilhar.
- **Ações do usuário:** Navegar fotos, acessar contatos, visualizar avistamentos, gerenciar pet (se tutor).
- **Objetivo:** Página central de informações de um pet, unificando dados, contatos e histórico de rastreamento.

---

**Tela 9: Perfil (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Card de avatar, nome, e-mail e bairro. Links rápidos para Feed, Cadastrar e Meus Pets. Botão "Editar perfil".
- **Ações do usuário:** Acessar atalhos de navegação, ir para edição de perfil.
- **Objetivo:** Resumo rápido da conta do usuário com acesso às principais seções.

---

**Tela 10: Editar Perfil (Web)**

> *[ Adicionar imagem da tela aqui ]*

**Descrição:**
- **Elementos visuais:** Formulário com campos editáveis (Nome, Telefone, Bairro, Nova Senha), botões Salvar e Cancelar.
- **Ações do usuário:** Alterar dados pessoais, salvar ou cancelar alterações.
- **Objetivo:** Manter dados do usuário atualizados, especialmente o bairro, que personaliza o feed.

---

### 2. Acesso para Usuários Não Logados

**App Mobile:**

O acesso sem login está restrito à Tela de Splash. Todas as demais funcionalidades exigem autenticação. A decisão é intencional: para registrar avistamentos e reportar pets, o sistema precisa da identidade do usuário para fins de rastreabilidade e notificação.

**Sistema Web:**

A **Landing Page** é a única tela pública. Ela exibe informações gerais sobre a plataforma (proposta, funcionalidades, apelo à ação) sem expor dados de pets ou usuários. Isso foi definido para:
- Atrair novos usuários e convertê-los em cadastros.
- Proteger dados pessoais dos tutores e detalhes dos pets de acessos anônimos em massa.

> Futuramente, o feed público poderia ser exposto parcialmente para ampliar o alcance da busca, mas na versão MVP a decisão foi manter tudo autenticado para garantir responsabilidade nos avistamentos.

---

### 3. Ferramentas de Desenvolvimento

#### Frontend — Mobile

| Biblioteca / Framework | Utilidade | Documentação |
|---|---|---|
| **Expo** | Framework principal para desenvolvimento React Native multiplataforma (iOS/Android). Gerencia build, atualizações e APIs nativas. | https://docs.expo.dev |
| **React Native** | Base para construção de interfaces mobile nativas com JavaScript. | https://reactnative.dev |
| **React** | Biblioteca de componentes para construção de UI declarativa. | https://react.dev |
| **Expo Router** | Sistema de roteamento baseado em arquivos para Expo, similar ao Next.js App Router. | https://expo.github.io/router |
| **Expo Location** | Acesso à geolocalização do dispositivo (GPS) para capturar coordenadas do local de perda do pet. | https://docs.expo.dev/versions/latest/sdk/location |
| **Expo Image Picker** | Seleção de fotos da galeria ou câmera do dispositivo. | https://docs.expo.dev/versions/latest/sdk/imagepicker |
| **Expo Sharing** | Compartilhamento de arquivos e imagens com outros aplicativos (Stories, WhatsApp). | https://docs.expo.dev/versions/latest/sdk/sharing |
| **react-native-view-shot** | Captura de tela de componentes React Native para geração de imagens de compartilhamento social. | https://github.com/gre/react-native-view-shot |
| **Axios** | Cliente HTTP para comunicação com a API REST. Suporta interceptors e configuração de headers de autenticação. | https://axios-http.com/docs |
| **@supabase/supabase-js** | SDK oficial do Supabase para autenticação (JWT), armazenamento de fotos (Storage) e queries ao banco PostgreSQL. | https://supabase.com/docs/reference/javascript |

---

#### Frontend — Web

| Biblioteca / Framework | Utilidade | Documentação |
|---|---|---|
| **Vue 3** | Framework JavaScript progressivo para construção de interfaces reativas com Composition API. | https://vuejs.org |
| **Vite** | Bundler e servidor de desenvolvimento ultrarrápido para projetos Vue/React modernos. | https://vite.dev |
| **Vue Router 4** | Roteamento client-side com suporte a guards de autenticação via meta fields. | https://router.vuejs.org |
| **Tailwind CSS** | Framework CSS utility-first para estilização rápida e responsiva sem CSS customizado. | https://tailwindcss.com/docs |
| **Lucide Vue Next** | Biblioteca de ícones SVG para Vue 3, com ícones limpos e consistentes. | https://lucide.dev |
| **Axios** | Cliente HTTP para requisições à API REST, compartilhando a mesma configuração base (`http.js`). | https://axios-http.com/docs |
| **@supabase/supabase-js** | SDK Supabase para autenticação web (session cookie) e storage. | https://supabase.com/docs/reference/javascript |

---

#### Backend — API

| Biblioteca / Framework | Utilidade | Documentação |
|---|---|---|
| **Node.js** | Ambiente de execução JavaScript server-side. Runtime base de toda a API. | https://nodejs.org/en/docs |
| **Express.js 5** | Framework web minimalista para Node.js, utilizado para construir a API REST com roteamento, middlewares e handlers. | https://expressjs.com |
| **@supabase/supabase-js** | SDK Supabase com Service Key para acesso privilegiado ao banco (CRUD), Storage (upload de fotos) e validação de tokens JWT mobile. | https://supabase.com/docs/reference/javascript |
| **groq-sdk** | SDK oficial da Groq para consumo do modelo LLaMA 4 Scout 17B Vision, usado para validação de fotos enviadas pelos usuários. | https://console.groq.com/docs |
| **cors** | Middleware Express para habilitar CORS com whitelist de origens (Expo Go, localhost web, produção). | https://github.com/expressjs/cors |
| **express-session** | Middleware de sessão server-side com cookie httpOnly para autenticação web. | https://github.com/expressjs/session |
| **cookie-parser** | Middleware para parsing de cookies nas requisições HTTP. | https://github.com/expressjs/cookie-parser |

---

## Semana 4 — Revisão e Entrega Final

### 1. Revisão e Ajustes Finais

**Checklist de testes recomendados:**

**App Mobile:**
- [ ] Fluxo de cadastro e login com dados válidos e inválidos
- [ ] Upload de foto com animal (deve aprovar) e foto sem animal/com conteúdo sensível (deve rejeitar)
- [ ] Cadastro de pet com todos os campos obrigatórios e sem campos obrigatórios
- [ ] Captura de GPS em ambientes indoor e outdoor
- [ ] Feed: busca por nome, filtro por espécie, pull-to-refresh
- [ ] Mapa: expansão/colapso de bairros, ordenação por contagem
- [ ] Detalhe do pet: carrossel, avistamento, contatos (WhatsApp/Instagram/Tel)
- [ ] Gerar post/story: seleção de formato, toggles de campos, compartilhamento nativo
- [ ] Registro de avistamento: envio com e sem fotos
- [ ] Meus Pets: filtro de status, marcar como encontrado, editar, excluir
- [ ] Perfil: edição de dados, alteração de senha, logout
- [ ] Comportamento offline (mensagem de erro adequada)

**Sistema Web:**
- [ ] Login e logout
- [ ] Feed com busca e filtro
- [ ] Cadastro de pet com validação de fotos via IA
- [ ] Visualização de detalhe com avistamentos
- [ ] Mapa por bairro: expansão/colapso
- [ ] Meus Pets: filtros, refresh, marcar encontrado
- [ ] Editar e excluir pet
- [ ] Editar perfil
- [ ] Responsividade (mobile, tablet, desktop)

---

### 2. Entrega do Banner

O banner deve ser entregue em formato `.pptx` para `george.oliveira@ifrr.edu.br` até **20 de junho de 2026**.

**Conteúdo obrigatório do banner:**

| Campo | Conteúdo sugerido |
|---|---|
| **Título do Projeto** | Peteco — Plataforma de Recuperação de Pets Perdidos |
| **Nomes dos Integrantes** | *(inserir nomes completos)* |
| **Tecnologias de IA** | Groq LLaMA 4 Scout 17B Vision — Validação de imagens enviadas pelos usuários |
| **Problemática** | Ausência de plataforma centralizada e inteligente para reportar e localizar animais domésticos perdidos, com fragmentação de informações em grupos de redes sociais e sem triagem automatizada. |
| **Solução** | Aplicativo mobile e sistema web integrados que permitem reportar pets perdidos com fotos (validadas por IA), geolocalização por bairro e avistamentos comunitários estruturados, acelerando a recuperação dos animais. |

---

### 3. Slides da Apresentação (Opcional)

**Estrutura sugerida dos slides:**

1. **Capa:** Logo Peteco, título, nomes dos integrantes, instituição, data.
2. **Problema:** Dados sobre pets perdidos no Brasil + dores do processo atual.
3. **Solução:** Conceito do Peteco (frase-resumo + diferencial de IA).
4. **Arquitetura:** Diagrama simples mostrando Mobile → API → Supabase/Groq ← Web.
5. **Demo Mobile (5-6 slides):** Prints das telas principais com legenda.
6. **Demo Web (4-5 slides):** Prints das telas principais com legenda.
7. **Tecnologias:** Lista visual de stacks usados.
8. **IA no Peteco:** Explicação do uso de IA (validação de fotos com Groq LLaMA Vision).
9. **Resultados / Próximos Passos:** O que foi entregue e roadmap futuro.
10. **Conclusão + QR Code:** Link de acesso + QR Code para a aplicação web.

---

### 4. Link da Aplicação e QR-Code

> **Atenção:** preencha os dados abaixo após o deploy da aplicação web.

| Campo | Valor |
|---|---|
| **URL da aplicação web** | *(inserir URL completa após deploy)* |
| **QR Code** | *(inserir imagem do QR Code gerado a partir da URL acima)* |

**Serviços sugeridos para deploy:**

| Componente | Plataforma sugerida |
|---|---|
| API (Node.js) | Railway, Render, ou Fly.io |
| Web (Vue/Vite — SPA) | Vercel ou Netlify |
| Mobile | Expo Go (QR Code de desenvolvimento) ou APK via `eas build` |

**Geração do QR Code:**  
Utilize `qr-code-generator.com` ou `goqr.me` com a URL da aplicação web hospedada.
