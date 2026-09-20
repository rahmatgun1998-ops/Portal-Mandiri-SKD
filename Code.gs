/**
 * PORTAL MANDIRI SKD CPNS
 * Tagline: "Track Your Progress, Achieve Your Goal"
 * Backend Google Apps Script: Code.gs
 * 
 * Sistem Manajemen Terpadu:
 * 1. Otomasi Google Spreadsheet Database (First-run auto creation)
 * 2. Google Drive Persistent Profile Photo Storage
 * 3. 6-Digit Passcode Authentication via Script Properties
 * 4. 2-Week Cyclic Schedule Tracker
 * 5. CAT Tryout Result Auto-Sync to Progress & Dashboard
 * 6. Full 110 Question Exam Packages (TWK 30, TIU 35, TKP 45)
 */

// ============================================================
// 1. WEB APP ENTRY POINT
// ============================================================

function doGet(e) {
  // Inisialisasi database jika belum ada pada first-run
  try {
    initializeDatabase();
  } catch (err) {
    Logger.log("Init Database warning: " + err.message);
  }

  const htmlOutput = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Portal Mandiri SKD CPNS — Track Your Progress, Achieve Your Goal')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return htmlOutput;
}

// ============================================================
// 2. GOOGLE SPREADSHEET OTOMATIS (FIRST RUN AUTO INITIALIZATION)
// ============================================================

/**
 * Memeriksa apakah database sudah ada di Script Properties.
 * Jika belum, buat spreadsheet baru secara otomatis tanpa input manual dari user.
 */
function initializeDatabase() {
  const props = PropertiesService.getScriptProperties();
  let dbId = props.getProperty('DATABASE_ID');

  if (!dbId) {
    dbId = createDatabase();
    props.setProperty('DATABASE_ID', dbId);
  } else {
    // Validasi apakah spreadsheet masih valid dan dapat diakses
    try {
      SpreadsheetApp.openById(dbId);
    } catch (e) {
      dbId = createDatabase();
      props.setProperty('DATABASE_ID', dbId);
    }
  }

  // Set default passcode jika belum terekam
  if (!props.getProperty('APP_PASSCODE')) {
    props.setProperty('APP_PASSCODE', '123456');
  }

  return dbId;
}

/**
 * Membuat spreadsheet baru dengan semua sheet yang dibutuhkan
 */
function createDatabase() {
  const ss = SpreadsheetApp.create('Portal Mandiri SKD CPNS — Database');
  
  setupUsersSheet(ss);
  setupScheduleSheet(ss);
  setupProgressSheet(ss);
  setupTryoutResultsSheet(ss);
  setupSettingsSheet(ss);

  // Hapus 'Sheet1' default jika ada
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  return ss.getId();
}

/**
 * Mengambil instance spreadsheet database
 */
function getDatabase() {
  const props = PropertiesService.getScriptProperties();
  let dbId = props.getProperty('DATABASE_ID');
  if (!dbId) {
    dbId = initializeDatabase();
  }
  return SpreadsheetApp.openById(dbId);
}

// ============================================================
// 3. SETUP DATABASE SHEETS
// ============================================================

function setupUsersSheet(ss) {
  let sheet = ss.getSheetByName('USERS');
  if (!sheet) {
    sheet = ss.insertSheet('USERS');
    sheet.appendRow([
      'ID',
      'Name',
      'Degree',
      'DisplayName',
      'Status',
      'PhotoFileId',
      'CreatedAt',
      'UpdatedAt'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#023047').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    // Default Profile
    sheet.appendRow([
      'USER001',
      'Rahmat Gunawan',
      'S.Psi',
      'Rahmat Gunawan, S.Psi',
      'Pejuang CPNS',
      '',
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }
}

function setupScheduleSheet(ss) {
  let sheet = ss.getSheetByName('SCHEDULE');
  if (!sheet) {
    sheet = ss.insertSheet('SCHEDULE');
    sheet.appendRow([
      'ID',
      'Date',
      'Week',
      'Day',
      'Category',
      'Material',
      'Duration',
      'TargetQuestions',
      'Status',
      'Notes'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#023047').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    // Seed 2-week curriculum
    seedDefaultSchedule(sheet);
  }
}

function setupProgressSheet(ss) {
  let sheet = ss.getSheetByName('PROGRESS');
  if (!sheet) {
    sheet = ss.insertSheet('PROGRESS');
    sheet.appendRow([
      'ID',
      'Date',
      'TryoutName',
      'TWK',
      'TIU',
      'TKP',
      'Total',
      'CorrectTWK',
      'CorrectTIU',
      'CorrectTKP',
      'Answered',
      'Unanswered',
      'Marked',
      'Notes',
      'CreatedAt'
    ]);
    sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#023047').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

function setupTryoutResultsSheet(ss) {
  let sheet = ss.getSheetByName('TRYOUT_RESULTS');
  if (!sheet) {
    sheet = ss.insertSheet('TRYOUT_RESULTS');
    sheet.appendRow([
      'ID',
      'Package',
      'Date',
      'StartTime',
      'EndTime',
      'Duration',
      'TWK',
      'TIU',
      'TKP',
      'Total',
      'Answered',
      'Unanswered',
      'Marked',
      'AnswersJSON',
      'CreatedAt'
    ]);
    sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#023047').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

function setupSettingsSheet(ss) {
  let sheet = ss.getSheetByName('SETTINGS');
  if (!sheet) {
    sheet = ss.insertSheet('SETTINGS');
    sheet.appendRow(['Key', 'Value']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#023047').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    sheet.appendRow(['APP_NAME', 'Portal Mandiri SKD CPNS']);
    sheet.appendRow(['TAGLINE', 'Track Your Progress, Achieve Your Goal']);
    sheet.appendRow(['DEFAULT_PASSCODE', '123456']);
    sheet.appendRow(['PASSING_GRADE_TWK', '65']);
    sheet.appendRow(['PASSING_GRADE_TIU', '80']);
    sheet.appendRow(['PASSING_GRADE_TKP', '166']);
  }
}

function seedDefaultSchedule(sheet) {
  const scheduleData = [
    // MINGGU GANJIL (Week 1)
    ['SCH001', 'Hari ke-1', 1, 'Senin', 'TWK', 'Nasionalisme & Pengamalan Kasus Kebangsaan', '90 Menit', 35, 'Belum', 'Prioritaskan pemahaman penalaran kasus daripada sekadar menghafal tanggal.'],
    ['SCH002', 'Hari ke-2', 1, 'Selasa', 'TIU', 'Penalaran Logis Silogisme & Logika Posisi', '90 Menit', 35, 'Belum', 'Latih pembuatan sketsa posisi dalam waktu maksimal 40 detik per soal.'],
    ['SCH003', 'Hari ke-3', 1, 'Rabu', 'TKP', 'Pelayanan Publik Prima & Empati Birokrasi', '75 Menit', 45, 'Belum', 'Fokus pada pilihan yang menunjukkan tindakan nyata, solutif, dan empati tanpa melanggar hukum.'],
    ['SCH004', 'Hari ke-4', 1, 'Kamis', 'TWK', 'Integritas ASN & Pengendalian Gratifikasi', '90 Menit', 35, 'Belum', 'Kaitkan dengan regulasi UU ASN No. 20 Tahun 2023.'],
    ['SCH005', 'Hari ke-5', 1, 'Jumat', 'TIU', 'Numerik Cepat: Deret Angka & Aritmatika Pecahan', '90 Menit', 40, 'Belum', 'Batasi penggunaan coretan tangan untuk membentuk refleks hitung cepat.'],
    ['SCH006', 'Hari ke-6', 1, 'Sabtu', 'TKP', 'Jejaring Kerja & Manajemen Kolaborasi Lintas Tim', '75 Menit', 45, 'Belum', 'Pilih opsi yang paling mengedepankan keterbukaan dan musyawarah mufakat.'],
    ['SCH007', 'Hari ke-7', 1, 'Minggu', 'OFF', 'Jadwal OFF (Istirahat, Refleksi Mingguan & Pemulihan Energi)', 'Bebas', 0, 'OFF', 'Hari tenang. Hindari pengerjaan simulasi berat untuk menyegarkan fokus.'],

    // MINGGU GENAP (Week 2)
    ['SCH008', 'Hari ke-8', 2, 'Senin', 'TWK', 'Bela Negara & Kedaulatan Era Digital (Non-Militer)', '90 Menit', 35, 'Belum', 'Kaitkan dengan kasus-kasus kontemporer keamanan data publik.'],
    ['SCH009', 'Hari ke-9', 2, 'Selasa', 'TIU', 'Penalaran Figural: Serial, Analogi, & Ketidaksamaan', '80 Menit', 35, 'Belum', 'Latihan visual butuh konsentrasi tinggi. Jaga ritme mata dan ketelitian.'],
    ['SCH010', 'Hari ke-10', 2, 'Rabu', 'TKP', 'Sosial Budaya & Moderasi Keberagaman Bangsa', '75 Menit', 45, 'Belum', 'Pilih opsi yang menunjukkan sikap terbuka, ramah, dan toleran.'],
    ['SCH011', 'Hari ke-11', 2, 'Kamis', 'TWK', 'UUD 1945, Amandemen & Lembaga Negara (MK, KY, MA, BPK)', '90 Menit', 35, 'Belum', 'Kuasai pasal-pasal kunci hak asasi manusia (Pasal 28A-28J) dan kewenangan lembaga.'],
    ['SCH012', 'Hari ke-12', 2, 'Jumat', 'TIU', 'Aritmatika Sosial & Soal Cerita: Kecepatan & Proyek Pekerja', '90 Menit', 35, 'Belum', 'Tuliskan variabel kunci dan rumus baku sebelum mulai berhitung.'],
    ['SCH013', 'Hari ke-13', 2, 'Sabtu', 'TKP', 'Anti Radikalisme & TIK: Ketahanan Ideologi ASN', '75 Menit', 45, 'Belum', 'Pilih opsi yang paling mengutamakan keselamatan ideologi bangsa dan loyalitas pada NKRI.'],
    ['SCH014', 'Hari ke-14', 2, 'Minggu', 'TRYOUT', 'SIMULASI CAT AKBAR SKD CPNS (110 Soal - 100 Menit)', '100 Menit', 110, 'Tryout', 'Siapkan lingkungan belajar yang hening, minim gangguan, dan koneksi internet stabil.']
  ];

  scheduleData.forEach(row => sheet.appendRow(row));
}

// ============================================================
// 4. USER PROFILE & GOOGLE DRIVE PHOTO STORAGE
// ============================================================

function getUserProfile() {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('USERS');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      id: 'USER001',
      name: 'Rahmat Gunawan',
      degree: 'S.Psi',
      displayName: 'Rahmat Gunawan, S.Psi',
      status: 'Pejuang CPNS',
      photoFileId: '',
      photoUrl: ''
    };
  }

  const row = values[1];
  const photoFileId = row[5] || '';
  let photoUrl = '';

  if (photoFileId) {
    try {
      const file = DriveApp.getFileById(photoFileId);
      const bytes = file.getBlob().getBytes();
      const contentType = file.getBlob().getContentType();
      photoUrl = 'data:' + contentType + ';base64,' + Utilities.base64Encode(bytes);
    } catch (e) {
      Logger.log("Error reading drive photo: " + e.message);
    }
  }

  return {
    id: String(row[0] || 'USER001'),
    name: String(row[1] || 'Rahmat Gunawan'),
    degree: String(row[2] || 'S.Psi'),
    displayName: String(row[3] || 'Rahmat Gunawan, S.Psi'),
    status: String(row[4] || 'Pejuang CPNS'),
    photoFileId: photoFileId,
    photoUrl: photoUrl,
    createdAt: String(row[6] || ''),
    updatedAt: String(row[7] || '')
  };
}

function saveUserProfile(profileData) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('USERS');
  const values = sheet.getDataRange().getValues();

  const name = profileData.name || 'Rahmat Gunawan';
  const degree = profileData.degree || 'S.Psi';
  const displayName = degree ? `${name}, ${degree}` : name;
  const status = profileData.status || 'Pejuang CPNS';
  const now = new Date().toISOString();

  if (values.length <= 1) {
    sheet.appendRow(['USER001', name, degree, displayName, status, '', now, now]);
  } else {
    sheet.getRange(2, 2).setValue(name);
    sheet.getRange(2, 3).setValue(degree);
    sheet.getRange(2, 4).setValue(displayName);
    sheet.getRange(2, 5).setValue(status);
    sheet.getRange(2, 8).setValue(now);
  }

  return { success: true, message: 'Profil berhasil diperbarui' };
}

/**
 * Upload foto ke Google Drive persistent storage.
 * Menerima data base64, mimeType, fileName.
 * Menyimpan File ID di Google Drive dan sheet USERS.
 */
function uploadProfilePhoto(base64Data, mimeType, fileName) {
  try {
    const rawData = base64Data.replace(/^data:[^;]+;base64,/, '');
    const decodedBytes = Utilities.base64Decode(rawData);
    const contentType = mimeType || 'image/png';
    const blob = Utilities.newBlob(decodedBytes, contentType, fileName || 'profile_photo.png');

    // Cari atau buat folder penyimpanan di Google Drive
    const folderName = 'Portal Mandiri SKD CPNS — Assets';
    const folders = DriveApp.getFoldersByName(folderName);
    let targetFolder;
    if (folders.hasNext()) {
      targetFolder = folders.next();
    } else {
      targetFolder = DriveApp.createFolder(folderName);
    }

    // Buat file di Google Drive
    const driveFile = targetFolder.createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const newFileId = driveFile.getId();

    // Update File ID di sheet USERS
    const ss = getDatabase();
    const sheet = ss.getSheetByName('USERS');
    sheet.getRange(2, 6).setValue(newFileId);
    sheet.getRange(2, 8).setValue(new Date().toISOString());

    const photoUrl = 'data:' + contentType + ';base64,' + rawData;

    return {
      success: true,
      fileId: newFileId,
      photoUrl: photoUrl,
      message: 'Foto profil berhasil disimpan secara permanen di Google Drive'
    };
  } catch (err) {
    return {
      success: false,
      message: 'Gagal mengupload foto ke Google Drive: ' + err.message
    };
  }
}

function getProfilePhoto(fileId) {
  try {
    if (!fileId) return { success: false, photoUrl: '' };
    const file = DriveApp.getFileById(fileId);
    const bytes = file.getBlob().getBytes();
    const contentType = file.getBlob().getContentType();
    const base64 = Utilities.base64Encode(bytes);
    return {
      success: true,
      photoUrl: 'data:' + contentType + ';base64,' + base64
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ============================================================
// 5. PASSCODE & SECURITY
// ============================================================

function validatePasscode(passcode) {
  const props = PropertiesService.getScriptProperties();
  const currentPass = props.getProperty('APP_PASSCODE') || '123456';
  const isValid = String(passcode).trim() === String(currentPass).trim();
  return {
    valid: isValid,
    message: isValid ? 'Passcode valid' : 'Passcode salah'
  };
}

function changePasscode(oldPass, newPass) {
  const props = PropertiesService.getScriptProperties();
  const currentPass = props.getProperty('APP_PASSCODE') || '123456';

  if (String(oldPass).trim() !== String(currentPass).trim()) {
    return { success: false, message: 'Passcode lama tidak sesuai' };
  }

  const sanitizedNewPass = String(newPass).trim();
  if (!/^\d{6}$/.test(sanitizedNewPass)) {
    return { success: false, message: 'Passcode baru harus berupa 6 digit angka' };
  }

  props.setProperty('APP_PASSCODE', sanitizedNewPass);
  return { success: true, message: 'Passcode berhasil diperbarui' };
}

// ============================================================
// 6. SCHEDULE MANAGEMENT
// ============================================================

function getSchedule() {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('SCHEDULE');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    list.push({
      id: String(row[0]),
      date: String(row[1]),
      week: Number(row[2]),
      day: String(row[3]),
      category: String(row[4]),
      material: String(row[5]),
      duration: String(row[6]),
      targetQuestions: Number(row[7]),
      status: String(row[8]),
      notes: String(row[9] || '')
    });
  }
  return list;
}

function saveScheduleStatus(scheduleId, status, notes) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('SCHEDULE');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(scheduleId)) {
      sheet.getRange(i + 1, 9).setValue(status);
      if (notes !== undefined && notes !== null) {
        sheet.getRange(i + 1, 10).setValue(notes);
      }
      return { success: true, message: 'Status jadwal berhasil disimpan' };
    }
  }

  return { success: false, message: 'Jadwal tidak ditemukan' };
}

function resetSchedule() {
  const ss = getDatabase();
  let sheet = ss.getSheetByName('SCHEDULE');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  setupScheduleSheet(ss);
  return { success: true, message: 'Jadwal belajar berhasil direset ke pola 2 minggu default' };
}

// ============================================================
// 7. PROGRESS TRACKER
// ============================================================

function getProgress() {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('PROGRESS');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    list.push({
      id: String(row[0]),
      date: String(row[1]),
      tryoutName: String(row[2]),
      twk: Number(row[3]),
      tiu: Number(row[4]),
      tkp: Number(row[5]),
      total: Number(row[6]),
      correctTWK: Number(row[7]),
      correctTIU: Number(row[8]),
      correctTKP: Number(row[9]),
      answered: Number(row[10]),
      unanswered: Number(row[11]),
      marked: Number(row[12]),
      notes: String(row[13] || ''),
      createdAt: String(row[14])
    });
  }
  return list.reverse(); // Terbaru di atas
}

function saveProgress(progressData) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('PROGRESS');
  const newId = 'PRG-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const now = new Date().toISOString();

  sheet.appendRow([
    newId,
    progressData.date || new Date().toLocaleDateString('id-ID'),
    progressData.tryoutName || 'Simulasi Tryout',
    Number(progressData.twk || 0),
    Number(progressData.tiu || 0),
    Number(progressData.tkp || 0),
    Number(progressData.total || 0),
    Number(progressData.correctTWK || 0),
    Number(progressData.correctTIU || 0),
    Number(progressData.correctTKP || 0),
    Number(progressData.answered || 0),
    Number(progressData.unanswered || 0),
    Number(progressData.marked || 0),
    progressData.notes || '',
    now
  ]);

  return { success: true, id: newId, message: 'Catatan progres berhasil disimpan' };
}

function updateProgress(progressId, updatedData) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('PROGRESS');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(progressId)) {
      const r = i + 1;
      if (updatedData.twk !== undefined) sheet.getRange(r, 4).setValue(Number(updatedData.twk));
      if (updatedData.tiu !== undefined) sheet.getRange(r, 5).setValue(Number(updatedData.tiu));
      if (updatedData.tkp !== undefined) sheet.getRange(r, 6).setValue(Number(updatedData.tkp));
      if (updatedData.total !== undefined) sheet.getRange(r, 7).setValue(Number(updatedData.total));
      if (updatedData.notes !== undefined) sheet.getRange(r, 14).setValue(String(updatedData.notes));
      return { success: true, message: 'Progres berhasil diperbarui' };
    }
  }

  return { success: false, message: 'Data progres tidak ditemukan' };
}

function deleteProgress(progressId) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('PROGRESS');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(progressId)) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Data progres berhasil dihapus' };
    }
  }

  return { success: false, message: 'Data progres tidak ditemukan' };
}

function resetProgress() {
  const ss = getDatabase();
  let sheet = ss.getSheetByName('PROGRESS');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  setupProgressSheet(ss);
  return { success: true, message: 'Riwayat progres belajar berhasil direset' };
}

// ============================================================
// 8. TRYOUT RESULT & CAT EXAM AUTO-SAVE
// ============================================================

function saveTryoutResult(resultData) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('TRYOUT_RESULTS');
  const newId = 'TO-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const now = new Date().toISOString();
  const todayStr = resultData.date || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const twkScore = Number(resultData.twk || 0);
  const tiuScore = Number(resultData.tiu || 0);
  const tkpScore = Number(resultData.tkp || 0);
  const totalScore = Number(resultData.total || (twkScore + tiuScore + tkpScore));

  const answersJSON = typeof resultData.answersJSON === 'string'
    ? resultData.answersJSON
    : JSON.stringify(resultData.answers || {});

  // 1. Simpan ke TRYOUT_RESULTS
  sheet.appendRow([
    newId,
    resultData.package || 'TRYOUT SKD 01',
    todayStr,
    resultData.startTime || '',
    resultData.endTime || '',
    resultData.duration || '01:30:00',
    twkScore,
    tiuScore,
    tkpScore,
    totalScore,
    Number(resultData.answered || 0),
    Number(resultData.unanswered || 0),
    Number(resultData.marked || 0),
    answersJSON,
    now
  ]);

  // 2. Otomatis sinkronisasi ke sheet PROGRESS
  const progressSheet = ss.getSheetByName('PROGRESS');
  progressSheet.appendRow([
    'PRG-' + newId,
    todayStr,
    resultData.package || 'TRYOUT SKD 01',
    twkScore,
    tiuScore,
    tkpScore,
    totalScore,
    Number(resultData.correctTWK || Math.round(twkScore / 5)),
    Number(resultData.correctTIU || Math.round(tiuScore / 5)),
    Number(resultData.correctTKP || 45),
    Number(resultData.answered || 0),
    Number(resultData.unanswered || 0),
    Number(resultData.marked || 0),
    `Hasil Ujian CAT Paket: ${resultData.package}`,
    now
  ]);

  return {
    success: true,
    id: newId,
    total: totalScore,
    message: 'Hasil Tryout berhasil disimpan dan sinkron dengan progres!'
  };
}

function getTryoutResults() {
  const ss = getDatabase();
  const sheet = ss.getSheetByName('TRYOUT_RESULTS');
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    list.push({
      id: String(row[0]),
      package: String(row[1]),
      date: String(row[2]),
      startTime: String(row[3]),
      endTime: String(row[4]),
      duration: String(row[5]),
      twk: Number(row[6]),
      tiu: Number(row[7]),
      tkp: Number(row[8]),
      total: Number(row[9]),
      answered: Number(row[10]),
      unanswered: Number(row[11]),
      marked: Number(row[12]),
      answersJSON: String(row[13] || '{}'),
      createdAt: String(row[14])
    });
  }
  return list.reverse();
}

function resetTryoutData() {
  const ss = getDatabase();
  let sheet = ss.getSheetByName('TRYOUT_RESULTS');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  setupTryoutResultsSheet(ss);
  return { success: true, message: 'Seluruh riwayat Tryout berhasil direset' };
}

// ============================================================
// 9. DASHBOARD DATA AGGREGATION
// ============================================================

function getDashboardData() {
  const user = getUserProfile();
  const schedule = getSchedule();
  const progressList = getProgress(); // sorted newest first

  // Hitung statistik aktual dari database
  const tryoutCompleted = progressList.length;
  let totalScoreSum = 0;
  let highestScore = 0;
  let lastScore = 0;

  progressList.forEach((p, idx) => {
    totalScoreSum += p.total;
    if (p.total > highestScore) highestScore = p.total;
    if (idx === 0) lastScore = p.total;
  });

  const averageScore = tryoutCompleted > 0 ? Math.round(totalScoreSum / tryoutCompleted) : 0;

  // Total Sesi Belajar dari schedule yang 'Selesai'
  const completedSessions = schedule.filter(s => s.status === 'Selesai').length;

  // Target passing grade resmi: TWK 65, TIU 80, TKP 166 (Total: 311). Target optimal: 400
  const targetProgressPercent = highestScore > 0
    ? Math.min(100, Math.round((highestScore / 450) * 100))
    : 0;

  // Jadwal Hari Ini: cari item pertama yang 'Sedang Belajar' atau 'Belum'
  const todaySchedule = schedule.find(s => s.status === 'Sedang Belajar') ||
                        schedule.find(s => s.status === 'Belum') ||
                        schedule[0] || null;

  // Progress Mingguan: 14 hari
  const completedDays = schedule.filter(s => s.status === 'Selesai' || s.status === 'OFF').length;

  // Chart data 5 tryout terakhir (kronologis)
  const chronological = [...progressList].reverse().slice(-7);
  const chartData = {
    labels: chronological.map((c, i) => c.tryoutName.replace('TRYOUT SKD ', 'TO ') || `TO ${i+1}`),
    twk: chronological.map(c => c.twk),
    tiu: chronological.map(c => c.tiu),
    tkp: chronological.map(c => c.tkp),
    total: chronological.map(c => c.total)
  };

  return {
    user: user,
    stats: {
      totalStudySessions: completedSessions,
      tryoutCompleted: tryoutCompleted,
      averageScore: averageScore,
      targetProgressPercent: targetProgressPercent,
      highestScore: highestScore,
      lastScore: lastScore
    },
    todaySchedule: todaySchedule,
    weeklyProgress: {
      completedDays: completedDays,
      totalDays: schedule.length || 14,
      currentWeek: 1
    },
    recentTryouts: progressList.slice(0, 5),
    chartData: chartData
  };
}

// ============================================================
// 10. TRYOUT SESSION STATE PERSISTENCE
// ============================================================

function saveTryoutState(packageId, state) {
  try {
    const userCache = CacheService.getUserCache();
    userCache.put('TO_STATE_' + packageId, JSON.stringify(state), 21600); // 6 jam
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getTryoutState(packageId) {
  try {
    const userCache = CacheService.getUserCache();
    const cached = userCache.get('TO_STATE_' + packageId);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}
