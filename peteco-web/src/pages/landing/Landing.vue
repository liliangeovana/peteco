<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PawPrint, MapPin, Search, Shield, Map, ArrowRight, Zap, LayoutList } from 'lucide-vue-next'
import { http } from '../../client/http.js'
import { useParseFoto } from '../../composables/useParseFoto.js'

const pets = ref([])
const { parsePrimeiraFoto: parseFoto } = useParseFoto()

onMounted(async () => {
  try {
    const { data } = await http.get('/pets?status=perdido')
    pets.value = data
  } catch {
    // carrossel é opcional
  }
})


const heroPets = computed(() => {
  const base = [
    { nome: 'Rex',  especie: 'cachorro', bairro: 'Mecejana',   foto_url: null },
    { nome: 'Luna', especie: 'gato',     bairro: 'Caçari',     foto_url: null },
    { nome: 'Bolt', especie: 'cachorro', bairro: 'Paraviana',  foto_url: null },
  ]
  const reais = pets.value.slice(0, 3)
  return reais.length >= 3 ? reais : base
})

const carrosselPets = computed(() => {
  const list = pets.value.length >= 4 ? pets.value.slice(0, 14) : pets.value
  return list.length > 0 ? [...list, ...list] : []
})
</script>

<template>
  <div class="landing">

    <!-- ── NAVBAR ── -->
    <header class="lp-nav">
      <div class="lp-nav-inner">
        <RouterLink to="/" class="lp-logo">
          <span class="lp-logo-icon"><PawPrint :size="16" /></span>
          PETECO
        </RouterLink>
        <div class="lp-nav-links">
          <a href="#recursos" class="lp-nav-link">Recursos</a>
          <a href="#mapa" class="lp-nav-link">Mapa</a>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <RouterLink to="/login" class="lp-btn-ghost">Entrar</RouterLink>
          <RouterLink to="/cadastro" class="lp-btn-primary">Criar conta</RouterLink>
        </div>
      </div>
    </header>

    <!-- ── HERO ── -->
    <section class="lp-hero">
      <!-- Blobs de fundo -->
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />

      <div class="lp-hero-inner">
        <!-- Esquerda -->
        <div class="lp-hero-left">
          <span class="lp-pill">
            <PawPrint :size="13" style="color:#7C3AED;" />
            Boa Vista · Roraima
          </span>

          <h1 class="lp-headline">
            O melhor lugar para encontrar seu
            <span class="lp-highlight">pet perdido</span>
            de volta
          </h1>

          <p class="lp-sub">
            Cadastre, busque e acompanhe pets perdidos na sua cidade.
            Com mapa interativo, busca por bairro e validação de fotos por IA.
          </p>

          <div class="lp-btns">
            <RouterLink to="/cadastro" class="lp-btn-hero-primary">
              Criar conta grátis
              <ArrowRight :size="16" />
            </RouterLink>
            <RouterLink to="/login" class="lp-btn-hero-ghost">
              Ver pets perdidos
            </RouterLink>
          </div>

          <!-- Stats -->
          <div class="lp-stats">
            <div class="lp-stat">
              <span class="lp-stat-num">{{ pets.length || '—' }}</span>
              <span class="lp-stat-label">pets cadastrados</span>
            </div>
            <div class="lp-stat-divider" />
            <div class="lp-stat">
              <span class="lp-stat-num">{{ pets.length > 0 ? new Set(pets.map(p => p.bairro).filter(Boolean)).size : '—' }}</span>
              <span class="lp-stat-label">bairros cobertos</span>
            </div>
            <div class="lp-stat-divider" />
            <div class="lp-stat">
              <span class="lp-stat-num" style="color:#2EBD7A;">IA</span>
              <span class="lp-stat-label">validação de fotos</span>
            </div>
          </div>
        </div>

        <!-- Direita — cards flutuantes -->
        <div class="lp-hero-right">
          <div class="lp-float-wrap">
            <!-- Card topo -->
            <div class="lp-float-card lp-fc-top">
              <div class="lp-fc-photo">
                <img v-if="parseFoto(heroPets[0]?.foto_url)" :src="parseFoto(heroPets[0]?.foto_url)" />
                <PawPrint v-else :size="22" style="color:#9B89C4;opacity:0.5;" />
              </div>
              <div class="lp-fc-info">
                <p class="lp-fc-nome">{{ heroPets[0]?.nome }}</p>
                <p class="lp-fc-bairro"><MapPin :size="10" /> {{ heroPets[0]?.bairro }}</p>
              </div>
              <span class="lp-fc-badge lp-fc-badge-red">perdido</span>
            </div>

            <!-- Card central (destaque) -->
            <div class="lp-float-card lp-fc-center">
              <div class="lp-fc-photo lp-fc-photo-lg">
                <img v-if="parseFoto(heroPets[1]?.foto_url)" :src="parseFoto(heroPets[1]?.foto_url)" />
                <PawPrint v-else :size="32" style="color:#9B89C4;opacity:0.5;" />
              </div>
              <div class="lp-fc-info">
                <p class="lp-fc-nome">{{ heroPets[1]?.nome }}</p>
                <p class="lp-fc-bairro"><MapPin :size="10" /> {{ heroPets[1]?.bairro }}</p>
              </div>
              <span class="lp-fc-badge lp-fc-badge-red">perdido</span>
            </div>

            <!-- Card base -->
            <div class="lp-float-card lp-fc-bottom">
              <div class="lp-fc-photo">
                <img v-if="parseFoto(heroPets[2]?.foto_url)" :src="parseFoto(heroPets[2]?.foto_url)" />
                <PawPrint v-else :size="22" style="color:#9B89C4;opacity:0.5;" />
              </div>
              <div class="lp-fc-info">
                <p class="lp-fc-nome">{{ heroPets[2]?.nome }}</p>
                <p class="lp-fc-bairro"><MapPin :size="10" /> {{ heroPets[2]?.bairro }}</p>
              </div>
              <span class="lp-fc-badge lp-fc-badge-red">perdido</span>
            </div>

            <!-- Accent shapes -->
            <div class="accent accent-yellow" />
            <div class="accent accent-pink" />
            <div class="accent accent-blue" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── CARROSSEL DE PETS ── -->
    <section v-if="carrosselPets.length > 0" class="lp-carousel-wrap">
      <div class="lp-carousel-label">Pets esperando por você</div>
      <div class="lp-carousel-track-wrap">
        <div class="lp-carousel-track">
          <div
            v-for="(pet, i) in carrosselPets"
            :key="i"
            class="lp-carousel-card"
          >
            <div class="lp-cc-photo">
              <img v-if="parseFoto(pet.foto_url)" :src="parseFoto(pet.foto_url)" :alt="pet.nome" />
              <PawPrint v-else :size="22" style="color:#9B89C4;opacity:0.5;" />
            </div>
            <div class="lp-cc-body">
              <p class="lp-cc-nome">{{ pet.nome }}</p>
              <p class="lp-cc-esp">{{ pet.especie }}{{ pet.raca ? ' · ' + pet.raca : '' }}</p>
              <p class="lp-cc-bairro"><MapPin :size="10" style="flex-shrink:0;" /> {{ pet.bairro || '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── MAPA ── -->
    <section id="mapa" class="lp-mapa-section">
      <div class="lp-mapa-inner">
        <!-- Visual do mapa -->
        <div class="lp-mapa-visual">
          <div class="lp-mapa-card">
            <div class="lp-mapa-pins">
              <div class="lp-pin" style="top:22%;left:35%;"><MapPin :size="22" style="color:#7C3AED;" /></div>
              <div class="lp-pin" style="top:45%;left:60%;"><MapPin :size="18" style="color:#EC4899;" /></div>
              <div class="lp-pin" style="top:65%;left:28%;"><MapPin :size="20" style="color:#3B82F6;" /></div>
              <div class="lp-pin" style="top:35%;left:72%;"><MapPin :size="16" style="color:#F59E0B;" /></div>
              <div class="lp-pin" style="top:55%;left:50%;"><MapPin :size="24" style="color:#7C3AED;" /></div>
            </div>
            <div class="lp-mapa-grid" />
            <div class="lp-mapa-badge">
              <Map :size="14" style="color:#7C3AED;" />
              <span>Boa Vista, RR</span>
            </div>
          </div>
        </div>

        <!-- Texto -->
        <div class="lp-mapa-text">
          <span class="lp-section-tag" style="color:#3B82F6;background:#EFF6FF;">
            <Map :size="12" /> Mapa interativo
          </span>
          <h2 class="lp-section-h2">Veja todos os pets perdidos no mapa</h2>
          <p class="lp-section-p">
            Visualize pets perdidos plotados no mapa de Boa Vista, filtrados por bairro.
            Cada marcador mostra foto, nome e localização — clique para ver os detalhes
            e entrar em contato com o tutor.
          </p>
          <ul class="lp-mapa-bullets">
            <li><span class="lp-bullet-dot" style="background:#7C3AED;" />Filtro por bairro em tempo real</li>
            <li><span class="lp-bullet-dot" style="background:#3B82F6;" />Marcadores com foto do pet</li>
            <li><span class="lp-bullet-dot" style="background:#2EBD7A;" />Posicionamento por GPS ou bairro</li>
          </ul>
          <RouterLink to="/login" class="lp-btn-primary lp-btn-mapa">
            Ver mapa de pets <ArrowRight :size="15" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── RECURSOS ── -->
    <section id="recursos" class="lp-features-section">
      <div class="lp-features-inner">
        <p class="lp-section-overline">Recursos</p>
        <h2 class="lp-section-h2 lp-center">Tudo que você precisa para encontrar um pet</h2>

        <div class="lp-features-grid">
          <div class="lp-feat-card">
            <div class="lp-feat-icon" style="background:#EDE9FE;">
              <LayoutList :size="22" style="color:#7C3AED;" />
            </div>
            <h3 class="lp-feat-title">Feed por bairro</h3>
            <p class="lp-feat-desc">Pets perdidos na sua região, organizados por bairro e priorizados pela sua localização.</p>
          </div>

          <div class="lp-feat-card">
            <div class="lp-feat-icon" style="background:#EFF6FF;">
              <Map :size="22" style="color:#3B82F6;" />
            </div>
            <h3 class="lp-feat-title">Mapa interativo</h3>
            <p class="lp-feat-desc">Visualize todos os pets no mapa com marcadores, fotos e filtragem em tempo real por bairro.</p>
          </div>

          <div class="lp-feat-card">
            <div class="lp-feat-icon" style="background:#ECFDF5;">
              <Search :size="22" style="color:#2EBD7A;" />
            </div>
            <h3 class="lp-feat-title">Busca avançada</h3>
            <p class="lp-feat-desc">Filtre por espécie, cidade e raça para encontrar exatamente o pet que você procura.</p>
          </div>

          <div class="lp-feat-card">
            <div class="lp-feat-icon" style="background:#FEF3C7;">
              <Shield :size="22" style="color:#F59E0B;" />
            </div>
            <h3 class="lp-feat-title">Validação por IA</h3>
            <p class="lp-feat-desc">Fotos verificadas automaticamente para garantir que mostram um animal de verdade.</p>
          </div>

          <div class="lp-feat-card">
            <div class="lp-feat-icon" style="background:#FDF2F8;">
              <Zap :size="22" style="color:#EC4899;" />
            </div>
            <h3 class="lp-feat-title">Avistamentos</h3>
            <p class="lp-feat-desc">Registre e receba avistamentos do pet perdido com notificações em tempo real para o tutor.</p>
          </div>

          <div class="lp-feat-card lp-feat-card-cta">
            <p class="lp-feat-cta-label">Pronto para começar?</p>
            <h3 class="lp-feat-cta-title">Ajude um pet a voltar para casa</h3>
            <RouterLink to="/cadastro" class="lp-btn-primary" style="margin-top:20px;display:inline-flex;align-items:center;gap:6px;">
              Criar conta grátis <ArrowRight :size="14" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="lp-footer">
      <div class="lp-footer-inner">
        <span class="lp-logo" style="opacity:0.7;">
          <span class="lp-logo-icon"><PawPrint :size="14" /></span>
          PETECO
        </span>
        <p style="color:rgba(255,255,255,0.4);font-size:0.78rem;font-weight:700;letter-spacing:0.06em;">
          IFRR · DAMU + DAW · 2026
        </p>
        <div style="display:flex;gap:16px;">
          <RouterLink to="/login"    style="color:rgba(255,255,255,0.5);font-size:0.8rem;font-weight:700;text-decoration:none;">Entrar</RouterLink>
          <RouterLink to="/cadastro" style="color:rgba(255,255,255,0.5);font-size:0.8rem;font-weight:700;text-decoration:none;">Cadastrar</RouterLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── reset / base ── */
.landing { font-family: 'Nunito', sans-serif; background: #fff; overflow-x: hidden; }

/* ── navbar ── */
.lp-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(124,58,237,0.08);
}
.lp-nav-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 24px;
  height: 62px; display: flex; align-items: center; gap: 32px;
}
.lp-logo {
  display: flex; align-items: center; gap: 8px;
  font-weight: 900; font-size: 1rem; letter-spacing: 0.1em;
  color: #7C3AED; text-decoration: none;
}
.lp-logo-icon {
  width: 30px; height: 30px; background: #EDE9FE; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; color: #7C3AED;
}
.lp-nav-links { display: flex; gap: 6px; flex: 1; }
.lp-nav-link {
  font-weight: 700; font-size: 0.875rem; color: #6B6578;
  text-decoration: none; padding: 6px 14px; border-radius: 999px;
  transition: background 0.15s, color 0.15s;
}
.lp-nav-link:hover { background: #EDE9FE; color: #7C3AED; }
.lp-btn-ghost {
  font-weight: 800; font-size: 0.875rem; color: #7C3AED;
  background: transparent; border: 2px solid #EDE9FE; border-radius: 10px;
  padding: 7px 18px; text-decoration: none; transition: border-color 0.15s;
}
.lp-btn-ghost:hover { border-color: #7C3AED; }
.lp-btn-primary {
  font-weight: 800; font-size: 0.875rem; color: #fff;
  background: #7C3AED; border-radius: 10px; padding: 8px 20px;
  text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  transition: background 0.15s, transform 0.15s;
}
.lp-btn-primary:hover { background: #6D28D9; transform: translateY(-1px); }

/* ── hero ── */
.lp-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%);
  padding: 130px 24px 90px;
}
.blob {
  position: absolute; border-radius: 50%; opacity: 0.18; pointer-events: none;
}
.blob-1 { width: 500px; height: 500px; background: #9F67FF; top: -150px; left: -100px; }
.blob-2 { width: 380px; height: 380px; background: #EC4899; bottom: -100px; right: -60px; }
.blob-3 { width: 250px; height: 250px; background: #F59E0B; top: 60px; right: 38%; }

.lp-hero-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
@media (max-width: 820px) {
  .lp-hero-inner { grid-template-columns: 1fr; }
  .lp-hero-right { display: none; }
}

/* hero left */
.lp-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 999px; padding: 6px 16px;
  font-size: 0.78rem; font-weight: 800; letter-spacing: 0.1em; color: #fff;
  margin-bottom: 24px; text-transform: uppercase;
}
.lp-headline {
  font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 900; line-height: 1.15;
  color: #fff; margin: 0 0 22px;
}
.lp-highlight {
  display: inline-block;
  background: #F59E0B;
  color: #1A1626;
  border-radius: 10px;
  padding: 2px 12px;
  margin: 0 2px;
  transform: rotate(-1deg);
}
.lp-sub {
  font-size: 1.05rem; line-height: 1.65; font-weight: 600;
  color: rgba(255,255,255,0.82); margin-bottom: 36px; max-width: 480px;
}
.lp-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.lp-btn-hero-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #fff; color: #7C3AED; font-weight: 900; font-size: 0.95rem;
  padding: 13px 28px; border-radius: 14px; text-decoration: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: transform 0.15s, box-shadow 0.15s;
}
.lp-btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }
.lp-btn-hero-ghost {
  display: inline-flex; align-items: center;
  color: #fff; font-weight: 800; font-size: 0.95rem;
  padding: 13px 28px; border-radius: 14px; text-decoration: none;
  border: 2px solid rgba(255,255,255,0.5); transition: background 0.15s, border-color 0.15s;
}
.lp-btn-hero-ghost:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

/* stats */
.lp-stats { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
.lp-stat { display: flex; flex-direction: column; gap: 2px; }
.lp-stat-num { font-size: 1.6rem; font-weight: 900; color: #fff; line-height: 1; }
.lp-stat-label { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.6); }
.lp-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); }

/* hero right — floating cards */
.lp-hero-right { display: flex; justify-content: center; align-items: center; }
.lp-float-wrap { position: relative; width: 340px; height: 380px; }

.lp-float-card {
  position: absolute; background: #fff; border-radius: 18px;
  padding: 12px 14px; display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18); width: 220px;
}
.lp-fc-top    { top: 0;    left: 0;   transform: rotate(-4deg); }
.lp-fc-center { top: 90px; left: 60px; transform: rotate(1deg); width: 240px; z-index: 2; box-shadow: 0 12px 40px rgba(124,58,237,0.25); }
.lp-fc-bottom { bottom: 10px; right: 0; transform: rotate(5deg); }

.lp-fc-photo {
  width: 44px; height: 44px; border-radius: 12px; background: #EDE9FE;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; overflow: hidden; flex-shrink: 0;
}
.lp-fc-photo img { width: 100%; height: 100%; object-fit: cover; }
.lp-fc-photo-lg { width: 52px; height: 52px; font-size: 1.8rem; }
.lp-fc-info { flex: 1; min-width: 0; }
.lp-fc-nome { font-size: 0.875rem; font-weight: 900; color: #1A1626; margin: 0 0 2px; }
.lp-fc-bairro { display: flex; align-items: center; gap: 3px; font-size: 0.72rem; font-weight: 700; color: #A099B0; }
.lp-fc-badge { font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em; flex-shrink: 0; }
.lp-fc-badge-red { background: #FEE2E2; color: #DC2626; }

/* accent shapes */
.accent { position: absolute; border-radius: 50%; }
.accent-yellow { width: 48px; height: 48px; background: #F59E0B; top: -16px; right: 20px; }
.accent-pink   { width: 32px; height: 32px; background: #EC4899; bottom: 20px; left: -12px; opacity: 0.85; }
.accent-blue   { width: 22px; height: 22px; background: #3B82F6; top: 140px; right: -10px; }

/* ── carrossel ── */
.lp-carousel-wrap { padding: 64px 0; background: #F7F5FB; overflow: hidden; }
.lp-carousel-label {
  text-align: center; font-size: 0.8rem; font-weight: 800;
  letter-spacing: 0.12em; color: #A099B0; text-transform: uppercase; margin-bottom: 28px;
}
.lp-carousel-track-wrap { overflow: hidden; }
.lp-carousel-track {
  display: flex; gap: 16px;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.lp-carousel-track:hover { animation-play-state: paused; }

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.lp-carousel-card {
  background: #fff; border-radius: 18px; width: 180px; flex-shrink: 0;
  overflow: hidden; border: 1.5px solid #E5E0F0;
  box-shadow: 0 2px 8px rgba(59,31,110,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}
.lp-carousel-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(124,58,237,0.15); }

.lp-cc-photo {
  width: 100%; aspect-ratio: 1; background: #EDE9FE;
  display: flex; align-items: center; justify-content: center; font-size: 2.4rem; overflow: hidden;
}
.lp-cc-photo img { width: 100%; height: 100%; object-fit: cover; }
.lp-cc-body { padding: 10px 12px 12px; }
.lp-cc-nome { font-size: 0.875rem; font-weight: 900; color: #1A1626; margin: 0 0 2px; }
.lp-cc-esp  { font-size: 0.72rem; font-weight: 700; color: #7C3AED; margin: 0 0 4px; }
.lp-cc-bairro { display: flex; align-items: center; gap: 3px; font-size: 0.7rem; font-weight: 700; color: #A099B0; }

/* ── mapa ── */
.lp-mapa-section { padding: 80px 24px; background: #fff; }
.lp-mapa-inner {
  max-width: 1060px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center;
}
@media (max-width: 820px) {
  .lp-mapa-inner { grid-template-columns: 1fr; }
}

.lp-mapa-visual { display: flex; justify-content: center; }
.lp-mapa-card {
  position: relative; width: 340px; height: 300px;
  background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
  border-radius: 24px; overflow: hidden;
  border: 2px solid #C4B5FD;
  box-shadow: 0 8px 32px rgba(124,58,237,0.15);
}
.lp-mapa-pins { position: absolute; inset: 0; }
.lp-pin { position: absolute; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); animation: float 3s ease-in-out infinite; }
.lp-pin:nth-child(2) { animation-delay: 0.5s; }
.lp-pin:nth-child(3) { animation-delay: 1s; }
.lp-pin:nth-child(4) { animation-delay: 1.5s; }
.lp-pin:nth-child(5) { animation-delay: 0.8s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}

.lp-mapa-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px);
  background-size: 36px 36px;
}
.lp-mapa-badge {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  background: #fff; border-radius: 999px; padding: 6px 14px;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.78rem; font-weight: 800; color: #1A1626;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  white-space: nowrap;
}

.lp-mapa-text {}
.lp-section-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em;
  padding: 4px 12px; border-radius: 999px; margin-bottom: 16px;
}
.lp-section-h2 {
  font-size: clamp(1.5rem, 2.8vw, 2.1rem); font-weight: 900;
  color: #1A1626; margin: 0 0 16px; line-height: 1.25;
}
.lp-section-p { font-size: 0.95rem; color: #6B6578; font-weight: 600; line-height: 1.7; margin-bottom: 24px; }
.lp-mapa-bullets { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; }
.lp-mapa-bullets li { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; font-weight: 700; color: #1A1626; }
.lp-bullet-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lp-btn-mapa { display: inline-flex; align-items: center; gap: 8px; }

/* ── features ── */
.lp-features-section { padding: 80px 24px; background: #F7F5FB; }
.lp-features-inner { max-width: 1060px; margin: 0 auto; }
.lp-section-overline {
  font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em;
  color: #A099B0; text-transform: uppercase; text-align: center; margin-bottom: 10px;
}
.lp-center { text-align: center; }
.lp-features-grid {
  margin-top: 48px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
@media (max-width: 900px) { .lp-features-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .lp-features-grid { grid-template-columns: 1fr; } }

.lp-feat-card {
  background: #fff; border-radius: 20px; padding: 28px 24px;
  border: 1.5px solid #E5E0F0; box-shadow: 0 2px 8px rgba(59,31,110,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-feat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(59,31,110,0.1); }
.lp-feat-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
}
.lp-feat-title { font-size: 1rem; font-weight: 900; color: #1A1626; margin: 0 0 8px; }
.lp-feat-desc  { font-size: 0.875rem; color: #6B6578; font-weight: 600; line-height: 1.6; margin: 0; }

.lp-feat-card-cta {
  background: linear-gradient(135deg, #7C3AED, #4C1D95);
  border-color: transparent;
  display: flex; flex-direction: column; justify-content: center;
}
.lp-feat-card-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(124,58,237,0.35); }
.lp-feat-cta-label { font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.65); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px; }
.lp-feat-cta-title { font-size: 1.25rem; font-weight: 900; color: #fff; margin: 0; line-height: 1.3; }

/* ── footer ── */
.lp-footer { background: #1A1626; padding: 28px 24px; }
.lp-footer-inner {
  max-width: 1060px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
</style>
