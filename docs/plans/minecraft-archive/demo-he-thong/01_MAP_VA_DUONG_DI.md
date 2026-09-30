# 01 — Map, cổng và tuyến chơi

## Sơ đồ khu

```text
                         [Vòng Đá Tam Giới, 64×64]
                                    ↑
                         [Lối Vào Thạch Môn]
                                    ↑
[Đồi Lôi Phong, 120×100] ← [Quảng Trường Giao Hội, 100×100] → [Rừng Âm Mộc, 120×100]
                                    ↓
                         [Khe Hỏa Hắc, 120×100]
```

Tất cả khu ở cùng `rpg_demo`; `MAP_BOSS_GATE` là hành lang dẫn tới arena, không là một world mới. Mười cổng hai chiều/thoát trận có tọa độ đầu–đích và điều kiện trong `catalog.json`. Tọa độ X/Z, tâm spawn và điểm quái cũng ở đó; Y=64/65 chỉ là mặt phẳng blockout. Không hard-code tọa độ vào quest hoặc NPC script.

| Map | Vai trò và điều kiện | Quái/NPC | Landmark và yêu cầu build |
|---|---|---|---|
| `MAP_HUB` | Spawn, chọn tộc, rèn, cổng 3 vùng và cổng boss; cấm PvE/PvP | Guide, Smith | Cột giao hội ba màu; nhìn thấy Guide từ spawn. |
| `MAP_THIEN_PHONG` | Vùng của Thiên Phong; vào sau chọn tộc | 3 cụm Spark Rat × 2, Mentor | Tháp Lôi; đường thẳng để học khóa mục tiêu/line of sight. |
| `MAP_AM_MOC` | Vùng của Âm Mộc; vào sau chọn tộc | 3 cụm Rootling × 2, Mentor | Cổ Thụ Linh; một vòng chạy để thử hồi máu. |
| `MAP_HOA_HAC` | Vùng của Hỏa Hắc; vào sau chọn tộc | 3 cụm Cinder Hound × 2, Mentor | Miệng núi lửa; hazard chỉ gây dấu hiệu/cảnh báo trong tutorial, không thêm damage môi trường. |
| `MAP_BOSS_GATE` | Mở sau `Q_INTRO_04`; luyện elite trước boss | 1 Wisp, 1 Ruin Guard, Warden | Cổng Thạch Môn; lối rộng đủ 4 người, không để quái đánh NPC/cổng. |
| `MAP_ARENA` | Một party 1–4 người/encounter; không PvP | Boss và 3 Wisp triệu hồi ở phase 2 | Vòng đá ba nguyên tố; hai bệ né beam tại `[-18,65,168]`, `[18,65,168]`. |

## Luật di chuyển và mở khóa

1. Player mới spawn tại Hub. Trước khi chọn tộc, cổng vùng hiển thị đường đi nhưng không teleport. Sau `Q_INTRO_01`, cổng vùng của tộc hiện tại được đánh dấu; người chơi vẫn có thể xem ba khu nhưng chỉ mob vùng tộc tính cho `Q_INTRO_03`.
2. Mỗi vùng có cổng về Hub tại đầu khu. Mục tiêu đi bộ/portal từ quái xa nhất về Hub dưới 30 giây; builder đo trên blockout thật.
3. Cổng boss ở Hub dẫn tới `MAP_BOSS_GATE` sau `Q_INTRO_04`. Warden kiểm tra quest hoàn tất của **từng thành viên** trước khi đưa party vào arena.
4. Arena chỉ có một encounter hoạt động tại một thời điểm trong bản demo. Party kế tiếp đứng ở cổng; plugin không mở cửa arena cho người ngoài. Party có thể rời về Hub, nhưng không rejoin sau khi boss chết.
5. Nếu một player chết, hồi sinh tại Hub. Quest và đồ vẫn lưu; boss contribution đã ghi trong encounter vẫn còn nếu người đó trở lại trước khi boss chết và encounter chưa reset.

## Sinh quái và an toàn

- Mob thường: tối đa 6 con/vùng, từng slot respawn ngẫu nhiên trong 15–25 giây. Gate: 1 Wisp và 1 Ruin Guard, respawn 25 giây. Spawn chỉ khi chunk/khu đang active và không có player trong vùng an toàn quanh NPC/cổng (bán kính 8 block).
- Mỗi spawn point phải đặt trên nền hợp lệ, không trong block/nước/mái. Mob có leash về cụm spawn: rời cụm quá 24 block hoặc ở ngoài khu hơn 5 giây thì reset HP, vị trí và aggro; không cộng kill/reward.
- Hub cấm mọi damage và cast vào mục tiêu bên ngoài Hub qua biên. Arena chặn kéo boss qua biên; tường/địa hình phải nhìn thấy được. Hai bệ né có lối vào rõ, không thể bị Wisp chặn cả hai.
- NPC Guide và Smith chỉ trình bày giao diện; plugin core xác thực quest, tiền, item, race và nâng cấp.

## Giao cho builder trước M3-01

1. Dựng blockout theo bounds trong catalog và ghi lại Y thực của mỗi điểm spawn/NPC/portal. Thay số trong catalog nếu địa hình buộc dịch chuyển; không sửa ID.
2. Đánh dấu đường người mới đi bằng biển, màu/particle và waypoint. Test người chơi chưa biết map có tìm được Mentor, Smith và Warden hay không.
3. Kiểm tra collision, ánh sáng, đường về Hub, leash, điểm né beam, đường đi cho nhóm 4 người; chụp ảnh từ spawn mỗi khu để kiểm tra landmark.
4. Sau khi build đạt checklist, khóa map version và chuyển tọa độ đã đo vào config triển khai. Bản JSON hiện là ví dụ đồng bộ dữ liệu, chưa là bản đồ `.schem` hoặc world save.
