import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { redeemTicket } from '@/lib/rio-db';
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user)
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const body = (await request.json()) as { code?: string };
  const token = extractToken(body.code || '');
  if (!token)
    return NextResponse.json(
      { state: 'invalid', error: 'Código inválido.' },
      { status: 400 },
    );
  return NextResponse.json(await redeemTicket(token, user.email));
}
function extractToken(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('RIO:')) return trimmed.slice(4);
  const match = trimmed.match(/\/boleto\/([^/?#]+)/);
  return match?.[1] || (/^[\w-]{20,}$/.test(trimmed) ? trimmed : '');
}
