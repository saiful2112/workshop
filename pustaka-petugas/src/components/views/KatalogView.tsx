'use client';

import React, { useState, useMemo } from 'react';
import { Book } from '../../types';
import { BookCard } from '../BookCard';
import { BookDetailPanel } from '../BookDetailPanel';

interface KatalogViewProps {
  books: Book[];
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onPrintLabel: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onAddNewBook: () => void;
  onOpenScanner: () => void;
}

export const KatalogView: React.FC<KatalogViewProps> = ({
  books,
  selectedBook,
  onSelectBook,
  onBorrowBook,
  onPrintLabel,
  onEditBook,
  onAddNewBook,
  onOpenScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'OUT_OF_STOCK'>('ALL');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery) ||
        book.ddc.includes(searchQuery) ||
        book.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'AVAILABLE') return book.availableStock > 0;
      if (filterStatus === 'OUT_OF_STOCK') return book.availableStock === 0;
      return true;
    });
  }, [books, searchQuery, filterStatus]);

  const countAvailable = books.filter((b) => b.availableStock > 0).length;
  const countOutOfStock = books.filter((b) => b.availableStock === 0).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
      {/* Left/Middle Content: Catalog Grid & Filter */}
      <div className="flex-1 p-6 space-y-6 max-w-5xl">
        {/* Header & Main Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#1E1E1E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8C857B] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#C85A17]" />
              <span>DAFTAR KOLEKSI TERVERIFIKASI</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#1F2421]">
              Katalog Buku Koleksi ({books.length} Judul Terdaftar)
            </h1>
          </div>

          <button
            onClick={onAddNewBook}
            className="px-4 py-2 rounded-xl border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Tambah Buku Baru
          </button>
        </div>

        {/* Search Bar & Scanner Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, pengarang, penerbit, DDC, atau nomor ISBN..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0_0_#1E1E1E] focus:outline-none focus:border-[#C85A17] font-sans"
            />
            <div className="absolute left-3.5 top-3 text-[#777777]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs font-mono text-[#8C857B] hover:text-[#1F2421]"
              >
                ✕ Hapus
              </button>
            )}
          </div>

          <button
            onClick={onOpenScanner}
            className="px-4 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <svg className="w-4 h-4 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            SCAN Barcode
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#777777] mr-1">Filter Ketersediaan:</span>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border-2 transition-all ${
              filterStatus === 'ALL'
                ? 'bg-[#C85A17] text-white border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E]'
                : 'bg-[#FFFFFF] text-[#333333] border-[#1E1E1E] hover:bg-[#F5F2EB]'
            }`}
          >
            Semua ({books.length})
          </button>
          <button
            onClick={() => setFilterStatus('AVAILABLE')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border-2 transition-all ${
              filterStatus === 'AVAILABLE'
                ? 'bg-emerald-700 text-white border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E]'
                : 'bg-[#FFFFFF] text-emerald-800 border-[#1E1E1E] hover:bg-emerald-50'
            }`}
          >
            Tersedia ({countAvailable})
          </button>
          <button
            onClick={() => setFilterStatus('OUT_OF_STOCK')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border-2 transition-all ${
              filterStatus === 'OUT_OF_STOCK'
                ? 'bg-rose-700 text-white border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E]'
                : 'bg-[#FFFFFF] text-rose-800 border-[#1E1E1E] hover:bg-rose-50'
            }`}
          >
            Stok Habis ({countOutOfStock})
          </button>
        </div>

        {/* Book Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] border-2 border-dashed border-[#1E1E1E] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#EBE5D8] border border-[#1E1E1E] flex items-center justify-center mx-auto text-[#777777] mb-2 font-mono text-xl">
              ?
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F2421]">Tidak ada buku ditemukan</h3>
            <p className="text-xs font-mono text-[#666666] mt-1">
              Kata kunci &ldquo;{searchQuery}&rdquo; tidak cocok dengan judul atau ISBN yang terdaftar.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('ALL');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg border border-[#1E1E1E] bg-[#F5F2EB] text-xs font-mono font-bold"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isSelected={selectedBook?.id === book.id}
                onSelect={(b) => onSelectBook(b)}
                onBorrow={(b) => onBorrowBook(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right-Side Book Detail Drawer Panel */}
      <BookDetailPanel
        book={selectedBook}
        onBorrow={onBorrowBook}
        onPrintLabel={onPrintLabel}
        onEdit={onEditBook}
      />
    </div>
  );
};
