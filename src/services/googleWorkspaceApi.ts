import { getGoogleAccessToken } from './googleAuth';
import { UserProfile, ScheduleItem, ProgressRecord, TryoutResult } from '../types';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
}

export const googleWorkspaceApi = {
  // Check if user is connected with Google token
  async hasValidToken(): Promise<boolean> {
    const token = await getGoogleAccessToken();
    return !!token;
  },

  // -------------------------------------------------------------
  // GOOGLE DRIVE SERVICES
  // -------------------------------------------------------------

  /**
   * Upload an image file (e.g. profile photo) to Google Drive
   */
  async uploadFileToDrive(
    fileName: string,
    mimeType: string,
    base64Data: string
  ): Promise<{ fileId: string; webViewLink?: string; webContentLink?: string }> {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Silakan login dengan akun Google terlebih dahulu.');

    // Clean base64 prefix if present
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const metadata = {
      name: fileName,
      mimeType: mimeType,
      description: 'Diunggah melalui Portal Mandiri SKD CPNS',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal mengunggah berkas ke Google Drive');
    }

    const data = await response.json();
    return {
      fileId: data.id,
      webViewLink: data.webViewLink,
      webContentLink: data.webContentLink,
    };
  },

  /**
   * List files created/managed by this application in Google Drive
   */
  async listAppDriveFiles(): Promise<GoogleDriveFile[]> {
    const token = await getGoogleAccessToken();
    if (!token) return [];

    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id,name,mimeType,webViewLink,thumbnailLink,createdTime)&orderBy=createdTime desc',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.files || [];
    } catch (e) {
      console.error('Error listing Drive files:', e);
      return [];
    }
  },

  /**
   * Delete a file from Google Drive with user confirmation check
   */
  async deleteDriveFile(fileId: string, confirmed: boolean): Promise<boolean> {
    if (!confirmed) {
      throw new Error('Tindakan dibatalkan: Konfirmasi penghapusan diperlukan.');
    }
    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Akses Google tidak ditemukan.');

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  // -------------------------------------------------------------
  // GOOGLE SHEETS SERVICES
  // -------------------------------------------------------------

  /**
   * Search for existing "Portal Mandiri SKD CPNS - Database" spreadsheet or create new
   */
  async getOrCreateSpreadsheet(): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Silakan login dengan akun Google terlebih dahulu.');

    const cachedId = localStorage.getItem('PORTAL_SKD_SHEET_ID');
    if (cachedId) {
      // Verify existence
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cachedId}?fields=spreadsheetId,spreadsheetUrl`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        return { spreadsheetId: data.spreadsheetId, spreadsheetUrl: data.spreadsheetUrl };
      }
    }

    // Create new spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: 'Portal Mandiri SKD CPNS — Database Belajar & Tryout',
        },
        sheets: [
          { properties: { title: 'PROFILE' } },
          { properties: { title: 'SCHEDULE' } },
          { properties: { title: 'PROGRESS' } },
          { properties: { title: 'TRYOUT_RESULTS' } },
        ],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru');
    }

    const newSheet = await createRes.json();
    localStorage.setItem('PORTAL_SKD_SHEET_ID', newSheet.spreadsheetId);

    // Initialize headers in newly created sheet
    await this.initializeSheetHeaders(newSheet.spreadsheetId, token);

    return {
      spreadsheetId: newSheet.spreadsheetId,
      spreadsheetUrl: newSheet.spreadsheetUrl,
    };
  },

  /**
   * Initialize table headers in Google Sheets
   */
  async initializeSheetHeaders(spreadsheetId: string, token: string) {
    const headersData = [
      {
        range: 'PROFILE!A1:G1',
        values: [['ID', 'Nama Lengkap', 'Gelar', 'Nama Tampilan', 'Status', 'Drive File ID', 'Terakhir Diperbarui']],
      },
      {
        range: 'SCHEDULE!A1:I1',
        values: [['ID', 'Hari Ke', 'Minggu', 'Hari', 'Kategori', 'Materi', 'Durasi', 'Target Soal', 'Status']],
      },
      {
        range: 'PROGRESS!A1:G1',
        values: [['ID', 'Tanggal', 'Paket Tryout', 'TWK', 'TIU', 'TKP', 'Total Skor']],
      },
      {
        range: 'TRYOUT_RESULTS!A1:H1',
        values: [['ID', 'Tanggal', 'Paket', 'TWK', 'TIU', 'TKP', 'Total Skor', 'Durasi Waktu']],
      },
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: headersData,
      }),
    });
  },

  /**
   * Sync complete portal data to Google Sheets (UserProfile, Schedule, Progress, Tryouts)
   */
  async syncAllDataToGoogleSheets(
    spreadsheetId: string,
    user: UserProfile,
    schedule: ScheduleItem[],
    progress: ProgressRecord[],
    tryouts: TryoutResult[],
    confirmed: boolean
  ): Promise<{ success: boolean; message: string }> {
    if (!confirmed) {
      throw new Error('Tindakan dibatalkan: Konfirmasi sinkronisasi data diperlukan.');
    }

    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Akses Google tidak aktif.');

    // Format rows
    const profileRow = [
      [user.id, user.name, user.degree, user.displayName, user.status, user.photoFileId || '', new Date().toLocaleString('id-ID')],
    ];

    const scheduleRows = schedule.map(s => [
      s.id,
      s.date,
      s.week,
      s.day,
      s.category,
      s.material,
      s.duration,
      s.targetQuestions,
      s.status,
    ]);

    const progressRows = progress.map(p => [
      p.id,
      p.date,
      p.tryoutName,
      p.twk,
      p.tiu,
      p.tkp,
      p.total,
    ]);

    const tryoutRows = tryouts.map(t => [
      t.id,
      t.date,
      t.packageName || t.package,
      t.twk,
      t.tiu,
      t.tkp,
      t.total,
      t.duration,
    ]);

    const payload = {
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: 'PROFILE!A2:G2', values: profileRow },
        { range: 'SCHEDULE!A2:I' + (scheduleRows.length + 1), values: scheduleRows },
        { range: 'PROGRESS!A2:G' + Math.max(2, progressRows.length + 1), values: progressRows.length ? progressRows : [['', '', '', '', '', '', '']] },
        { range: 'TRYOUT_RESULTS!A2:H' + Math.max(2, tryoutRows.length + 1), values: tryoutRows.length ? tryoutRows : [['', '', '', '', '', '', '', '']] },
      ],
    };

    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menyimpan perubahan ke Google Sheets');
    }

    return {
      success: true,
      message: 'Seluruh data berhasil disinkronkan ke Google Spreadsheet Anda.',
    };
  },
};
