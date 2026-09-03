import { PublicHome } from '@/components/rio/public-home';
import { listAnnouncements, listEvents } from '@/lib/rio-db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [announcements, events] = await Promise.all([
    listAnnouncements(),
    listEvents(),
  ]);
  return <PublicHome initialAnnouncements={announcements} events={events} />;
}
