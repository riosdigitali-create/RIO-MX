import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { getAnnouncement, makeId, saveAnnouncement } from '@/lib/rio-db';
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user)
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const data = await request.formData();
  const id = String(data.get('id') || makeId('ann'));
  const existing = await getAnnouncement(id);
  const media = data.get('media');
  let mediaUrl = String(data.get('mediaUrl') || existing?.media_url || '');
  let mediaType = String(
    data.get('mediaType') || existing?.media_type || 'image',
  ) as 'image' | 'video';
  if (media instanceof File && media.size > 0) {
    if (media.size > 60 * 1024 * 1024)
      return NextResponse.json(
        { error: 'El archivo no puede superar 60 MB.' },
        { status: 400 },
      );
    mediaType = media.type.startsWith('video/') ? 'video' : 'image';
    const safeName = media.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const key = `announcements/${id}-${Date.now()}-${safeName}`;
    await env.FILES.put(key, await media.arrayBuffer(), {
      httpMetadata: { contentType: media.type },
    });
    mediaUrl = `/api/media/${key}`;
  }
  const values = {
    eyebrow: String(data.get('eyebrow') || '').trim(),
    title: String(data.get('title') || '').trim(),
    body: String(data.get('body') || '').trim(),
    cta_label: String(data.get('ctaLabel') || '').trim(),
    cta_url: String(data.get('ctaUrl') || '').trim(),
  };
  if (Object.values(values).some((value) => !value) || !mediaUrl)
    return NextResponse.json(
      { error: 'Completa todos los campos y agrega una imagen o video.' },
      { status: 400 },
    );
  await saveAnnouncement({
    id,
    ...values,
    media_type: mediaType,
    media_url: mediaUrl,
    sort_order: Number(data.get('sortOrder') || 0),
    published: String(data.get('published')) === 'false' ? 0 : 1,
  });
  return NextResponse.json({ ok: true, id });
}
export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user)
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const body = (await request.json()) as { id?: string; published?: boolean };
  if (!body.id)
    return NextResponse.json({ error: 'Falta el anuncio.' }, { status: 400 });
  const existing = await getAnnouncement(body.id);
  if (!existing)
    return NextResponse.json(
      { error: 'Anuncio no encontrado.' },
      { status: 404 },
    );
  await saveAnnouncement({ ...existing, published: body.published ? 1 : 0 });
  return NextResponse.json({ ok: true });
}
