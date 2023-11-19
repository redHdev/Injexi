import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function PrpTreatment() {
  const pageTitle="Prp Treatment Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={PrpTreatment}
      metaPage="prpTreatment"
      pageTitle={pageTitle}
      pageDescription="See our list of recommended locations for PRP Treatment (Platelet-Rich Plasma) in Australia below."
      pageSubtitle="Best PRP Treatment Locations Australia"
      serviceOffered="PRP Offered"
      servicePriceKey="PRP Therapy Price"
      serviceName="PRP Treatment"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default PrpTreatment;
