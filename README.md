# Paid Media LatAm 2026 YTD — Diagnóstico e plano

Relatório interno · análise consolidada Jan 1 – 25 Mai 2026 · 13 business units · Thomson Reuters LatAm.

## Conteúdo

Página estática (HTML/CSS/JS sem build) com:

- Diagnóstico executivo · distribuição por BU
- 11 padrões cruzados invisíveis
- Plano por business unit (12 cards · hoje vs recomendado)
- Channel mix por BU · ativar / escalar / manter / pausar com tags ToFu/MoFu/BoFu
- Movimentos estruturais cruzados
- Plano de 90 dias
- Budget shift consolidado

## Stack

- HTML + CSS + JS vanilla
- Fonte Clario carregada localmente em `assets/fonts/`
- Identidade visual Thomson Reuters · cores e tipografia conforme brand guidelines
- Animações via IntersectionObserver e CSS transitions

## Como rodar local

Não tem build. Abra `index.html` no navegador ou sirva com qualquer static server:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Deploy

Página estática · qualquer provider funciona. Configurado para Vercel via auto-detect (sem `vercel.json` necessário).

## Confidencialidade

Documento de uso interno Thomson Reuters. Acesso ao deploy protegido por password via Vercel Deployment Protection.
