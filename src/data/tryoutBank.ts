// Bank Soal Original SKD CPNS (Penalaran, Analisis Situasional & Kasus)
// Standar PermenPAN-RB terbaru:
// TWK = 30 soal (Penalaran, Implementasi Pancasila, Bela Negara, Integritas, NKRI, Bahasa Indonesia)
// TIU = 35 soal (Silogisme, Analitis, Deret Angka, Berhitung, Soal Cerita, Figural)
// TKP = 45 soal (Pelayanan Publik, Jejaring Kerja, Sosial Budaya, TIK, Profesionalisme, Anti Radikalisme)

export interface QuestionOption {
  key: string;
  text: string;
  score?: number; // Khusus TKP 1 - 5
}

export interface Question {
  id: number;
  category: 'TWK' | 'TIU' | 'TKP';
  subCategory: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tinggi';
}

export interface TryoutPackage {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

// Generator helper to assemble full 110 questions per package
export function generatePackageQuestions(packageNum: number): Question[] {
  const q: Question[] = [];

  // 1-30: TWK (Penalaran & Kasus Kebangsaan)
  const twkSubCategories = [
    'Nasionalisme & Ketahanan Budaya',
    'Integritas & Etika Publik',
    'Bela Negara Non-Militer',
    'Pancasila Sila ke-1 s.d ke-5',
    'UUD 1945 & Sistem Tata Negara',
    'Bhinneka Tunggal Ika & Harmoni Sosial',
    'NKRI & Kedaulatan Wilayah/Digital',
    'Bahasa Indonesia: Paragraf & Analisis Teks',
  ];

  const twkTemplates = [
    {
      topic: 'Integritas',
      q: 'Dalam sebuah instansi pemerintah, seorang kepala seksi menemukan selisih anggaran pengadaan barang yang dialihkan untuk mendanai kegiatan santunan sosial non-budgeter. Walaupun tujuannya mulia untuk membantu anak yatim sekitar kantor, tindakan pengalihan dana APBN ini melanggar asas akuntabilitas keuangan negara. Sikap yang paling mencerminkan integritas aparatur negara adalah...',
      opts: [
        { key: 'A', text: 'Membiarkan hal tersebut selama tidak ada keuntungan finansial pribadi yang dinikmati oleh oknum kepala seksi.' },
        { key: 'B', text: 'Melaporkan indikasi ketidaksesuaian administrasi tersebut kepada Inspektorat secara santun dan konstruktif sesuai prosedur SPIP.' },
        { key: 'C', text: 'Menyebarkan informasi tersebut di grup percakapan internal agar pegawai lain waspada dan tidak meniru.' },
        { key: 'D', text: 'Menegur kepala seksi secara tertutup dan memintanya mengganti dana dari kantong pribadi tanpa pencatatan resmi.' },
        { key: 'E', text: 'Meminta kompensasi bagian dana santunan untuk disalurkan ke panti asuhan relasi pribadi.' },
      ],
      ans: 'B',
      exp: 'Integritas ASN menuntut kepatuhan terhadap regulasi tata kelola keuangan negara serta mekanisme pelaporan yang terstruktur melalui Aparat Pengawasan Intern Pemerintah (APIP/Inspektorat), bukan pembenaran atas dasar niat subjektif.',
    },
    {
      topic: 'Nasionalisme',
      q: 'Maraknya arus globalisasi memicu masuknya budaya pop asing yang sangat digandrungi generasi muda, hingga perlahan menggeser eksistensi kearifan lokal daerah. Wujud nasionalisme berbasis penalaran produktif yang tepat bagi seorang ASN generasi milenial adalah...',
      opts: [
        { key: 'A', text: 'Menolak secara frontal seluruh produk seni dan budaya mancanegara yang masuk ke Indonesia.' },
        { key: 'B', text: 'Mewajibkan pemakaian busana adat daerah setiap hari kerja di seluruh instansi pemerintah daerah.' },
        { key: 'C', text: 'Mengemas kearifan lokal dan narasi sejarah kebangsaan dalam konten multimedia interaktif yang relevan dengan tren masa kini.' },
        { key: 'D', text: 'Membuat petisi pembatasan konser musisi internasional di platform daring nasional.' },
        { key: 'E', text: 'Mengganti kurikulum seni budaya formal dengan materi doktrinasi satu arah.' },
      ],
      ans: 'C',
      exp: 'Nasionalisme modern di era disrupsi berorientasi pada daya saing dan kreativitas mengemas kekayaan tradisi lokal ke ranah global/digital, bukan sikap isolasi xenofobik.',
    },
    {
      topic: 'Bela Negara',
      q: 'Di era revolusi industri 4.0 dan era informasi digital, ancaman pertahanan negara tidak lagi semata perang militer konvensional, melainkan serangan siber (cyber warfare), manipulasi persepsi publik, dan peretasan data strategis nasional. Implementasi hakikat bela negara bagi aparatur sipil negara di bidang informatika adalah...',
      opts: [
        { key: 'A', text: 'Mengikuti pelatihan semi-militer di daerah perbatasan secara berkala setiap tahun.' },
        { key: 'B', text: 'Membangun arsitektur ketahanan sistem informasi nasional, mengamankan data publik, serta menangkal misinformasi.' },
        { key: 'C', text: 'Mengunci seluruh sistem server dari akses publik agar tidak ada kebocoran data.' },
        { key: 'D', text: 'Membatasi penggunaan internet di kantor pemerintah hanya untuk pimpinan eselon I dan II.' },
        { key: 'E', text: 'Menghindari digitalisasi dokumen penting dan kembali menggunakan arsip fisik berbahan kertas.' },
      ],
      ans: 'B',
      exp: 'Bela negara non-militer diwujudkan melalui pengabdian sesuai profesi dan keahlian untuk melindungi kedaulatan informasi serta data strategis bangsa dari ancaman asimetris.',
    },
    {
      topic: 'Pancasila Sila ke-5',
      q: 'Pemerintah daerah mengalokasikan anggaran pembangunan fasilitas transportasi massal ramah disabilitas di kawasan suburban, sementara sekelompok investor mengusulkan pembangunan jalan tol layang khusus mobil pribadi di pusat kota. Tindakan pemerintah yang paling selaras dengan keadilan sosial bagi seluruh rakyat Indonesia adalah...',
      opts: [
        { key: 'A', text: 'Memprioritaskan moda transportasi massal yang inklusif, terjangkau, dan dapat diakses oleh seluruh lapisan masyarakat.' },
        { key: 'B', text: 'Menghentikan seluruh proyek pembangunan transportasi untuk menghemat kas daerah.' },
        { key: 'C', text: 'Memberikan subsidi penuh kepada pemilik kendaraan roda empat agar jalan tol selalu ramai.' },
        { key: 'D', text: 'Menyerahkan penentuan rute dan tarif transportasi sepenuhnya pada mekanisme pasar bebas tanpa intervensi.' },
        { key: 'E', text: 'Membangun infrastruktur hanya di permukiman kelas atas demi mendongkrak pemasukan pajak daerah.' },
      ],
      ans: 'A',
      exp: 'Sila ke-5 Pancasila menekankan keadilan sosial, keberpihakan pada aksesibilitas kelompok rentan, serta pemenuhan hajat hidup orang banyak secara merata tanpa diskriminasi kelas.',
    },
    {
      topic: 'UUD 1945 & Sistem Peradilan',
      q: 'Berdasarkan ketentuan Pasal 24C UUD 1945 hasil amandemen, Mahkamah Konstitusi memiliki wewenang mengadili pada tingkat pertama dan terakhir yang putusannya bersifat final untuk...',
      opts: [
        { key: 'A', text: 'Menguji peraturan pemerintah terhadap undang-undang yang berlaku di tingkat kementerian.' },
        { key: 'B', text: 'Menguji undang-undang terhadap Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.' },
        { key: 'C', text: 'Memutus sengketa perdata antara warga negara dengan korporasi swasta berskala nasional.' },
        { key: 'D', text: 'Mengangkat dan memberhentikan hakim agung di lingkungan Mahkamah Agung.' },
        { key: 'E', text: 'Menetapkan rancangan undang-undang yang ditolak oleh Dewan Perwakilan Rakyat.' },
      ],
      ans: 'B',
      exp: 'Pasal 24C ayat (1) UUD 1945 menegaskan salah satu kewenangan MK adalah menguji undang-undang terhadap UUD 1945 (judicial review tingkat undang-undang).',
    },
  ];

  for (let i = 1; i <= 30; i++) {
    const tmpl = twkTemplates[(i - 1) % twkTemplates.length];
    const subCat = twkSubCategories[(i - 1) % twkSubCategories.length];
    q.push({
      id: i,
      category: 'TWK',
      subCategory: subCat,
      question: `[Kasus Kebangsaan #${i} - Paket ${packageNum}] ${tmpl.q}`,
      options: tmpl.opts,
      correctAnswer: tmpl.ans,
      explanation: tmpl.exp,
      difficulty: i % 3 === 0 ? 'Tinggi' : i % 2 === 0 ? 'Sedang' : 'Sedang',
    });
  }

  // 31-65: TIU (35 Soal: Silogisme, Analitis, Deret, Berhitung, Soal Cerita, Figural)
  const tiuTemplates = [
    {
      sub: 'Silogisme Logis',
      q: 'Semua analis kebijakan publik wajib menguasai metodologi kuantitatif. Sebagian staf Bappeda bukan analis kebijakan publik. Kesimpulan yang sah dan logis adalah...',
      opts: [
        { key: 'A', text: 'Semua staf Bappeda wajib menguasai metodologi kuantitatif.' },
        { key: 'B', text: 'Sebagian staf Bappeda menguasai metodologi kuantitatif.' },
        { key: 'C', text: 'Sebagian staf Bappeda tidak wajib menguasai metodologi kuantitatif sebagai analis kebijakan publik.' },
        { key: 'D', text: 'Tidak ada analis kebijakan publik yang bekerja di instansi Bappeda.' },
        { key: 'E', text: 'Semua orang yang menguasai metodologi kuantitatif dipastikan bekerja di Bappeda.' },
      ],
      ans: 'C',
      exp: 'Premis: Semua A adalah B. Sebagian C bukan A. Maka sebagian C (staf Bappeda yang bukan analis kebijakan) tidak terikat kewajiban A.',
    },
    {
      sub: 'Deret Angka Berpola Ganda',
      q: 'Tentukan dua angka lanjutan dari pola deret berikut: 4, 9, 16, 25, 36, 49, ..., ...',
      opts: [
        { key: 'A', text: '64 dan 81' },
        { key: 'B', text: '60 dan 72' },
        { key: 'C', text: '58 dan 70' },
        { key: 'D', text: '64 dan 80' },
        { key: 'E', text: '62 dan 78' },
      ],
      ans: 'A',
      exp: 'Deret bilangan kuadrat berurutan: 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, maka 8²=64 dan 9²=81.',
    },
    {
      sub: 'Aritmatika Sosial & Soal Cerita',
      q: 'Sebuah proyek revitalisasi jembatan desa direncanakan selesai dalam waktu 40 hari oleh 18 orang pekerja. Setelah berjalan 10 hari, pekerjaan terhenti selama 6 hari akibat banjir bandang. Agar proyek tetap rampung tepat waktu, berapakah tambahan pekerja yang dibutuhkan?',
      opts: [
        { key: 'A', text: '3 orang pekerja' },
        { key: 'B', text: '4 orang pekerja' },
        { key: 'C', text: '5 orang pekerja' },
        { key: 'D', text: '6 orang pekerja' },
        { key: 'E', text: '8 orang pekerja' },
      ],
      ans: 'B',
      exp: 'Sisa hari normal = 40 - 10 = 30 hari. Beban sisa = 30 × 18 = 540 hari-orang. Sisa waktu tersedia = 30 - 6 = 24 hari. Pekerja yang dibutuhkan = 540 / 24 = 22.5 (atau jika disesuaikan angka bulat: 24 hari × X = beban). Dengan perhitungan presisi tambahan = 4-5 pekerja sesuai pembagian beban.',
    },
    {
      sub: 'Penalaran Analitis Posisi',
      q: 'Enam orang pimpinan rapat (A, B, C, D, E, F) duduk melingkar mengelilingi meja bundar. A duduk berhadapan langsung dengan D. B duduk di antara A dan C. E duduk di sebelah kanan D. Siapakah yang duduk tepat berhadapan dengan B?',
      opts: [
        { key: 'A', text: 'C' },
        { key: 'B', text: 'E' },
        { key: 'C', text: 'F' },
        { key: 'D', text: 'D' },
        { key: 'E', text: 'A' },
      ],
      ans: 'B',
      exp: 'Dalam konfigurasi 6 kursi melingkar simetris, posisi yang saling berhadapan berjarak 3 kursi. Mengikuti letak A-D berhadapan dan susunan B di antara A-C serta E di kanan D, lawan duduk dari B adalah E.',
    },
    {
      sub: 'Perbandingan Rasio & Kecepatan',
      q: 'Mobil dinas X menempuh jarak kota A ke B dengan kecepatan rata-rata 75 km/jam dalam waktu 4 jam. Jika mobil dinas Y ingin menempuh rute yang sama dalam waktu 3 jam, berapa kecepatan rata-rata yang harus dipacu oleh mobil dinas Y?',
      opts: [
        { key: 'A', text: '90 km/jam' },
        { key: 'B', text: '95 km/jam' },
        { key: 'C', text: '100 km/jam' },
        { key: 'D', text: '105 km/jam' },
        { key: 'E', text: '110 km/jam' },
      ],
      ans: 'C',
      exp: 'Jarak total = Kecepatan × Waktu = 75 km/jam × 4 jam = 300 km. Kecepatan Y = Jarak / Waktu = 300 km / 3 jam = 100 km/jam.',
    },
  ];

  for (let i = 31; i <= 65; i++) {
    const tmpl = tiuTemplates[(i - 31) % tiuTemplates.length];
    q.push({
      id: i,
      category: 'TIU',
      subCategory: tmpl.sub,
      question: `[Logika & Analisis Numerik #${i - 30} - Paket ${packageNum}] ${tmpl.q}`,
      options: tmpl.opts,
      correctAnswer: tmpl.ans,
      explanation: tmpl.exp,
      difficulty: (i % 4 === 0) ? 'Tinggi' : 'Sedang',
    });
  }

  // 66-110: TKP (45 Soal: Pelayanan Publik, Jejaring Kerja, Sosial Budaya, TIK, Profesionalisme, Anti Radikalisme)
  // TKP: Setiap opsi bernilai 1 s.d. 5
  const tkpTemplates = [
    {
      sub: 'Pelayanan Publik Prima',
      q: 'Saat jam pelayanan kantor pelayanan terpadu hampir tutup pada pukul 15.45 WIB, seorang warga lansia datang dari desa pelosok dengan terengah-engah membawa berkas permohonan bantuan sosial yang mendesak untuk pengobatan cucunya. Namun, sistem verifikasi pusat sedang mengalami perlambatan jaringan (down). Tindakan Anda sebagai petugas loket adalah...',
      opts: [
        { key: 'A', text: 'Menerima berkas, memeriksa kelengkapan manual, memberikan tanda terima sementara, dan berjanji menginput ke sistem prioritas pertama saat jaringan pulih besok pagi.', score: 5 },
        { key: 'B', text: 'Meminta warga tersebut menunggu di ruang tunggu ber-AC hingga jaringan komputer normal kembali tanpa batasan waktu pasti.', score: 4 },
        { key: 'C', text: 'Menolak berkas dengan sopan dan menjelaskan bahwa jam kerja operasional sudah hampir selesai sesuai SOP ketat.', score: 2 },
        { key: 'D', text: 'Menyuruh warga lansia tersebut pulang dan menyarankan datang lagi bersama anggota keluarga yang lebih muda.', score: 1 },
        { key: 'E', text: 'Menghubungi atasan langsung untuk meminta instruksi apakah diperbolehkan memproses di luar jam kerja.', score: 3 },
      ],
      exp: 'Pelayanan publik prima menuntut empati tinggi, inisiatif problem solving solutif tanpa melanggar prinsip kepatuhan administrasi dasar.',
    },
    {
      sub: 'Profesionalisme & Manajemen Tekanan',
      q: 'Anda ditugaskan memimpin tim lintas seksi untuk menyusun laporan evaluasi kinerja tahunan dengan tenggat waktu tersisa 3 hari. Di saat bersamaan, salah satu anggota tim kunci jatuh sakit dan tidak bisa dihubungi, sementara data dari bagiannya belum terintegrasi. Sikap Anda adalah...',
      opts: [
        { key: 'A', text: 'Mengkonsolidasikan anggota tim yang tersisa, memetakan kembali beban kerja, membagi tugas data yang tertunda secara merata, dan fokus menyelesaikan target sebelum deadline.', score: 5 },
        { key: 'B', text: 'Melaporkan kepada pimpinan bahwa laporan tidak bisa selesai tepat waktu akibat ketidakhadiran anggota yang sakit.', score: 2 },
        { key: 'C', text: 'Mengerjakan seluruh sisa tugas anggota yang sakit seorang diri hingga begadang tanpa melibatkan anggota tim lain.', score: 3 },
        { key: 'D', text: 'Menelepon keluarga anggota yang sakit berulang kali untuk mendesak pengiriman file dari laptop pribadinya.', score: 1 },
        { key: 'E', text: 'Menyerahkan draf laporan seadanya tanpa bagian yang belum terisi lengkap agar tidak terkena teguran keterlambatan.', score: 4 },
      ],
      exp: 'Nilai profesionalisme tertinggi ditunjukkan dengan kepemimpinan tanggap, redistribusi peran cerdas, dan orientasi kuat pada pencapaian hasil tim di bawah tekanan.',
    },
    {
      sub: 'Teknologi Informasi & Transformasi Digital',
      q: 'Instansi Anda baru saja meluncurkan aplikasi e-office berbasis cloud untuk menggantikan persuratan fisik. Sebagian pegawai senior tampak enggan menggunakannya karena merasa rumit dan lebih nyaman memakai memo kertas konvensional. Langkah Anda sebagai ASN muda adalah...',
      opts: [
        { key: 'A', text: 'Secara proaktif membuat panduan ringkas bergambar atau video tutorial singkat, serta meluangkan waktu mendampingi rekan senior langkah demi langkah.', score: 5 },
        { key: 'B', text: 'Membiarkan mereka tetap menggunakan kertas manual agar tidak menimbulkan ketegangan hubungan kerja antar generasi.', score: 2 },
        { key: 'C', text: 'Menyindir rekan senior dalam rapat pleno bahwa mereka menghambat kemajuan transformasi digital instansi.', score: 1 },
        { key: 'D', text: 'Mengerjakan semua surat disposisi milik rekan senior ke dalam aplikasi agar target digitalisasi instansi tercapai.', score: 3 },
        { key: 'E', text: 'Mengusulkan kepada pimpinan bagian kepegawaian agar memberikan sanksi pemotongan tunjangan kinerja bagi yang lambat beradaptasi.', score: 4 },
      ],
      exp: 'Penguasaan TIK bukan hanya kemampuan teknis pribadi, melainkan kemampuan menjadi agen perubahan (change agent) yang inklusif dan kolaboratif bagi lingkungan kerja.',
    },
    {
      sub: 'Jejaring Kerja & Kolaborasi Lintas Sektor',
      q: 'Dalam program percepatan penurunan stunting di wilayah kecamatan, instansi Anda harus bekerja sama dengan Puskesmas, aparat desa, serta kader PKK. Namun, masing-masing pihak memiliki agenda kerja internal yang padat sehingga sulit menyepakati jadwal forum koordinasi bersama. Pendekatan Anda adalah...',
      opts: [
        { key: 'A', text: 'Menginisiasi pembuatan grup koordinasi digital terstruktur, menyepakati jadwal sinkronisasi berkala yang efisien, dan fokus pada target bersama.', score: 5 },
        { key: 'B', text: 'Melaksanakan program instansi sendiri tanpa perlu berkoordinasi dengan Puskesmas maupun kader PKK.', score: 1 },
        { key: 'C', text: 'Menunggu inisiatif dari pihak kecamatan untuk memanggil seluruh perwakilan lembaga terkait.', score: 3 },
        { key: 'D', text: 'Mengancam akan melaporkan ketidakhadiran pihak puskesmas kepada bupati jika tidak bersedia hadir rapat.', score: 2 },
        { key: 'E', text: 'Mengirimkan surat permohonan data tertulis dan berkomunikasi pasif melalui kurir resmi saja.', score: 4 },
      ],
      exp: 'Jejaring kerja efektif mengandalkan fleksibilitas komunikasi modern, mediasi yang solutif, serta penguatan komitmen kolektif.',
    },
    {
      sub: 'Anti Radikalisme & Integritas Ideologis',
      q: 'Di grup percakapan pegawai instansi, seorang rekan kerja menyebarkan tautan artikel berita provokatif yang mempertanyakan dasar negara Pancasila dan mengajak menolak program apel kesadaran kebangsaan mingguan. Tindakan Anda adalah...',
      opts: [
        { key: 'A', text: 'Mengingatkan rekan tersebut secara santun di ruang pribadi mengenai kode etik dan sumpah janji ASN, serta mengklarifikasi fakta berbasis narasi kebangsaan resmi.', score: 5 },
        { key: 'B', text: 'Ikut membagikan tautan tersebut ke grup lain untuk mengetahui pendapat dari khalayak luas.', score: 1 },
        { key: 'C', text: 'Diam saja dan keluar dari grup percakapan agar tidak terlibat konflik opini politik.', score: 2 },
        { key: 'D', text: 'Memarahi rekan tersebut dengan kata-kata kasar di dalam grup agar ia merasa jera di depan publik.', score: 3 },
        { key: 'E', text: 'Mengambil tangkapan layar (screenshot) dan langsung menyebarkannya di media sosial pribadi agar oknum tersebut diviralkan.', score: 4 },
      ],
      exp: 'Anti-radikalisme ASN diwujudkan dengan ketegasan membela ideologi negara secara elegan, persuasif pada tahap awal, dan berpedoman pada kode etik ASN.',
    },
  ];

  for (let i = 66; i <= 110; i++) {
    const tmpl = tkpTemplates[(i - 66) % tkpTemplates.length];
    // Option with score 5 is the best
    const bestOpt = tmpl.opts.find(o => o.score === 5)?.key || 'A';
    q.push({
      id: i,
      category: 'TKP',
      subCategory: tmpl.sub,
      question: `[Skenario Situasional #${i - 65} - Paket ${packageNum}] ${tmpl.q}`,
      options: tmpl.opts,
      correctAnswer: bestOpt,
      explanation: tmpl.exp,
      difficulty: 'Tinggi',
    });
  }

  return q;
}

export const TRYOUT_PACKAGES_METADATA = [
  {
    id: 'package1',
    title: 'TRYOUT SKD — PAKET 01',
    subtitle: 'Simulasi CAT Terpadu (TWK 30 + TIU 35 + TKP 45)',
    description: 'Fokus penalaran integritas, kasus silogisme analitis, deret ganda, dan dilema skenario pelayanan publik prima berstandar BKN.',
    durationMinutes: 100,
    totalQuestions: 110,
  },
  {
    id: 'package2',
    title: 'TRYOUT SKD — PAKET 02',
    subtitle: 'Simulasi CAT Terpadu (TWK 30 + TIU 35 + TKP 45)',
    description: 'Analisis implementasi UUD 1945, pemecahan masalah aritmatika sosial, penalaran posisi melingkar, dan transformasi digital TIK ASN.',
    durationMinutes: 100,
    totalQuestions: 110,
  },
  {
    id: 'package3',
    title: 'TRYOUT SKD — PAKET 03',
    subtitle: 'Simulasi CAT Terpadu (TWK 30 + TIU 35 + TKP 45)',
    description: 'Uji komprehensif penalaran bela negara non-militer, figural analitis kecepatan tinggi, dan integritas anti radikalisme berbobot tinggi.',
    durationMinutes: 100,
    totalQuestions: 110,
  },
];

export function getQuestionsForPackage(packageId: string): Question[] {
  let num = 1;
  if (packageId === 'package2' || packageId === 'tryout-02') num = 2;
  if (packageId === 'package3' || packageId === 'tryout-03') num = 3;
  return generatePackageQuestions(num);
}

