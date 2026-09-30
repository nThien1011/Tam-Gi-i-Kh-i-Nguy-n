# 00 — Khởi tạo và khóa phạm vi

## 1. Product statement

Server là một RPG hành động trên Minecraft Java, lấy cảm hứng ở cấp độ nguyên tắc từ game progression kiểu Dragonboy: ba tộc bổ trợ nhau, dùng KI để tung skill, phá giới mở nội dung và cùng đánh boss. Toàn bộ tên, lore, model, texture, âm thanh, quest và visual phải là tài sản gốc của dự án.

## 2. Người chơi mục tiêu của Alpha

- Người chơi Minecraft Java thích RPG/action, sẵn sàng dùng resource pack nếu cần.
- Nhóm test nhỏ 10–30 người; không phải audience đại chúng hay mô hình kiếm tiền.
- Phiên chơi mục tiêu: 30–60 phút, nhóm 1–4 người.
- Thiết bị đầu vào: bàn phím/chuột; không giả định mod client bắt buộc.

## 3. Lời hứa trải nghiệm bản đầu

Trong 10 phút đầu, người chơi phải chọn tộc, nhận skill signature, hiểu KI/cooldown và đánh được mob. Trong 40 phút, họ phải hoàn thành boss đầu, có một nâng cấp thấy rõ và biết mốc tiếp theo là gì.

Nếu một người chơi mới không đạt được các trạng thái trên mà không cần GM trợ giúp, bản đầu chưa sẵn sàng Alpha.

## 4. Scope lock: Vertical Slice v1

### Bắt buộc

| Nhóm | Nội dung khóa |
|---|---|
| Account/player | Dùng Minecraft UUID; chọn 1 tộc không đổi trong Alpha; profile persistent. |
| Combat | Server-authoritative KI, cast, cooldown, target validation, damage và knockback. |
| Tộc | Thiên Phong, Âm Mộc, Hỏa Hắc; mỗi tộc 1 skill active và 1 passive. |
| Progression | Mốc 1 → 2; điểm tiềm năng SD/HP/KI; giới hạn nhỏ, dễ đo balance. |
| Content | Hub + 3 zone ngắn + 5 quest + 5 mob template + 1 boss 2 phase. |
| Equipment | Vũ khí, giáp, phụ kiện; rarity cơ bản; nâng cấp 0★→3★. |
| Vận hành | DB migration, backup/restore, audit log currency/item/GM, crash/error log. |

### Cấm trong bản đầu

- Đệ tử, hợp thể, boss tích lũy, boss thế giới, dungeon, guild.
- Trade, Auction House, mailbox, drop shared loot phức tạp.
- Donate, payment, rank tăng sức mạnh, top donate.
- AFK offline hoặc AFK không giới hạn.
- PvP rank/ELO, nhiều world hoàn chỉnh, 7 mốc, 7 sao.
- Resource pack/art cuối cùng; chỉ dùng placeholder hợp pháp trong prototype.

## 5. Các quyết định mặc định để không bị kẹt

Các giá trị này là mặc định cho v1. Chỉ thay đổi khi test chỉ ra vấn đề.

| Chủ đề | Quyết định v1 | Lý do |
|---|---|---|
| Team size | 1 coder + 1 designer/builder | Thiết kế theo năng lực hiện có. |
| Tộc | Chọn một lần, không đổi | Tránh exploit đổi tộc/balance và tạo identity. |
| PvP | Tắt trong vertical slice | Không để balance PvP che mất vấn đề PvE core. |
| Currency | 1 Đồng Linh, không trade | Dễ kiểm soát source/sink và audit. |
| Nâng cấp | 0→3 sao, thất bại giảm 1 sao, không phá đồ | Không làm tester mất tiến độ. |
| Loot boss | Eligibility theo đóng góp; last hit chỉ cosmetic/bonus nhỏ | Giảm KS và toxic play. |
| Stats | HP và damage dùng số nhỏ | Dễ đọc, dễ test, tránh lỗi scale. |
| Monetization | Tắt hoàn toàn | Dữ liệu gameplay không bị nhiễu bởi paywall. |
| NPC dialogue | Citizens + Denizen chỉ cho presentation | Business rules/quest state nằm trong plugin core. |
| Map | Builder làm blockout trước art | Kiểm tra đường đi/mob density trước khi tốn công art. |

## 6. Cổng G0 — Điều kiện bắt đầu code

Chỉ mở technical spike khi mọi mục sau có câu trả lời trong file 07:

- Tên tạm của server, hub, ba tộc và boss đầu.
- Chọn bản Paper/Java sau compatibility matrix.
- Ai chịu trách nhiệm code, build map, viết dialogue, QA.
- Kho Git, convention branch/PR và nơi lưu database local.
- Chọn host test nội bộ và chiến lược backup.
- Chấp thuận scope lock ở mục 4.

## 7. Definition of Done cho tài liệu design

Một design chỉ được đánh dấu DESIGN READY khi có đủ:

1. ID ổn định.
2. Mô tả cho người chơi.
3. Điều kiện vào/kích hoạt.
4. Input và kết quả xác định.
5. Trường dữ liệu cần lưu.
6. Edge case hoặc fail state.
7. Cách đo nghiệm thu.

Không dùng cụm “cân nhắc sau”, “mạnh”, “hiếm”, “nhiều” trong ticket triển khai nếu chưa có số hoặc điều kiện cụ thể.
