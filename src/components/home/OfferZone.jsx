import React, { useState, useEffect } from "react";
import Slider from "react-slick";

export default function OfferZone() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners`);
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

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

  if (loading) {
    return <div className="w-full h-[70vh] md:h-[90vh] bg-slate-100 animate-pulse" />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[70vh] md:h-[90vh] overflow-hidden relative">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="w-full h-[70vh] md:h-[90vh] outline-none">
            <img
              src={banner.image}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
