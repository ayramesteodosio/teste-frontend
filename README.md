# Teste Front-end

Este repositório contém o desafio técnico para a vaga de Front-end na Doity.

## Instalação

- Não há dependências obrigatórias para rodar localmente — são arquivos HTML/CSS/JS estáticos.
- Recomendo servir os arquivos por um servidor HTTP simples (evita problemas com CORS e caminhos relativos).

Opções rápidas (recomendado: Live Server):

- Live Server (VS Code) — **melhor opção**

  - Instale a extensão "Live Server" no VS Code (autor: Ritwick Dey) e clique em `Go Live` no canto inferior.
  - Isso abre um servidor local e recarrega automaticamente quando você salva arquivos.

- via npm (live-server):

  ```bash
  npx live-server --port=8000
  # then open http://127.0.0.1:8000/
  ```

- Python 3 (alternativa leve):

  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000/
  ```

- Node (serve) — outra alternativa:
  ```bash
  npx serve . -l 8000
  ```

## Como rodar o projeto (preferência: Live Server)

Recomendo usar a extensão **Live Server** do VS Code para desenvolvimento — ela serve os arquivos via HTTP e atualiza o navegador automaticamente quando você salva.

Passos rápidos (Live Server):

1. Abra a pasta do projeto no VS Code: execute `code .` na raiz do repositório (opcional).
2. Instale a extensão **Live Server** (se ainda não instalou).
3. No explorador do VS Code, abra `index.html` que está logo no começo pois ele irá redirecionar para a outra página, clique com o botão direito e escolha `Open with Live Server` — ou clique em `Go Live` no canto inferior e abra a URL servida.

Observações:

- O Live Server geralmente abre em `http://127.0.0.1:5500/` ou `http://127.0.0.1:5501/` — verifique a URL mostrada pelo VS Code.
- Se preferir usar a raiz do servidor, abra `http://127.0.0.1:5500/` (ou a porta que o Live Server indicar); a página inicial redireciona automaticamente para a página de criação.

Alternativas via terminal (se não usar Live Server):

- via npm (live-server):

```bash
npx live-server --port=8000
# then open http://127.0.0.1:8000/
```

- Python 3 (alternativa leve):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

- Node (serve) — outra alternativa:

```
npx serve . -l 8000
```

Dica: para abrir diretamente a área de criação use `http://localhost:8000/pages/criar-pesquisa/index.html` (ou ajuste a porta conforme seu servidor).

Páginas relevantes:

- `/pages/criar-pesquisa/index.html` — página para criar a pesquisa.
- `/pages/editar-pesquisa/index.html` — editar pesquisa.
- `/pages/geral/index.html` — painel geral da pesquisa.
- `/pages/resultados/index.html` — resultados.

Posso abrir diretamente? (file://)

- Sim, é possível abrir arquivos HTML diretamente (`file://path/to/index.html`) sem servidor. Porém, alguns recursos podem falhar ou se comportar de forma diferente:

  - Requisições `fetch` ou APIs que usam `credentials` geralmente exigem um servidor (CORS/segurança).
  - Alguns datepickers/plugins e bibliotecas esperam carregar recursos via HTTP e funcionam melhor quando servidos.
  - Caminhos relativos e rotas que dependem de `location.pathname` podem não corresponder exatamente.

- Por isso recomendo usar Live Server / `npx live-server` / `python3 -m http.server` para garantir comportamento mais próximo ao ambiente de produção.

## Vídeo explicativo

- Vídeo: (Pendente)

## Observações e dicas

- Se alguma rota retornar `Cannot GET /path`, isso indica que o servidor respondeu com 404 antes do JavaScript rodar. Em alguns casos isso pode ser causado por um resquício de requisição.
- Caso redirecione para página de login poderá ser feito o mesmo sem problemas, assim que o fizer pode voltar a página do teste e tentar efetuar novamente a ação.

---
