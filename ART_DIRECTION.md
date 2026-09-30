# Hướng đồ họa Mạch Giới

## Đã đưa vào bản local

- Góc nhìn 2D từ trên chếch xuống, nhân vật đứng trên mặt đất và đối tượng che khuất theo tọa độ Y.
- Ba tộc có hình nhân vật riêng; ba loài dị thú và Thủ Hộ Tam Giới có hình riêng.
- Cây cổ, quặng linh và dược liệu có minh họa mới. Các hình nằm trong `public/assets/` và được tạo riêng cho dự án; không tải tài sản của trò chơi khác vào bản build.
- Bản đồ được vẽ bằng Canvas để giữ đường đi, vị trí cổng và tài nguyên đúng với hệ chơi. Giao diện dùng HTML/CSS để dễ đọc và chỉnh sửa.

## Hướng tiếp theo

Các hình hiện là sprite tĩnh. Để đạt chất lượng phát hành, mỗi nhân vật cần bộ chuyển động 8 hướng: đứng, chạy, đánh, dùng kỹ năng, trúng đòn, gục ngã. Tiếp đó cần họa sĩ chốt cùng tỉ lệ hình, đường nét, bóng đổ và kích thước cho toàn bộ NPC, cổng, địa hình. Tránh trộn sprite pixel 16×16 với nhân vật minh họa chi tiết trong bản cuối.

## Nguồn tham khảo để đánh giá trước khi dùng

| Nguồn | Giá trị tham khảo | Ghi chú sử dụng |
| --- | --- | --- |
| [Kenney Roguelike/RPG Pack](https://kenney.nl/assets/roguelike-rpg-pack) | Bộ tile và vật thể 2D rất rộng để thử nhanh bản đồ | Trang pack ghi CC0; phong cách pixel chưa khớp hình hiện tại. |
| [Kenney Fantasy UI Borders](https://kenney.nl/assets/fantasy-ui-borders) | Khung, bảng và nút fantasy | Trang pack ghi CC0; chỉ cân nhắc nếu thay giao diện đồng bộ. |
| [OpenGameArt FAQ](https://opengameart.org/content/faq) | Kho cộng đồng để tìm sprite, nhạc và hiệu ứng | Giấy phép khác nhau theo từng asset; kiểm tra điều kiện ghi công và thương mại cho từng trang trước khi nhập dự án. |
| [itch.io Top-Down RPG Assets](https://itch.io/game-assets/free/genre-rpg/tag-top_down) | Tìm tác giả, phong cách và gói sprite 2D | Giấy phép do từng tác giả đặt; không giả định mục “free” là được dùng thương mại. |

Ưu tiên bộ hình gốc thống nhất. Bản local hiện dùng chuyển động Canvas cho sprite đứng, chạy, đánh và trúng đòn; đây chưa phải bộ khung hình vẽ riêng cho 8 hướng. Khi thêm asset bên ngoài, lưu tên tác giả, URL, giấy phép, phiên bản tải và yêu cầu ghi công trong một bảng riêng.
