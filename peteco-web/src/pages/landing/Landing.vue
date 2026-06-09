<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PawPrint, MapPin, BrainCircuit, BarChart2 } from 'lucide-vue-next'
import { useAnalise } from '../../modules/analise/controllers/useAnalise.js'

const router = useRouter()
const { stats, loading, buscar } = useAnalise()

onMounted(async () => {
  if (localStorage.getItem('peteco_usuario')) {
    router.replace('/feed')
    return
  }
  await buscar()
})

const total = computed(() => (stats.value?.total_perdidos ?? 0) + (stats.value?.total_encontrados ?? 0))
const taxaRetorno = computed(() => {
  const t = total.value
  return t > 0 ? Math.round(((stats.value?.total_encontrados ?? 0) / t) * 100) : 0
})
</script>

<template>
  <!-- Hero -->
  <section style="
    background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
    width: 100%;
    padding: 96px 24px 80px;
    text-align: center;
  ">
    <div style="max-width: 720px; margin: 0 auto;">
      <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.15);border-radius:999px;padding:8px 20px;margin-bottom:28px;">
        <PawPrint :size="20" style="color:#fff" />
        <span style="color:#fff;font-weight:900;font-size:14px;letter-spacing:0.12em;">PETECO</span>
      </div>

      <h1 style="color:#fff;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.15;margin-bottom:20px;">
        Pets encontram o caminho de volta
      </h1>

      <p style="color:rgba(255,255,255,0.82);font-size:1.1rem;line-height:1.65;max-width:560px;margin:0 auto 40px;font-weight:600;">
        Plataforma de gestão e análise de pets perdidos em Boa Vista, RR.
        Mapa interativo, clusters IA e estatísticas em tempo real.
      </p>

      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <RouterLink
          to="/login"
          style="
            background:#fff;color:#7C3AED;font-weight:900;font-size:0.95rem;
            padding:12px 32px;border-radius:14px;text-decoration:none;
            box-shadow:0 4px 14px rgba(0,0,0,0.15);
            transition:transform 0.15s,box-shadow 0.15s;
          "
          onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.15)'"
        >
          Entrar
        </RouterLink>
        <RouterLink
          to="/cadastro"
          style="
            background:transparent;color:#fff;font-weight:900;font-size:0.95rem;
            padding:12px 32px;border-radius:14px;text-decoration:none;
            border:2px solid rgba(255,255,255,0.6);
            transition:border-color 0.15s,background 0.15s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.1)';this.style.borderColor='#fff'"
          onmouseout="this.style.background='transparent';this.style.borderColor='rgba(255,255,255,0.6)'"
        >
          Criar conta
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section style="background:#fff;padding:64px 24px;">
    <div style="max-width:900px;margin:0 auto;text-align:center;">
      <p style="font-size:0.8rem;font-weight:800;letter-spacing:0.12em;color:#A099B0;text-transform:uppercase;margin-bottom:40px;">
        Números reais da plataforma
      </p>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
        <!-- Total -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <span style="font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#7C3AED;line-height:1;">
            {{ loading ? '—' : total }}
          </span>
          <span style="font-size:0.875rem;font-weight:700;color:#6B6578;">Total de pets cadastrados</span>
        </div>
        <!-- Encontrados -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <span style="font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#2EBD7A;line-height:1;">
            {{ loading ? '—' : (stats?.total_encontrados ?? 0) }}
          </span>
          <span style="font-size:0.875rem;font-weight:700;color:#6B6578;">Pets encontrados</span>
        </div>
        <!-- Taxa -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <span style="font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#3B82F6;line-height:1;">
            {{ loading ? '—' : taxaRetorno + '%' }}
          </span>
          <span style="font-size:0.875rem;font-weight:700;color:#6B6578;">Taxa de retorno</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section style="background:#F7F5FB;padding:72px 24px;">
    <div style="max-width:900px;margin:0 auto;">
      <p style="font-size:0.8rem;font-weight:800;letter-spacing:0.12em;color:#A099B0;text-transform:uppercase;text-align:center;margin-bottom:10px;">
        Recursos
      </p>
      <h2 style="font-size:clamp(1.6rem,3vw,2.25rem);font-weight:900;color:#1A1626;text-align:center;margin-bottom:48px;">
        Tudo que você precisa para encontrar um pet
      </h2>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;">
        <!-- Feature 1 -->
        <div style="background:#fff;border-radius:20px;padding:32px 24px;border:1.5px solid #E5E0F0;box-shadow:0 2px 8px rgba(59,31,110,0.05);">
          <div style="width:48px;height:48px;background:#EDE9FE;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <MapPin :size="24" style="color:#7C3AED" />
          </div>
          <h3 style="font-size:1rem;font-weight:900;color:#1A1626;margin-bottom:10px;">Mapa interativo</h3>
          <p style="font-size:0.875rem;color:#6B6578;font-weight:600;line-height:1.6;">
            Visualize todos os pets perdidos em Boa Vista com marcadores geolocalizados.
          </p>
        </div>

        <!-- Feature 2 -->
        <div style="background:#fff;border-radius:20px;padding:32px 24px;border:1.5px solid #E5E0F0;box-shadow:0 2px 8px rgba(59,31,110,0.05);">
          <div style="width:48px;height:48px;background:#EFF6FF;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <BrainCircuit :size="24" style="color:#3B82F6" />
          </div>
          <h3 style="font-size:1rem;font-weight:900;color:#1A1626;margin-bottom:10px;">Análise de Clusters</h3>
          <p style="font-size:0.875rem;color:#6B6578;font-weight:600;line-height:1.6;">
            Algoritmo DBSCAN identifica regiões críticas de concentração de pets perdidos.
          </p>
        </div>

        <!-- Feature 3 -->
        <div style="background:#fff;border-radius:20px;padding:32px 24px;border:1.5px solid #E5E0F0;box-shadow:0 2px 8px rgba(59,31,110,0.05);">
          <div style="width:48px;height:48px;background:#ECFDF5;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <BarChart2 :size="24" style="color:#2EBD7A" />
          </div>
          <h3 style="font-size:1rem;font-weight:900;color:#1A1626;margin-bottom:10px;">Estatísticas B2G</h3>
          <p style="font-size:0.875rem;color:#6B6578;font-weight:600;line-height:1.6;">
            Dashboard completo com métricas de retorno, espécie e distribuição geográfica.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer style="background:#1A1626;padding:32px 24px;text-align:center;">
    <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;font-weight:700;letter-spacing:0.08em;">
      PETECO · IFRR · DAMU + DAW · 2026
    </p>
  </footer>
</template>
