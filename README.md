# ValorMercado-WebScraping
 Procura o valor de produtos de mercado, baseado em uma lista de produtos, ou em uma lista de links, fornecidos pelo usuário em um arquivo txt.
 O resultado é salvo em um arquivo json

 Utiliza NodeJs e o plugin puppeteer para fazer as consultas.

 Implementações futuras:
 [x] Destrinchar string do título para dividir entre produto, marca, unidade
 [ ] Salvar em um banco de dados local
 [ ] Salvar em um Google Sheets
 [ ] Maiores interações pelo usuário
 [ ] Front-End

# Utilização
 
 ## Web Scraping (Linha de Comando)
 
 Para utilizar o software, liste os produtos que quer pesquisar no arquivo em ```docs/searchFor/searchFor.txt```;

 Após isso, utilize o comando abaixo:

 ```
 npm start
 ```
 
 ## Frontend + API (Aplicação Web)
 
 1. Configure as credenciais do Google Sheets:
    - Copie `.env.example` para `.env`
    - Preencha as variáveis de ambiente com suas credenciais do Google Sheets
 
 2. Inicie o servidor backend:
    ```
    npm run server
    ```
 
 3. Em outro terminal, inicie o frontend:
    ```
    npm run dev
    ```
 
 4. Acesse `http://localhost:5173` para usar a interface web

# Nota da Versão

 - Projeto refatorado completamente.
 - Retirado opção de pesquisa por link, os sites não mantém o mesmo link para os produtos, sempre estão alterando, o que torna essa opção irrelevante.