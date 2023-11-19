import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function SkinNeedling() {
  const pageTitle = "Skin Needling Australia";
  
  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={SkinNeedling}
      metaPage="skinNeedling"
      pageTitle={pageTitle}
      pageDescription="These are our list of recommended locations for Skin Needling and Microneedling Treatment in Australia."
      pageSubtitle="Best Skin Needling Locations Australia"
      serviceOffered="Skin Needling Offered"
      servicePriceKey="Skin Needling Price"
      serviceName="Skin Needling"
      breadcrumbs={breadcrumbs}  // Passing breadcrumbs data as a prop
    />
  );
}

export default SkinNeedling;
