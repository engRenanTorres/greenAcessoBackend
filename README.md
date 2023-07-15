# Candidato Dev. Renan Torres

Trabalho do [Renan Torres](https://www.linkedin.com/in/eng-renan-torres/) para o processo seletivo da Green Acesso na vaga de Backend Nodejs Pleno.
## Tecnologias

<img align="center" alt="Node Js" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
<img align="center" alt="Nest Js" src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/>
<img align="center" alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<img align="center" alt="mySQL" src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white"/>
<img align="center" alt="Prisma ORM" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img align="center" alt="docker" src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>

## Descrição

[Green Acesso](https://greenacesso.com.br/) Teste do processo seletivo para vaga de Backend Nodejs na Green Acesso.
## Pré-requisitos

Para rodar o app é preciso ter o [Docker](https://docs.docker.com/engine/install/) e o seu pluguin [Docker-compose](https://docs.docker.com/compose/install/).

## Lista dos Desafios Propostos pelo processo seletivo

- [x] Atividade 1: Receber arquivo csv do síndico e converter os dados para db
- [x] Atividade 2: Tratar as diferenças entre os dados da Portaria e do Financeiro
- [x] Atividade 3: Receber o pdf de boletos na ordem proposta pelo síndico e salvar em arquivos separados com nome pelo id.
- [x] Atividade 4: Criar endpoint para receber o boletos
- [x] Ativedade 4 extra: Criar opções de filtro no get boletos
- [x] Atividade 5: Criar opção relatório para gerar um retorno em base64 com a tabela de boletos
- [x] Extras propostos por mim: [Documentação](localhost:3000/api-docs)
- [x] Extras propostos por mim: Refatorações com aplicação de Princíos SOLID
- [x] Extras propostos por mim: Utilização do NestJs
- [x] Extras propostos por mim: Utilização do ORM Prisma
- [ ] Extras propostos por mim: Testes unitários (Ficou apenas encaminhado)

## Instalação

Download do app pelo git

```bash
$ git clone https://github.com/engRenanTorres/greenAcessoBackend.git
```

Edite o nome do arquivo .env.exemple. Retire o '.exemple'. Ficando só .env

Copie os arquivos boleto.pdf e boleto.csv localizados na raíz do projeto para enviar nas API das atividades sugeridas.

```bash
$ docker-compose up --build
```

## Rodando o app

Pode utilizar as apis pela própria documentação swagger.

O arquivo de boletos em csv enviado pelo síndico se encontra na raís do projeto com nome de boletos.csv

O arquivo de boletos em pdf enviado pelo síndico se encontra na raís do projeto com nome de boletos.pdf

Os arquivos pdf salvos ficam na pasta uploads/boletos

Siga a documentação para rodar o API. Coloquei os nomes sugeridos para evitar conflitos.
```bash
# development
# A documentação ficará disponível em localhost:3000/api-docs
# Pode gerenciar o bd pelo prisma client em localhost:5555
# ou pelo phpmyadmin pelo localhost:8081
# usuario root senha dbgreen
```

## Testes

```bash
# em andamento
```

## Suporte

Só me procurar [meu linkedin](https://www.linkedin.com/in/eng-renan-torres/).

## Stay in touch

- Author - [Renan Torres](https://www.linkedin.com/in/eng-renan-torres/)

#
