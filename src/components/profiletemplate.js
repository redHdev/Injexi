import { useState, useEffect } from "react";
import HeadMetaDynamic from "/src/components/HeadMetaDynamic.js";
import { useSession } from "next-auth/react";
import ProfileContainer from "./profile/ProfileContainer";
import ReviewAbout from "./profile/ReviewAbout";
import ReviewForm from "./profile/ReviewForm";
import ReviewItem from "./profile/ReviewItem";


function Profile({ data, pageType }) {
  
  const businessDetails = data?.businessDetails || {};
  const offeredServices = data?.profileOfferedServices || {};

  // Destructure values
  const {
    "Business Name": businessName,
    Suburb,
    State,
    "Injexi Profile Link": injexiProfileLink,
    "Profile Hero Image": image,
    Email,
    "Business Intro": businessIntro,
    "Internal ID": internalId,
    Coupon1,
    Coupon2,
    Coupon3,
  } = businessDetails;

  // State variables
  const { data: session } = useSession(); // Get session data using the hook
  const isLoggedIn = !!session;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const areCouponsAvailable = Coupon1 || Coupon2 || Coupon3;
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function copyToClipboard() {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Add UTM parameters
    currentUrl.searchParams.set("utm_source", "Injexi-Share");

    // Convert it back to a string
    const urlWithUtm = currentUrl.toString();

    // Copy it to the clipboard
    navigator.clipboard
      .writeText(urlWithUtm)
      .then(() => {
        console.log("URL with UTM copied to clipboard successfully!");
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 3000);
      })
      .catch((err) => {
        console.log("Could not copy text: ", err);
      });
  }

  // Declare a state variable to hold the password
  const [password, setPassword] = useState("");

  // Current URL and Referring URL
  let currentURL = "";
  let referringURL = "";

  if (typeof window !== "undefined") {
    currentURL = window.location.href;
    referringURL = document.referrer;
  }

  // Extract services
  const services = Object.entries(offeredServices)
    .filter(([service, isOffered]) => isOffered)
    .map(([service]) =>
      service === "Botox"
        ? "Anti-Wrinkle Injections"
        : service.replace(" Offered", ""),
    )
    .sort(); // Sort the services alphabetically

  // Calculate average rating and number of reviews
  let averageRating = 0;
  let numReviews = 0;

  if (!loading && reviews.length > 0) {
    averageRating =
      reviews.reduce((total, review) => total + review.starRating, 0) /
      reviews.length;
    numReviews = reviews.length;
  }

  // Fetch reviews on component mount
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(
          `/api/getBusinessReviews/?internalId=${internalId}`,
        );
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setReviews(sortedData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [internalId]);

  // Sort reviews based on the selected option
  const fetchSortedReviews = (sortOption) => {
    const sortedReviews = [...reviews];
    if (sortOption === "most_recent") {
      sortedReviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    } else if (sortOption === "highest_to_lowest") {
      sortedReviews.sort((a, b) => b.starRating - a.starRating);
    } else if (sortOption === "lowest_to_highest") {
      sortedReviews.sort((a, b) => a.starRating - b.starRating);
    }
    setReviews(sortedReviews);
  };

  return (
    <div>
      <HeadMetaDynamic
        page={pageType}
        businessName={businessName}
        location={`${Suburb}, ${State}`}
        canonicalURL={`https://injexi.com/au/${injexiProfileLink}/`}
        image={image}
      />
      <div className="container">
        <div className="share" onClick={copyToClipboard}>
          Share <i className="fa-solid fa-arrow-up-from-bracket"></i>
          {isUrlCopied && <span className="tooltip"> - URL Copied!</span>}
        </div>
        <div className="profile-container-main">

          <ProfileContainer
            loading={loading}
            reviews={reviews}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            businessDetails={businessDetails}
          />

          <div className="available-services">
            <h2>Available Services</h2>
            <ul className="profile-services-list">
              {services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
              <li>+ More</li>
            </ul>
          </div>

          <ReviewAbout
            isLoggedIn={isLoggedIn}
            areCouponsAvailable={areCouponsAvailable}
            businessDetails={businessDetails}
          />

          <div className="business-intro">
            <h2>About {businessName}</h2>
            <p>{businessIntro}</p>
          </div>

          <div className="review-section" id="bp_reviews">

            <ReviewForm
              businessName={businessName}
              averageRating={averageRating}
              fetchSortedReviews={fetchSortedReviews}
              numReviews={numReviews}
              injexiProfileLink={injexiProfileLink}
              internalId={internalId}
              Email={Email}
              setShowSuccessMessage={setShowSuccessMessage}
              password={password}
              setPassword={setPassword}
              currentURL={currentURL}
              referringURL={referringURL}
            />

            {showSuccessMessage && (
              <div className="review-success-message">
                <i className="fa-solid fa-check"></i>&nbsp;Review submitted for
                moderation, please check your email to verify your review.
              </div>
            )}

            {reviews.map((review) => (
              <ReviewItem 
                review={review}
                businessName={businessName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
