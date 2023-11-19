import React from 'react'

const ReviewAbout = ({
    isLoggedIn,
    areCouponsAvailable,
    businessDetails
}) => {

const {
    "Business Name": businessName,
    MondayHours,
    TuesdayHours,
    WednesdayHours,
    ThursdayHours,
    FridayHours,
    SaturdayHours,
    SundayHours,
    Coupon1,
    Discount1,
    Coupon2,
    Discount2,
    Coupon3,
    Discount3,
    } = businessDetails;

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    ];

const currentDate = new Date();
const currentDay = days[currentDate.getDay() - 1];

const businessNameCoupon = `${businessName} Discount Codes & Coupons`;

const hoursByDay = {
    Monday: MondayHours,
    Tuesday: TuesdayHours,
    Wednesday: WednesdayHours,
    Thursday: ThursdayHours,
    Friday: FridayHours,
    Saturday: SaturdayHours,
    Sunday: SundayHours,
  };

  return (
    <div className="review-about">
        <div className="available-coupons">
        <h2 className="reviewh2">{businessNameCoupon}</h2>
        {isLoggedIn ? (
            areCouponsAvailable ? (
            <ul className="profile-coupons-list">
                <li>
                {Coupon1} - {Discount1}
                </li>
            </ul>
            ) : (
            <div>
                <p>No coupons available for {businessName} 😢</p>{" "}
            </div>
            )
        ) : (
            <div>
            {areCouponsAvailable ? (
                <p className="blurred-text">
                {Coupon1 && `${Coupon1} - ${Discount1}`}{" "}
                {Coupon1 && <br />}
                {Coupon2 && `${Coupon2} - ${Discount2}`}{" "}
                {Coupon2 && <br />}
                {Coupon3 && `${Coupon3} - ${Discount3}`}{" "}
                {Coupon3 && <br />}
                </p>
            ) : (
                <p className="blurred-text">IDISCOUNTCODE2023</p>
            )}
            <div className="coupon-cta">
                <div className="member-badge">Injexi Exclusive</div>
                <p className="coupon-headline">Unlock Coupons Instantly</p>
                <p className="coupon-subheadline">
                It's Free and takes 20 seconds!
                </p>
                <p className="coupon-join">
                <a href="/register/" target="_blank">
                    Join The Injexi Club
                </a>
                </p>
                <p className="coupon-login-link">
                Already a member?{" "}
                <a href="/login/" target="_blank">
                    Sign In
                </a>
                </p>
            </div>
            </div>
        )}
        </div>
        <div className="opening-hours-container">
        <div className="opening-hours">
            <h2>
            Opening Times <i className="fa-regular fa-calendar"></i>
            </h2>
            {days.map((day) => (
            <div
                className={`day ${
                day === currentDay ? "highlighted-day" : ""
                }`}
                key={day}
            >
                <span className="day-name">{day}</span>
                <span className="time">{hoursByDay[day]}</span>
            </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default ReviewAbout
