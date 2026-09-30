# 05 — Nguồn và cách chuyển NRO sang demo

## Nguồn đã kiểm tra

| Nguồn | Phần dùng được | Giới hạn |
|---|---|---|
| Workbook nghiên cứu `Ngoc_Rong_Online_Toan_Tap_2026.xlsx` (không đưa vào repository), `Bản đồ!A4:D131` | 127 map ID/tên để nhận diện các vùng và ba hành tinh khởi đầu. | Không có tọa độ Minecraft, adjacency, portal hay spawn point. |
| Cùng workbook, `Vật phẩm!A4:M1472` | 1.468 item, nhóm loại, ID và tên; ví dụ gear, rada, đá, mảnh quái, ngọc. | Toàn bộ là snapshot cộng đồng, mô tả nhiều dòng bị rút gọn; không có stat/drop rate đủ tin cậy. |
| Cùng workbook, `Quái!A4:I96` | 92 mẫu quái và HP NRO để đối chiếu tên/độ lớn tương đối. | Không có bảng quái→map→loot đầy đủ; HP NRO không là HP Minecraft. |
| Cùng workbook, `Boss!A4:H53` và `Nhiệm vụ!A4:G30` | 49 boss/đối thủ, 26 quest, một số vị trí/điều kiện. | Phần lớn vị trí/HP lấy từ bài hướng dẫn cộng đồng, nhiều boss thiếu HP và loot. |
| [Giới thiệu NRO chính thức](https://ngocrongonline.com/gioi-thieu) | Xác nhận 3 hệ nhân vật, quest hạ quái/boss, item từ đánh quái/boss, đá nâng cấp, boss và hoạt động tổng quát. | Không công bố catalog drop rate hay thông số server live để copy. |
| [Hướng dẫn 26 nhiệm vụ của Thế Giới Di Động](https://www.thegioididong.com/game-app/tong-hop-danh-sach-nhiem-vu-ngoc-rong-online-tu-a-z-moi-nhat-1354624) | Xác nhận ví dụ quan hệ map–quái–quest–boss: quái 200 HP ở ba đồi; ba boss “Mẹ” tại các khu riêng; tuyến Tàu Pảy Pảy/Tháp Karin. | Bài ghi “Cập nhật 27/02/2023” trên trang, dù tiêu đề nêu 2024; không xem là trạng thái NRO live 2026. |
| [Bảng Data NRO BanTool](https://bantool.net/tools/dataNRO) | Hiển thị danh mục Item/Map/Mob/NPC/Skill cộng đồng mà workbook tham chiếu. | Không phải API hoặc công bố chính thức của nhà phát hành; không dùng làm nguồn drop rate. |

Workbook còn một tab `Bổ sung 2026!A4:G43` có 39 tên item sự kiện theo bài đăng chính thức, nhưng thuộc sự kiện đã kết thúc; không đưa vào vòng lặp Alpha thường trực. Tên, icon ID và mô tả NRO không được nhập thẳng vào asset runtime của dự án.

## Bảng đối chiếu ý tưởng

| Dữ liệu NRO trong workbook | Ý nghĩa tham khảo | Thiết kế demo Minecraft |
|---|---|---|
| Map 0 Làng Aru, 7 Làng Mori, 14 Làng Kakarot và các vùng quanh ba hành tinh | Ba tuyến khởi đầu song song | Một Hub + ba vùng tộc, đủ khác biệt landmark và combat; không sao chép bản đồ. |
| Type 2 Găng, Type 0 Áo, Type 1 Quần, Type 3 Giày, Type 4 Rada | Gear nhiều slot theo cấp | 3 slot `WEAPON/ARMOR/ACCESSORY`; 9 starter template cân stat giữa ba tộc. |
| Item 220–224 đá nâng cấp, 441–447 sao pha lê, 828–835 mảnh quái | Vật liệu và tiến trình nâng cấp | `MATERIAL_INITIATE`, `MATERIAL_ELITE_CORE`, `MATERIAL_RITUAL`; sink 0→3★ có số cụ thể. |
| NRO quái 0–6 và boss “Mẹ” ở ba khu đầu | Khu mở đầu có quái thường rồi mục tiêu mạnh hơn | 3 quái thường theo tộc + 1 elite cổng + 1 Wisp; tên, art, stat tự thiết kế. |
| Các boss nhiều map và vật phẩm từ hạ boss | Boss là điểm kết của tuyến farm/nhiệm vụ | Một boss `BOSS_TRINITY_WARDEN`, party 1–4, 2 pha, personal reward. |
| Sách kỹ năng theo cấp và ba hệ kỹ năng | Skill gắn identity nhân vật | Mỗi tộc 1 signature skill, mở bằng Q01; không đưa 154 sách cấp vào Alpha. |

## Phần do dự án tự quyết định

Tọa độ blockout; 13 tên item gốc; toàn bộ attack/HP Minecraft; 25/40/30/15% drop; giá nâng đồ; cooldown reward 24 giờ; điều kiện owner; boss HP scale/telegraph/eligibility; khóa idempotent; và 5 quest demo là **thiết kế mới** dựa trên scope ở các file `00`–`08`. Chúng không phải lời xác nhận về NRO chính thức. Mọi số này là baseline để test, có thể đổi bằng catalog version sau khi đo.

## Điểm cần khóa trước triển khai thật

1. Builder thay tọa độ đề xuất bằng tọa độ world đã dựng và test đường đi/collision (DEC-022).
2. Coder chọn phiên bản Paper/Java và khả năng plugin phụ thuộc, rồi pin trong build (DEC-005).
3. Designer chốt tên boss/lore và asset hợp pháp (DEC-020/021); tên hiện tại chỉ là tên tạm trong tài liệu.
4. Playtest xác nhận `attack_interval`, boss HP, material drop và boss accessory rate. Nếu thay đổi, tăng `schema_version`/catalog version và ghi metric trước–sau.
