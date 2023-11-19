import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function LipFiller() {
  const pageTitle="Lip Filler Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={LipFiller}
      metaPage="lipFiller"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for Lip Filler Treatment in Australia."
      pageSubtitle="Best Lip Fillers Locations Australia"
      serviceOffered="Lip Filler Offered"
      servicePriceKey="Lip Filler Price"
      serviceName="Lip Filler"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default LipFiller;
