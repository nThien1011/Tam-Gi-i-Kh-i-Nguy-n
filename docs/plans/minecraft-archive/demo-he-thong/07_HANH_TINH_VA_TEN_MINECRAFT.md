# 07 — Phân loại hành tinh NRO và đổi tên thành ý tưởng Minecraft

Đây là **bảng đối chiếu thiết kế**, không phải dữ liệu drop chính thức của NRO. File `planet_index.csv` ở bản lưu cũ chứa đủ 127 map, 92 mẫu quái, 1.468 item và 39 tên item sự kiện 2026 từ workbook; dữ liệu này không được đưa vào repository game web. Tên NRO chỉ để tra lại nguồn; tên Minecraft là đề xuất sáng tạo cho dự án và **không thay thế** các ID/runtime đã có trong `catalog.json`.

## Cách đọc cho đúng

- NRO có ba tuyến nhân vật khởi đầu **Trái Đất, Namếc, Xayda**, được [trang giới thiệu chính thức](https://ngocrongonline.com/gioi-thieu) xác nhận. Trong dự án Minecraft, ba tuyến này lần lượt gợi cảm hứng cho **Thiên Phong, Âm Mộc, Hỏa Hắc**.
- Workbook ghi `Gender=0/1/2/3` cho item. Bảng này đọc thành **hệ nhân vật được dùng**: Trái Đất/Namếc/Xayda/dùng chung. Nó **không chứng minh item rơi ở hành tinh đó**. Ví dụ item 353–360 mang tên “Ngọc Rồng Namek” nhưng `Gender=3`, nên ai cũng dùng được; cột `gợi ý chủ đề từ tên` mới ghi Namếc.
- Với map và quái, nhãn `đối chiếu nhiệm vụ` nghĩa là có mối liên hệ được nêu trong [hướng dẫn 26 nhiệm vụ](https://www.thegioididong.com/game-app/tong-hop-danh-sach-nhiem-vu-ngoc-rong-online-tu-a-z-moi-nhat-1354624); `suy luận` nghĩa là dựa vào tên/cụm ID trong workbook; `chưa xác minh` thì không gán cứng.
- Workbook **không có bảng spawn hoặc loot đầy đủ**. Những vật liệu ở cột “drop Minecraft” bên dưới là đề xuất gameplay mới, chưa có tỷ lệ hay cân bằng. Không đọc chúng như drop thật của NRO.

## Ba tuyến map → quái → vật liệu Minecraft

Mỗi tuyến có cấu trúc giống nhau để dễ cân bằng: làng an toàn → bãi quái cơ bản → elite “Mẹ” → vùng farm trung cấp → thủ lĩnh tuyến. Tên và địa hình đã thay đổi để tạo nhận diện riêng.

| Tuyến | Map NRO (ID) → map Minecraft | Quái/boss NRO (ID) → quái Minecraft | Drop Minecraft đề xuất | Vai trò |
|---|---|---|---|---|
| Thiên Phong | Làng Aru (0) → **Làng Bến Gió** | Mộc nhân (0) → **Bù Nhìn Gỗ** | Dăm Gỗ Tập Luyện | khu học đánh, chỉ thưởng quest |
| Thiên Phong | Đồi hoa cúc (1) → **Đồi Cúc Nắng** | Khủng long (1) → **Thằn Lằn Sừng** | Vảy Sừng Non | vòng farm đầu |
| Thiên Phong | Thung lũng tre (2) → **Thung Lũng Trúc** | Khủng long mẹ (4) → **Thằn Lằn Chúa** | Lõi Trúc Sấm | elite/mốc truyện đầu |
| Thiên Phong | Rừng Bamboo (27) → **Rừng Trúc Sấm** | Heo rừng (16) → **Lợn Rừng Sấm** | Nanh Sấm | vật liệu rèn tier 2 |
| Thiên Phong | Đảo Bulông (30) → **Đảo Gió Đồng** | Bulon (22) → **Bọ Máy Đồng** | Bánh Răng Đồng | nhánh công nghệ |
| Thiên Phong | Đông Karin (6) → **Đông Tháp Trời** | Tambourine (25) → **Tà Nhân Chuông Gió** | Chuông Gió Vỡ | thủ lĩnh tuyến |
| Âm Mộc | Làng Mori (7) → **Làng Rễ Lam** | Mộc nhân (0) → **Bù Nhìn Gỗ** | Dăm Gỗ Tập Luyện | khu học đánh |
| Âm Mộc | Đồi nấm tím (8) → **Đồi Nấm Tím** | Lợn lòi (2) → **Lợn Gai Rêu** | Gai Rêu | vòng farm đầu |
| Âm Mộc | Thị trấn Moori (9) → **Thị Trấn Suối Lục** | Lợn lòi mẹ (5) → **Lợn Gai Đầu Đàn** | Tim Rễ Ẩm | elite/mốc truyện đầu |
| Âm Mộc | Núi hoa vàng/tím (31–32) → **Núi Hoa Kim Lục/Tử Lam** | Heo da xanh (17) → **Lợn Rêu Lam** | Da Rêu Lam | vật liệu hồi phục/giáp |
| Âm Mộc | Đông Nam Guru (34) → **Bờ Đông Rễ Cổ** | Ukulele (23) → **Nhạc Quái Bào Tử** | Dây Đàn Nấm | nhánh kỹ năng hỗ trợ |
| Âm Mộc | Thung lũng Namếc (10) → **Thung Lũng Lục Thạch** | Drum (26) → **Trống Cổ Mộc** | Mặt Trống Rễ | thủ lĩnh tuyến |
| Hỏa Hắc | Làng Kakarot (14) → **Làng Tro Đỏ** | Mộc nhân (0) → **Bù Nhìn Gỗ** | Dăm Gỗ Tập Luyện | khu học đánh |
| Hỏa Hắc | Đồi hoang (15) → **Đồi Hoang Tích** | Quỷ đất (3) → **Quỷ Bụi Tro** | Bụi Tro Đỏ | vòng farm đầu |
| Hỏa Hắc | Làng Plant (16) → **Làng Dung Nham** | Quỷ đất mẹ (6) → **Quỷ Tro Mẫu** | Tim Nham | elite/mốc truyện đầu |
| Hỏa Hắc | Rừng đá (36) → **Rừng Cột Đá** | Heo Xayda (18) → **Lợn Nanh Tro** | Nanh Đá Cháy | vật liệu sát thương/giáp |
| Hỏa Hắc | Bờ vực đen (38) → **Bờ Vực Tro** | Quỷ mập (24) → **Quỷ Bụng Than** | Túi Than Nóng | nhánh nguy hiểm |
| Hỏa Hắc | Thành phố Vegeta (19) → **Thành Trì Chiến Hỏa** | Akkuman (27) → **Ác Quỷ Hắc Giáp** | Mảnh Hắc Giáp | thủ lĩnh tuyến |

Các cặp boss “Mẹ”, heo rừng/da xanh/Xayda, Bulon/Ukulele/Quỷ mập và ba thủ lĩnh có quan hệ map–quái trong hướng dẫn nhiệm vụ. **Ba quái ở ba đồi đầu** được ghép theo thứ tự ID/HP của workbook, chưa có câu nêu đích danh trong hướng dẫn; phải rà lại spawn thật trước khi code. Không tự gán `Mộc nhân` thành quái riêng của một hành tinh: nó xuất hiện trong cả ba làng khởi đầu.

## Bộ item nên đưa vào Minecraft

Item được phân **theo quyền dùng**, không theo vị trí rơi. Các tên dưới đây là tên thủ công, đủ làm gợi ý lore/asset; item ngoài bảng có tên tạm dạng `Tên tộc · Loại 0000` trong CSV và cần duyệt mỹ thuật.

| Nhóm dùng | Item NRO (ID) | Tên Minecraft đề xuất | Chức năng đề xuất |
|---|---|---|---|
| Thiên Phong | Áo vải 3 lỗ (0), Găng vải đen (21), Giầy nhựa (27) | **Áo Gió Sơ Khai**, **Găng Cước Gió**, **Ủng Đường Mòn** | set starter thiên cơ động |
| Thiên Phong | Sách đấm Dragon lv1 (66), Sách Kamejoko lv1 (94) | **Bí Kíp Quyền Phong I**, **Bí Kíp Sóng Lam I** | cận chiến và đạn năng lượng |
| Thiên Phong | Áo vải Kame (136), Cân đẩu vân (346) | **Áo Đạo Sĩ Gió**, **Mây Lướt Gió** | áo midgame và thú cưỡi |
| Âm Mộc | Áo sợi len (1), Găng sợi len (22), Giầy sợi len (28) | **Áo Sợi Rễ Non**, **Găng Rễ Mềm**, **Ủng Rêu Sương** | set starter hồi phục/kiểm soát |
| Âm Mộc | Sách đấm Demon lv1 (79), Sách học Trị thương lv1 (122) | **Bí Kíp Quyền Rễ I**, **Bí Kíp Dưỡng Sinh I** | đòn đánh và hỗ trợ tổ đội |
| Âm Mộc | Áo choàng len (152), Phi Long (347) | **Áo Choàng Nấm Cổ**, **Long Dực Rêu** | áo midgame và thú cưỡi |
| Hỏa Hắc | Áo vải thô (2), Găng vải thô (23), Giầy vải thô (29) | **Áo Vải Tro**, **Găng Than Thô**, **Ủng Tro Nóng** | set starter thiên sát thương |
| Hỏa Hắc | Sách đấm Galick lv1 (87), Tái tạo năng lượng lv1 (129) | **Bí Kíp Quyền Diệm I**, **Bí Kíp Hồi Diệm I** | burst và tự hồi năng lượng |
| Hỏa Hắc | Áo giáp bạc (168), Ván bay (348) | **Giáp Bạc Tro**, **Ván Lướt Tro** | giáp midgame và vật phẩm di chuyển |
| Dùng chung | Rada cấp 1 (12), Đậu thần cấp 1 (13) | **La Bàn Linh Quang I**, **Hạt Mầm Hồi Sinh I** | dò mục tiêu và hồi phục |
| Dùng chung | Ngọc Rồng 1–7 sao (14–20) | **Mảnh Thiên Thạch 1–7** | sưu tập cho nghi lễ riêng, không bê nguyên cơ chế 7 viên |
| Dùng chung | Đá nâng cấp (220–224) | **Lõi Lục/Lam/Hồng/Thép Sao/Tử Tinh** | vật liệu rèn có sink rõ ràng |
| Dùng chung, chủ đề Namếc | Ngọc Rồng Namek (353–360) | **Mảnh Rừng Sao 1–7**, **Tinh Hạch Rừng Sao** | tuyến sưu tập phụ; không khóa dùng bởi Âm Mộc |
| Dùng chung | Sao pha lê (441–447) | **Ấn Tinh Hồng/Lam/Đào/Tử/Cam/Kim/Lục** | rune gắn vào trang bị |

Không nhập tất cả 1.468 item vào bản Alpha. Ưu tiên: starter theo ba tộc → vật liệu vùng → đá nâng cấp/dụng cụ chung → sách kỹ năng → thú cưỡi/trang phục. `Type=5` có 347 item cải trang/ảnh đại diện; nhiều tên không mô tả hình, nên CSV đánh dấu **cần xem icon/art**, không bịa một tên mỹ thuật hoàn chỉnh. 39 tên sự kiện Hè 2026 dùng STT riêng, chưa có Item ID để nối với catalog chính.

## Map/quái không nên nhét vào ba hành tinh khởi đầu

| Dải/ID | Cách xử lý |
|---|---|
| Map 24–26, ba “Trạm tàu vũ trụ” trùng tên | Tạm ghép lần lượt Trái Đất/Namếc/Xayda theo thứ tự ID, **chưa xác minh cổng**. |
| Map 48, 50, 116 Kaio; 63–83 tuyến Nappa/Fide (trừ 76); 85–91 các hành tinh có tên riêng; 105–110 vùng băng | Gắn **hành tinh khác**; mở thành arc sau, không pha vào biome starter. |
| Map 49, 51–62, 112–115, 117–121, 125 | **Phó bản/khu chung**: đấu trường, phòng tập, doanh trại, phòng chờ; không mang nhãn chủng tộc. |
| Map 84, 92–104 (trừ ID 95, 101) và quái 58–65 | **Trái Đất tương lai** theo cụm nội dung; tách timeline khỏi tuyến Trái Đất khởi đầu. |
| Map 76 Núi đá; 95, 101 chỉ có tên số; 122–124 Ngũ Hành Sơn; 126 Santa | **Chưa xác định**: Núi đá được bài nhiệm vụ gắn với Heo Xayda nhưng nằm trong cụm ID tuyến xa, cần kiểm tra cổng; các map còn lại thiếu ngữ cảnh. |
| Quái 31–33, 70–91 (trừ mục có chứng cứ riêng) | Workbook không ghi spawn map. Để **chưa xác định**; không đoán theo hình dáng hoặc tên. |

## Cách đưa vào hệ demo hiện có

`catalog.json` hiện là một vertical slice nhỏ, có tên và chỉ số riêng. Bảng này là **backlog Mốc 2+**, không sửa số liệu Alpha. Khi chọn một tuyến để mở rộng, thêm một `map_id` mới, một `mob_id`, một `loot_table` và một item vật liệu tương ứng; dùng ID NRO **chỉ trong trường provenance/note**, không làm khóa runtime. Tỷ lệ rơi, HP, XP và giá nâng đồ phải do playtest Minecraft quyết định; NRO không cung cấp thông số tương đương đáng tin ở workbook.

Nguồn đối chiếu: workbook nghiên cứu ở bản lưu cũ (không đưa vào repository), [giới thiệu NRO chính thức](https://ngocrongonline.com/gioi-thieu), [hướng dẫn nhiệm vụ của Thế Giới Di Động](https://www.thegioididong.com/game-app/tong-hop-danh-sach-nhiem-vu-ngoc-rong-online-tu-a-z-moi-nhat-1354624). Hướng dẫn nhiệm vụ ghi cập nhật 27/02/2023, không phải xác nhận trạng thái live 2026. Tên, icon và art gốc thuộc IP NRO; chỉ dùng để đối chiếu nội bộ, không đưa nguyên asset vào server công khai.
