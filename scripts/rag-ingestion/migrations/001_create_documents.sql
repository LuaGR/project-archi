-- Enable the pgvector extension (run once in Supabase SQL editor)
CREATE EXTENSION IF NOT EXISTS vector;

-- The documents table stores embedded chunks of AWS documentation
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensures upsert idempotency — one entry per source+chunk combination
  UNIQUE(source, chunk_index)
);

-- IVFFlat index for approximate nearest neighbor (ANN) search
-- Lists = sqrt(expected_row_count). For ~1000 chunks, 32 lists is reasonable.
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 32);
