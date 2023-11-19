import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function Morpheus8() {
  const pageTitle="Morpheus8 Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={Morpheus8}
      metaPage="morpheus8"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for Morpheus8 Treatment in Australia."
      pageSubtitle="Best Morpheus8 Locations Australia"
      serviceOffered="Morpheus8 Offered"
      servicePriceKey="Morpheus8 Price"
      serviceName="Morpheus8"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default Morpheus8;
