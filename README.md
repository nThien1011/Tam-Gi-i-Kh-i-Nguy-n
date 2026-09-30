# Mạch Giới Online — bản chơi trên máy

Game RPG hành động 2D nhìn từ trên chếch xuống, chạy trực tiếp trong trình duyệt. Đây là **bản chơi đầu tiên** dựa trên [kế hoạch dài hạn](./KE_HOACH_GAME_WEB_DAI_HAN.md), chưa phải toàn bộ các chương và hệ thống được đề xuất trong kế hoạch.

Toàn bộ tài liệu kế hoạch và quyết định chuyển từ Minecraft sang web nằm trong [mục lục kế hoạch](./docs/plans/README.md). Tài liệu Minecraft cũ được giữ để tra cứu; kế hoạch web và quyết định mới nhất được ưu tiên khi có khác biệt.

## Chạy game

Trên máy hiện tại, mở `START_GAME.cmd` rồi vào **http://127.0.0.1:3000**. Giữ cửa sổ máy chủ mở trong lúc chơi; nhấn `Ctrl+C` để dừng. Máy chủ chỉ nghe ở `127.0.0.1` theo mặc định.

Nếu mang dự án sang máy khác, cài Node.js **24 trở lên**, chạy `npm install` trong thư mục này rồi `npm start`. Có thể đặt `PORT` và `HOST` qua biến môi trường khi cần. Thư mục `data/` chứa tài khoản, nhân vật và nhật ký SQLite. Hãy dừng máy chủ trước khi sao lưu toàn bộ thư mục này.

## Đang chơi được

- Tạo tài khoản, đăng nhập, lưu nhân vật; nhiều trình duyệt có thể cùng vào thế giới trên máy chủ này.
- Chọn 1 trong 3 tộc, di chuyển ở 5 bản đồ, nói chuyện với NPC, đi cổng, thu thập gỗ/quặng/dược liệu.
- Đánh thường, kỹ năng riêng từng tộc, quái truy đuổi, hồi sinh, boss hai giai đoạn có vùng nguy hiểm báo trước và thưởng theo đóng góp.
- 5 nhiệm vụ mở đầu, một chương truyện, cấp độ, Đồng Linh, túi đồ, chế bình hồi phục, nâng vũ khí đến 10 sao.
- Sau chương mở đầu: khế ước săn 25 dị thú lặp lại để lấy vật liệu; boss có thể đánh lại.
- Chat theo bản đồ và giao diện máy tính.
- Bộ hình riêng cho nhân vật, quái, boss và tài nguyên; tùy chọn **Đồ họa** gồm Tiết kiệm, Cân bằng và Chi tiết cao. Bảng này hiển thị FPS để kiểm tra máy của bạn.
- Chuyển động đứng/chạy/đánh/trúng đòn, nhịp của quái và boss, cổng rung sáng, hiệu ứng riêng ba tộc và chỉ báo hồi chiêu. Người chơi cùng bản đồ nhìn thấy hiệu ứng chiến đấu của nhau.

## Điều khiển

| Phím | Tác dụng |
| --- | --- |
| WASD / mũi tên | Di chuyển |
| J / Space | Đánh thường |
| K | Kỹ năng tộc |
| F | Tương tác / thu thập / vào cổng |
| H | Dùng bình hồi phục |
| I | Túi đồ |
| Enter | Chat |
| Esc | Đóng bảng |

Cửa hàng hiện chỉ hiển thị **mẫu gói nạp**; chưa thu tiền, chưa cấp hàng trả phí.

Nếu hình bị giật trên máy tính, mở **Đồ họa → Tiết kiệm**. Vị trí trên màn hình được nội suy giữa các gói đồng bộ của máy chủ local; tùy chọn này giảm độ phân giải Canvas và hiệu ứng làm mờ. [Hướng đồ họa và nguồn tham khảo](./ART_DIRECTION.md).

### Tài khoản thử `jdjd747`

Tài khoản này đã được mở Mốc 2, cấp 30, vũ khí 10 sao, toàn bộ loại vật phẩm đang hoạt động, 1.000.000 Đồng Linh và quyền vào đấu trường. Nhiệm vụ đang ở **Khí mạch thức tỉnh** để bạn vẫn chơi tiếp chuỗi nhiệm vụ mở đầu. Mật khẩu không bị thay đổi. Chương truyện đã mở có thể xem lại từ nút **Truyện**. Hồ sơ trước khi cấp đồ được lưu trong `data/backups/`. Script `node scripts/prepare-test-account.mjs jdjd747` có thể cấp lại bộ đồ test khi **máy chủ đã dừng**; mỗi lần chạy script tạo thêm một bản sao hồ sơ trước khi sửa.

## Phạm vi tiếp theo

Các chương I–IV, trang bị nhiều ô, bang hội, giao dịch, kinh tế cân bằng, âm thanh, sprite nhân vật/quái hoàn chỉnh, vận hành trực tuyến và bản mobile đóng gói chưa nằm trong bản chơi này. Cần playtest trước khi chốt giá, chỉ số gói nạp và tích hợp cổng thanh toán. Ảnh nền màn hình đăng nhập là tài sản minh họa gốc trong `public/assets/title-landscape.png`; nhân vật và bản đồ hiện được vẽ bằng Canvas.

## Kiểm thử

Chạy `npm test` hoặc `node --test`. Bộ kiểm thử hiện bao phủ tài khoản/phiên, lưu tiến trình, nhiệm vụ, rèn/chế đồ, chiến đấu boss và khế ước lặp lại.
