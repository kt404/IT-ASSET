# Quy tắc quản lý sản phẩm

## Mã tài sản thống nhất

- Website chỉ hiển thị `Mã tài sản`; field lưu chuẩn là `serial`.
- Alias legacy chỉ được đọc qua accessor tập trung, không được ghi cho bản ghi mới hoặc tự migration khi tải trang.
- Hai giá trị chuẩn/legacy khác nhau là conflict. Required config mới chỉ ghi `requiredFields.assetCode` và vẫn đọc tương thích cấu hình cũ.
- Template/export chỉ có một cột `Mã tài sản`; import nhận alias cũ nhưng từ chối đúng dòng khi các alias khác nhau.

## Nhãn tình trạng cũ

- Giá trị nội bộ `old`/`used` và literal dữ liệu cũ `Đã qua sd` đều hiển thị là `Cũ`; đây chỉ là thay đổi lớp trình bày, không migration dữ liệu.
- Import chấp nhận cả `Cũ` và `Đã qua sd`, chuẩn hóa về `old`. Excel/PDF mới chỉ xuất nhãn `Cũ`.
- Tìm kiếm tình trạng hỗ trợ nhãn `Cũ` và alias cũ; renderer không mutate thiết bị, lịch sử hoặc snapshot đã lưu.

## Snapshot kiểm kê tài sản

- Chốt kiểm kê chỉ đọc dữ liệu tổng hợp của Danh mục tài sản và thêm một snapshot; không sửa `devices`, `allocations`, `returns`, `borrows` hoặc Nhóm tài sản.
- Phạm vi là tổng hợp hoặc đúng một `assetGroupId` lấy động từ `assetGroups`; snapshot giữ cả ID và tên nhóm tại thời điểm chốt.
- Tổng số dòng là số dòng tài sản tổng hợp đã sao chép; tổng số lượng là tổng `rows[].total`.
- `rows` được deep copy khi xác nhận. Lịch sử chỉ xem/tải các dòng đã lưu, không tính lại từ state hiện tại.
- Snapshot không có thao tác sửa, ghi đè hoặc khôi phục vào tài sản. Admin có thể xóa sau một bước xác nhận; User/Manager không thấy nút và handler vẫn kiểm tra quyền.
- File Excel lịch sử được tạo từ snapshot đã chọn; tải file không thay đổi state.
- Xóa snapshot chỉ xóa đúng entry trong `inventorySnapshots`, không sửa dữ liệu tài sản.

## Excel template và lịch sử import lỗi

- Mỗi sheet nhập thiết bị trong file mẫu chỉ có hàng header; không có STT, nhóm tài sản, thiết bị hoặc giá trị custom field mẫu.
- Tám cột ưu tiên và các cột hệ thống/custom field giữ thứ tự đã quy định. Thay đổi cấu hình field chỉ tác động phần cột động.
- Workbook chỉ có header báo `Không có dữ liệu thiết bị để nhập` và không tạo tài sản.
- Mỗi dòng có dữ liệu nhưng bị từ chối được ghi đúng một lần vào `activities` và `addDevLogs`, gồm tên file/sheet, số dòng Excel thực tế, dữ liệu nhận diện đọc được và nguyên nhân cụ thể.
- Lỗi validation được lưu ngay sau khi đọc file; lỗi tạo/cộng gộp phát sinh khi xác nhận được lưu tại thời điểm thất bại. Cả hai dùng persistence hiện hữu, không tự tạo tài sản hoặc thay đổi schema.

## Thao tác và xóa tài sản

- Người có quyền xem được mở chi tiết; Admin/Manager được sửa; chỉ Admin được xóa.
- Không xóa tài sản `allocated`, `borrowed`, nguồn còn số lượng cấp phát chưa thu hồi hoặc tài sản thuộc phiếu mượn đang hoạt động.
- Xóa tài sản không xóa allocations, returns, borrows hoặc activities liên quan.

## Người quản lý kho

- Tài sản “đang trong kho” khi vị trí hiện tại (`devices[].location`) trùng `appSettings.defaultWarehouseLocation` sau khi trim, gộp khoảng trắng liên tiếp và so sánh không phân biệt hoa/thường.
- `status === "available"` chỉ biểu thị trạng thái nghiệp vụ sẵn sàng; riêng trạng thái này không chứng minh tài sản đang ở trong kho.
- Chỉ Admin được sửa `appSettings.warehouseManagerName`; tên được trim và không được rỗng.
- Khi lưu tên người quản lý, `custodianName` chỉ được đồng bộ cho tài sản có vị trí hiện tại trùng vị trí kho mặc định; chứng từ/lịch sử không bị sửa.
- Tài sản mới/import và tài sản thu hồi/trả mượn chỉ nhận người quản lý kho khi vị trí hiện tại thực sự khớp setting. Không tự điền vị trí kho.
- Nếu chưa thiết lập, hiển thị “Chưa thiết lập”, không sinh tên giả.

## Vị trí kho mặc định

- `appSettings.defaultWarehouseLocation` chỉ Admin được sửa; giá trị được trim và không chấp nhận rỗng.
- Setting chỉ là giá trị đối chiếu. Khi lưu hoặc thay đổi setting, không được ghi đè `devices[].location` hay vị trí trong dữ liệu giao dịch/lịch sử.
- Nếu setting trống thì không tự suy đoán tài sản nào đang trong kho.
- Nguồn cấp phát/mượn phải đồng thời có trạng thái nghiệp vụ `available` và vị trí hiện tại trùng vị trí kho mặc định.
- Thu hồi hoặc trả mượn chuyển trạng thái nghiệp vụ về `available` nhưng giữ nguyên vị trí hiện tại; chỉ nhận Người quản lý kho nếu vị trí đó khớp setting.
- Tài sản mới/import giữ vị trí do đầu vào cung cấp, kể cả khi trống; setting không được dùng để tự điền vị trí.
- Khi import Excel, tài sản ngoài vị trí kho hoặc không có vị trí giữ nguyên `Người đứng tên`, `Mã nhân viên` và `Bộ phận` từ file. Chỉ tài sản có vị trí khớp kho mặc định mới thay holder bằng Người quản lý kho.
- Form Thêm/Sửa lưu “Người đứng tên” và “Mã nhân viên” vào `devices[].custodianName`/`devices[].custodianCode` như field hệ thống, không đưa vào cấu hình/custom fields. Chọn đúng tên hoặc mã của user đang hoạt động sẽ đồng bộ trường còn lại và bộ phận. Nếu vị trí khớp kho mặc định thì Người quản lý kho luôn được ưu tiên; ngoài kho giữ cặp tên/mã đã nhập.
- Tra cứu theo Nhân viên nhận cả tên và mã, tổng hợp người đang đứng tên từ metadata tài sản, cấp phát còn hiệu lực và phiếu mượn đang hoạt động. Tra cứu không phụ thuộc nhân viên còn active hoặc còn tồn tại trong danh sách User.

## Serial

- `catKey === "thietbi"` luôn bắt buộc serial, serial là duy nhất và mỗi bản ghi có `qty = 1`.
- `linhkien`, `ngoai_vi`, `tieuhao` cho phép có hoặc không có serial.
- Mọi sản phẩm có serial đều được quản lý độc lập, có `qty = 1` và không được trùng serial. Serial được so sánh sau khi trim và không phân biệt hoa/thường.
- Sản phẩm không serial được quản lý bằng số lượng trên một bản ghi.

## Cộng gộp

Sản phẩm mới chỉ được cộng vào bản ghi hiện có khi đồng thời:

- Không thuộc nhóm `thietbi`.
- Cả hai bản ghi không có serial.
- Cùng `catKey`.
- Tên bằng nhau sau khi trim, rút nhiều khoảng trắng thành một và chuyển về chữ thường.

Tên và các thông tin hiển thị của bản ghi cũ được giữ nguyên. Nếu có nhiều hơn một ứng viên phù hợp, thao tác bị từ chối; hệ thống không tự chọn, gộp hoặc xóa dữ liệu cũ.

## Cấp phát và thu hồi

- Phiếu mới giữ ID nguồn trong `deviceIds` và `sourceIds`, cùng số lượng trong `qtys`.
- Cấp phát sản phẩm không serial chỉ trừ `qty` trên bản ghi nguồn, không tạo bản ghi thiết bị khác.
- Số lượng cấp phải lớn hơn 0 và không vượt tồn.
- `returnedQtys` lưu tổng số đã thu hồi theo từng dòng cấp phát.
- Số có thể thu hồi bằng `qtys[id] - returnedQtys[id]`.
- Thu hồi sản phẩm không serial cộng trực tiếp vào đúng bản ghi nguồn.
- Phiếu có trạng thái `partial` khi mới thu hồi một phần và `returned` khi toàn bộ các dòng đã được thu hồi.

## Tương thích dữ liệu cũ

Thứ tự xác định nguồn: `sourceIds` → ID dòng hiện tại → `groupId` → cùng danh mục và tên chuẩn hóa, không serial. Fallback tên chỉ thành công khi có đúng một bản ghi kho phù hợp. Trường hợp không có hoặc có nhiều ứng viên sẽ báo lỗi và không ghi dữ liệu.

## Nhóm tài sản

- Mọi tài sản tham chiếu nhóm bằng `assetGroupId` ổn định.
- Ba nhóm ban đầu: `fixed_asset`, `construction_asset`, `inventory_asset`.
- `inventory_asset` là nhóm mặc định và không được xóa.
- Dữ liệu cũ thiếu `assetGroupId` được đọc như `inventory_asset`; fallback không tự ghi migration.
- Tên nhóm được chuẩn hóa khoảng trắng và so sánh không phân biệt hoa/thường khi kiểm tra trùng.
- Không xóa nhóm đang được tài sản sử dụng. Đổi tên không đổi ID liên kết.

## Cấp phát và vị trí

- Tài sản độc lập cập nhật `allocatedTo` và `location` nhưng giữ nguyên ID, Mã tài sản (`serial`) và `assetGroupId`.
- Hàng quản lý số lượng không gán holder lên phần tồn kho nguồn. Người nhận, bộ phận và vị trí được lưu trong phiếu qua `recvName`, `recvCode`, `dept`, `newLocation` và `locations`.
- Danh mục tài sản tính vị trí để trình bày tại thời điểm render; không ghi `locations` hoặc `displayLocation` ngược vào state hay Supabase.
- Vị trí được trim, rút gọn khoảng trắng và loại trùng không phân biệt hoa/thường nhưng giữ cách viết đầu tiên để hiển thị.
- Một vị trí hiệu lực được hiển thị trực tiếp. Từ hai vị trí khác nhau trở lên hiển thị `Nhiều vị trí (N)`, trong đó `N` là số vị trí duy nhất; tooltip liệt kê các vị trí thực tế.
- Tài sản độc lập đã cấp ưu tiên `device.location`, sau đó `device.allocatedTo.location`, rồi vị trí của allocation đang hoạt động. Hàng số lượng tổng hợp vị trí phần tồn kho và mọi allocation còn số lượng chưa thu hồi.
- Phiếu đã hủy, đã trả hoặc đã thu hồi toàn bộ không đóng góp vị trí hiện tại.

## Trường thiết bị động theo loại

- Các trường chung `name`, `serial` (Mã tài sản), `assetGroupId`, `qty`, `condition` và `location` luôn do form thiết bị quản lý; cấu hình danh mục không tạo lại các control này.
- Mỗi trường chi tiết dùng một `id` ổn định làm khóa dữ liệu. Đổi `label` không đổi khóa và không làm mất giá trị đã lưu trên `devices`.
- Form Thêm, form Sửa và modal Xem cùng đọc `subcategory.fields`, chỉ hiển thị field có `active !== false` và sắp theo `order`.
- Hỗ trợ `text`, `number`, `date`, `select` (Dropdown) và `textarea`; `required`, `options` và `placeholder` được áp dụng trực tiếp vào control.
- Xóa hoặc ẩn một định nghĩa không tự xóa giá trị cũ khỏi bản ghi thiết bị. Không có migration hoặc dọn dữ liệu tự động.

## Tổng quan thiết bị theo tuần

- Tuần được tính theo giờ local của trình duyệt, từ Thứ Hai đến Chủ Nhật, kể cả khi qua ranh giới tháng hoặc năm.
- Tổng tài sản là tổng `qty` hiện tại cộng phần số lượng không serial còn đang cấp phát ngoài bản ghi nguồn. Tài sản serial cấp phát vẫn tồn tại trong `devices` nên không cộng lần hai.
- Trong kho chỉ dựa trên vị trí hiện tại trùng `appSettings.defaultWarehouseLocation` theo helper nghiệp vụ hiện có.
- Đang sử dụng lấy phần cấp phát còn hiệu lực; Đang mượn lấy số lượng của phiếu mượn còn hoạt động; Hỏng dùng tình trạng đã chuẩn hóa.
- Biến động tuần lấy số lượng thật từ chứng từ cấp phát, thu hồi, mượn và trả mượn. Phiếu hủy và import thất bại không được tính vào biến động thành công.
- Không suy diễn chênh lệch so với đầu tuần khi hệ thống không có snapshot lịch sử đầy đủ. KPI phụ hiển thị số giao dịch/số lượng xác định được trong tuần.
- Import thành công trước khi có cờ `importSuccess` không bị tự động gắn nhãn import, vì không thể phân biệt chắc chắn với thêm thủ công. Không sửa lại dữ liệu lịch sử.
- Chỉ số “thêm trong tuần, hiện còn” đối chiếu log thêm/import thành công với `devices` bằng ID nội bộ, sau đó mới fallback Mã tài sản qua accessor. Không đối chiếu chỉ bằng tên.
- Các log cùng trỏ đến một tài sản được gộp trước khi tính. Kết quả không vượt quá số lượng hiện còn trong bản ghi nguồn cộng số lượng đang cấp phát chưa thu hồi của hàng không serial.
- Biểu đồ Thêm/Import vẫn thể hiện sự kiện lịch sử đã xảy ra và không bị giảm khi tài sản về sau bị xóa; nhãn KPI phân biệt rõ chỉ số hiện còn với lịch sử sự kiện.
- Bảng Cấp phát/Thu hồi chỉ tổng hợp từ chứng từ nghiệp vụ gốc, không cộng lại `activities`; phiếu hủy bị loại, số lượng lấy từ từng dòng/`qtys` hoặc allocation reference của phiếu thu hồi.
