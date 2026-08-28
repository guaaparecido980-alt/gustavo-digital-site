---
name: cinematic-scroll-frames
description: Builds Apple-style scroll-driven sites from Higgsfield video split into ffmpeg frames, with HTML overlays timed to scroll. Use when the user mentions Higgsfield, ffmpeg frames, site em video, canvas de frames, Apple scroll, ChatGPT start/end images, or converting a video into a pinned scroll experience.
---

# Site cinematografico em frames

Pipeline obrigatorio desta marca: **4 imagens ChatGPT -> 3 clipes Higgsfield
encadeados -> ffmpeg frames -> Next.js pin+scrub**. O 3D WebGL atual
(anel/notebook) e o prototipo; o filme em frames e o wow principal.

## Regras duras

- **Um plano-sequencia.** Mesmo espaco, mesmos materiais, mesma luz, mesma
  lente. So a camera anda. Higgsfield falha quando start e end sao mundos
  diferentes.
- **Clipes encadeados.** O start de cada clipe e o ultimo frame REAL do clipe
  anterior (extraido com ffmpeg), nunca a imagem do ChatGPT. E isso que apaga
  a emenda.
- **Sem texto nas imagens.** Tipografia entra so no HTML (Clash Display,
  Satoshi, Playfair). Texto gerado no video treme nos frames.
- **Paleta travada:** fundo `#08080a`, papel `#f1efea`, acento `#f2a33c`.
  Proibido neon roxo, cyberpunk generico, stock de laptop.
- **Um wow.** O filme no scroll. Overlays sao tipografia + CTA.
- **Mobile:** sem pin longo. Faixa de frames menor + secoes estaticas.
  `prefers-reduced-motion`: um frame estatico.
- Framer Motion / GSAP so no overlay e nas secoes pos-pin. O playhead do filme
  e `scroll progress -> indice do frame` em rAF.

## Stack deste repo

- Next.js App Router, Lenis (`Suave`), GSAP. Nao duplicar Lenis.
- Identidade em `app/globals.css` e `lib/motion.ts`. Nao inventar easing.
- Copy real em `lib/projetos.ts` e `app/page.tsx`. Nao inventar depoimento.
- Playhead atual: `lib/scroll.ts` (`rolagem.pin`) + `components/FilmeScroll.tsx`.

## Arquivos

- [roteiro.md](roteiro.md) — atos, faixas de scroll, copy, ffmpeg, degradacao.
- [prompts.md](prompts.md) — os 4 prompts de imagem e os 3 de motion, prontos.

Quando o usuario pedir prompts de imagem, ler os dois antes de escrever.
Prompts sempre em ingles, cinematograficos, com negativos explicitos
(no text, no watermark, no purple neon, no people).
