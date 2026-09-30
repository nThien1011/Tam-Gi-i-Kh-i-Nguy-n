# 📜 Game Design Document v3.0
## Server Minecraft — Lối Chơi NRO · Tên Thế Giới Riêng

> **Phiên bản:** 3.0 — Ngày 14/09/2026
> **Nền tảng:** Java Edition (Paper/Spigot)
> **Định hướng:** Cơ chế y Ngọc Rồng Online · Tên thế giới độc lập
> **Đội ngũ:** 1 Coder (from-scratch) + 1 Designer · Không lương

---

## 1. Tầm nhìn sản phẩm

> **"Ngọc Rồng Online — nhưng trên Minecraft, với tên riêng của chúng tôi."**

Tái hiện toàn bộ **cảm giác chơi NRO** (chọn tộc, phân bổ tiềm năng, ép sao, biến hình, đệ tử, cờ PvP, boss) lên nền tảng Minecraft Java — nhưng với **tên thế giới, tộc người và chiêu thức hoàn toàn gốc**, tránh vi phạm bản quyền Dragon Ball / NRO trong khi vẫn giữ được cảm giác quen thuộc với fan.

### So sánh NRO gốc → Server này

| NRO gốc | Server này (tên gọi gợi ý — có thể đổi) |
|---|---|
| Trái Đất | **Thiên Chiến Tộc** — Thiên về tấn công đơn mục tiêu |
| Namek | **Lục Tinh Tộc** — Hỗ trợ, hồi phục, bền bỉ |
| Xayda | **Hỏa Hắc Tộc** — Bùng nổ, biến hình, công thủ toàn diện |
| Kamehameha | **Thiên Lôi Xung** (Thiên Chiến đặc trưng) |
| Biến hình Siêu Xayda | **Thức Tỉnh** (đổi aura + skin effect + buff) |
| Bông Tai Hợp Thể | **Huyết Mạch Hợp Nhất** |
| Mốc giới hạn sức mạnh | **Phá Giới** (cơ chế giữ nguyên) |

> 💡 Tên chỉ là gợi ý — bạn và designer có thể đặt lại theo phong cách thẩm mỹ riêng.

---

## 2. Hệ Tộc Người (3 Tộc)

Chọn khi tạo nhân vật — **không đổi được**, chỉ có thể xóa nhân vật làm lại.

### ⚡ Tộc Thiên Phong *(= Trái Đất trong NRO)*
- **Định hướng:** Tấn công đơn mục tiêu, sát thương bùng nổ, sát thương phép
- **Thế mạnh:** Săn Boss 1v1, sát thương theo đợt cực lớn
- **Điểm yếu:** Máu thấp, cần đặt đúng thời điểm tung chiêu
- **Kỹ năng đặc trưng (3 chiêu Alpha → mở rộng sau):**

| Tên chiêu | Cơ chế |
|---|---|
| **Thiên Lôi Xung** | Kỹ năng signature — charge 2 giây, phóng ra đòn sát thương cực lớn vào 1 mục tiêu |
| **Lôi Vũ Liên Hoàn** | Liên tục bắn 5 đòn nhỏ, mỗi đòn 30% sát thương Thiên Lôi Xung |
| **Hào Quang Bảo Vệ** | Shield hấp thụ sát thương trong 3 giây, cd dài |

### 🌿 Tộc Âm Mộc *(= Namek trong NRO)*
- **Định hướng:** Hỗ trợ đồng đội, hồi máu, tanker
- **Thế mạnh:** Sống sót lâu, tổ đội PvE, phó bản
- **Điểm yếu:** Sát thương thấp, phụ thuộc đồng đội trong PvP
- **Kỹ năng đặc trưng:**

| Tên chiêu | Cơ chế |
|---|---|
| **Tái Sinh Linh Lực** | Hồi X% HP trong 5 giây, có thể dùng cho bản thân hoặc đồng đội gần |
| **Ma Phong Trận** | Kẹp giữ mục tiêu tại chỗ 2 giây (không thể di chuyển) |
| **Lục Tinh Hào Quang** | Buff cả team trong 10m: +15% resist sát thương trong 8 giây |

### 🔥 Tộc Hỏa Hắc *(= Xayda trong NRO)*
- **Định hướng:** Công thủ toàn diện, biến hình mạnh nhất, HP cao nhất
- **Thế mạnh:** Dễ chơi nhất, cày đơn độc tốt, biến hình làm thay đổi bộ kỹ năng
- **Điểm yếu:** Sát thương tối đa không bằng Thiên Chiến Tộc khi dùng đúng
- **Kỹ năng đặc trưng:**

| Tên chiêu | Cơ chế |
|---|---|
| **Hỏa Liên Chưởng** | Phóng liên tiếp đòn vừa — sát thương ổn định, cooldown ngắn |
| **Thức Tỉnh** | ⭐ Kỹ năng đặc trưng tộc — xem mục 4 |
| **Bạo Phát** | Khi HP < 30%: tự động kích hoạt tăng 50% SD trong 5 giây |

---

## 3. Hệ Kỹ Năng

### 3.1 Cấu trúc kỹ năng mỗi tộc
- Mỗi tộc có **5 chiêu thức** — mở dần theo mốc phá giới
- Mỗi chiêu có **thể nâng lv1→lv5** bằng **Bí Kíp** drop từ boss
- Mỗi chiêu **tốn KI** + có **cooldown riêng** — người chơi phải quản lý nguồn lực, không spam
- Chiêu **tối thượng** (mở ở mốc 5+) = tương đương Skills 9 NRO — cực mạnh, yêu cầu KI cao, cd dài

### 3.2 Bảng kỹ năng — Thiên Chiến Tộc (Tấn công đơn mục tiêu)

| Chiêu | Mở tại mốc | KI | Cooldown | Mô tả |
|---|---|---|---|---|
| **Thiên Lôi Xung** | Mốc 1 | 20 KI | 8s | Charge 2 giây → phóng đòn sát thương lớn vào 1 mục tiêu |
| **Lôi Vũ Liên Hoàn** | Mốc 2 | 15 KI | 5s | Bắn 5 đòn nhỏ liên tiếp (30% sát thương mỗi đòn) |
| **Hào Quang Bảo Vệ** | Mốc 2 | 25 KI | 20s | Shield hấp thụ X sát thương trong 3 giây |
| **Thiên Lôi Toàn Phát** | Mốc 4 | 40 KI | 15s | Bùng nổ diện rộng quanh người, sát thương AoE |
| **⚡ Thiên Đạo Tuyệt Kỹ** | Mốc 5+ | 80 KI | 60s | Kỹ năng tối thượng — sát thương cực lớn 1 mục tiêu, hiệu ứng stun 2 giây |

### 3.3 Bảng kỹ năng — Lục Tinh Tộc (Hỗ trợ / Bền bỉ)

| Chiêu | Mở tại mốc | KI | Cooldown | Mô tả |
|---|---|---|---|---|
| **Tái Sinh Linh Lực** | Mốc 1 | 20 KI | 10s | Hồi X% HP cho bản thân hoặc đồng đội gần nhất |
| **Ma Phong Trận** | Mốc 2 | 25 KI | 12s | Kẹp mục tiêu tại chỗ 2 giây (không di chuyển được) |
| **Lục Tinh Hào Quang** | Mốc 2 | 30 KI | 30s | Buff cả team trong 10m: +15% resist sát thương 8 giây |
| **Tái Tạo Hoàn Toàn** | Mốc 4 | 50 KI | 45s | Hồi 30% HP tức thời + loại bỏ 1 debuff |
| **🌿 Lục Tinh Tuyệt Kỹ** | Mốc 5+ | 80 KI | 60s | Kỹ năng tối thượng — hồi phục cả team + buff +25% SD 10 giây |

### 3.4 Bảng kỹ năng — Hỏa Hắc Tộc (Công thủ toàn diện)

| Chiêu | Mở tại mốc | KI | Cooldown | Mô tả |
|---|---|---|---|---|
| **Hỏa Liên Chưởng** | Mốc 1 | 15 KI | 4s | Sát thương ổn định, cooldown ngắn — dễ dùng |
| **Thức Tỉnh** | Mốc 2 | 50 KI | 180s | Biến hình — đổi aura + bộ kỹ năng mạnh hơn 15–20 giây |
| **Bạo Phát** | Mốc 2 | Thụ động | — | Khi HP < 30%: tự kích hoạt +50% SD trong 5 giây |
| **Hỏa Hắc Lôi Nổ** | Mốc 4 | 45 KI | 20s | AoE quanh người, đẩy lùi kẻ thù |
| **🔥 Hỏa Hắc Tuyệt Kỹ** | Mốc 5+ | 80 KI | 60s | Kỹ năng tối thượng — đổi hình trong 30 giây, toàn bộ chiêu tăng 100% |

### 3.5 Nâng cấp kỹ năng (Bí Kíp)
- **Bí Kíp Thường**: drop từ Boss Vùng → nâng lv1→lv3
- **Bí Kíp Tinh**: drop từ Boss Thế Giới → nâng lv3→lv5
- **Bí Kíp Tuyệt Kỹ**: drop cực hiếm từ Boss Thế Giới mốc 5+ → mở chiêu tối thượng

> 💡 Bí Kíp **có thể giao dịch** giữa người chơi → tạo kinh tế player market tự nhiên

---

## 4. Hệ Tiềm Năng (Phân bổ thủ công — y NRO)

Mỗi lần phá giới + khi đạt một số điều kiện, người chơi nhận **Điểm Tiềm Năng** tự do phân bổ vào 3 chỉ số:

| Chỉ số | Ký hiệu | Ảnh hưởng |
|---|---|---|
| **Sức Đánh** | SD | Sát thương vật lý và phép thuật |
| **Máu** | HP | Tổng sinh lực, khả năng chịu đựng |
| **Khí** | KI | Năng lượng dùng kỹ năng, một số chiêu cần KI tối thiểu |

### Phong cách build phổ biến (gợi ý, không bắt buộc)
- **Ganker:** Đổ toàn SD — sát thương tối đa, cần hỗ trợ trong PvP đội
- **Tanker:** SD/HP cân — sống sót tốt, sát thương vừa phải
- **KI Build:** SD/KI cao — kỹ năng mạnh hơn, phù hợp Thiên Chiến Tộc

### Giao diện phân bổ
- Lệnh `/tiemnang` hoặc nhấn phím tắt mở GUI 3 thanh trượt
- Có nút **Reset Tiềm Năng** (tốn vật phẩm/donate coin — tạo thêm nguồn thu)

---

## 5. Hệ Mốc Phá Giới + Biến Hình / Thức Tỉnh

> **Nguyên lý y NRO:** Khi chạm trần tiềm năng, tự động ngừng cộng. Phải làm nhiệm vụ/boss để mở giới hạn mới.

### Bảng 7 Mốc (Alpha → Endgame)

| # | Tên Mốc | Trần Tiềm Năng | Nhiệm vụ Phá Giới | Thức Tỉnh khi phá |
|---|---|---|---|---|
| 1 | **Phàm Thể** | 10 triệu | Nhiệm vụ tân thủ | Không có |
| 2 | **Giác Tỉnh I** | 100 triệu | Đánh Boss cấp 1 + Nguyên liệu | Aura trắng nhạt |
| 3 | **Giác Tỉnh II** | 1 tỷ | Nhiệm vụ chuỗi NPC + Đan Dược | Aura xanh lam |
| 4 | **Chiến Thần** | 10 tỷ | Phó Bản Solo đặc biệt | Aura vàng + particle |
| 5 | **Thiên Giới** | 50 tỷ | Boss Thế Giới + Mảnh Thiên Giới x5 | Aura đỏ rực, mắt phát sáng |
| 6 | **Vô Lượng** | 100 tỷ | Phó Bản nhóm 5 người, khó nhất | Aura cầu vồng + trail |
| 7 | **Thần Cấp** | ∞ | Nhiệm vụ huyền thoại cực khó | Aura đen/trắng, full effect đặc biệt |

### Thức Tỉnh của Hỏa Hắc Tộc (đặc biệt hơn)
- Từ mốc 3 trở lên: khi kích hoạt kỹ năng **Thức Tỉnh**, toàn bộ model nhân vật đổi (particle bao phủ)
- Thời gian: 15 giây (tăng dần theo mốc)
- Trong trạng thái Thức Tỉnh: bộ kỹ năng đổi sang phiên bản mạnh hơn, aura theo màu mốc hiện tại
- Cooldown: 3 phút

---

## 6. Hệ Mob & Boss

### 6.1 Mob thường — phân cấp theo vùng

Mỗi thế giới có **3–5 loại mob riêng**, tăng dần độ mạnh theo mốc:

| Thế Giới | Mob (gợi ý tên) | Ghi chú |
|---|---|---|
| Thế Giới Khởi Nguyên | Cốt Binh, Linh Thú Sơ Cấp, Thú Hoang | Mob cơ bản, tân thủ cày |
| Vùng Đất Thức Tỉnh | Ác Linh, Thạch Quái, Cự Thú | Mốc 2–3 |
| Chiến Trường Thiên Môn | Thiên Ma, Chiến Quỷ, Linh Giáp | Mốc 4 |
| Cõi Thiên Giới | Thần Binh, Thiên Long, Hư Ảnh | Mốc 5–6 |
| Cõi Thần | Boss mob (mini-boss thường xuyên) | Endgame |

> Mob có **cấp độ sức mạnh** hiển thị — nếu cách biệt quá lớn: mob mạnh hơn miễn nhiễm damage, mob yếu hơn 0 EXP

### 6.2 Boss Vùng — spawn cố định
- Mỗi thế giới có **2–3 Boss Vùng** tại vị trí cố định trên map
- Respawn sau: 30–60 phút
- Cơ chế đặc biệt:
  - **Phase 2** khi HP < 50%: đổi kỹ năng, tốc độ tăng
  - **Enrage** khi HP < 20%: damage tăng 50%
- Drop: Bí Kíp Thường, nguyên liệu craft, trang bị thấp

### 6.3 Boss Thế Giới — sự kiện toàn server
- Spawn **3–6 tiếng/lần** tại map cảnh giới tương ứng
- **Countdown thông báo toàn server 10 phút trước** (scoreboard + chat broadcast)
- **Hệ thống Last Hit**: người hạ gục Boss cuối nhận loot đặc biệt (ngoài loot chia chung)
- Bảng **Top Damage** hiển thị real-time — top 3 nhận phần thưởng riêng:
  - 🥇 Top 1: Loot hiếm nhất + danh hiệu tạm thời
  - 🥈 Top 2–3: Loot khá
  - 🎁 Tham gia chia: loot thường theo % damage
- Boss Thế Giới có **kỹ năng AoE mạnh** — cần đội phối hợp tránh
- Nếu không ai đánh trong 30 giây: boss hồi máu chậm (anti-idle)

### 6.4 Bảng Boss Thế Giới theo mốc (Alpha → Endgame)

| Tên Boss | Xuất hiện tại | Mốc yêu cầu | Drop đặc trưng |
|---|---|---|---|
| **Linh Thú Vương** | Vùng Đất Thức Tỉnh | Mốc 2+ | Bí Kíp Thường, Đá Nâng Cấp Thường |
| **Thiên Ác Tướng** | Chiến Trường Thiên Môn | Mốc 4+ | Bí Kíp Tinh, trang bị sét 4★ |
| **Long Hoàng** | Cõi Thiên Giới | Mốc 5+ | Bí Kíp Tuyệt Kỹ, trang bị sét 5-6★ |
| **Thần Ma Vô Danh** | Cõi Thần | Mốc 7 | Trang bị endgame 7★, title đặc biệt |

---

## 7. Hệ Trang Bị — Ép Sao (1★ → 7★)

### 7.1 Các slot trang bị (y NRO)
```
┌─────────────────────────────┐
│  ⚔️  Vũ Khí                │
│  🧥  Áo Giáp               │
│  👖  Quần                  │
│  👟  Giày                  │
│  🧤  Găng Tay              │
│  📡  Rada (hỗ trợ/phụ)     │
└─────────────────────────────┘
```

### 7.2 Khóa theo Tộc — cơ chế quan trọng
> **Quy tắc cốt lõi:** Trang bị chỉ dùng được khi **đúng tộc** — kể cả trang bị của đệ tử. Cùng chỉ số, cùng sao nhưng sai tộc = không thể trang bị.

| Tên Sét | Dành cho | Đặc điểm chính |
|---|---|---|
| **Thiên Đạo** | Thiên Chiến Tộc | +% SD cao nhất, +KI khi mặc full |
| **Lục Mộc** | Lục Tinh Tộc | +% HP cao, hồi HP/giây khi mặc full |
| **Hỏa Hắc** | Hỏa Hắc Tộc | Cân SD/HP, +% damage Thức Tỉnh khi mặc full |
| **Trung Lập** | Tất cả tộc | Chỉ số thấp hơn sét tộc, dễ kiếm hơn — cho tân thủ |

> 💡 Đệ tử cũng bị khóa tộc theo người chơi — đệ tử của Thiên Chiến Tộc chỉ mặc được đồ Thiên Đạo hoặc Trung Lập.

### 7.3 Nguồn trang bị
- **Drop từ Boss**: càng boss mạnh → drop sét càng cao cấp, sao ban đầu càng nhiều
- **Craft**: gộp nguyên liệu (drop từ mob/boss) tại NPC Luyện Rèn → ra trang bị xác định
  - Craft cho phép chọn **đúng slot + đúng tộc** muốn
  - Tốn nhiều nguyên liệu hơn drop, nhưng chắc chắn ra đúng thứ cần
- **Loot Phó Bản**: trang bị cao cấp có sao ban đầu tốt hơn drop thường

### 7.4 Ép Sao (Nâng Cấp)
| Số Sao | Tỉ lệ thành công | Hậu quả thất bại | Cần vật phẩm |
|---|---|---|---|
| 0★ → 1★ | 100% | — | Đá Nâng Cấp Thường |
| 1★ → 2★ | 80% | Về 0★ | Đá Nâng Cấp Thường |
| 2★ → 3★ | 60% | Về 1★ | Đá Nâng Cấp Thường |
| 3★ → 4★ | 40% | Về 2★ | Đá Nâng Cấp Tinh |
| 4★ → 5★ | 25% | Phá đồ (về 0★) | Đá Nâng Cấp Tinh |
| 5★ → 6★ | 15% | Phá đồ | Đá Nâng Cấp Huyền |
| 6★ → 7★ | 8% | Phá đồ | Đá Nâng Cấp Huyền + Bùa Bảo Vệ |

> 💡 **Bùa Bảo Vệ** (mua bằng donate/Linh Thạch): tránh mất trang bị khi thất bại nhưng vẫn giảm sao — nguồn thu donate tự nhiên nhất.

### 7.5 Sét đồ — hiệu ứng kích hoạt khi mặc đủ
- **3/6 món cùng sét**: kích hoạt hiệu ứng nhỏ (tăng % resist, phản sát thương...)
- **6/6 món cùng sét**: kích hoạt hiệu ứng đầy đủ + visual effect đặc biệt trên nhân vật
- Ví dụ Full Sét Thiên Đạo 6/6: hào quang lôi điện quanh người, +20% crit damage

---

## 8. Hệ Nhiệm Vụ

### Nguyên lý: dẫn dắt toàn bộ progression
- Người chơi mới **không biết làm gì tiếp theo** → nhiệm vụ luôn có (như NRO có nhiệm vụ kéo dài toàn game)
- Hoàn thành nhiệm vụ = cách chính để phá giới, mở tính năng, nhận trang bị starter

### 8.1 Cấu trúc nhiệm vụ

```
📋 Nhiệm Vụ Chính (Main Quest) — dẫn thẳng đến Thần Cấp
    ├─ Chương 1: Thức Tỉnh (mốc 1→2) — ~10 nhiệm vụ
    ├─ Chương 2: Thử Thách (mốc 2→3) — ~10 nhiệm vụ
    ├─ Chương 3: Chiến Thần (mốc 3→4) — ~15 nhiệm vụ
    ├─ Chương 4: Thiên Giới (mốc 4→5) — ~15 nhiệm vụ
    ├─ Chương 5: Vô Lượng (mốc 5→6) — ~10 nhiệm vụ
    └─ Chương 6: Thần Cấp (mốc 6→7) — ~10 nhiệm vụ (cực khó)

📋 Nhiệm Vụ Nhật Ký (Daily) — reset mỗi ngày, EXP + nguyên liệu

📋 Nhiệm Vụ Bang Hội (Guild) — reset tuần, loot cao cấp
```

### 8.2 Nhiệm vụ tân thủ (5 nhiệm vụ đầu — thiết yếu)
1. Chọn Tộc → nhận trang bị starter 0★
2. Đánh 20 mob cấp 1 → học kỹ năng đầu tiên
3. Gặp NPC Trưởng Làng → nhận đệ tử starter
4. Đánh Boss Sơ Khai → nhận Đá Nâng Cấp x3
5. Phân bổ Tiềm Năng lần đầu → mở GUI `/tiemnang`

### 8.3 Nhiệm vụ Tộc riêng
- Mỗi tộc có **chuỗi quest riêng** song song với quest chính, mở thêm lore và item độc quyền
- Ví dụ:
  - Thiên Chiến Tộc: "Con đường Sấm Sét" — học Thiên Lôi Xung từ Đại Sư, đánh boss đặc trưng
  - Lục Tinh Tộc: "Nguồn Gốc Xanh Lá" — khám phá cổ tích tộc mình, học bí kíp hồi phục ẩn
  - Hỏa Hắc Tộc: "Thức Tỉnh Bản Năng" — nhiệm vụ kích hoạt hình thức Thức Tỉnh đặc biệt

### 8.4 Nhiệm vụ Thành Tích (Achievement)
- Hoàn thành **1 lần duy nhất**, nhận phần thưởng vĩnh viễn
- Ví dụ:
  - Hạ Boss Thế Giới lần đầu → nhận Title "Thợ Săn"
  - Phá Giới mốc 5 → nhận aura mốc đặc biệt
  - Ép sao thành công 7★ → nhận hiệu ứng tên rực lửa
  - Hoàn thành 100 nhiệm vụ nhật ký → nhận pet cosmetic vĩnh viễn
- Danh sách Achievement hiển thị trên GUI `/tt` (thông tin nhân vật)

---

## 9. Hệ Đệ Tử

### 7.1 Cách sở hữu
- Nhiệm vụ tân thủ (1 đệ tử starter miễn phí)
- Thu phục quái (HP quái < 20%, sức mạnh thấp hơn người chơi)
- Đổi Linh Thạch tại NPC

### 7.2 Đệ tử có trang bị riêng
- Đệ tử có 4 slot trang bị: Vũ khí / Áo / Phụ kiện / Đặc biệt
- Trang bị đệ tử cũng ép sao được (1★→5★ max)
- Đệ tử có Tiềm Năng riêng (phân bổ tự động theo loại đệ tử)

### 7.3 Bốn lệnh
```
/dt follow   → Đi theo
/dt attack   → Tấn công mục tiêu
/dt home     → Cất vào kho
/dt merge    → Huyết Mạch Hợp Nhất (Hợp Thể)
```

### 7.4 Huyết Mạch Hợp Nhất (= Bông Tai / Lưỡng Long Nhất Thể)
- Đệ tử biến mất 10–20 giây (tùy mốc đệ tử)
- Người chơi: +30–80% SD, đổi aura theo đệ tử, kỹ năng đặc trưng đệ tử
- Cooldown: 3 phút

### 7.5 Mốc phá giới của đệ tử
`0 → 10tr → 100tr → 1 tỷ → 10 tỷ → 60 tỷ` (5 mốc)

---

## 10. Hệ Cờ PvP

| Cờ | Màu | Cơ chế |
|---|---|---|
| Cờ Xanh | 🟢 | Đồng minh với xanh, địch với đỏ/lam/vàng/đen |
| Cờ Đỏ | 🔴 | Đồng minh với đỏ, địch với còn lại |
| Cờ Lam | 🔵 | Đồng minh với lam |
| Cờ Vàng | 🟡 | Đồng minh với vàng |
| Cờ Đen | ⚫ | Đánh tất cả — +10% EXP khi hạ bất kỳ ai |

- Hạ người khác màu (cờ thường): +5% EXP
- Hạ người cờ đen: +5% EXP bonus thêm
- Vùng an toàn (spawn, tông môn): PvP tắt hoàn toàn

---

## 11. Hệ Tông Môn (Bang Hội)

| Tính năng | Chi tiết |
|---|---|
| Tạo / Vào tông môn | `/tm create <tên>` hoặc `/tm join <tên>` |
| Base tông môn | Mỗi tông môn có 1 world nhỏ riêng để đặt đồ, tĩnh tu |
| Buff tông môn | +X% EXP khi trong vùng base tông môn |
| Nhiệm vụ bang | Reset tuần, cả bang cùng làm, reward boss loot |
| Chiến tông môn | Sự kiện cuối tuần: tông môn đánh nhau |
| Sư Đồ trong tông môn | Người lâu năm nhận thưởng khi đệ tử phá giới |

---

## 12. Thiết Kế Map (Thế Giới)

### 12.1 Triết lý thiết kế
- **Custom map do Designer xây** — không dùng map sinh thành (cần cảm giác đầy đủ, có phần thế giới rõ ràng)
- Mỗi world là một **kỹ nguyên văn minh** — kiến trúc, phông nền và mob đặc trưng riêng
- Không gian được chia bằng **vùng an toàn** (NPC, shop, tĩnh tu) và **vùng nguy hiểm** (mob, boss vùng, PvP bật)

### 12.2 Bảng 5 Thế Giới Alpha → Launch

| World | Tên | Phông cảnh | Mốc vào | Đặc điểm |
|---|---|---|---|---|
| 1 | **Thành Tam Cược** | Trung tâm, nhiều phố xá | Không yêu cầu | Spawn chính, NPC, Shop, Đấu trường, PvP tắt |
| 2 | **Linh Khí Sơn** | Núi đá xanh, sương mù | Mốc 2 | Mob: Thạch Quái, Ác Linh; Boss: Linh Thú Vương |
| 3 | **Hoạng Mạc Chiến** | Sa mạc đỏ, bãi chiến | Mốc 4 | Mob: Chiến Quỷ, Thiên Ma; Boss: Thiên Ác Tướng |
| 4 | **Thiên Výc Vô Biên** | Vực thẳm vụ trụ, floating islands | Mốc 5 | Mob: Thần Binh, Long Giả; Boss: Long Hoàng |
| 5 | **Cõi Thần Hắc** | Toàn đen/tím, vùng đất vỡ | Mốc 7 | Endgame. Boss final: Thần Ma Vô Danh |

### 12.3 Sơ đồ thế giới

```
🏙️ Thành Tam Cước (Spawn · PvP tắt)
       ↓ [Cổng Linh Khí — yêu cầu Mốc 2]
⛰️   Linh Khí Sơn (Mốc 2-3)
       ↓ [Cổng Hoàng Mạc — yêu cầu Mốc 4]
🏜️  Hoàng Mạc Chiến (Mốc 4)
       ↓ [Cổng Thiên Vực — yêu cầu Mốc 5]
🌌 Thiên Vực Vô Biên (Mốc 5-6)
       ↓ [Nhiệm Vụ Chương 6 + Mốc 7]
🕳️  Cõi Thần Hắc (Endgame)

[Instances — teleport từ NPC]
├── 💪 Phó Bản Nhóm (5 người · 2 lần/ngày)
├── 🏆 Đấu Trường Xếp Hạng (PvP 1v1 / 3v3)
├── 💥 Phó Bản Solo Phá Giới (mỗi mốc)
└── 🏛️ Base Tông Môn (private world/tông)
```

### 12.4 Thiết kế chi tiết mỗi world

#### 🏙️ World 1 — Thành Tam Cước (Spawn)
```
Khu vực:
├── Quảng Trường Trung Tâm   → Spawn point, bảng thông báo
├── Phố NPC                  → Shop, Luyện Rèn, Đổi quà, Tuyển Đồ
├── Đấu Trường Nội Thành     → PvP Arena (1v1 friendly, không mất gì)
├── Tĩnh Tu Viện             → AFK farming zone, Tĩnh Tu Đài
├── Ngân Hàng                → Lưu trữ vật phẩm / chia sẻ trong tộc
└── Cổng Ra (x3)             → Đến các world cao hơn
```

#### ⛰️ World 2 — Linh Khí Sơn
```
Khu vực:
├── Làng Thức Tỉnh           → NPC quest, shop phụ, vùng an toàn
├── Bình Nguyên Đá Xám       → Farm mob: Thạch Quái, Ác Linh (Mốc 2)
├── Hang Sâu                 → Farm mob: Cự Thú, Linh Giáp (Mốc 3)
├── Đỉnh Sơn Thần            → Boss Vùng: Linh Thú Vương (Respawn 45 phút)
└── Vùng Mờ Sương            → Boss Thế Giới xuất hiện ở đây (3-6h/lần)
```

#### 🏜️ World 3 — Hoàng Mạc Chiến
```
Khu vực:
├── Tiền Đồn Sa Mạc          → NPC quest, vùng an toàn nhỏ
├── Chiến Trường Lửa         → Farm mob: Chiến Quỷ (Mốc 4)
├── Tháp Thiên Ma             → Farm mob: Thiên Ma, Linh Giáp Mạnh (Mốc 4)
├── Bãi Thần Xương           → Boss Vùng: Hoàng Sa Tướng (Respawn 30 phút)
└── Trung Tâm Bão Cát        → Boss Thế Giới: Thiên Ác Tướng
```

### 12.5 Quy tắc map cho Designer
- **Vùng an toàn** (làng, tiền đồn): dùng block sáng (đá bạch, gỗ sáng màu), đèn lồng
- **Vùng nguy hiểm**: tối hơn, màu đất đỏ/đen/xám, có hiệu ứng ánh sáng đỏ
- **Spawn Boss Vùng**: có đài/bệ đặc biệt để nhận ra ngay
- **Cổng thế giới**: build nổi bật, có particle effect (coder thêm)
- Mỗi world phải có **điểm landmark** (tòa nhà/núi đặc trưng) để dễ nhận ra khi screenshot quảng cáo

---

## 13. Kinh Tế & Donate

### Tiền tệ

| Loại | Cách kiếm | Dùng để |
|---|---|---|
| **Đồng Linh** | Đánh mob, bán đồ NPC | Mua đồ cơ bản, Tài Xỉu |
| **Linh Thạch** | Boss, nhiệm vụ, donate quy đổi | Trang bị cao cấp, Reset tiềm năng, Thu phục đệ tử |
| **Tiên Tinh** | Donate cao cấp, Boss Thế Giới tuần | Cosmetic, pet ngoại hình, aura đặc biệt |

### Donate → Linh Thạch
- Tỷ lệ cố định, giới hạn đổi/ngày để giữ kinh tế
- Ưu tiên QR/chuyển khoản để giảm chiết khấu thẻ cào (tiết kiệm 15-20%)

### Rank Donate

| Rank | Giá | Quyền lợi |
|---|---|---|
| **Chiến Sĩ** | 50k | +20% EXP, tag màu, +1 home |
| **Anh Hùng** | 150k | +40% EXP, fly thị trấn, kit hàng ngày |
| **Thiên Tướng** | 350k | +70% EXP, Bùa Bảo Vệ x1/tuần, 5 home |
| **Thần Chiến** | 700k | +100% EXP, aura riêng, priority slot, reset tiềm năng 1 lần |
| **Huyền Thoại** | 1.5tr | +150% EXP, effect tên đặc biệt, pet cosmetic, VIP lounge |

### Nguồn thu bổ sung tự nhiên
- Bùa Bảo Vệ (ép sao) — người chơi tự nguyện mua
- Reset Tiềm Năng — tốn Linh Thạch
- Trang phục/Aura/Effect đặc biệt — cosmetic thuần túy
- Top Donate theo tuần/tháng — bảng vinh danh + quà

### Tài Xỉu
- Chỉ dùng **Đồng Linh** (không quy đổi ra Linh Thạch/Tiên Tinh)
- An toàn về mặt pháp lý

---

## 14. Chi Phí Vận Hành

| Khoản | Alpha/Beta | Post-Launch |
|---|---|---|
| VPS (8GB RAM, Paper) | 300–500k/tháng | 1.5–3tr/tháng |
| Domain + SSL | 300k/năm | như cũ |
| Website / Wiki | Miễn phí (Netlify) | như cũ |
| Cổng nạp | Chiết khấu 15-30% thẻ cào; ưu tiên QR | như cũ |
| Marketing | 0 (organic TikTok/FB) | 3–10tr/tháng |
| GM / Support | Tình nguyện | Hoa hồng donate |
| **Tổng** | **~300–500k/tháng** | **~5–15tr/tháng** |

---

## 15. Roadmap Phát Triển

### Phase 1 — Alpha Core (ưu tiên tuyệt đối)
*Coder cần hoàn thành trước khi có bất kỳ người chơi nào*

- [ ] Plugin Tiềm Năng: phân bổ SD/HP/KI qua GUI
- [ ] Plugin Mốc Phá Giới (7 mốc) + nhiệm vụ phá giới cơ bản
- [ ] Hệ 3 Tộc: đăng ký tộc + stat modifier khác nhau
- [ ] Kỹ năng cơ bản mỗi tộc (3 chiêu/tộc → 9 chiêu tổng)
- [ ] Biến hình / Thức Tỉnh: đổi aura particle + buff
- [ ] Hệ Trang Bị ép sao (1★→5★ trong Alpha)
- [ ] Nhiệm vụ tân thủ 5 nhiệm vụ đầu
- [ ] Multi-world: 2 thế giới đầu + cổng teleport
- [ ] Hệ Cờ PvP cơ bản
- [ ] Rank Donate + cổng nạp

### Phase 2 — Beta Content
- [ ] Đệ tử đầy đủ (thu phục + trang bị + hợp thể)
- [ ] Boss Thế Giới (3 boss đầu)
- [ ] Phó Bản nhóm đầu tiên
- [ ] Hệ Tông Môn
- [ ] Nhiệm vụ chuỗi Chương 1-3
- [ ] World đầy đủ 4/7

### Phase 3 — Launch
- [ ] Đủ 7 thế giới
- [ ] Đấu Trường Xếp Hạng
- [ ] Nhiệm vụ đầy đủ 6 Chương
- [ ] Web Store + Wiki
- [ ] Ép sao đủ 1★→7★
- [ ] Tài Xỉu
- [ ] Marketing: TikTok, FB Group, KOL nhỏ

### Phase 4 — Post-Launch
- [ ] Sự kiện theo mùa / lễ tết
- [ ] Mốc 8-9 (update endgame)
- [ ] Hệ Linh Thú (pet chiến đấu)
- [ ] Hệ Đạo Lữ
- [ ] Balance tuning theo feedback cộng đồng

---

## 18. Tài Liệu Kỹ Thuật — Phase 1 (dành cho Coder)

### 18.1 Stack kỹ thuật đề xuất

| Layer | Công nghệ | Lý do |
|---|---|---|
| Server core | **Paper 1.20.x** | Hỗ trợ đầy đủ API, hiệu năng tốt |
| Plugin lôi | **Java (Maven)** | Kiểm soát tốt hơn Skript, dễ debug |
| Database | **MySQL + HikariCP** | Dữ liệu player lưu trú bền, scale được |
| GUI | **InventoryAPI / AnvilGUI** | Tạo GUI kỹ năng, tiềm năng đẹp |
| Particle / Effect | **Paper Particle API** | Aura, Thức Tỉnh, boss effect |
| Damage system | **Custom event (PlayerDamageEvent)** | Ghi đè hệ thống damage và công thức SD/HP |
| Multi-world | **Multiverse-Core** | Quản lý 5+ world |
| Rank donate | **LuckPerms** | Permission bạn rank đơn giản |

### 18.2 Cấu trúc Plugin chính (TamCuoc-Core)

```
tamcuoc-core/
├── commands/          ← /tiemnang, /phagiai, /tococ, /dt, /co
├── data/
│   ├── PlayerData.java   ← UUID, tộc, tiềm năng, mốc, trang bị
│   └── DatabaseManager    ← MySQL CRUD
├── systems/
│   ├── TiemNangSystem     ← phân bổ SD/HP/KI, GUI 3 slot
│   ├── PhaGiaiSystem      ← kiểm tra điều kiện, mở giới hạn, quest trigger
│   ├── TocSystem          ← đăng ký tộc, load stat modifier
│   ├── KyNangSystem       ← cast chiêu, KI cost, cooldown, damage calc
│   ├── TrangBiSystem      ← khóa tộc, ép sao, stat cộng vào player
│   ├── CoPvPSystem        ← đăng ký cờ, friendly fire logic
│   ├── ThucTinhSystem     ← biến hình: particle, swap skill set, buff timer
│   └── DeTuSystem         ← entity AI, follow/attack/home/merge
├── gui/
│   ├── TiemNangGUI        ← 3 thanh trượt SD/HP/KI
│   ├── TrangBiGUI         ← 6 slot trang bị + info
│   └── ThongTinGUI        ← /tt — nhân vật, mốc, achievement
├── bosses/
│   ├── BossVungManager    ← spawn cố định, phase 2, enrage
│   └── BossTheGioiManager ← countdown, top damage, loot chia
└── events/            ← lắng nghe Damage, Death, Join, Quit
```

### 18.3 Công thức cốt lõi

```java
// Sát thương cuối cùng
damage = (baseDamage + SD * sdMultiplier) * skillMultiplier * (1 - targetResist)

// KI hồi theo thời gian
kiRegen = baseKiRegen + (KI_stat * 0.01) // mỗi giây

// EXP nhận mỗi lần đánh mob
exp = mob.baseExp * (1 + activeBonus) * (1 + rankBonus) * (1 - cappingPenalty)
// cappingPenalty = 0 nếu mob cùng vùng mốc, tăng nếu mob quá yếu

// Ép sao thất bại
if (random() > successRate) {
    if (star >= 4) destroyItem(); // phá đồ
    else reduceStar(1);           // giảm sao
}
```

### 18.4 Thứ tự build Phase 1 (gợi ý cho Coder)

```
Tuần 1-2:   PlayerData + DatabaseManager (nền tảng lưu trữ)
Tuần 3-4:   TocSystem + stat modifier cơ bản (3 tộc khác nhau chỉ số)
Tuần 5-6:   TiemNangSystem + GUI phân bổ SD/HP/KI
Tuần 7-8:   Custom Damage System (ghi đè Minecraft vanilla)
Tuần 9-10:  KyNangSystem: 3 chiêu đầu mỗi tộc (9 chiêu)
Tuần 11:    ThucTinhSystem (Hỏa Hắc biến hình)
Tuần 12-13: PhaGiaiSystem: 3 mốc đầu + nhiệm vụ phá giới
Tuần 14-15: TrangBiSystem: slot + khóa tộc + ép sao 1★→3★
Tuần 16:    CoPvPSystem
Tuần 17-18: Multi-world (2 world + cổng teleport)
Tuần 19-20: Nhiệm vụ tân thủ 5 quest + NPC cơ bản
Tuần 21-22: Rank Donate (LuckPerms) + cổng nạp test
Tuần 23-24: Bug fix, balance, nội bộ test
→ Alpha có người chơi: Tuần 25+
```

> **Ước tính:** ~6 tháng cho 1 coder full-time. Nếu part-time (buổi tối + cuối tuần): 10-14 tháng.

### 18.5 Dữ liệu Player cần lưu (DB Schema tham khảo)

```sql
CREATE TABLE players (
    uuid        VARCHAR(36) PRIMARY KEY,
    name        VARCHAR(16),
    toc         ENUM('THIEN_PHONG','AM_MOC','HOA_HAC'),
    sd          INT DEFAULT 0,       -- điểm Sức Đánh đã phân bổ
    hp          INT DEFAULT 0,       -- điểm Máu đã phân bổ
    ki          INT DEFAULT 0,       -- điểm Khí đã phân bổ
    free_points INT DEFAULT 0,       -- điểm chưa phân bổ
    moc         INT DEFAULT 1,       -- mốc hiện tại (1-7)
    tiem_nang   BIGINT DEFAULT 0,    -- tiềm năng tích lũy
    co_pvp      ENUM('XANH','DO','LAM','VANG','DEN') DEFAULT 'XANH',
    rank_donate VARCHAR(20) DEFAULT 'NONE',
    last_seen   TIMESTAMP
);

CREATE TABLE equipment (
    uuid      VARCHAR(36),
    slot      ENUM('vu_khi','ao','quan','giay','gang','rada'),
    item_id   VARCHAR(50),           -- ID tên sét đồ
    toc_lock  ENUM('THIEN_PHONG','AM_MOC','HOA_HAC','NEUTRAL'),
    stars     INT DEFAULT 0,
    PRIMARY KEY (uuid, slot)
);
```

---

## 19. Sự Kiện Định Kỳ

> ⏳ **Chưa chốt chi tiết** — sẽ thiết kế sau khi Alpha ổn định. Ghi chú tạm:

- Sự kiện đua top donate / sức mạnh — **sau Launch**
- Boss Đặc Biệt cuối tuần — **sau Launch**
- Sự kiện lễ tết theo mùa — **sau Launch**
- Chiến tranh Tông Môn — **sau Launch**
- Giải đấu PvP tháng — **sau Launch**

---

## 20. Câu Hỏi Còn Mở

- [ ] **Tên server chính thức** (tên thế giới đã có: *Tam Cược*)
- [ ] **Timeline Alpha** — Coder có thể bắt đầu chưa? Khi nào?
- [ ] **Map**: Designer bắt đầu World 1 (Thành Tam Cược) trước?
- [ ] **Sự kiện định kỳ**: chi tiết thiết kế (mục 19, để sau Launch)


---

## 21. Gameplay Flow Chi Tiết *(Brainstorm Session — 14/09/2026)*

> Phần này tổng hợp các quyết định thiết kế cụ thể từ buổi lên ý tưởng. Bổ sung / thay thế cho các mục còn mờ nhạt ở trên.

---

### 21.1 Tạo Tài Khoản & Chọn Tộc

**Luồng chính xác:**
```
Người chơi vào lần đầu
    → Spawn tại Spawn Tổng (thế giới trung tâm)
    → Gặp NPC Thượng Đế tại Spawn Tổng
    → Chọn tộc qua GUI của NPC Thượng Đế
         ├── ⚡ Tộc Thiên Phong
         ├── 🌿 Tộc Âm Mộc
         └── 🔥 Tộc Hỏa Hắc
    → Được teleport đến Spawn Riêng của tộc đó (hành tinh tương ứng)
    → Gặp NPC Trưởng Lão của hành tinh → nhận nhiệm vụ đầu tiên
```

**Quy tắc:**
- Chọn tộc **1 lần duy nhất**, không đổi được
- Mỗi tộc có **spawn point riêng** trên hành tinh riêng
- NPC Thượng Đế hiển thị mô tả từng tộc (stat, phong cách chơi) trước khi xác nhận

---

### 21.2 Trải Nghiệm Tân Thủ

**Ngay sau khi chọn tộc:**
- Teleport đến hành tinh của tộc → gặp **NPC Trưởng Lão**
- Trưởng Lão nói chuyện qua thanh chat (hội thoại tường thuật lore)
- Nhận **nhiệm vụ đầu tiên** từ Trưởng Lão

**Trang bị tân thủ nhận ngay:**
- 1 bộ **Giáp Thô** (0★, khóa theo tộc) — đủ 6 slot cơ bản
- Vài **Vật Phẩm Mặc Định** để đánh quái (ví dụ: Hòn Đá Linh Khí x10)
- Người chơi đã có sẵn **Skill Đấm của tộc** (skill mặc định từ khi sinh ra, không cần học)

> 💡 Skill đấm mặc định = chiêu lv1 của tộc, không cần KI, cooldown ngắn — để tân thủ không bị bối rối khi bắt đầu.

---

### 21.3 Hệ NPC & Hội Thoại

**Cơ chế tương tác:**
- Người chơi click/right-click vào NPC → NPC **nói chuyện qua thanh chat** (chỉ người chơi đó thấy)
- Nếu có lựa chọn → hiện **GUI Minecraft** (InventoryGUI với các item đại diện lựa chọn)
- Hội thoại có **lore** — NPC có tính cách, không chỉ là "nhiệm vụ máy"

**Plugin tham khảo:** Citizens (quản lý NPC) + Denizen (scripting hội thoại) — hoặc tự code

**Loại NPC:**

| Loại | Vị trí | Vai trò |
|---|---|---|
| Thượng Đế | Spawn Tổng | Chọn tộc lần đầu |
| Trưởng Lão | Spawn mỗi hành tinh | Quest chính, lore tộc |
| NPC Ẩn | Rải rác bản đồ | Quest phụ bí ẩn, phải tự tìm |
| Thương Nhân | Spawn + hành tinh | Shop cố định giá, Auction House |
| Luyện Rèn | Spawn + hành tinh | Craft trang bị, ép sao |
| Phi Công | Bãi Tàu mỗi hành tinh | Dẫn sang hành tinh khác |

---

### 21.4 Hệ Nhiệm Vụ — Cập Nhật Chi Tiết

**Các dạng nhiệm vụ tân thủ:**
- ✅ Giết X con quái (dạng chính — như NRO)
- ✅ Thu thập nguyên liệu drop từ quái
- ✅ Thoại với NPC nhiều bước (tìm NPC theo lore)
- ✅ Đến địa điểm khám phá trên bản đồ
- 💡 Gợi ý: **Bảo vệ NPC khỏi quái tấn công** (escort quest) — tạo cảm giác thế giới sống động

**Cấu trúc nhiệm vụ:**
```
📋 Main Quest (từng tộc riêng biệt — lore khác nhau, đích đến phá giới giống nhau)

📋 Nhiệm Vụ NPC Ẩn
    → Rải rác bản đồ, phải tự tìm NPC — reward độc quyền

📋 Daily Quest
    → Reset mỗi ngày — EXP + nguyên liệu phụ

📋 Nhiệm Vụ Bang Hội
    → Reset tuần, cả bang cùng làm
```

> ⚠️ Mỗi tộc có chuỗi quest RIÊNG — cùng mốc phá giới nhưng hành trình lore khác nhau.
> Tộc Thiên Phong: học Thiên Lôi Xung từ đại sư ≠ Âm Mộc: học bí kíp hồi phục ẩn.

---

### 21.5 Hệ Boss — Cập Nhật Chi Tiết

#### Boss Vùng (nhỏ)
- **Spawn ngẫu nhiên** trong vùng bãi farm (không cố định tọa độ)
- **Thông báo toàn server** khi boss vùng xuất hiện (broadcast + tên hành tinh)
- Respawn sau X phút kể từ khi bị hạ

#### Boss Thế Giới (lớn — sự kiện toàn server)
- **HP Bar hiển thị toàn server** khi boss đang sống (như NRO)
- **Last Hit** nhận loot đặc biệt riêng
- **Loot chia theo % damage** — phải đánh mới được loot (chống free-loot)
- Countdown thông báo 10 phút trước khi spawn

#### Cơ Chế Gameplay Boss (cả 2 loại)
| Cơ chế | Mô tả |
|---|---|
| **Phase 2** (HP < 50%) | Đổi bộ skill + tăng tốc độ |
| **AoE Tán Xạ** | Đợt tấn công diện rộng — PHẢI chạy thoát trong vài giây |
| **Minion Spawn** | Boss triệu hồi lính nhỏ giữa trận — cần phần team dọn |
| **Enrage** (HP < 20%) | Damage tăng 50% |

---

### 21.6 Phó Bản (Dungeon)

- **Nhận nhiệm vụ** tại NPC ở Spawn Hành Tinh → teleport vào khi bắt đầu
- **Loot tốt hơn hẳn** farm thường — lý do chính để vào phó bản
- Có giới hạn lượt/ngày *(gợi ý: 2 lượt/ngày như NRO — chưa chốt)*

---

### 21.7 Hệ EXP / Tiềm Năng — Cơ Chế Cày

**Nguồn EXP chính:**
1. **Đánh quái** — nguồn chính, liên tục
2. **Treo Linh Giới** (nơi ở của Kaio) — AFK EXP chậm hơn, có thể offline

**Vật phẩm hỗ trợ:**
- Bình tăng EXP (mua bằng Linh Thạch / drop từ boss) — kinh điển NRO

> 💡 Mốc 1→2: EXP từ nhiệm vụ là chính. Mốc 3+: farm quái trở thành nguồn chủ lực.

---

### 21.8 Cấu Trúc Thế Giới — Cập Nhật

```
🌌 SPAWN TỔNG (Thành Tam Cược)
    │  PvP tắt | NPC Thượng Đế | Shop | Auction House | Tĩnh Tu
    │
    ├── 🌍 HÀNH TINH THIÊN PHONG
    │       Bãi farm, Boss Vùng, Trưởng Lão, NPC Quest
    │       └── ✈️ Bãi Tàu Vũ Trụ → du hành sang hành tinh khác
    │
    ├── 🌿 HÀNH TINH ÂM MỘC
    │       Bãi farm, Boss Vùng, Trưởng Lão, NPC Quest
    │       └── ✈️ Bãi Tàu Vũ Trụ → du hành sang hành tinh khác
    │
    ├── 🔥 HÀNH TINH HỎA HẮC
    │       Bãi farm, Boss Vùng, Trưởng Lão, NPC Quest
    │       └── ✈️ Bãi Tàu Vũ Trụ → du hành sang hành tinh khác
    │
    ├── 🌐 RTP WORLD (Thế Giới Chung PvP)
    │       PvP TỰ DO — không cần bật cờ
    │       Mọi tộc đều có thể chiến nhau tại đây
    │
    └── ☁️ LINH GIỚI (Nơi ở Kaio)
            AFK EXP — online hoặc offline
            Vùng an toàn, không PvP
```

**Cơ chế du hành hành tinh:**
- Đến **Bãi Tàu Vũ Trụ** của hành tinh mình → chọn điểm đến → teleport
- Người chơi tộc khác có thể qua hành tinh khác bình thường
- ❓ *(Câu hỏi mở: PvP trên hành tinh khác tộc — tắt hay theo cờ?)*

---

### 21.9 Hệ PvP & Cờ — Cập Nhật Chi Tiết

**Phân vùng PvP:**

| Khu vực | PvP | Ghi chú |
|---|---|---|
| Spawn Tổng | ❌ Tắt | An toàn tuyệt đối |
| Linh Giới | ❌ Tắt | AFK EXP an toàn |
| Hành Tinh (bãi farm) | 🔶 Tùy cờ | Bật cờ mới bị/được đánh |
| RTP World | ✅ Tự do | Đến là chiến ngay |

**Cơ chế bật cờ tại Hành Tinh:**
- Mặc định: không bị PvP khi farm
- Bật cờ → **+EXP bonus** khi đánh quái, nhưng có nguy cơ bị người khác tấn công
- Khi bị giết: **mất 1 lượng nhỏ Đồng Linh** (không mất đồ, không mất EXP)

**Cơ chế chết — Hệ Xuất Hồn:**
```
Người chơi chết
    → Vào trạng thái XUẤT HỒN (đứng yên 5 giây — không ai thấy/đánh được)
    → Lựa chọn qua GUI:
         ├── [Về Nhà]    → teleport về spawn hành tinh, miễn phí
         ├── [Ở Lại]     → xem trận đấu dưới dạng spectator (thoải mái)
         └── [Hồi Sinh]  → sống lại tại chỗ, tốn Đồng Linh / Linh Thạch
```

---

### 21.10 Kinh Tế Game — Cập Nhật

| Cơ chế | Chi tiết |
|---|---|
| **NPC Shop** | Giá cố định (như NRO) — hàng thiết yếu, nguyên liệu cơ bản |
| **Auction House** | Người chơi đăng bán đấu giá — đồ drop hiếm, bí kíp |
| **Lệnh /trade** | Giao dịch trực tiếp 2 người (tự build hoặc plugin) |
| **Drop đồ quái** | Tự do lượm — ai nhìn thấy trước lượm trước |

> 💡 Cân nhắc: Grace period 30s sau khi kill — chỉ người kill mới lượm được (chống kill-steal đồ)?

---

## 20. Câu Hỏi Còn Mở *(cập nhật)*

- [ ] **Tên server chính thức** (tên thế giới đã có: *Tam Cược*)
- [ ] **Timeline Alpha** — Coder có thể bắt đầu chưa? Khi nào?
- [ ] **Map**: Designer bắt đầu Spawn Tổng + 3 Hành Tinh trước?
- [ ] **Linh Giới**: giới hạn thời gian AFK? tốn vật phẩm không?
- [ ] **Tàu Vũ Trụ**: di chuyển tốn bao lâu / tốn gì không?
- [ ] **PvP trên hành tinh khác tộc**: tắt mặc định hay theo cờ?
- [ ] **Drop đồ quái**: tự do lượm hay có grace period 30s?
- [ ] **Phó bản**: giới hạn bao nhiêu lượt/ngày?
- [ ] **Auction House**: tự build hay dùng plugin có sẵn?
- [ ] **NPC Hội Thoại**: Citizens + Denizen hay tự code plugin?
- [ ] **Sự kiện định kỳ**: thiết kế sau Launch


---

## 22. Phân Tích NRO & Ý Tưởng Áp Dụng Cho Server *(Từ Tài Liệu Ngọc Rồng Online)*

> Nguồn: Tài liệu phân tích chuyên sâu Ngọc Rồng Online (Teamobi) — tổng hợp 14/09/2026.
> Mục này so sánh cơ chế NRO gốc với thiết kế server hiện tại và đề xuất cải tiến.

---

### 22.1 Phân Tích 3 Tộc NRO — Bài Học Thiết Kế

NRO thành công nhờ **3 tộc KHÔNG thể thay thế nhau** — mỗi tộc có triết lý chiến đấu hoàn toàn riêng:

| Tộc NRO | Triết lý cốt lõi | Điểm mạnh | Điểm yếu | Tương đương server ta |
|---|---|---|---|---|
| **Trái Đất** | Burst damage + CC | Giao tranh chớp nhoáng, dọn quái nhanh | HP thấp, cần trang bị cao | ⚡ Tộc Thiên Phong |
| **Xayda** | Công thủ toàn diện + Biến Khí | Ổn định, solo tốt, không cần VIP | — | 🔥 Tộc Hỏa Hắc |
| **Namec** | Tank + Hồi phục | Sinh tồn tuyệt đối, xương sống đội | Sát thương thấp, PvP chậm | 🌿 Tộc Âm Mộc |

**💡 Bài học áp dụng:**
- Cần đảm bảo mỗi tộc có **ít nhất 1 thứ duy nhất không ai thay thế được**:
  - Thiên Phong: đòn sát thương đơn mục tiêu cao nhất tuyệt đối
  - Âm Mộc: hồi máu đồng đội — tộc khác không hồi được cho người khác
  - Hỏa Hắc: Thức Tỉnh (biến hình đổi bộ skill) — chỉ tộc này có
- **Phó bản khó cần cả 3 tộc**: thiết kế boss phó bản có cơ chế bắt buộc cần tank + heal + dps

---

### 22.2 Hệ Đệ Tử NRO — Cơ Chế Cực Kỳ Hấp Dẫn

**NRO làm gì:** Đệ tử là "nhân vật thứ 2" hoạt động song song, quyết định tốc độ farm và sức mạnh tổng thể.

**5 khe kỹ năng đệ tử mở ngẫu nhiên (RNG/Gacha)** tạo ra vòng lặp nghiện:
- Kỹ năng 1: Đánh cận chiến (Glick / Dragon / Demon)
- Kỹ năng 2-3: Hỗ trợ (Thái Dương Hạ San lý tưởng nhất — CC diện rộng)
- Kỹ năng 4 (mở ở 20 tỷ SM): Biến Khí (sát thương khổng lồ) hoặc Biến Chim
- Kỹ năng 5: Tuyệt kỹ tân tiến (Super Kamejoko, Cadic Liên Hoàn...)

**Đệ tử cao cấp:** Mabu, Broly, Beerus — tranh đoạt bằng KS (Kill Steal) last hit rất khốc liệt.

**💡 Ý tưởng áp dụng cho server ta:**

```
Hệ Đệ Tử cải tiến:
├── Đệ tử thường: thu phục quái HP < 20%
├── Đệ tử hiếm: drop từ Boss Thế Giới (last hit)
├── Kỹ năng đệ tử: mở NGẪU NHIÊN theo mốc sức mạnh đệ tử
│    → Tạo vòng lặp "nuôi đệ tử" kéo dài hàng tuần
├── Đệ tử có thể TIẾN HÓA (như Mabu → Mabu Thức Tỉnh)
└── Kỹ năng "xấu" (như Khiên năng lượng trong NRO) cũng nên có
     → Tạo drama, cộng đồng chia sẻ kinh nghiệm
```

> ⚠️ **Quan trọng:** RNG kỹ năng đệ tử là một trong những hook nghiện nhất của NRO. Nên implement sớm.

---

### 22.3 Hệ Ép Sao Pha Lê — Vi Mô Hóa Chỉ Số

**NRO có 6 loại Sao Pha Lê** với hiệu ứng khác nhau:

| Loại Sao | Hiệu ứng | Dùng cho |
|---|---|---|
| 🟢 Xanh Lá | +5% sức mạnh tiềm năng | BẮT BUỘC cho mọi build (train đệ tử) |
| 🔴 Đỏ Chuyển | Chuyển 5% sát thương → HP | Trị dưỡng, bền bỉ khi farm boss |
| 🔵 Xanh Dương | Chuyển 5% sát thương → KI | Spam kỹ năng không cần dùng bình |
| ❤️ Đỏ Hồng Phấn | Phản lại 5% sát thương nhận vào | Tank Namec, PvP phản đòn |
| 🟡 Vàng | +5% tỉ lệ nhặt vật phẩm | Tài khoản phụ chuyên farm vàng |
| 🟣 Tím/Cam | Xuyên giáp 5% | Ít được dùng |

**Ngoài ra: Ngọc Rồng 1-7 sao** gắn vào trang bị (phòng thủ, HP, KI, hồi phục).

**💡 Ý tưởng áp dụng:**

Thay vì chỉ ép sao (1★→7★), server ta nên có thêm **hệ Tinh Thạch** (tương đương Sao Pha Lê):

```
Hệ Tinh Thạch (thêm vào trang bị):
├── 💚 Tinh Thạch Lục: +% Tiềm Năng tích lũy    → Farm EXP nhanh hơn
├── ❤️  Tinh Thạch Huyết: Hút máu từ sát thương   → Tự hồi khi đánh
├── 💙 Tinh Thạch Lam: Hút KI từ sát thương       → Spam kỹ năng
├── 🟡 Tinh Thạch Kim: +% drop vật phẩm           → Farm đồ
└── 🟣 Tinh Thạch Tím: +% xuyên giáp              → PvP chuyên sâu
```

> Mỗi trang bị có N khe Tinh Thạch → mở thêm bằng vật phẩm hiếm.
> Tạo thêm một layer kinh tế và customization sâu.

---

### 22.4 Hệ Set Kích Hoạt (SKH) — Endgame Trang Bị

**NRO:** SKH = bộ trang bị đặc biệt, kích hoạt bonus khổng lồ khi mặc đủ 2/4/5 món:
- **Set Thần Vũ Trụ Kaio** (Trái Đất): tăng đột biến sát thương + bù sinh tồn
- **Set Cadic M** (Xayda): tối ưu chiến đấu trường kỳ
- **Set Chiến Binh Nail** (Namec): HP + giáp cực cao → pháo đài di động

Tạo bằng cách kết hợp Trang Bị Thần Linh + 2000 Linh Hồn đặc trưng tộc.
Có thể **Tái Chế SKH** (100% thành công) → lấy lại nguyên liệu → không bao giờ mất trắng.

**💡 Ý tưởng áp dụng — Hệ Linh Giáp Toàn Bộ:**

```
Linh Giáp (tương đương SKH) — Endgame server ta:
├── Mốc 5+ mới mở chế tác Linh Giáp
├── Cần: Trang bị 6★ + Linh Hồn Tộc x1000 (drop từ Boss Thế Giới)
├── Kích hoạt theo bộ:
│    2/6 món → +10% sát thương cả bộ
│    4/6 món → thêm hiệu ứng phụ đặc trưng tộc
│    6/6 món → aura đặc biệt + hiệu ứng kỹ năng signature tăng 30%
├── Tái Chế Linh Giáp: thu hồi 70% nguyên liệu (không mất trắng)
└── Mỗi tộc có 2 bộ Linh Giáp khác nhau (tấn công / phòng thủ)
```

---

### 22.5 Hệ Boss — Cơ Chế KS & Super Broly

**NRO làm xuất sắc:**
- Boss Thế Giới có cơ chế **tích lũy sức mạnh theo sát thương nhận vào** (Super Broly: càng đánh càng mạnh)
- Khi bị "kích" đủ → biến hình hoàn toàn, HP và sức mạnh nhân bội → trở thành "bao cát" lý tưởng
- Tạo ra **nghi lễ cộng đồng**: cả server tập hợp kích Boss → drama, hợp tác, KS

**💡 Ý tưởng áp dụng — Boss "Tích Lũy":**

```
Boss Tích Lũy (1-2 boss đặc biệt trong endgame):
├── Boss xuất hiện yếu (HP thấp, sát thương thấp)
├── Mỗi lần nhận X sát thương → tích một giai đoạn
├── Đủ 3 giai đoạn → BIẾN HÌNH: HP x10, damage x5, bộ skill mới
├── Dạng biến hình = "bao cát" farm EXP + drop cực nhiều
├── Cần phối hợp: đủ người đánh mới kích được, quá ít người → boss hồi máu
└── Last hit dạng biến hình → loot đặc biệt duy nhất
```

---

### 22.6 Hệ Kinh Tế — Bài Học Từ NRO

**NRO có 3 tầng tiền tệ:**
1. **Vàng**: phổ thông, từ quái/nhiệm vụ → mua đồ cơ bản
2. **Ngọc Xanh/Hồng**: cao cấp, donate/sự kiện → VIP shop, ép sao
3. **Thỏi Vàng**: "bản vị vàng" — lưu trữ giá trị, giao dịch đồ Thần Linh/SKH

Tạo ra **grey market** tự phát (tool auto, bot giao dịch) — đây là dấu hiệu kinh tế game sống động.

**💡 Bài học cho server ta:**

```
3 tầng tiền tệ (đã có trong GDD) — cần thêm:
├── Đồng Linh (= Vàng NRO): phổ thông, quái/nhiệm vụ
├── Linh Thạch (= Ngọc NRO): donate + Boss Thế Giới
├── Tiên Tinh (= Thỏi Vàng NRO): giao dịch đồ endgame
│
│ Thêm mới:
├── "Linh Phiếu" (tương đương Thỏi Vàng):
│    = 1000 Đồng Linh gộp lại → tiện lưu trữ + giao dịch lớn
│    → Tránh vấn đề số quá lớn (giới hạn kỹ thuật Java)
└── Nguồn farm kinh tế đa dạng:
     ├── Farm quái thường → Đồng Linh
     ├── Bản đồ Kho Báu (phó bản đặc biệt) → Đồng Linh nhiều
     ├── Capsule/hòm ngẫu nhiên → drop ngẫu nhiên có giá trị
     └── Linh Giới (Treo AFK) → Đồng Linh chậm, ổn định
```

---

### 22.7 Hệ Phó Bản — Cấu Trúc NRO

**NRO có 3 loại phó bản nổi bật:**
1. **Doanh Trại Độc Nhãn**: cần đội hình đầy đủ (DPS + Tank + Heal), nhiều cửa ải, cần bẫy
2. **Bản Đồ Kho Báu**: mê cung tài nguyên, nguồn farm vàng chủ lực — yêu cầu sức mạnh cao
3. **Khí Gas Hủy Diệt**: thử thách tốc độ (level 110), đua kỷ lục, "Vua Tốc Độ"

**💡 Ý tưởng áp dụng:**

```
3 loại phó bản cho server ta:
│
├── 🏰 Phó Bản Đội (3-5 người) — Doanh Trại kiểu NRO
│    Cần đủ vai: 1 Tank (Âm Mộc) + 1 Heal + DPS
│    Nhiều tầng, boss cuối drop Bí Kíp Tinh
│
├── 💰 Bản Đồ Kho Báu (solo/đội)
│    Mê cung ngẫu nhiên mỗi lần vào (random seed)
│    Nguồn farm Đồng Linh + nguyên liệu craft chủ lực
│    Yêu cầu mốc nhất định mới vào được
│
└── ⚡ Phó Bản Thử Thách Tốc Độ (solo)
     Đua thời gian clear boss — bảng xếp hạng tuần
     Top 3 nhận danh hiệu + vật phẩm đặc biệt
     Reset mỗi tuần → cạnh tranh liên tục
```

---

### 22.8 Đại Hội Võ Thuật (PvP Giải Đấu)

**NRO:** Đại Hội Võ Thuật là đấu trường danh giá nhất:
- 1v1 / đội
- Cần đạt 5.000.000 sức mạnh + thắng Vòng 2 để hoàn thành quest chính
- Thể hiện kỹ năng vi mô: timing cooldown, micro-management đệ tử, SKH

**💡 Ý tưởng — Đấu Trường Thiên Đỉnh:**

```
Đấu Trường Thiên Đỉnh (tương đương Đại Hội Võ Thuật):
├── PvP 1v1 có xếp hạng (ELO system)
├── Mở theo mốc: Mốc 3+ mới vào được
├── Mỗi tuần reset bảng xếp hạng
├── Top 10 cuối tuần nhận:
│    #1: Danh hiệu "Thiên Đỉnh Vô Địch" + aura đặc biệt 1 tuần
│    #2-3: Vật phẩm hiếm
│    #4-10: Nguyên liệu ép sao
├── Nhiệm vụ chính: "Đạt Top 8 Đấu Trường" → mở mốc phá giới
└── 3v3 Guild War: mỗi cuối tuần, 2 tông môn đối đầu
```

---

### 22.9 Hệ Cải Trang & Cosmetic

**NRO:** Cải trang không chỉ đổi diện mạo mà **cộng thêm chỉ số** (% HP, % Sức đánh, % Chí mạng). Cosmetic sự kiện (Halloween, Tết) tạo ra cảm giác FOMO.

**💡 Ý tưởng — Hệ Thánh Phục:**

```
Hệ Thánh Phục (Cosmetic + Chỉ Số):
├── Thánh Phục = skin thay thế skin mặc định
├── Mỗi Thánh Phục có passive nhỏ (+2-5% một chỉ số)
│    → Không OP, nhưng có giá trị → người chơi muốn sưu tập
├── Nguồn:
│    Sự kiện lễ tết (độc quyền, không bao giờ mở lại)
│    Boss Thế Giới (drop ngẫu nhiên cực hiếm)
│    Donate (Tiên Tinh)
└── Thánh Phục Tộc: skin đặc trưng của tộc — nhìn là biết tộc gì
```

---

### 22.10 Tổng Kết — Những Gì NRO Làm Đúng Cần Giữ Nguyên

| Cơ chế NRO | Lý do thành công | Áp dụng vào server |
|---|---|---|
| 3 tộc không thể thay thế | Buộc hợp tác, PvP đa dạng | ✅ Đã có — cần đảm bảo balance |
| RNG kỹ năng đệ tử | Hook nghiện cực mạnh, tạo drama | ✅ Thêm vào hệ đệ tử |
| Sao Pha Lê 6 loại | Vi mô hóa build, cá nhân hóa | ✅ Hệ Tinh Thạch |
| SKH kích hoạt theo bộ | Endgame mục tiêu rõ ràng | ✅ Hệ Linh Giáp |
| Boss tích lũy (Super Broly) | Sự kiện cộng đồng, drama | ✅ Boss Tích Lũy |
| Bản Đồ Kho Báu | Nguồn farm kinh tế ổn định | ✅ Phó bản Kho Báu |
| Đại Hội Võ Thuật | PvP có ý nghĩa, quest bắt buộc | ✅ Đấu Trường Thiên Đỉnh |
| 3 tầng tiền tệ + Thỏi Vàng | Kinh tế bền vững, chống lạm phát | ✅ Thêm Linh Phiếu |
| Tái Chế SKH 100% | Tâm lý an toàn khi đầu tư | ✅ Tái Chế Linh Giáp 70% |
| Cải trang có chỉ số nhỏ | Cosmetic có giá trị thực | ✅ Hệ Thánh Phục |

---

### 22.11 Những Gì NRO Làm CHƯA TỐT — Cơ Hội Cải Thiện

| Vấn đề NRO | Cách server ta làm tốt hơn |
|---|---|
| Pay-to-win rõ ràng (Ngọc VIP) | Donate chỉ cosmetic + tiện ích, KHÔNG tăng sức mạnh trực tiếp |
| Tool/auto tràn lan | Cơ chế chống AFK thông minh (Captcha nhẹ, giới hạn Linh Giới) |
| Số sức mạnh quá lớn (tỷ, nghìn tỷ) | Dùng hệ thống Mốc trực quan hơn số tiềm năng thô |
| Không có nội dung nhóm 3-5 người ở giai đoạn đầu | Phó bản đội mở từ Mốc 2 — không chỉ endgame |
| PvP thiếu công bằng (full VIP thắng tuyệt đối) | ELO matching + giải đấu chia tier theo mốc |
| Map tĩnh, thiếu khám phá | NPC ẩn, quest bí ẩn, tọa độ bí mật cần khám phá |


---

## 23. Quyết Định Đã Chốt — Câu Hỏi Còn Mở *(Cập nhật 15/09/2026)*

> Phần này đóng các câu hỏi từ Section 20 sau buổi brainstorm.

---

### ✅ Linh Giới (AFK EXP)
- **Cơ chế:** Treo MIỄN PHÍ, không giới hạn thời gian
- **Đánh đổi:** EXP thấp hơn đáng kể so với farm quái thực
- **Mục đích:** Cho phép người chơi offline vẫn tiến độ, nhưng không thể thay thế active farming
- **Vùng:** An toàn, không PvP, không quái

### ✅ Tàu Vũ Trụ (Du Hành Hành Tinh)
- **Cơ chế:** Teleport TỨC THÌN, MIỄN PHÍ hoàn toàn
- **Điều kiện:** Phải đến Bãi Tàu của hành tinh mình → chọn điểm đến
- **Cooldown:** Không có (hoặc rất ngắn — 10-30 giây, cân nhắc sau)
- **Lý do:** Không muốn barrier di chuyển làm khó người chơi mới

### ✅ PvP Trên Hành Tinh Khác Tộc
- **Cơ chế:** Bật theo CỜ — giống hành tinh của tộc mình
- **Tức là:** Sang hành tinh tộc khác, mặc định an toàn, muốn PvP phải bật cờ
- **Ngoại lệ:** RTP World — PvP tự do không cần cờ

### ✅ Drop Đồ Từ Quái
- **Cơ chế:** Grace Period 30 giây
  - 0-30 giây sau khi quái chết: CHỈ người kill mới lượm được
  - Sau 30 giây: Ai cũng lượm được (tự do)
- **Lý do:** Tránh kill-steal đồ nhưng không khóa hoàn toàn (tránh đồ bị bỏ phí)

### ✅ Phó Bản Giới Hạn
- **Số lượt:** 2 lượt/ngày (giống NRO)
- **Reset:** 0:00 mỗi ngày
- **Áp dụng cho:** Phó bản đội và Phó bản Thử Thách Tốc Độ

### ✅ NPC Hội Thoại
- **Giải pháp:** Citizens (quản lý NPC) + Denizen (scripting hội thoại)
- **Lý do:** Plugin nổi tiếng, nhiều tính năng, cộng đồng hỗ trợ tốt, tiết kiệm thời gian code

### ✅ Auction House
- **Giải pháp:** Dùng plugin có sẵn (AuctionHouse plugin phổ biến trên Spigot/Paper)
- **Lý do:** Không cần tự build, tập trung vào core gameplay

### ⏳ Tên Server Chính Thức
- **Trạng thái:** Chưa chốt — để sau
- **Tên thế giới hiện tại:** *Tam Cược*

### ⏳ Tên 3 Hành Tinh Tộc
- **Trạng thái:** Dùng tạm tên tộc — đặt tên chính thức sau
  - Hành tinh Thiên Phong (tạm)
  - Hành tinh Âm Mộc (tạm)
  - Hành tinh Hỏa Hắc (tạm)


---

## 24. Bảng Tiến Độ Lên Kế Hoạch *(Master Checklist)*

> Đây là bảng theo dõi toàn bộ tiến độ GDD — cập nhật theo thời gian thực.
> **Trạng thái:** ✅ Xong | 🔶 Một phần | ❌ Chưa làm

---

### PHASE 0 — LÊN KẾ HOẠCH (GDD)

#### Thiết Kế Hệ Thống Cốt Lõi
| # | Hạng mục | Trạng thái | Mục GDD |
|---|---|---|---|
| 1 | Tầm nhìn sản phẩm & so sánh NRO | ✅ | Mục 1 |
| 2 | Hệ 3 Tộc (định hướng, kỹ năng, stat) | ✅ | Mục 2, 3 |
| 3 | Hệ Tiềm Năng (SD/HP/KI) | ✅ | Mục 4 |
| 4 | Hệ Mốc Phá Giới (7 mốc) + Thức Tỉnh | ✅ | Mục 5 |
| 5 | Hệ Mob & Boss (Vùng + Thế Giới) | ✅ | Mục 6 |
| 6 | Hệ Trang Bị Ép Sao (1★→7★) | ✅ | Mục 7 |
| 7 | Hệ Nhiệm Vụ (Main/Daily/Guild/Ẩn) | ✅ | Mục 8, 21.4 |
| 8 | Hệ Đệ Tử (thu phục, kỹ năng, hợp thể) | 🔶 | Mục 9, 22.2 |
| 9 | Hệ Cờ PvP (5 màu cờ) | ✅ | Mục 10 |
| 10 | Hệ Tông Môn (Bang Hội) | 🔶 | Mục 11 |
| 11 | Thiết kế Map & Thế Giới (5 world) | 🔶 | Mục 12, 21.8 |
| 12 | Kinh Tế & Donate | ✅ | Mục 13, 21.10 |
| 13 | Chi phí vận hành | ✅ | Mục 14 |
| 14 | Roadmap 4 Phase | ✅ | Mục 15 |

#### Thiết Kế Gameplay Flow (Chi Tiết Thực Tế)
| # | Hạng mục | Trạng thái | Mục GDD |
|---|---|---|---|
| 15 | Luồng tạo tài khoản + chọn tộc | ✅ | Mục 21.1 |
| 16 | Trải nghiệm tân thủ (spawn, Trưởng Lão, trang bị) | ✅ | Mục 21.2 |
| 17 | Hệ NPC & Hội Thoại (Citizens+Denizen) | ✅ | Mục 21.3, 23 |
| 18 | Cấu trúc nhiệm vụ tân thủ | ✅ | Mục 21.4 |
| 19 | Cơ chế Boss (phase, AoE, minion) | ✅ | Mục 21.5 |
| 20 | Phó bản (2 lượt/ngày, loot tốt hơn) | ✅ | Mục 21.6, 23 |
| 21 | Hệ EXP (farm quái + Linh Giới AFK) | ✅ | Mục 21.7, 23 |
| 22 | Cấu trúc thế giới (3 hành tinh + Spawn + RTP + Linh Giới) | ✅ | Mục 21.8 |
| 23 | Cơ chế Tàu Vũ Trụ (teleport miễn phí) | ✅ | Mục 23 |
| 24 | Hệ PvP & Cờ (vùng, cơ chế chết, Xuất Hồn) | ✅ | Mục 21.9 |
| 25 | Kinh tế (Shop+AH plugin+/trade+drop grace 30s) | ✅ | Mục 21.10, 23 |

#### Thiết Kế Hệ Thống Mới (Từ Phân Tích NRO)
| # | Hạng mục | Trạng thái | Mục GDD |
|---|---|---|---|
| 26 | Hệ Tinh Thạch (thay Sao Pha Lê NRO) | 🔶 Ý tưởng | Mục 22.3 |
| 27 | Hệ Linh Giáp (thay SKH NRO) | 🔶 Ý tưởng | Mục 22.4 |
| 28 | Boss Tích Lũy (như Super Broly) | 🔶 Ý tưởng | Mục 22.5 |
| 29 | Phó bản Kho Báu (mê cung random) | 🔶 Ý tưởng | Mục 22.7 |
| 30 | Đấu Trường Thiên Đỉnh (PvP ELO) | 🔶 Ý tưởng | Mục 22.8 |
| 31 | Hệ Thánh Phục (Cosmetic + passive nhỏ) | 🔶 Ý tưởng | Mục 22.9 |

#### Chưa Thiết Kế
| # | Hạng mục | Trạng thái | Ghi chú |
|---|---|---|---|
| 32 | Tên server chính thức | ❌ | Để sau |
| 33 | Tên 3 hành tinh tộc | ❌ | Để sau |
| 34 | Nội dung Quest cụ thể (lời thoại NPC, tên quest) | ❌ | Cần Designer + Lore writer |
| 35 | Bản đồ chi tiết từng hành tinh (khu vực, tọa độ) | ❌ | Cần Designer xây map |
| 36 | Balance kỹ năng (số liệu cụ thể: damage, cooldown) | ❌ | Cần playtesting |
| 37 | Hệ Đấu Trường Xếp Hạng (chi tiết ELO) | ❌ | Phase 3 |
| 38 | Hệ Linh Thú (pet chiến đấu) | ❌ | Phase 4 |
| 39 | Hệ Đạo Lữ (kết đôi) | ❌ | Phase 4 |
| 40 | Sự kiện định kỳ (lễ tết, boss tuần) | ❌ | Sau Launch |
| 41 | Website + Wiki | ❌ | Phase 3 |
| 42 | Hệ thống nạp tiền (cổng thanh toán) | ❌ | Phase 1 cuối |

---

### PHASE 1 — ALPHA CORE (Coder bắt đầu)

*Theo Roadmap mục 15 và 18.4:*

| Tuần | Hạng mục | Trạng thái |
|---|---|---|
| 1-2 | PlayerData + DatabaseManager (MySQL) | ❌ |
| 3-4 | TocSystem (3 tộc, stat modifier, chọn tộc) | ❌ |
| 5-6 | TiemNangSystem + GUI phân bổ SD/HP/KI | ❌ |
| 7-8 | Custom Damage System | ❌ |
| 9-10 | KyNangSystem: 3 chiêu đầu mỗi tộc | ❌ |
| 11 | ThucTinhSystem (Hỏa Hắc biến hình) | ❌ |
| 12-13 | PhaGiaiSystem: 3 mốc đầu | ❌ |
| 14-15 | TrangBiSystem: slot + khóa tộc + ép sao | ❌ |
| 16 | CoPvPSystem | ❌ |
| 17-18 | Multi-world (2 world + cổng teleport) | ❌ |
| 19-20 | Nhiệm vụ tân thủ 5 quest + NPC cơ bản | ❌ |
| 21-22 | Rank Donate + cổng nạp test | ❌ |
| 23-24 | Bug fix, balance, test nội bộ | ❌ |

---

### NHỮNG GÌ CẦN LÀM TIẾP THEO (Ưu tiên theo thứ tự)

```
🔥 NGAY BÂY GIỜ (GDD còn thiếu — cần trước khi code):
   1. Thiết kế chi tiết Hệ Đệ Tử (RNG kỹ năng, cách nuôi)
   2. Thiết kế chi tiết Hệ Tinh Thạch (6 loại, cơ chế gắn)
   3. Thiết kế chi tiết Hệ Linh Giáp (Endgame trang bị)
   4. Balance số liệu kỹ năng (damage %, cooldown, KI cost)
   5. Tên hành tinh + tên server

📋 KHI CÓ DESIGNER:
   6. Bản đồ chi tiết từng hành tinh (khu vực, tọa độ spawn)
   7. Nội dung lore + lời thoại NPC + tên quest cụ thể
   8. Thiết kế visual (aura, particle theo mốc)

💻 KHI BẮT ĐẦU CODE:
   9. DB Schema hoàn chỉnh (bổ sung từ các hệ mới)
  10. Plugin list + dependencies đầy đủ
  11. Discord Bot tạo tài khoản (song song với MC server)
```


---

## 25. Hệ Đệ Tử — Thiết Kế Chi Tiết *(Cập nhật 15/09/2026)*

> Thay thế & mở rộng mục 9 (Hệ Đệ Tử cũ). Đây là phiên bản thiết kế chính thức.

---

### 25.1 Phân Loại Đệ Tử — 7 Hệ

Chia thành **2 nhóm rõ ràng: Cơ Bản và Đặc Biệt**.

#### Nhóm 1 — Đệ Tử Cơ Bản (3 hệ)

| Hệ Đệ Tử | Tương đương tộc | Cách sở hữu | Ghi chú |
|---|---|---|---|
| ⚡ **Hệ Thiên Phong** (Trái Đất) | Tộc Thiên Phong | Random drop — Last Hit Boss Tích Lũy (Super Broly) | Rơi ngẫu nhiên 1 trong 3 hệ |
| 🌿 **Hệ Âm Mộc** (Namek) | Tộc Âm Mộc | Random drop — Last Hit Boss Tích Lũy (Super Broly) | Rơi ngẫu nhiên 1 trong 3 hệ |
| 🔥 **Hệ Hỏa Hắc** (Xayda) | Tộc Hỏa Hắc | Random drop — Last Hit Boss Tích Lũy (Super Broly) | Rơi ngẫu nhiên 1 trong 3 hệ |

#### Nhóm 2 — Đệ Tử Đặc Biệt (4 hệ)

| Hệ Đệ Tử | Cách sở hữu | Ưu điểm |
|---|---|---|
| 🌀 **Mabu** | Boss Đặc Biệt hoặc Donate | Chỉ số cao hơn hẳn đệ tử cơ bản |
| 👊 **Ubu** | Boss Đặc Biệt hoặc Donate | Chỉ số cao hơn hẳn đệ tử cơ bản |
| ⚡ **Kid Jiren** | Boss Đặc Biệt hoặc Donate | Chỉ số cao hơn hẳn đệ tử cơ bản |
| 🐱 **Kid Beerus** | Boss Đặc Biệt hoặc Donate | Chỉ số cao hơn hẳn đệ tử cơ bản |

> 💡 **Boss Đặc Biệt** để spawn đệ tử hiếm: cơ chế KS (ai Last Hit được boss này thì nhận đệ tử). Tạo drama cạnh tranh cực cao — toàn server tập hợp tranh đoạt.

---

### 25.2 Chỉ Số Đệ Tử — Hệ Ngẫu Nhiên (Cơ Bản)

**Đệ tử cơ bản KHÔNG có chỉ số cố định** — dao động trong khoảng cho phép khi sinh ra:

```
Ví dụ Đệ Tử Hệ Thiên Phong:
  SD: [800 - 1500]   → Con yếu: 800 | Con mạnh: 1500
  HP: [500 - 900]
  KI: [300 - 600]

→ Tạo ra giá trị "con ngon / con dở" trên Auction House
→ Người chơi hunt Boss Tích Lũy nhiều lần để tìm con chỉ số cao
→ Trao đổi đệ tử con mạnh = nguồn kinh tế tự nhiên
```

**Đệ tử Đặc Biệt:** Chỉ số CỐ ĐỊNH, cao hơn hẳn ngưỡng tối đa của đệ tử cơ bản.

> ❓ *(Để sau: số liệu cụ thể — cần playtesting để balance)*

---

### 25.3 Trang Bị Đệ Tử — Khóa Theo Hệ

| Nhóm | Có thể mặc |
|---|---|
| **3 Hệ Cơ Bản** | Chỉ mặc được trang bị của **hành tinh tương ứng** (cùng tộc) |
| **4 Hệ Đặc Biệt** | Mặc được **bất kỳ trang bị nào** — không khóa hành tinh |

**Ví dụ:**
- Đệ tử Hệ Âm Mộc → chỉ mặc đồ Lục Mộc hoặc Trung Lập
- Đệ tử Kid Beerus → mặc được Thiên Đạo, Lục Mộc, Hỏa Hắc, Trung Lập — tất cả

> 💡 Đây là một phần lý do đệ tử Đặc Biệt mạnh hơn — ngoài chỉ số cao, còn được mặc đồ tốt nhất không giới hạn tộc.

---

### 25.4 Cơ Chế Bỏ / Thay Đệ Tử

**Tùy tộc của NGƯỜI CHƠI** (không phải hệ đệ tử):

| Tộc Người Chơi | Cách bỏ đệ tử cũ |
|---|---|
| 🌿 **Tộc Âm Mộc** | **Hợp Thể Vĩnh Viễn** — đệ tử cũ hòa vào người chơi vĩnh viễn, nhận buff nhỏ (passive), sau đó thu phục đệ tử mới tự do |
| ⚡ **Tộc Thiên Phong** | Mua vật phẩm **"Giải Phóng Đệ Tử"** tại Shop NPC → dùng lên đệ tử để bỏ |
| 🔥 **Tộc Hỏa Hắc** | Mua vật phẩm **"Giải Phóng Đệ Tử"** tại Shop NPC → dùng lên đệ tử để bỏ |

**Chi tiết Hợp Thể Vĩnh Viễn (Âm Mộc):**
- Đệ tử biến mất hoàn toàn (không thể lấy lại)
- Người chơi nhận **1 passive nhỏ** từ đệ tử đó (ví dụ: +2% HP tối đa vĩnh viễn)
- Passive tích lũy theo số lần hợp thể → Khuyến khích Âm Mộc hunt đệ tử nhiều lần
- Người chơi Âm Mộc có thể thu phục đệ tử mới ngay sau đó

> 🎯 **Thiết kế ý đồ:** Cơ chế Hợp Thể Vĩnh Viễn của Âm Mộc tạo ra **vòng lặp farming đệ tử độc đáo** riêng tộc này — giúp phân biệt rõ hơn phong cách chơi 3 tộc.

---

### 25.5 Cơ Chế Lấy Đệ Tử Cơ Bản — Boss Tích Lũy

```
Boss Tích Lũy xuất hiện (thông báo toàn server)
    → Toàn server kéo đến đánh
    → Boss tích lũy qua 3 giai đoạn khi nhận đủ sát thương
    → Giai đoạn 3 (biến hình hoàn toàn):
         Last Hit → nhận 1 Đệ Tử Cơ Bản ngẫu nhiên (Thiên Phong/Âm Mộc/Hỏa Hắc)
         Chỉ số đệ tử: NGẪU NHIÊN trong khoảng của hệ đó
    → Ngoài Last Hit: loot thường chia theo % damage (Bí Kíp, đá nâng cấp...)
```

> ⚠️ Tỉ lệ hệ đệ tử nào rơi có thể cân bằng hoặc ngẫu nhiên đều — cần test.

---

### 25.6 Cơ Chế Lấy Đệ Tử Đặc Biệt — Boss Đặc Biệt

```
Boss Đặc Biệt (spawn theo lịch hoặc sự kiện):
    → Mỗi Boss Đặc Biệt drop đúng 1 loại đệ tử cố định
       Ví dụ: Boss X → Last Hit → Đệ Tử Kid Jiren
    → Boss Đặc Biệt khó hơn Boss Tích Lũy nhiều lần
    → KS tranh đoạt = drama cực cao

Ngoài ra: Donate bằng Tiên Tinh tại NPC → mua trực tiếp Đệ Tử Đặc Biệt
    (Cân nhắc: có nên cho donate mua không? Tạo P2W nhẹ nhưng là nguồn thu)
```

---

### 25.7 Tóm Tắt So Sánh 2 Nhóm Đệ Tử

| Tiêu chí | Đệ Tử Cơ Bản (3 hệ) | Đệ Tử Đặc Biệt (4 hệ) |
|---|---|---|
| Chỉ số | Ngẫu nhiên trong khoảng | Cố định, cao hơn hẳn |
| Trang bị | Khóa hành tinh tương ứng | Mặc tất cả |
| Cách lấy | Last Hit Boss Tích Lũy | Boss Đặc Biệt / Donate |
| Độ hiếm | Phổ thông (ai cũng có thể có) | Hiếm (kỹ năng + may mắn/tiền) |
| Giao dịch | Bán/mua được (con mạnh = đắt) | Bán/mua được (giá cao hơn nhiều) |

---

### 25.8 Câu Hỏi Còn Mở — Hệ Đệ Tử

- [ ] **Passive Hợp Thể Vĩnh Viễn (Âm Mộc):** Tích lũy tối đa bao nhiêu lần? Passive gì?
- [ ] **Giải Phóng Đệ Tử (Thiên Phong/Hỏa Hắc):** Giá bao nhiêu Đồng Linh?
- [ ] **Khoảng chỉ số đệ tử cơ bản:** Số liệu cụ thể (để sau — cần test)
- [ ] **Boss Đặc Biệt**: 4 boss cho 4 hệ đặc biệt — tên và cơ chế?
- [ ] **Donate đệ tử đặc biệt:** Có cho phép không? Giá bao nhiêu?
- [ ] **Số lượng đệ tử tối đa:** Mỗi người chơi mang theo mấy con cùng lúc?
- [ ] **Kỹ năng đệ tử:** RNG như NRO hay cố định theo hệ? (Chưa chốt)


---

## 26. Thiết Kế Hành Tinh — Khu Vực & Di Chuyển *(Cập nhật 15/09/2026)*

---

### 26.1 Theme Môi Trường — 3 Hành Tinh Có Phong Cảnh Riêng

| Hành Tinh | Tộc | Theme | Phong cảnh đặc trưng |
|---|---|---|---|
| **Hành Tinh Thiên Phong** | Tộc Thiên Phong | ⚡ Sấm sét, bầu trời bão | Đá xanh xám, tia sét, mây dông, đỉnh núi cao |
| **Hành Tinh Âm Mộc** | Tộc Âm Mộc | 🌿 Rừng xanh, linh khí | Rừng cổ thụ, ao hồ xanh biếc, sương mù nhẹ, cây khổng lồ |
| **Hành Tinh Hỏa Hắc** | Tộc Hỏa Hắc | 🔥 Núi lửa, dung nham | Đá đỏ đen, dòng dung nham, bầu trời cam đỏ, núi lửa phun |

> 💡 Designer: Mỗi hành tinh cần có **1 landmark nổi bật** dễ nhận ra trong screenshot (ví dụ: Cột Sét Khổng Lồ, Cây Thần Linh, Núi Lửa Trung Tâm).

---

### 26.2 Cấu Trúc Hành Tinh — Layout Tổng Thể

**Mỗi hành tinh theo mô hình: 1 Thị Trấn Trung Tâm → Bãi Farm Tỏa Ra**

```
         [Thị Trấn Trung Tâm]
         (An toàn, NPC, Shop)
              /    |    \
       Vùng 1   Vùng 2   Vùng 3
      (Mob yếu) (Mob tb) (Mob mạnh)
           |        |        |
       Cổng Biên  Cổng Biên  Vùng Nguy Hiểm
       Giới →    Giới →     (Mob elite)
       Vùng 2    Vùng 3
                              |
                         [Bãi Tàu Vũ Trụ]
                         (Rìa hành tinh)
```

**Triết lý thiết kế bản đồ:** Người chơi KHÔNG teleport thẳng đến bãi farm cao — phải đi bộ/bay qua vùng thấp hơn để đến vùng cao hơn. Tạo sự nhộn nhịp trên đường đi.

---

### 26.3 Hệ Thống Di Chuyển Trong Hành Tinh

#### Cơ Chế 1: Cổng Biên Giới (Chính)

```
Người chơi chạy đến rìa bản đồ Vùng X
    → Gặp "Cổng Biên Giới" (particle effect / sương mù đặc)
    → Chạm vào → chuyển sang Vùng X+1
    → Không cần teleport, không tốn gì
```

- Tạo trải nghiệm khám phá liên tục như NRO
- Buộc người chơi đi qua vùng thấp → gặp người khác → PvP tự nhiên (nếu bật cờ)
- Cổng một chiều hoặc hai chiều *(cần cân nhắc)*

#### Cơ Chế 2: Ngự Khí Bay Lượn (Dùng KI)

```
Người chơi Double Jump (nhảy 2 lần liên tiếp)
    → Vào chế độ BAY (Fly)
    → Tiêu thụ KI mỗi giây khi duy trì bay
    → Hết KI → tự động rơi xuống đất
```

**Ưu điểm:**
- Khuyến khích đầu tư điểm tiềm năng vào KI (bay xa + dùng chiêu)
- Cảm giác bay + tung chiêu từ trên không xuống quái rất đúng chất NRO
- Tạo sự khác biệt giữa người chơi KI cao và thấp

**Đặc quyền Rank Donate "Anh Hùng":**
- Bay miễn phí KI trong khu vực **Thị Trấn** (không tốn KI khi ở vùng an toàn)
- Vùng farm vẫn tốn KI bình thường

#### Cơ Chế 3: Capsule Dịch Chuyển (Vật Phẩm)

| Loại Capsule | Công dụng | Cách lấy |
|---|---|---|
| **Capsule Trở Về** | Dùng 1 lần → niệm chú 3 giây → về Spawn hành tinh hiện tại | Mua bằng Đồng Linh tại Shop |
| **Capsule Cột Mốc** | Lưu vị trí khu vực đã khám phá → teleport đến đó bất kỳ lúc nào | Mua bằng Linh Thạch |

**Cột Mốc hoạt động:**
```
Lần đầu người chơi bước vào khu vực mới
    → Hệ thống tự động lưu "Cột Mốc: [Tên Khu Vực]"
    → Dùng Capsule Cột Mốc → mở GUI chọn điểm đến đã lưu
    → Teleport ngay (không cần 3 giây)
```

#### Cơ Chế 4: Thú Cưỡi *(Post-Launch)*
- Tăng tốc độ di chuyển trên mặt đất
- Cosmetic chủ yếu, một số loại có passive nhỏ
- Thiết kế chi tiết sau Launch

---

### 26.4 Các Khu Vực Trong Mỗi Hành Tinh

#### Khu Vực 1 — Thị Trấn Trung Tâm (Vùng An Toàn)
```
├── Quảng Trường Trung Tâm   → Spawn point, bảng thông báo server
├── Nhà Trưởng Lão           → NPC Quest chính (chuỗi nhiệm vụ tộc)
├── Khu NPC Shop             → Shop đồ, Luyện Rèn, Auction House
├── Đấu Trường Nội Hành Tinh → PvP friendly (không mất gì), 1v1 tự do
├── Bãi Tàu Vũ Trụ           → Portal sang hành tinh khác (rìa thị trấn)
└── NPC Ẩn rải rác           → Quest phụ bí ẩn, phải tự tìm
```

#### Khu Vực 2 — Bãi Farm Sơ Cấp (Mob Yếu)
```
├── Mob cấp thấp (Mốc 1-2)
├── Boss Vùng spawn ngẫu nhiên ở đây
└── Cổng Biên Giới → Bãi Farm Trung Cấp
```

#### Khu Vực 3 — Bãi Farm Trung Cấp (Mob Trung Bình)
```
├── Mob cấp trung (Mốc 2-3)
├── Loot tốt hơn Bãi Farm Sơ Cấp
└── Cổng Biên Giới → Vùng Nguy Hiểm Cao
```

#### Khu Vực 4 — Vùng Nguy Hiểm Cao (Mob Elite)
```
├── Mob mạnh nhất hành tinh (Mốc 3-4)
├── Loot hiếm, nguyên liệu craft cao cấp
├── PvP căng thẳng nhất (nhiều người bật cờ ở đây)
└── Boss Thế Giới có thể xuất hiện ở đây
```

#### Khu Vực 5 — Thánh Địa AFK *(Đặc biệt — chỉ Hành Tinh Âm Mộc)*

> 🌿 **Thánh Địa AFK chỉ tồn tại trên Hành Tinh Âm Mộc** và chỉ mở ra khi hoàn thành nhiệm vụ được chỉ định.

```
Điều kiện mở: Hoàn thành chuỗi nhiệm vụ "Nguồn Gốc Xanh Lá" của Âm Mộc
    → NPC Trưởng Lão mở khóa Thánh Địa
    → Người chơi bất kỳ tộc nào cũng có thể vào (nếu được dẫn vào)
    → EXP AFK tại đây cao hơn hẳn Linh Giới thông thường
    → Nhưng: người chơi phải ở TRÊN Hành Tinh Âm Mộc (không offline được)
```

**Lý do thiết kế:**
- Tạo **lý do để tộc khác qua hành tinh Âm Mộc** → hành tinh nhộn nhịp hơn
- Âm Mộc có đặc quyền mở Thánh Địa → tăng giá trị tộc support
- Cơ hội PvP / hợp tác giữa các tộc tại vùng trung lập này

---

### 26.5 Sơ Đồ Chi Tiết — Hành Tinh Thiên Phong (Mẫu)

```
╔══════════════════════════════════════════════════════╗
║          HÀNH TINH THIÊN PHONG — Theme: Sấm Sét     ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  [Đài Sét Trung Tâm]          NPC ẩn: Đạo Sư       ║
║  Thị Trấn — PvP tắt           bí ẩn rải rác        ║
║  • Trưởng Lão Thiên Phong                            ║
║  • Shop / Luyện Rèn                                  ║
║  • Bãi Tàu Vũ Trụ (rìa thị trấn)                   ║
║                                                      ║
║  ←Cổng Biên→  [Đồng Bằng Lôi Điện]   →Cổng Biên→  ║
║               Mob Mốc 1-2                            ║
║               Boss Vùng: random                     ║
║                                                      ║
║              ↓ Cổng Biên Giới                       ║
║                                                      ║
║           [Vách Núi Sấm]                            ║
║           Mob Mốc 2-3                               ║
║           Loot nguyên liệu tốt hơn                  ║
║                                                      ║
║              ↓ Cổng Biên Giới                       ║
║                                                      ║
║        [Đỉnh Thiên Lôi] — Vùng Elite               ║
║        Mob Mốc 3-4 | Loot hiếm                      ║
║        Boss Thế Giới có thể spawn ở đây             ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

### 26.6 Sơ Đồ Chi Tiết — Hành Tinh Âm Mộc (Mẫu)

```
╔══════════════════════════════════════════════════════╗
║         HÀNH TINH ÂM MỘC — Theme: Rừng Xanh        ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  [Làng Cổ Thụ]                                      ║
║  Thị Trấn — PvP tắt                                 ║
║  • Trưởng Lão Âm Mộc (mở quest Thánh Địa)          ║
║  • Shop / Luyện Rèn                                  ║
║  • Bãi Tàu Vũ Trụ (rìa làng)                       ║
║                                                      ║
║  ←Cổng→  [Rừng Linh Thảo]  →Cổng→                  ║
║           Mob Mốc 1-2                               ║
║                                                      ║
║              ↓ Cổng                                 ║
║                                                      ║
║           [Hang Sâu Linh Mộc]                       ║
║           Mob Mốc 2-3                               ║
║                                                      ║
║              ↓ Cổng                                 ║
║                                                      ║
║        [Vùng Rễ Thần] — Elite                       ║
║        Mob Mốc 3-4 | Boss Thế Giới                 ║
║                                                      ║
║  ════════════════════════════════                    ║
║  [✨ THÁNH ĐỊA] — Mở sau quest                     ║
║  AFK EXP > Linh Giới | Cần online                  ║
║  Mọi tộc vào được | Không PvP                       ║
╚══════════════════════════════════════════════════════╝
```

---

### 26.7 Câu Hỏi Còn Mở — Hành Tinh

- [ ] **Cổng Biên Giới**: một chiều (chỉ đi tiếp) hay hai chiều (có thể quay lại)?
- [ ] **Capsule Trở Về**: giá bao nhiêu Đồng Linh?
- [ ] **Capsule Cột Mốc**: giá bao nhiêu Linh Thạch? Lưu tối đa bao nhiêu cột mốc?
- [ ] **Bay (KI)**: tiêu thụ bao nhiêu KI/giây? (cần test)
- [ ] **Thánh Địa Âm Mộc**: nhiệm vụ mở cụ thể là gì?
- [ ] **Đấu Trường Nội Hành Tinh**: có thứ hạng riêng không hay chỉ friendly?
- [ ] **Hành Tinh Hỏa Hắc**: có khu vực đặc biệt riêng không (như Thánh Địa của Âm Mộc)?
- [ ] **Hành Tinh Thiên Phong**: có khu vực đặc biệt riêng không?
