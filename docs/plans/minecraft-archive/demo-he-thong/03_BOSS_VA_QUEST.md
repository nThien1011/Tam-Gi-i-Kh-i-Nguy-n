# 03 — Quest chain và boss

## Năm quest dẫn xuyên hệ thống

Quest tự chuyển sang `AVAILABLE` sau khi quest trước hoàn tất. Reward chỉ cấp khi transaction đổi state sang `COMPLETED` thành công. Không kiểm tra bằng item NBT hoặc lời thoại NPC.

| ID | Điều kiện tiến độ | Reward bảo đảm | Dẫn sang |
|---|---|---|---|
| `Q_INTRO_01` | Chọn tộc một lần tại Guide | 6 điểm tự do, bộ 3 món starter theo tộc, unlock skill signature | Cổng vùng và `Q_INTRO_02`. |
| `Q_INTRO_02` | Cast skill hợp lệ 3 lần; cast bị chặn vì thiếu KI/cooldown không tính | 8 Đồng Linh | Vùng tộc và `Q_INTRO_03`. |
| `Q_INTRO_03` | Owner hạ 8 mob đúng vùng tộc | 6 điểm tự do, 1 `MATERIAL_INITIATE` | Smith và `Q_INTRO_04`. |
| `Q_INTRO_04` | Nâng weapon thuộc owner lên ít nhất 1★ | 1 `MATERIAL_RITUAL` | Cổng boss và `Q_INTRO_05`. |
| `Q_INTRO_05` | Clear `BOSS_TRINITY_WARDEN` với eligibility | Mốc 2, 16 điểm tự do, danh hiệu “Người Vượt Thạch Môn” | Kết thúc demo. |

Điểm tự do khởi tạo là 12; sau Q01 và Q03 có tổng 24 điểm của Mốc 1. Reward +16 điểm từ Q05 thuộc Mốc 2. Quest 04 kiểm tra **sự kiện upgrade thành công**, không chỉ nhìn số sao lúc nhận quest để ngăn mượn/giả item.

## Vào arena

- Warden chỉ mở party 1–4 người. Creator đứng tại cổng, mọi thành viên online, cùng party, đã hoàn tất `Q_INTRO_04`, không ở trong encounter khác. PvP/friendly fire tắt.
- Cổng khóa nếu arena đang có encounter. Party được đưa vào cùng một lần, snapshot danh sách UUID và data version; không thêm người khi boss đã kích hoạt. Solo được phép thử, nhưng metric chuẩn của Alpha là nhóm 2 người.
- Boss spawn khi thành viên đầu tiên vào vùng chiến đấu. Có 10 giây chuẩn bị, sau đó khóa lối vào. Không nhận item/tiền để mở cửa; wipe có thể vào lại sau reset.
- Mọi player rời arena 30 giây thì encounter `RESET`, boss/add despawn, không reward. Sau 600 giây chưa hạ boss thì `ENRAGED` và kết thúc encounter; không cấp reward.

## Chỉ số và nhịp tấn công

HP = `5000 × (1 + 0,45 × (party_size − 1))`, snapshot lúc bắt đầu: 1 người 5.000, 2 người 7.250, 3 người 9.500, 4 người 11.750. Không scale lại khi player chết hoặc rời trận.

Boss quyết định AI mỗi 1,5 giây. Cú melee trúng liên tiếp cùng một player cách nhau tối thiểu 4,5 giây, damage cơ sở 18. Đây là bản làm rõ cần thiết cho baseline cũ: nếu boss gây 18 damage **mỗi 1,5 giây** liên tục lên player 120 HP, player sẽ chết trước khi đạt trận 3–6 phút. Con số 4,5 giây là giả thuyết balance, phải đo ở G2/G3.

| Pha | Điều kiện | Cơ chế, thông báo và counterplay |
|---|---|---|
| 1 | 100–51% HP | Melee + ground slam radius 5 block, báo trước 2 giây, damage 16, cooldown 9 giây. Vùng nguy hiểm hiện rõ trên nền; chạy ra ngoài trước khi kết thúc báo động. |
| Chuyển pha | Chạm 50% HP | Invulnerable 4 giây, đẩy người chơi khỏi tâm và gọi 3 Wisp. Damage trong invulnerable không tính contribution/không gây overflow sang pha 2. |
| 2 | 50–0% HP | Slam báo trước 1,2 giây, cooldown 7 giây. Tại 25% HP dùng beam **một lần**, báo trước 1,2 giây, damage 22; hai bệ né ở x=-18 và x=18 luôn phải đi tới được. Wisp boss không cho reward. |

AoE không gây damage trong Hub/gate, không xuyên tường ngoài arena. Telegraph dùng cả màu nền, âm thanh và chữ ngắn, để người chơi không phải dựa duy nhất vào màu. Boss không có đòn one-shot.

## Điều kiện reward và xử lý lỗi

Một thành viên đủ điều kiện nếu đã đăng ký trong encounter, có hoạt động hợp lệ trước khi boss chết và thỏa **một** trong hai đường; mất kết nối đúng lúc kết liễu không xóa contribution đã ghi:

- Gây damage hợp lệ ≥5% HP tối đa đã scale của boss; hoặc
- Ở trạng thái hỗ trợ ít nhất 15 giây **và** đã hồi hiệu quả ≥24 HP cho thành viên đủ điều kiện chiến đấu. Heal vượt máu tối đa, tự heal khi đứng yên và spam skill không được tính.

Boss chết chuyển `ACTIVE → RESOLVING → REWARDED`. Mỗi player đủ điều kiện có `boss_instance_id + player_uuid + reward_slot` là khóa duy nhất. Transaction ghi boss result, Đồng Linh, ritual material, accessory roll và `Q_INTRO_05` (nếu chưa hoàn tất), rồi mới hiện thông báo. Roll RNG được lưu trước commit để retry cho cùng kết quả. Player disconnect lúc boss chết vẫn được ghi reward/pending grant. Người không đủ điều kiện thấy lý do cụ thể, không nhận quest clear.

Reward boss là 20 Đồng Linh + 1 `MATERIAL_RITUAL` + 25% `ITEM_WARDEN_CHARM`; mỗi UUID tối đa một lần trong cửa sổ 24 giờ. Title/điểm/Mốc 2 từ Q05 chỉ cấp một lần suốt đời nhân vật. Last hit chỉ mở cosmetic marker, không đổi reward chính. Boss không là world boss; không có tranh loot giữa party.

## Kiểm tra trận trước Alpha

Test nhóm 1, 2, 3, 4 người; một người hồi máu, một người disconnect ở 1% HP, wipe ở lúc chuyển pha, hai party cùng đòi vào, arena trống đúng 30 giây, relog ngay khi boss chết và retry cùng request ID. Cần đo TTK boss 2 người 3–6 phút, damage nhận, số lần chết, tỉ lệ clear, tỉ lệ đủ eligibility và số reward/UUID/boss instance. Nếu lệch, chỉnh HP/AI/telegraph trong catalog và lưu version + metric trước/sau.
