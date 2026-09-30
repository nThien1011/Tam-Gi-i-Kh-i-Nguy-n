# 05 — Backlog và mốc giao hàng

## 1. Cách dùng

Mỗi dòng là một outcome có thể kiểm chứng, không phải một cụm mơ hồ như “làm hệ skill”. Coder tách tiếp thành ticket nhỏ nhưng không được đổi Definition of Done nếu chưa cập nhật decision register.

Ước lượng theo độ phức tạp, không phải lời hứa deadline. Với một coder part-time, 1 tuần dưới đây có thể tương đương 1–2 tuần lịch.

## 2. Milestone 0 — Product kernel

**Mục tiêu:** phạm vi không còn mơ hồ.

| ID | Công việc | Phụ thuộc | DoD | Ước lượng |
|---|---|---|---|---|
| M0-01 | Chốt scope lock và 8 quyết định | — | File 00/07 được owner xác nhận. | S |
| M0-02 | Tạo repo, branch/PR convention, issue tracker | M0-01 | Coder clone/build test được. | S |
| M0-03 | Đặt ID, naming guide, asset/IP guide | M0-01 | 10 content ID đầu không trùng/không dùng tên cũ. | S |
| M0-04 | Combat sheet + quest sheet + map coordinate sheet | M0-01 | Đủ schema file 03/02. | M |

**Gate G0:** không còn quyết định chặn technical spike.

## 3. Milestone 1 — Technical spike

**Mục tiêu:** chứng minh nền kỹ thuật bền vững trước khi làm gameplay.

| ID | Công việc | Phụ thuộc | DoD | Ước lượng |
|---|---|---|---|---|
| M1-01 | Compatibility matrix Paper/Java/dependencies | M0-02 | Chọn/pin version; local server chạy. | S |
| M1-02 | Gradle multi-module + CI | M1-01 | Build/test chạy từ clean checkout. | M |
| M1-03 | DB migration + connection pool | M1-02 | Migration chạy local và re-run an toàn. | M |
| M1-04 | Player profile persistence | M1-03 | Join/restart/quit giữ race/stat. | M |
| M1-05 | Currency ledger idempotent | M1-03 | Same request ID không double credit. | M |
| M1-06 | Catalog loader/validator | M1-02 | YAML invalid fail startup/test. | M |
| M1-07 | Backup/restore rehearsal | M1-03 | Restore có profile test giống trước backup. | S |

**Gate G1:** restart không mất state; duplicate request không tạo item/tiền mới.

## 4. Milestone 2 — Combat sandbox

**Mục tiêu:** chứng minh game đánh vui trước khi xây content.

| ID | Công việc | Phụ thuộc | DoD | Ước lượng |
|---|---|---|---|---|
| M2-01 | Race selection + race lock | M1-04 | Không đổi tộc qua relog/command. | M |
| M2-02 | Stat allocation GUI | M2-01 | Không phân bổ quá trần; mọi thao tác audited. | M |
| M2-03 | Combat domain calculator | M1-06 | Unit test đầy đủ attack/defense/range. | M |
| M2-04 | KI/cooldown/cast state | M2-03 | Spam input không bỏ cooldown/đúp cast. | L |
| M2-05 | Ba signature skill | M2-04 | Đúng data, target và feedback. | L |
| M2-06 | Dummy mob + combat log dashboard | M2-03 | Có TTK/KI/damage theo race. | M |
| M2-07 | Internal playtest 3–5 người | M2-05, M2-06 | Có report metric + quyết định balance. | S |

**Gate G2:** ba tộc khác biệt nhận biết được và không có exploit combat/blocker persistence.

## 5. Milestone 3 — Vertical slice

**Mục tiêu:** tạo phiên chơi trọn vẹn 20–40 phút.

| ID | Công việc | Phụ thuộc | DoD | Ước lượng |
|---|---|---|---|---|
| M3-01 | Hub/zone/arena blockout | M0-04 | Builder checklist file 02 pass. | M |
| M3-02 | NPC adapter + dialogue | M1-06, M3-01 | 5 quest chạy bằng data. | M |
| M3-03 | Mob spawner + 5 mob template | M2-03, M3-01 | Spawn/reward/reset đúng. | M |
| M3-04 | Equipment instance + three slots | M1-04, M1-06 | Stat không forge qua NBT/relog. | L |
| M3-05 | Upgrade 0★→3★ | M3-04, M1-05 | Atomic, fail behavior/audit đúng. | M |
| M3-06 | Quest engine và Mốc 1→2 | M3-02, M3-03, M3-05 | Không claim lại sau restart. | L |
| M3-07 | Boss 2 phase + contribution rewards | M2-03, M3-03 | Eligibility/idempotent reward test pass. | L |
| M3-08 | Vertical-slice playthrough | M3-01..07 | Người mới hoàn thành không có GM. | M |

**Gate G3:** 3 người chơi khác nhau hoàn thành tutorial→boss→Mốc 2 trong 40 phút.

## 6. Milestone 4 — Closed Alpha readiness

| ID | Công việc | Phụ thuộc | DoD | Ước lượng |
|---|---|---|---|---|
| M4-01 | Error/crash reporting + dashboard | G3 | Xem được error, TTK, quest completion. | M |
| M4-02 | Staff tools/read-only support view | M1-04 | Không có command cấp item không audit. | M |
| M4-03 | Load/soak test 30 player giả lập | G3 | Không có lag/tick issue nghiêm trọng. | M |
| M4-04 | QA regression suite | M3-08 | File 06 pass. | M |
| M4-05 | Closed Alpha guide + feedback survey | M4-01 | Tester biết report bug/feedback. | S |
| M4-06 | Freeze catalog v1 + backup plan | M4-04 | Data version và rollback rehearsal pass. | S |

**Gate G4:** có thể mời 10–30 tester mà không làm họ mất tiến độ hoặc phải rollback thủ công vì bug cơ bản.

## 7. Sau Closed Alpha

Chỉ lựa chọn một epic theo kết quả.

| Nếu metric cho thấy | Epic tiếp theo | Không làm ngay |
|---|---|---|
| Combat tốt nhưng nhóm thiếu mục tiêu | Dungeon nhóm | Đệ tử + guild cùng lúc |
| Player thích nuôi build lâu | Đệ tử cơ bản, không donate | World boss/đệ tử hiếm |
| Social retention tốt | Guild tối thiểu | Guild war + AH |
| Farm lặp lại nhàm | Thêm zone/mob/boss | 7 mốc/endgame |
| PvP được hỏi nhiều và PvE ổn | Arena unranked | ELO/rank rewards |

## 8. Kanban đề xuất

Cột: ICEBOX → DESIGN READY → READY FOR BUILD → IN BUILD → CODE REVIEW → QA → VERIFIED → RELEASED.

WIP limit:
- IN BUILD: tối đa 2 ticket cho một coder.
- QA: tối đa 3 ticket.
- Không đưa ticket vào READY FOR BUILD nếu thiếu DoD, test case hoặc data ID.

Mọi bug có severity:
- P0: mất/nhân đôi data, crash, exploit currency/item; dừng test.
- P1: không hoàn thành flow chính; sửa trước tester mới.
- P2: sai balance/UI/feedback; triage hằng tuần.
- P3: polish/backlog.
