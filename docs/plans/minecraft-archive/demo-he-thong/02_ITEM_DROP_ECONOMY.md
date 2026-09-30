# 02 — Item, drop và economy

## Trang bị và vật liệu

Catalog có 13 template. Ba tộc dùng tên/trang phục khác nhau nhưng cùng sức mạnh starter để đo chênh lệch combat theo tộc. Tất cả equipment và material trong demo là `SOULBOUND`, không thể trade, bán hoặc vứt để chuyển cho người khác.

| Nguồn | Item ID | Slot/loại | Stat cơ bản | Cách nhận |
|---|---|---|---:|---|
| Chọn Thiên Phong | `ITEM_TF_WEAPON`, `ITEM_TF_ARMOR`, `ITEM_TF_CHARM` | Weapon, armor, accessory | +3 attack, +12 HP, +10 KI | `Q_INTRO_01`, cấp một lần. |
| Chọn Âm Mộc | `ITEM_AM_WEAPON`, `ITEM_AM_ARMOR`, `ITEM_AM_CHARM` | Như trên | Như trên | `Q_INTRO_01`, cấp một lần. |
| Chọn Hỏa Hắc | `ITEM_HH_WEAPON`, `ITEM_HH_ARMOR`, `ITEM_HH_CHARM` | Như trên | Như trên | `Q_INTRO_01`, cấp một lần. |
| Boss | `ITEM_WARDEN_CHARM` | Accessory common | +8 HP, +6 KI | Roll 25% cho người đủ điều kiện, tối đa một lần mỗi 24 giờ. Là sidegrade so với charm starter. |
| Quest/quái | `MATERIAL_INITIATE` | Vật liệu, stack 64 | — | `Q_INTRO_03` bảo đảm 1; quái thường/gate có cơ hội rơi. |
| Elite | `MATERIAL_ELITE_CORE` | Vật liệu, stack 64 | — | Ruin Guard 30%. |
| Quest/boss | `MATERIAL_RITUAL` | Vật liệu, stack 64 | — | `Q_INTRO_04` bảo đảm 1; boss bảo đảm 1 nếu đủ điều kiện và chưa hết cooldown. |

Vật phẩm hotbar dùng để kích hoạt skill là **điều khiển giao diện**, không phải item economy: không stack, không drop, không tính stat và được khôi phục từ `player_skills` khi đăng nhập. Boss last hit chỉ mở một dấu hiệu cosmetic trong hồ sơ; không tạo item có giá trị gameplay.

## Bảng rơi v1

`catalog.json` là nguồn số duy nhất. Mỗi cơ hội trong cột cuối là roll độc lập sau khi xác định owner hợp lệ; tỷ lệ không phải số NRO chính thức.

| Mục tiêu | Map | EXP | Đồng Linh | Item roll |
|---|---|---:|---:|---|
| `MOB_SPARK_RAT` | Thiên Phong | 12 | 4–6 | 25% `MATERIAL_INITIATE` ×1 |
| `MOB_ROOTLING` | Âm Mộc | 12 | 4–6 | 25% `MATERIAL_INITIATE` ×1 |
| `MOB_CINDER_HOUND` | Hỏa Hắc | 12 | 4–6 | 25% `MATERIAL_INITIATE` ×1 |
| `MOB_ANCIENT_WISP` ở gate | Cổng boss | 10 | 3–5 | 15% `MATERIAL_INITIATE` ×1 |
| `MOB_RUIN_GUARD` | Cổng boss | 30 | 12–16 | 40% `MATERIAL_INITIATE` ×1 và 30% `MATERIAL_ELITE_CORE` ×1 |
| `BOSS_TRINITY_WARDEN` | Arena | 0 | 20 | Bảo đảm `MATERIAL_RITUAL` ×1; 25% `ITEM_WARDEN_CHARM` ×1 |

Wisp do boss triệu hồi **không cấp EXP, tiền, drop hoặc quest kill**. Boss loot là cá nhân theo eligibility, không phải vật phẩm nằm trên mặt đất để tranh cướp. Bảng boss chỉ roll khi player chưa nhận reward boss trong 24 giờ gần nhất; `Q_INTRO_05` vẫn hoàn thành một lần nếu player đủ điều kiện.

## Ai nhận drop quái thường

1. Khi mob chết thật và không do GM/test command, server tạo `kill_id` duy nhất. Player gây damage hợp lệ cao nhất trong 15 giây cuối là owner; hòa thì chọn UUID theo thứ tự cố định. Player phải còn cùng map, trong 32 block. Không có owner hợp lệ thì không cấp gì.
2. Owner nhận EXP, tiền và roll item trong **một transaction**. `kill_id + owner_uuid + reward_slot` là khóa duy nhất; retry/relog không reroll hay cấp lần hai. Chỉ owner nhận tiến độ `Q_INTRO_03` nếu mob đúng vùng tộc.
3. Item đi thẳng vào inventory do plugin quản lý. Khi đầy, reward ghi vào `pending_grants` theo cùng khóa, hiển thị “Còn vật phẩm chưa nhận” và cho claim từ NPC Guide; đây là hàng đợi lỗi inventory, không là hệ mailbox/trade.
4. Nếu dùng mô hình item hiển thị dưới đất, entity đó chỉ là hiệu ứng; quyền nhặt gắn owner 30 giây rồi biến mất. DB vẫn là nguồn state duy nhất. Chết vì môi trường, leash reset hoặc despawn không tạo reward.

## Nâng cấp tại Smith

Chỉ equipment thuộc owner và đúng slot được nâng. Một item instance có `instance_id`, `template_id`, `owner_uuid`, `stars`, `version`; server tính stat từ catalog và số sao, không tin lore/NBT từ client.

| Bước | Tiền | Vật liệu tiêu thụ | Thành công | Thất bại |
|---|---:|---|---:|---|
| 0→1★ | 8 | 1 `MATERIAL_INITIATE` | 100% | Không thể thất bại. |
| 1→2★ | 16 | 2 `MATERIAL_INITIATE` | 80% | Trở về 0★. |
| 2→3★ | 30 | 3 `MATERIAL_INITIATE` + 1 `MATERIAL_ELITE_CORE` + 1 `MATERIAL_RITUAL` | 60% | Trở về 1★. |

Mỗi sao của weapon +3 attack, armor +12 HP, accessory +10 KI. Phần +HP của `ITEM_WARDEN_CHARM` giữ nguyên qua nâng cấp. Fail vẫn tiêu thụ tiền/vật liệu, không phá item. Smith hiển thị trước chi phí, tỷ lệ, stat sau thành công và stat nếu fail; xác nhận một lần, rồi dùng request ID idempotent.

## Dòng tiền và khóa tiến độ

- `Q_INTRO_02` cấp 8 Đồng Linh; `Q_INTRO_03` cấp chính xác một `MATERIAL_INITIATE`. Vì vậy người chơi có đủ nguồn bảo đảm để nâng vũ khí 0→1★ cho `Q_INTRO_04`, ngay cả khi 8 mob đầu không rơi vật liệu.
- Tám mob thường cho 32–48 Đồng Linh trước roll item. Các khoản này là baseline để có lựa chọn nâng thêm, không làm quest phụ thuộc RNG.
- Vật liệu boss không mở cửa arena bằng cách bị tiêu thụ. Điều kiện cửa là cờ `Q_INTRO_04` hoàn tất; `MATERIAL_RITUAL` dùng cho nâng 2→3★. Wipe không khiến party mắc kẹt vì mất vé.
- Các sink tiền duy nhất v1 là nâng đồ 8/16/30. Không có mua potion, teleport trả phí, premium currency, bán item, trade hay AH. Theo dõi mỗi ngày `currency_earned`, `currency_spent`, `material_created`, `material_consumed` và số item còn tồn để chỉnh drop sau Alpha.
