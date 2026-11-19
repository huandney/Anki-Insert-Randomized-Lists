# AGENTS.md — Insert Randomized Lists (add-on + script do Anki)

Fatos estáveis deste repositório, para qualquer agente que programe nele (Claude, Codex, Antigravity…).
O método de trabalho geral vem da Coding Doctrine do usuário (`~/Projetos/coding-doctrine`); aqui ficam só os fatos deste projeto, e **a convenção de release daqui vence a da doutrina**.
O estado do trabalho em andamento fica em `STATUS.md` na raiz (local, fora do git via `.git/info/exclude`).

## O que é

Dois componentes, versionados separadamente (licença AGPLv3):

- **Add-on** (`src/addon/`, id AnkiWeb `1610249201`, versão em `manifest.json`, hoje v2.0.1, `min_point_version` 54): botão e atalho no editor que marcam uma lista como randomizada; `injector.js` roda uma vez por editor (`editor_did_init`) e estiliza cada campo ao montar (`require("anki/RichTextInput")` + `lifecycle.onMount`), no editor antigo e no novo (Preferências > Experimentos) e em campos com "editor HTML por padrão".
- **Script do cartão** (`src/card/template.html`, hoje v2.4.0, versão em `data-version`): embaralha as listas marcadas na frente e mantém a mesma ordem no verso (`sessionStorage`, chave `randomizedLists`).

## Testes

Não há suíte automatizada. Verifique assim:

- Script do cartão: renderize um cartão de verdade com o Python do Anki (`card.question(reload=True)`, `card.answer()`) numa coleção descartável. O Anki substitui `{{Campo}}` em qualquer lugar do template, inclusive dentro de comentários do `<script>`: nunca escreva sintaxe de campo nos comentários.
- Add-on: no Anki real, editor antigo **e** novo. Numa base descartável nova a janela Adicionar do editor novo não monta campo nenhum (erro JS do Anki "reading fields", mesmo sem add-ons): o teste do Adicionar só vale no Anki do usuário.
- A cópia instalada (`~/.local/share/Anki2/addons21/1610249201`) é cópia real, não symlink, e hoje é igual a `main` (fora o `meta.json` do Anki). Para testar um build, copie `src/addon/` por cima (o `meta.json` fica) e reinicie o Anki; para voltar: `git archive main:src/addon | tar -x -C ~/.local/share/Anki2/addons21/1610249201`.
- Fechar e reabrir o Anki para testar está liberado: `pgrep -f "share/anki/anki( |$)"`, `kill -TERM <pid>`, `setsid -f ~/.local/bin/anki >/dev/null 2>&1 < /dev/null`. A coleção do perfil Huandney é dado real (sincroniza com o AnkiWeb): editar notas ou tipos de nota nela exige aceite.

## README

- O README traz o script duas vezes, frente e verso (`id="back"` na tag `<script>`), além do bloco `<meta id="back">` para cartões com `{{FrontSide}}`. O bloco da frente é **idêntico** a `src/card/template.html`; o do verso difere só pelo `id="back"`. Mudou o script, atualize os dois blocos no mesmo commit. Conferir a frente:

  ```sh
  awk '/^```html/{n++;f=1;next} /^```/{f=0} f&&n==1' README.md | diff - src/card/template.html
  ```
- `docs/demo.gif` é embutido na descrição do AnkiWeb pela URL raw do GitHub: não mude o caminho.

## Release (convenção própria)

- Sem `develop`: o trabalho vai numa branch `repository-YYYY-MM-DD` e entra em `main` por **PR no GitHub** com merge commit. Docs pontuais podem ir direto em `main`.
- Code review do PR antes do merge, e aceite do usuário antes de publicar (uma release já saiu antes do review e foi apagada).
- `CHANGELOG.md` em inglês: `## [repository-YYYY-MM-DD] - YYYY-MM-DD`, `> Commits:`, seções `### Add-on (vX)` / `### Randomization Script (vX)` com bullets `**Fixed**:` / `**Changed**:` / `**Added**:`.
- Tag **leve** `repository-YYYY-MM-DD` e release com o mesmo título, via `gh release create repository-YYYY-MM-DD --target main --title repository-YYYY-MM-DD`. Notas em inglês: `## Addon (vX)` e `## Randomization Script (vX)`, cada uma com `### Improvements` / `### Fixes` / `### Changes`; componente sem mudança diz "No changes; attached again for convenience."
- Assets, sempre os dois:
  - `Insert_Randomize_List_vX.ankiaddon`: zip plano de `src/addon` (`git archive --format=zip -o Insert_Randomize_List_vX.ankiaddon HEAD:src/addon`).
  - `Randomized_Lists_vX.js`: o `template.html` sem as tags `<script>`, com cabeçalho `// Name`, `// Version` e a URL do repo.

## AnkiWeb

Publicar no AnkiWeb é ação pública: só com aceite. Faixas por versão do Anki (desde 2026-11-18): ≤2.1.49 → v1.1.0; 2.1.50–2.1.53 → v2.0.0; 2.1.54+ → v2.0.1. Subir a versão mínima exige faixa nova e um máximo explícito na anterior (o AnkiWeb recusa faixas sobrepostas). Para ver o que cada versão recebe: `curl -L 'https://ankiweb.net/shared/download/1610249201?v=2.1&p=<point>'` e ler o `manifest.json` do zip.
