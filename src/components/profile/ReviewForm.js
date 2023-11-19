import React,  { useState } from 'react'

const ReviewForm = ({
    businessName,
    averageRating,
    fetchSortedReviews,
    numReviews,
    injexiProfileLink,
    internalId,
    Email,
    setShowSuccessMessage,
    currentURL,
    referringURL
}) => {

    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [sendCodeClicked, setSendCodeClicked] = useState(false);
    const [smsStatus, setSmsStatus] = useState(null);
    const [otpStatus, setOtpStatus] = useState(null);
    const [sendCodeDisabled, setSendCodeDisabled] = useState(false); // Add this line
    const [verifyCodeClicked, setVerifyCodeClicked] = useState(false);
    const [verifyCodeDisabled, setVerifyCodeDisabled] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [password, setPassword] = useState("");

    const toggleReviewForm = () => {
        setIsReviewFormVisible((prevState) => !prevState);
      };
      
     // Helper function to format phone number
    const formatPhoneNumber = (phoneNumber) => {
        let formattedPhoneNumber = phoneNumber.trim().replace(/\s+/g, "");
        if (!formattedPhoneNumber.startsWith("+")) {
        formattedPhoneNumber = "+" + formattedPhoneNumber; // Ensure it starts with '+'
        }
        return formattedPhoneNumber;
    };

      const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("/api/sendReviewNotificationEmail/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formEmail,
              firstName,
              reviewTitle: reviewTitle,
              review: reviewText,
              rating,
              phoneNumber,
              password,
              currentURL,
              referringURL,
              businessName,
              internalId,
              businessEmail: Email,
              injexiProfileLink,
            }),
          });
    
          if (response.ok) {
            setShowSuccessMessage(true);
            setFirstName("");
            setFormEmail("");
            setReviewTitle("");
            setReviewText("");
            setPhoneNumber("");
            setRating(0);
            setIsReviewFormVisible(false);
          } else {
            console.log(response, "error")
            alert("An error occurred. Please try again.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
          alert("An error occurred. Please try again.");
        }
      };

      const handleClick = (newRating) => {
        setRating(newRating);
      };

        // Handle mouse events for rating stars
        const handleMouseOver = (newRating) => {
            setHoverRating(newRating);
        };

        const handleMouseOut = () => {
            setHoverRating(0);
        };

    // Handle phone number verification
    const handleVerification = async () => {
        let formattedPhoneNumber = phoneNumber.trim().replace(/\s+/g, "");
        if (!formattedPhoneNumber.startsWith("+")) {
        formattedPhoneNumber = "+" + formattedPhoneNumber; // Ensure it starts with '+'
        }

        try {
        if (formattedPhoneNumber && !otpCode) {
            const response = await fetch("/api/verifySMS/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber: formattedPhoneNumber }),
            });
            const data = await response.json();
            console.log(data);

            // Set the SMS status here
            setSmsStatus(data.status); // Assuming 'data.status' contains 'pending' or other status values

            // Set the OTP status
            setOtpStatus(data.status); // Assuming 'data.status' contains 'approved' or other status values
        } else if (formattedPhoneNumber && otpCode) {
            // Encode the phone number before including it in the URL
            const encodedPhoneNumber = encodeURIComponent(formattedPhoneNumber);

            // Call verifyget.js API route to verify OTP
            const response = await fetch(
            `/api/verifySMS?phoneNumber=${encodedPhoneNumber}&code=${otpCode}`,
            );
            const data = await response.json();
            console.log(data);

            // Set the OTP status
            setOtpStatus(data.status); // Assuming 'data.status' contains 'approved' or other status values
        }
        } catch (error) {
        console.error("Error during verification:", error);
        }
    };

    const renderVerifyButtons = () => {
        if (smsStatus === "pending") {
          // Check smsStatus
          return (
            <div className="input-action-group">
              {otpStatus !== "approved" && (
                <input
                  type="text"
                  className="otp-input"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setVerifyCodeDisabled(false); // Re-enable the "Verify Code" button when the OTP code changes
                  }}
                  disabled={!phoneNumber}
                  placeholder="Enter SMS Code"
                />
              )}
              <br />
              {otpStatus !== "approved" && (
                <button
                  type="button"
                  className={`send-code-button ${
                    verifyCodeDisabled ? "disabled" : ""
                  }`}
                  onClick={() => {
                    setVerifyCodeClicked(true);
                    setVerifyCodeDisabled(true);
                    handleVerification();
                  }}
                  disabled={verifyCodeDisabled}
                >
                  Verify Code
                </button>
              )}
              {otpStatus === "approved" && (
                <span className="approved-message">
                  <i className="fa-solid fa-check"></i>&nbsp;Code Approved
                </span>
              )}
            </div>
          );
        }
        return null;
      };


  return (
    <>
        <h2 className="reviewh2">{businessName} Reviews</h2>
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

            <div className="button-container">
                <button
                id="reviewButton"
                className="openModalBtn"
                onClick={toggleReviewForm}
                >
                Write Review
                </button>

                {averageRating !== 0 && (
                <div className="sort-box">
                    <select
                    id="sortOptions"
                    onChange={(e) => fetchSortedReviews(e.target.value)}
                    >
                    <option value="most_recent">Most Recent</option>
                    <option value="highest_to_lowest">Highest to Lowest</option>
                    <option value="lowest_to_highest">Lowest to Highest</option>
                    </select>
                </div>
                )}
            </div>

            <div
                className="review-form-container"
                style={{ display: isReviewFormVisible ? "block" : "none" }}
            >
                <form onSubmit={handleFormSubmit}>
                <input type="hidden" name="businessName" value={businessName} />
                <input type="hidden" name="businessEmail" value={Email} />
                <input
                    type="hidden"
                    name="injexiProfileLink"
                    value={injexiProfileLink}
                />
                <input type="hidden" name="internalId" value={internalId} />

                <div className="review-form">
                    <label className="review-form-label">Choose Rating:</label>
                    {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="star-label">
                        <input
                        type="radio"
                        name="rating"
                        value={star}
                        className="star-input"
                        id={`star${star}`}
                        />
                        <label
                        htmlFor={`star${star}`}
                        className="star-icon-label"
                        >
                        <i
                            className={
                            hoverRating >= star || rating >= star
                                ? "fas fa-star star-icon"
                                : "far fa-star star-icon"
                            }
                            onMouseOver={() => handleMouseOver(star)}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleClick(star)}
                        ></i>
                        </label>
                    </label>
                    ))}
                </div>

                <div className="form-group">
                    <label>Review Title:</label>
                    <input
                    type="text"
                    name="reviewTitle"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Title Your Review"
                    />
                </div>

                <div className="form-group">
                    <label>Review:</label>
                    <textarea
                    name="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="textarea-review"
                    placeholder="Enter Your Honest Review Here"
                    />
                </div>

                <div className="form-group">
                    <label>First Name:</label>
                    <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Your Email:</label>
                    <input
                    type="email"
                    name="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    />
                </div>

                <div className="phone-group">
                    <label>
                    Phone Number:{" "}
                    {smsStatus === "pending" && (
                        <span className="success-message">
                        SMS Sent&nbsp;<i className="fa-solid fa-check"></i>
                        </span>
                    )}
                    </label>
                    <div className="input-action-group">
                    <input
                        type="text"
                        name="phone"
                        className="phone-input"
                        value={phoneNumber}
                        onChange={(e) => {
                        let inputPhoneNumber = e.target.value;

                        // Remove spaces and non-numeric characters from the input
                        inputPhoneNumber = inputPhoneNumber.replace(/\D/g, "");

                        // Check if the input starts with "0" (indicating an Australian number)
                        if (inputPhoneNumber.startsWith("0")) {
                            // Replace the leading "0" with "+61"
                            inputPhoneNumber =
                            "+61" + inputPhoneNumber.substring(1);
                        }

                        // Update the phoneNumber state with the formatted input
                        setPhoneNumber(inputPhoneNumber);
                        setSendCodeDisabled(false); // Re-enable the button when a new phone number is entered
                        }}
                        placeholder="For SMS Verification"
                    />

                    <button
                        type="button"
                        className={`send-code-button ${
                        sendCodeDisabled ? "disabled" : ""
                        }`}
                        onClick={() => {
                        setSendCodeClicked(true);
                        setSendCodeDisabled(true); // Disable the button
                        handleVerification();
                        }}
                        disabled={sendCodeDisabled}
                    >
                        Send Code
                    </button>
                    </div>
                    {renderVerifyButtons()}
                </div>

                {otpStatus === "approved" && (
                    <>
                    <label>Last Step: Create Password & Submit Review</label>
                    <input
                        type="password"
                        className="password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create Password"
                    />
                    <button type="submit" className="submit-button">
                        Submit Review
                    </button>
                    </>
                )}
                </form>
            </div>
    </>
  )
}

export default ReviewForm
