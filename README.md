# Project Archi — The Intelligent AWS Architect

An AI-native platform that automates architectural guidance based on the **AWS Well-Architected Framework**. Built with **Hexagonal Architecture** and **TDD** for enterprise-grade reliability.

## Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Orchestration  | LangGraph.js                        |
| AI Engine      | Gemini 3 Flash                      |
| Vector Store   | Supabase (PostgreSQL + pgvector)    |
| Backend        | AWS Lambda (Node.js 24.x)           |
| Frontend       | Next.js 16 + TanStack Query v5     |
| IaC            | AWS CDK                             |
| Testing        | Vitest + Playwright                 |
| Monorepo       | Turborepo                           |

## Prerequisites

- **Node.js** >= 24.0.0
- **npm** >= 10.x

## Getting Started

```bash
# Install dependencies
npm install

# Run all builds
npm run build

# Run tests
npm run test

# Start development servers
npm run dev

# Lint all workspaces
npm run lint

# Format code
npm run format
```

## Project Structure

```
project-archi/
├── apps/
│   ├── api/          # AWS Lambda backend (Hexagonal Architecture)
│   └── web/          # Next.js 16 frontend
├── packages/
│   ├── infra/        # AWS CDK stacks & constructs
│   ├── shared-schemas/ # Zod schemas shared between frontend & backend
│   └── tsconfig/     # Shared TypeScript configurations
├── scripts/
│   └── rag-ingestion/ # RAG pipeline for AWS documentation
└── docs/             # ADRs, RFCs, C4 diagrams, prompts
```

## Architecture

Project Archi follows **Hexagonal Architecture (Ports & Adapters)** organized by **Screaming Features**. See [ADR-003](docs/adr/adr-003.md) for details.

## License

[MIT](LICENSE)
