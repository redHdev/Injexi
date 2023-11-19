import Head from 'next/head';
import getMetaConfig from '/utilities/metaConfigDynamic.js';

function HeadMetaDynamic(props) {
  const metaData = getMetaConfig(props);

  return (
    <Head>
      {metaData.robotsContent && <meta name="robots" content={metaData.robotsContent} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {metaData.title && <title>{metaData.title}</title>}
      {metaData.description && <meta name="description" content={metaData.description} />}
      {metaData.canonicalURL && <link rel="canonical" href={metaData.canonicalURL} />}

      {/* ... (Open Graph meta details) */}
      {metaData.locale && <meta property="og:locale" content={metaData.locale} />}
      {metaData.type && <meta property="og:type" content={metaData.type} />}
      {metaData.title && <meta property="og:title" content={metaData.title} />}
      {metaData.description && <meta property="og:description" content={metaData.description} />}
      {metaData.canonicalURL && <meta property="og:url" content={metaData.canonicalURL} />}
      <meta property="og:site_name" content="Injexi" />
      {metaData.publishedTime && <meta property="article:published_time" content={metaData.publishedTime} />}
      {metaData.modifiedTime && <meta property="article:modified_time" content={metaData.modifiedTime} />}
      {metaData.image && <meta property="og:image" content={metaData.image} />}
      {metaData.imageWidth && <meta property="og:image:width" content={metaData.imageWidth} />}
      {metaData.imageHeight && <meta property="og:image:height" content={metaData.imageHeight} />}
      {metaData.imageType && <meta property="og:image:type" content={metaData.imageType} />}
      {metaData.author && <meta name="author" content={metaData.author} />}

      {/* ... (Twitter meta details) */}
      {metaData.image && <meta name="twitter:card" content={metaData.image} />}
      

      {/* ... (add json markup later) */}

    </Head>
  );
}

export default HeadMetaDynamic;
