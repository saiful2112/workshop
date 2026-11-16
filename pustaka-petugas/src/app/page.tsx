'use client';

import React, { useState, useEffect } from 'react';
import { Book, Transaction, CriticalLoanAlert, LibraryStats } from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_TRANSACTIONS,
  INITIAL_CRITICAL_ALERTS,
  INITIAL_STATS,
} from '../lib/mock-data';
import { Sidebar } from '../components/Sidebar';
import { TopHeader } from '../components/TopHeader';
import { BerandaView } from '../components/views/BerandaView';
import { KatalogView } from '../components/views/KatalogView';
import { KelolaBukuView } from '../components/views/KelolaBukuView';
import { RiwayatView } from '../components/views/RiwayatView';
import { BorrowModal } from '../components/BorrowModal';
import { ReturnConfirmModal } from '../components/ReturnConfirmModal';
import { AddBookModal } from '../components/AddBookModal';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { PrintLabelModal } from '../components/PrintLabelModal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'katalog' | 'riwayat' | 'kelola-buku'>('beranda');

  // Application Data States
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [alerts, setAlerts] = useState<CriticalLoanAlert[]>(INITIAL_CRITICAL_ALERTS);
  const [stats, setStats] = useState<LibraryStats>(INITIAL_STATS);

  // Active Selection & Modal States
  const [selectedBook, setSelectedBook] = useState<Book | null>(INITIAL_BOOKS[0]);
  const [bookToBorrow, setBookToBorrow] = useState<Book | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const [transactionToReturn, setTransactionToReturn] = useState<Transaction | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isPrintLabelModalOpen, setIsPrintLabelModalOpen] = useState(false);
  const [bookToPrint, setBookToPrint] = useState<Book | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Recompute library stats whenever books or transactions change
  useEffect(() => {
    const totalTitles = books.length;
    const availableShelfStock = books.reduce((acc, b) => acc + b.availableStock, 0);
    const activeLoans = transactions.filter((t) => t.status === 'DIPINJAM' || t.status === 'TERLAMBAT').length;
    const completedReturns = transactions.filter((t) => t.status === 'KEMBALI').length;
    const totalTrx = transactions.length;
    const returnRatePercent = totalTrx > 0 ? Math.round((completedReturns / totalTrx) * 100) : 91;

    setStats((prev) => ({
      ...prev,
      totalTitles,
      availableShelfStock,
      activeLoans,
      completedReturns,
      returnRatePercent,
    }));
  }, [books, transactions]);

  // Handle Book Borrow
  const handleBorrowSubmit = (data: {
    bookId: string;
    borrowerName: string;
    borrowerId: string;
    borrowerType: 'MAHASISWA' | 'DOSEN' | 'STAF';
    daysToBorrow: number;
    notes?: string;
  }) => {
    const book = books.find((b) => b.id === data.bookId);
    if (!book || book.availableStock <= 0) {
      showToast('Gagal meminjam: Stok buku habis.', 'error');
      return;
    }

    // Decrement stock
    const updatedBooks = books.map((b) => {
      if (b.id === data.bookId) {
        return {
          ...b,
          availableStock: Math.max(0, b.availableStock - 1),
          borrowedStock: b.borrowedStock + 1,
        };
      }
      return b;
    });
    setBooks(updatedBooks);

    if (selectedBook && selectedBook.id === data.bookId) {
      setSelectedBook({
        ...selectedBook,
        availableStock: Math.max(0, selectedBook.availableStock - 1),
        borrowedStock: selectedBook.borrowedStock + 1,
      });
    }

    // Create new transaction
    const nextNum = 813 + transactions.length;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + Number(data.daysToBorrow));
    const dueDate = due.toISOString().split('T')[0];

    const newTx: Transaction = {
      id: `PJM-2026-0${nextNum}`,
      borrowerName: data.borrowerName,
      borrowerId: data.borrowerId,
      borrowerType: data.borrowerType,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      borrowDate: today,
      dueDate,
      status: 'DIPINJAM',
      fineAmount: 0,
      notes: data.notes || `Peminjaman mandiri selama ${data.daysToBorrow} hari kerja.`,
    };

    setTransactions([newTx, ...transactions]);
    showToast(`Peminjaman "${book.title}" untuk ${data.borrowerName} berhasil dicatat (${newTx.id})!`, 'success');
  };

  // Handle Book Return (+1 stock, prevent duplicate)
  const handleReturnConfirm = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    if (tx.status === 'KEMBALI') {
      showToast('Buku pada transaksi ini sudah pernah dikembalikan (pencegahan pengembalian ganda).', 'error');
      return;
    }

    // Increase available stock
    const updatedBooks = books.map((b) => {
      if (b.id === tx.bookId) {
        return {
          ...b,
          availableStock: Math.min(b.totalStock, b.availableStock + 1),
          borrowedStock: Math.max(0, b.borrowedStock - 1),
        };
      }
      return b;
    });
    setBooks(updatedBooks);

    if (selectedBook && selectedBook.id === tx.bookId) {
      setSelectedBook({
        ...selectedBook,
        availableStock: Math.min(selectedBook.totalStock, selectedBook.availableStock + 1),
        borrowedStock: Math.max(0, selectedBook.borrowedStock - 1),
      });
    }

    // Update transaction
    const today = new Date().toISOString().split('T')[0];
    const updatedTxs = transactions.map((t) => {
      if (t.id === txId) {
        return {
          ...t,
          status: 'KEMBALI' as const,
          returnDate: today,
          notes: (t.notes ? t.notes + ' · ' : '') + `Dikembalikan pada ${today}. Stok fisik +1 berhasil direkonsiliasi.`,
        };
      }
      return t;
    });
    setTransactions(updatedTxs);
    showToast(`Buku "${tx.bookTitle}" berhasil dikembalikan. Stok rak bertambah +1!`, 'success');
  };

  // Handle Add or Edit Book
  const handleSaveBook = (bookData: Partial<Book>) => {
    if (bookData.id) {
      // Edit existing
      const updated = books.map((b) => (b.id === bookData.id ? ({ ...b, ...bookData } as Book) : b));
      setBooks(updated);
      if (selectedBook?.id === bookData.id) {
        setSelectedBook({ ...selectedBook, ...bookData } as Book);
      }
      showToast(`Data buku "${bookData.title}" berhasil diperbarui.`, 'success');
    } else {
      // Add new
      const nextId = `B0${String(books.length + 1).padStart(2, '0')}`;
      const newBook: Book = {
        id: nextId,
        title: bookData.title || 'Buku Baru',
        author: bookData.author || 'Penulis',
        publisher: bookData.publisher || 'Penerbit Pustaka',
        year: bookData.year || 2026,
        isbn: bookData.isbn || `978-602-${Math.floor(100000 + Math.random() * 900000)}-0`,
        ddc: bookData.ddc || '000.0',
        shelfLocation: bookData.shelfLocation || 'Rak Meja 01',
        category: bookData.category || 'Koleksi Umum',
        totalStock: Number(bookData.totalStock || 1),
        availableStock: Number(bookData.totalStock || 1),
        borrowedStock: 0,
        isStandardCover: bookData.isStandardCover ?? true,
        maxBorrowDays: 7,
        synopsis: bookData.synopsis || '',
      };
      setBooks([newBook, ...books]);
      setSelectedBook(newBook);
      showToast(`Buku "${newBook.title}" (ID: ${newBook.id}) berhasil ditambahkan ke katalog master!`, 'success');
    }
  };

  // Handle Scanner Result
  const handleScanResult = (code: string) => {
    const trimmed = code.trim().toUpperCase();

    // Check if it is a transaction code
    const matchingTx = transactions.find((t) => t.id.toUpperCase() === trimmed);
    if (matchingTx) {
      setActiveTab('riwayat');
      if (matchingTx.status === 'DIPINJAM' || matchingTx.status === 'TERLAMBAT') {
        setTransactionToReturn(matchingTx);
        setIsReturnModalOpen(true);
      } else {
        showToast(`Transaksi ${matchingTx.id} telah selesai dikembalikan.`, 'info');
      }
      return;
    }

    // Check if it is a book ID or ISBN
    const matchingBook = books.find(
      (b) => b.id.toUpperCase() === trimmed || b.isbn.replace(/-/g, '').includes(trimmed.replace(/-/g, ''))
    );
    if (matchingBook) {
      setSelectedBook(matchingBook);
      setActiveTab('katalog');
      showToast(`Buku ditemukan: ${matchingBook.title} (${matchingBook.shelfLocation})`, 'info');
      return;
    }

    showToast(`Kode "${code}" tidak ditemukan dalam basis data sirkulasi.`, 'error');
  };

  // Handle Alert Notification
  const handleNotifyAlert = (alertId: string) => {
    setAlerts(
      alerts.map((a) => {
        if (a.id === alertId) {
          return { ...a, notified: true };
        }
        return a;
      })
    );
    const target = alerts.find((a) => a.id === alertId);
    showToast(`Notifikasi pengingat jatuh tempo berhasil dikirim ke ${target?.borrowerName || 'anggota'}!`, 'success');
  };

  // Get current view title
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'beranda':
        return {
          title: 'Pusat Operasional Sirkulasi',
          subtitle: 'Senin, 16 November 2026 · Konsol Meja Layanan 01',
        };
      case 'katalog':
        return {
          title: 'Katalog Buku Koleksi',
          subtitle: `${books.length} Judul Terdaftar · DDC & Lokasi Rak Fisik`,
        };
      case 'riwayat':
        return {
          title: 'Riwayat Transaksi Sirkulasi',
          subtitle: `Kode Arsip: ARC-TRX-2026.Q1 · Real-Time Sinkronisasi`,
        };
      case 'kelola-buku':
        return {
          title: 'Kelola Data Buku Perpustakaan',
          subtitle: 'Modul Rekonsiliasi Fisik & Master Katalog Induk',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex min-h-screen bg-[#FBF9F5]">
      {/* Desktop / Tablet Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onNewTransaction={() => {
            if (selectedBook && selectedBook.availableStock > 0) {
              setBookToBorrow(selectedBook);
            } else {
              const available = books.find((b) => b.availableStock > 0);
              setBookToBorrow(available || books[0]);
            }
            setIsBorrowModalOpen(true);
          }}
          onOpenScanner={() => setIsScannerModalOpen(true)}
          onRefresh={() => showToast('Data sirkulasi berhasil disinkronkan dengan server induk.', 'info')}
        />

        <main className="flex-1">
          {activeTab === 'beranda' && (
            <BerandaView
              stats={stats}
              recentTransactions={transactions.slice(0, 5)}
              alerts={alerts}
              onProcessReturn={(tx) => {
                setTransactionToReturn(tx);
                setIsReturnModalOpen(true);
              }}
              onNotifyAlert={handleNotifyAlert}
              onNewTransaction={() => {
                const available = books.find((b) => b.availableStock > 0);
                setBookToBorrow(available || books[0]);
                setIsBorrowModalOpen(true);
              }}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'katalog' && (
            <KatalogView
              books={books}
              selectedBook={selectedBook}
              onSelectBook={(b) => setSelectedBook(b)}
              onBorrowBook={(b) => {
                setBookToBorrow(b);
                setIsBorrowModalOpen(true);
              }}
              onPrintLabel={(b) => {
                setBookToPrint(b);
                setIsPrintLabelModalOpen(true);
              }}
              onEditBook={(b) => {
                setEditingBook(b);
                setIsAddBookModalOpen(true);
              }}
              onAddNewBook={() => {
                setEditingBook(null);
                setIsAddBookModalOpen(true);
              }}
              onOpenScanner={() => setIsScannerModalOpen(true)}
            />
          )}

          {activeTab === 'riwayat' && (
            <RiwayatView
              transactions={transactions}
              onProcessReturn={(tx) => {
                setTransactionToReturn(tx);
                setIsReturnModalOpen(true);
              }}
              onOpenScanner={() => setIsScannerModalOpen(true)}
              onNewTransaction={() => {
                const available = books.find((b) => b.availableStock > 0);
                setBookToBorrow(available || books[0]);
                setIsBorrowModalOpen(true);
              }}
            />
          )}

          {activeTab === 'kelola-buku' && (
            <KelolaBukuView
              books={books}
              onAddNewBook={() => {
                setEditingBook(null);
                setIsAddBookModalOpen(true);
              }}
              onEditBook={(b) => {
                setEditingBook(b);
                setIsAddBookModalOpen(true);
              }}
              onPrintLabel={(b) => {
                setBookToPrint(b);
                setIsPrintLabelModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5F2EB] border-t-2 border-[#1E1E1E] flex items-center justify-around p-2 z-40 shadow-[0_-2px_0_0_#1E1E1E]">
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-mono font-bold ${
            activeTab === 'beranda' ? 'text-[#C85A17] bg-[#EBE5D8]' : 'text-[#666666]'
          }`}
        >
          <span>Beranda</span>
        </button>
        <button
          onClick={() => setActiveTab('katalog')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-mono font-bold ${
            activeTab === 'katalog' ? 'text-[#C85A17] bg-[#EBE5D8]' : 'text-[#666666]'
          }`}
        >
          <span>Katalog</span>
        </button>
        <button
          onClick={() => setIsScannerModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#C85A17] text-white border-2 border-[#1E1E1E] flex items-center justify-center -mt-4 shadow-[2px_2px_0_0_#1E1E1E]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-mono font-bold ${
            activeTab === 'riwayat' ? 'text-[#C85A17] bg-[#EBE5D8]' : 'text-[#666666]'
          }`}
        >
          <span>Riwayat</span>
        </button>
        <button
          onClick={() => setActiveTab('kelola-buku')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-mono font-bold ${
            activeTab === 'kelola-buku' ? 'text-[#C85A17] bg-[#EBE5D8]' : 'text-[#666666]'
          }`}
        >
          <span>Kelola</span>
        </button>
      </div>

      {/* Modals */}
      <BorrowModal
        book={bookToBorrow}
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onSubmit={handleBorrowSubmit}
      />

      <ReturnConfirmModal
        transaction={transactionToReturn}
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onConfirm={handleReturnConfirm}
      />

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSaveBook}
        initialData={editingBook}
      />

      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScanResult={handleScanResult}
      />

      <PrintLabelModal
        book={bookToPrint}
        isOpen={isPrintLabelModalOpen}
        onClose={() => {
          setIsPrintLabelModalOpen(false);
          setBookToPrint(null);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div
            className={`px-4 py-3 rounded-xl border-2 border-[#1E1E1E] shadow-[4px_4px_0_0_#1E1E1E] text-xs font-mono font-bold flex items-center gap-3 ${
              toastMessage.type === 'error'
                ? 'bg-rose-100 text-rose-900 border-[#1E1E1E]'
                : toastMessage.type === 'info'
                ? 'bg-amber-100 text-amber-900 border-[#1E1E1E]'
                : 'bg-emerald-100 text-emerald-900 border-[#1E1E1E]'
            }`}
          >
            <span>
              {toastMessage.type === 'error' ? '✕' : toastMessage.type === 'info' ? 'ℹ' : '✓'}
            </span>
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[#777777] hover:text-[#1F2421]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
