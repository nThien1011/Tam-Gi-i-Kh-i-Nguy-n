# 01 — Thiết kế gameplay Vertical Slice

## 1. Vòng lặp chơi

~~~
Chọn tộc
  → nhận quest từ Trưởng Hành Giả
  → học skill signature + dùng KI
  → hạ mob vùng tộc để lấy Đồng Linh/vật liệu
  → nâng một món đồ
  → vượt thử thách boss 2 phase
  → hoàn thành nghi thức Mốc 2
  → mở lời hứa nội dung tiếp theo
~~~

Thời lượng đích: 20–40 phút cho người mới, 15–25 phút khi đã hiểu game.

## 2. Điều khiển chung

| Hành động | Input đề xuất | Quy tắc server |
|---|---|---|
| Tấn công thường | Chuột trái | Có global cooldown 0,7 giây; chỉ gây damage ở tầm hợp lệ. |
| Skill | Hotbar / click item skill | Kiểm tra tộc, KI, cooldown, cast state, target và vùng an toàn. |
| Khóa mục tiêu | Shift + chuột phải | Chỉ chọn mob/boss trong 12 block, không khóa qua tường. |
| Mở hồ sơ | Lệnh /hanhtrang | Chỉ đọc hoặc gọi GUI plugin core. |
| Phân bổ điểm | Lệnh /tiemnang | Mỗi thao tác là một transaction và có xác nhận GUI. |
| Quest | Tương tác NPC | Chỉ quest engine cập nhật state. |

Không dùng lệnh chat để gây damage, cấp item hoặc bỏ qua quest.

## 3. Chỉ số và công thức v1

### Chỉ số khởi tạo

| Chỉ số | Giá trị khởi tạo | Vai trò |
|---|---:|---|
| HP tối đa | 120 | Sống sót. |
| KI tối đa | 100 | Tài nguyên cho skill. |
| Sức đánh cơ bản | 12 | Damage trước skill/equipment. |
| Phòng thủ | 0 | Giảm damage theo công thức. |
| Điểm tự do | 12 | Người chơi thấy ngay ý nghĩa build. |

### Điểm tiềm năng

- 1 điểm SD: +1 sức đánh.
- 1 điểm HP: +8 HP tối đa.
- 1 điểm KI: +6 KI tối đa.
- Mốc 1 có tối đa 24 điểm đã phân bổ; quest mở Mốc 2 cho thêm 16 điểm.
- Reset bị tắt trong Alpha để giữ dữ liệu balance sạch.

### Công thức thử nghiệm

~~~
raw = baseDamage + attack * skillMultiplier
mitigated = raw * 100 / (100 + defense)
finalDamage = round(max(1, mitigated * random(0.95, 1.05)))
~~~

Công thức và số liệu phải nằm trong catalog data, không hard-code. Không có crit, dodge, lifesteal hay penetration trong v1.

## 4. Ba tộc và skill signature

Các số là baseline để test, không phải balance cuối.

| Tộc | Fantasy/role | Passive | Skill active v1 | Mục tiêu test |
|---|---|---|---|---|
| Thiên Phong | Burst đơn mục tiêu | Sau 2 giây không nhận damage: +10% cast speed trong 3 giây | Thiên Lôi Xung | Có cảm giác chuẩn bị rồi bùng nổ. |
| Âm Mộc | Sustain/heal | Hồi 1 KI mỗi 2 giây khi HP dưới 50% | Tái Sinh Linh Lực | Có thể cứu mình/đồng đội, nhưng không bất tử. |
| Hỏa Hắc | Damage ổn định | Khi hạ mob: hồi 4 KI | Hỏa Liên Chưởng | Nhịp tấn công đều, dễ solo. |

### THIEN_LOI_XUNG

| Thuộc tính | Giá trị v1 |
|---|---|
| KI | 25 |
| Cooldown | 7 giây |
| Cast | 1,2 giây; nhận damage trong cast hủy skill và hoàn 50% KI |
| Tầm | 12 block theo hướng nhìn |
| Damage | 170% raw attack |
| Target | 1 mob/boss có line-of-sight |
| Feedback | Charge particle, âm thanh gốc, beam/impact placeholder |

### TAI_SINH_LINH_LUC

| Thuộc tính | Giá trị v1 |
|---|---|
| KI | 22 |
| Cooldown | 9 giây |
| Cast | tức thì |
| Tầm | bản thân hoặc đồng đội trong 8 block |
| Hiệu quả | hồi 24 HP trong 4 tick hồi; dừng khi mục tiêu đã đầy máu |
| Giới hạn | Không hồi boss, không stack với chính nó; recast chỉ refresh thời lượng |
| Feedback | Particle xanh và thanh heal rõ ràng |

### HOA_LIEN_CHUONG

| Thuộc tính | Giá trị v1 |
|---|---|
| KI | 16 |
| Cooldown | 4 giây |
| Cast | tức thì |
| Tầm | 6 block, target được khóa hoặc entity trước mặt |
| Damage | 3 hit, mỗi hit 55% raw attack, cách nhau 0,35 giây |
| Giới hạn | Mục tiêu chết/hết line-of-sight thì dừng các hit sau |
| Feedback | Combo particle/knockback nhẹ ở hit cuối |

## 5. Mob v1

| ID | Zone | HP | Attack | EXP | Đồng Linh | Vai trò |
|---|---|---:|---:|---:|---:|---|
| MOB_SPARK_RAT | Thiên Phong | 90 | 8 | 12 | 4–6 | Mob đơn, học burst. |
| MOB_ROOTLING | Âm Mộc | 110 | 7 | 12 | 4–6 | Bền hơn, học sustain. |
| MOB_CINDER_HOUND | Hỏa Hắc | 100 | 9 | 12 | 4–6 | Nhịp tấn công nhanh. |
| MOB_RUIN_GUARD | Cổng boss | 220 | 14 | 30 | 12–16 | Elite kiểm tra gear. |
| MOB_ANCIENT_WISP | Cổng boss | 70 | 6 | 10 | 3–5 | Mob phụ cho boss phase 2. |

Respawn 15–25 giây, không spawn sát NPC/safe zone, không drop equipment trong v1.

## 6. Boss đầu: Thủ Hộ Tam Giới

| Thuộc tính | Giá trị v1 |
|---|---|
| ID | BOSS_TRINITY_WARDEN |
| HP | 5.000 cho 1–4 người; scale thêm 45% mỗi người từ người thứ 2 |
| Attack | 18, attack interval 1,5 giây |
| Spawn | Arena riêng, kích hoạt bằng quest; reset khi mọi player rời arena 30 giây |
| Eligibility | Có ít nhất 5% damage contribution hoặc 15 giây uptime support được ghi nhận |
| Reward | 20 Đồng Linh + 1 vật liệu nghi thức + roll phụ kiện common |
| Last hit | Chỉ title/cosmetic token; không ảnh hưởng reward chính |

### Phase

1. Phase 1, HP 100–51%: melee + telegraph ground slam 2 giây.
2. Chuyển phase, HP 50%: bất tử 4 giây, đẩy người chơi khỏi tâm, gọi 3 Ancient Wisp.
3. Phase 2, HP 50–0%: ground slam nhanh hơn; 25% HP dùng beam vòng tròn, phải né về điểm an toàn.

Boss không được one-shot. Mọi attack AoE phải có telegraph tối thiểu 0,8 giây trong Alpha.

## 7. Quest chain đầu

| ID | Tên | Điều kiện hoàn thành | Reward | Mục đích |
|---|---|---|---|---|
| Q_INTRO_01 | Dấu Ấn Khởi Hành | Chọn tộc | 6 điểm tự do + item skill | Giới thiệu identity. |
| Q_INTRO_02 | Khí Mạch | Dùng skill 3 lần | 8 Đồng Linh | Dạy KI/cooldown. |
| Q_INTRO_03 | Dấu Vết Dị Biến | Hạ 8 mob zone tộc | 6 điểm tự do + 1 vật liệu | Dạy farm. |
| Q_INTRO_04 | Luyện Rèn Sơ Khai | Nâng vũ khí lên 1★ | 1 nguyên liệu boss | Dạy equipment. |
| Q_INTRO_05 | Thử Thách Tam Giới | Hạ boss | Mở Mốc 2 + 16 điểm + title | Hoàn tất vertical slice. |

Quest không được phụ thuộc vào random drop để hoàn thành tutorial.

## 8. Equipment v1

| Slot | Stat chính | Item starter | Upgrade effect |
|---|---|---|---|
| Vũ khí | +attack | Kiếm/Linh trượng starter | +3 attack mỗi sao |
| Giáp | +HP | Giáp starter | +12 HP mỗi sao |
| Phụ kiện | +KI | Bùa starter | +10 KI mỗi sao |

- Item có instance ID, template ID, owner UUID, slot, stars, created_at, version.
- Rarity v1: common và uncommon. Không có random affix.
- Upgrade 0→1: 100%; 1→2: 80%; 2→3: 60%. Fail giảm 1 sao.
- Chỉ NPC rèn gọi API upgrade; không đổi item trực tiếp qua command.

## 9. Điều kiện nghiệm thu gameplay

- Ba skill có cooldown/KI/cast đúng ngay cả khi lag hoặc spam input.
- Người chơi cùng gear giết mob cùng cấp không chênh quá 15% time-to-kill giữa ba tộc.
- Boss hoàn tất bởi nhóm 2–4 người trong 3–6 phút.
- Một player mới đọc quest có thể vào boss không cần giải thích miệng.
- Không thể nhận reward boss hoặc quest hai lần qua relog/restart.
