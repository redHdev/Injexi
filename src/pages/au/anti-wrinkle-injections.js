import React from 'react';
import BaseTemplate from '/src/components/BaseTemplate.js';

function AntiWrinkle() {
  const pageTitle="Anti-Wrinkle Injections Australia";

  // Create breadcrumb data
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Australian Treatment Types', url: '/au/' },
    { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
  ];

  return (
    <BaseTemplate 
      pageFunction={AntiWrinkle}
      metaPage="antiWrinkle"
      pageTitle={pageTitle}
      pageDescription="See our list of recommended locations for Anti-Wrinkle Injections in Australia below."
      pageSubtitle="Best Anti-Wrinkle Locations Australia"
      serviceOffered="Botox Offered"
      servicePriceKey="Botox Price"
      serviceName="Anti-Wrinkle Injections"
      breadcrumbs={breadcrumbs}
    />
  );
}

export default AntiWrinkle;