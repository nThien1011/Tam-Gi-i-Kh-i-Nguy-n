# 04 — Contract triển khai và QA

## Ranh giới hệ thống

`catalog.json` là dữ liệu thiết kế, không phải plugin chạy được. Plugin Paper cần đọc catalog phiên bản đã khóa, validate khi start, ánh xạ mọi ID thành rule server-authoritative, rồi lưu state người chơi trong database. Citizens/Denizen chỉ hiện NPC/thoại/GUI; không tự cấp tiền, item hoặc quest reward.

| Dữ liệu | Lưu ở đâu | Quy tắc |
|---|---|---|
| Map/portal/NPC/spawn/boss/loot/upgrade | Catalog versioned | Bản đã deploy là read-only trong một encounter. |
| Race, stat, Mốc, quest progress, skill | Player tables | UUID là khóa; optimistic version/transaction. |
| Equipment/material đang sở hữu | Item instance + inventory tables | `instance_id`, owner, template, stars, version; không tin NBT/lore. |
| Đồng Linh | `currencies` + append-only ledger | Số nguyên, mọi delta có reason/request ID. |
| Boss encounter/contribution/reward | Boss tables | Encounter ID riêng; reward unique theo encounter + UUID + slot. |
| Inventory đầy/relog khi nhận item | `pending_grants` | Cùng request ID với grant gốc; claim không cấp lần hai. |

## Giao dịch cần có

### Mob chết

```text
validate death thật → chọn owner → transaction:
  INSERT unique kill_id/owner
  ghi RNG seed/kết quả tiền và item
  cộng EXP, tiền, item hoặc pending_grant
  cộng quest progress nếu đúng tộc/map
  ghi ITEM/CURRENCY/QUEST event với cùng request_id
COMMIT → thông báo
```

Không roll lại nếu retry cùng `kill_id`. Quái boss triệu hồi có `reward_enabled=false`; không đi qua loot pipeline.

### Nâng đồ

```text
lock item instance + balance + materials
kiểm tra owner, slot, stars, chi phí, NPC/range, request_id
ghi roll kết quả theo request_id
trừ tiền/vật liệu, đổi stars, ghi audit trong cùng transaction
COMMIT → cập nhật GUI/stat
```

UI không được tính kết quả từ client. Nếu process chết giữa request, retry truy vấn kết quả đã commit; không roll lần hai.

### Boss chết

```text
ACTIVE → RESOLVING bằng compare-and-set
snapshot contribution và eligibility
transaction theo từng player + unique reward key:
  lưu roll, cộng tiền/item hoặc pending_grant
  hoàn tất Q_INTRO_05, mở Mốc 2 nếu chưa hoàn tất
  ghi boss/currency/item/quest audit
RESOLVING → REWARDED sau khi mọi player được quyết toán
```

Nếu restart khi `RESOLVING`, worker đọc các reward key đã có và tiếp tục phần còn thiếu. Nếu hết cooldown 24 giờ nhưng quest chưa hoàn tất do dữ liệu lỗi, không tự cấp quest: đưa vào hàng kiểm tra vận hành có audit.

## Validation trước khi start

Script [validate_catalog.py](validate_catalog.py) kiểm tra tĩnh: ID, map graph, NPC/spawn nằm đúng khu, map/mob/item/loot/quest references, tỷ lệ drop 0–1, nâng cấp liên tục, quest không vòng lặp và bệ né nằm trong arena. Plugin cần chạy kiểm tra tương đương lúc start và dừng ở môi trường test/production khi catalog lỗi.

Các kiểm tra chỉ thực hiện được sau khi có world thực: nền và collision hợp lệ; portal đi đúng vị trí; Y không chôn NPC/mob; leash không kéo quái vào safe zone; điểm né nhìn thấy/đi tới được; không có vùng build chồng lấn hoặc lỗ arena; particle/âm thanh hoạt động trên bản Paper được pin.

## Kịch bản nghiệm thu

| ID | Thao tác | Kết quả phải thấy |
|---|---|---|
| MAP-01 | Player mới đi theo waypoint tới zone và về Hub | Tìm đường không cần GM; từ mob xa nhất về Hub <30 giây. |
| MAP-02 | Kéo mob qua cổng/biên, cast từ Hub ra zone | Mob reset, không damage Hub, không reward do reset. |
| MAP-03 | 4 người vào arena; party thứ hai thử vào | Chỉ party đầu được vào; party hai nhận trạng thái bận. |
| ITEM-01 | Hoàn tất Q03 sau 8 mob nhưng 0 lần rơi | Vẫn có 1 `MATERIAL_INITIATE`; đủ tiền nâng 0→1★. |
| ITEM-02 | Spam xác nhận nâng, relog đúng lúc commit | Một lần trừ tiền/vật liệu và một kết quả sao. |
| ITEM-03 | Giả lore/NBT hoặc đưa item của UUID khác | Không đổi stat, không equip/upgrade được, ghi fail reason. |
| DROP-01 | Hai người cùng đánh quái, 1 người disconnect | Chỉ owner được reward; retry `kill_id` không nhân đôi. |
| DROP-02 | Inventory đầy khi rơi vật liệu | Một pending grant duy nhất; claim một lần sau khi có chỗ. |
| DROP-03 | Wisp boss chết trong phase 2 | Không EXP/tiền/item/quest kill. |
| BOSS-01 | 2 người gây đủ damage hạ boss | Mỗi người một phần thưởng riêng; Q05 hoàn tất đúng một lần. |
| BOSS-02 | Healer hồi hiệu quả ≥24 HP trong ≥15 giây, damage <5% | Vẫn eligible; overheal không tính. |
| BOSS-03 | Player disconnect lúc boss còn 1% HP | Reward/pending grant phục hồi sau relog, không reroll. |
| BOSS-04 | Toàn party rời arena 30 giây hoặc quá 600 giây | Encounter reset/kết thúc; không reward. |
| BOSS-05 | Retry cùng boss instance và người chơi | Unique key chặn item/tiền/Mốc 2 lặp. |

## Metric và gate

- Combat: mob thường 8–14 giây solo, elite 25–45 giây solo, boss nhóm 2 người 3–6 phút; so sánh median theo tộc và gear. Nếu chênh >15%, chỉnh từng biến có giả thuyết rõ.
- UX: 3 tester mới hoàn thành flow ≤40 phút; ít nhất 70% tester Alpha hạ boss trong phiên đầu hoặc có nguyên nhân UX ghi nhận.
- Dữ liệu: 0 sự kiện duplicate; backup/restore giữ đúng item, quest, reward key, pending grant và boss result; test restart ở cast/upgrade/boss reward.
- Vận hành: mỗi event ghi `request_id`, `catalog_version`, `player_uuid`, `map_id`, timestamp, old/new state và fail reason khi có. P0 item/tiền dupe làm dừng test reward liên quan.

Chỉ đổi trạng thái `DESIGN_PROPOSED` thành `DESIGN_READY` sau khi builder chốt tọa độ thực, coder pin stack và designer chốt tên/art; chỉ đổi sang `VERIFIED` sau playtest + integration test qua các gate trên.
