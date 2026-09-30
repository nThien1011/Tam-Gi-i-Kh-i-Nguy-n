# 06 — QA, Closed Alpha và vận hành

## 1. Chiến lược test

Không coi “chơi thử vài phút không lỗi” là QA. Mọi core system cần có test ba tầng:

| Tầng | Mục tiêu | Ví dụ |
|---|---|---|
| Unit test | Domain rule đúng, nhanh | Formula damage, cooldown, upgrade roll, eligibility. |
| Integration test | DB/catalog/transaction đúng | Relog giữa quest, retry reward boss, migration. |
| Manual scenario | Người chơi thực hiểu/hành động được | Tutorial, UI, telegraph boss, map path. |

## 2. Regression checklist bắt buộc

### Persistence và economy

- [ ] Join lần đầu tạo profile đúng; race chỉ chọn một lần.
- [ ] Relog/restart không mất SD/HP/KI, equipment, quest, currency.
- [ ] Retry cùng request ID không double currency/item/reward.
- [ ] Upgrade success/fail luôn có đúng currency delta và audit.
- [ ] Không thể equip item của player khác hoặc item wrong slot.
- [ ] GM command mọi loại ghi actor, reason, before/after.
- [ ] Backup khôi phục đúng state sang môi trường sạch.

### Combat

- [ ] Không cast nếu thiếu KI, đang cooldown, wrong race hoặc safe zone.
- [ ] Không hit qua tường/ngoài range.
- [ ] Cast interrupted/refund đúng.
- [ ] Hỏa Liên dừng hit sau nếu target chết/mất LOS.
- [ ] Heal không stack vô hạn.
- [ ] Mob/boss không damage safe zone.
- [ ] Spam macro không vượt rate/cooldown.

### Quest/boss

- [ ] Không nhận quest/reward lặp qua relog.
- [ ] Mob quest chỉ cộng khi player hợp lệ tham gia kill.
- [ ] Boss reset đúng nếu empty arena.
- [ ] Boss phase chỉ chuyển một lần.
- [ ] Eligibility theo contribution hoạt động cho nhóm.
- [ ] Boss reward idempotent nếu disconnect đúng lúc boss chết.
- [ ] Mốc 2 mở đúng một lần.

### Map/UI

- [ ] Spawn không kẹt; không rơi vô void.
- [ ] Waypoint/biển chỉ rõ zone tiếp theo.
- [ ] NPC không nhận click xuyên/tạo duplicate dialogue.
- [ ] Telegraph boss thấy được trong texture/brightness bình thường.
- [ ] Text Vietnamese không bị cắt nghiêm trọng trên màn hình phổ biến.

## 3. Test playthrough

Mỗi bản candidate có một người không phải coder thực hiện:

1. Vào server trống bằng account mới.
2. Chọn lần lượt ba tộc trong ba profile khác.
3. Hoàn thành Q_INTRO_01 đến Q_INTRO_05 mà không nhận chỉ dẫn ngoài game.
4. Đánh boss solo thử nghiệm và nhóm 2–4.
5. Restart server lúc: đang cast, đang nâng đồ, đang chuyển quest và ngay khi boss chết.
6. Ghi video, thời gian từng quest, lý do bị kẹt, cảm giác skill và lỗi UI.

## 4. Telemetry Closed Alpha

| Metric | Mục tiêu/diễn giải |
|---|---|
| Tutorial start → Q_INTRO_02 | Đo người hiểu chọn tộc/skill. |
| Q_INTRO_02 → boss entry | Đo map path, mob grind, upgrade. |
| Boss entry → boss clear | Đo difficulty/telegraph/grouping. |
| Time to first skill | dưới 10 phút. |
| Time to first boss clear | 20–40 phút. |
| D1 return rate | dùng so sánh giữa bản build, không đặt mục tiêu tuyệt đối lúc đầu. |
| Race distribution | phát hiện tộc bị bỏ qua. |
| Median TTK/skill damage/KI empty | balance. |
| Error rate/P0/P1 | stability. |
| Currency created vs spent | economy sanity. |

Mọi metric phải được anonymize ở dashboard nội bộ khi có thể; chỉ staff được quyền truy cập log danh tính.

## 5. Quy trình Closed Alpha

### Trước khi mở

- Pin Git commit, version plugin, catalog version và DB migration version.
- Tag release candidate và ghi release note.
- Test restore backup.
- Có rollback checklist: dừng login, snapshot DB, thông báo tester, restore, postmortem.
- Có kênh feedback và mẫu báo lỗi gồm: thời gian, race, quest, vị trí, thao tác, ảnh/video.

### Trong khi mở

- Mời theo từng đợt 5–10 người, không mời 30 người cùng lúc ngày đầu.
- Không hotfix data trực tiếp trong production; đi qua Git review/catalog validation.
- Triage P0/P1 ngay; P2 theo daily/weekly review.
- Không thêm feature vì một feedback đơn lẻ.
- Mỗi ngày tổng hợp blocker, crash, loop completion và một giả thuyết balance.

### Sau mỗi đợt

- So sánh metric với build trước.
- Chọn tối đa ba thay đổi có giả thuyết rõ.
- Retest regression các hệ bị đụng.
- Cập nhật decision register nếu thay đổi scope/assumption.

## 6. Tiêu chí qua G4 và chuyển Beta

Chỉ chuyển Beta nếu tất cả điều kiện sau đúng:

- Không có P0 mở và không có P1 làm đứt tutorial/boss loop.
- Backup restore đã thực hành và profile/equipment/currency khôi phục đúng.
- Ít nhất 70% tester hoàn thành boss đầu trong phiên đầu hoặc có nguyên nhân UX cụ thể đã ghi nhận.
- Chênh lệch median TTK giữa ba tộc cùng gear không quá 15%.
- Không có evidence duplicate item/currency.
- Có một lựa chọn Epic Beta dựa trên feedback/metric, không dựa trên wishlist.

## 7. Runbook sự cố ngắn

| Sự cố | Phản ứng đầu tiên |
|---|---|
| Nghi duplicate item/currency | Tắt hệ tạo/giao dịch liên quan, giữ log, không xóa dữ liệu bừa; xác định request ID. |
| Crash/lỗi migration | Dừng deploy, rollback app; chỉ restore DB nếu migration/data corruption được xác minh. |
| Boss cấp reward lặp | Disable spawn/claim boss, lấy boss instance ID, kiểm tra unique reward key. |
| Exploit combat | Tắt skill/zone qua feature flag/catalog, không ban hàng loạt trước khi xác minh log. |
| Lag/tick drop | Giảm spawn/particle bằng config, lấy profiler, không thêm RAM như biện pháp duy nhất. |

Mọi P0 phải có postmortem: điều gì xảy ra, impact, timeline, root cause, fix, test mới để tránh lặp lại.
