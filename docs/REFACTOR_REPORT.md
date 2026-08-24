# Refactor report

## Scope and preservation

- Preservation branch: `refactor/feature-split`.
- Preservation commit: `df9cb0b` (`chore: preserve current application before file split`).
- The pre-existing local-vendor and self-hosted Supabase changes were preserved.
- `FullBackup` was not staged, edited, moved, or deleted.
- This change only moves inline CSS/JavaScript and updates their loading tags. HTML structure, inline handlers, identifiers, global names, data, function bodies, storage keys, Supabase operations, and initialization behavior remain unchanged.

## Files created or changed

- Changed: `index.html` (inline blocks replaced by ordered local stylesheet/script references).
- Added: `AGENTS.md` and all documents in `docs/`.
- Added CSS: `variables.css`, `base.css`, `layout.css`, `components.css`, `forms.css`, `tables.css`, `modal.css`, `responsive.css`.
- Added JavaScript directories/files under `assets/js/config`, `data`, `core`, `shared`, `features`, and `export`.
- Vendor files and webfonts were not changed by the refactor.

The complete function-to-file mapping is in `FUNCTION_MAP.md`. There are 193 named functions across 28 first-party JavaScript files, with no duplicated named function.

## Intentional preservation

- Classic scripts; no ES modules and no `type="module"`.
- Existing inline event handlers, including handlers generated inside template strings.
- Existing global lexical/function environment.
- Existing `renderEverything()` body and ordering.
- Existing direct state mutation, data shapes, localStorage/Supabase snapshot behavior, export formats, print-window PDF behavior, and default data.
- Existing UI markup and CSS declaration order.
- Existing defects/security/concurrency characteristics; none were fixed in this code-movement task.

Only blank separator lines at file boundaries differ from the monolith. Automated comparison after ignoring blank-only lines confirms identical CSS/JavaScript content and order.

## Verification results

| Area | Result | Evidence/limit |
|---|---|---|
| Preservation/git | Pass | branch and commit created before refactor; `FullBackup` remains untracked and untouched |
| CSS content and cascade | Pass | reconstructed 8-file content equals preserved inline CSS after ignoring boundary blank lines |
| JavaScript content/order | Pass | reconstructed 28-file content equals preserved inline JS after ignoring boundary blank lines |
| Duplicate functions | Pass | 193 named functions; zero duplicate names |
| Local resource loading | Pass | all 39 local `src`/`href` references exist; Chrome reported no missing file |
| Syntax/global references during initialization | Pass | Chrome headless parsed/ran scripts; no observed SyntaxError or ReferenceError; `init()` reached rendered login state |
| Login UI and Vietnamese text | Pass | visually inspected 1440×1000 Chrome screenshot |
| Supabase load/sync | Pass (read/init path) | browser showed sync badge `Đã đồng bộ`; no write workflow was triggered |
| localStorage initialization/session lookup | Pass (init path) | unchanged code executed through login-state selection; mutation flows not interactively exercised |
| Login/logout/role behavior | Not interactively verified | handlers and bodies are byte-equivalent; no credentials were used in automated browser run |
| Navigation and dashboard | Not interactively verified | hidden behind authentication in test run; code and DOM handlers preserved |
| Add/edit device, inventory/assets | Not interactively verified | would mutate live state/Supabase; code preserved exactly |
| Allocation, return, borrow/return | Not interactively verified | would mutate live state/Supabase; code preserved exactly |
| Categories, departments, users | Not interactively verified | administrative mutations intentionally not run |
| Employee lookup and notifications | Not interactively verified | authenticated UI not exercised; functions preserved exactly |
| Excel import | Not interactively verified | requires user-provided file and can mutate live data |
| Excel exports | Not interactively verified | XLSX vendor loads locally and calls are preserved; downloads not triggered |
| PDF/print export | Not interactively verified | browser popup/print flow not triggered |
| Backup JSON | Not interactively verified | download not triggered; function preserved exactly |
| Restore JSON | Not present in preserved application | no restore handler/function exists in the source, so it could not be verified or invented |

Node.js is not installed in this environment, so `node --check` could not be used. Chrome's JavaScript engine parsed all synchronously loaded files and completed initialization, which provides the available syntax/runtime-load check.

## Remaining risks

- Interactive workflows should receive a manual acceptance pass using a test Supabase dataset or disconnected local-only environment before deployment.
- The current application stores the whole domain snapshot in one Supabase row; concurrent writes can overwrite one another. This is pre-existing and intentionally unchanged.
- Authentication/password handling, direct `innerHTML`, and client-visible configuration are pre-existing and intentionally unchanged.
- The first-party scripts depend on strict HTML load order; future changes must preserve the order documented in `CURRENT_ARCHITECTURE.md`.

