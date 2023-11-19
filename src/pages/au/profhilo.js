import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function Profhilo() {
  const pageTitle="Profhilo Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={Profhilo}
      metaPage="profhilo"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for Bio-Remodelling and Profhilo Treatment in Australia."
      pageSubtitle="Best Profhilo Locations Australia"
      serviceOffered="Profhilo Offered"
      servicePriceKey="Profhilo Price"
      serviceName="Profhilo"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default Profhilo;
