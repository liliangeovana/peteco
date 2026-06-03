# 🐾 PETECO

Plataforma de monitoramento de pets perdidos com geolocalização, heatmaps e IA.

---

## Estrutura do projeto

```
peteco/
├── peteco-api/       Node.js + Express  — API REST, sessão/cookie, Anthropic Vision
├── peteco-mobile/    React Native + Expo — App do cidadão (10 telas)
├── peteco-web/       Vue 3 + Vite        — Painel B2G (10 telas)
└── peteco-ia/        Python + Flask      — Microsserviço DBSCAN
```

---

## Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|--------------|---------|
| Node.js   | 18+          | https://nodejs.org |
| Python    | 3.10+        | https://python.org |
| Expo CLI  | via npx      | — |

---

## 1. peteco-api — Backend Node.js

### Instalação

```bash
cd peteco-api
npm install
```

### Configurar variáveis de ambiente

Crie o arquivo `.env` (já existe no projeto) e preencha:

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui
IA_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5858
SESSION_SECRET=uma_string_secreta_longa
PORT=3001
```

> A `SUPABASE_SERVICE_KEY` é a chave **service_role** (não a anon key).  
> A `ANTHROPIC_API_KEY` é necessária para validação de foto e busca de similares.

### Rodar

```bash
npm run dev
```

API disponível em `http://localhost:3001`

---

## 2. peteco-mobile — App React Native

### Instalação

```bash
cd peteco-mobile
npm install
```

### Configurar variáveis de ambiente

Edite o `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3001
```

> Use o IP da sua máquina na rede local (ex: `192.000.0.00`) — não use `localhost`,  
> pois o app roda no celular físico ou emulador.  
> Para descobrir o IP: `ipconfig` no Windows → "Endereço IPv4".

### Rodar

```bash
npx expo start
```

Escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione:
- `a` — abrir no emulador Android
- `w` — abrir no navegador (modo web)

---

## 3. peteco-web — Dashboard Vue 3

### Instalação

```bash
cd peteco-web
npm install
```

### Configurar variáveis de ambiente

Edite o `.env`:

```env
VITE_API_URL=http://localhost:3001
```

### Rodar

```bash
npm run dev
```

Painel disponível em `http://localhost:5858`

### Build para produção

```bash
npm run build
```

---

## 4. peteco-ia — Microsserviço Python

### Instalação

```bash
cd peteco-ia

# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar — Windows
venv\Scripts\activate

# Ativar — Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### Configurar variáveis de ambiente

Edite o `.env`:

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui
```

> Usa a mesma `service_role_key` do backend Node.

### Rodar

```bash
# Com o venv ativado:
python app.py
```

Serviço disponível em `http://localhost:5000`

---

## Rodando tudo junto

Abra **4 terminais** e execute cada comando em um deles:

```bash
# Terminal 1 — API
cd peteco-api && npm run dev

# Terminal 2 — IA
cd peteco-ia && venv\Scripts\activate && python app.py

# Terminal 3 — Web
cd peteco-web && npm run dev

# Terminal 4 — Mobile (opcional)
cd peteco-mobile && npx expo start
```

| Serviço | URL |
|---------|-----|
| API Node | http://localhost:3001 |
| IA Python | http://localhost:5000 |
| Web Vue | http://localhost:5858 |
| Mobile | Expo Go via QR code |

---

## Verificar se tudo está funcionando

Acesse estes URLs no navegador para confirmar cada serviço:

- **API:** `http://localhost:3001/health` → `{"status":"ok"}`
- **IA:** `http://localhost:5000/health` → `{"status":"ok"}`
- **Web:** `http://localhost:5858` → tela de login
- **Mobile:** QR code no terminal do Expo

---

## Observações

- O `peteco-ia` é necessário apenas para as telas **Clusters** e **Dashboard/Análise** do painel web. As outras telas funcionam sem ele.
- As rotas `/pets` (POST), `/pets/:id/encontrado` (PATCH) e `/auth/perfil` (PATCH) exigem sessão ativa — faça login primeiro.
- Em produção, o `cookie.secure` no backend deve ser `true` (requer HTTPS).
