import { NextResponse } from 'next/server';
import { createGroupRequest } from '@/lib/rio-db';
export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  if (['fullName', 'email', 'phone', 'zone'].some((key) => !body[key]?.trim()))
    return NextResponse.json(
      { error: 'Completa los campos requeridos.' },
      { status: 400 },
    );
  const id = await createGroupRequest({
    full_name: body.fullName.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    zone: body.zone.trim(),
    preferred_day: body.preferredDay?.trim() || null,
    notes: body.notes?.trim() || null,
  });
  return NextResponse.json({
    id,
    message:
      'Recibimos tu solicitud. El equipo de RÍO la revisará desde el panel.',
  });
}
