# WriteFlow AI

AI-powered writing assistant monorepo.

## Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Express.js, TypeScript, MongoDB + Mongoose, JWT |

## Project Structure

```
writeflow-ai/
├── src/                        # Next.js frontend (App Router)
│   ├── app/                    # Pages and layouts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── shared/             # Navbar, Footer, ThemeProvider
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/                    # Utility functions (cn, etc.)
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Site config, constants
├── backend/
│   └── src/
│       ├── server.ts           # Entry point
│       ├── app.ts              # Express app setup
│       ├── routes/             # Route definitions
│       ├── controllers/        # Request handlers
│       ├── models/             # Mongoose models
│       ├── middleware/         # Auth, error, validation
│       └── config/             # DB connection, env
├── .env.example                # Frontend env template
└── backend/.env.example        # Backend env template
```

## Getting Started

### 1. Environment variables

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
# Fill in the values
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 3. Run in development

```bash
# Frontend (from root)
npm run dev

# Backend (from root)
npm run backend:dev
```

Frontend runs on http://localhost:3000  
Backend runs on http://localhost:5000

## Adding shadcn/ui components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# etc.
```
