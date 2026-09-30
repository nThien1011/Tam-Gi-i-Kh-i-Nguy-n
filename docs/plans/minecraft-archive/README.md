# Bộ kế hoạch triển khai server Minecraft

## Mục đích

Đây là bộ tài liệu để biến GDD thành một bản demo chơi được, sau đó mở rộng theo dữ liệu test. Nó không phải cam kết xây toàn bộ hệ thống của game ngay từ đầu.

Mục tiêu phiên bản đầu tiên là chứng minh bốn điều:

1. Ba tộc tạo ra ba cách đánh khác nhau.
2. Vòng lặp chọn tộc → quest → skill → boss → nâng cấp có vui trong 20–40 phút.
3. Dữ liệu nhân vật và vật phẩm không mất/nhân đôi sau restart.
4. Coder có thể thêm mob, item, quest và balance bằng data thay vì viết lại core.

## Thứ tự đọc và thực hiện

| Thứ tự | File | Dùng khi nào |
|---:|---|---|
| 0 | [00_KHOI_TAO_VA_PHAM_VI.md](00_KHOI_TAO_VA_PHAM_VI.md) | Chốt phạm vi và quyết định trước code. |
| 1 | [01_THIET_KE_GAMEPLAY_VERTICAL_SLICE.md](01_THIET_KE_GAMEPLAY_VERTICAL_SLICE.md) | Coder/designer dựng game loop đầu tiên. |
| 2 | [02_THIET_KE_MAP_NPC_NOI_DUNG.md](02_THIET_KE_MAP_NPC_NOI_DUNG.md) | Builder và writer dựng map, NPC, quest. |
| 3 | [03_DU_LIEU_VA_CAN_BANG.md](03_DU_LIEU_VA_CAN_BANG.md) | Tạo catalog mob/item/skill/quest và chỉnh balance. |
| 4 | [04_KIEN_TRUC_KY_THUAT.md](04_KIEN_TRUC_KY_THUAT.md) | Coder dựng plugin, database, test và bảo mật. |
| 5 | [05_BACKLOG_VA_MOC_GIAO_HANG.md](05_BACKLOG_VA_MOC_GIAO_HANG.md) | Chia công việc theo milestone/sprint. |
| 6 | [06_QA_ALPHA_VA_VAN_HANH.md](06_QA_ALPHA_VA_VAN_HANH.md) | Test, backup, closed alpha và quyết định Beta. |
| 7 | [07_SO_DANG_QUYET_DINH.md](07_SO_DANG_QUYET_DINH.md) | Theo dõi các lựa chọn chưa chốt, không để scope trôi. |
| 8 | [08_TIEU_CHI_LAP_KE_HOACH_NOI_DUNG.md](08_TIEU_CHI_LAP_KE_HOACH_NOI_DUNG.md) | Mẫu/checklist để lập kế hoạch map, quest, boss, item, skill và content mới. |
| 9 | [demo hệ thống/README.md](demo-he-thong/README.md) | Catalog và đặc tả demo map → quái → item/drop → boss, kèm kiểm tra liên kết dữ liệu. |

## Bản đồ lối đi

~~~
G0: Chốt phạm vi
      ↓
G1: Technical spike chạy được
      ↓
G2: Combat sandbox vui và không exploit
      ↓
G3: Vertical slice hoàn chỉnh
      ↓
G4: Closed Alpha 10–30 tester
      ↓
G5: Dữ liệu chứng minh core loop tốt
      ↓
Beta: chỉ chọn MỘT hệ lớn tiếp theo
~~~

Không được đưa tính năng của cổng sau vào cổng trước, trừ khi nó là điều kiện bắt buộc để kiểm thử cổng hiện tại.

## Phạm vi theo giai đoạn

| Giai đoạn | Có | Không có |
|---|---|---|
| Prototype | profile, 3 tộc, 3 skill, dummy mob, database, log | map hoàn chỉnh, quest, boss, economy, donate |
| Vertical slice | hub, 3 zone ngắn, 5 quest, 1 boss, mốc 1→2, 3 slot đồ | đệ tử, AH, trade, guild, world boss, 7 mốc, payment |
| Closed Alpha | telemetry, balance, QA, 10–30 tester | P2W, public marketing, endgame |
| Beta | chọn một: đệ tử hoặc dungeon hoặc guild | không triển khai đồng thời ba hệ |
| Launch | mở rộng theo chỉ số thực nghiệm | không lấy GDD làm lý do để thêm scope vô hạn |

## Quy ước trạng thái

- NOT STARTED: chưa làm.
- DESIGN READY: đặc tả đủ để bắt đầu code/build.
- IN BUILD: đang triển khai.
- VERIFIED: có test/tiêu chí nghiệm thu chứng minh chạy đúng.
- DEFERRED: chủ động để giai đoạn sau.

Mọi thay đổi phạm vi phải cập nhật file 07 trước khi lập ticket code.
