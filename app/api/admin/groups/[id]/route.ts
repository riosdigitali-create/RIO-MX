import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { reviewGroupRequest } from '@/lib/rio-db';
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user)
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json()) as { status?: 'approved' | 'rejected' };
  if (body.status !== 'approved' && body.status !== 'rejected')
    return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 });
  await reviewGroupRequest(id, body.status, user.email);
  return NextResponse.json({ ok: true });
}
