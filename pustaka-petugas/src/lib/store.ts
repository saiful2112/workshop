import { Book, Transaction, CriticalLoanAlert, LibraryStats } from '../types';
import { INITIAL_BOOKS, INITIAL_TRANSACTIONS, INITIAL_CRITICAL_ALERTS, INITIAL_STATS } from './mock-data';

export class LibraryRepository {
  private static instance: LibraryRepository;
  private books: Book[] = [];
  private transactions: Transaction[] = [];
  private alerts: CriticalLoanAlert[] = [];
  private stats: LibraryStats = { ...INITIAL_STATS };

  private constructor() {
    this.books = [...INITIAL_BOOKS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.alerts = [...INITIAL_CRITICAL_ALERTS];
  }

  public static getInstance(): LibraryRepository {
    if (!LibraryRepository.instance) {
      LibraryRepository.instance = new LibraryRepository();
    }
    return LibraryRepository.instance;
  }

  public getBooks(): Book[] {
    return this.books;
  }

  public getBookById(id: string): Book | undefined {
    return this.books.find((b) => b.id.toLowerCase() === id.toLowerCase() || b.isbn === id);
  }

  public addBook(newBook: Omit<Book, 'id'> & { id?: string }): Book {
    const id = newBook.id || `B0${String(this.books.length + 1).padStart(2, '0')}`;
    const book: Book = {
      ...newBook,
      id,
      availableStock: Number(newBook.availableStock ?? newBook.totalStock),
      borrowedStock: Number(newBook.borrowedStock ?? 0),
    };
    this.books.unshift(book);
    this.recomputeStats();
    return book;
  }

  public updateBook(id: string, updates: Partial<Book>): Book | null {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.books[index] = { ...this.books[index], ...updates };
    this.recomputeStats();
    return this.books[index];
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public borrowBook(data: {
    bookId: string;
    borrowerName: string;
    borrowerId: string;
    borrowerType: 'MAHASISWA' | 'DOSEN' | 'STAF';
    daysToBorrow?: number;
    notes?: string;
  }): { success: boolean; transaction?: Transaction; message?: string } {
    const book = this.books.find((b) => b.id === data.bookId);
    if (!book) {
      return { success: false, message: 'Buku tidak ditemukan di sistem katalog.' };
    }
    if (book.availableStock <= 0) {
      return { success: false, message: 'Stok buku habis! Semua eksemplar sedang dipinjam.' };
    }

    // Decrement stock
    book.availableStock -= 1;
    book.borrowedStock += 1;

    const borrowDate = new Date().toISOString().split('T')[0];
    const days = data.daysToBorrow || book.maxBorrowDays || 7;
    const due = new Date();
    due.setDate(due.getDate() + days);
    const dueDate = due.toISOString().split('T')[0];

    const nextNumber = 813 + this.transactions.length;
    const txId = `PJM-2026-0${nextNumber}`;

    const newTx: Transaction = {
      id: txId,
      borrowerName: data.borrowerName,
      borrowerId: data.borrowerId,
      borrowerType: data.borrowerType,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      borrowDate,
      dueDate,
      status: 'DIPINJAM',
      fineAmount: 0,
      notes: data.notes || `Dipinjam selama ${days} hari kerja.`,
    };

    this.transactions.unshift(newTx);
    this.recomputeStats();
    return { success: true, transaction: newTx };
  }

  public returnBook(transactionId: string): { success: boolean; transaction?: Transaction; message?: string } {
    const tx = this.transactions.find((t) => t.id === transactionId);
    if (!tx) {
      return { success: false, message: 'Nomor transaksi tidak ditemukan.' };
    }

    if (tx.status === 'KEMBALI') {
      return { success: false, message: 'Buku pada transaksi ini sudah pernah dikembalikan (pencegahan pengembalian ganda aktif).' };
    }

    // Return book & increase available stock
    const book = this.books.find((b) => b.id === tx.bookId);
    if (book) {
      book.availableStock = Math.min(book.totalStock, book.availableStock + 1);
      book.borrowedStock = Math.max(0, book.borrowedStock - 1);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    tx.status = 'KEMBALI';
    tx.returnDate = todayStr;
    tx.notes = (tx.notes ? tx.notes + ' ' : '') + `Dikembalikan pada ${todayStr}. Stok +1 berhasil direkonsiliasi.`;

    this.recomputeStats();
    return { success: true, transaction: tx };
  }

  public getAlerts(): CriticalLoanAlert[] {
    return this.alerts;
  }

  public notifyAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;
    alert.notified = true;
    return true;
  }

  public getStats(): LibraryStats {
    return this.stats;
  }

  private recomputeStats() {
    const totalTitles = this.books.length;
    const availableShelfStock = this.books.reduce((acc, b) => acc + b.availableStock, 0);
    const activeLoans = this.transactions.filter((t) => t.status === 'DIPINJAM' || t.status === 'TERLAMBAT').length;
    const completedReturns = this.transactions.filter((t) => t.status === 'KEMBALI').length;
    const totalTrx = this.transactions.length;
    const returnRatePercent = totalTrx > 0 ? Math.round((completedReturns / totalTrx) * 100) : 91;

    this.stats = {
      ...this.stats,
      totalTitles,
      availableShelfStock,
      activeLoans,
      completedReturns,
      returnRatePercent,
    };
  }
}

export const repository = LibraryRepository.getInstance();
