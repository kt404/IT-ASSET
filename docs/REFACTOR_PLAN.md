# Refactor plan

## Constraints

This is code movement only. Preserve exact CSS declarations, JavaScript declarations/function bodies, HTML structure, data, behavior, globals, inline handlers, vendor dependencies, storage behavior, and initialization order.

## Execution

1. Preserve current work on a dedicated branch and commit; exclude `FullBackup`.
2. Inventory globals, functions, state access, handlers, dependencies, and bootstrap order.
3. Split the inline CSS into eight sequential files. Each original CSS character belongs to exactly one file; link order reconstructs the original cascade.
4. Split JavaScript at the existing section markers. Keep classic scripts and original sequence. Do not duplicate functions.
5. Compare reconstructed CSS/JS against the preserved source, syntax-check every first-party script, validate local resource paths, and run browser/static checks that the environment supports.
6. Record verified, failed, and not-verifiable checks separately.

## Adjustments to the initial proposal

- `backup-json.js` also contains add-device history/detail functions because the original `EXPORT #5` block includes them before the next feature marker. Moving them again would cease to be a strictly marker-based mechanical split.
- `excel-import.js` also owns `todayStr`, `STATUS_TXT`, `COND_TXT`, and `confirmExcelImport` because those declarations occur in that original block and later export scripts depend on them.
- CSS files are contiguous source ranges rather than selector-by-selector reorganizations. Consequently `tables.css` and `modal.css` include later neighboring component rules; this is necessary to preserve exact cascade order without rewriting declarations.

