import React from "react";
import Slider from "react-slick";
import offer1 from "/Images/model1.png";
import offer2 from "/Images/model3.png";

export default function OfferZone() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
  };

  return (
    <div className="w-full h-[70vh] md:h-[90vh] overflow-hidden relative">
      <Slider {...settings}>
        <div className="w-full h-[70vh] md:h-[90vh] outline-none">
          <img
            src={offer1}
            alt="Offer 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-[70vh] md:h-[90vh] outline-none">
          <img
            src={offer2}
            alt="Offer 2"
            className="w-full h-full object-cover"
          />
        </div>
      </Slider>
    </div>
  );
}
