# Next Challenge - Marketplace com Next.js

Este projeto é um marketplace desenvolvido com [Next.js](https://nextjs.org), integrando autenticação, painel do vendedor, upload de imagens, pagamentos via Stripe e banco de dados PostgreSQL com Prisma.

## Funcionalidades

- Cadastro e login de vendedores
- Dashboard para gerenciamento de produtos e pedidos
- Upload de imagens de produtos
- Integração com Stripe para recebimento de pagamentos
- Checkout para clientes
- Listagem de produtos para clientes
- Banco de dados PostgreSQL gerenciado via Prisma ORM
- Interface responsiva e moderna

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
   git clone https://github.com/seu-usuario/next-challenge.git
   cd next-challenge
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

## Observações importantes

- **Uploads de imagens:** Os arquivos enviados são salvos em `public/uploads`. Em produção, recomenda-se usar um serviço externo (ex: S3) para persistência.
- **Pagamentos:** Para testar pagamentos, utilize as chaves de teste do Stripe.
- **Banco de dados:** O projeto utiliza PostgreSQL.
