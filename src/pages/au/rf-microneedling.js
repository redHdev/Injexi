import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function RFMicroneedling() {
  const pageTitle="RF Microneedling Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={RFMicroneedling}
      metaPage="rfMicroneedling"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for RF Microneedling (radio-frequency) Treatment in Australia."
      pageSubtitle="Best RF Microneedling Locations Australia"
      serviceOffered="Morpheus8 Offered"
      servicePriceKey="Morpheus8 Price"
      serviceName="RF Microneedling"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default RFMicroneedling;
