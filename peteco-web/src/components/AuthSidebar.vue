<script setup>
import { PawPrint, LayoutList, Search, ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <div style="
    width:42%;min-width:320px;
    background:linear-gradient(160deg,#7C3AED 0%,#4C1D95 100%);
    display:flex;flex-direction:column;justify-content:center;
    padding:56px 52px;position:relative;overflow:hidden;
  " class="hidden md:flex">

    <!-- Círculos decorativos de fundo -->
    <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
    <div style="position:absolute;bottom:-60px;left:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>

    <!-- Logo -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:56px;">
      <div style="width:44px;height:44px;background:rgba(255,255,255,0.18);border-radius:14px;display:flex;align-items:center;justify-content:center;">
        <PawPrint :size="22" color="white" />
      </div>
      <span style="color:white;font-size:1.5rem;font-weight:900;letter-spacing:0.04em;">PETECO</span>
    </div>

    <!-- Headline -->
    <h1 style="color:white;font-size:clamp(1.6rem,2.5vw,2.25rem);font-weight:900;line-height:1.2;margin-bottom:16px;">
      Encontre e cadastre pets perdidos
    </h1>
    <p style="color:rgba(255,255,255,0.72);font-size:0.95rem;font-weight:600;line-height:1.7;margin-bottom:48px;">
      Plataforma para ajudar pets perdidos a reencontrar seus donos em Boa Vista.
    </p>

    <!-- Features -->
    <div style="display:flex;flex-direction:column;gap:20px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <LayoutList :size="18" color="white" />
        </div>
        <div>
          <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Feed por bairro</p>
          <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Pets perdidos organizados por localização</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <Search :size="18" color="white" />
        </div>
        <div>
          <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Busca avançada</p>
          <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Filtre por espécie, cidade e muito mais</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <ShieldCheck :size="18" color="white" />
        </div>
        <div>
          <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Acesso seguro</p>
          <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Conta individual com sessão protegida</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p style="position:absolute;bottom:28px;left:52px;color:rgba(255,255,255,0.35);font-size:0.75rem;font-weight:700;">
      IFRR · DAMU + DAW · 2026
    </p>
  </div>
</template>
