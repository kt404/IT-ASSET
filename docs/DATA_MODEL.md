# Data model

## Mã tài sản

`serial` là field chuẩn duy nhất. `getAssetCode()` chỉ đọc tương thích `assetNo`, `asset_no`, `assetNumber` và `serialNumber`, không mutate bản ghi hoặc tự ghi Supabase. Nếu field chuẩn và legacy khác nhau, `getAssetCodeInfo()` trả `conflict: true`. Khi người dùng sửa và lưu bản ghi cũ, ứng dụng giữ ID, ghi `serial` và loại field legacy khỏi thiết bị.

## `inventorySnapshots`

```js
{
  id, name,
  scopeId: "all" | assetGroupId,
  scopeName,
  createdAt,
  createdBy: { name, code },
  notes,
  totalRows,
  totalQty,
  rows: [{
    serial, name, category,
    assetGroupId, assetGroupName, type,
    available, allocated, borrowed, total,
    location,
    holders: []
  }]
}
```

`inventorySnapshots` là mảng append-only trong snapshot `itams_v4` và `app_state.data`; dữ liệu cũ thiếu mảng này dùng `[]`. Mỗi lần chốt tạo deep copy của các dòng tổng hợp và tên Nhóm tài sản tại thời điểm đó. Màn hình xem/tải không tham chiếu lại `devices`, `allocations` hoặc tên nhóm hiện tại, vì vậy thay đổi nghiệp vụ về sau không làm đổi snapshot cũ. Không có bảng hoặc migration Supabase mới.

## Lỗi import thiết bị

Không tạo bảng hoặc state mới. Mỗi dòng Excel bị từ chối được lưu trong hai lịch sử hiện hữu và cùng đi qua snapshot `itams_v4` / `app_state.data`:

- `activities[]`: hoạt động `Import thiết bị thất bại`, `type: "error"`, `status: "Thất bại"`, `refType: "import-error"`.
- `addDevLogs[]`: dòng tương ứng có `importFailure: true`, `status: "failed"` để xuất hiện trong Lịch sử Thêm TB mà không bị hiểu là tài sản đã tạo.

Metadata lỗi gồm `fileName`, `sheetName`, `excelRow`, `deviceName`/`name`, `serial`, `category`/`subName`, `user`/`addedBy`, `occurredAt`, và `reason`. `refId`/`id` chung liên kết hai bản ghi để mở modal chi tiết. Không có thay đổi Supabase schema; đây là thuộc tính tùy chọn bên trong JSON snapshot hiện hữu.

## `appSettings` và người đứng tên kho

```js
appSettings: { warehouseManagerName: "Tên đã trim", defaultWarehouseLocation: "Vị trí đã trim" }
devices[].custodianName // người đứng tên; Thủ kho được áp dụng khi location trùng vị trí kho mặc định
devices[].custodianCode // mã nhân viên của người đứng tên nhập từ Excel
devices[].custodianDept // bộ phận của người đứng tên nhập từ Excel
```

`appSettings` nằm trong snapshot `itams_v4` và `app_state.data`. Dữ liệu cũ thiếu setting dùng giá trị rỗng, không migration tự động. `allocatedTo` và `borrowedBy` vẫn là nguồn người đứng tên khi đang cấp phát/mượn; chứng từ cũ không đổi.

Lớp hiển thị/tra cứu holder đọc lần lượt `custodianName/custodianCode/custodianDept`, `allocatedTo.name/code/dept`, `allocations.recvName/recvCode/dept`, `borrowedBy.name/code/dept` và `borrows.borrower/borrowerCode`. Không thêm field song song và không migration dữ liệu cũ.

`defaultWarehouseLocation` là một setting đơn, không phải mô hình nhiều kho. Đây chỉ là giá trị đối chiếu vị trí vật lý: thay đổi setting không cập nhật `devices[].location`, allocations, returns, borrows hoặc activities. Một thiết bị được tính là trong kho khi `location` khớp setting sau chuẩn hóa khoảng trắng và chữ hoa/thường; `status` vẫn là trạng thái nghiệp vụ độc lập.

Ba trường `custodianName`, `custodianCode`, `custodianDept` là metadata hệ thống phẳng của thiết bị, không nằm trong custom fields. Import giữ các giá trị này cho tài sản ngoài kho/không có vị trí; tài sản trong kho dùng Người quản lý kho và để trống mã/bộ phận của holder Excel.

## `devices`

Schema hiện hữu được giữ nguyên. Các trường liên quan:

| Trường | Ý nghĩa |
|---|---|
| `id` | ID ổn định của bản ghi nguồn |
| `catKey` | `thietbi`, `linhkien`, `ngoai_vi`, `tieuhao` |
| `name` | Tên hiển thị; không bị thay khi cộng gộp |
| `serial` | Bắt buộc cho `thietbi`, tùy chọn cho nhóm khác |
| `qty` | Luôn 1 với sản phẩm có serial; tồn hiện tại với sản phẩm không serial |
| `status` | Trạng thái vật lý hiện hữu; nguồn không serial vẫn là `available` và chỉ giảm `qty` |
| `groupId` | Trường tương thích từ cách tách bản ghi cũ |
| `assetGroupId` | ID Nhóm tài sản; thiếu trường được đọc như `inventory_asset` |

## `allocations`

Các trường cũ `deviceIds` và `qtys` được giữ nguyên. Phiếu mới có thêm metadata tùy chọn:

```js
{
  deviceIds: [sourceId],
  qtys: { [sourceId]: allocatedQuantity },
  sourceIds: { [sourceId]: sourceId },
  returnedQtys: { [sourceId]: returnedQuantity },
  newLocation: "Vị trí sử dụng",
  locations: { [sourceId]: "Vị trí sử dụng" },
  status: "completed" | "partial" | "returned"
}
```

Phiếu cũ không có các trường mới vẫn đọc được; `returnedQtys` thiếu được hiểu là 0.

## `returns`

Các trường cũ vẫn được giữ. Phiếu mới dùng ID nguồn trong `deviceIds`/`qtys` và thêm `allocationRefs` để truy vết lần thu hồi:

```js
allocationRefs: [{ allocationId, deviceId, sourceId, qty }]
```

## Persistence

`getStateSnapshot()` và `applyStateSnapshot()` không đổi. Các trường tùy chọn nằm bên trong phần tử `allocations`/`returns`, do đó JSON trong localStorage và `app_state.data` tự lưu/khôi phục mà không cần migration schema Supabase.

Không có thao tác tự động dọn, gộp hoặc xóa dữ liệu trùng đã tồn tại.

## `categoryConfig[].subcategories[].fields`

Định nghĩa đầy đủ được dùng khi tạo hoặc sửa cấu hình:

```js
{
  id: "ram",
  name: "ram",
  label: "RAM",
  type: "text" | "number" | "date" | "select" | "textarea",
  required: false,
  options: [],
  order: 0,
  placeholder: "",
  active: true
}
```

`id` là khóa ổn định; `name` được giữ làm alias tương thích dữ liệu cũ. Cấu hình cũ thiếu thuộc tính được chuẩn hóa khi đọc (`id <- name`, `order <- vị trí mảng`, `active <- true`) mà không tự ghi migration. Giá trị field vẫn nằm trực tiếp trên phần tử `devices` theo khóa ổn định, nên snapshot localStorage/Supabase không cần đổi schema.

## `assetGroups`

```js
[{ id: "fixed_asset", name: "Tài sản cố định" },
 { id: "construction_asset", name: "Tài sản công trình" },
 { id: "inventory_asset", name: "Tài sản tồn kho", isDefault: true }]
```

Danh sách nằm trong snapshot localStorage/Supabase. Khi snapshot cũ không có `assetGroups`, ứng dụng giữ danh sách mặc định trong bộ nhớ và không tự ghi đè `app_state` khi khởi động.
## Metadata người đứng tên tài sản

Form tài sản dùng trực tiếp `devices[].custodianName`, `devices[].custodianCode` và `devices[].custodianDept`; các field hệ thống này tách khỏi cấu hình trường động. Dữ liệu cũ thiếu mã nhân viên vẫn đọc bình thường. `assetChecked` chỉ là UI state và không được persist.

Xóa một bản kiểm kê lọc đúng `inventorySnapshots[].id`; không cascade sang `devices` hoặc giao dịch. Undo/Redo giữ tối đa 10 bản JSON của persistent state trong bộ nhớ với tổng giới hạn 25 MB; các stack không được persist vào localStorage hoặc Supabase.

## Metadata phục vụ Tổng quan theo tuần

Các bản ghi `addDevLogs` mới tạo bởi import thành công có thể chứa thêm:

```js
{
  importSuccess: true,
  fileName: "Danh-sach-thiet-bi.xlsx",
  sheetName: "Máy tính"
}
```

Đây là metadata tùy chọn và không thay đổi cấu trúc thiết bị. Log cũ thiếu các field này vẫn đọc bình thường và không bị tự động migration. Hoạt động sửa/xóa mới có thể dùng `refType`, `refId`, `serial`, `qty` và metadata vị trí để Tổng quan hiển thị đúng loại thao tác; `activities` cũ vẫn tương thích.

Dashboard không persist aggregate hay cache. Mọi KPI, biểu đồ và bảng thay đổi được tính khi đọc từ state hiện tại.
