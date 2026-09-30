# Demo hệ thống map → quái → item/drop → boss

## Mục tiêu

Bộ này là đặc tả và catalog dữ liệu cho **vertical slice Minecraft Java**: người chơi chọn một trong ba tộc, đi vùng tương ứng, hạ quái, lấy vật liệu, nâng vũ khí, vượt cổng boss và mở Mốc 2. Nó đủ cụ thể để builder, designer, coder và QA cùng đối chiếu. Chưa có plugin Paper hoặc thế giới Minecraft được dựng trong thư mục này.

```text
MAP_HUB ── chọn tộc, nhận 3 món starter + skill
   ├── MAP_THIEN_PHONG ── MOB_SPARK_RAT ── Đồng Linh + Mảnh Khởi Hành
   ├── MAP_AM_MOC ─────── MOB_ROOTLING ─── Đồng Linh + Mảnh Khởi Hành
   ├── MAP_HOA_HAC ────── MOB_CINDER_HOUND ── Đồng Linh + Mảnh Khởi Hành
   └── MAP_BOSS_GATE ──── Wisp/Thạch Vệ ── vật liệu phụ
                                  ↓ Q_INTRO_04 hoàn tất
                              MAP_ARENA
                                  ↓
                       BOSS_TRINITY_WARDEN
                                  ↓
                       Mốc 2 + reward cá nhân
```

## Hồ sơ trong thư mục

| File | Nội dung |
|---|---|
| [catalog.json](catalog.json) | ID và số baseline duy nhất cho 6 khu, 10 cổng, 13 item, 5 mob, 6 loot table, 1 boss và 5 quest. |
| [01_MAP_VA_DUONG_DI.md](01_MAP_VA_DUONG_DI.md) | Layout, cổng, NPC, spawn, điều kiện mở và công việc của builder. |
| [02_ITEM_DROP_ECONOMY.md](02_ITEM_DROP_ECONOMY.md) | Item, bảng rơi, quyền sở hữu loot, nâng cấp và dòng tiền. |
| [03_BOSS_VA_QUEST.md](03_BOSS_VA_QUEST.md) | Quest chain, boss 2 phase, eligibility, reset và reward. |
| [04_KY_THUAT_VA_QA.md](04_KY_THUAT_VA_QA.md) | Contract triển khai, lưu state, chống nhân đôi và test nghiệm thu. |
| [05_NGUON_VA_DOI_CHIEU.md](05_NGUON_VA_DOI_CHIEU.md) | Liên hệ với workbook NRO, nguồn web và phần do dự án tự thiết kế. |
| [06_MO_RONG_NOI_DUNG.md](06_MO_RONG_NOI_DUNG.md) | Hợp đồng mở rộng sang các map/item/boss còn lại của workbook. |
| [07_HANH_TINH_VA_TEN_MINECRAFT.md](07_HANH_TINH_VA_TEN_MINECRAFT.md) | Phân loại ba hành tinh, gợi ý tên mới và tuyến map → quái → vật liệu. |
| `planet_index.csv` | Bảng đối chiếu ID nguồn trong bản lưu cũ; không đưa vào repository game web. |
| `build_planet_index.py` | Script tạo CSV từ workbook trong bản lưu cũ; không đưa vào repository game web. |
| [validate_catalog.py](validate_catalog.py) | Kiểm tra JSON, ID, tham chiếu, map graph, loot và quest graph. |

Chạy kiểm tra dữ liệu:

```powershell
python "docs/plans/minecraft-archive/demo-he-thong/validate_catalog.py"
```

## Ranh giới bản demo

- Dùng scope của [00_KHOI_TAO_VA_PHAM_VI.md](../00_KHOI_TAO_VA_PHAM_VI.md): 3 tộc, 3 slot trang bị, 5 quest, 5 mob, 1 boss, Mốc 1→2.
- Tên/asset hiển thị trong catalog là sáng tạo riêng của dự án. ID NRO chỉ là dấu vết nghiên cứu ở tài liệu đối chiếu, không là khóa runtime.
- Tỷ lệ drop, chỉ số và tọa độ trong `catalog.json` là **baseline đề xuất**. Chưa được playtest hoặc đo trong Minecraft; không ghi là dữ liệu live NRO.
- `coordinate_status` đang là blockout đề xuất. Builder phải đo chiều cao nền, vật cản, spawn và đường đi trước khi chuyển DEC-022 thành DECIDED.
- Quyết định còn mở: phiên bản Paper/Java, map blockout thực tế, art/sound và tên boss cuối. Các điều này không làm đứt liên kết dữ liệu trong catalog, nhưng chặn việc gọi hệ thống là VERIFIED.

## Tiêu chí đạt G3

Ba tester mới hoàn thành chọn tộc → 8 quái → nâng 1★ → boss → Mốc 2 trong tối đa 40 phút mà không cần GM. Quái thường chết trong 8–14 giây, boss nhóm 2 người trong 3–6 phút, không có item/tiền/quest reward bị cấp hai lần sau relog hoặc retry.
