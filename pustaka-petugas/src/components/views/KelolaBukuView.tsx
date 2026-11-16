'use client';

import React, { useState, useMemo } from 'react';
import { Book } from '../../types';

interface KelolaBukuViewProps {
  books: Book[];
  onAddNewBook: () => void;
  onEditBook: (book: Book) => void;
  onPrintLabel: (book: Book) => void;
}

export const KelolaBukuView: React.FC<KelolaBukuViewProps> = ({
  books,
  onAddNewBook,
  onEditBook,
  onPrintLabel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'OUT_OF_STOCK'>('ALL');

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matches =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.includes(searchQuery);

      if (!matches) return false;

      if (statusFilter === 'AVAILABLE') return b.availableStock > 0;
      if (statusFilter === 'OUT_OF_STOCK') return b.availableStock === 0;
      return true;
    });
  }, [books, searchQuery, statusFilter]);

  const totalExemplars = books.reduce((acc, b) => acc + b.totalStock, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#1E1E1E] p-6 shadow-[4px_4px_0_0_#1E1E1E] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C857B] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>KONSOL ADMINISTRASI MEJA</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1F2421]">
            Kelola Data Buku Perpustakaan
          </h1>
          <p className="text-xs font-mono text-[#666666] mt-0.5">
            Modul Rekonsiliasi Fisik & Katalog Induk ·{' '}
            <span className="text-emerald-700 font-bold">Index Katalog: Sinkron</span> · Total:{' '}
            <strong>{books.length} Judul ({totalExemplars} Eks)</strong>
          </p>
        </div>

        <button
          onClick={onAddNewBook}
          className="px-5 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          + Tambah Buku Baru
        </button>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F5F2EB] p-4 rounded-xl border-2 border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E]">
        <div className="relative flex-1 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID buku, judul, pengarang, atau penerbit..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-sans"
          />
          <div className="absolute left-3 top-2.5 text-[#777777]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-mono text-[#666666] whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-mono font-bold bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
          >
            <option value="ALL">SEMUA STATUS ({books.length})</option>
            <option value="AVAILABLE">TERSEDIA &gt; 0</option>
            <option value="OUT_OF_STOCK">STOK HABIS (0)</option>
          </select>
        </div>
      </div>

      {/* Master Inventory Table */}
      <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0_0_#1E1E1E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1E1E1E] bg-[#EBE5D8] text-[11px] font-mono text-[#666666] uppercase">
                <th className="py-3 px-4 text-center w-16">Sampul</th>
                <th className="py-3 px-4">ID Buku</th>
                <th className="py-3 px-4">Judul & Pengarang</th>
                <th className="py-3 px-4">Penerbit & Tahun</th>
                <th className="py-3 px-4">DDC & Rak</th>
                <th className="py-3 px-4 text-center">Stok Fisik</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-[#E5E0D8] text-xs">
              {filteredBooks.map((book) => {
                const isOut = book.availableStock === 0;
                const isLow = book.availableStock > 0 && book.availableStock <= 2;

                return (
                  <tr key={book.id} className="hover:bg-[#FBF9F5] transition-colors">
                    {/* Small Cover Preview */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-9 h-12 rounded border border-[#1E1E1E] bg-[#EBE5D8] mx-auto flex flex-col justify-between p-1 text-[7px] font-mono shadow-sm">
                        <span className="font-bold text-[#C85A17]">{book.id}</span>
                        <div className="w-full h-0.5 bg-[#C85A17]" />
                      </div>
                    </td>

                    {/* ID Buku */}
                    <td className="py-3 px-4 font-mono font-bold text-[#1F2421]">
                      {book.id}
                      <span className="block text-[10px] text-[#8C857B] font-normal">{book.isbn}</span>
                    </td>

                    {/* Judul & Pengarang */}
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-sm text-[#1F2421]">
                        {book.title}
                      </div>
                      <div className="text-xs text-[#666666]">{book.author}</div>
                    </td>

                    {/* Penerbit & Tahun */}
                    <td className="py-3 px-4">
                      <div className="text-[#333333]">{book.publisher}</div>
                      <div className="text-[11px] font-mono text-[#777777]">Tahun {book.year}</div>
                    </td>

                    {/* DDC & Rak */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 bg-[#F5F2EB] border border-[#1E1E1E] rounded font-bold mr-1">
                        DDC {book.ddc}
                      </span>
                      <span className="text-[#666666]">{book.shelfLocation}</span>
                    </td>

                    {/* Stok Fisik */}
                    <td className="py-3 px-4 text-center font-mono">
                      {isOut ? (
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-rose-100 text-rose-800 border border-rose-300">
                          0 EKS (Habis)
                        </span>
                      ) : isLow ? (
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-amber-100 text-amber-800 border border-amber-300">
                          {book.availableStock}/{book.totalStock} EKS
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {book.availableStock}/{book.totalStock} EKS
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintLabel(book)}
                          title="Cetak Label"
                          className="px-2 py-1 text-[11px] font-mono rounded border border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-[#333333]"
                        >
                          Label
                        </button>
                        <button
                          onClick={() => onEditBook(book)}
                          className="px-3 py-1 text-[11px] font-mono font-bold rounded border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#C85A17] hover:text-white text-[#1F2421] transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F5F2EB] border-t-2 border-[#1E1E1E] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-[#666666]">
          <span>
            Menampilkan {filteredBooks.length} dari {books.length} judul koleksi master
          </span>
          <span className="text-[#C85A17] font-bold">
            Audit Fisik Terakhir: 16 Nov 2026 (Sesuai Berita Acara Triwulan)
          </span>
        </div>
      </div>

      {/* Catatan Pedoman Inventaris Meja Pustaka */}
      <div className="p-5 bg-[#EBE5D8] border-2 border-[#1E1E1E] rounded-2xl shadow-[3px_3px_0_0_#1E1E1E] space-y-2">
        <h4 className="font-serif font-bold text-sm text-[#1F2421]">
          Pedoman Rekonsiliasi Inventaris Meja Layanan
        </h4>
        <p className="text-xs text-[#555555] leading-relaxed">
          1. Penambahan eksemplar fisik harus dibubuhi stempel barcode dan label klasifikasi DDC sebelum ditempatkan di rak koleksi umum.<br />
          2. Apabila terjadi selisih stok fisik antara sistem sirkulasi dan rak perpustakaan, segera buat berita acara selisih inventaris untuk disahkan oleh Kepala Perpustakaan.
        </p>
      </div>
    </div>
  );
};
