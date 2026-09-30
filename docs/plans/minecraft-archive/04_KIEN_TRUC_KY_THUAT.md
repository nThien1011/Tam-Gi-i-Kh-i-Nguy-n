# 04 — Kiến trúc kỹ thuật

## 1. Mục tiêu kiến trúc

- Gameplay được server quyết định; client Minecraft không phải nguồn tin cậy.
- Dữ liệu player bền vững qua restart; write quan trọng là atomic/idempotent.
- Content có thể thay đổi bằng catalog data.
- Plugin third-party chỉ tích hợp qua adapter, không nắm state game.
- Code test được phần công thức và rule mà không cần mở server Minecraft.

## 2. Stack đề xuất

| Layer | Chọn v1 | Ghi chú |
|---|---|---|
| Minecraft server | Paper, version được pin sau spike | Không nâng version giữa Alpha nếu chưa test plugin. |
| Java build | Gradle + Java toolchain phù hợp Paper | Paper docs hiện ưu tiên Gradle cho project setup. |
| Plugin core | Java, package theo domain | Một repository, module rõ. |
| Database | MySQL/MariaDB + HikariCP + migration tool | Local dùng container; prod có backup định kỳ. |
| Serialization | Jackson YAML/JSON + JSON Schema/custom validator | Catalog đọc-only ở runtime. |
| Test | JUnit + MockBukkit/Paper test harness khi phù hợp | Unit test rule, integration test persistence. |
| NPC/UI dependency | Citizens/Denizen adapter | Không gọi DB/logic trực tiếp từ Denizen. |
| Metrics | Log structured + dashboard đơn giản | Alpha chỉ cần các metric ở file 03. |

Trước khi code chính thức, spike phải xác nhận chính xác các phiên bản Paper, Java, Citizens, Denizen, LuckPerms và plugin map đang dùng. Paper hiện yêu cầu Java theo dòng version; đừng copy cố định 1.20.x từ GDD cũ mà không kiểm tra compatibility.

## 3. Sơ đồ thành phần

~~~
Minecraft/Paper events
       |
       v
   Adapter layer  <---- Citizens / Denizen / Placeholder UI
       |
       v
 Application services
  - PlayerService
  - CombatService
  - SkillService
  - QuestService
  - EquipmentService
  - BossService
  - RewardService
       |
       +------------------------+
       |                        |
       v                        v
 Domain rules                Catalog reader
 pure Java                   YAML/JSON versioned
       |
       v
 Repositories / transactions
       |
       v
 MySQL + audit/event log
~~~

## 4. Module layout

~~~
server-core/
  bootstrap/
  api/
  domain/
    player/
    combat/
    quest/
    equipment/
    boss/
    economy/
  application/
  infrastructure/
    paper/
    persistence/
    catalog/
    citizens/
  commands/
  ui/
  config/
  test/
game-data/
  races/
  skills/
  mobs/
  items/
  quests/
  loot/
infra/
  docker-compose.yml
  migrations/
  scripts/
~~~

Không tạo class GodObject tên GameManager chứa toàn bộ logic. Rule không được phụ thuộc trực tiếp Bukkit Player/Entity; adapter đổi chúng thành command/context rồi gọi application service.

## 5. Luồng quan trọng

### Skill cast

1. Paper event nhận input.
2. Adapter tạo CastSkillCommand gồm player UUID, skill ID, target snapshot, request ID và timestamp server.
3. SkillService load player state + catalog, kiểm tra race, safe zone, cooldown, KI, cast state, target range/LOS.
4. CombatService tính damage bằng domain rule.
5. Transaction ghi KI/cooldown/combat event khi cần.
6. Adapter phát particle/sound/damage sau khi rule thành công.
7. Mọi fail có code rõ: NO_SKILL, WRONG_RACE, COOLDOWN, NO_KI, INVALID_TARGET, SAFE_ZONE.

### Quest completion/reward

1. Trigger hợp lệ đi qua QuestService.
2. Lock player quest state bằng optimistic version hoặc transaction isolation.
3. Xác thực objective và prerequisite.
4. Cập nhật state, currency/item/milestone trong cùng transaction.
5. Ghi QUEST_STATE, CURRENCY_CHANGE, ITEM audit với cùng request ID.
6. Chỉ gửi message/particle sau commit.

### Boss death/reward

1. Boss instance giữ contribution in-memory và snapshot định kỳ.
2. Khi death, BossService khóa trạng thái instance là RESOLVING.
3. Tính eligibility và reward theo catalog.
4. Mỗi reward có unique key: boss_instance_id + player_uuid + reward_slot.
5. Insert unique key và item/currency trong transaction; retry không được tạo reward khác.
6. Ghi event, sau đó thông báo player.

## 6. Persistence schema tối thiểu

| Bảng | Mục đích | Key chính |
|---|---|---|
| players | race, stats, milestone, version | uuid |
| player_inventory_items | item instance của player | item_instance_id |
| player_equipment | instance ID được trang bị | uuid + slot |
| player_skills | unlock/level/loadout | uuid + skill_id |
| player_quests | state/progress/version | uuid + quest_id |
| currencies | số dư current | uuid + currency_id |
| currency_ledger | append-only delta | ledger_id, request_id unique |
| item_audit_log | tạo/sửa/xóa item instance | event_id, request_id |
| boss_instances | trạng thái/spawn/death | boss_instance_id |
| boss_contributions | contribution per player | boss_instance_id + uuid |
| boss_rewards | reward idempotent | boss_instance_id + uuid + reward_slot |
| schema_migrations | migration đã chạy | version |

Không lưu inventory dưới dạng blob JSON duy nhất. Không dùng floating-point cho currency.

## 7. Security và quyền

- Mọi lệnh GM yêu cầu permission riêng, reason và audit log.
- Không tin item NBT/client lore là stat thật; stat đọc từ item instance trên DB/cache.
- Validate tất cả amount, UUID owner, race lock, target distance và world/zone.
- Rate limit command nhạy cảm: upgrade, claim, reset, admin.
- Secrets/DB password qua environment/secret manager; không commit vào Git.
- Backup database được mã hóa khi lưu ngoài host; kiểm tra restore thực tế mỗi tuần.
- Không mở payment gateway, Discord OAuth hay web API trước khi core persistence được test.

## 8. Technical spike checklist

- [ ] Paper chạy local bằng version đã chọn.
- [ ] Gradle build + test chạy một lệnh trong CI.
- [ ] Database local khởi tạo bằng migration trống.
- [ ] Join tạo profile; quit/restart/load giữ đúng profile.
- [ ] Một command test trừ/cộng currency atomic.
- [ ] Hai request giống nhau không cộng currency hai lần.
- [ ] Catalog YAML lỗi làm server test fail với message rõ.
- [ ] Combat event test không gây damage trong safe zone.
- [ ] Backup và restore database local thành công.
- [ ] Log structured có correlation/request ID.
