export const WORLD_SIZE = { width: 1600, height: 1000 };

export const RACES = {
  thien_phong: { name: 'Thiên Phong', color: '#61c9ff', skill: 'Thiên Lôi Xung', description: 'Dồn sát thương lên một mục tiêu.', hp: 120, ki: 110, attack: 15 },
  am_moc: { name: 'Âm Mộc', color: '#8adf8a', skill: 'Tái Sinh Linh Lực', description: 'Hồi phục và sống sót bền bỉ.', hp: 145, ki: 100, attack: 11 },
  hoa_hac: { name: 'Hỏa Hắc', color: '#ff9872', skill: 'Hỏa Liên Chưởng', description: 'Đánh liên tục, mạnh khi solo.', hp: 135, ki: 100, attack: 13 }
};

export const MAPS = {
  giao_hoi: { name: 'Giao Hội', tint: '#6d9b6d', ground: '#70976d', safe: true, spawn: [800, 520], portals: [
    { x: 280, y: 250, to: 'thien_phong', label: 'Thiên Phong' },
    { x: 1320, y: 250, to: 'am_moc', label: 'Âm Mộc' },
    { x: 320, y: 820, to: 'hoa_hac', label: 'Hỏa Hắc' },
    { x: 1290, y: 820, to: 'arena', label: 'Đấu trường', quest: 5 }
  ], npcs: [{ x: 770, y: 370, name: 'Người Gìn Mạch', role: 'guide' }, { x: 1000, y: 620, name: 'Thợ Rèn Lưu', role: 'smith' }] },
  thien_phong: { name: 'Đỉnh Thiên Phong', tint: '#729bb6', ground: '#68939b', spawn: [800, 820], portals: [{ x: 800, y: 920, to: 'giao_hoi', label: 'Giao Hội' }], npcs: [{ x: 400, y: 330, name: 'Đạo Sư Lôi', role: 'mentor' }] },
  am_moc: { name: 'Rừng Âm Mộc', tint: '#628f67', ground: '#5d8c5e', spawn: [800, 820], portals: [{ x: 800, y: 920, to: 'giao_hoi', label: 'Giao Hội' }], npcs: [{ x: 1190, y: 300, name: 'Dược Sư Mộc', role: 'mentor' }] },
  hoa_hac: { name: 'Hỏa Hắc Cốc', tint: '#9d7762', ground: '#907162', spawn: [800, 820], portals: [{ x: 800, y: 920, to: 'giao_hoi', label: 'Giao Hội' }], npcs: [{ x: 390, y: 330, name: 'Hộ Vệ Hỏa', role: 'mentor' }] },
  arena: { name: 'Đấu trường Tam Giới', tint: '#7f788e', ground: '#77738a', spawn: [800, 820], portals: [{ x: 800, y: 920, to: 'giao_hoi', label: 'Giao Hội' }], npcs: [] }
};

export const QUESTS = [
  { id: 1, title: 'Dấu ấn khởi hành', description: 'Chọn một tộc để bắt đầu hành trình.', target: 1, reward: { gold: 30, exp: 20 } },
  { id: 2, title: 'Khí mạch thức tỉnh', description: 'Dùng kỹ năng của tộc 3 lần.', target: 3, reward: { gold: 50, exp: 35 } },
  { id: 3, title: 'Dị thú quanh vùng', description: 'Hạ 8 dị thú ở một trong ba vùng tộc.', target: 8, reward: { gold: 90, exp: 70 } },
  { id: 4, title: 'Lưỡi thép đầu tiên', description: 'Thu 5 gỗ rồi nâng vũ khí lên 1 sao.', target: 1, reward: { gold: 120, exp: 90 } },
  { id: 5, title: 'Vết nứt Mạch Giới', description: 'Đánh bại Thủ Hộ Tam Giới trong đấu trường.', target: 1, reward: { gold: 300, exp: 240, item: 'core_shard' } }
];

export const ITEMS = {
  wood: { name: 'Gỗ mạch', icon: '🪵', rarity: 'common' },
  ore: { name: 'Quặng linh', icon: '🪨', rarity: 'common' },
  herb: { name: 'Lá hồi sinh', icon: '🌿', rarity: 'common' },
  mob_essence: { name: 'Tinh chất dị thú', icon: '✦', rarity: 'uncommon' },
  core_shard: { name: 'Mảnh Lõi Nguyên Mạch', icon: '◆', rarity: 'epic' },
  potion: { name: 'Bình hồi phục', icon: '🧪', rarity: 'common' }
};

export const SHOP = [
  { id: 'starter', name: 'Gói Khởi Hành', description: 'Vũ khí đúng tộc, vật liệu và trang phục.', contents: 'Vũ khí +1, 30 gỗ, 20 quặng, ngoại hình', priceLabel: 'Chưa mở bán' },
  { id: 'monthly', name: 'Gói Tháng', description: 'Thưởng mỗi ngày và tiện ích hành trình.', contents: '30 ngày thưởng, ô kho, dịch chuyển', priceLabel: 'Chưa mở bán' },
  { id: 'growth', name: 'Gói Phá Giới', description: 'Hỗ trợ phát triển theo mốc nhân vật.', contents: 'Vũ khí theo mốc, vật liệu, ngoại hình', priceLabel: 'Chưa mở bán' },
  { id: 'season', name: 'Pass Mùa', description: 'Tuyến phần thưởng miễn phí và trả phí.', contents: 'Trang phục, nguyên liệu, vật phẩm', priceLabel: 'Chưa mở bán' }
];

export const STORY = [
  { title: 'Vết Nứt Mạch Giới', text: 'Lõi Nguyên Mạch tại Giao Hội đã vỡ. Dị thú tràn ra từ ba vùng đất và các tộc nghi ngờ lẫn nhau. Bạn là người có thể nghe tiếng vọng của lõi. Hãy chọn con đường tu luyện và tìm nguyên nhân của vết nứt.' },
  { title: 'Dấu ấn Vô Mạch', text: 'Thủ Hộ Tam Giới đã ngã xuống. Trong lớp giáp của nó là dấu ấn Hội Vô Mạch: một tổ chức đang thu gom các mảnh lõi để mở Vực Rỗng. Hành trình thực sự mới bắt đầu.' }
];
