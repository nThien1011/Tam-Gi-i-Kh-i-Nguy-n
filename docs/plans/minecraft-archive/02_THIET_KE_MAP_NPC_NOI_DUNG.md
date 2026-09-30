# 02 — Thiết kế map, NPC và nội dung

## 1. Nguyên tắc xây bản đầu

Map Alpha là blockout có thể chơi, không phải bản art cuối. Mỗi khu chỉ cần trả lời được bốn câu hỏi:

1. Người chơi đi đâu tiếp?
2. Ở đây đánh mob gì?
3. Rủi ro/khác biệt của khu này là gì?
4. Landmark nào giúp nhận ra khu này trong một ảnh chụp?

Không làm nhiều world rời rạc. Bản đầu dùng một hub chung và ba zone được nối bằng portal/đường đi ngắn để giảm công build và tải world.

## 2. Layout

~~~
                         [Arena Thủ Hộ Tam Giới]
                                  |
      [Zone Thiên Phong] — [Hub: Quảng Trường Giao Hội] — [Zone Âm Mộc]
                                  |
                           [Zone Hỏa Hắc]
~~~

| Khu | Kích thước blockout | PvP | Nội dung | Landmark |
|---|---:|---|---|---|
| Hub | 100 × 100 | Tắt | Spawn, chọn tộc, NPC quest/rèn, portal | Cột giao hội ba màu |
| Zone Thiên Phong | 120 × 100 | Tắt | Spark Rat, đường thẳng, line-of-sight | Tháp Lôi |
| Zone Âm Mộc | 120 × 100 | Tắt | Rootling, lối vòng, vị trí heal | Cổ Thụ Linh |
| Zone Hỏa Hắc | 120 × 100 | Tắt | Cinder Hound, hazard nhẹ | Miệng Núi Lửa |
| Arena | 64 × 64 | Tắt | Boss quest | Vòng đá ba nguyên tố |

Tất cả cổng có biển/tên rõ, particle màu riêng và quest waypoint. Không được giấu đường chính vì đây là tutorial.

## 3. NPC

| ID | Vị trí | Vai trò | Tương tác |
|---|---|---|---|
| NPC_GUIDE | Hub spawn | Mở Q_INTRO_01, giải thích quest | Chọn tộc một lần, xác nhận hai bước. |
| NPC_MENTOR_THUNDER | Zone Thiên Phong | Flavor/lore | Nhắc skill burst và mob target. |
| NPC_MENTOR_ROOT | Zone Âm Mộc | Flavor/lore | Nhắc target heal và sustain. |
| NPC_MENTOR_EMBER | Zone Hỏa Hắc | Flavor/lore | Nhắc combo và hồi KI khi hạ mob. |
| NPC_SMITH | Hub | Upgrade item | Chỉ cho phép item của owner, hiện tỉ lệ và kết quả. |
| NPC_WARDEN | Cổng Arena | Mở Q_INTRO_05 | Kiểm tra Q_INTRO_04; tạo/đưa party vào arena. |

Citizens chịu trách nhiệm entity và vị trí. Plugin core sở hữu điều kiện quest, inventory, reward và transaction.

## 4. Dialogue format

Mỗi đoạn thoại cần có ID, speaker, text, điều kiện, lựa chọn và effect. Writer không được sửa code để đổi câu thoại.

~~~yaml
id: DLG_GUIDE_TOC_01
speaker: NPC_GUIDE
when: quest(Q_INTRO_01).state == AVAILABLE
text: "Con đường trước mặt sẽ gắn với một lời thề. Hãy chọn thật kỹ."
choices:
  - label: "Thiên Phong"
    action: select_race(THIEN_PHONG)
  - label: "Âm Mộc"
    action: select_race(AM_MOC)
  - label: "Hỏa Hắc"
    action: select_race(HOA_HAC)
~~~

Choice chọn tộc phải mở GUI xác nhận: “Tộc không thể đổi trong Alpha. Xác nhận?”. Sau đó ghi database transaction một lần và log audit.

## 5. Flow người chơi mới

| Bước | Hành động người chơi | Hệ thống phản hồi | Nếu thất bại |
|---:|---|---|---|
| 1 | Spawn | Camera/scoreboard chỉ NPC Guide | Waypoint sau 15 giây không tương tác. |
| 2 | Chọn tộc | Cấp skill item và Q_INTRO_02 | Không thể đóng GUI nếu chưa chọn hoặc chọn Cancel. |
| 3 | Dùng skill | Thanh KI giảm/cooldown hiển thị | Thông báo lý do: thiếu KI, cooldown, không có target. |
| 4 | Đi zone | Portal/biển màu tộc + waypoint | Lệnh /huongdan nêu vị trí. |
| 5 | Hạ mob | Quest counter, EXP, Đồng Linh | Không cộng nếu mob bị GM kill. |
| 6 | Nâng đồ | Preview star/stat sau nâng | Fail không phá đồ; ghi audit. |
| 7 | Vào boss | Party/eligibility info hiển thị | Cảnh báo chưa đủ quest hoặc party full. |
| 8 | Hạ boss | Reward transaction, unlock Mốc 2 | Idempotency key tránh claim lại. |

## 6. Checklist blockout cho builder

- [ ] Spawn không tạo loop vô tận hoặc điểm kẹt.
- [ ] Mỗi zone có đường quay về Hub dưới 30 giây.
- [ ] Mob spawn không ở trong block, nước hoặc trên mái.
- [ ] Arena không cho kite boss ra ngoài; có boundary rõ nhưng không dùng tường vô hình khó hiểu.
- [ ] Có ít nhất hai vị trí né cho mỗi AoE boss.
- [ ] Light level, collision, pathfinding được test ban đêm và với 4 người.
- [ ] Chỉ dùng asset/texture có quyền sử dụng hoặc asset tự tạo.
- [ ] Mọi coordinate landmark nằm trong file map config.

## 7. Content cần giao trước code content

| Artifact | Người phụ trách | Definition of Ready |
|---|---|---|
| Blockout Hub + Arena | Builder | Có coordinate, lối đi, safe zone, NPC spot. |
| Ba zone blockout | Builder | Mob route/spawn point/landmark rõ. |
| 5 quest sheet | Designer/writer | ID, dialogue, condition, reward, fail state. |
| 3 skill feedback placeholder | Designer | Particle/sound hợp pháp, duration/timing. |
| 5 mob + 1 boss sheet | Designer | HP, attack, spawn, telegraph, loot, role. |
| UI text | Designer | Thông báo lỗi, tooltip, Vietnamese nhất quán. |
