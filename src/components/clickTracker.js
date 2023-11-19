import axios from 'axios';
import { useState } from 'react';

const withClickTracker = (WrappedComponent) => {
  return ({ websiteLink, ...props }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleTracking = async (event) => {
      await openWebsiteWithUTM(websiteLink, event);
    };

    const openWebsiteWithUTM = async (url, event) => {
      event.preventDefault();
      setIsLoading(true);
    try {
      // Capture IP address
      const ipAddressResponse = await fetch('https://api.ipify.org?format=json');
      const ipAddressData = await ipAddressResponse.json();
      const ipAddress = ipAddressData.ip;

      // Fetch geolocation data
      const geoDataResponse = await axios.get(`https://api.ipbase.com/v2/info?apikey=ipb_live_wd6NlDnxiN9h5q8PjXyi3npS28xJd1xygGjCQaBN&ip=${ipAddress}`);
      const geoData = geoDataResponse.data;

    // Prepare MongoDB document
    const clickedAt = Date.now();
    const currentUrl = window.location.href;
    const mongoDocument = {
      clicked_at: { '$date': { '$numberLong': String(clickedAt) } },
  clicked_at_timezone: "UTC",
  source_url: document.referrer || null,
  current_url: currentUrl,
  destination_url: url,
  ip: geoData.data.ip,
  type: geoData.data.type,
  user_agent: navigator.userAgent,
  connection: {
    asn: geoData.data.connection.asn,
    organization: geoData.data.connection.organization,
    isp: geoData.data.connection.isp,
    range: geoData.data.connection.range,
  },
  location: {
    geonames_id: geoData.data.location.geonames_id,
    latitude: geoData.data.location.latitude,
    longitude: geoData.data.location.longitude,
    zip: geoData.data.location.zip,
    continent: {
      code: geoData.data.location.continent.code,
      name: geoData.data.location.continent.name,
      name_translated: geoData.data.location.continent.name_translated,
      geonames_id: geoData.data.location.continent.geonames_id,
      wikidata_id: geoData.data.location.continent.wikidata_id,
    },
    country: {
      alpha2: geoData.data.location.country.alpha2,
      alpha3: geoData.data.location.country.alpha3,
      calling_codes: geoData.data.location.country.calling_codes,
      currencies: geoData.data.location.country.currencies,
      emoji: geoData.data.location.country.emoji,
      ioc: geoData.data.location.country.ioc,
      languages: geoData.data.location.country.languages,
      name: geoData.data.location.country.name,
      name_translated: geoData.data.location.country.name_translated,
      timezones: geoData.data.location.country.timezones,
      is_in_european_union: geoData.data.location.country.is_in_european_union,
      fips: geoData.data.location.country.fips,
      geonames_id: geoData.data.location.country.geonames_id,
      hasc_id: geoData.data.location.country.hasc_id,
      wikidata_id: geoData.data.location.country.wikidata_id,
    },
    city: {
      fips: geoData.data.location.city.fips,
      alpha2: geoData.data.location.city.alpha2,
      geonames_id: geoData.data.location.city.geonames_id,
      hasc_id: geoData.data.location.city.hasc_id,
      wikidata_id: geoData.data.location.city.wikidata_id,
      name: geoData.data.location.city.name,
      name_translated: geoData.data.location.city.name_translated,
    },
    region: {
      fips: geoData.data.location.region.fips,
      alpha2: geoData.data.location.region.alpha2,
      geonames_id: geoData.data.location.region.geonames_id,
      hasc_id: geoData.data.location.region.hasc_id,
      wikidata_id: geoData.data.location.region.wikidata_id,
      name: geoData.data.location.region.name,
      name_translated: geoData.data.location.region.name_translated,
    },
  },
  security: {
    is_anonymous: geoData.data.security.is_anonymous,
    is_datacenter: geoData.data.security.is_datacenter,
    is_vpn: geoData.data.security.is_vpn,
    is_bot: geoData.data.security.is_bot,
    is_abuser: geoData.data.security.is_abuser,
    is_known_attacker: geoData.data.security.is_known_attacker,
    is_proxy: geoData.data.security.is_proxy,
    is_spam: geoData.data.security.is_spam,
    is_tor: geoData.data.security.is_tor,
    proxy_type: geoData.data.security.proxy_type,
    is_icloud_relay: geoData.data.security.is_icloud_relay,
    threat_score: geoData.data.security.threat_score,
  },
    };

    // Send data to MongoDB via your new API route
    await axios.post('/api/insertClickData/', mongoDocument, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Redirect to external link with UTM parameters
      const utmSource = "utm_source=Injexi";
      const finalUrl = `${url}?${utmSource}`;
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.opener = null;
        newWindow.location = finalUrl;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("An error occurred:", error);
      setIsLoading(false);
    }
  };

  return (
    <WrappedComponent
      {...props}
      onClick={(event) => handleTracking(event)}
      disabled={isLoading}
    />
  );
};
};

export default withClickTracker;
