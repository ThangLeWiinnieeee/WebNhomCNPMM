import mongoose from 'mongoose';
import weddingPackageModel from '../models/wedding-package.model.js';
import 'dotenv/config';

/**
 * Seed data cho Wedding Packages
 * Dựa trên thông tin từ ảnh: COMBO HAPPY, STANDARD, SIGNATURE 1&2, DELUXE
 */

// Dữ liệu gói tiệc mẫu
const packagesData = [
  {
    name: 'COMBO HAPPY',
    slug: 'combo-happy',
    price: 20500000,
    discount: 2000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    ],
    services: [
      'Gói Happy',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO HAPPY - Gói tiệc cưới cơ bản với giá cả hợp lý, phù hợp cho các cặp đôi muốn có một ngày cưới đáng nhớ mà không quá tốn kém.

Gói tiệc này bao gồm đầy đủ các dịch vụ cần thiết cho một đám cưới hoàn chỉnh. Về phần trang trí hoa, bạn sẽ được cung cấp gói Hoa lụa cơ bản với các loại hoa tươi cao cấp như hoa hồng đỏ, hoa cẩm chướng, hoa cúc và hoa baby's breath được kết hợp hài hòa tạo nên những bó hoa cầm tay xinh xắn cho cô dâu và chú rể. Hoa trang trí bàn tiệc được sắp xếp tinh tế với các loại hoa hồng trắng, hoa ly và lá xanh tạo không gian lãng mạn.

Về phần váy cưới, gói này bao gồm thuê váy cưới loại A-line hoặc váy cưới kiểu cổ điển với chất liệu voan mềm mại, phù hợp cho các cô dâu yêu thích phong cách thanh lịch. Giá trị váy cưới trong gói này khoảng 8.000.000đ - 10.000.000đ. Váy được thiết kế với phần eo thon, tay áo dài hoặc không tay, có thể kèm theo đuôi váy dài tạo dáng uyển chuyển.

Các phụ kiện đi kèm bao gồm: vương miện cưới bằng pha lê hoặc kim cương giả, khuyên tai dài, vòng cổ ngọc trai, găng tay lụa trắng, giày cao gót màu trắng hoặc be, túi xách cưới nhỏ gọn. Ngoài ra còn có khăn choàng lụa, găng tay cưới và các phụ kiện trang điểm như bông tai, nhẫn cưới mẫu để chụp ảnh.

Về dịch vụ chụp ảnh, Gói Happy cung cấp dịch vụ chụp ảnh cưới cơ bản với 1 nhiếp ảnh gia chuyên nghiệp, thời gian chụp 4-6 giờ, bao gồm chụp tại nhà, chụp tại nhà thờ/đền chùa và chụp tại địa điểm tiệc. Bạn sẽ nhận được ít nhất 200-300 ảnh đã chỉnh sửa cơ bản, 50-80 ảnh chỉnh sửa kỹ và 1 album ảnh cứng chất lượng cao.

Với mức giá ưu đãi chỉ 20.500.000đ (giảm 2.000.000đ), bạn sẽ có được một ngày cưới trọn vẹn với đầy đủ các dịch vụ cần thiết từ trang trí hoa, váy cưới, phụ kiện đến chụp ảnh chuyên nghiệp.`,
    shortDescription: 'Gói tiệc cưới cơ bản với giá cả hợp lý, bao gồm chụp ảnh và trang trí hoa lụa.',
    isActive: true,
    tags: ['combo', 'happy', 'cơ bản', 'tiết kiệm'],
  },
  {
    name: 'COMBO STANDARD',
    slug: 'combo-standard',
    price: 25000000,
    discount: 2000000,
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    services: [
      'Gói Ảnh Cổng 2',
      'Gói Happy',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO STANDARD - Gói tiệc cưới tiêu chuẩn với nhiều dịch vụ hơn, phù hợp cho các cặp đôi muốn có một ngày cưới đầy đủ và chuyên nghiệp.

Gói tiệc này được nâng cấp với nhiều dịch vụ cao cấp hơn. Về phần trang trí hoa, Gói Hoa lụa cơ bản được mở rộng với các loại hoa cao cấp hơn như hoa hồng nhập khẩu từ Ecuador (màu đỏ, hồng, trắng), hoa peony (mẫu đơn), hoa ranunculus, hoa eustoma và các loại lá xanh trang trí như lá eucalyptus, lá ruscus. Hoa được sắp xếp thành các bó hoa cầm tay lớn hơn, hoa trang trí bàn tiệc được thiết kế theo phong cách châu Âu với các bình hoa cao cấp.

Về phần váy cưới, gói STANDARD bao gồm thuê váy cưới loại mermaid hoặc ball gown với chất liệu satin, lace hoặc tulle cao cấp. Váy có thể có đuôi dài từ 1-2 mét, phần thân được đính đá, sequin hoặc pha lê tạo độ lấp lánh. Giá trị váy cưới trong gói này khoảng 12.000.000đ - 15.000.000đ. Váy được thiết kế với nhiều kiểu dáng đa dạng, phù hợp với nhiều phong cách khác nhau từ cổ điển đến hiện đại.

Các phụ kiện đi kèm được nâng cấp bao gồm: vương miện cưới bằng pha lê Swarovski, khuyên tai kim cương giả hoặc ngọc trai cao cấp, vòng cổ ngọc trai hoặc kim cương giả nhiều lớp, găng tay lụa dài đến khuỷu tay, giày cao gót thiết kế riêng màu trắng/be/vàng, túi xách cưới thiết kế sang trọng. Ngoài ra còn có khăn choàng lụa/chiffon, găng tay cưới, nhẫn cưới mẫu vàng trắng, đồng hồ cưới, và bộ trang sức đầy đủ.

Về dịch vụ chụp ảnh, gói này bao gồm Gói Ảnh Cổng 2 với dịch vụ chụp ảnh cổng cưới chuyên nghiệp tại nhà cô dâu và chú rể, bao gồm chụp quá trình chuẩn bị, chụp lễ xin dâu, chụp lễ cưới tại nhà thờ/đền chùa. Kết hợp với Gói Happy, bạn sẽ có 2 nhiếp ảnh gia, thời gian chụp 8-10 giờ, nhận được ít nhất 400-500 ảnh đã chỉnh sửa, 100-150 ảnh chỉnh sửa kỹ, 2 album ảnh cứng và 1 video highlight 3-5 phút.

Với mức giá 25.000.000đ (giảm 2.000.000đ), gói này mang đến cho bạn một ngày cưới hoàn hảo với đầy đủ các dịch vụ từ chụp ảnh chuyên nghiệp đến trang trí hoa và váy cưới cao cấp.`,
    shortDescription: 'Gói tiệc cưới tiêu chuẩn với đầy đủ dịch vụ chụp ảnh và trang trí.',
    isActive: true,
    tags: ['combo', 'standard', 'tiêu chuẩn', 'đầy đủ'],
  },
  {
    name: 'COMBO SIGNATURE 1',
    slug: 'combo-signature-1',
    price: 33000000,
    discount: 3400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói VIP',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO SIGNATURE 1 - Gói tiệc cưới cao cấp với các dịch vụ signature và VIP, mang đến trải nghiệm sang trọng và đẳng cấp.

Gói tiệc này được thiết kế đặc biệt cho những cặp đôi yêu thích sự sang trọng và đẳng cấp. Về phần trang trí hoa, Gói Hoa lụa cơ bản được nâng cấp thành gói hoa cao cấp với các loại hoa nhập khẩu đặc biệt như hoa hồng David Austin (màu hồng phấn, trắng kem), hoa peony nhập khẩu từ Hà Lan, hoa ranunculus nhiều màu, hoa anemone, hoa sweet pea, hoa garden rose và các loại lá xanh cao cấp như lá eucalyptus silver dollar, lá ruscus, lá olive. Hoa được sắp xếp theo phong cách boho-chic hoặc classic European, tạo nên những bó hoa cầm tay lớn và sang trọng, hoa trang trí bàn tiệc được đặt trong các bình thủy tinh cao cấp hoặc bình gốm thiết kế riêng.

Về phần váy cưới, gói SIGNATURE 1 bao gồm thuê váy cưới designer cao cấp với các thương hiệu nổi tiếng. Váy có thể là kiểu ball gown với đuôi dài 2-3 mét, kiểu mermaid với phần đuôi xòe, hoặc kiểu A-line với thiết kế cổ điển. Chất liệu sử dụng là satin cao cấp, tulle mềm mại, lace tinh xảo hoặc silk. Váy được đính đá Swarovski, sequin, pha lê và các chi tiết thêu tay tinh xảo. Giá trị váy cưới trong gói này khoảng 18.000.000đ - 25.000.000đ. Váy được thiết kế độc quyền hoặc từ các bộ sưu tập mới nhất của các nhà thiết kế nổi tiếng.

Các phụ kiện đi kèm cực kỳ sang trọng bao gồm: vương miện cưới bằng pha lê Swarovski thiết kế độc quyền, khuyên tai kim cương giả hoặc ngọc trai cao cấp dài đến vai, vòng cổ nhiều lớp bằng kim cương giả hoặc ngọc trai, găng tay lụa dài đến khuỷu tay hoặc dài đến vai, giày cao gót thiết kế riêng từ các thương hiệu nổi tiếng (Jimmy Choo, Manolo Blahnik style), túi xách cưới thiết kế sang trọng. Ngoài ra còn có khăn choàng lụa/chiffon/satin cao cấp, găng tay cưới, nhẫn cưới mẫu vàng trắng/platinum, đồng hồ cưới cao cấp, bộ trang sức đầy đủ, và cả phụ kiện cho chú rể như cà vạt, khăn tay, đồng hồ.

Về dịch vụ chụp ảnh, Gói Signature cung cấp dịch vụ chụp ảnh cưới signature độc quyền với đội ngũ 2-3 nhiếp ảnh gia chuyên nghiệp có nhiều năm kinh nghiệm, 1-2 quay phim, thời gian chụp 10-12 giờ từ sáng sớm đến tối muộn. Bao gồm chụp pre-wedding tại các địa điểm đẹp, chụp tại nhà, chụp lễ cưới, chụp tiệc. Bạn sẽ nhận được ít nhất 600-800 ảnh đã chỉnh sửa chuyên nghiệp, 200-300 ảnh chỉnh sửa kỹ theo phong cách riêng, 2-3 album ảnh cứng cao cấp, 1 video highlight 5-7 phút, 1 video full wedding 30-60 phút, và các ảnh raw để lưu trữ.

Gói VIP đi kèm cung cấp nhiều ưu đãi đặc biệt như tư vấn miễn phí, hỗ trợ lên kế hoạch, giảm giá các dịch vụ bổ sung, và nhiều dịch vụ khác. Với mức giá 33.000.000đ (giảm 3.400.000đ), gói này mang đến cho bạn một ngày cưới đẳng cấp với các dịch vụ cao cấp nhất từ hoa, váy cưới, phụ kiện đến chụp ảnh chuyên nghiệp.`,
    shortDescription: 'Gói tiệc cưới cao cấp với dịch vụ Signature và VIP, mang đến trải nghiệm sang trọng.',
    isActive: true,
    tags: ['combo', 'signature', 'vip', 'cao cấp', 'sang trọng'],
  },
  {
    name: 'COMBO SIGNATURE 2',
    slug: 'combo-signature-2',
    price: 41000000,
    discount: 4400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói VIP',
      'Gói Hoa lụa cơ bản x 2',
    ],
    description: `COMBO SIGNATURE 2 - Gói tiệc cưới cao cấp nâng cấp với gấp đôi dịch vụ trang trí hoa, phù hợp cho các tiệc cưới lớn và sang trọng.

Gói tiệc này là phiên bản nâng cấp của SIGNATURE 1, được thiết kế đặc biệt cho các tiệc cưới lớn với không gian rộng và yêu cầu trang trí nhiều hơn. Về phần trang trí hoa, Gói Hoa lụa cơ bản x 2 cung cấp gấp đôi số lượng hoa so với gói cơ bản. Bạn sẽ được cung cấp các loại hoa nhập khẩu cao cấp nhất như hoa hồng David Austin nhiều màu (hồng phấn, trắng kem, vàng nhạt), hoa peony nhập khẩu từ Hà Lan với kích thước lớn, hoa ranunculus nhiều màu sắc, hoa anemone, hoa sweet pea, hoa garden rose, hoa dahlias, và các loại lá xanh cao cấp như lá eucalyptus silver dollar, lá ruscus, lá olive, lá eucalyptus cinerea.

Hoa được sắp xếp thành các bó hoa cầm tay lớn và sang trọng cho cô dâu, chú rể, phù dâu và phù rể. Hoa trang trí bàn tiệc được đặt tại tất cả các bàn với các bình hoa cao cấp, hoa trang trí cổng chào, hoa trang trí sân khấu, hoa trang trí lối đi, hoa trang trí backdrop chụp ảnh, và các điểm trang trí khác trong không gian tiệc. Tổng số điểm trang trí hoa có thể lên đến 15-20 điểm, tạo nên một không gian tiệc cưới cực kỳ lộng lẫy và sang trọng.

Về phần váy cưới, gói SIGNATURE 2 bao gồm thuê váy cưới designer cao cấp nhất với các thương hiệu nổi tiếng quốc tế. Váy có thể là kiểu ball gown với đuôi dài 3-4 mét, kiểu mermaid với phần đuôi xòe rộng, hoặc kiểu A-line với thiết kế cổ điển sang trọng. Chất liệu sử dụng là satin cao cấp nhập khẩu, tulle mềm mại, lace tinh xảo từ Pháp, hoặc silk cao cấp. Váy được đính đá Swarovski, sequin, pha lê và các chi tiết thêu tay tinh xảo bởi các nghệ nhân lành nghề. Giá trị váy cưới trong gói này khoảng 25.000.000đ - 35.000.000đ. Váy được thiết kế độc quyền hoặc từ các bộ sưu tập mới nhất của các nhà thiết kế nổi tiếng như Vera Wang, Pronovias, hoặc các nhà thiết kế Việt Nam hàng đầu.

Các phụ kiện đi kèm cực kỳ sang trọng và đầy đủ bao gồm: vương miện cưới bằng pha lê Swarovski thiết kế độc quyền với nhiều chi tiết tinh xảo, khuyên tai kim cương giả hoặc ngọc trai cao cấp dài đến vai với thiết kế phức tạp, vòng cổ nhiều lớp bằng kim cương giả hoặc ngọc trai với các lớp chồng lên nhau, găng tay lụa dài đến khuỷu tay hoặc dài đến vai, giày cao gót thiết kế riêng từ các thương hiệu nổi tiếng (Jimmy Choo, Manolo Blahnik, Christian Louboutin style), túi xách cưới thiết kế sang trọng. Ngoài ra còn có khăn choàng lụa/chiffon/satin cao cấp, găng tay cưới, nhẫn cưới mẫu vàng trắng/platinum, đồng hồ cưới cao cấp, bộ trang sức đầy đủ, và cả phụ kiện cho chú rể như cà vạt, khăn tay, đồng hồ, và có thể bao gồm cả phụ kiện cho phù dâu và phù rể.

Về dịch vụ chụp ảnh, Gói Signature cung cấp dịch vụ chụp ảnh cưới signature độc quyền với đội ngũ 3-4 nhiếp ảnh gia chuyên nghiệp có nhiều năm kinh nghiệm và từng đoạt giải thưởng, 2-3 quay phim, thời gian chụp 12-14 giờ từ sáng sớm đến tối muộn. Bao gồm chụp pre-wedding tại các địa điểm đẹp trong và ngoài nước, chụp tại nhà, chụp lễ cưới, chụp tiệc với nhiều góc độ khác nhau. Bạn sẽ nhận được ít nhất 800-1000 ảnh đã chỉnh sửa chuyên nghiệp, 300-400 ảnh chỉnh sửa kỹ theo phong cách riêng và độc đáo, 3-4 album ảnh cứng cao cấp với bìa da hoặc bìa gỗ, 1 video highlight 7-10 phút, 1 video full wedding 60-90 phút, các ảnh raw để lưu trữ, và có thể bao gồm cả dịch vụ drone để quay từ trên cao.

Gói VIP đi kèm cung cấp nhiều ưu đãi đặc biệt như tư vấn miễn phí không giới hạn, hỗ trợ lên kế hoạch chi tiết, giảm giá các dịch vụ bổ sung, ưu tiên đặt lịch, và nhiều dịch vụ khác. Với mức giá 41.000.000đ (giảm 4.400.000đ), gói này được thiết kế đặc biệt cho các tiệc cưới lớn với không gian rộng, cần nhiều điểm trang trí hoa và các dịch vụ cao cấp nhất.`,
    shortDescription: 'Gói tiệc cưới cao cấp với dịch vụ Signature, VIP và trang trí hoa gấp đôi.',
    isActive: true,
    tags: ['combo', 'signature', 'vip', 'cao cấp', 'lớn', 'sang trọng'],
  },
  {
    name: 'COMBO DELUXE',
    slug: 'combo-deluxe',
    price: 45000000,
    discount: 7400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói DELUXE',
      'Gói Hoa lụa cơ bản x 2',
    ],
    description: `COMBO DELUXE - Gói tiệc cưới cao cấp nhất với đầy đủ các dịch vụ deluxe, mang đến trải nghiệm xa hoa và đẳng cấp nhất.

Gói tiệc này là gói cao cấp nhất, được thiết kế đặc biệt cho những cặp đôi muốn có một ngày cưới hoàn hảo và xa hoa nhất với mọi chi tiết đều được chăm chút tỉ mỉ. Về phần trang trí hoa, Gói Hoa lụa cơ bản x 2 được nâng cấp thành gói hoa deluxe với các loại hoa nhập khẩu đặc biệt và hiếm có. Bạn sẽ được cung cấp các loại hoa cao cấp nhất như hoa hồng David Austin nhiều màu với kích thước lớn (hồng phấn, trắng kem, vàng nhạt, đỏ thẫm), hoa peony nhập khẩu từ Hà Lan với kích thước cực lớn và màu sắc đa dạng, hoa ranunculus nhiều màu sắc rực rỡ, hoa anemone với các màu độc đáo, hoa sweet pea thơm ngát, hoa garden rose với hương thơm đặc biệt, hoa dahlias với kích thước lớn, hoa lisianthus, hoa freesia, và các loại lá xanh cao cấp như lá eucalyptus silver dollar, lá ruscus, lá olive, lá eucalyptus cinerea, lá pittosporum.

Hoa được sắp xếp theo phong cách luxury với các bó hoa cầm tay cực kỳ lớn và sang trọng cho cô dâu, chú rể, toàn bộ phù dâu và phù rể (có thể lên đến 8-10 người). Hoa trang trí bàn tiệc được đặt tại tất cả các bàn với các bình hoa cao cấp thiết kế riêng, hoa trang trí cổng chào lớn và lộng lẫy, hoa trang trí sân khấu với backdrop hoa tươi, hoa trang trí lối đi với thảm hoa, hoa trang trí backdrop chụp ảnh với nhiều tầng, hoa trang trí bàn đón khách, hoa trang trí bàn đăng ký, hoa trang trí khu vực chụp ảnh, và các điểm trang trí khác trong không gian tiệc. Tổng số điểm trang trí hoa có thể lên đến 25-30 điểm, tạo nên một không gian tiệc cưới cực kỳ lộng lẫy, sang trọng và đẳng cấp quốc tế.

Về phần váy cưới, gói DELUXE bao gồm thuê váy cưới designer cao cấp nhất với các thương hiệu nổi tiếng quốc tế hàng đầu. Váy có thể là kiểu ball gown với đuôi dài 4-5 mét, kiểu mermaid với phần đuôi xòe rộng và dài, hoặc kiểu A-line với thiết kế cổ điển sang trọng nhất. Chất liệu sử dụng là satin cao cấp nhập khẩu từ Ý, tulle mềm mại từ Pháp, lace tinh xảo từ Pháp hoặc Bỉ, hoặc silk cao cấp từ Trung Quốc. Váy được đính đá Swarovski, sequin, pha lê và các chi tiết thêu tay tinh xảo bởi các nghệ nhân lành nghề với thời gian làm việc hàng trăm giờ. Giá trị váy cưới trong gói này khoảng 35.000.000đ - 50.000.000đ. Váy được thiết kế độc quyền hoặc từ các bộ sưu tập mới nhất và cao cấp nhất của các nhà thiết kế nổi tiếng quốc tế như Vera Wang, Pronovias, Elie Saab, hoặc các nhà thiết kế Việt Nam hàng đầu như Đỗ Mạnh Cường, Lê Thanh Hòa.

Các phụ kiện đi kèm cực kỳ sang trọng, đầy đủ và cao cấp nhất bao gồm: vương miện cưới bằng pha lê Swarovski thiết kế độc quyền với nhiều chi tiết tinh xảo và đá quý, khuyên tai kim cương giả hoặc ngọc trai cao cấp dài đến vai với thiết kế phức tạp và nhiều lớp, vòng cổ nhiều lớp bằng kim cương giả hoặc ngọc trai với các lớp chồng lên nhau tạo độ sang trọng, găng tay lụa dài đến khuỷu tay hoặc dài đến vai với chất liệu cao cấp, giày cao gót thiết kế riêng từ các thương hiệu nổi tiếng (Jimmy Choo, Manolo Blahnik, Christian Louboutin style) hoặc giày thiết kế riêng, túi xách cưới thiết kế sang trọng từ các thương hiệu cao cấp. Ngoài ra còn có khăn choàng lụa/chiffon/satin cao cấp, găng tay cưới, nhẫn cưới mẫu vàng trắng/platinum, đồng hồ cưới cao cấp từ các thương hiệu nổi tiếng, bộ trang sức đầy đủ với nhiều món, và cả phụ kiện cho chú rể như cà vạt, khăn tay, đồng hồ, và có thể bao gồm cả phụ kiện cho toàn bộ phù dâu và phù rể với số lượng lớn.

Về dịch vụ chụp ảnh, Gói Signature cung cấp dịch vụ chụp ảnh cưới signature độc quyền với đội ngũ 4-5 nhiếp ảnh gia chuyên nghiệp có nhiều năm kinh nghiệm và từng đoạt giải thưởng quốc tế, 3-4 quay phim chuyên nghiệp, thời gian chụp 14-16 giờ từ sáng sớm đến tối muộn. Bao gồm chụp pre-wedding tại các địa điểm đẹp trong và ngoài nước với nhiều concept khác nhau, chụp tại nhà với nhiều góc độ, chụp lễ cưới với nhiều camera, chụp tiệc với nhiều góc độ khác nhau và các khoảnh khắc đặc biệt. Bạn sẽ nhận được ít nhất 1000-1500 ảnh đã chỉnh sửa chuyên nghiệp, 400-500 ảnh chỉnh sửa kỹ theo phong cách riêng và độc đáo, 4-5 album ảnh cứng cao cấp với bìa da hoặc bìa gỗ sang trọng, 1 video highlight 10-15 phút với nhiều hiệu ứng đặc biệt, 1 video full wedding 90-120 phút với nhiều góc quay, các ảnh raw để lưu trữ, dịch vụ drone để quay từ trên cao với nhiều cảnh quay đẹp, và có thể bao gồm cả dịch vụ quay phim chuyên nghiệp với nhiều camera.

Gói DELUXE đi kèm cung cấp nhiều ưu đãi đặc biệt nhất như tư vấn miễn phí không giới hạn với các chuyên gia hàng đầu, hỗ trợ lên kế hoạch chi tiết từ A-Z, giảm giá các dịch vụ bổ sung, ưu tiên đặt lịch, dịch vụ chăm sóc khách hàng VIP, và nhiều dịch vụ khác đặc biệt. Với mức giá 45.000.000đ (giảm 7.400.000đ), đây là gói tiệc cưới cao cấp nhất, phù hợp cho những cặp đôi muốn có một ngày cưới hoàn hảo và xa hoa nhất với mọi chi tiết đều được chăm chút tỉ mỉ từ hoa, váy cưới, phụ kiện đến chụp ảnh chuyên nghiệp.`,
    shortDescription: 'Gói tiệc cưới deluxe cao cấp nhất với đầy đủ dịch vụ signature, deluxe và trang trí hoa gấp đôi.',
    isActive: true,
    tags: ['combo', 'deluxe', 'signature', 'cao cấp nhất', 'xa hoa', 'đẳng cấp'],
  },
];

/**
 * Hàm seed dữ liệu wedding packages
 */
const seedWeddingPackages = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa tất cả packages cũ
    await weddingPackageModel.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ');

    // Tạo packages mới
    for (const packageData of packagesData) {
      const newPackage = new weddingPackageModel(packageData);
      await newPackage.save();
      console.log(`✅ Đã tạo gói: ${packageData.name}`);
    }

    console.log('✅ Hoàn thành seed wedding packages!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed wedding packages:', error);
    process.exit(1);
  }
};


seedWeddingPackages();

