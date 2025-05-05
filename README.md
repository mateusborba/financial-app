# Financial App

Um sistema financeiro fullstack construído com **Next.js 15**, **Prisma ORM**, **NextAuth**, **React**, **TailwindCSS** e **PostgreSQL**.

## ✨ Funcionalidades

- Cadastro e login de usuários com autenticação segura (NextAuth)
- Dashboard com saldo, histórico e ações rápidas
- Transferência de saldo entre usuários
- Adição de saldo à conta
- Histórico de transações com possibilidade de desfazer
- Tema claro/escuro (dark mode)
- Testes automatizados com Vitest e Testing Library

## 🚀 Começando

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/financial-app.git
cd financial-app
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o ambiente

Crie um arquivo `.env` baseado no exemplo abaixo:

```env
DATABASE_URL=postgresql://prisma:prisma@localhost:5432/nextdb
NEXTAUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3000
```

### 4. Suba o banco de dados com Docker

```bash
docker-compose up -d
```

### 5. Rode as migrations do Prisma

```bash
npx prisma migrate deploy
# ou para desenvolvimento:
npx prisma migrate dev
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testes

Execute todos os testes unitários:

```bash
npm run test
```

Gere o relatório de cobertura:

```bash
npm run coverage
```

---

## 🗄️ Modelo de Dados (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  lastName  String
  email     String   @unique
  password  String
  balance   Decimal  @default(500.00)
  sentTransactions     Transaction[] @relation("SentTransactions")
  receivedTransactions Transaction[] @relation("ReceivedTransactions")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Transaction {
  id          String   @id @default(uuid())
  amount      Decimal
  createdAt   DateTime @default(now())
  status      String
  senderId    String
  receiverId  String

  sender      User     @relation("SentTransactions", fields: [senderId], references: [id])
  receiver    User     @relation("ReceivedTransactions", fields: [receiverId], references: [id])
}
```

---

## 🛠️ Principais Tecnologias

- **Next.js 15** (App Router)
- **React 19**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth**
- **TailwindCSS**
- **Vitest** + **Testing Library** (testes)
- **Docker** (ambiente de banco de dados)

---

## 📂 Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor em produção
- `npm run test` — executa os testes
- `npm run coverage` — relatório de cobertura de testes
- `npm run lint` — checa problemas de lint

---

## 📦 Deploy

Você pode fazer deploy facilmente na [Vercel](https://vercel.com/) ou em qualquer ambiente que suporte Node.js e PostgreSQL.

---

## 🤝 Contribuição

Pull requests são bem-vindos! Sinta-se à vontade para abrir issues e sugerir melhorias.
