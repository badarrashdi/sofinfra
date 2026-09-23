import { getProperties, getProjects, getHomepageData } from '@/lib/wordpress';
import HomeClient from '@/components/home/HomeClient';

export const revalidate = 10; // ISR revalidation every 10 seconds

export default async function HomePage() {
  const [properties, projects, homepageData] = await Promise.all([
    getProperties(),
    getProjects(),
    getHomepageData(),
  ]);

  return (
    <HomeClient
      initialProperties={properties}
      initialProjects={projects}
      homepageData={homepageData}
    />
  );
}
