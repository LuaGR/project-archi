# Risk Register: Project Archi

**Status:** Active
**Last Updated:** 2026-02-21
**Owner:** Engineering Team

---

## Risk Matrix

| ID | Risk | Likelihood | Impact | Severity | Mitigation | Owner | Status |
|----|------|------------|--------|----------|------------|-------|--------|
| R1 | Gemini 3 Flash rate limits during Golden Set testing | Medium | Medium | 🟡 | Mock during development (ADR-005). Run Golden Set tests as a separate CI step with rate limiting. | `@quality-guardian` | Open |
| R2 | Supabase free tier pgvector performance on large doc sets | Low | Low | 🟢 | Chunk size and index tuning. Migration path to Aurora documented in ADR-002. | `@infra-hacker` | Open |
| R3 | Lambda cold start exceeds 15s target with full adapter init | Medium | High | 🔴 | Composition Root caching (warm starts). Measure in Phase 9. Fallback: provisioned concurrency (breaks $0 budget — deferred). | `@cloud-engineer` | Open |
| R4 | LangGraph self-correction loop doesn't converge | Medium | Medium | 🟡 | Cap iterations in `GraphState` (e.g., max 3). Throw `InvalidMermaidSyntaxError` on exhaustion. Test in Phase 4. | `@app-orchestrator` | Open |
| R5 | Mermaid.js client-side rendering breaks on complex diagrams | Low | Low | 🟢 | Constrain diagram complexity in the LLM prompt. Graceful fallback in `MermaidRenderer`. | `@frontend-architect` | Open |

---

## Severity Legend

| Severity | Meaning |
|----------|---------|
| 🔴 | High — requires immediate mitigation plan |
| 🟡 | Medium — monitor and mitigate before affected phase |
| 🟢 | Low — acceptable risk with basic mitigation |

---

## Status Values

- **Open** — Risk identified, mitigation planned but not yet executed
- **Mitigated** — Mitigation in place, risk reduced to acceptable level
- **Materialized** — Risk occurred, incident response active
- **Closed** — Risk no longer applicable
