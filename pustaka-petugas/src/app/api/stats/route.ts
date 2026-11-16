import { NextResponse } from 'next/server';
import { repository } from '../../../lib/store';

export async function GET() {
  const stats = repository.getStats();
  const alerts = repository.getAlerts();
  const recentTransactions = repository.getTransactions().slice(0, 5);

  return NextResponse.json({
    success: true,
    data: {
      stats,
      alerts,
      recentTransactions,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'NOTIFY_ALERT' && body.alertId) {
      const ok = repository.notifyAlert(body.alertId);
      return NextResponse.json({
        success: ok,
        message: ok ? 'Notifikasi pengingat berhasil dikirim ke anggota.' : 'Alert tidak ditemukan.',
      });
    }
    return NextResponse.json({ success: false, message: 'Aksi tidak dikenali.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
