# Estratégias de busca gulosa e local para identificação de usuários influentes na rede social Facebook

## Organização do projeto

Os arquivos de código fonte encontram-se na pasta ./src sob a extensão .ts. O código final em javascript previamente compilado encontra-se na pasta ./dist. Este segundo, deve ser somente consultado para execução do projeto.

## Instruções de execução

Para que seja possível realizar a execução dos arquivos presentes no projeto necessário ter Node.Js instalado na máquina.

### NODE.JS

Para executar cada um dos algoritmos implementados diretamente através do Node.Js, basta executar os seguintes arquivos:

- Algoritmo guloso: node dist/greedy.js
- Hill Climbing: node dist/hill.js

### NPM ou YARN

Alguns scripts prontos também podem ser executados através da pasta raiz deste projeto:

- Algoritmo guloso: npm run greedy / yarn greedy
- Hill Climbing: npm run hill / yarn hill

### Development

Para executar este projeto em modo de desenvolvimento, é necessário instalar as dependências descritas no arquivo package.json através dos comandos "npm i" ou "yarn" e executar os seguintes scripts:

- Algoritmo guloso: npm run dev:greedy / yarn dev:greedy
- Hill Climbing: npm run dev:hill / yarn dev:hill

