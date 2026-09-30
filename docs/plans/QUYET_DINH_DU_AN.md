# Quyết định dự án từ các cuộc trò chuyện

Cập nhật: 30/09/2026. Tài liệu này ghi lại các yêu cầu và quyết định của chủ dự án để mọi người đọc cùng một hướng. Những đề xuất chưa được chốt được ghi rõ.

| Chủ đề | Hướng hiện tại |
| --- | --- |
| Nền tảng | Game độc lập chạy trên web, trước mắt chạy local trên máy tính. Mobile là bước sau khi bản web đã được phát triển và kiểm chứng. |
| Góc nhìn | RPG hành động **2D nhìn từ trên chếch xuống**, theo ảnh tham chiếu chủ dự án đã gửi. Nhân vật nhìn nhỏ trong môi trường, giao diện RPG gồm nhiệm vụ, túi đồ, kỹ năng, bản đồ và trạng thái. |
| Người chơi | Chủ dự án đưa ra lối chơi và quyết định sản phẩm; dự án triển khai game, hình ảnh, nhân vật, giao diện và animation dựa trên định hướng đó. |
| Vòng chơi | Chọn một trong ba tộc, đi theo cốt truyện, farm quái, chặt cây/thu thập tài nguyên, nhận vật liệu, nâng đồ, vượt boss và mở mốc Phá Giới. Nội dung nhiều chương, có chiều sâu để chơi lâu và cày cuốc khó. |
| Cốt truyện | IP riêng **Mạch Giới**, hiện dùng tiền đề Vết Nứt Mạch Giới, Lõi Nguyên Mạch và Hội Vô Mạch. Các tên và kết thúc vẫn có thể chỉnh theo phản hồi của chủ dự án. |
| Donate | Chủ dự án muốn bán vật phẩm, gói vũ khí, pass tháng và gói nạp theo kiểu MMORPG. Các gói trả phí có thể rút ngắn thời gian farm; phải ghi rõ tác động sức mạnh và cân lại kinh tế/PvP. |
| Thanh toán | Chưa có cổng thanh toán. Shop trong bản local chỉ là bản xem trước, không nhận tiền hoặc cấp hàng trả phí. |
| Chơi thử | Tài khoản `jdjd747` trên máy hiện tại đã được cấp các hệ thống/vật phẩm đang hoạt động để test. Dữ liệu tài khoản ở `data/`, không đưa lên Git. |
| Đồ họa và hiệu năng | Đã thêm hình minh họa và chuyển động; tiếp tục ưu tiên điều khiển rõ, hiệu ứng dễ đọc và tối ưu cho máy yếu trước khi tăng chi tiết. |

## Trạng thái hiện tại và đích đến

Bản local đã có tài khoản/nhân vật, năm bản đồ, ba tộc, nhiệm vụ mở đầu, boss, thu thập, nâng đồ, chat và animation cơ bản. [README](../../README.md) liệt kê chức năng đang chạy. Các chương sau, hệ thống nhiều ô trang bị, bang hội, kinh tế giao dịch, âm thanh, bộ sprite hoàn chỉnh, shop có thanh toán, máy chủ công khai và mobile là **kế hoạch tiếp theo**, chưa nên mô tả là đã hoàn tất.

Ưu tiên tiếp theo: kiểm thử người chơi mới và cảm giác chiến đấu; hoàn thiện hình ảnh/animation và hiệu năng; mở rộng nội dung chương I; đo tốc độ farm và cân bằng; sau đó mới chốt chỉ số gói trả phí và hạ tầng phát hành. Chi tiết các mốc nằm trong [kế hoạch web dài hạn](../../KE_HOACH_GAME_WEB_DAI_HAN.md).

## Quyết định còn mở

- Tên thương mại cuối cùng, phong cách thoại và kết thúc truyện.
- Chỉ số/trần sức mạnh của vũ khí bán trong shop, thưởng pass và luật dùng đồ trả phí trong PvP.
- Quy mô multiplayer khi chuyển từ local sang máy chủ công khai, cùng yêu cầu chống gian lận và sao lưu.
- Cách điều khiển mobile và kênh phát hành khi đến giai đoạn mobile.

Nguồn: các trao đổi về chuyển từ Minecraft sang web, góc nhìn 2D, game chơi lâu, donate, phát triển bản local, hình ảnh/animation và tài khoản test trong task hiện tại; các task cũ về đánh giá item, tìm file dữ liệu game và review GDD. Tài liệu lịch sử đi kèm chỉ là tham chiếu, không tự động biến mọi ý tưởng cũ thành yêu cầu hiện tại.
