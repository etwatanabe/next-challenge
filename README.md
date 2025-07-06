# Marketplace com Next.js

Este projeto é um marketplace desenvolvido com [Next.js](https://nextjs.org), integrando autenticação, painel do vendedor, upload de imagens, pagamentos via Stripe e banco de dados PostgreSQL com Prisma.

## Funcionalidades em Destaque

- Cadastro e login de vendedores com segurança
- Painel do vendedor para gerenciar produtos e pedidos
- Upload fácil de imagens dos produtos
- Integração com Stripe para pagamentos online
- Checkout rápido e seguro para clientes
- Listagem clara e organizada dos produtos
- Banco de dados robusto (PostgreSQL) gerenciado via Prisma
- Interface moderna, responsiva e fácil de usar
- Autenticação de usuários com NextAuth.js
- Experiência de compra fluida para o cliente

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Stripe](https://stripe.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Como rodar localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/next-marketplace.git
   cd next-marketplace
   ```

2. **Crie o arquivo `.env` com base no `.env.example` e configure as variáveis:**

   ```bash
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

3. **Rodar localmente sem Docker:**
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Rode as migrações do banco:
     ```bash
     npx prisma migrate dev
     ```
   - Inicie o servidor:
     ```bash
     npm run dev
     ```

## Estrutura do Projeto

```
.
├── src/
│   ├── app/                # Rotas e páginas Next.js (App Router)
│   ├── components/         # Componentes React reutilizáveis
│   ├── core/               # Domínio: entidades, casos de uso, interfaces
│   ├── infra/              # Implementações de infraestrutura (Prisma, Stripe, etc)
│   ├── usecases/           # Casos de uso da aplicação
│   ├── utils/              # Utilitários
│   └── middleware.ts       # Middleware de autenticação e proteção de rotas
├── prisma/                 # Schema e migrações do Prisma
├── public/                 # Arquivos estáticos (inclui uploads)
├── .env.example            # Exemplo de variáveis de ambiente
└── README.md
```

## Facilidade no dia a dia com Makefile

Para facilitar a rotina de quem gerencia ou desenvolve o projeto, incluímos um **Makefile**. Ele permite executar tarefas comuns com comandos simples, sem precisar decorar instruções longas.


| Comando            | Descrição                                                                 |
|--------------------|---------------------------------------------------------------------------|
| `make up`          | Sobe todos os serviços com Docker Compose                                 |
| `make down`        | Para e remove os containers criados pelo Docker Compose                   |
| `make clean`       | Remove containers, volumes e redes do projeto (cuidado: remove dados!)    |

Esses comandos tornam o uso do projeto mais prático, mesmo para quem não é da área técnica. Basta rodar o comando desejado no terminal e pronto!

---

## Como instalar o Make

O **make** é uma ferramenta que ajuda a automatizar comandos. Veja como instalar:

### No Linux

A maioria das distribuições já vem com o make instalado. Se não tiver, basta rodar:

```bash
sudo apt update
sudo apt install make
```

### No Windows

1. Baixe e instale o [Git for Windows](https://gitforwindows.org/).
2. Durante a instalação, selecione a opção para instalar o "Git Bash".
3. Abra o "Git Bash" e digite `make --version` para conferir se está disponível.
   - Se não estiver, você pode instalar o [Chocolatey](https://chocolatey.org/) e rodar:
     ```bash
     choco install make
     ```

Pronto! Agora você pode usar todos os comandos do Makefile normalmente.

---

## Observações importantes

- **Uploads de imagens:** Os arquivos enviados são salvos em `public/uploads`. Em produção, recomenda-se usar um serviço externo (ex: S3) para persistência.
- **Pagamentos:** Para testar pagamentos, utilize as chaves de teste do Stripe.
- **Banco de dados:** O projeto utiliza PostgreSQL.
