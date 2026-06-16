# PETECO: PLATAFORMA DIGITAL PARA LOCALIZAÇÃO DE PETS DESAPARECIDOS COM VALIDAÇÃO POR INTELIGÊNCIA ARTIFICIAL

Aluno 1¹, Aluno 2², Aluno 3³, George Almeida de Oliveira⁴

¹Acadêmico do IFRR/Campus Boa Vista. E-mail: aluno1@ifrr.edu.br; ²Acadêmico do IFRR/Campus Boa Vista. E-mail: aluno2@ifrr.edu.br; ³Acadêmico do IFRR/Campus Boa Vista. E-mail: aluno3@ifrr.edu.br; ⁴Professor do IFRR/Campus Boa Vista. E-mail: george.oliveira@ifrr.edu.br

---

## INTRODUÇÃO

A perda de animais domésticos é um problema recorrente em centros urbanos, causando sofrimento emocional às famílias e baixas taxas de recuperação dos animais. A busca por soluções ainda ocorre de forma fragmentada em grupos de WhatsApp, Facebook e panfletos impressos, sem padronização, geolocalização ou estrutura adequada (SERPELL, 2017). Diante dessa lacuna, o Peteco é uma plataforma web e mobile que centraliza o registro de pets desaparecidos com organização por bairro, validação automática de imagens por Inteligência Artificial e participação comunitária, aumentando as chances de reencontro entre tutores e seus animais.

---

## OBJETIVOS

Desenvolver uma plataforma multiplataforma (mobile e web) para centralizar o registro e a busca de pets desaparecidos, com geolocalização por bairro, validação automática de imagens por IA e engajamento comunitário, visando reduzir o tempo de recuperação dos animais.

---

## METODOLOGIA

O desenvolvimento do Peteco seguiu a metodologia ágil com ciclos semanais de entrega incremental, divididos em quatro sprints de duas semanas cada. O projeto foi estruturado como um monorepo contendo três módulos: API backend (Node.js/Express.js 5), aplicativo mobile (React Native com Expo) e sistema web (Vue 3 com Vite).

O backend foi construído com Express.js 5 e integrado ao Supabase, plataforma que provê banco de dados PostgreSQL, autenticação via JWT e armazenamento de imagens. Para a validação automática de fotos, foi utilizado o modelo de visão computacional LLaMA 4 Scout 17B Vision, disponibilizado pela API da Groq, capaz de verificar em tempo real se as imagens enviadas contêm animais e se estão livres de conteúdo inadequado.

O aplicativo mobile foi desenvolvido com React Native e Expo Router para roteamento baseado em arquivos, com acesso ao GPS do dispositivo via Expo Location e captura de imagens via Expo Image Picker. O sistema web foi construído com Vue 3 (Composition API), Tailwind CSS para estilização e Vue Router 4 com guardas de autenticação.

Ambas as interfaces implementam oito funcionalidades principais: autenticação de usuários, cadastro de pet desaparecido com validação de imagem por IA, feed de pets com filtros por espécie e busca textual, visualização de pets agrupados por bairro, detalhamento do pet com dados de contato do tutor, registro de avistamentos pela comunidade, gerenciamento dos registros pelo tutor e perfil de usuário editável. Adicionalmente, o aplicativo mobile permite a geração automatizada de posts para redes sociais nos formatos 1:1 e 9:16.

---

## RESULTADOS E DISCUSSÃO

O Peteco resultou em uma plataforma funcional com aplicativo mobile e sistema web integrados a uma API REST. A validação por IA (LLaMA 4 Scout 17B Vision) foi implementada com tempo de resposta inferior a 3 segundos, com feedback visual em tempo real durante o upload. A organização por bairro, principal diferencial da plataforma, permite identificar rapidamente pets desaparecidos na região do usuário. O mobile também permite gerar automaticamente cartazes para compartilhamento no Instagram e WhatsApp a partir dos dados cadastrados.

**Figura 1** — Fluxo de validação de imagem por IA no cadastro de pet.

*(Inserir figura do fluxo: upload → Groq Vision → aprovação/rejeição → armazenamento Supabase)*

**Figura 2** — Telas do aplicativo mobile: Feed, Mapa por Bairro e Detalhes do Pet.

*(Inserir capturas de tela do aplicativo)*

---

## CONCLUSÃO

O Peteco centralizou com êxito o registro e a busca de pets desaparecidos, demonstrando a viabilidade de uma solução multiplataforma com geolocalização e validação por IA. Como trabalhos futuros, propõe-se a integração com abrigos e ONGs e a implementação de notificações push por proximidade geográfica.

---

## REFERÊNCIAS

SERPELL, J. A. **The domestic dog**. 2. ed. Cambridge: Cambridge University Press, 2017.

SUPABASE. **Supabase Documentation**. Disponível em: https://supabase.com/docs. Acesso em: jun. 2026.

GROQ. **Groq API Docs**. Disponível em: https://console.groq.com/docs. Acesso em: jun. 2026.

EXPO. **Expo Docs**. Disponível em: https://docs.expo.dev. Acesso em: jun. 2026.

VUE.JS. **Vue 3 Docs**. Disponível em: https://vuejs.org/guide. Acesso em: jun. 2026.

---

## AGRADECIMENTOS

Ao IFRR/Campus Boa Vista pelo suporte institucional e ao professor orientador George Almeida de Oliveira pela orientação.

*(Inserir logotipos: IFRR, agências de fomento ou parceiros institucionais conforme aplicável)*
