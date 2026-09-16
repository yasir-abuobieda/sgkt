import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const SITE_URL = 'https://sgkturkiye.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base static routes
  const routes = ['', '/about', '/events', '/news', '/gallery', '/contact'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic news slugs
  try {
    const { data: news } = await supabase.from('news').select('slug, created_at');
    
    if (news) {
      const newsRoutes = news.map((item) => ({
        url: `${SITE_URL}/news/${encodeURIComponent(item.slug)}`,
        lastModified: new Date(item.created_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      
      return [...routes, ...newsRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
