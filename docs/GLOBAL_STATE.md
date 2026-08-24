# Global state

## Configuration and persistent domain state

| Variable | Owner | Readers/writers |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_CONFIGURED`, `sb` | config | storage/sync (`sb` initialized once) |
| `categoryConfig` | state/defaults | add-device, inventory, assets, categories, Excel; categories writes |
| `devices` | state/defaults | nearly every feature/export; allocation, return, borrowing, add-device, inventory write |
| `users` | state/defaults | auth, lookup, departments, users, allocation/return/borrow; users writes |
| `allocations` | state/defaults | dashboard, allocation, exports; allocation writes |
| `returns` | state | return, exports; return writes |
| `borrows` | state/defaults | dashboard, notifications, borrowing, exports; borrowing writes |
| `activities` | state/defaults | dashboard and transaction features; transaction features write |
| `addDevLogs` | state | add-device and exports; add-device writes |
| `departments` | state/defaults | allocation, departments, users; departments writes |
| `currentUser` | auth/state | permissions and transactions; login/logout writes |

All persistent domain variables are serialized by `getStateSnapshot()`, restored by `applyStateSnapshot()`, cached by `saveData()/loadData()`, and synchronized by `loadRemoteData()/manualSync()`.

## UI and transient state

| Variable | Primary owner | Access pattern |
|---|---|---|
| `currentAdminCat` | categories | selected category tab, read/write |
| `currentDevCatKey`, `currentDevSubId` | add-device | selected device form, read/write |
| `invFilter`, `invSearch`, `invChecked` | inventory | filters and selection, read/write |
| `assetCatFilter`, `assetStatusFilter`, `assetSearch` | assets | filters, read/write |
| `allocSrcSelected`, `allocQtys` | allocation | selection/quantity, read/write |
| `retSrcSelected`, `retEmpDevices`, `retTgtIds`, `retEmpUser` | return/user lookup | return workflow, read/write |
| `brSrcSelected`, `brTgtIds`, `brQtys` | borrowing | borrow workflow, read/write |
| `retQtys` | return | số lượng thu hồi được chọn theo dòng cấp phát, read/write |
| `_saveTimer` | storage | debounced Supabase save, read/write |
| `undoStack`, `redoStack`, `stateHistoryCurrentJson` | state-history | tối đa 10 entry và tổng 25 MB; entry giữ JSON persistent state cùng byte-size/sequence, không deep clone lại khi mutation |
| `stateHistoryBatchOpen`, `stateHistoryApplying`, `stateHistorySaving` | state-history | gộp các lần save đồng bộ cùng thao tác, chống ghi lịch sử khi apply và khóa nút lúc đồng bộ |
| `_dragFieldIdx`, `window._nfs`, `window._efs` | categories | dynamic-field editor, read/write |
| `window._retTemp`, `window._brRetTemp`, `window._excelRows` | return/borrow/Excel | modal workflow payloads, read/write |

## Mutation rule retained

State remains directly mutable. The refactor does not introduce setters, copies, events, classes, modules, or schema changes. Per-feature mutation paths are summarized in `FUNCTION_MAP.md`.
