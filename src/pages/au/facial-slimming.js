import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function FacialSlimming() {
  const pageTitle="Facial Slimming Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={FacialSlimming}
      metaPage="facialSlimming"
      pageTitle={pageTitle}
      pageDescription="See our list of recommended locations for Masseter Facial Slimming in Australia below."
      pageSubtitle="Best Facial Slimming Locations Australia"
      serviceOffered="Botox Offered"
      servicePriceKey="Botox Price"
      serviceName="Facial Slimming"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default FacialSlimming;