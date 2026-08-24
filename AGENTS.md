# Project instructions

This is a static, build-free IT asset management application. `index.html` owns the page markup and loads classic scripts in an intentional order.

## Preservation rules

- Keep the application build-free unless the user explicitly authorizes a migration.
- Do not add ES modules or `type="module"`; inline HTML handlers require global function bindings.
- Preserve global variable/function names, data shapes, DOM ids, CSS selectors, script order, `renderEverything()`, localStorage keys, and Supabase behavior.
- Feature code belongs in `assets/js/features`; shared DOM helpers in `assets/js/shared`; persistence/auth/bootstrap in `assets/js/core`; import/export code in `assets/js/export`.
- CSS files are loaded in cascade order. Do not reorder stylesheet links without a visual regression check.
- Vendor files (`all.min.css`, `supabase.min.js`, `xlsx.full.min.js`, webfonts) must not be reformatted.
- Never modify or delete `FullBackup` unless the user explicitly requests it.
- Preserve UTF-8 Vietnamese text. Avoid tools that decode UTF-8 as the Windows ANSI code page.

## Verification

- Run syntax checks for every first-party JavaScript file.
- Verify every local `src` and `href` target exists.
- Compare concatenated first-party CSS and JS with the preserved pre-split source when moving code.
- Clearly distinguish automated/static verification from interactive browser verification.

