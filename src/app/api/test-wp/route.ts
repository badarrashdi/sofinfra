import { NextResponse } from 'next/server';
import { getHomepageData, getProjects, getProperties } from '@/lib/wordpress';

export async function GET() {
  try {
    const startTime = Date.now();
    const [homepageData, projects, properties] = await Promise.all([
      getHomepageData(),
      getProjects(),
      getProperties(),
    ]);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration,
      homepageDataSectionsCount: homepageData?.sections?.length || 0,
      heroHeadline: homepageData?.sections?.[0]?.acf_fc_layout === 'hero_section' ? (homepageData.sections[0] as any).headline : null,
      projectsCount: projects.length,
      propertiesCount: properties.length,
      homepageData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
