import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight, Eye, Play, Pause, ShoppingBag, Heart } from "lucide-react";
import QuickViewModal from "../product/QuickViewModal";

// Custom Arrows
function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-950 hover:text-white transition-all scale-75 sm:scale-100 border border-slate-100"
    >
      <ArrowLeft size={24} strokeWidth={1.5} />
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-950 hover:text-white transition-all scale-75 sm:scale-100 border border-slate-100"
    >
      <ArrowRight size={24} strokeWidth={1.5} />
    </button>
  );
}

// Card Component
function VideoCard({ item, onClick }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="px-3 pb-8">
      <div
        className="group relative bg-slate-950 rounded-[40px] h-[520px] w-full shadow-2xl overflow-hidden cursor-pointer flex flex-col"
        onClick={() => item.productId && onClick(item.productId)}
      >
        {/* Dynamic Badge */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">{item.views || 0}k views</span>
        </div>

        {/* Favorite Icon */}
        <button className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 duration-500">
          <Heart size={18} />
        </button>

        {/* Main Video */}
        <video
          src={item.videoUrl}
          poster={item.thumbnail}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          onMouseOver={(e) => {
            e.target.play();
            setIsPlaying(true);
          }}
          onMouseOut={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
            setIsPlaying(false);
          }}
        />

        {/* Play/Pause Icon Hint */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-125 transition-transform duration-700">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
            {isPlaying ? (
              <Pause size={24} className="text-white fill-white" />
            ) : (
              <Play size={24} className="text-white fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Content Info Overlay */}
        <div className="mt-auto relative z-10 p-8 space-y-6 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              <video src={item.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
            </div>
            <p className="text-white font-bold leading-tight line-clamp-2 tracking-tight">
              {item.title || item.productId?.name || "Premium Collection"}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (item.productId) onClick(item.productId);
            }}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-primary-gold group-hover:shadow-2xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500"
          >
            <ShoppingBag size={18} /> Buy This Look
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function ExploreAndBuy() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (prod, videoUrl) => {
    navigate(`/product/${prod._id}`, { state: { fallbackVideo: videoUrl } });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/videos`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const settings = {
    infinite: items.length > 4,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3.2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2.2 } },
      { breakpoint: 640, settings: { slidesToShow: 1.2 } },
    ],
  };

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary-gold text-xs font-bold tracking-[0.3em] uppercase">Visual Shop</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 uppercase italic">
            See It, Love It, Buy It
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Take a look at our latest collections in action. Inspired by real stories.
          </p>
        </div>

        <div className="px-2">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-[40px] h-[520px] bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">Coming soon...</div>
          ) : (
            <Slider {...settings}>
              {items.map((item, index) => (
                <VideoCard 
                  key={item._id || index} 
                  item={item} 
                  onClick={(prod) => handleItemClick(prod, item.videoUrl)} 
                />
              ))}
            </Slider>
          )}
        </div>
      </div>

      <QuickViewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        product={selectedItem}
        fallbackVideo={items.find(it => it.productId?._id === selectedItem?._id)?.videoUrl}
      />
    </section>
  );
}
