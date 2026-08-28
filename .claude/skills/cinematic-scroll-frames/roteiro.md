# Roteiro-mestre — Gustavo Digital (site-filme)

> Versao 2. Substitui o roteiro de 2 imagens / 1 clipe.
> Fonte de verdade para: prompts de imagem, prompt de motion, corte ffmpeg,
> faixas de scroll e copy dos overlays. Prompts prontos em [prompts.md](prompts.md).

## Tese

O negocio existe, mas some no escuro da cidade. O site e o portal: a camera
atravessa um arco de luz e chega numa peca de vitrine — o site como objeto
de galeria. Um plano-sequencia. A camera nunca corta e nunca volta.

Tudo o que e texto e HTML. O filme nunca escreve nada.

---

## 1. As 4 imagens e os 3 clipes (encadeados)

Higgsfield gera 5s por clipe. Um clipe so nao sustenta um site inteiro.
Solucao: 4 imagens, 3 clipes encadeados — o end de um clipe e literalmente o
start do proximo. Emenda invisivel, 15s de plano-sequencia.

Universo: espaco digital escuro com piso de malha wireframe dourada ate o
horizonte, nos de luz e feixes de conexao. O portal e um anel de dados, nao um
arco de concreto. Ouro sempre, azul nunca.

| Img | Nome interno | O que e |
|---|---|---|
| A | `mundo-desconectado` | Grade wireframe escura ate o horizonte, nos apagados e isolados, sem linhas entre eles. Ao fundo, um anel de dados apagado e distante. |
| B | `rede-acesa` | Mesmo mundo, camera bem mais perto. A rede acendeu: arcos ligando os nos, pulsos correndo. O anel domina o quadro, aceso em ouro `#f2a33c`. |
| C | `dentro-do-portal` | Camera dentro da abertura do anel. Quase todo preto, so a borda de luz e filamentos passando. Frame de respiro. |
| D | `mundo-conectado` | Saida do portal: orbita baixa sobre a Terra a noite. O planeta ocupa so o terco inferior; o topo fica preto e limpo para os cards. Um no em primeiro plano queima mais forte e acende a rede em cascata. Sem painel, sem objeto no centro — os projetos reais entram em HTML por cima. |

| Clipe | Start -> End | Duracao | Movimento |
|---|---|---|---|
| C1 | A -> B | 5s | Dolly-in lento, camera na altura do peito |
| C2 | B -> C | 5s | Continua o dolly, atravessa a abertura |
| C3 | C -> D | 5s | Sai do escuro, revela a vitrine, desacelera e para |

Regras duras das imagens: mesma sala, mesmo material (concreto polido + piso
escuro), mesma temperatura de luz, mesma lente (35mm), mesma altura de camera,
16:9, sem texto, sem marca dagua, sem gente, sem neon roxo, sem laptop de banco
de imagem. So muda a posicao da camera e o que esta no centro do quadro.

Prompt de motion: so camera. Dolly-in lento e continuo, sem tremor, sem orbita,
sem corte, sem objeto novo entrando, sem arquitetura se transformando.

---

## 2. Corte em frames

24fps, 3 clipes de 5s = 360 frames. Descartar o primeiro frame de C2 e C3
(duplicado do ultimo de C1/C2) -> ~358 frames, numerados em sequencia continua
`q001...q358`.

```bash
# desktop (1600px)
ffmpeg -i c1.mp4 -vf "fps=24,scale=1600:-2" -q:v 3 tmp/a%03d.jpg
ffmpeg -i c2.mp4 -vf "fps=24,scale=1600:-2" -q:v 3 tmp/b%03d.jpg
ffmpeg -i c3.mp4 -vf "fps=24,scale=1600:-2" -q:v 3 tmp/c%03d.jpg
# renumerar a+b+c (menos o 1o de b e c) em q001.. e converter:
#   cwebp -q 72 qNNN.jpg -o qNNN.webp

# mobile (960px) -> public/filme/m/
ffmpeg -i c1.mp4 -vf "fps=12,scale=960:-2" -q:v 4 tmp-m/a%03d.jpg
```

Alvo de peso: webp q72 @1600px ~= 50-70KB. 358 frames ~= 20MB total, carregados
por lotes — o visitante nunca espera os 20MB.
Mobile: 12fps @960px ~= 179 frames ~= 4MB.

---

## 3. Playhead — o mapa do scroll

Trilha pinada: `h-[640svh]` (~1 frame a cada 18px de scroll).
`p` = `rolagem.pin` (0 -> 1).

| p | Frames | Ato | O filme | Overlay HTML |
|---|---|---|---|---|
| 0.00-0.10 | 001-036 | Hero | Sala vazia, arco longe e apagado | Kicker + h1 serif "Seu negocio. Mais presente." + CTA + hint |
| 0.10-0.25 | 036-090 | Problema | Dolly aproxima, arco ainda frio | "Antes de ser escolhido, seu negocio precisa ser encontrado." |
| 0.25-0.47 | 090-168 | Solucao | A luz sobe no arco em 4 batidas | 4 pilares acendendo (DESIGN -> VISIBILIDADE -> PERFORMANCE -> MANUTENCAO) |
| 0.47-0.60 | 168-215 | Portal | Camera entra na abertura. Quase preto | Uma linha so, serif italico: "O site que gera cliente." |
| 0.60-0.88 | 215-315 | Vitrine | Studio, escultura-site, poeira ouro | Os 5 projetos reais entrando escalonados |
| 0.88-1.00 | 315-358 | Hold | Camera parada no ultimo frame | Overlay sai. Ultimo frame vira fundo das secoes seguintes |

Nos limites entre atos o overlay anterior sai com `opacity` + `blur(6px)` +
`y:-40px` antes do proximo entrar. Nunca dois blocos de texto ao mesmo tempo.

Camadas de profundidade (o "3D" sem WebGL):

1. `z-0` frames (fixed, object-cover, dois `<img>` em buffer)
2. `z-1` vinheta radial que fecha 0->0.35 no Portal e abre na Vitrine
3. `z-2` poeira dourada (particulas CSS ja existentes)
4. `z-3` grao em `mix-blend-mode: overlay`
5. `z-10` tipografia com `.tipo-3d`

Grade de cor por ato (CSS filter no container dos frames, interpolado):
Hero `saturate(.75) brightness(.9)` -> Problema `saturate(.6)` ->
Solucao `saturate(1)` -> Portal `brightness(.55)` ->
Vitrine `saturate(1.12) contrast(1.05)`.

---

## 4. Fora do pin

Antes: abertura de carregamento (ink cheio, marca hairline, barra de progresso
ouro de 1px). So sai quando os 40 primeiros frames estao em cache.

Depois do pin, o ultimo frame congelado atras a 10% de opacidade:

1. Prova — 14+ sites no ar
2. Processo — conversa no WhatsApp -> site montado e aprovado -> no ar com manutencao
3. Investimento — R$200/mes, o que inclui, CTA
4. FAQ — acordeao
5. CTA final — "Seu negocio ja existe. Agora faca ele ser visto."
6. Rodape

Nao recomecar a camera. Nao reciclar frames aqui.

---

## 5. Motion / stack

- Playhead do filme: `rAF` + `rolagem.pin`, como ja esta em `FilmeScroll.tsx`.
  Nao trocar por Framer Motion — o loop atual e mais barato.
- Framer Motion entra so nas secoes pos-pin (`whileInView`, stagger) e em
  microinteracoes (botao magnetico, hover dos cards).
- Easings: so `--ease-premium` e `--ease-suave`.
- Lenis (`Suave`) ja cuida do scroll. Nao duplicar.

## 6. Degradacao

- `prefers-reduced-motion`: um frame estatico (o D), trilha vira `h-auto`.
- Mobile: trilha `h-[320svh]`, faixa mobile (12fps), sem vinheta animada, sem particulas.
- Conexao lenta (`saveData` / 2g / 3g): so poster + secoes.

## 7. Ordem de execucao

1. Gerar A e B no ChatGPT -> conferir continuidade lado a lado.
2. C1 no Higgsfield. So aprovar se a camera nao tremer e nada nascer no quadro.
3. Extrair o ultimo frame real do C1 e usar como start de C2. Isso mata a emenda.
4. Repetir para C3.
5. ffmpeg -> `public/filme/` e `public/filme/m/`.
6. Atualizar `lib/filme.ts` (`total`, `ext: 'webp'`, faixa mobile).
7. Trilha para 640svh, remapear as faixas de `Trilha.tsx` na tabela acima.
8. Aposentar o WebGL do pin (`Palco3D`, `trilha3d`) — o filme substitui.
