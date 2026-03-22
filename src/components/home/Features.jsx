import React from "react";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Truck size={32} strokeWidth={1.5} />,
      title: "Free Shipping",
      desc: "On all orders above ₹1999"
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Secure Payment",
      desc: "100% protected transactions"
    },
    {
      icon: <RefreshCw size={32} strokeWidth={1.5} />,
      title: "Easy Returns",
      desc: "7-day seamless return policy"
    },
    {
      icon: <Headphones size={32} strokeWidth={1.5} />,
      title: "24/7 Support",
      desc: "Dedicated customer assistance"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 group-hover:bg-primary-gold group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed text-balance">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
