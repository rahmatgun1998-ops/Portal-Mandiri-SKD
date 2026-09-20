import { ScheduleItem } from '../types';

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  // MINGGU GANJIL (Week 1)
  {
    id: 'SCH-W1-D1',
    date: 'Hari ke-1',
    week: 1,
    day: 'Senin',
    category: 'TWK',
    material: 'Nasionalisme & Pengamalan Kasus Kebangsaan',
    objective: 'Mampu menganalisis dilema persatuan bangsa, penanganan disintegrasi, dan ketahanan identitas nasional dalam situasi modern.',
    keyPoints: [
      'Unsur pembentuk identitas nasional di era digital',
      'Studi kasus polarisasi sosial dan penanganannya',
      'Integrasi kearifan lokal dalam ketahanan nasional',
      'Pembedaan nasionalisme sempit (chauvinisme) vs nasionalisme terbuka'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Prioritaskan pemahaman penalaran kasus daripada sekadar menghafal tanggal.'
  },
  {
    id: 'SCH-W1-D2',
    date: 'Hari ke-2',
    week: 1,
    day: 'Selasa',
    category: 'TIU',
    material: 'Penalaran Logis Silogisme & Logika Posisi',
    objective: 'Menguasai penarikan kesimpulan modus ponens, tollens, silogisme kategori, dan pengaturan posisi duduk/urutan bertingkat.',
    keyPoints: [
      'Hukum silogisme kategorik: Semua vs Sebagian',
      'Kombinasi kata ingkaran (negasi) dan kuantor universal',
      'Strategi diagram Venn untuk validasi logika penarikan kesimpulan',
      'Teknik eliminasi cepat pada soal posisi melingkar dan linear'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Latih pembuatan sketsa posisi dalam waktu maksimal 40 detik per soal.'
  },
  {
    id: 'SCH-W1-D3',
    date: 'Hari ke-3',
    week: 1,
    day: 'Rabu',
    category: 'TKP',
    material: 'Pelayanan Publik Prima & Empati Birokrasi',
    objective: 'Menginternalisasi pola pikir ASN yang berorientasi pada kepuasan masyarakat, responsivitas keluhan, dan transparansi prosedur.',
    keyPoints: [
      'Penanganan komplain warga dalam situasi darurat dan sistem down',
      'Prinsip inklusivitas pelayanan bagi kelompok disabilitas dan lansia',
      'Keseimbangan antara kepatuhan SOP dan fleksibilitas kemanusiaan',
      'Identifikasi opsi jawaban berbobot nilai 5'
    ],
    duration: '75 Menit',
    targetQuestions: 45,
    status: 'Belum',
    notes: 'Fokus pada pilihan yang menunjukkan tindakan nyata, solutif, dan empati tanpa melanggar hukum.'
  },
  {
    id: 'SCH-W1-D4',
    date: 'Hari ke-4',
    week: 1,
    day: 'Kamis',
    category: 'TWK',
    material: 'Integritas ASN & Pengendalian Gratifikasi',
    objective: 'Memahami prinsip anti-korupsi, penolakan konflik kepentingan, whistleblowing system, dan etika profesi aparatur negara.',
    keyPoints: [
      'Batasan gratifikasi, suap, dan uang pelicin menurut KPK',
      'Mekanisme pelaporan internal APIP / SPIP yang akuntabel',
      'Dilema moral kepemimpinan: pertemanan vs aturan dinas',
      'Penerapan 9 nilai dasar integritas (Jujur, Peduli, Mandiri, Disiplin, Tanggung jawab, Kerja keras, Sederhana, Berani, Adil)'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Kaitkan dengan regulasi UU ASN No. 20 Tahun 2023.'
  },
  {
    id: 'SCH-W1-D5',
    date: 'Hari ke-5',
    week: 1,
    day: 'Jumat',
    category: 'TIU',
    material: 'Numerik Cepat: Deret Angka & Aritmatika Pecahan',
    objective: 'Mempercepat kalkulasi mental, mengenali pola deret loncat berulang (deret Fibonacci, kuadrat, dan geometri bertingkat).',
    keyPoints: [
      'Pola deret bertingkat 2 dan 3 level',
      'Trik aproksimasi pecahan, desimal, dan persentase',
      'Sederhanakan ekspresi aljabar tanpa menghitung penuh',
      'Teknik melihat digit satuan terakhir untuk eliminasi opsi'
    ],
    duration: '90 Menit',
    targetQuestions: 40,
    status: 'Belum',
    notes: 'Batasi penggunaan coretan tangan untuk membentuk refleks hitung cepat.'
  },
  {
    id: 'SCH-W1-D6',
    date: 'Hari ke-6',
    week: 1,
    day: 'Sabtu',
    category: 'TKP',
    material: 'Jejaring Kerja & Manajemen Kolaborasi Lintas Tim',
    objective: 'Mengembangkan kecerdasan berjejaring, sinergi lintas generasi di kantor, serta kepemimpinan kolaboratif.',
    keyPoints: [
      'Mengatasi resistensi rekan kerja terhadap perubahan metodologi kerja',
      'Manajemen konflik antardivisi saat perebutan sumber daya proyek',
      'Membangun aliansi strategis lintas instansi daerah',
      'Membagi tugas tim secara adil berdasarkan kompetensi'
    ],
    duration: '75 Menit',
    targetQuestions: 45,
    status: 'Belum',
    notes: 'Pilih opsi yang paling mengedepankan keterbukaan dan musyawarah mufakat.'
  },
  {
    id: 'SCH-W1-D7',
    date: 'Hari ke-7',
    week: 1,
    day: 'Minggu',
    category: 'OFF',
    material: 'Jadwal OFF (Istirahat, Refleksi Mingguan & Pemulihan Energi)',
    objective: 'Memberikan waktu istirahat fisik dan mental agar terhindar dari burnout belajar, review catatan evaluasi mingguan.',
    keyPoints: [
      'Tidur cukup dan aktivitas fisik ringan / olahraga santai',
      'Membaca sekilas resume rumus dan konsep kunci',
      'Persiapan mental untuk menghadapi siklus minggu genap'
    ],
    duration: 'Bebas',
    targetQuestions: 0,
    status: 'OFF',
    notes: 'Hari tenang. Hindari pengerjaan simulasi berat untuk menyegarkan fokus.'
  },

  // MINGGU GENAP (Week 2)
  {
    id: 'SCH-W2-D1',
    date: 'Hari ke-8',
    week: 2,
    day: 'Senin',
    category: 'TWK',
    material: 'Bela Negara & Kedaulatan Era Digital (Non-Militer)',
    objective: 'Menganalisis implementasi 5 unsur bela negara dalam profesi sipil, mitigasi ancaman siber, dan perlindungan kedaulatan data.',
    keyPoints: [
      'Cinta tanah air lewat pengutamaan karya anak bangsa',
      'Rela berkorban untuk kepentingan umum di atas kepentingan pribadi',
      'Menangkal disinformasi, hoax perpecahan, dan propaganda siber',
      'Peran ASN sebagai benteng perekat kedaulatan persatuan'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Kaitkan dengan kasus-kasus kontemporer keamanan data publik.'
  },
  {
    id: 'SCH-W2-D2',
    date: 'Hari ke-9',
    week: 2,
    day: 'Selasa',
    category: 'TIU',
    material: 'Penalaran Figural: Serial, Analogi, & Ketidaksamaan',
    objective: 'Mendeteksi perputaran sudut, pencerminan, pertambahan elemen geometris, dan konsistensi matriks gambar secara presisi.',
    keyPoints: [
      'Rotasi jarum jam vs berlawanan jarum jam (45°, 90°, 135°)',
      'Perubahan warna elemen: hitam, putih, berarsir',
      'Hubungan analogi elemen luar dan elemen dalam',
      'Pendeteksian pola ketidaksamaan melalui jumlah sisi dan simetri'
    ],
    duration: '80 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Latihan visual butuh konsentrasi tinggi. Jaga ritme mata dan ketelitian.'
  },
  {
    id: 'SCH-W2-D3',
    date: 'Hari ke-10',
    week: 2,
    day: 'Rabu',
    category: 'TKP',
    material: 'Sosial Budaya & Moderasi Keberagaman Bangsa',
    objective: 'Menjaga keharmonisan dalam lingkungan kerja heterogen, kepekaan terhadap perbedaan norma adat, dan inklusivitas sosial.',
    keyPoints: [
      'Adaptasi cepat saat ditugaskan di wilayah 3T (Terdepan, Terluar, Tertinggal)',
      'Menghargai tradisi lokal tanpa mengorbankan integritas pelayanan',
      'Mencegah timbulnya stereotip dan etnosentrisme di kantor',
      'Menjadi jembatan kerukunan antarumat beragama'
    ],
    duration: '75 Menit',
    targetQuestions: 45,
    status: 'Belum',
    notes: 'Pilih opsi yang menunjukkan sikap terbuka, ramah, dan toleran.'
  },
  {
    id: 'SCH-W2-D4',
    date: 'Hari ke-11',
    week: 2,
    day: 'Kamis',
    category: 'TWK',
    material: 'UUD 1945, Amandemen & Lembaga Negara (MK, KY, MA, BPK)',
    objective: 'Menguasai check and balances kekuasaan negara, hierarki perundang-undangan (UU No. 12/2011), dan kewenangan konstitusional.',
    keyPoints: [
      'Wewenang dan kewajiban Mahkamah Konstitusi vs Mahkamah Agung',
      'Peran Komisi Yudisial dalam menjaga martabat hakim',
      'Kedudukan DPD dalam proses legislasi bersama DPR dan Presiden',
      'Asas-asas umum pemerintahan yang baik (AUPB)'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Kuasai pasal-pasal kunci hak asasi manusia (Pasal 28A-28J) dan kewenangan lembaga.'
  },
  {
    id: 'SCH-W2-D5',
    date: 'Hari ke-12',
    week: 2,
    day: 'Jumat',
    category: 'TIU',
    material: 'Aritmatika Sosial & Soal Cerita: Kecepatan & Proyek Pekerja',
    objective: 'Menyelesaikan perbandingan senilai/berbalik nilai, waktu berpapasan/menyusul, persentase untung rugi, dan efisiensi waktu kerja.',
    keyPoints: [
      'Rumus berbalik nilai: waktu terhenti pada proyek konstruksi',
      'Formulasi berpapasan dengan waktu berangkat sama vs berbeda',
      'Diskon ganda (misal 50% + 20%) dan margin keuntungan kotor/bersih',
      'Kadar campuran zat dan konsentrasi larutan'
    ],
    duration: '90 Menit',
    targetQuestions: 35,
    status: 'Belum',
    notes: 'Tuliskan variabel kunci dan rumus baku sebelum mulai berhitung.'
  },
  {
    id: 'SCH-W2-D6',
    date: 'Hari ke-13',
    week: 2,
    day: 'Sabtu',
    category: 'TKP',
    material: 'Anti Radikalisme & TIK: Ketahanan Ideologi ASN',
    objective: 'Ketegasan menyikapi paham intoleran, radikalisme, penyebaran ujaran kebencian, serta keamanan sistem informasi pemerintah.',
    keyPoints: [
      'Deteksi dini narasi pemecah belah persatuan di media sosial kantor',
      'Etika digital aparatur sipil negara di platform publik',
      'Tindakan tegas menolak ajakan yang merongrong Pancasila',
      'Pendekatan persuasif dan pembinaan anggota tim yang terpapar'
    ],
    duration: '75 Menit',
    targetQuestions: 45,
    status: 'Belum',
    notes: 'Pilih opsi yang paling mengutamakan keselamatan ideologi bangsa dan loyalitas pada NKRI.'
  },
  {
    id: 'SCH-W2-D7',
    date: 'Hari ke-14',
    week: 2,
    day: 'Minggu',
    category: 'TRYOUT',
    material: 'SIMULASI CAT AKBAR SKD CPNS (110 Soal - 100 Menit)',
    objective: 'Simulasi ujian CAT real-time berstandar BKN: 30 TWK, 35 TIU, 45 TKP dengan timer ketat dan penilaian passing grade resmi.',
    keyPoints: [
      'Manajemen waktu: alokasikan maksimal 54 detik per soal',
      'Strategi pengerjaan: dahulukan TKP untuk amankan skor tinggi, lanjut TWK & TIU',
      'Pengendalian emosi saat menghadapi soal numerik panjang',
      'Evaluasi skor passing grade (TWK >= 65, TIU >= 80, TKP >= 166)'
    ],
    duration: '100 Menit',
    targetQuestions: 110,
    status: 'Tryout',
    notes: 'Siapkan lingkungan belajar yang hening, minim gangguan, dan koneksi internet stabil.'
  }
];

export const MOTIVATIONAL_QUOTES = [
  'Setiap sesi belajar membawa kamu satu langkah lebih dekat pada impian menjadi ASN yang berintegritas.',
  'Konsistensi kecil setiap hari akan menghasilkan lompatan besar di hari ujian CAT yang sesungguhnya.',
  'Bukan kecerdasan semata yang menentukan kelulusan, melainkan ketahanan mental dan kedisiplinan berlatih.',
  'Jadikan setiap latihan soal sebagai sarana mengasah ketajaman penalaran dan kepribadian luhurmu.',
  'Ribuan pejuang CPNS bermimpi berada di posisi yang sama, berikan dedikasi terbaikmu hari ini.',
  'Lelah belajar hari ini adalah jembatan menuju pengabdian tulus bagi ibu pertiwi di masa depan.',
  'Fokus pada proses pemahaman konsep, niscaya angka skor tinggi akan mengikuti dengan sendirinya.',
  'Jangan bandingkan awal langkahmu dengan puncak pencapaian orang lain. Jalani progresmu sendiri.',
  'Saat kamu merasa ingin menyerah, ingat kembali alasan awal mengapa kamu memulai perjuangan ini.',
  'Disiplin adalah memilih antara apa yang kamu inginkan sekarang dengan apa yang paling kamu impikan nanti.',
  'Satu soal yang kamu pelajari dengan tuntas hari ini bisa menjadi penentu kelulusanmu esok hari.',
  'Niat yang lurus, ikhtiar yang terukur, dan doa yang tak terputus adalah formula terbaik pejuang NIP.'
];
