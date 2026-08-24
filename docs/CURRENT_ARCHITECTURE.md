# Current architecture

Thông báo dùng panel `#notifPanel` và nút duy nhất `#notifBtn`. Listener click-outside tham chiếu đúng nút này; trước đây selector `.notif-btn` lấy nút báo cáo đầu tiên nên click chuông vừa mở xong lại đóng do bubbling.

Hai bảng giữ state giao diện riêng: `invSort` và `assetSort`. Kiểm tra kho hỗ trợ Tên, Mã tài sản, Category, Loại, Tình trạng, Số lượng, Vị trí. Danh mục tài sản hỗ trợ Mã tài sản, Tên, Category, Nhóm tài sản, Loại, Phân bổ, Tổng số lượng, Vị trí và Người đứng tên. Chuỗi xử lý là dữ liệu gốc → tìm kiếm/quyền → bộ lọc → sao chép/tổng hợp → sort → render.

Nút báo cáo trên toolbar và nút trong Danh mục tài sản đều gọi `openAssetExport()` rồi `exportAssetsExcel()`; không có nhánh xuất riêng.

## Runtime model

The application is a static single page with no build step. `index.html` contains ten sections (`dash`, `allocate`, `return`, `borrow`, `addDev`, `inventory`, `assets`, `lookup`, `adminCat`, `adminUsers`) and two shared modals. Navigation hides/shows these existing sections.

Classic scripts share one global lexical environment and load synchronously at the end of `body`. This preserves access from inline event handlers and preserves the original execution order.

## Load order

1. Font Awesome CSS and eight first-party CSS files.
2. Static HTML, including inline handlers.
3. XLSX vendor bundle.
4. Supabase vendor bundle.
5. Supabase configuration.
6. Default data factories and global state.
7. Authentication, persistence, shared helpers, and navigation.
8. Feature scripts in their original source order.
9. Import/export scripts in their original source order.
10. `core/app.js`, which defines and invokes `init()` and registers the final document click handler.

## Persistence and external dependencies

- `localStorage.itams_v4`: complete state snapshot.
- `localStorage.itams_session`: employee code for automatic login.
- Supabase JS: client creation and a single `app_state` row with id `main`.
- SheetJS/XLSX: Excel template, import, inventory/history/statistical exports.
- PDF output has no PDF library. It opens a browser window, writes printable HTML, and calls `window.print()`.
- Font Awesome is served locally. No application font file is loaded; the existing font fallback remains unchanged.

## Rendering and data flow

Feature handlers mutate shared global arrays/objects, call `saveData()`, then call one or more render functions. `renderEverything()` intentionally remains the original list of render callbacks. No event system, store abstraction, or data model was introduced during the split.

## Weekly dashboard aggregation

`features/dashboard.js` builds a read-only Monday–Sunday view from existing state. Current KPIs read `devices`, outstanding non-serial quantities in `allocations`, active `borrows`, the normalized condition helper, and `isDeviceInWarehouse()`. Weekly movement treats allocation, return, borrow, and borrow-return documents as primary sources; Add Device logs supply add/import rows, while activity metadata supplies edit/delete rows. Cancelled documents and failed imports do not contribute to successful movement totals.

Aggregates are cached by local week key with a small bounded cache. `saveData()` and `applyStateSnapshot()` invalidate the cache, so normal mutations, state loading, Undo, and Redo cannot leave stale dashboard values. Cache invalidation neither changes the persistent snapshot nor adds another `JSON.stringify` pass.

The renderer creates only the current ten-row change-table page. Search, operation filter, sort, pagination, and week navigation reuse the cached aggregate instead of rebuilding thousands of DOM rows.

## Inline handlers

Static HTML calls authentication, navigation, export, allocation, return, borrowing, device, inventory, asset, lookup, category, department, user, modal, notification, and sync functions. Generated HTML additionally calls detail, edit/delete, quantity, return-borrow, print, field drag/drop, and confirmation functions. These remain classic global function declarations; inline handler text was not changed.
