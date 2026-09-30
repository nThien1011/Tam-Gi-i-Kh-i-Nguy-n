# 07 — Sổ đăng quyết định

## Cách dùng

Mọi mục “cân nhắc”, “có thể”, “sau này” ảnh hưởng code/map/data đều có một dòng ở đây. Không cần họp dài: chọn owner, hạn chốt và mặc định. Nếu quá hạn mà chưa quyết, áp dụng mặc định để dự án vẫn đi tiếp.

| Trạng thái | Ý nghĩa |
|---|---|
| OPEN | Chưa chốt, có thể chặn milestone. |
| PROPOSED | Đã có phương án đề xuất. |
| DECIDED | Đã chốt cho giai đoạn hiện tại. |
| VALIDATED | Đã được playtest/metric xác minh. |
| DEFERRED | Để giai đoạn sau, không làm trong scope hiện tại. |

## Quyết định nền tảng

| ID | Chủ đề | Trạng thái | Owner | Hạn chốt | Đề xuất/mặc định | Ảnh hưởng |
|---|---|---|---|---|---|---|
| DEC-001 | Tên server tạm | PROPOSED | Designer | Trước G0 | Tam Cược chỉ là tên nội bộ; chọn tên gốc trước public test. | Text/map branding |
| DEC-002 | Tên ba tộc | DECIDED | Designer | Đã dùng v1 | Thiên Phong, Âm Mộc, Hỏa Hắc. | Catalog/race UI |
| DEC-003 | Vertical slice scope | DECIDED | Product owner | Đã dùng v1 | Theo file 00, không thêm feature cấm. | Toàn dự án |
| DEC-004 | Monetization Alpha | DECIDED | Product owner | Đã dùng v1 | Tắt hoàn toàn. | Economy/trust |
| DEC-005 | Paper/Java/dependency version | OPEN | Coder | Trước M1-01 | Chốt sau compatibility matrix, pin bằng build file/lockfile. | Build/runtime |
| DEC-006 | Database hosting | OPEN | Coder | Trước M1-03 | Local container cho dev; test/prod có backup tự động. | Persistence |
| DEC-007 | Resource pack | OPEN | Designer + coder | Trước M2-05 | Placeholder không yêu cầu pack trong prototype; đánh giá pack trước Alpha. | Visual/input |
| DEC-008 | Giao thức party boss | PROPOSED | Designer + coder | Trước M3-07 | 1–4 player, creator mở arena, không friendly-fire. | Boss/group |
| DEC-009 | Safe zone | DECIDED | Product owner | Đã dùng v1 | Hub/portal/arena entry cấm PvP; PvP toàn server tắt v1. | Combat/map |
| DEC-010 | Last-hit reward | DECIDED | Product owner | Đã dùng v1 | Main reward contribution eligibility; last hit cosmetic nhỏ. | Boss/trust |

## Quyết định content trước M3

| ID | Chủ đề | Trạng thái | Default cần xác nhận |
|---|---|---|---|
| DEC-020 | Tên boss đầu | OPEN | Thủ Hộ Tam Giới là tên tạm; designer chốt lore/tên gốc. |
| DEC-021 | Visual skill | OPEN | Màu/timing/particle placeholder hợp pháp cho ba skill. |
| DEC-022 | Map coordinate | OPEN | Builder giao hub, zone, arena coordinate sheet. |
| DEC-023 | Quest text | OPEN | Writer giao dialogue 5 quest theo format file 02. |
| DEC-024 | Upgrade material | PROPOSED | MATERIAL_INITIATE, không tradable, drop/reward deterministic. |
| DEC-025 | Race baseline | PROPOSED | Giữ số file 01 đến khi G2 test metric. |

## Decision log cho Beta/Post-launch

| ID | Chủ đề | Trạng thái | Mặc định |
|---|---|---|---|
| DEC-100 | Đệ tử | DEFERRED | Chỉ xét sau Alpha; không donate đệ tử power. |
| DEC-101 | Dungeon | DEFERRED | Chỉ chọn nếu group combat có tín hiệu tốt. |
| DEC-102 | Guild | DEFERRED | Sau khi có social retention. |
| DEC-103 | Trade/Auction House | DEFERRED | Sau ledger, item audit, duplication test. |
| DEC-104 | Tinh Thạch | DEFERRED | Không có trước balance equipment baseline. |
| DEC-105 | Linh Giáp | DEFERRED | Endgame, không thiết kế số liệu bây giờ. |
| DEC-106 | PvP ranked | DEFERRED | Sau PvE core và unranked test. |
| DEC-107 | AFK realm | DEFERRED | Không thêm trước khi có economy telemetry. |
| DEC-108 | Payment/donate | DEFERRED | Chỉ cosmetic/convenience sau legal/product review. |

## Nhịp review

- Mỗi tuần: 20 phút review trạng thái milestone, P0/P1, scope change.
- Mỗi playtest: review 30 phút metric + feedback, chọn tối đa ba thay đổi.
- Mỗi thay đổi data balance: ghi version, hypothesis và metric.
- Mỗi thay đổi scope: product owner xác nhận trong DEC-003 hoặc tạo DEC mới.

## Các câu hỏi phải được trả lời bởi product owner

1. Ai là người có quyền cuối cùng để cắt scope khi coder quá tải?
2. Tester Alpha là nhóm bạn quen hay cộng đồng ngoài? Có quy tắc behavior/feedback gì?
3. Có bắt buộc resource pack không, và dự án có người làm art/sound gốc không?
4. Mức budget hằng tháng cho host, backup, domain và tool là bao nhiêu?
5. Mục tiêu sau Alpha là cộng đồng nhỏ bền vững hay tăng trưởng public nhanh?
6. Nếu metric nói một tộc không vui, đội chấp nhận rework/cắt tộc đó trước Beta không?

Không cần trả lời toàn bộ trước G0. Câu 1–4 chặn technical spike; câu 5–6 cần trước Closed Alpha.
