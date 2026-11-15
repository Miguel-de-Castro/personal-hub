# Landing page

Página estática de apresentação do Personal Hub: HTML e CSS puros, sem build, sem npm, sem JavaScript, sem CDN. Não faz parte do app (`web/` e `server/`), que roda só localmente.

## Ver localmente

Qualquer servidor estático serve, desde que a raiz seja esta pasta (os caminhos são absolutos, como `/static/styles.css`):

```bash
npx serve landing
# ou
python -m http.server 8000 --directory landing
```

## Deploy na Vercel

1. Importe o repositório em um novo projeto.
2. Em **Root Directory**, escolha `landing`.
3. **Framework Preset**: Other. Deixe Build Command e Output Directory vazios.

O `vercel.json` desta pasta define `cleanUrls` e os cabeçalhos de segurança (CSP restrita a `'self'`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` e `Cross-Origin-Opener-Policy`).

## Estrutura

- `index.html`: a página, em pt-BR, com Open Graph e Twitter card.
- `static/styles.css`: estilos, com tema claro e escuro por `prefers-color-scheme`.
- `static/img/`: capturas reais do app (dados de exemplo fictícios), em WebP.
- `static/og.png`: imagem de compartilhamento (1200x630), montada a partir de uma captura real. O `og:image` aponta para ela via `raw.githubusercontent.com`, então só passa a funcionar depois que a branch for para a `main`.
- `static/fonts/`: Geist e Geist Mono (licença SIL OFL incluída).
