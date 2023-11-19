import React, { useState, useEffect } from 'react';
import HeadMeta from '/src/components/HeadMeta.js';
import Link from 'next/link';

function Australia() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const serviceSet = new Set();
        data.data.forEach(business => {
          for (const [key, value] of Object.entries(business.profileOfferedServices)) {
            if (value) {
              let serviceName = key.replace(' Offered', '');
              if (serviceName === 'Botox') {
                serviceName = 'Anti-Wrinkle Injections';
              }
              if (serviceName === 'PRP' || serviceName === 'PRP Therapy') {
                serviceName = 'PRP Treatment';
              }
              serviceSet.add(serviceName);
            }
          }
        });
        setServices([...serviceSet].sort().map(service => ({
          name: service,
          link: `/au/${service.toLowerCase().replace(/ /g, '-')}/`
        })));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HeadMeta page="au" />
      
      <div className="container">
        <h1>Australian Cosmetic Treatment Locations</h1>
        <p>We’ve done the hard work for you when it comes to finding a cosmetic treatment provider in Australia.<br />
Choose the service you’re after and see the best and most recommended clinics located near you.</p>

        <h2>Choose Treatment Type</h2>
        <br></br>
        <h3>Skin Treatments</h3>
        {error && <p>Error fetching data: {error}</p>}
        {services ? (
          <ul className="full-service-list">
            {services.map((service, index) => (
              <li key={index}>
                <Link href={service.link}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading services...</p>
        )}
      </div>
    </div>
  );
}

export default Australia;
