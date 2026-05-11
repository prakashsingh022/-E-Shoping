import React from "react";
import Slider from "react-slick";
import { Star, Quote, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { reviews } from "../../data/homeData";

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-900 hover:bg-primary-gold hover:text-white transition-all duration-300 hidden md:flex"
    >
      <ArrowLeft size={20} />
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-900 hover:bg-primary-gold hover:text-white transition-all duration-300 hidden md:flex"
    >
      <ArrowRight size={20} />
    </button>
  );
}

export default function HappyCustomers() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary-gold text-xs font-bold tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
            Loving our Tara Community
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            See why thousands of customers trust us for their premium fashion needs.
          </p>
        </div>

        <div className="relative px-4">
          <Slider {...settings}>
            {reviews.map((rev, index) => (
              <div key={index} className="px-4 pb-12">
                <div 
                  className="group p-8 bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-slate-100"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < 5 ? "#b89e70" : "none"} className="text-primary-gold" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 leading-relaxed font-medium mb-8 flex-grow italic text-lg">
                    "{rev.comment}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                      <img 
                        src={rev.image || `https://i.pravatar.cc/150?u=${rev.name}`} 
                        alt={rev.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 font-bold text-sm tracking-tight">{rev.name}</p>
                        <CheckCircle2 size={12} className="text-blue-500" />
                      </div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
