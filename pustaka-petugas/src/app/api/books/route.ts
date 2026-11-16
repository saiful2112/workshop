import { NextResponse } from 'next/server';
import { repository } from '../../../lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const filter = searchParams.get('filter') || 'ALL'; // ALL, AVAILABLE, OUT_OF_STOCK

  let books = repository.getBooks();

  if (query) {
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.publisher.toLowerCase().includes(query) ||
        b.isbn.includes(query) ||
        b.id.toLowerCase().includes(query) ||
        b.shelfLocation.toLowerCase().includes(query)
    );
  }

  if (filter === 'AVAILABLE') {
    books = books.filter((b) => b.availableStock > 0);
  } else if (filter === 'OUT_OF_STOCK') {
    books = books.filter((b) => b.availableStock === 0);
  }

  return NextResponse.json({ success: true, count: books.length, data: books });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.author || !body.publisher) {
      return NextResponse.json(
        { success: false, message: 'Judul buku, pengarang, dan penerbit wajib diisi.' },
        { status: 400 }
      );
    }

    const totalStock = parseInt(body.totalStock || '1', 10);
    const newBook = repository.addBook({
      title: body.title,
      author: body.author,
      publisher: body.publisher,
      year: parseInt(body.year || new Date().getFullYear().toString(), 10),
      isbn: body.isbn || `978-602-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
      ddc: body.ddc || '000.0',
      shelfLocation: body.shelfLocation || 'Rak Meja 01',
      category: body.category || 'Koleksi Umum',
      totalStock: totalStock >= 0 ? totalStock : 1,
      availableStock: totalStock >= 0 ? totalStock : 1,
      borrowedStock: 0,
      isStandardCover: body.isStandardCover ?? true,
      maxBorrowDays: parseInt(body.maxBorrowDays || '7', 10),
      synopsis: body.synopsis || 'Deskripsi katalog buku belum ditambahkan.',
    });

    return NextResponse.json({ success: true, message: 'Buku berhasil ditambahkan.', data: newBook });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
