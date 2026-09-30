# 🌟 Hành Trình Người Chơi Mới — Từ Bước Chân Đầu Tiên

> **Phiên bản:** 1.0 — 15/09/2026
> **Mục đích:** Thiết kế chi tiết trải nghiệm từ lúc join server đến khi hoàn thành mốc Phá Giới đầu tiên (Mốc 1 → 2)
> **Tham chiếu GDD:** Mục 21, 23, 25, 26

---

## 📍 Tổng Quan Hành Trình

```
[JOIN SERVER]
    ↓
[SPAWN TỔNG — Thành Tam Cược]
    ↓
[NPC Thượng Đế → CHỌN TỘC]
    ↓
[TELEPORT → HÀNH TINH TỘC]
    ↓
[Gặp TRƯỞNG LÃO → Nhận Quest 1]
    ↓
[Làm 5 Quest Tân Thủ]
    ↓
[Phá Giới Mốc 1 → Mốc 2: Giác Tỉnh I]
    ↓
[Mở khu vực mới + Kỹ năng mới]
```

---

## 🏙️ BƯỚC 1 — Spawn Tổng (Thành Tam Cược)

### Người chơi thấy gì đầu tiên?
- Spawn tại **Quảng Trường Trung Tâm** của Thành Tam Cược
- Xung quanh: nhiều NPC, người chơi khác đi lại, bảng thông báo server
- Bầu không khí: nhộn nhịp, có hướng dẫn cơ bản trên bảng thông báo

### Điều đầu tiên cần làm:
> Hệ thống hiện tin nhắn chào mừng trong chat:
> *"Chào mừng đến với [Tên Server]! Hãy tìm NPC Thượng Đế tại trung tâm quảng trường để bắt đầu hành trình."*

### Khu vực Spawn Tổng có gì:
| Địa điểm | Mô tả |
|---|---|
| NPC Thượng Đế | Trung tâm quảng trường — **BƯỚC ĐẦU TIÊN** |
| Bảng Thông Báo | Tin tức server, sự kiện, top bảng xếp hạng |
| Shop Tổng | Bán đồ cơ bản, vật phẩm tiêu hao |
| Auction House | Giao dịch giữa người chơi |
| Cổng Teleport | Đến RTP World (PvP tự do) |

---

## 🌌 BƯỚC 2 — Gặp NPC Thượng Đế & Chọn Tộc

### Tương tác với NPC Thượng Đế:
1. Người chơi **right-click** vào NPC Thượng Đế
2. NPC nói chuyện qua **thanh chat** (lời thoại lore):

```
[Thượng Đế]: "Người lữ hành từ phương xa... Ta cảm nhận được
              tiềm năng vô hạn trong ngươi.
              Ba tộc người đang chờ đợi ngươi lựa chọn.
              Hãy suy nghĩ kỹ — quyết định này không thể thay đổi."

[Thượng Đế]: "Ngươi muốn tìm hiểu về các tộc không?"
              [1] Thiên Phong   [2] Âm Mộc   [3] Hỏa Hắc   [4] Chọn Tộc
```

3. GUI hiện ra — người chơi click item để xem thông tin từng tộc:

### GUI Chọn Tộc:
```
┌─────────────────────────────────────────────────┐
│                  CHỌN TỘC CỦA BẠN               │
├──────────────┬──────────────┬───────────────────┤
│ ⚡ THIÊN PHONG│ 🌿 ÂM MỘC   │ 🔥 HỎA HẮC        │
│              │              │                   │
│ Sát thương   │ Hỗ trợ &    │ Công thủ          │
│ bùng nổ      │ Hồi phục    │ toàn diện         │
│              │              │                   │
│ Khó chơi     │ Trung bình   │ Dễ chơi nhất      │
│ Mạnh PvP 1v1 │ Mạnh đội     │ Tốt solo          │
│              │              │                   │
│ [XEM CHI TIẾT] [XEM CHI TIẾT] [XEM CHI TIẾT]   │
│                                                 │
│           ⚠️ KHÔNG THỂ ĐỔI TỘC SAU KHI CHỌN   │
│                                                 │
│  [CHỌN THIÊN PHONG] [CHỌN ÂM MỘC] [CHỌN HỎA HẮC]│
└─────────────────────────────────────────────────┘
```

4. Người chơi click chọn → GUI xác nhận lần cuối:
```
⚠️ XÁC NHẬN: Bạn chắc chắn muốn chọn Tộc [X]?
   Quyết định này VĨNH VIỄN không thể thay đổi!

   [✅ XÁC NHẬN]    [❌ QUAY LẠI]
```

5. Sau khi xác nhận → **Teleport ngay đến Hành Tinh Tộc**

---

## 🌍 BƯỚC 3 — Đến Hành Tinh Tộc & Gặp Trưởng Lão

### Màn hình loading / hiệu ứng chuyển cảnh:
> Particle effect đặc trưng tộc bao phủ màn hình → fade vào hành tinh mới

### Người chơi spawn tại đâu?
- Khu vực **Thị Trấn Trung Tâm** của hành tinh tộc mình
- Spawn ngay trước cửa **NPC Trưởng Lão**
- Tin nhắn trong chat:
> *"Bạn đã đến [Tên Hành Tinh]. Hãy nói chuyện với Trưởng Lão để bắt đầu hành trình!"*

### Tương tác Trưởng Lão:
```
[Trưởng Lão Thiên Phong]: "Đứa trẻ... Ngươi đã đến đây.
   Ta đã chờ ngươi từ lâu lắm rồi.
   Tiềm năng của ngươi còn thô sơ, nhưng ta thấy được ngọn lửa
   trong đôi mắt ấy.

   Trước tiên — hãy nhận lấy những thứ này để bắt đầu."
```

### Nhận trang bị tân thủ (tự động vào túi đồ):
```
📦 Phần Thưởng Tân Thủ:
   ⚔️  Vũ Khí Thô [0★] — Khóa tộc Thiên Phong
   🧥  Áo Giáp Thô [0★]
   👖  Quần Thô [0★]
   👟  Giày Thô [0★]
   🧤  Găng Tay Thô [0★]
   📡  Rada Thô [0★]
   🗿  Hòn Đá Linh Khí x20 (vật phẩm đánh quái cơ bản)
```

> ✅ Người chơi đã có đủ 6 slot trang bị 0★ + skill đấm mặc định sẵn có

---

## 📋 BƯỚC 4 — 5 Nhiệm Vụ Tân Thủ

> Trưởng Lão giao nhiệm vụ đầu tiên. Các nhiệm vụ tiếp theo mở ra tuần tự sau khi hoàn thành.

---

### 🗡️ Nhiệm Vụ 1: "Thức Tỉnh Bản Năng"
**Mục tiêu:** Giết 20 con quái cấp thấp tại Bãi Farm Sơ Cấp
**Phần thưởng:** EXP + Đồng Linh x500
**Hướng dẫn:** Trưởng Lão chỉ hướng đến Cổng Biên Giới đầu tiên

```
[Trưởng Lão]: "Hãy ra ngoài kia và thể hiện sức mạnh của ngươi.
   Đừng lo lắng — kẻ thù đó còn yếu. Chúng sẽ là bài kiểm tra đầu tiên."

→ Marker xuất hiện trên màn hình chỉ hướng đến bãi farm
```

**Trong lúc làm nhiệm vụ:**
- Người chơi thực hành cơ chế đánh quái
- Thực hành bay bằng KI (có thể tùy ý)
- Lần đầu nhặt đồ drop → hệ thống giải thích Grace Period 30 giây

---

### 📦 Nhiệm Vụ 2: "Thu Thập Nguyên Liệu"
**Mục tiêu:** Thu thập 10 [Nguyên Liệu Thô] drop từ quái
**Phần thưởng:** EXP + Đá Nâng Cấp Thường x3
**Giới thiệu:** Hệ thống craft & Luyện Rèn

```
[Trưởng Lão]: "Những kẻ thù ngươi vừa hạ gục... chúng mang theo
   nguyên liệu quý giá. Hãy thu thập và mang về cho ta."

→ Sau khi nộp: Trưởng Lão dẫn đến NPC Luyện Rèn, giới thiệu craft
```

---

### 🧓 Nhiệm Vụ 3: "Tìm Gặp Người Ẩn"
**Mục tiêu:** Tìm và nói chuyện với NPC Ẩn (giấu ở góc khuất bản đồ)
**Phần thưởng:** EXP + Mảnh Lore (vật phẩm chỉ đọc, kể lịch sử tộc)
**Cơ chế:** Không có marker — người chơi phải tự khám phá

```
[Trưởng Lão]: "Có một người lão già ở đâu đó trên hành tinh này...
   Ta không biết chính xác vị trí. Nhưng những ai tìm thấy ông ta
   sẽ được truyền thụ bí quyết quan trọng."

→ Gợi ý: "Nghe nói ông ta hay ở gần [mô tả chung chung về khu vực]"
→ Người chơi phải tự đi khám phá → tìm thấy NPC Ẩn
```

**NPC Ẩn kể lore ngắn về tộc → trao kỹ năng thứ 2 (Lôi Vũ Liên Hoàn)**

---

### 💀 Nhiệm Vụ 4: "Đối Mặt Thử Thách"
**Mục tiêu:** Đánh Boss Vùng lần đầu tiên
**Phần thưởng:** EXP lớn + Đá Nâng Cấp Thường x5 + Đồng Linh x2000
**Giới thiệu:** Cơ chế Boss (phase, AoE, thông báo)

```
[Trưởng Lão]: "Ngươi đã đủ mạnh để đối mặt với kẻ canh giữ vùng đất này.
   Hãy cẩn thận — nó không giống những kẻ thù bình thường."

→ Boss Vùng spawn tại Bãi Farm Sơ Cấp
→ Hệ thống thông báo trong chat: "⚔️ Boss [Tên] đã xuất hiện tại [Hành Tinh]!"
→ Người chơi đánh boss → trải nghiệm Phase 2 (HP < 50%)
```

---

### ⚡ Nhiệm Vụ 5: "Phân Bổ Tiềm Năng"
**Mục tiêu:** Mở GUI `/tiemnang` và phân bổ điểm tiềm năng lần đầu
**Phần thưởng:** +10 điểm Tiềm Năng bonus + mở kỹ năng thứ 3
**Giới thiệu:** Hệ thống SD/HP/KI

```
[Trưởng Lão]: "Sức mạnh của ngươi đã tăng lên. Nhưng ngươi cần
   định hướng — ngươi muốn trở thành chiến binh như thế nào?
   Gõ /tiemnang để mở bảng phân bổ."

→ Sau khi phân bổ lần đầu → Trưởng Lão giải thích 3 hướng build:
   Ganker (đổ SD) | Tanker (SD/HP) | KI Build (SD/KI)
```

---

## 🌅 BƯỚC 5 — Phá Giới Mốc 1 → Mốc 2: Giác Tỉnh I

Sau khi hoàn thành 5 nhiệm vụ tân thủ, Trưởng Lão giao nhiệm vụ Phá Giới:

### Điều kiện Phá Giới Mốc 2:
```
✅ Hoàn thành 5 nhiệm vụ tân thủ
✅ Đạt đủ Tiềm Năng tích lũy (10 triệu)
✅ Đánh Boss Vùng lần đầu (đã làm ở NV4)
```

### Khi đủ điều kiện:
```
[Trưởng Lão]: "Ngươi đã đi đủ xa trên con đường này...
   Ta cảm nhận được sức mạnh đang bùng cháy trong ngươi.
   Đã đến lúc — PHÁ VỠ GIỚI HẠN!"

→ Animation: Aura trắng nhạt bùng phát quanh người chơi
→ Thông báo toàn server: "🌟 [Tên] đã đạt mốc GIÁC TỈNH I!"
→ Màn hình hiệu ứng particle đặc trưng
```

### Phần thưởng Phá Giới Mốc 2:
```
🎁 Phá Giới Mốc 2 — Giác Tỉnh I:
   ✨ Aura trắng nhạt (hiển thị xung quanh nhân vật)
   ⚔️  Mở kỹ năng Mốc 2 (theo từng tộc)
   📈  Trần Tiềm Năng tăng lên: 100 triệu
   🗺️  Mở Cổng Biên Giới → Bãi Farm Trung Cấp
   📋  Mở chuỗi nhiệm vụ Chương 2
```

---

## 🗺️ Sau Mốc 2 — Người Chơi Tiếp Theo Làm Gì?

```
Mốc 2 mở ra:
├── Bãi Farm Trung Cấp (mob mạnh hơn, EXP nhiều hơn)
├── Kỹ năng mới (chiêu thứ 2 của tộc nếu chưa có)
├── Phó bản đầu tiên (nhận nhiệm vụ từ NPC tại Thị Trấn)
├── Cổng đến Hành Tinh khác (Bãi Tàu Vũ Trụ mở đầy đủ)
├── Nhiệm vụ tộc riêng tiếp theo (Chương 2)
└── Daily Quest bắt đầu xuất hiện
```

---

## ⏱️ Ước Tính Thời Gian

| Bước | Hoạt động | Thời gian ước tính |
|---|---|---|
| 1-2 | Chọn tộc, đọc lore | 5-10 phút |
| 3 | Nhận trang bị, nghe Trưởng Lão | 5 phút |
| NV1 | Giết 20 quái | 10-15 phút |
| NV2 | Thu thập nguyên liệu | 5-10 phút |
| NV3 | Tìm NPC Ẩn (khám phá) | 10-20 phút |
| NV4 | Đánh Boss Vùng | 5-15 phút |
| NV5 | Phân bổ Tiềm Năng | 5 phút |
| Phá Giới | Farm đủ Tiềm Năng | 30-60 phút |
| **Tổng** | **Từ join đến Mốc 2** | **~1.5 - 2.5 tiếng** |

> 💡 Đây là mục tiêu thiết kế: người chơi mới cảm thấy tiến triển sau **buổi chơi đầu tiên**.

---

## 🎯 Nguyên Tắc Thiết Kế Hành Trình Tân Thủ

1. **Luôn có việc để làm** — không bao giờ để người chơi không biết bước tiếp theo
2. **Dẫn dắt tự nhiên** — NPC gợi ý, không ép buộc (trừ NV1-2 bắt buộc)
3. **Khám phá có thưởng** — NPC Ẩn (NV3) reward người chịu khó tìm hiểu
4. **Trải nghiệm đủ loại cơ chế** trong 5 NV đầu: chiến đấu, thu thập, khám phá, boss, skill
5. **Cảm giác mạnh lên rõ rệt** — sau mốc 2, nhân vật nhìn khác hẳn (aura)
6. **Kết nối cộng đồng** — thông báo toàn server khi phá giới → người mới được chú ý

---

## ❓ Câu Hỏi Còn Mở

- [ ] Tên cụ thể của 5 nhiệm vụ tân thủ theo từng tộc (lời thoại NPC khác nhau)
- [ ] Số lượng quái cụ thể cho NV1 (20 con — có phù hợp tốc độ mốc 1 không?)
- [ ] NPC Ẩn ở NV3 nằm ở khu vực nào cụ thể trên từng hành tinh?
- [ ] Hành tinh Âm Mộc có mở Thánh Địa trong chuỗi NV tân thủ không hay sau đó?
- [ ] Người chơi tộc khác có thể xem hành trình của tộc kia không (spoiler)?
