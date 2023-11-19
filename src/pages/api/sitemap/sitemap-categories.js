// src/pages/api/sitemap-categories.js

export default async function sitemapCategories(req, res) {
  let categoryUrls = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getCategorySitemapData`);

    const data = await response.json();
    categoryUrls = data.sitemapLinks;
  } catch (error) {
    console.error('Failed to fetch category sitemap data:', error);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  categoryUrls.forEach(({ loc, lastmod }) => {
    res.write(`
      <url>
        <loc>${loc}/</loc>
        <lastmod>${lastmod}</lastmod>
      </url>
    `);
  });

  res.write('</urlset>');
  res.end();
}
