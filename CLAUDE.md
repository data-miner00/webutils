# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Svelte MCP server

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Commands

```
npm start / npm run dev     # dev server
npm run build                # production build (static adapter)
npm run preview              # preview the production build
npm run check                # svelte-kit sync + svelte-check (type checking)
npm run check:watch          # same, in watch mode
npm run format                # prettier --write .
npm run lint                  # prettier --check . && eslint .
npm test                      # vitest --run (single pass)
npm run test:unit             # vitest (watch mode)
npx vitest run tests/lib/base64.spec.ts   # run a single test file
```

Docker: `docker build -t webutils:latest .`, or `docker-compose up -d` (`--build` to rebuild).

## Architecture

webutils is a SvelteKit 5 app built with `@sveltejs/adapter-static` — it ships as a static, client-only site (see `svelte.config.js`) and registers as a PWA via `vite-plugin-pwa` (`vite.config.ts`). There is no backend; all tools run in the browser.

**Tool pages** live at `src/routes/tools/<tool-name>/+page.svelte`, one per utility (base64-encoder-decoder, jwt-debugger, uuid, hash-generator, json-formatter, etc.). Adding a new tool route is not enough to expose it — it must also be added manually to the `navMain` array in `src/lib/components/custom/app-sidebar/app-sidebar.svelte` (title + `/tools/<name>` url) to appear in navigation/search.

**Business logic is separated from UI**: pure logic for each tool lives in `src/lib/core/<name>.ts` (e.g. `base64.ts`, `jwt.ts`, `hashing.ts`, `format-json.ts`), independent of Svelte. `+page.svelte` files import and call into these. Unit tests in `tests/lib/*.spec.ts` mirror the core files 1:1 and test the logic directly (not the components) via vitest's `node` environment project (see `vite.config.ts`).

**Components**:

- `src/lib/components/ui` — shadcn-svelte generated primitives (config/aliases in `components.json`, base color `neutral`, styles in `src/routes/layout.css`). Treat as generated; prefer regenerating/extending via shadcn-svelte conventions over hand-editing internals.
- `src/lib/components/custom` — app-specific composed components (app-sidebar, command-panel, code-editor, clipboard, timer, references, localhost, search, etc.).

**Local persistence**: features under `src/routes/manage/*` (notes, todo, links, secrets) persist data client-side via IndexedDB. `src/lib/core/Database.ts` wraps the IndexedDB connection and `IndexedDbRepository.ts` implements a generic `IRepository<T>` (getAll/getById/create/update/delete) over a given object store; each feature (`notes.ts`, `todo.ts`, `links.ts`, `secrets.ts`) builds on this generic repository.

**Path alias**: `$lib` → `src/lib` (SvelteKit convention, also aliased in `vite.config.ts` test config). Other aliases (`ui`, `hooks`, `components`, `utils`) come from `components.json` for shadcn-svelte codegen.

**Formatting**: tabs, single quotes, no trailing commas, 100 print width, with import-sorting (`@trivago/prettier-plugin-sort-imports`) and Tailwind class sorting (`prettier-plugin-tailwindcss`) — see `.prettierrc`. Run `npm run format` before committing.
