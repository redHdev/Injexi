export default function sitemapIndex(req, res) {
  res.setHeader('Content-Type', 'text/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  const sitemaps = ['sitemap-pages', 'sitemap-clinics', 'sitemap-categories', 'sitemap-blogs'];
  
  sitemaps.forEach((sitemap) => {
    res.write(`
      <sitemap>
        <loc>${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sitemap/${sitemap}/</loc>
      </sitemap>
    `);
  });

  res.write('</sitemapindex>');
  res.end();
}
