import React from 'react'

const ReviewItem = ({ review, businessName }) => {
  return (
    <div
        className="testimonial-box review-item"
        key={review._id}
        data-rating={review.starRating}
        data-date={review.createdAt}
        >
        <div className="box-top">
            <div className="profile">
            <div className="profile-img">
                <img
                src="https://Injexi.b-cdn.net/Injexi%20Australia/Website%20Assets/Review-Icon-Injexi.png"
                alt="Review-Profile-Icon"
                />
            </div>
            <div className="name-user">
                <strong>
                {review.customerName.length > 11
                    ? `${review.customerName.substring(0, 11)}...`
                    : review.customerName}{" "}
                &nbsp;
                {review.verified && (
                    <i
                    className="fas fa-check-circle"
                    style={{ color: "#d76fa3" }}
                    ></i>
                )}
                </strong>
                <div className="reviews-star-mobile">
                {[...Array(5)].map((_, i) => (
                    <i
                    className={
                        i < review.starRating
                        ? "fas fa-star"
                        : "far fa-star"
                    }
                    key={i}
                    ></i>
                ))}
                </div>
                <span>
                {new Date(review.createdAt).toLocaleDateString()}
                </span>
            </div>
            </div>
            <div className="reviews">
            {[...Array(5)].map((_, i) => (
                <i
                className={
                    i < review.starRating ? "fas fa-star" : "far fa-star"
                }
                key={i}
                ></i>
            ))}
            </div>
        </div>
        <div className="client-comment">
            <p>{review.review}</p>
        </div>
        {review.reviewReply && (
            <div className="review-reply">
            <strong>Reply from {businessName}:</strong>
            <p>{review.reviewReply}</p>
            </div>
        )}
    </div>
  )
}

export default ReviewItem
