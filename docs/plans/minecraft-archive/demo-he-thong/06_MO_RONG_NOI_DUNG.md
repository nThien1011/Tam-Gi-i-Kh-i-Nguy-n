# 06 — Cách mở rộng từ demo sang catalog lớn

## Mục đích

Workbook có 127 map, 1.468 item snapshot, 92 mob và 49 boss/đối thủ, nhưng thiếu quan hệ drop đầy đủ. Demo hiện triển khai 6 khu (gồm hành lang boss), 13 item, 5 mob và 1 boss. Bảng này định tuyến phần còn lại mà không tạo drop rate hoặc cơ chế như thể đã được nguồn xác minh.

## Hợp đồng cho mỗi tuyến mới

Mỗi tuyến playable phải có chuỗi tham chiếu khép kín:

```text
MAP_ID → portal/gate → spawn ID → MOB_ID/BOSS_ID
      → LOOT_TABLE_ID → ITEM_ID → sink/use/unlock
      → QUEST_ID hoặc activity ID → telemetry + QA
```

Một item chỉ được bật nếu có nguồn nhận **và** công dụng/sink rõ, không phá economy hiện có. Một boss chỉ được bật nếu có map, điều kiện mở, spawn/reset, party/eligibility, telegraph, loot, cooldown và chống cấp thưởng trùng. Map chỉ được bật nếu có đường đi/đường về, spawn/NPC/landmark, an toàn và mục tiêu quay lại.

## Tầng ưu tiên sau G3

| Tầng | Map/đối thủ tham khảo từ workbook | Hệ thống có thể mở | Điều kiện để thiết kế tiếp |
|---|---|---|---|
| A — Vertical slice hiện tại | Ba hành tinh mở đầu, quái thường, ba boss “Mẹ” như mẫu nhịp tiến trình | Hub + 3 zone + 1 boss gốc | Hoàn thành G3/G4; metric combat, retention và economy ổn. |
| B — Tuyến elite theo vùng | Các khu đầu như Thung lũng tre, Thị trấn Moori, Làng Plant và mục tiêu mạnh hơn | 3 encounter elite riêng, mỗi tộc một biến thể cơ chế; item sidegrade gốc | Chỉ nếu tester muốn nội dung theo tộc; phải có thêm art và test TTK. |
| C — Chuỗi boss có thứ tự | Tuyến Tiểu đội sát thủ, Fide nhiều cấp, Android/Xên trong workbook | Quest chain/boss sequence archetype, prerequisite và reward từng bước | Sau khi engine quest chain và boss instance chống dupe đã VERIFIED. |
| D — Boss thế giới/sự kiện | Broly, Hirudegarn, boss arena/giải đấu | World boss, lịch sự kiện, đấu trường và loot nhiều party | Ngoài Alpha; cần contribution liên party, anti-AFK, spawn lịch, load test và economy riêng. |

Tên/map NRO ở bảng chỉ giúp đối chiếu mẫu tiến trình. Content phát hành cần ID, tên, lore, visual, âm thanh và layout riêng; không lấy HP hay tiền NRO làm số Minecraft.

## Quy trình đưa một hàng workbook vào staging

| Trường staging | Cách điền |
|---|---|
| `origin_sheet`, `origin_row`, `origin_id` | Dấu vết tra cứu workbook; không là runtime ID. |
| `candidate_kind` | Map, mob, boss, equipment, material, quest, cosmetic, currency hoặc event. |
| `evidence_level` | A chính thức, B snapshot cộng đồng, C hướng dẫn cộng đồng, D giả thuyết thiết kế. |
| `proposed_runtime_id` | ID gốc `UPPER_SNAKE_CASE`, không trùng catalog. |
| `map_id`, `source_id`, `loot_table_id`, `sink_id` | Tham chiếu bắt buộc theo loại; ô trống nghĩa là chưa đủ dữ kiện. |
| `drop_chance_origin` | `OFFICIAL`, `COMMUNITY`, `DESIGN_BASELINE`, `UNKNOWN`; không điền tỷ lệ bằng suy đoán. |
| `scope`, `review_status` | `ALPHA/BETA/LATER`; `ICEBOX/DESIGN_PROPOSED/DESIGN_READY/VERIFIED`. |
| `asset_status` | Có asset gốc, placeholder hợp pháp hoặc chưa có. |

### Quy tắc quyết định

1. Nếu chỉ biết tên item nhưng thiếu tác dụng, xếp `ICEBOX`; không tạo stat ngẫu nhiên để “lấp đủ” 1.468 dòng.
2. Nếu biết map và boss từ nhiệm vụ nhưng không có drop xác minh, có thể dùng làm mẫu encounter; bảng drop Minecraft phải mang nhãn `DESIGN_BASELINE` và có sink kiểm soát.
3. Item sự kiện 2026 được lưu như provenance/sự kiện lịch sử. Không bật mặc định trong economy vĩnh viễn.
4. Sau mỗi lần thêm tuyến: chạy validator, mô phỏng source/sink tiền/vật liệu, test relog/retry/restart, rồi playtest map và boss. Không gộp nhiều hệ lớn cùng một lần release.

## Trạng thái hiện tại

- Đã có: contract và một tuyến end-to-end, catalog tham chiếu hợp lệ, bảng nguồn/giới hạn, kịch bản QA.
- Cần triển khai: world blockout, plugin Paper, database/migration, UI/NPC adapter, model/texture/âm thanh, integration test và playtest.
- Chưa thể kết luận: tỷ lệ rơi/balance cuối, map Y thực, tương thích phiên bản Paper/Java/plugin, và boss solo có vui hay không. Các mục này cần số đo tại G2/G3.
