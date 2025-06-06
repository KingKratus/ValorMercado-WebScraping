# ValorMercado-WebScraping

Este projeto realiza web scraping para buscar preços de produtos em supermercados online. Originalmente uma ferramenta CLI, foi expandido para incluir uma interface web com frontend em React e backend em Node.js/Express, permitindo aos usuários pesquisar produtos e opcionalmente sincronizar os resultados com uma planilha do Google Sheets.

## Arquitetura

O projeto agora segue uma arquitetura cliente-servidor:
*   **Backend:** Uma API Node.js/Express (`server.js`) que lida com as solicitações de scraping (`/api/search`) e sincronização com o Google Sheets (`/api/sync-sheets`).
*   **Frontend:** Uma aplicação React (dentro da pasta `src`, com componentes principais como `App.jsx`, `ProductSearch.jsx`) que fornece a interface do usuário para interagir com o backend.
*   **Scraper:** A lógica de scraping principal (`src/pesquisar.js` e módulos relacionados) que utiliza Puppeteer.

## Funcionalidades Principais

*   Pesquisa de preços de produtos em mercados online.
*   Interface web para inserir termos de pesquisa e visualizar resultados.
*   Sincronização dos resultados da pesquisa com uma planilha do Google Sheets.

## Utilização

### 1. Configuração do Ambiente

Antes de executar a aplicação, é necessário configurar as variáveis de ambiente, especialmente para a integração com o Google Sheets.

*   **Crie um arquivo `.env`:** Na raiz do projeto, crie um arquivo chamado `.env`.
*   **Adicione as seguintes variáveis:**

    ```env
    GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
    GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_email_de_conta_de_servico_aqui
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada_aqui_com_quebras_de_linha_literais\n-----END PRIVATE KEY-----\n"
    ```

    *   Substitua os valores de exemplo pelos seus próprios dados do Google Cloud Platform e Google Sheets.
    *   **Importante para `GOOGLE_PRIVATE_KEY`:** A chave privada deve ser colocada entre aspas duplas. As quebras de linha (`\n`) dentro da chave original (geralmente copiada de um arquivo JSON do Google) devem ser mantidas como caracteres literais `\n` (ou seja, uma barra invertida seguida pela letra 'n'). Não adicione novas linhas reais dentro das aspas.

### 2. Instalação de Dependências

Abra o terminal na raiz do projeto e execute:

```bash
npm install
```

### 3. Modos de Execução

#### a) Modo de Desenvolvimento

Para rodar o backend e o frontend simultaneamente com hot-reloading para o frontend:

```bash
npm run dev:concurrent
```

*   O servidor backend geralmente iniciará em `http://localhost:3001`.
*   O servidor de desenvolvimento Vite para o frontend geralmente iniciará em `http://localhost:5173` (o Vite indicará a URL no console).
*   Acesse a aplicação no seu navegador usando a URL fornecida pelo Vite. As chamadas de API do frontend serão automaticamente direcionadas (proxy) para o backend.

#### b) Modo de Produção (Simulado)

Para construir o frontend e servir a aplicação otimizada através do servidor Node.js:

```bash
npm run start:web
```

*   Este comando primeiro executa `npm run build` para compilar o frontend na pasta `dist`.
*   Em seguida, inicia o servidor Node.js (`node server.js`) que servirá os arquivos estáticos do frontend e a API.
*   Acesse a aplicação em `http://localhost:3001` (ou a porta configurada para o servidor Express).

### 4. Scripts Individuais (Opcional)

Você também pode executar os componentes separadamente:

*   **Servidor Backend Apenas:**
    ```bash
    npm run server
    ```
*   **Frontend Vite Dev Server Apenas:**
    ```bash
    npm run dev
    ```
*   **Construir Frontend Apenas:**
    ```bash
    npm run build
    ```

### Uso da Interface Web

1.  **Pesquisar Produtos:**
    *   Acesse a aplicação no navegador.
    *   Digite os termos de pesquisa desejados na área de texto (um por linha).
    *   Clique em "Pesquisar". Os resultados aparecerão na tabela.
2.  **Sincronizar com Google Sheets:**
    *   Após uma pesquisa bem-sucedida, clique em "Sincronizar com Google Sheets".
    *   Os dados da tabela serão enviados para a planilha configurada no `.env`.

---

### Antigo Uso (CLI - Descontinuado para novas funcionalidades)

A funcionalidade original de CLI que lia de `docs/searchFor/searchFor.txt` e salvava em JSON localmente ainda pode existir no código legado (`index.js`), mas não é o foco principal do desenvolvimento atual. O script `npm start` (ou `node index palavras`) pode ainda invocar esta funcionalidade CLI.

## Implementações Futuras

Com a interface web implementada, as próximas etapas podem incluir:

*   [ ] Salvar em um banco de dados local (além ou como alternativa ao Google Sheets).
*   [ ] Melhorias na interface do usuário e experiência.
*   [ ] Mais opções de configuração de mercado diretamente pela UI.
*   [ ] Testes automatizados.
*   [ ] Autenticação de usuário (se aplicável para cenários multiusuário).

## Nota da Versão

*   Projeto refatorado completamente para introduzir uma interface web React e um backend Express.
*   Retirado opção de pesquisa por link (do CLI original), os sites não mantém o mesmo link para os produtos, sempre estão alterando, o que torna essa opção irrelevante. (Nota original preservada)