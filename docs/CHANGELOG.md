# Changelog

## 2026-08-21 — Unified asset code

- Chọn `serial` làm field chuẩn và thêm accessor tương thích `assetNo`, `asset_no`, `assetNumber`, `serialNumber` mà không tự migration.
- Hợp nhất form, required config, search/sort, giao dịch, dashboard và import/export thành một nhãn `Mã tài sản`.
- Import báo conflict theo dòng; export và template chỉ tạo một cột `Mã tài sản`.

## Unreleased — responsive Add Device navigation

- Removed the full `addDevLogs.slice().reverse().map().join()` rebuild from every Add Device tab click.
- Add-device history now renders the newest 50 rows immediately and appends remaining rows in animation-frame batches, preserving every history row and its order.
- Added constant-time unchanged-data guards for add history and the device-category grid; explicit invalidation covers category-name changes.

## Unreleased — employee lookup and holder details

- Asset detail opened from Inventory or Asset Catalog now shows holder name, employee code, department and location, including outstanding quantity allocations.
- Employee lookup now accepts name or code and resolves holders from users, imported asset metadata, live allocations and active borrows without requiring an active User record.
- Added coverage for inactive users, imported quantity assets, serial assets, quantity allocations and borrowed assets.

## Unreleased — asset employee code and Undo/Redo removal

- Added the system `Mã nhân viên` field beside `Người đứng tên` in Add/Edit Asset forms, reusing `devices[].custodianCode` and active-user lookup to synchronize name/code pairs.
- Asset Catalog search now matches both custodian names and employee codes.
- Removed the header Undo/Redo controls, in-memory history implementation, persistence hooks, transaction calls and obsolete tests.
- Preserved the single-serialization `saveData()` path and indexed product lookup optimizations introduced by `c8200ed`.

## Unreleased — shortened used-condition label

- Changed the displayed label for the existing `old` condition from `Đã qua SD` to `Cũ` across forms, badges, history, Excel and PDF output.
- Added shared condition normalization so legacy `Đã qua sd`, `used` and the new `Cũ` input resolve to the same internal `old` value without migrating persisted data.
- Added compatible condition aliases to Asset Catalog and warehouse search; legacy snapshot/source values remain unchanged in storage.

## Unreleased — device workflow performance

- Reused one serialized state snapshot across Undo/Redo comparison and local persistence, removing repeated full-state clones and serialization from each save.
- Added per-import serial and quantity-product lookup maps so Excel rows no longer scan the complete device collection one by one.
- Avoided replacing the Add Device history DOM when its generated content has not changed, reducing navigation layout and paint work.

## Unreleased — unified asset form field layout

- Standardized Add/Edit Asset forms on one responsive grid: three equal columns on desktop, two on tablet, and one on mobile.
- Kept incomplete rows at a single-column field width while allowing only section headings, dividers, and form actions to span the full row.
- Applied the same sizing to common fields and category-driven custom fields without changing their IDs, validation, data, or behavior.

## Unreleased — snapshot deletion and system custodian field

- Added Admin-only, confirmation-gated deletion for individual inventory snapshots, persisted through the existing state and compatible with Undo/Redo.
- Added the system `Người đứng tên` field to Add/Edit Asset forms without placing it in category custom fields.
- Manual holders are retained outside the default warehouse location; matching warehouse assets continue to use the current Warehouse Manager.

## Unreleased — undo/redo, Asset Catalog bulk selection and authorship

- Added responsive header Undo/Redo controls backed by bounded in-memory snapshots of the complete persisted business state.
- Every effective `saveData()` mutation creates an undo point; redo is cleared by a new mutation, controls are truly disabled when unavailable or while Supabase is saving, and manual remote refresh resets history.
- Added Asset Catalog row/select-all checkboxes, selection count, clear selection and permission-aware safe bulk deletion.
- Added the `KIVIS IT` author signature to source metadata and the shared history source file.

## Unreleased — preserve Excel asset custodians

- Import now reads and persists `Người đứng tên`, `Mã nhân viên`, and `Bộ phận` as system asset metadata.
- Assets outside the default warehouse location, including assets without a location, retain the imported custodian information and display it in Asset Catalog.
- Only assets whose normalized location matches the default warehouse location replace the imported holder with the current Warehouse Manager.

## Unreleased — warehouse membership by physical location

- Changed warehouse membership to compare the current asset location with `appSettings.defaultWarehouseLocation` after whitespace and case normalization.
- Kept workflow status independent: `available` alone no longer means that an asset is physically in the warehouse.
- Changing the default warehouse location no longer overwrites asset locations; allocation and borrowing sources require both `available` status and a warehouse location match.
- Inventory, asset aggregation, dashboard statistics, Excel statistics and immutable inventory snapshots now use the shared physical-location rule.

## Unreleased — immutable asset inventory snapshots

- Added a responsive `Kiểm kê` action beside Asset Catalog Excel export with options to create or review snapshots.
- Added aggregate or dynamically selected Asset Group scope, generated default names, operator/time/notes, and live row/quantity totals before confirmation.
- Persisted deep-copied, immutable inventory rows in the existing application snapshot without changing asset records or Supabase schema.
- Added snapshot history, read-only detail views, and Excel downloads generated from stored historical rows rather than current asset state.

## Unreleased — header-only Excel templates and persistent import failures

- Removed all example device rows from category-specific Excel import sheets while preserving the established header order, dynamic custom columns, and column widths.
- Header-only workbooks now report `Không có dữ liệu thiết bị để nhập` without creating assets.
- Persisted every rejected data row in existing activity/add-device history state with file, sheet, Excel row, device, Mã tài sản, category, operator, timestamp, failed status, and exact reason.
- Added history detail support for validation failures, unmatched sheets, and failures raised during final product creation/merge.

## Unreleased — Excel import template column order

- Fixed the first eight columns in every device import sheet to `STT`, `Mã tài sản`, `Số lượng`, `Tên TB`, `Bộ phận`, `Người đứng tên`, `Mã nhân viên`, and `Vị trí`.
- Kept the remaining system columns ahead of category-driven custom fields and prevented system-header collisions from being stored as custom data.
- Preserved header-based imports for legacy templates, including the former `Tên` header and files without `STT`.
- Marked the sample Mã tài sản cell as text and retained numeric zero during import.

## Unreleased — asset table action and allocation layout

- Kept shared View/Edit/Delete action buttons on one centered, non-wrapping row with equal dimensions in Inventory and Asset Catalog tables.
- Added a compact minimum action-column width while retaining horizontal scrolling inside table containers.
- Stacked Asset Catalog allocation badges vertically with a stable gap to prevent overlap across zoom levels and narrow viewports.

## Unreleased — Asset Group in Excel import template

- Added exactly one system `Nhóm tài sản` column to every category-specific import template sheet, with the current default group in the example row.
- Import resolves trimmed, case-insensitive group names against both default and Admin-created groups and stores the matching stable `assetGroupId`.
- Blank cells and legacy files without the column use the default group; unknown names reject the row without creating a group.
- Kept Asset Group outside dynamic field data so category field changes cannot remove or overwrite it.

## Unreleased — dynamic device fields

- Added one shared category-field renderer for Add, Edit and Asset Detail views.
- Extended category field editing with stable IDs, label/type/required/options/order/placeholder/active metadata and five supported control types.
- Kept common device fields outside category-driven rendering and preserved legacy field definitions through non-mutating read-time defaults.
- Updated Excel template/import field lookup to use active, ordered definitions and stable keys.

## Unreleased — responsive UI polish

- Kept the Borrow panel warning gradient while making its title and icon white.
- Added shared centered, wrapping action-button layout to Inventory and Asset Catalog without changing handlers or permissions.
- Replaced the Employee Lookup button's inline absolute positioning with a balanced flex search bar that remains full-width on mobile.

## Unreleased — asset catalog location display

- Fixed Asset Catalog location aggregation without changing allocation writes or persistence.
- Independent allocated assets now display the current device location with allocation fallback.
- Quantity-managed groups display one unique location directly or `Nhiều vị trí (N)` with a tooltip listing every active location.
- Location sorting now uses the same computed display value shown in the table; inactive, cancelled and fully returned allocations do not contribute locations.

## Unreleased — asset actions, notifications and sorting

- Added permission-aware View/Edit/Delete actions to the Asset Catalog by reusing Inventory modals and handlers.
- Blocked deletion for allocated, borrowed and other unfinished transactions without deleting history.
- Fixed the notification panel click-outside selector and added local-day overdue/0–3-day per-device alerts with stable badge counts.
- Connected the toolbar statistics button to the existing four-choice Asset Excel exporter.
- Added independent sortable headers to Inventory and Asset Catalog without sorting the source state arrays.

## Unreleased — default warehouse location

- Moved Warehouse Manager UI from category administration to a dedicated warehouse settings area in User Management; persisted field and behavior are unchanged.
- Added persisted `defaultWarehouseLocation` with Admin validation and batch synchronization for `available` assets only.
- Returns and borrowed-device returns now use the configured warehouse location and stop clearly when it is not configured.
- New/imported assets use the default only when no location was supplied.
- Aligned return/borrow reason columns with the first dual-list column on desktop and full width on mobile.

## Unreleased — warehouse manager and local transaction dates

- Added an Admin-only Warehouse Manager setting to the persisted application snapshot.
- Batch-sync `custodianName` only for assets with business status `available`; allocated/borrowed assets and history remain unchanged.
- New/imported and returned assets use the current warehouse manager; asset list/search and inventory Excel use the effective holder.
- Allocation, return and borrow creation forms default to the browser-local current date.
- Scoped form styles align reason, location and date controls and stack them on mobile.

## Unreleased — asset groups and allocation location

- Added dynamic Asset Groups with stable IDs, default fallback, CRUD validation and persistence.
- Added Asset Group filter/display and four XLSX report choices to the asset catalog.
- Reorganized the add-asset form into two primary three-column rows; retained type-specific fields under additional information.
- Renamed the visible Serial field to Mã tài sản without changing the `serial` key.
- Added allocation recipient synchronization and the `Vị trí mới` field.
- Allocation now stores per-line location; independent assets update holder/location without changing ID, Mã tài sản or Asset Group.
- Legacy assets missing `assetGroupId` are treated as `inventory_asset` without automatic migration.

## Unreleased — quantity-managed products

### Added

- Quy tắc serial và cộng gộp cho sản phẩm theo số lượng.
- Metadata `sourceIds` và `returnedQtys` trên phiếu cấp phát mới.
- Truy vết `allocationRefs` trên phiếu thu hồi mới.
- Thu hồi một phần và kiểm tra số lượng còn có thể thu hồi.
- Browser test cô lập cho 12 tình huống nghiệp vụ bắt buộc.

### Changed

- Thiết bị bắt buộc có serial và mọi sản phẩm có serial có số lượng 1.
- Linh kiện, Ngoại vi và Tiêu hao có thể để trống serial.
- Thêm và import sản phẩm không serial cùng danh mục/tên chuẩn hóa sẽ cộng tồn vào bản ghi nguồn.
- Cấp phát sản phẩm không serial trừ trực tiếp tồn nguồn, không tạo bản ghi tách.
- Thu hồi cộng trực tiếp về ID nguồn và cập nhật trạng thái phiếu `partial`/`returned`.

### Compatibility

- Không migration hoặc tự động dọn dữ liệu thật.
- Phiếu cũ fallback qua `groupId` hoặc danh mục+tên chuẩn hóa khi chỉ có đúng một ứng viên.

## Unreleased — feature-based file split

### Added

- Project development rules in `AGENTS.md`.
- Architecture, function, global-state, refactor-plan, and verification documentation.
- Eight ordered first-party CSS files.
- Feature-oriented classic JavaScript files in `config`, `data`, `core`, `shared`, `features`, and `export`.

### Changed

- Replaced the inline CSS block in `index.html` with ordered stylesheet links.
- Replaced the inline application JavaScript block with ordered classic script tags.

### Preserved

- All existing functions, global names, state/data shapes, HTML/DOM structure, selectors/declarations, inline handlers, behavior, initialization order, localStorage/Supabase operations, imports/exports, and UI.
- Existing locally hosted vendor dependencies and self-hosted Supabase configuration.

### Not changed

- No framework, module system, build process, optimization, feature, bug fix, schema migration, event-handler rewrite, or security change was introduced.
- `FullBackup` was not modified.
## Unreleased — lazy Add Device history

### Changed

- Removed Add Device history rendering and table DOM from the Add Device navigation, reset, save, import, and state-render flows.
- Added an explicit `Xem lịch sử` modal with real pagination (25/200/500/1000 rows).
- History rendering now cancels pending animation-frame batches and clears rendered rows when the modal closes or is replaced.
- Preserved all `addDevLogs` data and existing add/import behavior.
## Unreleased — efficient Undo/Redo

### Added

- Restored Undo and Redo controls in the application header.
- Added bounded serialized-state history that reuses the single JSON value created by each `saveData()` call.
- Added real disabled states while history is empty, applying, or saving to Supabase.

### Preserved

- Existing persistence schema, Supabase/localStorage behavior, device/import business rules, and lazy-loaded Add Device history.
## Unreleased — Undo/Redo production hardening

### Changed

- Limited combined Undo/Redo history to 10 entries and 25 MB measured from UTF-8 JSON bytes.
- Oldest cached entries are discarded first while the newest actions remain undoable.
- A persistent state larger than 25 MB continues saving normally but is excluded from history with a non-blocking warning.
- Corrected the dynamic-fields regression fixture to load the production user-lookup dependency.

## Unreleased — weekly asset dashboard

### Added

- Rebuilt Tổng quan as a Monday–Sunday weekly dashboard with date navigation, five live KPIs, seven-day movement chart, dynamic top allocation/return types, and a searchable/filterable/sortable/paginated change table.
- Added responsive two/three/five-column dashboard layouts without changing the application header or sidebar.
- Added a dedicated 17-assertion dashboard regression harness, including local-date boundaries, partial quantities, cancelled records, cache invalidation, large histories, and mobile layout.

### Changed

- Dashboard totals now use current device quantities, the configured warehouse-location rule, outstanding allocation quantities, active borrowing quantities, and normalized broken condition values.
- Successful Excel imports now add explicit `importSuccess`, `fileName`, and `sheetName` metadata to new Add Device log entries; historical records are not rewritten.
- Future full device edits and individual deletes add activity metadata so the weekly changes table can identify those operations without inferring from unrelated records.
- Dashboard weekly aggregates are cached by week and invalidated after save, load, Undo, and Redo; persistent state is not serialized an additional time.

### Preserved

- No Supabase schema, transaction business rule, Undo/Redo behavior, import validation, or existing production data was changed.
- `FullBackup/` was not modified.

## Unreleased — refined weekly dashboard metrics

### Fixed

- “Thêm trong tuần” now counts only the portion of successful add/import logs that can still be matched to a current asset by stable internal ID, with Mã tài sản as a compatibility fallback.
- Quantity-managed products are capped by the quantity still represented in the source record plus outstanding allocations, so allocation does not look like deletion and historical uncertainty cannot overstate the result.
- Duplicate add/import logs for the same current asset are grouped and capped once; failed imports remain excluded. The seven-day chart deliberately retains its historical event meaning.
- Changed the PC (Case) card to the locally available Font Awesome `fa-computer` icon.
- Replaced allocation and return rankings with aligned two-column tables (`Thiết bị`, `Số lượng`), explicit empty messages, quantity-descending/name tie-break sorting, and preserved drill-down buttons.
