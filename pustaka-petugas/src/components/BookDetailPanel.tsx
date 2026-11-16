'use client';

import React from 'react';
import { Book } from '../types';

interface BookDetailPanelProps {
  book: Book | null;
  onBorrow: (book: Book) => void;
  onPrintLabel: (book: Book) => void;
  onEdit: (book: Book) => void;
  onClose?: () => void;
}

export const BookDetailPanel: React.FC<BookDetailPanelProps> = ({
  book,
  onBorrow,
  onPrintLabel,
  onEdit,
  onClose,
}) => {
  if (!book) {
    return (
      <aside className="w-80 lg:w-96 bg-[#FBF9F5] border-l-2 border-[#1E1E1E] p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBE5D8] border-2 border-[#1E1E1E] flex items-center justify-center text-[#777777] mb-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h4 className="font-serif font-bold text-base text-[#1F2421]">Pilih Buku</h4>
        <p className="text-xs text-[#777777] font-mono mt-1 max-w-[200px]">
          Klik salah satu kartu buku di katalog untuk melihat detail bibliografi dan memproses peminjaman.
        </p>
      </aside>
    );
  }

  const isAvailable = book.availableStock > 0;

  return (
    <aside className="w-80 lg:w-96 bg-[#FBF9F5] border-l-2 border-[#1E1E1E] flex flex-col justify-between h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header Drawer */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C85A17]">
              DETAIL BIBLIOGRAFI
            </span>
            <h3 className="font-mono font-bold text-sm text-[#1F2421]">
              ID: {book.id}
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#EBE5D8] text-[#555555]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Big Book Cover Preview */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-56 rounded-lg border-2 border-[#1E1E1E] bg-[#EBE5D8] shadow-[4px_4px_0_0_#1E1E1E] p-4 flex flex-col justify-between relative overflow-hidden text-center">
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#C85A17]" />
            <div className="text-[9px] font-mono font-bold tracking-widest text-[#8C857B] uppercase">
              PERPUSTAKAAN MEJA LAYANAN
            </div>
            <div>
              <div className="font-serif font-bold text-base leading-tight text-[#1F2421]">
                {book.title}
              </div>
              <div className="text-xs text-[#666666] font-mono mt-1">
                {book.author}
              </div>
            </div>
            <div className="bg-[#FFFFFF] border border-[#1E1E1E] rounded py-1 px-2 text-[10px] font-mono font-bold text-[#C85A17]">
              {book.id} · DDC {book.ddc}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => alert(`Format sampul standar Athenaeum aktif untuk ${book.title}. Admin dapat mengunggah sampul kustom melalui tab Kelola Buku.`)}
              className="text-[11px] font-mono font-bold text-[#666666] hover:text-[#1F2421] underline"
            >
              Ganti Sampul Buku
            </button>
            <span className="text-[#D9D2C5]">·</span>
            <span className="text-[10px] font-mono text-[#8C857B]">Sampul Standar</span>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="bg-[#F5F2EB] border-2 border-[#1E1E1E] rounded-xl p-4 shadow-[2px_2px_0_0_#1E1E1E] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Klasifikasi DDC:</span>
            <span className="font-mono font-bold text-[#1F2421] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#1E1E1E]">
              {book.ddc}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Lokasi Rak:</span>
            <span className="font-bold text-[#1F2421]">{book.shelfLocation}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Penerbit & Tahun:</span>
            <span className="text-[#1F2421]">{book.publisher} ({book.year})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Nomor ISBN:</span>
            <span className="font-mono text-[#1F2421]">{book.isbn}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Batas Pinjam:</span>
            <span className="font-mono font-bold text-[#C85A17]">
              Maks. {book.maxBorrowDays} Hari Kerja
            </span>
          </div>
          <div className="h-px bg-[#D9D2C5]" />
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#666666]">Ketersediaan Fisik:</span>
            {isAvailable ? (
              <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
                Tersedia {book.availableStock} dari {book.totalStock} Eks
              </span>
            ) : (
              <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-400">
                Stok buku habis
              </span>
            )}
          </div>
        </div>

        {/* Synopsis / Description */}
        {book.synopsis && (
          <div>
            <h4 className="text-xs font-mono font-bold text-[#666666] uppercase tracking-wider mb-1">
              Ringkasan / Sinopsis:
            </h4>
            <p className="text-xs text-[#444444] leading-relaxed bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D2C5]">
              {book.synopsis}
            </p>
          </div>
        )}

        {/* Operational Notice */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-900 font-mono flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            Denda keterlambatan berlaku <strong>Rp 1.000/hari kerja</strong> setelah batas jatuh tempo.
          </div>
        </div>
      </div>

      {/* Action Buttons Sticky Footer */}
      <div className="p-6 border-t-2 border-[#1E1E1E] bg-[#EBE5D8] space-y-2">
        <button
          disabled={!isAvailable}
          onClick={() => onBorrow(book)}
          className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 ${
            isAvailable
              ? 'bg-[#C85A17] hover:bg-[#A34710] text-white border-[#1E1E1E] shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5'
              : 'bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isAvailable ? 'PINJAM BUKU INI' : 'STOK BUKU HABIS'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPrintLabel(book)}
            className="py-2 px-3 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Label
          </button>

          <button
            onClick={() => onEdit(book)}
            className="py-2 px-3 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Ubah Data
          </button>
        </div>
      </div>
    </aside>
  );
};
