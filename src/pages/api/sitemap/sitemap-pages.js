export default function sitemapPages(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://injexi.com';
  const staticPages = [
    '/', 
    '/about/',
    '/au/', 
    '/blog/',
    '/contact/', 
    '/for-business/',
    '/login/',
    '/privacy/',
    '/register/', 
    '/sitemap/',
    '/terms/'
  ];

  res.setHeader('Content-Type', 'text/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  staticPages.forEach((path) => {
    res.write(`
      <url>
        <loc>${baseUrl}${path}</loc>
        <lastmod></lastmod>
      </url>
    `);
  });

  res.write('</urlset>');
  res.end();
}
