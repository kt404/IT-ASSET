# Product management test report

Ngày chạy: 2026-08-19. Harness: `tests/product-management.test.html`, Chrome headless, dữ liệu giả cô lập. Harness không tải `supabase.config.js`, không tạo Supabase client và stub `saveData()` cho các test nghiệp vụ.

## Kết quả tự động

Kết quả: **16 assertions pass, 0 fail**.

| Yêu cầu | Kết quả |
|---|---|
| Thiết bị không serial bị từ chối | Pass |
| Thiết bị trùng serial bị từ chối | Pass |
| Ngoại vi không serial số lượng 10 tạo một bản ghi | Pass |
| Nhập tiếp tên chuẩn hóa số lượng 7 thành tổng 17 | Pass |
| Cùng tên khác danh mục không gộp | Pass |
| Có serial không gộp và ép số lượng 1 | Pass |
| Cấp 1 từ 17, lưu ID nguồn, tồn còn 16 | Pass |
| Thu hồi 1 về đúng nguồn, tồn trở lại 17 | Pass |
| Cấp 5, thu hồi 2 rồi 3, trạng thái partial/returned đúng | Pass (2 assertions) |
| Thu hồi vượt số còn lại bị từ chối, không đổi tồn | Pass |
| JSON/localStorage round-trip giữ số lượng và metadata nguồn | Pass |
| Import dòng không serial trùng tên cộng số lượng | Pass |
| Phiếu cũ có nhiều nguồn fallback phù hợp bị từ chối rõ ràng | Pass |
| Phiếu cũ có `groupId` xác định đúng nguồn | Pass |

Ngoài danh sách bắt buộc, test còn xác nhận serial được trim/so sánh không phân biệt hoa thường, tên hiển thị cũ được giữ và sản phẩm có serial luôn có `qty = 1`.

## Chưa chạy trên dữ liệu thật

- Chưa thao tác thêm/import/cấp phát/thu hồi bằng giao diện chính với Supabase thật.
- Chưa refresh trang chính sau khi ghi Supabase thật.
- Chưa chạy import từ một file `.xlsx` vật lý; logic xác nhận import được chạy trực tiếp với các dòng đã parse.

Các test này không chạy để tránh ghi hoặc làm thay đổi `app_state` thật. Cần acceptance test riêng trên project/dataset Supabase thử nghiệm.
