# 📐 Planning Roadmap — Các Bước Hoàn Thiện Lý Thuyết

> **Mục đích:** Xác định TẤT CẢ những gì cần được thiết kế/quyết định trước khi bắt tay code.
> **Nguyên tắc:** Hoàn thiện lý thuyết từng mảng → đủ để giao cho developer/designer thực thi.
> **Cập nhật:** 16/09/2026

---

## 🟢 GIAI ĐOẠN 1 — Hoàn Thiện Thiết Kế Cốt Lõi
> *Những thứ PHẢI quyết định trước khi code bất cứ thứ gì*

### 1.1 Định Danh & Thế Giới
- [ ] **Đặt tên server chính thức**
- [ ] **Đặt tên 3 hành tinh tộc** (Thiên Phong / Âm Mộc / Hỏa Hắc)
- [ ] **Đặt tên các khu vực** trong mỗi hành tinh (Thị Trấn, Bãi Farm, Vùng Elite...)
- [ ] **Đặt tên Boss Vùng** cho từng hành tinh (3 hành tinh × 1-2 boss)
- [ ] **Đặt tên 4 Boss Đặc Biệt** (drop đệ tử hiếm: Mabu / Ubu / Kid Jiren / Kid Beerus)

### 1.2 Khu Vực Đặc Biệt Còn Thiếu
- [ ] **Hành tinh Thiên Phong** — có khu vực đặc biệt riêng không? (như Thánh Địa Âm Mộc)
- [ ] **Hành tinh Hỏa Hắc** — có khu vực đặc biệt riêng không?
- [ ] **Thánh Địa Âm Mộc** — nhiệm vụ mở cụ thể là gì?

### 1.3 Hệ Đệ Tử — Phần Chưa Chốt
- [ ] **Kỹ năng đệ tử**: RNG mở ngẫu nhiên (như NRO) hay cố định theo hệ?
- [ ] **Số đệ tử tối đa** mang theo cùng lúc (1 hay nhiều hơn?)
- [ ] **Passive Hợp Thể Vĩnh Viễn (Âm Mộc)**: passive gì? tích lũy tối đa mấy lần?
- [ ] **4 Boss Đặc Biệt**: cơ chế spawn, cơ chế chiến đấu, lịch xuất hiện

### 1.4 Hệ Di Chuyển — Phần Chưa Chốt
- [ ] **Cổng Biên Giới**: một chiều (chỉ đi tiếp) hay hai chiều?
- [ ] **Capsule Trở Về**: giá bao nhiêu Đồng Linh?
- [ ] **Capsule Cột Mốc**: lưu tối đa bao nhiêu điểm? giá Linh Thạch?

---

## 🔵 GIAI ĐOẠN 2 — Thiết Kế Hệ Thống Mới (Từ Phân Tích NRO)
> *Các hệ thống đã có ý tưởng nhưng chưa có thiết kế chi tiết*

### 2.1 Hệ Tinh Thạch *(tương đương Sao Pha Lê NRO)*
- [ ] 6 loại Tinh Thạch: tên, hiệu ứng cụ thể theo % server
- [ ] Cách gắn vào trang bị: slot mở sẵn hay phải unlock?
- [ ] Số khe tối đa mỗi trang bị
- [ ] Nguồn drop (quái, boss, craft?)
- [ ] Có thể tháo ra hay không?

### 2.2 Hệ Linh Giáp *(tương đương SKH NRO — Endgame)*
- [ ] Tên 6 bộ Linh Giáp (2 bộ/tộc: tấn công + phòng thủ)
- [ ] Hiệu ứng kích hoạt 2/4/6 món cụ thể
- [ ] Nguyên liệu chế tác (Trang bị 6★ + Linh Hồn Tộc x?)
- [ ] Cơ chế Tái Chế (thu hồi 70% nguyên liệu)
- [ ] Mốc phá giới yêu cầu để mặc (Mốc 5+?)

### 2.3 Boss Tích Lũy *(tương đương Super Broly)*
- [ ] Tên boss, tên từng giai đoạn biến hình
- [ ] Ngưỡng sát thương để chuyển giai đoạn (VD: 1 tỷ / 5 tỷ / 20 tỷ damage)
- [ ] Loot dạng biến hình cụ thể: EXP bao nhiêu? drop gì?
- [ ] Lịch xuất hiện (bao nhiêu lần/tuần? thông báo trước bao lâu?)
- [ ] Có mốc yêu cầu không? hay ai cũng vào đánh được?

### 2.4 Phó Bản Kho Báu *(mê cung random)*
- [ ] Cơ chế random: map thay đổi mỗi lần vào hay cố định?
- [ ] Bao nhiêu tầng/phòng?
- [ ] Cơ chế bẫy và phần thưởng
- [ ] Loot table cụ thể (Đồng Linh, nguyên liệu, tỉ lệ drop)

### 2.5 Đấu Trường Thiên Đỉnh *(PvP có xếp hạng)*
- [ ] Hệ thống điểm (ELO hay Win/Loss đơn giản?)
- [ ] Chia tier theo mốc phá giới hay xếp chung?
- [ ] Format: 1v1 hay có cả 3v3?
- [ ] Lịch mùa giải: reset tuần / tháng?
- [ ] Phần thưởng chi tiết từng hạng

---

## 🟡 GIAI ĐOẠN 3 — Hoàn Thiện Hệ Thống Đã Có
> *Mảng đã có sườn nhưng cần chi tiết hóa thêm*

### 3.1 Hệ Nhiệm Vụ — Nội Dung
- [ ] Tên 5 nhiệm vụ tân thủ cho **từng tộc** (lời thoại khác nhau)
- [ ] Sơ đồ chuỗi quest Chương 1 → 2 → 3 (các quest liên kết ra sao)
- [ ] Nhiệm vụ phá giới từng mốc: điều kiện cụ thể
- [ ] Danh sách NPC Ẩn: ở đâu, cho quest gì, reward gì
- [ ] Daily Quest: 3-5 loại quest daily cụ thể

### 3.2 Hệ Tông Môn — Chi Tiết
- [ ] Số thành viên tối đa mỗi tông môn
- [ ] Cấp bậc trong tông môn (Tộc Trưởng, Trưởng Lão, thành viên...)
- [ ] Buff tông môn cụ thể (+X% EXP, +Y% drop...)
- [ ] Cơ chế Chiến Tông Môn (cuối tuần): format, luật, phần thưởng
- [ ] Base tông môn: kích thước, có thể xây gì?

### 3.3 Hệ Kinh Tế — Số Liệu Khung
- [ ] Giá NPC Shop cho các vật phẩm chính (Capsule, Bùa, Bình EXP...)
- [ ] Tỉ lệ quy đổi Linh Thạch: bao nhiêu Đồng Linh = 1 Linh Thạch
- [ ] Giá "Giải Phóng Đệ Tử" tại shop
- [ ] Giá Reset Tiềm Năng (Linh Thạch)
- [ ] Linh Phiếu: 1 Linh Phiếu = bao nhiêu Đồng Linh?

### 3.4 Hệ Trang Bị — Hoàn Thiện
- [ ] Tên đầy đủ 3 sét đồ tộc + 1 sét Trung Lập
- [ ] Stat cụ thể từng sét ở từng sao (khung — số chính xác sau khi test)
- [ ] Hiệu ứng set 3/6 món cụ thể cho từng sét

### 3.5 Rank Donate — Đặc Quyền Chi Tiết
- [ ] Rà soát lại 5 rank donate hiện có → bổ sung/sửa đặc quyền
- [ ] Đặc quyền bay KI: rank nào được bay miễn phí ở đâu?
- [ ] VIP Lounge (Huyền Thoại): nằm ở đâu trong game?

---

## 🟠 GIAI ĐOẠN 4 — Chuẩn Bị Cho Developer
> *Biến thiết kế thành tài liệu kỹ thuật*

### 4.1 DB Schema Hoàn Chỉnh
- [ ] Cập nhật schema: thêm bảng cho Đệ Tử, Tinh Thạch, Linh Giáp, Capsule Cột Mốc
- [ ] Bảng lịch sử giao dịch (Auction House, /trade)
- [ ] Bảng log boss (ai đánh, damage, last hit)

### 4.2 Plugin List Đầy Đủ
- [ ] Core plugins (Citizens, Denizen, AuctionHouse, LuckPerms, Multiverse...)
- [ ] Plugins cần tự code (TocSystem, KyNangSystem, PhaGiaiSystem...)
- [ ] Dependency & version compatibility

### 4.3 Thiết Kế Discord Bot
- [ ] Danh sách lệnh đầy đủ (/dangky, /thongtin, /toc, /xephang...)
- [ ] Flow tạo tài khoản step-by-step (wireframe)
- [ ] Cách đồng bộ Discord ID ↔ Minecraft UUID
- [ ] Kênh thông báo: boss spawn, phá giới, top xếp hạng...

### 4.4 Bản Đồ Kỹ Thuật (Cho Designer)
- [ ] Kích thước từng hành tinh (bao nhiêu blocks?)
- [ ] Tọa độ các khu vực chính (Spawn, Cổng Biên Giới, Bãi Tàu...)
- [ ] Quy tắc xây dựng: màu sắc, vật liệu theo theme từng tộc
- [ ] Danh sách landmark cần có trên mỗi hành tinh

---

## 📊 Bảng Ưu Tiên Tổng Hợp

| Ưu tiên | Giai đoạn | Lý do |
|---|---|---|
| 🔴 Cao nhất | 1.1 Tên & Định Danh | Cần tên trước khi làm bất cứ gì |
| 🔴 Cao nhất | 1.3 Đệ Tử chưa chốt | Ảnh hưởng đến code core |
| 🔴 Cao nhất | 2.3 Boss Tích Lũy | Cơ chế lấy đệ tử cơ bản |
| 🟠 Cao | 2.1 Hệ Tinh Thạch | Endgame gần nhất |
| 🟠 Cao | 3.1 Nội Dung Quest | Cần trước khi test |
| 🟡 Trung bình | 2.2 Linh Giáp | Endgame — làm sau |
| 🟡 Trung bình | 3.2 Tông Môn | Phase 2 mới cần |
| 🟢 Thấp | 4.x Kỹ Thuật | Làm khi bắt đầu code |
| 🟢 Thấp | 2.4 Kho Báu, 2.5 Đấu Trường | Phase 2-3 |

---

## 🗓️ Đề Xuất Lịch Lên Kế Hoạch

```
Tuần 1: Hoàn thiện Giai đoạn 1 (Định Danh + Đệ Tử + Di Chuyển)
Tuần 2: Hoàn thiện Giai đoạn 2 (Tinh Thạch + Boss Tích Lũy)
Tuần 3: Hoàn thiện Giai đoạn 3 (Quest nội dung + Tông Môn + Kinh Tế)
Tuần 4: Hoàn thiện Giai đoạn 4 (Tài liệu kỹ thuật + Discord Bot plan)
         → GDD HOÀN CHỈNH — Sẵn sàng bàn giao cho Developer
```

---

## ✅ Checklist Hoàn Thành GDD

Khi tất cả mục dưới đây được tích ✅ → GDD đủ để bắt đầu code:

- [ ] Tên server + 3 hành tinh
- [ ] 5 nhiệm vụ tân thủ (đủ 3 tộc)
- [ ] Hệ Đệ Tử: kỹ năng RNG hay cố định
- [ ] Boss Tích Lũy: tên + cơ chế
- [ ] 4 Boss Đặc Biệt: tên + cơ chế
- [ ] Hệ Tinh Thạch: 6 loại + cơ chế gắn
- [ ] Hệ Linh Giáp: 6 bộ + hiệu ứng
- [ ] DB Schema hoàn chỉnh
- [ ] Plugin list đầy đủ
- [ ] Discord Bot flow
- [ ] Bản đồ kỹ thuật (kích thước, tọa độ khung)
