import { NextResponse } from 'next/server';
import { repository } from '../../../lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // ALL, DIPINJAM, KEMBALI
  const query = searchParams.get('q')?.toLowerCase() || '';

  let txs = repository.getTransactions();

  if (status && status !== 'ALL') {
    if (status === 'DIPINJAM') {
      txs = txs.filter((t) => t.status === 'DIPINJAM' || t.status === 'TERLAMBAT');
    } else if (status === 'KEMBALI') {
      txs = txs.filter((t) => t.status === 'KEMBALI');
    }
  }

  if (query) {
    txs = txs.filter(
      (t) =>
        t.id.toLowerCase().includes(query) ||
        t.borrowerName.toLowerCase().includes(query) ||
        t.borrowerId.toLowerCase().includes(query) ||
        t.bookTitle.toLowerCase().includes(query) ||
        t.bookAuthor.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ success: true, count: txs.length, data: txs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.bookId || !body.borrowerName || !body.borrowerId) {
      return NextResponse.json(
        { success: false, message: 'Buku, Nama Peminjam, dan ID Peminjam (NIM/NIP) wajib diisi.' },
        { status: 400 }
      );
    }

    const result = repository.borrowBook({
      bookId: body.bookId,
      borrowerName: body.borrowerName,
      borrowerId: body.borrowerId,
      borrowerType: body.borrowerType || 'MAHASISWA',
      daysToBorrow: body.daysToBorrow ? parseInt(body.daysToBorrow, 10) : 7,
      notes: body.notes,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Peminjaman berhasil dicatat.', data: result.transaction });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.transactionId) {
      return NextResponse.json({ success: false, message: 'ID transaksi wajib disertakan.' }, { status: 400 });
    }

    const result = repository.returnBook(body.transactionId);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pengembalian buku berhasil diproses. Stok eksemplar bertambah +1.',
      data: result.transaction,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
