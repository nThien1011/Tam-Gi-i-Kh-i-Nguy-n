# 03 — Dữ liệu và cân bằng

## 1. Nguyên tắc dữ liệu

Catalog game là source of truth cho tộc, skill, mob, item, loot, quest và milestone. Nó được version bằng Git, validate khi server khởi động và không nằm lẫn trong Java class.

Player state chỉ lưu tham chiếu đến catalog ID và state cá nhân. Nếu đổi một ID đã phát hành, migration phải được viết trước.

## 2. Cấu trúc catalog

~~~
game-data/
  races/
    thien_phong.yml
    am_moc.yml
    hoa_hac.yml
  skills/
    thien_loi_xung.yml
    tai_sinh_linh_luc.yml
    hoa_lien_chuong.yml
  mobs/
    spark_rat.yml
    rootling.yml
    cinder_hound.yml
    ruin_guard.yml
    ancient_wisp.yml
    trinity_warden.yml
  items/
    starter_weapon.yml
    starter_armor.yml
    starter_charm.yml
  quests/
    intro_01.yml ... intro_05.yml
  loot/
    boss_trinity_warden.yml
  milestones/
    milestone_01.yml
    milestone_02.yml
  maps/
    alpha.yml
  schema-version.yml
~~~

## 3. Quy tắc ID và version

- ID dùng UPPER_SNAKE_CASE, một khi phát hành thì không đổi.
- Display name và text có thể thay đổi không cần migration.
- Catalog có schema_version, ví dụ 1.0.0.
- Mỗi item/mob/quest có introduced_in; không xóa template đang được player state tham chiếu.
- Xóa content bằng retired: true; migration chuyển instance sang replacement ID nếu cần.
- Server không start ở production khi catalog không validate.

## 4. Schema tối thiểu

### Skill

~~~yaml
id: THIEN_LOI_XUNG
schema_version: 1
race: THIEN_PHONG
display_name: "Thiên Lôi Xung"
unlock:
  milestone: 1
resource:
  ki_cost: 25
timing:
  cast_ms: 1200
  cooldown_ms: 7000
target:
  type: SINGLE_ENEMY
  range_blocks: 12
  require_line_of_sight: true
damage:
  attack_multiplier: 1.70
interrupt:
  on_damage: true
  ki_refund_percent: 50
feedback:
  particle: thunder_charge
  sound: skill_thunder_01
~~~

### Mob

~~~yaml
id: MOB_SPARK_RAT
schema_version: 1
display_name: "Linh Thú Lôi"
zone: ZONE_THIEN_PHONG
stats:
  hp: 90
  attack: 8
  defense: 0
  attack_interval_ms: 1600
rewards:
  exp: 12
  currency:
    DONG_LINH: [4, 6]
spawn:
  points: [TF_01, TF_02, TF_03]
  respawn_seconds: [15, 25]
rules:
  can_spawn_in_safe_zone: false
  loot_owner_seconds: 30
~~~

### Item template

~~~yaml
id: ITEM_STARTER_WEAPON
schema_version: 1
slot: WEAPON
display_name: "Khí Nhận Sơ Khai"
rarity: COMMON
base_stats:
  attack: 3
upgrade:
  max_stars: 3
  per_star:
    attack: 3
  attempts:
    - from: 0
      chance: 1.00
    - from: 1
      chance: 0.80
    - from: 2
      chance: 0.60
  fail:
    behavior: REDUCE_ONE_STAR
binding: SOULBOUND
~~~

### Quest

~~~yaml
id: Q_INTRO_03
schema_version: 1
giver: NPC_GUIDE
prerequisites: [Q_INTRO_02]
objectives:
  - type: KILL_MOB
    mob_ids: [MOB_SPARK_RAT, MOB_ROOTLING, MOB_CINDER_HOUND]
    count: 8
rewards:
  free_points: 6
  items:
    - id: MATERIAL_INITIATE
      amount: 1
completion:
  repeatable: false
  auto_claim: true
~~~

## 5. Data validation bắt buộc

| Quy tắc | Ví dụ lỗi phải chặn |
|---|---|
| Tham chiếu tồn tại | Quest gọi mob ID không có. |
| Kiến thức tộc | Skill gán cho race không tồn tại. |
| Giá trị hợp lệ | Cooldown âm, tỉ lệ drop trên 100%, HP bằng 0. |
| Progression | Quest mở Mốc 2 nhưng prerequisite không thể hoàn thành. |
| Reward an toàn | Reward item retired hoặc không bind đúng. |
| Map | Spawn ID không nằm trong map config. |
| Tính tổng loot | Tổng weighted loot có trọng số dương. |
| Circular dependency | Quest A đòi B, B lại đòi A. |

Validation chạy trong CI và lúc startup. Bất kỳ lỗi nào đều làm môi trường test fail fast.

## 6. Bảng balance và cách test

### Metric theo trận

| Metric | Mục tiêu v1 | Cách đo |
|---|---|---|
| Time-to-kill mob thường | 8–14 giây solo | Log combat theo mob/race/gear. |
| Time-to-kill elite | 25–45 giây solo | Log combat. |
| Boss 2 người | 3–6 phút | boss contribution và elapsed time. |
| Skill share damage | 35–55% damage tổng | Combat log theo source. |
| KI cạn | 1–3 lần/phút khi spam sai, không cạn nếu dùng đúng nhịp | resource event log. |
| Fail upgrade | không làm tester bỏ tutorial | completion Q_INTRO_04. |
| Chênh lệch race | dưới 15% cùng gear/cùng mục tiêu | dashboard median TTK. |

### Kịch bản test bắt buộc

1. Mỗi tộc với 12 điểm dồn SD.
2. Mỗi tộc với 12 điểm dồn HP.
3. Mỗi tộc với 12 điểm dồn KI.
4. Solo mob zone chính.
5. Nhóm 2: Thiên Phong + Âm Mộc.
6. Nhóm 3: đủ ba tộc.
7. Restart server khi player đang có cooldown/quest ở giữa.
8. Spam skill packet/click và relog ngay lúc boss chết.

Không chỉnh số chỉ vì cảm giác của một người. Mỗi thay đổi phải nêu giả thuyết, version catalog, metric trước/sau và kết quả.

## 7. Economy v1

### Source

| Nguồn | Đồng Linh |
|---|---:|
| Mob thường | 4–6 |
| Elite | 12–16 |
| Q_INTRO_02 | 8 |
| Boss | 20 |
| Quest hoàn tất | 5–15 |

### Sink

| Sink | Giá v1 |
|---|---:|
| Upgrade 0→1 | 8 |
| Upgrade 1→2 | 16 |
| Upgrade 2→3 | 30 |
| Heal/potion | chưa có trong v1 |
| Teleport | miễn phí trong v1 |

Mục tiêu: player đủ tiền nâng 1 món trong tutorial nhưng không thể max toàn bộ đồ trong một vòng farm. Không có donate, trade, AH, AFK income hoặc premium currency trong v1.

## 8. Combat/event log cần ghi

| Event | Fields tối thiểu |
|---|---|
| DAMAGE_DEALT | timestamp, attacker UUID, target ID, source skill/basic, raw/final damage, map, data version |
| SKILL_CAST | player UUID, skill ID, result, fail reason, KI trước/sau, cooldown |
| ITEM_UPGRADE | item instance, before/after stars, material/currency delta, result, request ID |
| QUEST_STATE | player UUID, quest ID, old/new state, trigger |
| BOSS_REWARD | boss instance, player, eligibility, contribution, reward, request ID |
| CURRENCY_CHANGE | player UUID, amount delta, balance after, source, request ID |

Log phục vụ balance, xử lý bug và chống duplicate. Không ghi dữ liệu nhạy cảm ngoài Minecraft UUID/name cần thiết cho vận hành.
