'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Book>) => void;
  initialData?: Book | null;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState(2026);
  const [isbn, setIsbn] = useState('');
  const [ddc, setDdc] = useState('899.2');
  const [shelfLocation, setShelfLocation] = useState('Rak Sastra B-01');
  const [category, setCategory] = useState('Sastra Indonesia');
  const [totalStock, setTotalStock] = useState(5);
  const [synopsis, setSynopsis] = useState('');
  const [isStandardCover, setIsStandardCover] = useState(true);
  const [coverFileName, setCoverFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setPublisher(initialData.publisher);
      setYear(initialData.year);
      setIsbn(initialData.isbn);
      setDdc(initialData.ddc);
      setShelfLocation(initialData.shelfLocation);
      setCategory(initialData.category);
      setTotalStock(initialData.totalStock);
      setSynopsis(initialData.synopsis || '');
      setIsStandardCover(initialData.isStandardCover ?? true);
    } else {
      setTitle('');
      setAuthor('');
      setPublisher('');
      setYear(2026);
      setIsbn(`978-602-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`);
      setDdc('899.2');
      setShelfLocation('Rak Sastra B-01');
      setCategory('Sastra Indonesia');
      setTotalStock(5);
      setSynopsis('');
      setIsStandardCover(true);
      setCoverFileName('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !publisher.trim()) {
      setError('Judul Buku, Pengarang, dan Penerbit wajib diisi.');
      return;
    }
    setError('');

    onSubmit({
      id: initialData?.id,
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      year: Number(year),
      isbn: isbn.trim(),
      ddc: ddc.trim(),
      shelfLocation: shelfLocation.trim(),
      category: category.trim(),
      totalStock: Math.max(1, Number(totalStock)),
      availableStock: initialData
        ? Math.max(0, Number(totalStock) - (initialData.borrowedStock || 0))
        : Math.max(1, Number(totalStock)),
      borrowedStock: initialData ? initialData.borrowedStock : 0,
      isStandardCover,
      synopsis: synopsis.trim(),
    });

    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran berkas melebihi batas maksimal 2MB.');
        return;
      }
      setCoverFileName(file.name);
      setIsStandardCover(false);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF9F5] rounded-2xl border-2 border-[#1E1E1E] shadow-[8px_8px_0_0_#1E1E1E] max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#EBE5D8] px-6 py-4 border-b-2 border-[#1E1E1E] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold text-sm border border-[#1E1E1E]">
              +
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                {initialData ? 'Ubah Data Buku Koleksi' : 'Tambah Buku Baru ke Katalog'}
              </h3>
              <p className="text-[11px] font-mono text-[#666666]">
                Modul Rekonsiliasi Fisik & Master
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-mono text-rose-800 flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Cover Management Box */}
          <div className="p-4 bg-[#F5F2EB] border-2 border-[#1E1E1E] rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-[#1F2421] uppercase tracking-wider block">
              Pengaturan Sampul Buku
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-28 rounded border-2 border-[#1E1E1E] bg-[#EBE5D8] flex flex-col justify-between p-2 text-center shadow-[2px_2px_0_0_#1E1E1E]">
                <div className="text-[7px] font-mono font-bold text-[#8C857B]">PUSTAKA</div>
                <div className="text-[10px] font-serif font-bold text-[#1F2421] line-clamp-2">
                  {title || 'Judul Buku'}
                </div>
                <div className="text-[7px] font-mono text-[#C85A17]">{ddc}</div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 font-mono cursor-pointer">
                    <input
                      type="radio"
                      name="coverType"
                      checked={isStandardCover}
                      onChange={() => {
                        setIsStandardCover(true);
                        setCoverFileName('');
                      }}
                      className="text-[#C85A17]"
                    />
                    Gunakan Sampul Standar Athenaeum
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg border border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#EBE5D8] font-mono font-bold text-[11px] cursor-pointer inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Pilih Berkas Sampul
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#777777] font-mono">
                    {coverFileName || 'JPG, PNG, WebP maks 2MB'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form inputs */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
              Judul Buku *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Cantik Itu Luka"
              className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-serif"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Pengarang / Penulis Utama *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama penulis"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Penerbit *
              </label>
              <input
                type="text"
                required
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Nama penerbit buku"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                min="1900"
                max="2099"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Klasifikasi DDC
              </label>
              <input
                type="text"
                value={ddc}
                onChange={(e) => setDdc(e.target.value)}
                placeholder="Contoh: 899.2"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Jumlah Stok Eksemplar *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={totalStock}
                onChange={(e) => setTotalStock(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Nomor ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-..."
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
                Lokasi Rak Fisik
              </label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Contoh: Rak B-04"
                className="w-full px-3 py-2 text-sm bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
              Deskripsi Singkat / Ringkasan Koleksi
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Catatan bibliografi singkat untuk petugas sirkulasi..."
              className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
            />
          </div>

          <div className="p-3 bg-[#EBE5D8] rounded-lg border border-[#1E1E1E] text-[11px] font-mono text-[#555555]">
            Data akan disinkronkan langsung ke basis data katalog master meja sirkulasi.
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              Simpan Buku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
