import { AspectRatio } from './types';

export const POSES_PROMPTS: string[] = [
  "memegang produk pajangan dengan kedua tangan di depan dada, tersenyum hangat ke arah kamera.",
  "duduk santai di sofa, memegang produk pajangan dengan satu tangan di atas meja kopi di depannya.",
  "berdiri di dekat jendela dengan pencahayaan alami, memegang produk pajangan dengan satu tangan setinggi mata, menatapnya dengan fokus.",
  "menampilkan produk pajangan di telapak tangan yang terbuka, seolah-olah menawarkannya kepada pemirsa.",
  "menyandarkan produk pajangan di bahu sambil melihat ke samping dengan ekspresi ceria.",
  "sedang dalam proses menempatkan produk pajangan di rak buku, kedua tangan dengan hati-hati menyesuaikan posisinya.",
  "memegang produk pajangan dengan kedua tangan di dekat pinggang, dengan tubuh sedikit condong ke depan dan senyum ramah.",
  "close-up di mana produk pajangan dipegang dengan lembut oleh kedua tangan di dekat wajah, menyoroti detail produk.",
  "berjalan perlahan sambil membawa produk pajangan dengan hati-hati di kedua tangan, seolah-olah membawanya ke suatu tempat yang istimewa.",
  "duduk di lantai dengan latar belakang minimalis, produk pajangan diletakkan di pangkuan.",
  "memegang produk pajangan di atas kepala dengan kedua tangan dengan ekspresi gembira dan penuh kemenangan.",
  "berpose seolah-olah menjelaskan fitur produk, satu tangan menunjuk ke detail spesifik pada pajangan.",
];

export const backgroundOptions: Record<string, string> = {
    'Ruangan mewah dengan nuansa Islami, menampilkan pola geometris yang rumit, lengkungan yang elegan, dan pencahayaan yang lembut dan hangat': 'Ruang Tamu Islami Mewah',
    'Interior masjid modern dengan pilar-pilar megah, kaligrafi indah, dan karpet tebal yang luas': 'Interior Masjid Modern',
    'Halaman dalam sebuah istana Moorish dengan air mancur di tengah, ubin zellij yang berwarna-warni, dan taman yang rimbun': 'Halaman Istana Moorish',
    'Ruang belajar yang tenang dengan rak-rak buku berisi kitab-kitab Islami, sajadah, dan jendela yang menghadap ke taman': 'Ruang Belajar Islami',
    'Sebuah souk atau pasar tradisional di malam hari, diterangi oleh lentera-lentera Maroko yang tergantung': 'Pasar Malam Maroko',
    'Balkon mewah yang menghadap ke Ka\'bah di Mekah saat senja': 'Balkon Menghadap Ka\'bah',
    'A modern penthouse apartment with floor-to-ceiling windows overlooking a sprawling cityscape at dusk.': 'Apartemen Penthouse Modern',
    'A classic, opulent master bedroom with a luxurious four-poster bed, antique furniture, and a Persian rug.': 'Kamar Tidur Utama Klasik',
    'A grand home library with floor-to-ceiling bookshelves, leather armchairs, and a warm fireplace.': 'Perpustakaan Rumah Megah',
    'A formal dining room with a long, polished mahogany table set for a banquet under a glittering crystal chandelier.': 'Ruang Makan Formal',
    'A luxurious spa-like bathroom with a marble-clad bathtub, a large window with a nature view, and gold accents.': 'Spa/Kamar Mandi Mewah',
    'A beautiful white sand beach with turquoise water': 'Pantai Pasir Putih',
    'A lush green field with the Eiffel Tower in the background, Paris, France': 'Taman Menara Eiffel',
    'An infinity pool with clear blue water under a bright sunny sky': 'Kolam Renang Infinity',
    'A cozy indoor living room with a comfortable sofa': 'Ruang Tamu Nyaman',
    'A stylish indoor bedroom with soft lighting': 'Kamar Tidur Bergaya',
    'An outdoor flower garden bursting with colorful blooms': 'Taman Bunga',
    'A sleek, modern kitchen with stainless steel appliances and marble countertops.': 'Dapur Modern',
    'A futuristic cityscape at night, with towering skyscrapers and glowing neon signs.': 'Kota Futuristik (Malam)',
    'A tranquil Japanese zen garden with raked sand, mossy rocks, and a small koi pond.': 'Taman Zen Jepang',
    'The interior of a rustic wooden cabin, with a cozy stone fireplace and warm lighting.': 'Kabin Kayu Pedesaan',
    'A minimalist art gallery with clean white walls, polished concrete floors, and focused spotlights.': 'Galeri Seni Minimalis',
    'A vibrant and bustling street market in Marrakech, filled with colorful spices and lanterns.': 'Pasar Jalanan Maroko',
    'A luxurious hotel lobby with high ceilings, polished marble floors, and elegant chandeliers.': 'Lobi Hotel Mewah',
    'The surface of the planet Mars, with a rocky, red-orange landscape under a dusty sky.': 'Permukaan Planet Mars',
    'A serene underwater scene with a vibrant coral reef and colorful tropical fish.': 'Pemandangan Bawah Laut',
    'A grand, old library with floor-to-ceiling dark wood bookshelves and rolling ladders.': 'Perpustakaan Megah',
};

export const aspectRatioOptions: { value: AspectRatio; name: string }[] = [
    { value: '9:16', name: '9:16 (Vertikal)' },
    { value: '16:9', name: '16:9 (Horizontal)' },
    { value: '1:1', name: '1:1 (Persegi)' },
];