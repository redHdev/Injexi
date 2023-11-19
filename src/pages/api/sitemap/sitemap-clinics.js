// src/pages/api/sitemap-clinics.js

export default async function sitemapClinics(req, res) {
  let clinicUrls = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getClinicSitemapData`);

    const data = await response.json();
    clinicUrls = data.sitemapLinks;
  } catch (error) {
    console.error('Failed to fetch clinic sitemap data:', error);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  clinicUrls.forEach(({ loc, lastmod }) => {
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
