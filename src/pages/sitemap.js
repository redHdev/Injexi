import React, { useState, useEffect } from 'react';
import HeadMeta from '/src/components/HeadMeta.js';

function Sitemap() {
  const [businesses, setBusinesses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const sortedBusinesses = data.data.sort((a, b) => a.businessDetails['Business Name'].localeCompare(b.businessDetails['Business Name']));
        const organizedBusinesses = sortedBusinesses.reduce((acc, business) => {
          const firstLetter = business.businessDetails['Business Name'][0].toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(business);
          return acc;
        }, {});
        setBusinesses(organizedBusinesses);
        setTotalClinics(sortedBusinesses.length); // Set the total number of clinics
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchData();
  }, []);
  
  // Initialize the totalClinics state variable
  const [totalClinics, setTotalClinics] = useState(0);

  return (
    <div>
      <HeadMeta page="sitemap" />

      <div className="container">
      <h1>Injexi.com Sitemap</h1>
      <p>See our full list of clinic pages and cosmetic treatment categories.</p>
      <h2>Clinic List Australia</h2>
      {error && <p>Error fetching data: {error}</p>}
        {businesses ? (
          Object.entries(businesses).map(([letter, businesses]) => (
            <div key={letter} className="sitemapsection">
              <h3>{letter}</h3>
              <ul className="sitemap-list">
                {businesses.map((business, index) => (
                  <li key={index}>
                    <a href={`/au/${business.businessDetails['Injexi Profile Link']}/`}>{business.businessDetails['Business Name']}</a>  ({business.businessDetails['State']})
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Loading businesses...</p>
        )}
        <p>Total Number of Clinics: {totalClinics}</p>
      </div>
    </div>
  );
}

export default Sitemap;
