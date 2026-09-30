# 08 — Tiêu chí lập kế hoạch nội dung game

## Mục đích

Dùng file này làm mẫu trước khi thiết kế hoặc đưa bất kỳ content nào vào backlog: map, nhiệm vụ, NPC, mob, boss, item, skill, dungeon, event hoặc hệ thống mới.

Một ý tưởng chỉ chuyển sang **DESIGN READY** khi hoàn thành checklist của loại content đó. Không bắt đầu code/build từ một tên gọi hoặc mô tả chung chung.

## Quy trình chung

~~~
Ý tưởng
  → Xác định mục tiêu người chơi
  → Điền dữ liệu và phụ thuộc
  → Kiểm tra economy/balance/IP
  → Viết acceptance criteria
  → DESIGN READY
  → Ticket build
  → QA + playtest
  → VERIFIED hoặc chỉnh lại
~~~

## Thông tin bắt buộc cho mọi hạng mục

| Trường | Cần ghi rõ |
|---|---|
| ID ổn định | UPPER_SNAKE_CASE; không đổi sau khi phát hành. |
| Tên hiển thị | Tên gốc của dự án, không dùng asset/tên bản quyền ngoài phạm vi cảm hứng. |
| Mục tiêu chơi | Người chơi làm gì, học gì, cảm thấy gì? |
| Giai đoạn | Prototype, Vertical Slice, Alpha, Beta hay Post-launch. |
| Người phụ trách | Designer, coder, builder, writer, QA. |
| Điều kiện mở | Quest, mốc, party size, giờ server, vật phẩm… |
| Input | Người chơi bấm/tương tác/đánh gì? |
| Kết quả | Reward, state change, teleport, unlock, cooldown… |
| Dữ liệu cần lưu | Player state, instance state, log/audit, catalog reference. |
| Phụ thuộc | System, map, NPC, item, plugin hoặc content phải có trước. |
| Rủi ro | Exploit, duplicate, griefing, P2W, balance, performance. |
| Acceptance criteria | Các điều có thể test để xác nhận hoàn thành. |
| Rollback/disable | Cách tắt hoặc sửa an toàn nếu lỗi ở Alpha. |

## 1. Map / khu vực

### Mục tiêu cần chốt

- Khu này thuộc vòng lặp nào: tutorial, farm, boss, social, dungeon hay event?
- Người chơi vào từ đâu và biết phải làm gì trong 10 giây đầu?
- Mốc sức mạnh/quest nào được phép vào?
- Lý do quay lại map sau lần đầu là gì?
- Khu này có PvP, safe zone, party instance hay không?

### Data bắt buộc

| Nhóm | Cần có |
|---|---|
| ID/map config | Map ID, world, boundary, safe zone, version. |
| Lối đi | Spawn, portal/cổng, đường ra/vào, waypoint, thời gian di chuyển mục tiêu. |
| Landmark | Một dấu hiệu hình ảnh dễ nhận biết. |
| Mob | Spawn point, max count, respawn, leash/boundary. |
| NPC | ID, tọa độ, dialogue/quest liên quan. |
| Boss | Arena boundary, reset rule, entry rule. |
| Kỹ thuật | Light/collision/pathfinding, performance budget, resource pack dependency. |

### Checklist nghiệm thu

- [ ] Người mới tìm được mục tiêu chính mà không cần hướng dẫn ngoài game.
- [ ] Không có điểm kẹt, void, spawn trong block hoặc đường bắt buộc quá khó nhìn.
- [ ] Mob/boss không đi ra safe zone hoặc bị kite vô hạn.
- [ ] Map chạy ổn với số player mục tiêu.
- [ ] Có route trở lại hub/zone trước trong thời gian đã định.
- [ ] Toàn bộ coordinate nằm trong map config, không hard-code rải rác.

## 2. Nhiệm vụ

### Mục tiêu cần chốt

- Quest dạy mechanic nào hoặc đẩy progression nào?
- Quest có bắt buộc, phụ, daily hay achievement?
- Một người chơi cần bao lâu để hoàn thành?
- Có thể bị kẹt vì RNG, PvP, party, giờ server hay inventory full không?

### Data bắt buộc

| Trường | Ví dụ |
|---|---|
| Quest ID | Q_INTRO_03 |
| Giver/turn-in | NPC_GUIDE |
| Prerequisite | Q_INTRO_02 hoàn thành |
| Objective | Hạ 8 mob thuộc list ID |
| Progress policy | Chỉ cộng khi player có participation hợp lệ |
| Reward | Currency/item/XP/mốc, amount cụ thể |
| Repeat | false hoặc reset schedule rõ |
| Fail/cancel | Điều gì xảy ra khi map reset, relog, abandon |
| Dialogue | ID từng đoạn, choice và action |
| Telemetry | Start, objective progress, complete, abandon |

### Checklist nghiệm thu

- [ ] Không phụ thuộc vào random drop để hoàn thành tutorial.
- [ ] Không claim reward hai lần khi relog/restart/click spam.
- [ ] Mọi prerequisite có đường hoàn thành hợp lệ.
- [ ] Reward là transaction/audit được.
- [ ] Quest text chỉ rõ người chơi phải làm gì và ở đâu.
- [ ] Có test case cho party, disconnect và mob bị người khác hạ.

## 3. Mob thường và elite

### Mục tiêu cần chốt

- Mob tạo ra hành vi gì: né, burst, heal, group, kite hay kiểm tra gear?
- Mob dành cho mốc/tộc/zone nào?
- Time-to-kill và damage pressure mục tiêu là bao nhiêu?
- Mob drop gì và vật phẩm đó đi vào economy như thế nào?

### Data bắt buộc

| Nhóm | Cần có |
|---|---|
| Identity | Mob ID, tên, visual hợp pháp, zone. |
| Stats | HP, attack, defense, attack interval, move speed, level/mốc. |
| Behavior | Targeting, range, abilities, telegraph, leash/reset. |
| Spawn | Point/group, cap, respawn, spawn condition. |
| Reward | EXP, currency range, loot table, owner/grace period. |
| Counterplay | Cách né/đỡ/đánh hiệu quả. |
| Metrics | TTK, deaths, respawn, kill rate theo race/gear. |

### Checklist nghiệm thu

- [ ] Không spawn tại safe zone, trong block hoặc ở vị trí không tiếp cận được.
- [ ] Không bị farm ngoài boundary hoặc dụ vào NPC.
- [ ] Có telegraph nếu một đòn có thể gây damage lớn.
- [ ] Drop không tạo lạm phát hoặc bypass progression.
- [ ] Mob không gây lag khi đạt cap spawn.
- [ ] Có ít nhất một test với solo và party.

## 4. Boss

### Mục tiêu cần chốt

- Boss kiểm tra kỹ năng nào: né telegraph, phối hợp party, DPS check, heal/tank?
- Solo hay party; bao nhiêu người; có scaling theo player không?
- Spawn theo quest, lịch, event hay instance?
- Reset ra sao; xử lý disconnect, wipe, out-of-bound thế nào?
- Reward chính dựa trên contribution hay last hit? Vì sao?

### Data bắt buộc

| Nhóm | Cần có |
|---|---|
| Instance | Boss ID, arena ID, instance ID, lifecycle. |
| Entry | Quest/mốc, party size, cooldown, ticket/limit. |
| Stats | HP, attack, defense, scaling formula. |
| Phase | Ngưỡng HP, animation invulnerable, ability set, minion. |
| Ability | Cast/telegraph, range, damage, cooldown, counterplay. |
| Reset | Empty arena timer, leash, phase reset, anti-kite. |
| Contribution | Damage/heal/objective rule và eligibility threshold. |
| Reward | Deterministic reward, weighted roll, unique reward key, lock/giao dịch. |
| Broadcast | Ai nhận message; tránh spam toàn server. |
| Metrics | Clear rate, wipe rate, duration, reward distribution, error. |

### Checklist nghiệm thu

- [ ] Mọi attack nguy hiểm có telegraph và counterplay hợp lý.
- [ ] Boss không bị one-shot, kẹt, kite ra ngoài hay reset loop.
- [ ] Phase chỉ chuyển một lần ở đúng ngưỡng.
- [ ] Reward idempotent khi player disconnect/retry ngay lúc chết.
- [ ] Không tạo toxic KS: reward chính có eligibility/contribution rõ.
- [ ] Load test theo party/player cap mục tiêu.
- [ ] Có feature flag để tắt spawn/claim khi phát hiện exploit.

## 5. Item và equipment

### Mục tiêu cần chốt

- Item là consumable, material, equipment, quest, cosmetic hay currency?
- Nó được lấy ở đâu, mất ở đâu và có giao dịch không?
- Người chơi hiểu tác dụng qua tooltip không?
- Có thể nhân đôi, trade sai, equip sai tộc/slot hay không?

### Data bắt buộc

| Nhóm | Cần có |
|---|---|
| Template | Item ID, display name, type, rarity, icon/model. |
| Instance | Instance ID, owner, bind state, created_at, version. |
| Rule | Slot, race lock, requirement, stack cap, expiration. |
| Stats | Base stat, upgrade rule, affix nếu có. |
| Source | Quest, mob, boss, shop, craft, event. |
| Sink | Upgrade, craft, consume, recycle, sell NPC. |
| Trade | Tradable/locked/mail/AH policy. |
| Audit | Create/change/delete reason, actor, request ID. |

### Checklist nghiệm thu

- [ ] Server đọc stat từ catalog/instance, không tin client NBT/lore.
- [ ] Mọi tạo, nâng, xóa và chuyển item đều có audit.
- [ ] Reconnect/retry không nhân đôi item/reward.
- [ ] Item bị khóa tộc/slot không equip được qua GUI hay command.
- [ ] Tooltip hiện đúng stat, yêu cầu và hành vi fail.
- [ ] Economy source/sink được định lượng trước khi phát hành.

## 6. Skill, tộc và progression

### Mục tiêu cần chốt

- Khác biệt duy nhất của tộc/skill là gì?
- Skill cần target gì, cast bao lâu, tốn gì, cooldown bao lâu?
- Counterplay là gì? Có dùng trong safe zone hay PvP không?
- Unlock thông qua quest/mốc/item; có thể reset không?
- Skill có làm chết player/mob trong một hit không?

### Data bắt buộc

| Nhóm | Cần có |
|---|---|
| Identity | Skill ID, race, display name, unlock condition. |
| Resource | KI/HP/item cost, cooldown, cast/channel. |
| Target | Target type, range, LOS, AoE/radius, safe zone rule. |
| Effect | Damage/heal/buff/debuff/movement, duration, stack rule. |
| Interrupt | Hành vi khi bị damage, target chết, disconnect. |
| Feedback | Particle, sound, UI cooldown, accessibility. |
| Balance | Baseline gear, expected damage/TTK, test scenarios. |
| Security | Rate limit, server validation, fail code. |

### Checklist nghiệm thu

- [ ] Không spam/dupe cast qua macro/lag/relog.
- [ ] Cost/cooldown chỉ trừ sau validation rõ ràng.
- [ ] Target/range/LOS do server kiểm tra.
- [ ] Buff/debuff có stack và expiry rule.
- [ ] Có unit test công thức và manual test feedback.
- [ ] Ba tộc không chênh quá metric balance đã đặt.

## 7. NPC, dialogue và UI

- NPC presentation dùng Citizens/Denizen; game state gọi plugin core.
- Mỗi dialogue có ID, speaker, điều kiện, lựa chọn, action, text fallback.
- UI phải nói rõ state: cooldown, thiếu KI, quest location, reward, item lock.
- Mọi choice thay đổi state quan trọng cần confirm UI và transaction.
- Không để NPC script cấp item/currency trực tiếp ngoài API RewardService.

## 8. Dungeon, event và hệ thống sau Alpha

Chỉ thiết kế khi Vertical Slice đã VERIFIED. Ngoài checklist chung, cần có:

| Loại | Tiêu chí thêm |
|---|---|
| Dungeon | Instance isolation, party lifecycle, số lượt/reset, wipe/leave/disconnect, reward lock. |
| Event | Lịch, timezone, broadcast rate, anti-AFK, start/end/rollback state. |
| Guild | Permission hierarchy, ownership transfer, audit, war rules, disband. |
| Trade/AH | Ledger, escrow, tax, cancel/expire, anti-duplicate, abuse support. |
| Đệ tử | Ownership, AI performance, inventory/equipment, dismissal, progression, anti-P2W. |
| PvP rank | Matchmaking, gear/mốc bracket, anti-boosting, season reset, reward policy. |

## 9. Mẫu proposal một trang

~~~text
Tên/ID:
Giai đoạn:
Owner:
Mục tiêu người chơi:
Gameplay flow:
Điều kiện vào:
Data cần tạo:
Phụ thuộc:
Nguồn/sink economy:
Rủi ro và cách tắt:
Acceptance criteria:
Metric sau phát hành:
Quyết định còn mở:
~~~

## 10. Câu hỏi review trước DESIGN READY

1. Có thể mô tả content bằng hành động của player thay vì tên fantasy không?
2. Có state/reward nào có thể bị claim hai lần?
3. Một player mới có cách hiểu mục tiêu trong game không?
4. Content có bypass quest/progression/economy hiện có không?
5. Coder có thể build chỉ bằng spec, không cần đoán ý designer không?
6. QA có thể xác nhận pass/fail không cần “cảm thấy ổn”?
7. Có thể tắt bằng feature flag hoặc catalog khi có exploit không?
8. Nó có thực sự thuộc giai đoạn hiện tại không?

Nếu một câu trả lời là “chưa biết”, hạng mục giữ ở ICEBOX hoặc DESIGN IN PROGRESS, không chuyển sang READY FOR BUILD.
