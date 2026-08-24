# Test report — Asset Groups

## Bổ sung — hiệu năng mở tab Thêm thiết bị

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Dữ liệu không đổi không dựng lại DOM hoặc xếp thêm frame | PASS | `performance-optimizations.test.html`: assertions 6, 9 |
| 1.000 dòng chỉ render 50 dòng mới nhất trong nhịp đầu | PASS | Assertion 8 |
| Các frame sau render đủ 1.000 dòng theo đúng thứ tự mới nhất trước | PASS | Assertion 10 |
| Save một lần serialize và lookup batch vẫn giữ nguyên | PASS | Assertions 1–5 |
| Ghi Supabase production thật | NOT RUN | Harness dùng `sb = null`; không tải config production |

## Bổ sung — modal holder và Tra cứu theo Nhân viên

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Modal Xem chung của Kiểm tra kho/Danh mục hiển thị tên, mã, bộ phận và vị trí | PASS | `system-custodian-form.test.html`: assertion 3 |
| Tìm theo tên/mã với user inactive và tài sản import số lượng | PASS | `employee-lookup.test.html`: assertions 1–2 |
| Tìm cấp phát có serial và cấp phát theo số lượng, không đếm trùng | PASS | Assertions 3–4 |
| Tìm người mượn không tồn tại trong users theo tên/mã, không đếm trùng | PASS | Assertions 5–6 |
| Ghi Supabase production thật | NOT RUN | Harness cục bộ không tải config production và không ghi dữ liệu thật |

## Bổ sung — Mã nhân viên và loại bỏ Undo/Redo

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Form Thêm/Sửa có Mã nhân viên là field hệ thống và liên kết hai chiều với Người đứng tên | PASS | `system-custodian-form.test.html`: 7 assertions |
| Danh mục tài sản tìm được theo tên và mã nhân viên | PASS | `asset-location.test.html`: assertions 19–20 |
| Header, script, transaction hook và state Undo/Redo đã được loại bỏ | PASS | Static scan first-party source; `undo-redo.test.html` đã xóa |
| Tối ưu `c8200ed`: save serialize một lần, batch lookup và DOM cache | PASS | `performance-optimizations.test.html`: 7 assertions |
| Ghi Supabase production thật | NOT RUN | Test dùng local state và `sb = null`; không tải config production |

## Bổ sung — nhãn tình trạng `Cũ`

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| `old`, `used`, `Cũ`, `Đã qua sd` cùng chuẩn hóa về `old` | PASS | `excel-asset-group.test.html`: assertions 21–22 |
| Renderer dữ liệu cũ hiển thị `Cũ` mà không mutate nguồn | PASS | Fixture legacy literal; badge dùng helper chung |
| Form/Excel/PDF không còn hard-code nhãn hiển thị cũ | PASS | Static scan first-party source; alias cũ chỉ còn trong helper tìm kiếm/import |
| Toàn bộ regression hiện có | PASS | 17 harness, 194 assertions, 0 fail |
| Ghi/migration Supabase production | NOT RUN | Không migration và không ghi dữ liệu production |

## Bổ sung — tối ưu hiệu năng luồng Thêm thiết bị và Excel

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| `saveData()` chỉ serialize state một lần; Undo/Redo giữ nguyên kết quả | PASS | `performance-optimizations.test.html`: assertions 1–4; `undo-redo.test.html`: 11/11 |
| Batch lookup giữ quy tắc serial và cộng gộp không serial | PASS | `performance-optimizations.test.html`: assertions 5–7; regression sản phẩm 18/18 |
| Mở lại tab không thay DOM lịch sử khi dữ liệu không đổi | PASS | `performance-optimizations.test.html`: assertions 8–9 |
| Benchmark state 1,08 MB: save 20,8 ms → 14,4 ms | PASS | Chrome headless, median 7 lần, nhanh hơn 1,44× trên cùng fixture |
| Lookup 1.000 dòng trên 5.000 tài sản | PASS | 7,2 ms sau tối ưu; chẩn đoán trước đó quét tuyến tính từng dòng mất 113,8 ms |
| Toàn bộ regression hiện có | PASS | 17 harness, 192 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Tất cả harness dùng state cục bộ và `sb = null` |

## Bổ sung — bố cục form Thêm/Sửa tài sản

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Desktop tối đa 3 trường bằng nhau; dòng thiếu không tự giãn | PASS | `asset-form-layout.test.html`, viewport 1440×1000: 7 assertions |
| Tablet 2 cột và mobile 1 cột | PASS | Viewport 800×900 và 500×800: mỗi viewport 7 assertions, 0 fail |
| Trường chung và custom field dùng chung grid; tiêu đề được span toàn hàng | PASS | Computed style và bounding rectangles trong harness cô lập |
| Toàn bộ regression hiện có | PASS | 16 harness, 183 assertions, 0 fail |
| Thao tác UI sau đăng nhập và ghi Supabase production | NOT RUN | Thay đổi chỉ là CSS; không đăng nhập hoặc ghi dữ liệu production |

## Bổ sung — xóa Snapshot và Người đứng tên trên form

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Admin thấy nút Xóa; click đầu chỉ mở xác nhận đủ metadata | PASS | `inventory-snapshots.test.html`: assertions 10, 13 |
| Xác nhận xóa đúng snapshot và cập nhật persistence | PASS | Assertion 14 |
| Manager không thấy nút và không gọi trái quyền được | PASS | Assertions 15–16 |
| Người đứng tên là field hệ thống trong form Thêm/Sửa | PASS | `system-custodian-form.test.html`: assertions 1, 4 |
| Ngoài kho giữ holder nhập tay; trong kho cưỡng chế Người quản lý kho | PASS | Assertions 2–3, 5–6 |
| Xóa Snapshot có thể Undo | PASS | `undo-redo.test.html`: assertion 11 |
| Toàn bộ regression hiện có | PASS | 15 harness, 176 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Harness cục bộ không tải cấu hình production và không ghi dữ liệu thật |

## Bổ sung — Undo/Redo và chọn hàng loạt Danh mục tài sản

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Nút disabled, tự tạo mốc qua `saveData`, Undo và Redo | PASS | `undo-redo.test.html`: assertions 1–4 |
| Mutation mới xóa Redo; state rỗng và Snapshot được phục hồi | PASS | Assertions 5–6 |
| Render không tạo lịch sử; đang lưu chặn Undo thực sự | PASS | Assertions 7–8 |
| Transaction có nhãn và có thể cancel | PASS | Assertions 9–10 |
| Checkbox chỉ đổi UI state, đếm và bỏ chọn đồng bộ | PASS | `asset-location.test.html`: assertions 19–20 |
| Toàn bộ regression hiện có | PASS | 14 harness, 164 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Không tải cấu hình production trong harness; không ghi dữ liệu thật |

## Bổ sung — giữ Người đứng tên khi import Excel

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Ngoài kho giữ Người đứng tên, Mã nhân viên, Bộ phận và Vị trí | PASS | `excel-asset-group.test.html`: assertion 17 |
| Vị trí chuẩn hóa trùng kho áp dụng Người quản lý kho | PASS | Assertion 18 |
| Không có vị trí vẫn giữ holder Excel | PASS | Assertion 19 |
| Danh mục tài sản hiển thị holder ngoài kho | PASS | `asset-location.test.html`: assertion 18 |
| Toàn bộ regression hiện có | PASS | 13 harness, 152 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Test cục bộ không tải cấu hình production và không ghi dữ liệu thật |

## Bổ sung — xác định tài sản trong kho theo vị trí vật lý

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Chuẩn hóa vị trí (trim, gộp khoảng trắng, không phân biệt hoa/thường) | PASS | `warehouse-location-rules.test.html`: assertions 1–2 |
| Kiểm tra kho không còn suy luận riêng từ `status === "available"` | PASS | Assertions 3, 5–7 |
| Nguồn cấp phát/mượn đồng thời phải `available` và ở vị trí kho | PASS | Assertion 4 |
| Snapshot kiểm kê kế thừa quy tắc vị trí mới | PASS | Assertion 8 |
| Đổi setting không ghi đè vị trí; thu hồi/trả mượn giữ vị trí hiện tại | PASS | `warehouse-manager.test.html` 13/13; `warehouse-location-borrow.test.html` 3/3; `product-management.test.html` 18/18 |
| Toàn bộ regression hiện có | PASS | 13 harness, 148 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Các harness chạy cục bộ và không tải cấu hình production; không ghi dữ liệu thật |

## Bổ sung — Snapshot kiểm kê tài sản

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Menu Kiểm kê và hai luồng Chốt/Lịch sử | PASS | `inventory-snapshots.test.html`: assertion 1 |
| Nhóm tài sản động, tên mặc định, tổng dòng và tổng số lượng | PASS | Assertions 2–4 |
| Chốt không thay đổi dữ liệu tài sản; metadata đầy đủ | PASS | Assertions 5–6 |
| Persistence trong snapshot hiện hữu, không cần schema mới | PASS | Assertion 7 với localStorage cô lập, `sb = null` |
| Snapshot cũ bất biến khi tài sản/holder/tên nhóm hiện tại đổi | PASS | Assertion 8 |
| Lịch sử, xem chi tiết và tải Excel dùng dữ liệu đã chốt | PASS | Assertions 9–11 |
| Toàn bộ regression hiện có | PASS | 12 harness, 140 assertions, 0 fail |
| Ghi Supabase production thật | NOT RUN | Harness không tải `supabase.config.js`, đặt `sb = null`; không ghi dữ liệu production |
| Microsoft Excel desktop và kiểm tra responsive tương tác thủ công | NOT RUN | Cần xác minh trực quan ngoài harness headless |

## Bổ sung — Excel template chỉ có header và lịch sử import lỗi

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Mọi sheet nhập chỉ có header; không có STT/nhóm/tài sản mẫu | PASS | `excel-asset-group.test.html`: assertions 1–5 |
| File chỉ có header báo đúng thông điệp và không tạo tài sản | PASS | Assertion 6 |
| Import mới/cũ và Nhóm tài sản tiếp tục tương thích | PASS | Assertions 7–11 và 16 |
| Lỗi validation lưu đủ file, sheet, dòng Excel, thiết bị, Mã tài sản, trạng thái và lý do | PASS | Assertion 12 |
| Lỗi tồn tại qua vòng serialize/restore state và mở được chi tiết | PASS | Assertions 13–14 |
| Lỗi lúc xác nhận/cộng gộp và sheet sai tên đều được lưu | PASS | Assertions 15 và 17 |
| Toàn bộ regression hiện có | PASS | 11 harness, 129 assertions, 0 fail; fixture thông báo được cố định theo ngày chạy thực tế |
| Ghi Supabase production thật | NOT RUN | Harness stub `saveData()` và chỉ kiểm tra snapshot cục bộ; không tải cấu hình Supabase |
| Mở file bằng Microsoft Excel desktop | NOT RUN | Workbook được xác minh qua XLSX harness; chưa dùng ứng dụng Excel desktop |

## Bổ sung — Thứ tự cột file Excel mẫu nhập thiết bị

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Tám cột đầu đúng thứ tự bắt buộc trên mọi sheet | PASS | `excel-asset-group.test.html`: assertions 1–5 |
| `STT` chỉ dùng hiển thị; trống/không liên tục không ảnh hưởng import | PASS | Assertions 2, 6, 7 và 11 |
| Cột hệ thống đứng trước custom fields, không bị trùng | PASS | Assertions 3, 5 và 11 |
| Import theo tên header, tương thích thứ tự/header `Tên` cũ | PASS | Assertions 6 và 9 |
| Mã tài sản ở cột B dùng định dạng text; giá trị số `0` không bị mất | PASS | Assertions 4 và 8 |
| Nhóm tài sản mặc định/Admin/sai tên và tách khỏi custom fields | PASS | Assertions 6–11 |
| Regression nghiệp vụ sản phẩm | PASS | `product-management.test.html`: 18 assertions, 0 fail |
| Regression trường động và Nhóm tài sản | PASS | `dynamic-fields.test.html`: 11; `asset-groups.test.html`: 9; tổng 20 assertions, 0 fail |
| Mở file `.xlsx` bằng Microsoft Excel thực tế | NOT RUN | Harness xác minh workbook đầu ra qua XLSX stub; chưa kiểm tra bằng ứng dụng Excel desktop |
| Ghi dữ liệu Supabase thật | NOT RUN | Các harness dùng state giả và stub `saveData()`, không tải cấu hình Supabase |

Các cột `Bộ phận`, `Người đứng tên`, `Mã nhân viên` là cột hệ thống. Importer đọc chúng vào metadata holder của thiết bị; chúng không nằm trong custom fields.

## Bổ sung — Tinh chỉnh responsive tiêu đề, thao tác và tra cứu

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Tiêu đề/icon Mượn màu trắng, nền warning giữ nguyên | PASS | `ui-polish.test.html`, computed style và kiểm tra trực quan Chrome |
| Ba nút cùng hàng khi rộng; nút dòng hai căn giữa khi hẹp | PASS | Fixture đo geometry cho container 120px/65px |
| Nút cùng kích thước; trường hợp 1/2/3 nút; handler click | PASS | Fixture: `30×28px`, flex center và click counter |
| Thanh tra cứu: input/nút cao bằng nhau, căn giữa, không che/tràn | PASS | Fixture geometry tại 1440, 1024, 768 và 480px |
| Mobile sử dụng toàn bộ chiều rộng khả dụng, nút không co | PASS | Chrome 480px: nút `38×38px`, input `min-width:0` |
| Quyền User/Manager/Admin và thao tác tài sản | PASS | `asset-actions.test.html`: 13 assertions, 0 fail |
| Toàn bộ regression nghiệp vụ/UI | PASS | 9 harness; 100 assertions ở desktop, 0 fail; UI mobile thêm 1 assertion, 0 fail |
| UI ứng dụng thật có đăng nhập và ghi Supabase | NOT RUN | Không tạo dữ liệu thử hoặc ghi `app_state` thật |

## Bổ sung — Hiển thị vị trí Danh mục tài sản

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Tài sản độc lập: kho, đã cấp và hai tầng fallback vị trí | PASS | `asset-location.test.html`: assertions 1–4 |
| Hàng số lượng: một/nhiều vị trí, loại trùng, tooltip | PASS | `asset-location.test.html`: assertions 5–9 |
| Bỏ phiếu trả/hủy/thu hồi hết; thu hồi một phần/toàn phần | PASS | `asset-location.test.html`: assertions 10–12 |
| localStorage và hydrate snapshot cấu trúc Supabase | PASS | Fixture cục bộ, assertions 13–14; không ghi Supabase thật |
| Sort dùng `displayLocation`, không mutate `devices` | PASS | Assertion 15 và regression sort hiện có |
| Box mạng Viettel, Mã tài sản `"0"`, vị trí Phòng HR | PASS | Assertions 16–17; dữ liệu thật không bị sửa/migration |
| Toàn bộ regression hiện có | PASS | Product 18, Asset Groups 9, Warehouse Manager 13, Borrow return 3, Layout 6, Asset Actions 13, Notifications/Sort 11; tổng cùng test mới: 90 assertions, 0 fail |
| Kiểm thử ghi Supabase thật | NOT RUN | Chủ ý không ghi dữ liệu thử vào `app_state` |

Nguyên nhân lỗi nằm ở bước `getAssetGroups()` tổng hợp dữ liệu trình bày; dữ liệu vị trí trong device/allocation, localStorage và Supabase không bị mất.

## Bổ sung — Thao tác tài sản, thông báo và sắp xếp

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Xem/Sửa/Xóa, quyền và chặn giao dịch chưa hoàn tất | PASS | `asset-actions.test.html`: 13 assertions, 0 fail |
| Xem không đổi state; sửa giữ ID; hủy xác nhận không xóa | PASS | Fixture DOM/state cô lập |
| Sort Mã tài sản tự nhiên, số lượng numeric, trống cuối, không đổi state | PASS | `notifications-sort.test.html` và asset-actions fixture |
| State sort Inventory/Assets độc lập | PASS | Fixture trực tiếp |
| Cảnh báo quá hạn, hôm nay, 1/2/3 ngày; loại 4 ngày/returned/cancelled/invalid | PASS | `notifications-sort.test.html`: tổng 11 assertions, 0 fail |
| Không trùng và badge không cộng dồn; panel mở/đóng/empty state | PASS | Fixture DOM cục bộ |
| Toolbar dùng `openAssetExport`, đúng bốn lựa chọn | PASS | Modal dùng chung được mở khi chưa render Assets |
| Tải/mở file XLSX vật lý | NOT RUN | Không kích hoạt download |
| Kiểm thử ghi Supabase thật | NOT RUN | Không ghi dữ liệu thử vào `app_state` |

## Bổ sung — Vị trí kho mặc định và di chuyển setting

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Setting chỉ xuất hiện trong Quản lý User | PASS | Static DOM: adminCat `0`, adminUsers Người quản lý `1`, Vị trí kho `1` |
| Lưu/trim vị trí; đồng bộ `available` một lần | PASS | Warehouse fixture: 13 assertions, 0 fail |
| Không đổi allocated/borrowed/lịch sử | PASS | So sánh state/chứng từ trước và sau |
| Tài sản mới trống dùng mặc định; vị trí cụ thể được giữ | PASS | Warehouse fixture |
| Thu hồi số lượng và Mã tài sản về vị trí mặc định | PASS | Product regression: 18 assertions, 0 fail |
| Trả mượn về người quản lý/vị trí; chặn khi chưa thiết lập | PASS | Borrow-return fixture: 3 assertions, 0 fail |
| Cột Lý do Thu hồi/Mượn khớp cột danh sách | PASS | Computed layout desktop `1200x900` và mobile `390x844`: mỗi viewport 6 assertions, 0 fail |
| Asset Groups regression | PASS | 9 assertions, 0 fail |
| Refresh qua Supabase thật | NOT RUN | Không ghi dữ liệu thử vào `app_state` thật |
| Tải/mở Excel vật lý | NOT RUN | Không kích hoạt download |

## Bổ sung — Người quản lý kho

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Admin lưu tên trim; một lần save | PASS | `tests/warehouse-manager.test.html`, fixture cục bộ |
| Chặn non-admin và tên chỉ có khoảng trắng | PASS | Test DOM/logic cô lập |
| Đồng bộ `available`, gồm condition `broken` | PASS | Test state fixture |
| Không sửa allocated/borrowed/lịch sử | PASS | So sánh holder và JSON chứng từ trước/sau |
| Ngày local ba form; không ghi đè ngày có sẵn | PASS | Test helper quanh 00:00 local và DOM fixture |
| Refresh qua localStorage/Supabase thật | NOT RUN | Không ghi thử vào `app_state` thật |
| Tải và mở file Excel vật lý | NOT RUN | Chỉ đối chiếu logic tạo dòng |
| Desktop/mobile authenticated visual review | NOT RUN | Chưa thao tác UI đăng nhập thật tại các breakpoint |
| Cú pháp qua `node --check` | BLOCKED | Máy hiện tại không cài Node.js; trang chính và toàn bộ script đã được Chrome parse khi tải |

## Bổ sung — Form thiết bị động theo cấu hình danh mục

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Fallback cấu hình cũ, ID/order/active mặc định và không mutate | PASS | `dynamic-fields.test.html` |
| Trường chung luôn còn; field động thêm/đổi nhãn/ẩn phản ánh trên form Thêm | PASS | Chrome headless, assertions 2–5 |
| Form Sửa dùng cùng cấu hình, giữ giá trị và lưu theo ID ổn định | PASS | Assertions 6–7 |
| Modal Xem dùng nhãn hiện tại, bỏ field inactive | PASS | Assertion 8 |
| Admin sửa nhãn giữ ID; thêm definition đầy đủ | PASS | Assertions 9–10 |
| Text/Number/Date/Dropdown/Textarea | PASS | Assertion 4 |
| Regression hiện có | PASS | 10 harness: 111 assertions desktop, 0 fail; mobile UI thêm 1 assertion trong lần chạy riêng trước đó |
| Parse cú pháp bằng Node.js | BLOCKED | Máy không cài Node.js; Chrome đã parse các script được nạp bởi trang test |
| Ghi/refresh Supabase thật và thao tác UI đăng nhập thật | NOT RUN | Chủ ý không ghi dữ liệu thử vào `app_state` thật |

## Bổ sung — Nhóm tài sản trong Excel template/import

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Mỗi sheet template có đúng một cột `Nhóm tài sản`; dòng ví dụ dùng nhóm mặc định | PASS | `excel-asset-group.test.html` assertion 1 |
| Thêm/bớt custom field không làm mất hoặc nhân đôi cột hệ thống | PASS | Assertion 2 |
| Tên nhóm mặc định được trim và so sánh không phân biệt hoa/thường | PASS | Assertion 3 |
| Nhóm do Admin tạo được ánh xạ sang ID | PASS | Assertion 4 |
| Ô trống và file cũ thiếu cột dùng nhóm mặc định | PASS | Assertions 5–6 |
| Tên nhóm không tồn tại bị từ chối rõ ràng, không tự tạo | PASS | Assertion 7 |
| `assetGroupId` độc lập với dữ liệu field động | PASS | Assertion 8 |
| Ghi Supabase thật / mở file vật lý bằng Excel | NOT RUN | Test dùng workbook XLSX cô lập; không ghi `app_state` thật |

## Bổ sung — Layout thao tác và badge phân bổ

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Ba nút Xem/Sửa/Xóa cùng hàng, không wrap trong container hẹp | PASS | `ui-polish.test.html`, desktop và mobile |
| Nút cùng kích thước, icon căn giữa, nhóm nút căn giữa | PASS | Computed layout: desktop 11 assertions, mobile 12 assertions |
| Badge Kho/Cấp/Mượn xếp dọc, gap 4px, không chồng | PASS | Computed style và bounding rectangles |
| Handler, quyền Xem/Sửa/Xóa không đổi | PASS | `asset-actions.test.html`: 13 assertions, 0 fail |
| Tổng hợp phân bổ/vị trí không đổi | PASS | `asset-location.test.html`: 17 assertions, 0 fail |

Ngày: 2026-08-19. Nhánh: `refactor/feature-split`.

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Regression sản phẩm không serial | PASS | Chrome headless: 17 assertions, 0 fail |
| Ba nhóm mặc định và nhóm mặc định tồn kho | PASS | Test cô lập |
| Dữ liệu cũ fallback Tài sản tồn kho | PASS | Test cô lập, không migration |
| Thêm/sửa/xóa nhóm hợp lệ | PASS | Test cô lập |
| Chặn tên trùng, nhóm đang dùng và nhóm mặc định | PASS | Test cô lập |
| Dropdown nhóm động | PASS | Test DOM cô lập |
| Cấp phát cập nhật holder/vị trí, giữ ID/Mã tài sản/nhóm | PASS | Test nghiệp vụ cô lập |
| Tải toàn ứng dụng, SyntaxError/ReferenceError/file thiếu | PASS | Chrome headless tải `index.html`, init và Supabase read path hoàn tất |
| Form thêm: bố cục desktop/mobile trực quan | NOT RUN | Chưa thao tác đăng nhập và chụp từng breakpoint trên ứng dụng thật |
| CRUD nhóm qua UI ứng dụng thật | NOT RUN | Không ghi vào `app_state` Supabase thật |
| Bộ lọc kết hợp qua UI thật | NOT RUN | Logic/DOM đã đối chiếu; chưa thao tác authenticated UI |
| Xuất bốn file XLSX vật lý | NOT RUN | Không kích hoạt download; tên/cột/filter đã đối chiếu code |
| Refresh sau ghi Supabase | NOT RUN | Tránh thay đổi dữ liệu thật |

Harness đã chạy: `tests/product-management.test.html`, `tests/asset-groups.test.html`. Không harness nào tải cấu hình Supabase.
## Bổ sung — Lịch sử Thêm TB tải theo yêu cầu

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Click menu Thêm TB không render lịch sử, không tạo dòng DOM, không save hoặc gọi Supabase | PASS | `add-device-history.test.html`: 5 assertions |
| Lịch sử chỉ dựng khi bấm Xem lịch sử; mặc định 25 dòng | PASS | `performance-optimizations.test.html` |
| Phân trang thật và lựa chọn 25/200/500/1000 | PASS | Assertions 7–10 |
| Đóng modal xóa dòng DOM và vô hiệu batch `requestAnimationFrame` cũ | PASS | Assertions 11–12 |
| Không thay đổi dữ liệu `addDevLogs` | PASS | Assertion 13 |
| Ghi Supabase production | NOT RUN | Chủ ý không thực hiện; test chạy với state cô lập |

Regression toàn bộ: 17/18 harness PASS. `dynamic-fields.test.html` chưa chạy hết do fixture hiện thiếu helper `getAssetCustodianNameOptions`; lỗi xuất hiện trước phần kiểm tra lịch sử và không thuộc các file production thay đổi trong lượt này. Năm harness trực tiếp (`add-device-history`, `performance-optimizations`, `excel-asset-group`, `product-management`, `system-custodian-form`) đạt 66 assertions, 0 fail.
## Bổ sung — Hoàn tác và Tiến lên dùng serialized-state cache

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Nút Undo/Redo disabled đúng theo stack và trạng thái đồng bộ | PASS | `state-history.test.html` assertions 1, 3, 7–9 |
| Một mutation chỉ serialize persistent state một lần | PASS | Assertion 2, đếm trực tiếp `JSON.stringify` |
| Undo và Redo khôi phục dữ liệu, render lại ứng dụng | PASS | Assertions 4–5 |
| Mutation mới sau Undo xóa Redo | PASS | Assertion 6 |
| Handler không chạy khi nút đang khóa do lưu Supabase | PASS | Assertions 7–8 |
| Ghi dữ liệu thử Supabase production | NOT RUN | Test dùng localStorage và `sb=null` |
## Bổ sung — Giới hạn Undo/Redo và fixture dynamic fields

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Entry thứ 11 loại entry cũ nhất, tổng hai stack tối đa 10 | PASS | `state-history.test.html` assertion 11 |
| Tổng Undo/Redo vượt 25 MB được trim theo byte UTF-8 | PASS | Assertion 13 với hai state 13 MiB |
| Undo/Redo sau trim số bước và dung lượng vẫn đúng | PASS | Assertions 12, 14 |
| State riêng 26 MiB không crash, mutation vẫn tồn tại, history bỏ qua và cảnh báo | PASS | Assertion 15 |
| Một mutation vẫn chỉ stringify persistent state một lần | PASS | Assertion 2 |
| Dynamic fields dùng đúng helper production từ `shared/user-lookup.js` | PASS | `dynamic-fields.test.html`: 11 assertions |

## Bổ sung — Tổng quan thiết bị theo tuần

Ngày: 2026-08-21. Nhánh: `refactor/feature-split`.

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Tuần Thứ Hai–Chủ Nhật, qua tháng/năm và timestamp theo ngày local | PASS | `dashboard-weekly.test.html` assertions 1–3 |
| KPI tổng số lượng, trong kho, đang sử dụng, đang mượn và hỏng | PASS | Assertions 4–5, gồm hàng số lượng và cấp phát một phần |
| Biểu đồ 7 ngày và top loại cấp phát/thu hồi dùng số lượng thật | PASS | Assertions 6–7; loại phiếu hủy/import lỗi |
| Bảng thay đổi không đếm trùng, hỗ trợ add/import/edit/delete và mã nhân viên | PASS | Assertions 8, 10–12 |
| Cache tuần và invalidation sau mutation | PASS | Assertions 13–14 |
| Lịch sử 5.000 dòng chỉ render 10 `<tr>` của trang hiện tại | PASS | Assertion 15 |
| Dữ liệu cũ thiếu field và responsive desktop/mobile | PASS | Assertions 16–17; chạy viewport 1440 và kiểm tra breakpoint |
| Toàn bộ regression | PASS | 20/20 harness, tất cả assertions đạt |
| Tài nguyên cục bộ | PASS | 47/47 `src`/`href` trong `index.html` tồn tại |
| Tải trang production | PASS | Chrome headless: không có SyntaxError, ReferenceError, TypeError hoặc ERR_FILE_NOT_FOUND |
| `node --check` | NOT RUN | Môi trường hiện tại không cài Node; JavaScript production đã được Chrome parse/thực thi qua harness và trang thật |
| Ghi Supabase production | NOT RUN | Chủ ý không thực hiện; harness dùng state cô lập và không tải cấu hình production |

Giới hạn lịch sử: hệ thống không có snapshot đầu tuần đầy đủ để dựng chênh lệch quá khứ một cách chính xác. Các log import cũ cũng không luôn phân biệt chắc chắn import thành công với thêm thủ công; dashboard chỉ gắn nhãn import khi metadata hiện có xác nhận.

## Bổ sung — tinh chỉnh chỉ số Tổng quan tuần

Ngày: 2026-08-21. Nhánh: `refactor/feature-split`.

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Import còn đủ/xóa toàn bộ/xóa một phần | PASS | `dashboard-refinement.test.html` assertions 1–3 |
| Import rồi cấp phát, import lỗi, thêm thủ công rồi xóa, chống log trùng | PASS | Assertions 4–7 |
| Cấp phát/thu hồi nhiều dòng, hàng số lượng và một phần | PASS | Assertions 8–13 |
| Loại phiếu hủy, gộp loại, sort giảm dần và trạng thái trống | PASS | Assertions 14–17 |
| Icon local `fa-computer`, bảng hai cột và cache invalidation | PASS | Assertions 18–20 |
| Dashboard regression cũ | PASS | `dashboard-weekly.test.html`: 17/17 |
| Toàn bộ regression | PASS | 21/21 harness |

Giới hạn dữ liệu cũ: nếu log không còn ID hoặc Mã tài sản có thể đối chiếu thì chỉ số hiện còn bỏ qua bản ghi đó thay vì đoán theo tên. Với hàng số lượng không có lịch sử xóa chi tiết, kết quả được cap theo tổng lượng hiện còn truy vết được; không thể quy phần giảm chính xác cho từng lần nhập cũ nhưng không làm chỉ số vượt quá lượng còn tồn tại.
