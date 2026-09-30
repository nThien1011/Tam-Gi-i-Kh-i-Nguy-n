# Kế hoạch tiếp theo — Server Minecraft lấy cảm hứng từ Dragonboy

## Kết luận điều hành

GDD v3.0 có định hướng rõ: ba tộc khác vai trò, vòng lặp farm → phá giới → boss → trang bị, và thế giới có bản sắc riêng. Điểm cần điều chỉnh là **phạm vi**. Với một coder không lương, không nên hoàn thiện mọi hệ endgame trước rồi mới làm game; cần xây một lát cắt chơi được trong 15–30 phút, đo cảm giác chiến đấu và progression, sau đó mới mở rộng.

Kế hoạch đề xuất là: **Prototype kỹ thuật → Closed Alpha vertical slice → Beta nội dung**. Alpha không nên có đệ tử, auction house, 7 mốc, 7 sao, nạp tiền hay PvP rank.

## Điều đã tốt và nên giữ

- Ba tộc được phân vai rõ: burst, support/tank, công-thủ/biến hình.
- Phá giới là trục định hướng progression, thay vì chỉ tăng con số.
- World boss có phase và bảng đóng góp sẽ tạo hoạt động cộng đồng.
- Map có nhận diện bằng theme và landmark; đây là lợi thế lớn của Minecraft.
- Đồ khóa tộc, kỹ năng nâng bằng bí kíp và set bonus tạo mục tiêu farm dài hạn.

## Các mâu thuẫn/rủi ro phải giải quyết trước

| Vấn đề | Bằng chứng trong GDD | Hướng xử lý đề xuất |
|---|---|---|
| “Không pay-to-win” mâu thuẫn với donate | Rank nhận +20% đến +150% EXP, Bùa Bảo Vệ; đệ tử đặc biệt có thể mua bằng donate | Trước launch chỉ bán cosmetic, slot tiện ích không ảnh hưởng power, và battle pass cosmetic. Bỏ EXP bonus, bảo hộ ép sao, đệ tử mạnh khỏi cửa hàng. |
| Alpha quá lớn | 9 skill, 7 mốc, ép sao, multi-world, quest, PvP, donation trong cùng Phase 1 | Chỉ làm một vertical slice có mốc 1–2, 1 skill/tộc, 1 boss, 3 slot đồ và 1 quest chain. |
| Last-hit độc quyền dễ gây ức chế | Boss và đệ tử gắn với last hit | Phần thưởng chính chỉ trao cho người đạt ngưỡng đóng góp; last hit chỉ cho danh hiệu/cosmetic hoặc là một bonus nhỏ. |
| Economy chưa có sink/source cân bằng | Ba loại tiền, AH, trade, ép sao, AFK đều dự kiến | Alpha chỉ dùng một soft currency không giao dịch; thêm trade/AH khi có ledger, log và chống duplication. |
| Data model còn thiếu | Schema chỉ có players và equipment | Cần catalog data versioned, inventory instance, quest, skill state, currency ledger, boss participation/audit log. |
| Phụ thuộc plugin có thể khóa kiến trúc | Citizens, Denizen, AH, Multiverse đã được chọn nhưng chưa chốt phiên bản tương thích | Làm compatibility spike và pin phiên bản trước khi viết core; không để Denizen nắm business rules quan trọng. |
| Cảm hứng NRO quá sát | Nhiều mechanic/tên gốc còn trong brainstorm | Dùng lore, tên, icon, model, nhạc, quest và visual hoàn toàn tự tạo; chỉ giữ nguyên tắc thiết kế ở mức trừu tượng. |

## Quyết định cần chốt ngay

Những quyết định này đủ để bắt đầu prototype; chưa cần chốt tên server hay toàn bộ endgame.

| Quyết định | Khuyến nghị |
|---|---|
| Phiên bản gameplay đầu tiên | Hub chung + 3 vùng tộc nhỏ + 1 boss vùng; mốc 1–2; mỗi tộc có 1 active signature và 1 passive. |
| Win condition 30 phút đầu | Người chơi chọn tộc, hoàn thành 5 quest, mở skill signature, đánh boss đầu và nhận một nâng cấp đồ. |
| Combat | Server-authoritative: KI, cooldown, cast time, damage, knockback và target validation do plugin quyết định. Client chỉ hiển thị. |
| Scale chỉ số | Dùng số nhỏ trong Alpha (ví dụ HP 100–500), không dùng triệu/tỷ. Chỉ chuyển sang ký hiệu lớn sau khi balance chứng minh cần thiết. |
| Trang bị Alpha | Ba slot: vũ khí, giáp, phụ kiện; rarity rõ ràng; nâng cấp 0–3 sao, thất bại chỉ giảm một sao, không phá item. |
| Boss reward | Eligibility theo đóng góp (damage/heal/tank objective); reward có cap; last hit chỉ là bonus phụ. |
| Economy Alpha | Một soft currency, không trade; no AFK free/không giới hạn; mọi thay đổi tiền đều có ledger. |
| Monetization | Tắt hoàn toàn ở closed alpha. Chỉ thiết kế cửa hàng cosmetic sau khi có số liệu retention và sau khi công bố chính sách công bằng. |

## Phạm vi Closed Alpha (vertical slice)

~~~
[Hub chung]
   ├── Chọn tộc + tutorial
   ├── NPC quest + NPC luyện rèn
   └── Cổng đến 3 vùng ngắn
        ├── Thiên Phong: burst single-target
        ├── Âm Mộc: sustain/heal
        └── Hỏa Hắc: combat bền/awakening rút gọn
             ↓
      1 boss vùng đa phase
             ↓
       Mốc 2 + 1 nâng cấp đồ
~~~

**Không thuộc Closed Alpha:** đệ tử, hợp thể, world boss, 7 mốc, dungeon, tông môn, AH/trade, rank donate, payment gateway, ELO, Tinh Thạch, Linh Giáp, map 5–7 thế giới và AFK offline.

## Kiến trúc kỹ thuật nên chốt

- Dùng một plugin core theo module, không để logic tiềm năng/combat nằm trong script NPC.
- Dữ liệu cân bằng đặt ở file cấu hình versioned (YAML/JSON): tộc, skill, mob, loot, item, quest, mốc. Coder không phải sửa Java khi designer chỉnh 5% damage hay cooldown.
- MySQL chỉ giữ state người chơi và log; cache state khi online; mọi ghi currency/item/quest thực hiện transaction.
- Tách game-data (catalog bất biến) khỏi player-state (dữ liệu cá nhân thay đổi).
- Thêm event/audit log cho mọi cấp item, giao dịch tiền, reward boss và lệnh GM từ ngày đầu.
- Đưa anti-duplication và idempotency vào trước trade/AH, không phải sau launch.
- Dùng Gradle cho project mới. Paper hiện ghi rõ Maven là lựa chọn không khuyến khích trong hướng dẫn project setup. Chỉ chốt Paper/Java sau compatibility spike: Paper hiện khuyến nghị Java 21 cho 1.20–1.21.11 và Java 25 cho 26.1 trở lên.

### Bảng dữ liệu tối thiểu

| Nhóm | Bảng/khái niệm cần có |
|---|---|
| Catalog | races, skills, items, mobs, loot_tables, quests, milestones, data_version |
| Player | players, player_skills, player_quests, player_inventory_items, player_equipment, cooldowns |
| Kinh tế/audit | currency_ledger, item_audit_log, admin_audit_log |
| Boss | boss_instances, boss_contributions, boss_rewards |

Không biểu diễn inventory chỉ bằng một item cho mỗi slot như schema hiện tại; mỗi item phải có instance ID, template ID, owner, trạng thái khóa và version.

## Kế hoạch triển khai theo cổng quyết định

| Mốc | Thời lượng tham khảo | Deliverable bắt buộc | Điều kiện qua cổng |
|---|---:|---|---|
| 0. Product kernel | 1 tuần | One-page design: fantasy, 3 tộc, combat loop 30 phút, 8 quyết định ở trên | Designer và coder cùng ký nhận phạm vi Alpha. |
| 1. Technical spike | 1–2 tuần | Paper chạy local, Gradle CI, DB migration, profile load/save, test combat event | Không lỗi mất dữ liệu khi restart; xác minh phiên bản plugin tương thích. |
| 2. Combat sandbox | 2–3 tuần | 3 tộc, 3 skill signature, KI/cooldown/damage, dummy mob | Mỗi tộc thắng mục tiêu bằng cách chơi khác nhau; không có exploit spam skill. |
| 3. Progression slice | 2–3 tuần | 5 quest, mốc 1→2, 3 slot đồ, 1 upgrade path, 3 zone blockout | Một tester mới hoàn thành loop trong 20–40 phút không cần GM hỗ trợ. |
| 4. Boss & balance | 2 tuần | Boss 2 phase, reward contribution, dashboard/log | Boss không thể bị solo ngoài ý đồ; reward không bị KS. |
| 5. Closed Alpha | 2–4 tuần | 10–30 tester, crash/error logging, survey | Retention D1, completion tutorial, kill/death, economy sinks được đo. |
| 6. Re-plan Beta | sau dữ liệu Alpha | Chọn **một** hệ lớn tiếp theo: đệ tử *hoặc* dungeon *hoặc* guild | Không thêm endgame nếu core loop chưa đạt mục tiêu. |

Đây là 8–15 tuần cho một vertical slice tùy thời gian thực tế của coder; ước tính 6 tháng cho toàn bộ roadmap hiện tại là lạc quan nếu chỉ có một coder part-time.

## Backlog thứ tự đúng

1. Repository, Gradle, CI, plugin compatibility matrix và migration database.
2. Player profile + chọn tộc không thể đổi + persistence.
3. Damage/KI/cooldown/skill casting server-authoritative.
4. Mob AI đơn giản + một boss đa phase.
5. Quest engine dữ liệu-driven + tutorial.
6. Equipment instance + stat aggregation + nâng cấp 0–3 sao.
7. Map blockout và NPC dialogue bằng Citizens/Denizen; dialogue chỉ gọi API core.
8. Telemetry, audit logs, staff tools và backup/restore test.
9. Closed alpha.
10. Chỉ sau đó chọn đệ tử hoặc dungeon làm hệ lớn đầu tiên.

## Việc designer làm song song

- Viết một style guide: palette, biểu tượng, thuật ngữ, silhouette của 3 tộc; tránh tên/asset Dragon Ball/NRO.
- Blockout hub và ba zone, mỗi zone chỉ cần 1 landmark, đường đi, spawn mob, arena boss.
- Viết 5 quest tân thủ bằng bảng: quest ID, điều kiện, dialogue, reward, fail state.
- Lập combat sheet có biến số; không hard-code damage/cooldown trong GDD.
- Tạo 10 item template và 5 mob template đủ cho Alpha, thay vì thiết kế toàn bộ 7 sao/endgame.

## Tiêu chí thành công Alpha

- 90% tester tạo nhân vật và học skill đầu trong dưới 10 phút.
- 70% hoàn thành boss đầu trong phiên chơi đầu.
- Không mất/nhân đôi currency hoặc item qua restart.
- Không có tộc nào vượt tộc khác quá 10–15% ở cùng gear và cùng mục tiêu.
- Người chơi mô tả được khác biệt giữa ba tộc mà không cần đọc wiki.
- Không có nội dung donate ảnh hưởng sức mạnh trong giai đoạn thử nghiệm.

## Hành động tuần này

1. Chốt 8 quyết định ở mục “Quyết định cần chốt ngay”.
2. Viết combat sheet Alpha cho ba skill signature (damage, KI, cast, cooldown, target, hitbox, counterplay).
3. Coder làm technical spike trước khi designer xây world hoàn chỉnh.
4. Designer dựng blockout Hub + một zone, không làm art final.
5. Tạo issue tracker với cột: Prototype / Alpha / Beta / Post-launch; chuyển toàn bộ đệ tử, Tinh Thạch, Linh Giáp, AH, donate, PvP rank sang Beta/Post-launch.

## Ghi chú nguồn kỹ thuật

Khuyến nghị về Gradle/Paper/Java được đối chiếu với tài liệu PaperMC hiện hành: [Project setup](https://docs.papermc.io/paper/dev/project-setup/) và [Getting started](https://docs.papermc.io/paper/getting-started/).
