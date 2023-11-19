// src/pages/api/sitemap-blogs.js

export default async function sitemapBlogs(req, res) {
  let blogUrls = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBlogSitemapData`);

    const data = await response.json();
    blogUrls = data.sitemapLinks;
  } catch (error) {
    console.error('Failed to fetch blog sitemap data:', error);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  blogUrls.forEach(({ loc, lastmod }) => {
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
