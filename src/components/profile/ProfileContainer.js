import React from 'react'
import RenderInfoItem from './RenderInfoItem'
import axios from "axios";

const ProfileContainer = ({
    loading,
    reviews,
    setIsLoading,
    isLoading,
    businessDetails
}) => {

  const {
    "Business Name": businessName,
    Suburb,
    State,
    "Profile Hero Image": image,
    Email,
    "Website Link": websiteLink,
    Address,
    Postcode,
    Country,
    Phone,
    "Facebook URL": facebookURL,
    "Instagram URL": instagramURL,
  } = businessDetails;

const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${businessName}, ${Address}, ${Suburb}, ${State}, ${Postcode}, ${Country}`,
)}`;

let averageRating = 0;
let numReviews = 0;
  
if (!loading && reviews.length > 0) {
    averageRating =
    reviews.reduce((total, review) => total + review.starRating, 0) /
    reviews.length;
    numReviews = reviews.length;
}

// External Link with database entry
const openWebsiteWithUTM = (url, event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true

    // Capture IP address
    (async () => {
      const ipAddress = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);

      // Fetch geolocation data
      const geoData = await axios
        .get(
          `https://api.ipbase.com/v2/info?apikey=ipb_live_wd6NlDnxiN9h5q8PjXyi3npS28xJd1xygGjCQaBN&ip=${ipAddress}`,
        )
        .then((response) => response.data);

      // Prepare MongoDB document
      const clickedAt = Date.now();
      const currentUrl = window.location.href; // Capture the current URL
      const mongoDocument = {
        clicked_at: { $date: { $numberLong: String(clickedAt) } },
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
            is_in_european_union:
              geoData.data.location.country.is_in_european_union,
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
      await axios.post("/api/insertClickData/", mongoDocument, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    })();

    // Redirect to external link with UTM parameters
    const utmSource = "utm_source=Injexi";
    const finalUrl = `${url}?${utmSource}`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.opener = null;
      newWindow.location = finalUrl;
    }

    setIsLoading(false); // Set loading back to false
  };

  return (
    <div>
      <div className="profile-container">
        {/* Left Column */}
        <div className="profile-left-column">
            <h1 className="h1profile">{businessName}</h1>
            <a href="#bp_reviews" className="review-link">
            {!loading && reviews.length > 0 ? (
                <div className="average-rating-bottom">
                {Array.from({ length: 5 }).map((_, index) => (
                    <i
                    key={index}
                    className={
                        index < Math.round(averageRating)
                        ? "fas fa-star"
                        : "far fa-star"
                    }
                    style={{ color: "#fcb900", fontSize: "18px" }}
                    ></i>
                ))}
                &nbsp;&nbsp;
                {averageRating % 1 === 0
                    ? Math.round(averageRating)
                    : averageRating.toFixed(1)}{" "}
                ({numReviews})
                </div>
            ) : (
                <div className="no-reviews">
                {Array.from({ length: 5 }).map((_, index) => (
                    <i
                    key={index}
                    className="far fa-star"
                    style={{ color: "#fcb900", fontSize: "18px" }}
                    ></i>
                ))}
                &nbsp;&nbsp;0 | <span>Write a review</span>
                </div>
            )}
            </a>
            <div className="address-container">
            {`${Address}, ${Suburb}, ${State}, ${Postcode}, ${Country}`}
            <div className="info-row">
              <RenderInfoItem
                iconClass="fa-solid fa-location-dot"
                link={googleMapsUrl}
                linkText="Directions"
                anchorClassName="direction-link"
                onClick={openWebsiteWithUTM}
                />
              <RenderInfoItem
                iconClass="fa-solid fa-phone"
                link={`tel:${Phone}`}
                text={Phone}
                anchorClassName="phone-link"
                onClick={openWebsiteWithUTM}
                />
              <RenderInfoItem
                iconClass="fa-solid fa-envelope"
                link={`mailto:${Email}?subject=Customer Inquiry from Injexi&body=Dear Team, %0D%0A%0D%0ASent from Injexi.com`}
                linkText="Contact Us"
                anchorClassName="email-link"
                onClick={openWebsiteWithUTM}
                />
              <RenderInfoItem
                iconClass="fab fa-facebook"
                link={facebookURL}
                anchorClassName="info-item-hidden phone-link"
                onClick={openWebsiteWithUTM}
                />
              <RenderInfoItem
                iconClass="fab fa-instagram"
                link={instagramURL}
                anchorClassName="info-item-hidden phone-link"
                onClick={openWebsiteWithUTM}
                />
            </div>
            </div>
            <a
                href={websiteLink}
                target="_blank"
                rel="noopener nofollow"
                className="profile-button"
                onClick={(event) => openWebsiteWithUTM(websiteLink, event)}
                disabled={isLoading} // Disable the button while loading
                >
                {isLoading ? "Loading..." : "Visit Website"}
            </a>
        </div>

        {/* Right Column */}
        <div className="profile-right-column">
            <div className="image-wrapper">
            <img
                src={image}
                alt={`${businessName} Hero`}
                className="profile-image"
            />
            </div>
        </div>
        </div>
    </div>
  )
}

export default ProfileContainer
