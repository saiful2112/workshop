'use client';

import React, { useState } from 'react';
import { Book } from '../types';

interface BorrowModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bookId: string;
    borrowerName: string;
    borrowerId: string;
    borrowerType: 'MAHASISWA' | 'DOSEN' | 'STAF';
    daysToBorrow: number;
    notes?: string;
  }) => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerId, setBorrowerId] = useState('');
  const [borrowerType, setBorrowerType] = useState<'MAHASISWA' | 'DOSEN' | 'STAF'>('MAHASISWA');
  const [daysToBorrow, setDaysToBorrow] = useState(7);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim() || !borrowerId.trim()) {
      setError('Nama lengkap peminjam dan Nomor Induk (NIM/NIP) wajib diisi.');
      return;
    }
    setError('');
    onSubmit({
      bookId: book.id,
      borrowerName: borrowerName.trim(),
      borrowerId: borrowerId.trim(),
      borrowerType,
      daysToBorrow,
      notes: notes.trim(),
    });
    // Reset
    setBorrowerName('');
    setBorrowerId('');
    setNotes('');
    onClose();
  };

  const calculateDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + Number(daysToBorrow));
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF9F5] rounded-2xl border-2 border-[#1E1E1E] shadow-[8px_8px_0_0_#1E1E1E] max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#EBE5D8] px-6 py-4 border-b-2 border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold font-mono text-sm border border-[#1E1E1E]">
              TX
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                Formulir Peminjaman Buku
              </h3>
              <p className="text-[11px] font-mono text-[#666666]">
                Sistem Sirkulasi Meja 01
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] flex items-center justify-center text-[#555555]"
          >
            ✕
          </button>
        </div>

        {/* Selected Book Info Bar */}
        <div className="bg-[#F5F2EB] px-6 py-3 border-b-2 border-[#1E1E1E] flex items-center justify-between">
          <div>
            <div className="text-xs font-serif font-bold text-[#1F2421]">
              {book.title}
            </div>
            <div className="text-[11px] font-mono text-[#777777]">
              {book.author} · ID: {book.id} · {book.shelfLocation}
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
            Stok: {book.availableStock} Eks
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-mono text-rose-800 flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Nama Lengkap Peminjam *
              </label>
              <input
                type="text"
                required
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="Contoh: Rian Pratama"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Nomor Induk (NIM / NIP) *
              </label>
              <input
                type="text"
                required
                value={borrowerId}
                onChange={(e) => setBorrowerId(e.target.value)}
                placeholder="NIM 220109... / NIP"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Kategori Anggota
              </label>
              <select
                value={borrowerType}
                onChange={(e) => setBorrowerType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              >
                <option value="MAHASISWA">Mahasiswa</option>
                <option value="DOSEN">Dosen Pengajar</option>
                <option value="STAF">Staf / Karyawan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Durasi Pinjam (Hari)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={daysToBorrow}
                onChange={(e) => setDaysToBorrow(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#EBE5D8] rounded-lg border border-[#1E1E1E] text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-[#666666]">Tanggal Pinjam:</span>
              <span className="font-bold text-[#1F2421]">Hari Ini (Senin, 16 Nov 2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Batas Jatuh Tempo:</span>
              <span className="font-bold text-[#C85A17]">{calculateDueDate()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
              Catatan / Kondisi Fisik Saat Dipinjam (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Halaman lengkap, cover terpasang sampul mika"
              className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5"
            >
              Konfirmasi Peminjaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
