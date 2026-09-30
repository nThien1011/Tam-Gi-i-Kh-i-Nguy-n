# Chuyển thiết kế Minecraft sang game web độc lập

## Giữ làm nền thiết kế

| Ý tưởng từ giai đoạn Minecraft | Cách dùng trong game web |
| --- | --- |
| Ba tộc với vai trò chiến đấu khác nhau | Giữ bản sắc Lôi/Sinh/Hỏa, kỹ năng riêng, thế mạnh khác nhau và tuyến truyện tộc. |
| Vòng quest → farm → boss → nâng đồ → Phá Giới | Dùng làm vòng chơi cốt lõi; điều chỉnh thời gian, phần thưởng và độ khó qua playtest. |
| Các vùng có chủ đề, NPC, quái và tuyến đường | Chuyển thành bản đồ 2D, cổng, landmark, nhiệm vụ và tài nguyên có nhận diện riêng. |
| Boss nhiều giai đoạn, thưởng theo đóng góp | Giữ cơ chế báo trước, nhiều phase và phân thưởng công bằng. |
| Catalog item/mob/quest và checklist nội dung | Dùng để thiết kế dữ liệu game có version, kiểm tra tham chiếu và mở rộng chương. Không nhập nguyên dữ liệu client NRO. |
| Kế hoạch Alpha có phạm vi nhỏ | Dùng để kiểm chứng lối chơi đầu tiên trước khi làm các hệ endgame. |

Trong trao đổi về bản đồ Minecraft từng có phác thảo **6 vùng chính và 59 vùng con/waypoint**: `giao_hoi`, `thien_phong`, `am_moc`, `hoa_hac`, `sao_xa`, `tuong_lai`. Đây là kho ý tưởng cho mở rộng thế giới, chưa phải cam kết dựng đủ 59 bản đồ web. Mỗi vùng đưa vào game phải có mục đích chơi, tuyến đường, quái/tài nguyên, nhiệm vụ và hiệu năng được kiểm chứng.

## Thiết kế lại do đổi nền tảng

| Trong bản Minecraft | Trong bản web |
| --- | --- |
| Paper/plugin, command, Citizens/Denizen, WorldEdit, Multiverse | Máy chủ game riêng, client trình duyệt, dữ liệu nội dung riêng và công cụ tạo/chỉnh bản đồ 2D. |
| Block, chunk, tọa độ và công trình Minecraft | Tile/địa hình 2D, va chạm, lớp vẽ, animation, camera và hiệu ứng phù hợp góc nhìn mới. |
| Giao diện inventory/chat mặc định | HUD, túi đồ, nhiệm vụ, bản đồ, kỹ năng, cửa hàng và onboarding thiết kế cho web. |
| Di chuyển/đánh theo cơ chế Minecraft | Điều khiển tám hướng, hitbox, mục tiêu, cooldown, hiệu ứng đòn và đồng bộ mạng do game định nghĩa. |
| Tài khoản Minecraft và dữ liệu server cũ | Tài khoản game riêng, lưu nhân vật và kiểm soát thay đổi item/tiền ở máy chủ. |

## Cần bổ sung cho sản phẩm độc lập

- Bộ hình và âm thanh có quyền sử dụng: nhân vật, quái, địa hình, vật phẩm, giao diện và animation.
- Quy trình build/test cho trình duyệt, tối ưu FPS và tải tài nguyên; sau đó mới thử điều khiển cảm ứng/mobile.
- Bảo mật tài khoản, chống sửa dữ liệu client, nhật ký giao dịch và khôi phục dữ liệu khi đưa online.
- Phân tích trải nghiệm người mới, thời gian farm, tỷ lệ thắng boss và cân bằng giữa người nạp/không nạp.
- Hạ tầng thanh toán, quy tắc giao hàng/hoàn tiền và vận hành shop khi có cổng thanh toán; bản local chưa có.

Tên nhân vật, quái, vật phẩm và hình ảnh của game khác trong tài liệu nghiên cứu cũ chỉ dùng để đối chiếu thiết kế. Nội dung phát hành của Mạch Giới cần là tài sản gốc hoặc có quyền sử dụng.
