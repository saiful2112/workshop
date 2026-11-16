'use client';

import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  isSelected?: boolean;
  onSelect: (book: Book) => void;
  onBorrow?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isSelected,
  onSelect,
  onBorrow,
}) => {
  const isAvailable = book.availableStock > 0;

  return (
    <div
      onClick={() => onSelect(book)}
      className={`group relative bg-[#FFFFFF] rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-[#C85A17] shadow-[4px_4px_0_0_#C85A17] bg-[#FFFBF7]'
          : 'border-[#1E1E1E] shadow-[3px_3px_0_0_#1E1E1E] hover:shadow-[5px_5px_0_0_#1E1E1E] hover:-translate-y-0.5'
      }`}
    >
      <div className="p-4 flex gap-4">
        {/* Book Cover Illustration */}
        <div className="w-20 h-28 flex-shrink-0 rounded border-2 border-[#1E1E1E] bg-[#EBE5D8] flex flex-col justify-between p-2 relative overflow-hidden shadow-[2px_2px_0_0_#1E1E1E]">
          <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8C857B] border-b border-[#D9D2C5] pb-0.5">
            PUSTAKA
          </div>
          <div className="my-auto text-center">
            <span className="font-serif font-bold text-xs leading-tight text-[#1F2421] line-clamp-3">
              {book.title}
            </span>
            <span className="block text-[8px] text-[#666666] font-mono mt-1 truncate">
              {book.author}
            </span>
          </div>
          <div className="text-[7px] font-mono text-center text-[#C85A17] bg-[#F5F2EB] py-0.5 rounded border border-[#D9D2C5]">
            {book.id}
          </div>

          {/* Spine ribbon decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C85A17]" />
        </div>

        {/* Book Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F5F2EB] border border-[#1E1E1E] text-[#1F2421]">
                DDC {book.ddc}
              </span>
              <span className="text-[10px] font-mono text-[#666666]">
                {book.shelfLocation}
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-[#1F2421] leading-snug line-clamp-2 group-hover:text-[#C85A17] transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-[#555555] font-sans mt-0.5 truncate">
              {book.author} ({book.year})
            </p>
            <p className="text-[11px] font-mono text-[#8C857B] mt-0.5">
              ISBN: {book.isbn}
            </p>
          </div>

          {/* Stock Badges */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Tersedia [{book.availableStock}/{book.totalStock}]
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Stok Habis [0/{book.totalStock}]
              </span>
            )}

            {onBorrow && (
              <button
                disabled={!isAvailable}
                onClick={(e) => {
                  e.stopPropagation();
                  onBorrow(book);
                }}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded border transition-all ${
                  isAvailable
                    ? 'bg-[#C85A17] hover:bg-[#A34710] text-white border-[#1E1E1E] shadow-[1px_1px_0_0_#1E1E1E] active:translate-x-0.5'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'PINJAM' : 'HABIS'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
