# PETECO — Guia Técnico Completo

> Plataforma de monitoramento de pets perdidos com geolocalização, heatmaps e IA  
> Stack: React Native Expo · Vue 3 + Vite + Tailwind CSS · Node.js + Express · Python (IA) · Supabase  
> Perfil: 2 devs com foco em front-end · 15–30 dias · protótipo acadêmico  
> Disciplinas: DAMU (Mobile) + DAW (Web) — Prof. George Oliveira · IFRR

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Stack e Ferramentas](#3-stack-e-ferramentas)
4. [Divisão de Trabalho](#4-divisão-de-trabalho)
5. [Cobertura dos Critérios Avaliativos](#5-cobertura-dos-critérios-avaliativos)
6. [Banco de Dados](#6-banco-de-dados)
7. [Backend — Node.js + Express](#7-backend--nodejs--express)
8. [Microsserviço de IA — Python](#8-microsserviço-de-ia--python)
9. [App Mobile — Expo (10 Telas)](#9-app-mobile--expo-10-telas)
10. [Dashboard Web — Vue 3 (10 Telas)](#10-dashboard-web--vue-3-10-telas)
11. [Mapas e Heatmap](#11-mapas-e-heatmap)
12. [IA e Clustering — DBSCAN](#12-ia-e-clustering--dbscan)
13. [Busca de Endereço por CEP](#13-busca-de-endereço-por-cep)
14. [Autenticação + Sessão com Cookie](#14-autenticação--sessão-com-cookie)
14. [Autenticação + Sessão com Cookie](#14-autenticação--sessão-com-cookie)
15. [Estrutura de Pastas](#15-estrutura-de-pastas)
16. [Fluxos Completos](#16-fluxos-completos)
17. [Deploy Gratuito](#17-deploy-gratuito)
18. [Cronograma 30 dias](#18-cronograma-30-dias)

---

## 1. Visão Geral

O PETECO é composto por duas frentes com propósitos distintos:

- **App Mobile** — voltado ao cidadão/tutor. Cadastro de pets perdidos com validação de imagem por IA (Anthropic Vision), busca de pets similares e visualização no mapa.
- **Painel Web (B2G)** — voltado a gestores municipais, agentes públicos e ONGs. Transforma os dados cadastrados no mobile em informação analítica: mapas de calor, clusters geográficos (DBSCAN) e estatísticas para tomada de decisão.

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| App Mobile | React Native + Expo | Cadastro de pets, câmera, GPS, validação IA |
| Painel Web B2G | Vue 3 + Vite | Mapas de calor, clusters, dashboard analítico |
| Backend principal | Node.js + Express | API REST, sessão, cookie, CRUD, validação imagem |
| Microsserviço IA | Python (Flask) | DBSCAN, clustering geográfico |
| Validação de imagem | API Anthropic (visão) | Moderação, verificação de animal, busca de similares |
| Banco de Dados | Supabase | PostgreSQL + PostGIS + Auth + Storage |

> **Separação de responsabilidades:** o mobile é o ponto de entrada do dado — cidadãos cadastram ocorrências. O web é o ponto de análise — gestores e ONGs consomem esses dados transformados em informação geográfica e estatística.

---

## 2. Arquitetura

Arquitetura recomendada: **backend Node.js central + microsserviço Python para IA**.

```
┌─────────────────┐     ┌──────────────────────┐
│   App Mobile    │     │   Painel Web (B2G)   │
│ React Native    │     │   Vue 3 + Vite        │
│ Expo            │     │   Gestores + ONGs     │
└────────┬────────┘     └──────────┬────────────┘
         │                         │
         │      HTTPS / REST       │
         └────────────┬────────────┘
                      │
             ┌────────▼────────┐
             │  Backend Node   │
             │  Express.js     │◄──── chama microsserviço IA via HTTP
             │  express-session│◄──── chama Anthropic Vision API
             └────────┬────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
┌─────────▼───────┐   ┌───────────▼───────┐
│  Supabase        │   │ Microsserviço IA   │
│  PostgreSQL      │   │ Python (Flask)     │
│  + PostGIS       │◄──│ DBSCAN             │
│  + Auth          │   └───────────────────┘
│  + Storage       │
└─────────────────┘
         ▲
         │
Anthropic Vision API
(validação + similares)
```

---

## 3. Stack e Ferramentas

| Área | Ferramenta | Por que usar |
|------|-----------|-------------|
| Mobile | React Native + Expo | Vocês já sabem React. Expo elimina config Android/iOS. |
| Web Dashboard | Vue 3 + Vite | Composition API moderna, `<script setup>` limpo. |
| CSS Web | Tailwind CSS | Utility-first, sem dependência externa, design system próprio via `globals.css`. |
| Tipografia | Nunito | Fonte arredondada e amigável — usada em todo o projeto (mobile + web). Importada via Google Fonts. |
| CEP / Endereço | BrasilAPI + ViaCEP (fallback) | Sem chave de API, CORS livre, dados dos Correios. Retorna bairro, cidade e UF. |
| Roteamento web | Vue Router 4 | Oficial do Vue, integração nativa. |
| Mapas | Leaflet.js + Vue-Leaflet | Open source, sem chave de API, tiles OpenStreetMap. |
| Heatmap | leaflet.heat | Pluga no Leaflet. 5 linhas para gerar heatmap. |
| Gráficos | Chart.js + vue-chartjs | Fácil, bonito, wrapper oficial para Vue. |
| Backend | Node.js + Express | Mesmo ecossistema JS do front. Rápido de montar. |
| Sessão/Cookie | express-session + cookie-parser | **Exigido no edital DAW (item 6)**. |
| Queries banco | @supabase/supabase-js | Cliente oficial — substitui um ORM inteiro. |
| Microsserviço IA | Flask (Python) | Mais leve que FastAPI para serviço pequeno. |
| IA / Clustering | Scikit-learn (DBSCAN) | Biblioteca padrão acadêmica. Paper original 1996. |
| Validação de imagem | Anthropic Vision API | Moderação de conteúdo e verificação de animal no upload. Tier gratuito suficiente para protótipo. |
| Banco de Dados | Supabase | PostgreSQL + Auth + Storage + API automática. |
| Deploy Backend | Render.com | Free tier Node.js. Deploy via GitHub. |
| Deploy IA | Render.com | Segundo Web Service Python. |
| Deploy Web | Vercel | Deploy instantâneo de Vue. Domínio grátis. |
| Deploy Mobile | Expo Go | QR code para a defesa. Sem publicar na loja. |

---

## 4. Divisão de Trabalho

| Dev 1 — Mobile + Backend Node | Dev 2 — Web Vue + Microsserviço IA |
|-------------------------------|-------------------------------------|
| App React Native Expo (10 telas) | Dashboard Vue 3 + Vite + Tailwind (10 telas) |
| Telas de cadastro, câmera, GPS | Mapa, heatmap, clusters, dashboard |
| Upload de foto + validação Anthropic Vision | Microsserviço Python DBSCAN |
| API Express (pets CRUD + validar-foto) | Gráficos Chart.js |
| express-session + cookie no Node | Tela de perfil + editar perfil |
| Integração Supabase Auth | Tabela HTML de pets + formulários |

**Responsabilidades compartilhadas:**
- Modelagem do banco de dados (1h juntos no início)
- Definição dos endpoints da API (1h juntos)
- Contrato da chamada Node → Python (formato JSON)
- Dados de teste para a demo
- Deploy final em produção

---

## 5. Cobertura dos Critérios Avaliativos

### DAMU — Mobile (25 pts)

| # | Critério | Pts | Como o PETECO atende |
|---|----------|-----|----------------------|
| 1 | Image, Button, Text, TextInput, View | 1 | Usados em todas as telas do app |
| 2 | FlatList | 1 | Feed de pets é uma FlatList com CardPet |
| 3 | useState (2+ objetos) | 2 | localização, foto, formulário, sessão, filtros |
| 4 | Navegação entre páginas | 2 | Expo Router com tabs + stack navigation |
| 5 | Consumo de API (Fetch/Axios) | 3 | Axios para Node API + Supabase Auth |
| 6 | Layout consistente | 1 | StyleSheet padronizado em todos os componentes |
| 7 | 10 telas | 5 | Ver lista completa na seção 9 |
| 8 | Apresentação estruturada | 10 | Roteiro na seção 15 (Fluxos) |
| **Total** | | **25** | |

### DAW — Web (25 pts)

| # | Critério | Pts | Como o PETECO atende |
|---|----------|-----|----------------------|
| 1 | HTML estruturado (header, menu, footer) | 1 | Layout base Vue com navbar Tailwind + footer |
| 2 | Imagens, tabelas, listas, formulários, mídia | 1 | Tabela de pets, formulário de filtro + CEP, vídeo embed, mapa iframe |
| 3 | CSS responsivo + Bootstrap | 1 | Tailwind CSS com design system próprio (`globals.css`) — responsivo por padrão |
| 4 | Consulta de API via Fetch | 1 | Axios para Node API em todas as páginas |
| 5 | Gerenciamento HTTP (rotas, redirect, render) | 2 | Express com rotas, `res.redirect`, `res.sendFile` |
| 6 | Cookie/Sessão | 2 | **express-session** — ver seção 13 |
| 7 | Funcionalidades com IA | 2 | DBSCAN (clustering geográfico) + Anthropic Vision (validação de imagem) |
| 8 | 10 telas | 5 | Ver lista completa na seção 10 |
| 9 | Apresentação estruturada | 10 | Roteiro na seção 15 (Fluxos) |
| **Total** | | **25** | |

---

## 6. Banco de Dados

Usando **Supabase (PostgreSQL + PostGIS)**.

### Tabela de perfis

```sql
CREATE TABLE perfis (
  id          UUID REFERENCES auth.users PRIMARY KEY,
  nome        TEXT NOT NULL,
  telefone    TEXT,
  criado_em   TIMESTAMPTZ DEFAULT now()
);
```

### Tabela principal: pets_perdidos

```sql
CREATE TABLE pets_perdidos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id      UUID REFERENCES perfis(id),

  nome            TEXT NOT NULL,
  especie         TEXT NOT NULL,
  raca            TEXT,
  cor             TEXT,
  descricao       TEXT,
  foto_url        TEXT,

  localizacao     GEOGRAPHY(POINT, 4326),
  lat             FLOAT,
  lng             FLOAT,
  endereco        TEXT,
  bairro          TEXT,
  cidade          TEXT,

  status          TEXT DEFAULT 'perdido',
  data_perda      DATE,

  criado_em       TIMESTAMPTZ DEFAULT now(),
  atualizado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pets_localizacao ON pets_perdidos USING GIST (localizacao);

-- Trigger: sincroniza lat/lng automaticamente ao inserir/atualizar
CREATE OR REPLACE FUNCTION sync_lat_lng()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lat := ST_Y(NEW.localizacao::geometry);
  NEW.lng := ST_X(NEW.localizacao::geometry);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_lat_lng
BEFORE INSERT OR UPDATE ON pets_perdidos
FOR EACH ROW EXECUTE FUNCTION sync_lat_lng();
```

### Tabela de clusters (resultado da IA)

```sql
CREATE TABLE clusters_ia (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gerado_em       TIMESTAMPTZ DEFAULT now(),
  algoritmo       TEXT DEFAULT 'DBSCAN',
  parametros      JSONB,
  total_clusters  INT,
  total_ruido     INT,
  resultado       JSONB
);
```

### Busca geográfica por raio (PostGIS)

```sql
SELECT id, nome, especie, status,
       ST_Distance(localizacao::geography,
                   ST_MakePoint(-46.6, -23.5)::geography) AS distancia_metros
FROM   pets_perdidos
WHERE  ST_DWithin(
         localizacao::geography,
         ST_MakePoint(-46.6, -23.5)::geography,
         5000
       )
ORDER  BY distancia_metros;
```

> **Dica:** As colunas `lat` e `lng` (sincronizadas via trigger) permitem leitura direta no Node e no Python sem usar funções PostGIS no SELECT.

---

## 7. Backend — Node.js + Express

### Setup

```bash
mkdir peteco-backend && cd peteco-backend
npm init -y
npm install express @supabase/supabase-js dotenv cors axios
npm install express-session cookie-parser
npm install -D nodemon
```

### src/server.js — entrada principal

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import petsRouter from './routes/pets.js';
import analiseRouter from './routes/analise.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Sessão com cookie — atende ao item 6 do DAW
app.use(session({
  secret: process.env.SESSION_SECRET || 'peteco-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,          // true em produção com HTTPS
    httpOnly: true,         // impede acesso via JS no cliente
    maxAge: 1000 * 60 * 60 * 24,  // 24 horas
  },
}));

// Rotas
app.use('/auth', authRouter);
app.use('/pets', petsRouter);
app.use('/analise', analiseRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3000, () => console.log('PETECO API rodando na porta 3000'));
```

### src/routes/auth.js — login com sessão

```javascript
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// POST /auth/login — cria sessão no servidor após autenticação Supabase
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) return res.status(401).json({ erro: 'Credenciais inválidas' });

    // Salva dados do usuário na sessão do servidor
    req.session.usuario = {
      id:    data.user.id,
      email: data.user.email,
      nome:  data.user.user_metadata?.nome,
      token: data.session.access_token,  // guardado na sessão, não exposto ao front
    };

    res.json({ mensagem: 'Login realizado com sucesso', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /auth/logout — destrói sessão
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão' });
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Logout realizado' });
  });
});

// GET /auth/me — retorna usuário da sessão atual
router.get('/me', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  res.json(req.session.usuario);
});

export default router;
```

### src/middlewares/auth.js — protege rotas com sessão

```javascript
// Middleware que verifica se existe sessão ativa
export function autenticar(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Sessão inativa. Faça login.' });
  }
  next();
}
```

### src/routes/pets.js — CRUD de pets

```javascript
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

// GET /pets — lista pets com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { status, cidade, especie } = req.query;
    let query = supabase
      .from('pets_perdidos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (status)  query = query.eq('status', status);
    if (cidade)  query = query.eq('cidade', cidade);
    if (especie) query = query.eq('especie', especie);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /pets/:id — detalhe de um pet
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets_perdidos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ erro: 'Pet não encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /pets — cadastra novo pet (requer sessão)
router.post('/', autenticar, async (req, res) => {
  try {
    const { nome, especie, raca, cor, descricao,
            latitude, longitude, endereco, bairro, cidade,
            foto_url, data_perda } = req.body;

    const { data, error } = await supabase
      .from('pets_perdidos')
      .insert({
        usuario_id: req.session.usuario.id,
        nome, especie, raca, cor, descricao,
        foto_url, data_perda, endereco, bairro, cidade,
        localizacao: `POINT(${longitude} ${latitude})`,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PATCH /pets/:id/encontrado — marca pet como encontrado
router.patch('/:id/encontrado', autenticar, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets_perdidos')
      .update({ status: 'encontrado', atualizado_em: new Date() })
      .eq('id', req.params.id)
      .eq('usuario_id', req.session.usuario.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
```

### src/routes/analise.js — chama o microsserviço Python

```javascript
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const IA_URL = process.env.IA_SERVICE_URL || 'http://localhost:5000';

router.get('/clusters', async (req, res) => {
  try {
    const { data } = await axios.get(`${IA_URL}/clusters`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ erro: 'Microsserviço de IA indisponível' });
  }
});

router.get('/estatisticas', async (req, res) => {
  try {
    const { data } = await axios.get(`${IA_URL}/estatisticas`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ erro: 'Microsserviço de IA indisponível' });
  }
});

export default router;
```

---

## 8. Microsserviço de IA — Python

### Setup

```bash
mkdir peteco-ia && cd peteco-ia
pip install flask scikit-learn numpy supabase python-dotenv
```

### app.py

```python
from flask import Flask, jsonify
from clustering import executar_dbscan
from estatisticas import gerar_estatisticas_gerais
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

@app.get("/clusters")
def clusters():
    return jsonify(executar_dbscan(supabase))

@app.get("/estatisticas")
def estatisticas():
    return jsonify(gerar_estatisticas_gerais(supabase))

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
```

---

## 9. App Mobile — Expo (10 Telas)

### Setup

```bash
npx create-expo-app peteco-mobile --template blank
cd peteco-mobile
npx expo install expo-location expo-image-picker
npm install @supabase/supabase-js axios @react-native-async-storage/async-storage
```

### Lista completa das 10 telas (DAMU item 7 — 5 pts)

| # | Tela | Componentes-chave | Critério coberto |
|---|------|-------------------|-----------------|
| 1 | **Splash / Onboarding** | Image, Text, Button | Item 1 |
| 2 | **Login** | TextInput (email/senha), Button | Item 1, 3 |
| 3 | **Cadastro de usuário** | TextInput, Button, useState | Item 1, 3 |
| 4 | **Feed de pets** | FlatList, CardPet, Image | Item 2 |
| 5 | **Detalhe do pet** | Image, Text, Button "encontrei!" | Item 1, 4 |
| 6 | **Cadastrar pet** | TextInput, câmera, GPS, CEP → bairro/cidade, useState | Item 1, 3, 5 |
| 7 | **Mapa de ocorrências** | MapView, Marker (react-native-maps) | Item 5 |
| 8 | **Busca e filtros** | TextInput, FlatList filtrada, useState | Item 2, 3 |
| 9 | **Meus pets** | FlatList, Image, Button status | Item 2, 4 |
| 10 | **Editar perfil** | TextInput, Button, useState, API | Item 1, 3, 5 |

### Navegação (Expo Router)

```javascript
// app/_layout.jsx — estrutura de tabs
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="(tabs)/feed"      options={{ title: 'Feed' }} />
      <Tabs.Screen name="(tabs)/mapa"      options={{ title: 'Mapa' }} />
      <Tabs.Screen name="(tabs)/cadastrar" options={{ title: 'Cadastrar' }} />
      <Tabs.Screen name="(tabs)/meus-pets" options={{ title: 'Meus Pets' }} />
      <Tabs.Screen name="(tabs)/perfil"    options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
```

### Capturar coordenadas GPS (apenas lat/lng)

O GPS é usado exclusivamente para as coordenadas geográficas salvas no PostGIS. Bairro, cidade e UF vêm do CEP via API — fonte mais confiável que o geocoding reverso do dispositivo.

```javascript
import * as Location from 'expo-location';

const obterCoordenadas = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Precisamos da localização para cadastrar o pet perdido.');
    return null;
  }

  const local = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude:  local.coords.latitude,
    longitude: local.coords.longitude,
  };
};
```

> **Por que não usar `reverseGeocodeAsync`?** O geocoding reverso do dispositivo retorna nomes de bairro inconsistentes — especialmente em cidades do interior como Boa Vista. A BrasilAPI usa a base oficial dos Correios, que tem bairros padronizados e válidos para análise geográfica.

### Upload de foto para o Supabase Storage

```javascript
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

const selecionarFoto = async () => {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!resultado.canceled) {
    const uri = resultado.assets[0].uri;
    const nomeArquivo = `pets/${Date.now()}.jpg`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('fotos-pets')
      .upload(nomeArquivo, blob, { contentType: 'image/jpeg' });

    if (error) throw error;

    const { data } = supabase.storage
      .from('fotos-pets')
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }
};
```

### FlatList de pets (tela Feed)

```javascript
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed() {
  const [pets, setPets]         = useState([]);
  const [filtro, setFiltro]     = useState('perdido');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/pets?status=${filtro}`)
      .then(r => setPets(r.data))
      .finally(() => setCarregando(false));
  }, [filtro]);

  return (
    <FlatList
      data={pets}
      keyExtractor={item => item.id}
      refreshing={carregando}
      onRefresh={() => setCarregando(true)}
      renderItem={({ item }) => (
        <View style={estilos.card}>
          <Image source={{ uri: item.foto_url }} style={estilos.foto} />
          <View style={estilos.info}>
            <Text style={estilos.nome}>{item.nome}</Text>
            <Text>{item.especie} · {item.bairro}</Text>
            <Text style={estilos.data}>Perdido em {item.data_perda}</Text>
          </View>
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  card:  { flexDirection: 'row', padding: 12, marginBottom: 8, backgroundColor: '#FFFFFF', borderRadius: 16 },
  foto:  { width: 80, height: 80, borderRadius: 12 },
  info:  { flex: 1, marginLeft: 12 },
  nome:  { fontWeight: '800', fontSize: 15, color: '#2C2118', fontFamily: 'Nunito' },
  data:  { color: '#7A6A5A', fontSize: 11, marginTop: 4, fontWeight: '600' },
});
```

---

## 10. Dashboard Web — Vue 3 (10 Telas)

### Setup

```bash
npm create vite@latest peteco-web -- --template vue
cd peteco-web
npm install vue-router@4 @supabase/supabase-js axios
npm install leaflet @vue-leaflet/vue-leaflet
npm install chart.js vue-chartjs
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configurar Tailwind

Substitua o `tailwind.config.js` gerado pelo arquivo `peteco-tailwind.config.js` do design system, depois importe o `peteco-globals.css` no `main.js`:

```javascript
// src/main.js
import { createApp } from 'vue';
import router from './router';
import './assets/globals.css';   // Tailwind + design system PETECO
import App from './App.vue';

createApp(App).use(router).mount('#app');
```

### Lista completa das 10 telas (DAW item 8 — 5 pts)

| # | Rota | Tela | Critério DAW coberto |
|---|------|------|----------------------|
| 1 | `/login` | **Login / Autenticação** | Item 5, 6 (sessão) |
| 2 | `/cadastro` | **Cadastro de usuário** | Item 1, 2 (formulário) |
| 3 | `/` | **Mapa com pins** | Item 4, 7 (API + IA) |
| 4 | `/heatmap` | **Heatmap de ocorrências** | Item 4, 7 |
| 5 | `/clusters` | **Clusters DBSCAN** | Item 7 (funcionalidade IA) |
| 6 | `/dashboard` | **Dashboard analítico B2G** | Item 2 (tabelas/listas), 4 |
| 7 | `/analise` | **Análise de dados** | Item 7 (estatísticas numéricas, sem narrativa IA) |
| 8 | `/pets` | **Lista de todos os pets** | Item 2 (tabela HTML), 4 |
| 9 | `/perfil` | **Perfil do usuário** | Item 2 (formulário), 5, 6 |
| 10 | `/perfil/editar` | **Editar perfil** | Item 2 (formulário), 5, 6 |

### Layout base com Tailwind (App.vue)

A paleta e fonte do design seguem os arquivos `peteco-tailwind.config.js` e `peteco-globals.css` gerados. Importe a fonte Nunito no `index.html`:

```html
<!-- index.html — dentro do <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap" rel="stylesheet">
```

```vue
<template>
  <div class="min-h-screen flex flex-col bg-neutral-50">

    <!-- Navbar — cobre item 1 do DAW (cabeçalho/menu) -->
    <nav class="navbar">
      <div class="navbar-logo">
        <span aria-hidden="true">🐾</span> PETECO
      </div>
      <div class="navbar-links">
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/">Mapa</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/heatmap">Heatmap</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/clusters">Clusters</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/dashboard">Dashboard</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/analise">Análise</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/pets">Pets</RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/perfil">Perfil</RouterLink>
      </div>
    </nav>

    <!-- Conteúdo da página ativa -->
    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <RouterView />
    </main>

    <!-- Footer — cobre item 1 do DAW (rodapé + informações de contato) -->
    <footer class="bg-neutral-900 text-white text-center py-4 text-xs">
      <p class="mb-1">PETECO &copy; 2026 — IFRR · DAMU + DAW</p>
      <p class="text-neutral-400">
        <a href="mailto:peteco@ifrr.edu.br" class="text-neutral-300 hover:text-white">peteco@ifrr.edu.br</a>
        ·
        <a href="tel:+559500000000" class="text-neutral-300 hover:text-white">+55 95 0000-0000</a>
      </p>
    </footer>

  </div>
</template>
```

### Tela de Lista de Pets — tabela HTML (DAW item 2)

```vue
<template>
  <div class="page">
    <div class="page-header">
      <h2>Pets perdidos</h2>
    </div>

    <!-- Formulário de filtro — cobre formulários do item 2 -->
    <form class="flex flex-wrap gap-2 mb-4" @submit.prevent="filtrar">
      <input v-model="filtros.nome"    class="input w-40"  placeholder="Nome do pet" />
      <select v-model="filtros.especie" class="input w-36">
        <option value="">Todas as espécies</option>
        <option value="cachorro">Cachorro</option>
        <option value="gato">Gato</option>
      </select>
      <input v-model="filtros.cidade"  class="input w-36"  placeholder="Cidade" />
      <button class="btn-primary" type="submit">Filtrar</button>
    </form>

    <!-- Tabela HTML — cobre item 2 (tabelas) -->
    <div class="overflow-x-auto">
      <table class="table-peteco">
        <thead>
          <tr>
            <th>Foto</th><th>Nome</th><th>Espécie</th>
            <th>Raça</th><th>Bairro</th><th>Data</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pet in pets" :key="pet.id">
            <td>
              <img :src="pet.foto_url" :alt="pet.nome"
                   class="w-10 h-10 object-cover rounded-md" />
            </td>
            <td class="font-medium text-neutral-900">{{ pet.nome }}</td>
            <td>{{ pet.especie }}</td>
            <td>{{ pet.raca || '—' }}</td>
            <td>{{ pet.bairro }}</td>
            <td>{{ pet.data_perda }}</td>
            <td>
              <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'">
                {{ pet.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const pets    = ref([]);
const filtros = ref({ nome: '', especie: '', cidade: '' });

const filtrar = async () => {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros.value).filter(([, v]) => v))
  );
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets?${params}`);
  pets.value = data;
};

onMounted(filtrar);
</script>
```

### Tela de Editar Perfil — formulário do usuário (DAW item 2 + 5 + 6)

Esta tela substitui a "Sobre o projeto". Além de cumprir o item 2 (formulário), demonstra sessão ativa (item 6) ao exibir os dados do usuário logado e ao salvar via rota autenticada.

```vue
<template>
  <div class="page">

    <!-- Cabeçalho com avatar — estilo do design PETECO -->
    <div class="flex items-center gap-4 mb-6 p-5 bg-brand-700 rounded-lg text-white">
      <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
        👤
      </div>
      <div>
        <h2 class="text-xl font-black text-white">{{ usuario?.nome || 'Usuário' }}</h2>
        <p class="text-sm text-white/70 font-semibold">{{ usuario?.email }}</p>
      </div>
    </div>

    <!-- Formulário de edição — cobre item 2 (formulários) -->
    <form @submit.prevent="salvar" class="card">
      <h3 class="text-base font-black text-neutral-900 mb-4">Dados pessoais</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="field">
          <label class="label">Nome</label>
          <input v-model="form.nome" class="input" placeholder="Seu nome" required />
        </div>
        <div class="field">
          <label class="label">Sobrenome</label>
          <input v-model="form.sobrenome" class="input" placeholder="Seu sobrenome" />
        </div>
      </div>

      <div class="field mb-4">
        <label class="label">Telefone / WhatsApp</label>
        <input v-model="form.telefone" class="input" placeholder="(95) 98765-4321" />
      </div>

      <div class="divider" />

      <h3 class="text-base font-black text-neutral-900 mb-4 mt-4">Segurança</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="field">
          <label class="label">Nova senha</label>
          <input v-model="form.senha" class="input" type="password" placeholder="Deixe em branco para manter" />
        </div>
        <div class="field">
          <label class="label">Confirmar nova senha</label>
          <input v-model="form.confirmarSenha" class="input" type="password" placeholder="Repita a nova senha" />
        </div>
      </div>

      <div v-if="mensagem" :class="mensagem.tipo === 'sucesso' ? 'insight-info' : 'insight-critical'" class="mb-4">
        {{ mensagem.texto }}
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" class="btn-ghost" @click="resetar">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="salvando">
          {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </div>
    </form>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const usuario  = ref(null);
const salvando = ref(false);
const mensagem = ref(null);
const form     = ref({ nome: '', sobrenome: '', telefone: '', senha: '', confirmarSenha: '' });

onMounted(async () => {
  // Busca dados do usuário logado via sessão (item 6 — sessão ativa)
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/auth/me`,
    { withCredentials: true }
  );
  usuario.value = data;
  form.value.nome     = data.nome      ?? '';
  form.value.telefone = data.telefone  ?? '';
});

const salvar = async () => {
  if (form.value.senha && form.value.senha !== form.value.confirmarSenha) {
    mensagem.value = { tipo: 'erro', texto: 'As senhas não coincidem.' };
    return;
  }
  salvando.value = true;
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/usuarios/perfil`,
      { nome: form.value.nome, telefone: form.value.telefone, senha: form.value.senha || undefined },
      { withCredentials: true }
    );
    mensagem.value = { tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' };
  } catch {
    mensagem.value = { tipo: 'erro', texto: 'Erro ao salvar. Tente novamente.' };
  } finally {
    salvando.value = false;
  }
};

const resetar = () => {
  form.value.senha = '';
  form.value.confirmarSenha = '';
  mensagem.value = null;
};
</script>
```

---

## 11. Mapas e Heatmap

### Mapa com pins (Vue-Leaflet)

```vue
<template>
  <l-map :zoom="12" :center="centro" style="height: 70vh; border-radius: 12px;">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
    <l-marker v-for="pet in pets" :key="pet.id" :lat-lng="[pet.lat, pet.lng]">
      <l-popup>
        <strong>{{ pet.nome }}</strong><br />
        {{ pet.especie }} — {{ pet.bairro }}
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const centro = ref([-23.55, -46.63]);
const pets   = ref([]);

onMounted(async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets?status=perdido`);
  pets.value = data;
});
</script>
```

### Heatmap com leaflet.heat (Leaflet puro via onMounted)

```vue
<template>
  <div id="mapa-heatmap" style="height: 70vh; border-radius: 12px;" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import axios from 'axios';

let mapa = null;

onMounted(async () => {
  mapa = L.map('mapa-heatmap').setView([-23.55, -46.63], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(mapa);

  const { data: pets } = await axios.get(
    `${import.meta.env.VITE_API_URL}/pets?status=perdido`
  );

  const pontos = pets.map(p => [p.lat, p.lng, 1.0]);

  L.heatLayer(pontos, {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    gradient: { 0.4: 'blue', 0.65: 'lime', 1.0: 'red' },
  }).addTo(mapa);
});

// Obrigatório no Vue para evitar erro ao navegar entre rotas
onUnmounted(() => { if (mapa) mapa.remove(); });
</script>
```

> **Para a defesa:** o heatmap usa Estimativa de Densidade Kernel (KDE) — citar este conceito tem respaldo teórico sólido em análise espacial.

---

## 12. Inteligência Artificial — Três Camadas

O PETECO utiliza IA em três camadas distintas, cada uma com propósito e tecnologia específicos:

| Camada | Onde | Tecnologia | Finalidade |
|--------|------|-----------|------------|
| **Validação de imagem** | Mobile + Backend | Anthropic Vision | Verifica se é animal, detecta conteúdo sensível |
| **Recomendação de similares** | Mobile + Web | Anthropic Vision | Compara fotos e dados para identificar o mesmo pet |
| **Clustering geográfico** | Painel Web B2G | Python + DBSCAN | Identifica zonas críticas de desaparecimento |

---

## 12.1 Validação e Similares — Anthropic Vision API

### Endpoint POST /pets/validar-foto

Chamado antes do upload. Analisa a imagem e retorna se é aprovada para cadastro.

```javascript
// Resposta aprovada
{
  "mensagem": "Imagem aprovada.",
  "status": 200,
  "data": {
    "aprovada": true,
    "ehAnimal": true,
    "temConteudoSensivel": false,
    "motivo": null
  }
}

// Resposta reprovada
{
  "mensagem": "Imagem reprovada.",
  "status": 200,
  "data": {
    "aprovada": false,
    "ehAnimal": false,
    "temConteudoSensivel": false,
    "motivo": "A imagem não contém um animal doméstico."
  }
}
```

### Endpoint POST /pets/buscar-similares

Chamado após validação aprovada, antes de confirmar o cadastro.

```javascript
// Body
{
  "imagemBase64": "...",
  "especie": "cachorro",
  "cor": "bege",
  "raca": "Labrador",
  "cidade": "Boa Vista"
}

// Resposta
{
  "mensagem": "2 pet(s) similar(es) encontrado(s).",
  "status": 200,
  "data": [
    {
      "pet": { "id": "uuid", "nome": "Rex", "raca": "Labrador", ... },
      "score": 8,
      "justificativa": "Coloração e porte muito parecidos, pode ser o mesmo animal."
    }
  ]
}
```

### Endpoint GET /pets/:id/similares

Chamado ao abrir o detalhe de um pet — retorna até 3 similares.

---

## 12.2 Clustering Geográfico — DBSCAN

### Por que DBSCAN?

- Não exige número de clusters pré-definido
- Identifica outliers (pets isolados = ruído)
- Funciona bem com dados geográficos esparsos
- Paper original amplamente citado — aceito em qualquer banca

### Parâmetros

| Parâmetro | Significado | Valor sugerido |
|-----------|-------------|---------------|
| `eps` | Raio de busca | `1.0` km |
| `min_samples` | Mínimo de pontos para cluster | `3` |
| `metric` | Distância | `haversine` (distância real na Terra) |

### clustering.py

```python
import numpy as np
from sklearn.cluster import DBSCAN

def executar_dbscan(supabase_client, eps_km=1.0, min_samples=3):
    resultado = supabase_client.table("pets_perdidos") \
        .select("id, nome, especie, bairro, lat, lng") \
        .eq("status", "perdido") \
        .execute()

    pets = resultado.data
    if len(pets) < min_samples:
        return {"erro": "Dados insuficientes", "total": len(pets)}

    coords   = np.array([[p["lat"], p["lng"]] for p in pets])
    eps_rad  = eps_km / 6371.0

    modelo  = DBSCAN(eps=eps_rad, min_samples=min_samples,
                     algorithm='ball_tree', metric='haversine')
    rotulos = modelo.fit_predict(np.radians(coords))

    clusters = {}
    for i, rotulo in enumerate(rotulos):
        chave = int(rotulo)
        if chave not in clusters:
            clusters[chave] = []
        clusters[chave].append({
            "id": pets[i]["id"], "nome": pets[i]["nome"],
            "especie": pets[i]["especie"],
            "lat": pets[i]["lat"], "lng": pets[i]["lng"],
        })

    resultado_final = []
    for rotulo, membros in clusters.items():
        if rotulo == -1:
            continue
        lats = [m["lat"] for m in membros]
        lngs = [m["lng"] for m in membros]
        resultado_final.append({
            "cluster_id":    rotulo,
            "total_pets":    len(membros),
            "centroide_lat": float(np.mean(lats)),
            "centroide_lng": float(np.mean(lngs)),
            "pets":          membros,
            "criticidade":   "alta" if len(membros) >= 5 else "media",
        })

    resultado_final.sort(key=lambda x: x["total_pets"], reverse=True)

    return {
        "total_clusters": len(resultado_final),
        "total_ruido":    len(clusters.get(-1, [])),
        "parametros":     {"eps_km": eps_km, "min_samples": min_samples},
        "clusters":       resultado_final,
    }
```

### estatisticas.py

```python
def gerar_estatisticas_gerais(supabase_client):
    from collections import Counter
    pets = supabase_client.table("pets_perdidos").select("especie, status").execute().data
    return {
        "total_perdidos":    sum(1 for p in pets if p["status"] == "perdido"),
        "total_encontrados": sum(1 for p in pets if p["status"] == "encontrado"),
        "por_especie": [
            {"especie": k, "total": v}
            for k, v in Counter(p["especie"] for p in pets).most_common()
        ],
    }
```

> **Referência:** Ester, M. et al. (1996). A density-based algorithm for discovering clusters in large spatial databases with noise. *KDD-96 Proceedings*, 226–231.

---

## 13. Busca de Endereço por CEP

O endereço (bairro, cidade e UF) é obtido a partir do CEP digitado pelo usuário, usando a **BrasilAPI** como fonte primária e **ViaCEP** como fallback. Ambas consomem a base oficial dos Correios, são gratuitas e não exigem chave de API.

> **Por que não usar a API do SERPRO/gov.br?** A API oficial avaliada exige OAuth2 com credenciais governamentais e header `x-cpf-usuario` em cada requisição — inviável para protótipo acadêmico. BrasilAPI e ViaCEP entregam os mesmos dados da mesma base.

| API | URL base | Auth | CORS | Dados retornados |
|-----|----------|------|------|-----------------|
| **BrasilAPI** (primária) | `brasilapi.com.br/api/cep/v2/{cep}` | Nenhuma | Livre | bairro, cidade, UF, logradouro, lat/lng* |
| **ViaCEP** (fallback) | `viacep.com.br/ws/{cep}/json` | Nenhuma | Livre | bairro, cidade, UF, logradouro |

*A BrasilAPI v2 retorna coordenadas quando disponíveis — podendo substituir o GPS em alguns casos.

### hooks/useCep.js — compartilhado entre mobile e web

```javascript
// hooks/useCep.js
// Funciona em React Native (Expo) e Vue — é JavaScript puro sem dependências

const BRASIL_API = 'https://brasilapi.com.br/api/cep/v2';
const VIA_CEP    = 'https://viacep.com.br/ws';

export async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido — precisa ter 8 dígitos.');

  // Tenta BrasilAPI primeiro
  try {
    const res = await fetch(`${BRASIL_API}/${cepLimpo}`);
    if (res.ok) {
      const d = await res.json();
      return {
        cep:       d.cep,
        bairro:    d.neighborhood ?? '',
        cidade:    d.city         ?? '',
        uf:        d.state        ?? '',
        latitude:  d.location?.coordinates?.latitude  ?? null,
        longitude: d.location?.coordinates?.longitude ?? null,
      };
    }
  } catch (_) { /* segue para fallback */ }

  // Fallback: ViaCEP
  const res = await fetch(`${VIA_CEP}/${cepLimpo}/json/`);
  if (!res.ok) throw new Error('CEP não encontrado.');
  const d = await res.json();
  if (d.erro) throw new Error('CEP não encontrado.');

  return {
    cep:       d.cep,
    bairro:    d.bairro     ?? '',
    cidade:    d.localidade ?? '',
    uf:        d.uf         ?? '',
    latitude:  null,
    longitude: null,
  };
}
```

### Uso no mobile — tela de cadastro (React Native)

```javascript
// app/(tabs)/cadastrar.jsx — trecho do formulário
import { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { buscarCep } from '../../hooks/useCep';

export default function CadastrarPet() {
  const [cep, setCep]           = useState('');
  const [endereco, setEndereco] = useState(null);
  const [buscando, setBuscando] = useState(false);

  const handleCep = async (texto) => {
    // Formata visualmente: 00000-000
    const nums = texto.replace(/\D/g, '').slice(0, 8);
    setCep(nums.length > 5 ? `${nums.slice(0,5)}-${nums.slice(5)}` : nums);

    // Dispara busca ao completar 8 dígitos
    if (nums.length === 8) {
      setBuscando(true);
      try {
        const resultado = await buscarCep(nums);
        setEndereco(resultado);
        // Bairro e cidade preenchidos automaticamente:
        // resultado.bairro → salvo em pets_perdidos.bairro
        // resultado.cidade → salvo em pets_perdidos.cidade
        // resultado.uf     → exibido apenas, não tem coluna própria
      } catch (err) {
        Alert.alert('CEP não encontrado', err.message);
      } finally {
        setBuscando(false);
      }
    }
  };

  return (
    <View style={s.campo}>
      <Text style={s.label}>CEP</Text>
      <View style={s.linha}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          value={cep}
          onChangeText={handleCep}
          placeholder="00000-000"
          keyboardType="numeric"
          maxLength={9}
        />
        {buscando && <ActivityIndicator color="#0F6E56" style={{ marginLeft: 10 }} />}
      </View>

      {endereco && (
        <View style={s.resultado}>
          <Text style={s.resultadoTitulo}>Endereço encontrado</Text>
          {/* Bairro editável — usuário pode corrigir */}
          <TextInput
            style={s.input}
            value={endereco.bairro}
            onChangeText={v => setEndereco(e => ({ ...e, bairro: v }))}
            placeholder="Bairro"
          />
          {/* Cidade e UF somente-leitura — confiáveis pelo CEP */}
          <Text style={s.cidadeUf}>{endereco.cidade} — {endereco.uf}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  campo:         { gap: 4, marginBottom: 12 },
  label:         { fontSize: 11, fontWeight: '500', color: '#5F5E5A' },
  linha:         { flexDirection: 'row', alignItems: 'center' },
  input:         { borderWidth: 1, borderColor: '#E8E8E4', borderRadius: 10, padding: 10, fontSize: 13, color: '#2C2C2A', backgroundColor: '#fff' },
  resultado:     { backgroundColor: '#E1F5EE', borderRadius: 10, padding: 10, gap: 6, marginTop: 4 },
  resultadoTitulo:{ fontSize: 11, fontWeight: '600', color: '#085041', marginBottom: 2 },
  cidadeUf:      { fontSize: 11, color: '#0F6E56', fontWeight: '500' },
});
```

### Uso no web — composable Vue

O mesmo `buscarCep` funciona direto no Vue. No web o CEP é usado no filtro da lista de pets para buscar por bairro/cidade:

```javascript
// src/composables/useCep.js
// Reexporta o mesmo hook — lógica idêntica, sem duplicação
export { buscarCep } from '../../shared/useCep.js';
// Ou copie o arquivo: a função não tem nenhuma dependência de plataforma
```

```vue
<!-- Trecho de ListaPets.vue — filtro por CEP -->
<script setup>
import { ref } from 'vue';
import { buscarCep } from '../composables/useCep.js';

const cep            = ref('');
const buscando       = ref(false);
const localCep       = ref(null);   // { bairro, cidade, uf }

const handleCep = async () => {
  const nums = cep.value.replace(/\D/g, '');
  if (nums.length !== 8) return;
  buscando.value = true;
  try {
    localCep.value = await buscarCep(nums);
    // Usa localCep.value.bairro e .cidade para filtrar a tabela
    filtros.value.cidade = localCep.value.cidade;
    await filtrar();
  } catch { localCep.value = null; }
  finally  { buscando.value = false; }
};
</script>

<template>
  <!-- Campo CEP dentro do formulário de filtros -->
  <div class="field">
    <label class="label">Filtrar por CEP</label>
    <div class="flex items-center gap-2">
      <input
        v-model="cep"
        class="input w-32"
        placeholder="00000-000"
        maxlength="9"
        @input="cep = cep.replace(/\D/g,'').replace(/(\d{5})(\d)/,'$1-$2')"
        @blur="handleCep"
      />
      <span v-if="buscando" class="text-xs text-neutral-400">buscando...</span>
      <span v-if="localCep" class="text-xs text-brand-600 font-medium">
        {{ localCep.bairro }}, {{ localCep.cidade }} — {{ localCep.uf }}
      </span>
    </div>
  </div>
</template>
```

### O que salvar no banco a partir do CEP

Ao cadastrar um pet, os campos preenchidos pelo CEP são:

```javascript
// Dentro do POST /pets — mobile envia esses campos para o Node
{
  bairro:    endereco.bairro,   // → coluna bairro (TEXT)
  cidade:    endereco.cidade,   // → coluna cidade (TEXT) — usado nos filtros
  // UF não tem coluna própria — pode ser incluída no campo endereco se quiser
  latitude,                     // → calculado pelo GPS
  longitude,                    // → calculado pelo GPS
}
```

---

## 14. Autenticação + Sessão com Cookie

Esta seção atende diretamente ao **item 6 do DAW (2 pts)** — o mais crítico que estava faltando.

### Como funciona o fluxo completo

```
Vue (login form) → POST /auth/login → Node valida no Supabase
                                     → req.session.usuario = { id, email, token }
                                     → cookie "connect.sid" enviado ao browser
                                     ↓
Vue (próximas requisições) → cookie enviado automaticamente pelo browser
                           → Node lê req.session.usuario
                           → autoriza ou rejeita a requisição
```

### Verificar sessão no Vue (composable reutilizável)

```javascript
// src/composables/useAuth.js
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const usuario = ref(null);

export function useAuth() {
  const router = useRouter();

  const verificarSessao = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { withCredentials: true }  // envia cookie automaticamente
      );
      usuario.value = data;
    } catch {
      usuario.value = null;
    }
  };

  const login = async (email, senha) => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email, senha },
      { withCredentials: true }
    );
    await verificarSessao();
    router.push('/');
  };

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    usuario.value = null;
    router.push('/login');
  };

  return { usuario, login, logout, verificarSessao };
}
```

### Guard de rotas (redireciona se não autenticado)

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

const routes = [
  { path: '/login',          component: () => import('../pages/Login.vue') },
  { path: '/cadastro',       component: () => import('../pages/Cadastro.vue') },
  { path: '/',               component: () => import('../pages/Mapa.vue'),         meta: { requerAuth: true } },
  { path: '/heatmap',        component: () => import('../pages/Heatmap.vue'),       meta: { requerAuth: true } },
  { path: '/clusters',       component: () => import('../pages/Clusters.vue'),      meta: { requerAuth: true } },
  { path: '/dashboard',      component: () => import('../pages/Dashboard.vue'),     meta: { requerAuth: true } },
  { path: '/analise',        component: () => import('../pages/Analise.vue'),        meta: { requerAuth: true } },
  { path: '/pets',           component: () => import('../pages/ListaPets.vue'),     meta: { requerAuth: true } },
  { path: '/perfil',         component: () => import('../pages/Perfil.vue'),        meta: { requerAuth: true } },
  { path: '/perfil/editar',  component: () => import('../pages/EditarPerfil.vue'),  meta: { requerAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

// Verifica sessão antes de acessar rotas protegidas
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requerAuth) return next();
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
    next();
  } catch {
    next('/login');
  }
});

export default router;
```

> **No mobile (Expo):** o app usa Supabase Auth direto (JWT + AsyncStorage). A sessão com cookie é exclusiva do backend web, pois browsers gerenciam cookies automaticamente.

---

## 15. Estrutura de Pastas

```
peteco/
├── peteco-mobile/              # App React Native Expo
│   ├── app/
│   │   ├── _layout.jsx         # Tabs raiz
│   │   ├── (tabs)/
│   │   │   ├── feed.jsx        # Tela 4
│   │   │   ├── mapa.jsx        # Tela 7
│   │   │   ├── cadastrar.jsx   # Tela 6
│   │   │   ├── meus-pets.jsx   # Tela 9
│   │   │   └── perfil.jsx      # Tela 10
│   │   ├── auth/
│   │   │   ├── login.jsx       # Tela 2
│   │   │   └── cadastro.jsx    # Tela 3
│   │   ├── pet/[id].jsx        # Tela 5
│   │   └── busca.jsx           # Tela 8
│   ├── components/
│   │   ├── CardPet.jsx
│   │   └── BotaoCamera.jsx
│   ├── hooks/
│   │   └── useCep.js           # Busca de endereço por CEP (BrasilAPI + ViaCEP)
│   ├── lib/supabase.js
│   └── .env
│
├── peteco-web/                 # Dashboard Vue 3 + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.vue       # Tela 1
│   │   │   ├── Cadastro.vue    # Tela 2
│   │   │   ├── Mapa.vue        # Tela 3
│   │   │   ├── Heatmap.vue     # Tela 4
│   │   │   ├── Clusters.vue    # Tela 5
│   │   │   ├── Dashboard.vue   # Tela 6
│   │   │   ├── Analise.vue     # Tela 7 — estatísticas numéricas B2G
│   │   │   ├── ListaPets.vue   # Tela 8
│   │   │   ├── Perfil.vue      # Tela 9
│   │   │   └── EditarPerfil.vue # Tela 10
│   │   ├── components/
│   │   │   ├── NavBar.vue
│   │   │   ├── FooterSite.vue
│   │   │   ├── CamadaHeatmap.vue
│   │   │   └── CartaoSimilar.vue   # Pets similares (Anthropic Vision)
│   │   ├── composables/
│   │   │   ├── useAuth.js
│   │   │   └── useCep.js       # Busca de endereço por CEP
│   │   ├── router/index.js
│   │   └── App.vue
│   └── .env
│
├── peteco-backend/             # Node.js + Express
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── auth.js         # login, logout, /me — sessão + cookie
│   │   │   ├── pets.js
│   │   │   └── analise.js
│   │   ├── middlewares/
│   │   │   └── auth.js
│   │   └── lib/supabase.js
│   ├── package.json
│   └── .env
│
└── peteco-ia/                  # Microsserviço Python
    ├── app.py
    ├── clustering.py
    ├── estatisticas.py
    ├── requirements.txt
    └── .env
```

---

## 16. Fluxos Completos

### Fluxo do usuário no mobile (DAMU)

1. Abre o app → splash → tela de login
2. Faz login com email/senha (Supabase Auth)
3. Vê o feed de pets em FlatList
4. Toca em um card → detalhe do pet
5. Toca em "Cadastrar pet" → formulário com câmera e GPS
6. App captura coordenadas GPS automaticamente
7. Usuário digita o CEP → BrasilAPI retorna bairro, cidade e UF automaticamente
8. Envia `POST /pets` para o Node com JWT no header
9. Navega para o mapa e vê o pin do pet cadastrado
10. Em "Meus Pets" pode marcar como encontrado
11. Em "Perfil" edita nome e telefone

### Fluxo do dashboard web (DAW)

1. Acessa `/login` → Vue envia `POST /auth/login` para o Node
2. Node valida com Supabase → cria sessão → envia cookie
3. Browser armazena cookie automaticamente
4. Redireciona para `/` → mapa com pins em tempo real
5. Navega para `/heatmap` → densidade visual de ocorrências
6. Acessa `/clusters` → Node chama Flask → DBSCAN → clusters no mapa
7. Acessa `/analise` → estatísticas numéricas por bairro, período, espécie e criticidade
8. Consulta `/dashboard` → gráficos Chart.js + cards de estatísticas
9. Navega para `/pets` → tabela HTML completa com filtros
10. Em `/perfil` visualiza seus dados → em `/perfil/editar` edita nome, telefone e senha

### Fluxo técnico do backend (Node + Cookie)

1. `POST /auth/login` → valida no Supabase → cria `req.session.usuario`
2. Express envia cookie `connect.sid` ao browser
3. Todas as rotas protegidas verificam `req.session.usuario` via middleware
4. `POST /pets` com sessão válida → salva no Supabase com PostGIS
5. `GET /analise/clusters` → Node chama Flask → repassa JSON ao Vue

### Fluxo da IA (Flask + DBSCAN)

1. Node recebe `GET /analise/clusters`
2. Faz `GET http://peteco-ia/clusters` para o Flask
3. Flask busca lat/lng dos pets no Supabase
4. Executa DBSCAN via Scikit-learn com métrica haversine
5. Calcula centroides e criticidade por cluster
6. Retorna JSON com clusters → Node repassa para o Vue

---

## 17. Deploy Gratuito

| Plataforma | Para | Observação | Custo |
|-----------|------|-----------|-------|
| **Vercel** | Dashboard Vue | Detecta Vite automaticamente. | Grátis |
| **Render.com** | Backend Node | Web Service Node.js. Deploy via GitHub. | Grátis |
| **Render.com** | Microsserviço IA | Segundo Web Service Python. | Grátis |
| **Supabase** | Banco de dados | 500MB banco, 1GB storage, 50k usuários. | Grátis |
| **Expo Go** | App Mobile | QR code para a defesa, sem publicar na loja. | Grátis |

### Variáveis de ambiente

```bash
# peteco-backend/.env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=service_role_key_aqui
IA_SERVICE_URL=https://peteco-ia.onrender.com
SESSION_SECRET=uma-string-secreta-longa-aqui
FRONTEND_URL=https://peteco.vercel.app

# peteco-ia/.env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=service_role_key_aqui

# peteco-web/.env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=anon_key_aqui
VITE_API_URL=https://peteco-backend.onrender.com
```

> **Atenção:** O Render.com free tier "dorme" após 15 minutos sem requisições. Antes da defesa, acorde **os dois serviços** (Node e Python) com uma requisição antecipada. Cada um leva ~30s na primeira resposta.

**Custo total de infraestrutura: R$ 0,00.**

---

## 18. Cronograma 30 dias

### Semana 1 — Fundação (dias 1–7)

- [ ] Criar projeto Supabase + tabelas SQL + PostGIS + trigger lat/lng (3h)
- [ ] Setup React Native Expo + estrutura de pastas (1h)
- [ ] Setup Vue 3 + Vite + Tailwind CSS + Vue Router + Nunito (Google Fonts) (1h)
- [ ] Setup Node.js + Express + express-session + cookie-parser (2h)
- [ ] Telas de Login e Cadastro — mobile e web (4h)
- [ ] Fluxo de autenticação funcionando nas duas frentes (3h)

### Semana 2 — Funcionalidades core (dias 8–14)

- [ ] Feed de pets com FlatList no mobile (2h)
- [ ] Câmera e upload de foto no mobile (3h)
- [ ] Geolocalização GPS (lat/lng) no mobile (1h)
- [ ] Hook `useCep` — BrasilAPI + ViaCEP fallback (2h)
- [ ] Mapa com pins no Vue (vue-leaflet) (3h)
- [ ] Heatmap funcional no Vue (leaflet.heat) (3h)
- [ ] CRUD completo de pets no Node (rotas + sessão) (3h)

### Semana 3 — IA, tabelas e mídias (dias 15–21)

- [ ] Microsserviço Flask + DBSCAN em Python (4h)
- [ ] Endpoint `/analise` no Node chamando o Flask (2h)
- [ ] Visualização de clusters no mapa Vue (3h)
- [ ] Tela `/analise` com estatísticas numéricas B2G (2h)
- [ ] Endpoint `/pets/validar-foto` com Anthropic Vision (3h)
- [ ] Endpoint `/pets/buscar-similares` com Anthropic Vision (3h)
- [ ] Tela de lista de pets com tabela HTML + filtros (2h)
- [ ] Tela de perfil + editar perfil com formulário e sessão (2h)
- [ ] Gráficos Chart.js no dashboard (2h)

### Semana 4 — Polimento e deploy (dias 22–30)

- [ ] Deploy Vue no Vercel (1h)
- [ ] Deploy Node no Render.com (1h)
- [ ] Deploy Flask no Render.com (1h)
- [ ] Telas restantes do mobile (busca, mapa, perfil, editar) (4h)
- [ ] Ajustes de UI e polimento Tailwind (3h)
- [ ] Dados de teste realistas para a demo (2h)
- [ ] Documentação + slides (3h)
- [ ] Ensaio da apresentação (2h)

> **Se o tempo apertar:** a tela de editar perfil é simples (formulário + PATCH na API) e cobre os itens 2, 5 e 6 do DAW de uma vez — priorize ela antes do polimento visual geral.

---

## Possíveis dificuldades e alternativas

| Dificuldade | Alternativa mais simples |
|------------|------------------------|
| BrasilAPI retornando bairro vazio | Alguns CEPs de RR têm bairro incompleto na base dos Correios — deixe o campo editável (já está no código) para o usuário corrigir |
| `express-session` com CORS + cookie | Adicionar `credentials: true` no CORS do Node e `withCredentials: true` no axios do Vue |
| `leaflet.heat` sem wrapper Vue | Usar Leaflet puro via `onMounted` + `onUnmounted` (já mostrado na seção 11) |
| PostGIS complexo demais | Salvar lat/lng como FLOAT simples; calcular distância no Python com `geopy` |
| DBSCAN não convergindo | Aumentar `eps_km` para 2 ou 3 e reduzir `min_samples` para 2 |
| Render.com dormindo antes da defesa | `node-cron` no Node fazendo ping no Flask a cada 10 minutos |
| Expo com problemas no Android | Testar no navegador com `npx expo start --web` para a demo |
| 10 telas mobile difíceis de implementar | Tela de busca e tela de perfil são simples (formulário + chamada de API) — priorize-as |

---

*Guia gerado para o projeto PETECO — DAMU + DAW · Prof. George Oliveira · IFRR · 2 devs · 30 dias*
