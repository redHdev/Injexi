import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function DermalFiller() {
  const pageTitle="Dermal Filler Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];
  
  return (
    <BaseTemplate 
      pageFunction={DermalFiller}
      metaPage="dermalFiller"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for Dermal Filler Treatment in Australia."
      pageSubtitle="Best Dermal Fillers Locations Australia"
      serviceOffered="Dermal Filler Offered"
      servicePriceKey="Dermal Filler Price"
      serviceName="Dermal Filler"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default DermalFiller;
