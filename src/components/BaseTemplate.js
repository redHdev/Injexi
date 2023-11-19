import React, { useState, useEffect } from 'react';
import HeadMeta from '/src/components/HeadMeta.js';
import { useSession } from 'next-auth/react';

function BaseTemplate({ 
  pageFunction: PageFunction, 
  metaPage, 
  pageTitle, 
  pageDescription, 
  pageSubtitle, 
  serviceOffered, 
  servicePriceKey,
  serviceName,
  breadcrumbs,
}) {
  const { data: session } = useSession();  // Get session data using the hook
  const isLoggedIn = !!session;
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [serviceMainDescription, setServiceMainDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        let initialBusinesses = data.data.filter(business => business.profileOfferedServices[serviceOffered]);
        
        // Correcting the postcode and sorting business names case insensitively
        initialBusinesses = initialBusinesses.map(business => {
          if (business.businessDetails.Postcode && business.businessDetails.Postcode.toString().startsWith('8')) {
            business.businessDetails.Postcode = '0' + business.businessDetails.Postcode;
          }
          return business;
        })
        // Shuffling the array to have a random order on initial load
      initialBusinesses = initialBusinesses.sort(() => Math.random() - 0.5);
        console.log(initialBusinesses);

        setBusinesses(initialBusinesses);
        setFilteredBusinesses(initialBusinesses);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchServiceDescription = async () => {
      try {
        
        
        
        // Make the API call with the query parameter
        const response = await fetch(`/api/getServiceCategories/?serviceName=${encodeURIComponent(serviceName)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
  
        // Assuming "serviceMainDescription" is a field in your ServiceCategories collection specific to the service
        setServiceMainDescription(data.data.serviceMainDescription);
      } catch (error) {
        console.error('Error fetching service description:', error);
      }
    };
  
    fetchServiceDescription();  // Trigger the effect
  }, []);

  useEffect(() => {
    if (selectedState) {
      setFilteredBusinesses(businesses.filter(business => business.businessDetails.State === selectedState));
    } else {
      setFilteredBusinesses(businesses);
    }
  }, [selectedState, businesses]);

  const sortBusinesses = (field) => {
    if (field === 'Price' && !isLoggedIn) {
      return; 
    }

    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
      let valueA, valueB;
      if (field === 'Price') {
        valueA = parseFloat(a.prices[servicePriceKey]?.replace('$', '')) || 0;
        valueB = parseFloat(b.prices[servicePriceKey]?.replace('$', '')) || 0;
      } else {
        valueA = a.businessDetails[field] || '';
        valueB = b.businessDetails[field] || '';
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB, undefined, { sensitivity: 'base' }) * (direction === 'asc' ? 1 : -1);
        }
      }

      if (field === 'Price') {
        if (valueA === 0 && valueB !== 0) return 1;
        if (valueA !== 0 && valueB === 0) return -1;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBusinesses(sortedBusinesses);
  };

  return (
    <div>
      <HeadMeta page={metaPage} />

      <div className="container">
      {breadcrumbs && (
                <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <div className="breadcrumb">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="breadcrumb-item">
                      {crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}
                      {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">{'  >  '}</span>}
                    </span>
                  ))}
                </div>
              </nav>               
            )}
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
        <h2>{pageSubtitle}</h2>
        {error && <p>Error fetching data: {error}</p>}
        {!isLoggedIn && (
    <div>
      <p><strong>Want to See Prices?</strong> <a href="/register/">Join The Injexi Club</a> - It's 100% Free and takes less than 20 seconds.</p>
      
    </div>
  )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <label htmlFor="stateFilter" style={{ marginRight: '8px' }}>Filter by State: </label>
    <select
      id="stateFilter"
      value={selectedState}
      onChange={(e) => setSelectedState(e.target.value)}
    >
      <option value="">All</option>
      <option value="QLD">QLD</option>
      <option value="NSW">NSW</option>
      <option value="VIC">VIC</option>
      <option value="SA">SA</option>
      <option value="WA">WA</option>
      <option value="TAS">TAS</option>
      <option value="ACT">ACT</option>
      <option value="NT">NT</option>
    </select>
  </div>
  
</div>

        {filteredBusinesses.length ? (
          <table>
            <thead>
              <tr>
                <th className="sortable-th" onClick={() => sortBusinesses('Business Name')}>Business  <i className={`fa-solid fa-arrow-${sortField === 'Business Name' && sortDirection === 'asc' ? 'up' : 'down'}`}></i></th>
                <th className="sortable-th" onClick={() => sortBusinesses('Suburb')}>Suburb  <i className={`fa-solid fa-arrow-${sortField === 'Suburb' && sortDirection === 'asc' ? 'up' : 'down'}`}></i></th>
                <th className="sortable-th" onClick={() => sortBusinesses('Postcode')}>Postcode  <i className={`fa-solid fa-arrow-${sortField === 'Postcode' && sortDirection === 'asc' ? 'up' : 'down'}`}></i></th>
                <th className="sortable-th" onClick={() => isLoggedIn && sortBusinesses('Price')}>Price  <i className={`fa-solid fa-arrow-${sortField === 'Price' && sortDirection === 'asc' ? 'up' : 'down'}`}></i></th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((business, index) => (
                <tr key={index}>
                  <td><a href={`/au/${business.businessDetails['Injexi Profile Link']}/`}>
        {business.businessDetails['Business Name']}
      </a></td>
                  <td>{business.businessDetails.Suburb}</td>
                  <td>{business.businessDetails.Postcode}</td>
                  {isLoggedIn ? (
                    <td>{business.prices[servicePriceKey]}</td>
                  ) : (
                    <td>-</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading businesses...</p>
        )}
        <div className="category-description" dangerouslySetInnerHTML={{ __html: serviceMainDescription }}></div>
      </div>
    </div>
  );
}

export default BaseTemplate;
