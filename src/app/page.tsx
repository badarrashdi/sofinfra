import { getProperties } from '@/lib/wordpress';
import HomeClient from '@/components/home/HomeClient';

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const properties = await getProperties();

  return <HomeClient initialProperties={properties} />;
}
