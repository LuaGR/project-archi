# RAG Data Flow

Two separate processes share the same Supabase `documents` table and the same Gemini embedding model (`text-embedding-004`).

## 1. Offline Ingestion (Phase 3 — run once)

```mermaid
flowchart LR
    PDF["AWS Well-Architected PDF"]
    Loader["pdf-loader"]
    Chunker["chunker (~500 tokens)"]
    Embedder["Gemini text-embedding-004"]
    Store["Supabase pgvector"]

    PDF --> Loader
    Loader -->|"cleaned text"| Chunker
    Chunker -->|"text chunks + metadata"| Embedder
    Embedder -->|"chunks + vectors [768]"| Store
```

**Trigger:** Manual — `npm run ingest` from `scripts/rag-ingestion/`.
**Frequency:** Once, or when AWS docs are updated.

---

## 2. Runtime Search (Phase 4+ — every user request)

```mermaid
flowchart LR
    User["User prompt"]
    EmbedQ["Gemini text-embedding-004"]
    Search["Supabase: SELECT by cosine similarity"]
    Context["Top 5 relevant chunks"]
    LLM["Gemini 2.0 Flash"]
    Diagram["Mermaid diagram + explanation"]

    User -->|"text"| EmbedQ
    EmbedQ -->|"query vector [768]"| Search
    Search -->|"matching chunks"| Context
    Context --> LLM
    User --> LLM
    LLM --> Diagram
```

**Trigger:** Every API request to the Lambda.
**Key constraint:** Must use the **same** embedding model for both ingestion and search — vectors from different models are incompatible.

---

## Data Model

```mermaid
erDiagram
    DOCUMENTS {
        bigserial id PK
        text content "~500 tokens of AWS docs"
        text source "pillar or section name"
        integer chunk_index "position within source"
        vector_768 embedding "Gemini embedding"
        timestamptz created_at
    }
```

Index: `IVFFlat` on `embedding` with `vector_cosine_ops` (32 lists).
