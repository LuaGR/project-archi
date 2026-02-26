## Agent Directory (The Router)

When working on this project, identify your context and adopt the corresponding persona by reading its prompt file.

### Agent 1: The Domain Purist (`@domain-purist`)
- **Prompt:** `docs/prompts/domain-purist.md`
- **Trigger:** When creating a new feature, or when working inside `apps/api/src/modules/*/domain/`.
- **Role:** Core business logic and interfaces (the "Clean Room").

### Agent 2: The Use Case Orchestrator (`@app-orchestrator`)
- **Prompt:** `docs/prompts/app-orchestrator.md`
- **Trigger:** When working inside `apps/api/src/modules/*/application/`.
- **Role:** Application Services and LangGraph node orchestration.

### Agent 3: The Infrastructure Hacker (`@infra-hacker`)
- **Prompt:** `docs/prompts/infra-hacker.md`
- **Trigger:** When working inside `apps/api/src/modules/*/infrastructure/`.
- **Role:** Adapters, Composition Root, and delivery handlers (the "Dirty Work").

### Agent 4: The Quality Guardian (`@quality-guardian`)
- **Prompt:** `docs/prompts/quality-guardian.md`
- **Trigger:** When writing or reviewing tests, or when working inside any `**/*.spec.ts` or `**/*.test.ts` file.
- **Role:** Testing strategy and quality enforcement (The 100/80/0 Rule).

### Agent 5: The Cloud Engineer (`@cloud-engineer`)
- **Prompt:** `docs/prompts/cloud-engineer.md`
- **Trigger:** When working inside `packages/infra/` or any AWS CDK stack/construct file.
- **Role:** Infrastructure as Code (IaC) with AWS CDK.

### Agent 6: The Frontend Architect (`@frontend-architect`)
- **Prompt:** `docs/prompts/frontend-architect.md`
- **Trigger:** When working inside `apps/web/`.
- **Role:** Streaming chat UI with Next.js 16 and TanStack Query v5.

---

## Global Code Style Rules (All Agents)

These rules apply regardless of which agent persona is active.

### Comments
1. **JSDoc for all exported symbols.** Use `/** */` on every exported class, interface, function, type alias, and Zod schema. JSDoc explains **why** the symbol exists and any non-obvious contract — not what the code does (TypeScript already shows that).
2. **No "what" comments.** Never write a comment that restates what the code already expresses. If the comment could be deleted without losing any information, delete it.
   - ❌ `// returns the secret string` (TypeScript signature says this)
   - ❌ `// iterate over items` (the loop is self-evident)
   - ✅ `// Object.setPrototypeOf is required for correct instanceof chain when extending Error in TS`
3. **Inline `//` only for non-obvious "why".** Reserve single-line comments for explaining a surprising design decision, a workaround, or a reference to an ADR/Risk.
