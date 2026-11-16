export type BookStatus = 'TERSEDIA' | 'STOK_HABIS' | 'KRITIS';

export interface Book {
  id: string; // e.g. B001
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  ddc: string; // Dewey Decimal Classification e.g. 899.223
  shelfLocation: string; // e.g. Rak B-04
  category: string;
  totalStock: number;
  availableStock: number;
  borrowedStock: number;
  coverUrl?: string;
  isStandardCover?: boolean;
  maxBorrowDays: number;
  synopsis?: string;
}

export type TransactionStatus = 'DIPINJAM' | 'KEMBALI' | 'TERLAMBAT';

export interface Transaction {
  id: string; // e.g. PJM-2026-0812
  borrowerName: string;
  borrowerId: string; // NIP or NIM e.g. NIM 220108234
  borrowerType: 'MAHASISWA' | 'DOSEN' | 'STAF';
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: TransactionStatus;
  daysLate?: number;
  fineAmount?: number; // e.g. Rp 1.000 per hari
  notes?: string;
}

export interface CriticalLoanAlert {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  borrowerName: string;
  borrowerId: string;
  dueDate: string;
  daysRemaining: number;
  notified: boolean;
}

export interface LibraryStats {
  totalTitles: number; // 142
  newTitlesThisMonth: number; // +6
  availableShelfStock: number; // 486
  activeLoans: number; // 28
  completedReturns: number; // 314
  returnRatePercent: number; // 91
  criticalLoansCount: number; // 3
  systemStatus: 'TERHUBUNG' | 'OFFLINE';
  serverStatus: 'SERVER INDUK AKTIF' | 'PEMELIHARAAN';
  terminalId: string; // POS-SIRKULASI-01
  archiveCode: string; // ARC-TRX-2026.Q1
}
