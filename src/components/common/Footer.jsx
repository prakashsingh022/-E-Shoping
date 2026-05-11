import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { footerData, navigationItems } from "../../data/homeData";
import { Link } from "react-router-dom";

export default function Footer() {
  const { information, policies, team } = footerData;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-3xl font-black mb-6 tracking-tighter italic">TARA</h3>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm font-medium">
              Experience the fusion of tradition and modern elegance. Handcrafted collections for the contemporary soul.
            </p>

            <div className="space-y-4">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Subscribe to our newsletter</h4>
              <div className="relative max-w-sm">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-xs focus:outline-none focus:border-primary-gold transition-colors font-bold"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary-gold hover:bg-primary-gold-dark text-slate-950 px-5 rounded-xl transition-all active:scale-95">
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Shop</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
              {navigationItems.map((item) => (
                <li key={item}>
                  <Link to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-gold transition-colors flex items-center group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-primary-gold" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Information</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
              {information.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-gold transition-colors flex items-center group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-primary-gold" />
                    {item}
                  </a>
                </li>
              ))}
              {policies.slice(0, 2).map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-gold transition-colors flex items-center group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-primary-gold" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Contact Us</h4>
            <ul className="space-y-5 text-xs font-bold mb-8">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-primary-gold" />
                </div>
                <span className="leading-relaxed">123 Fashion Street,<br />Jaipur, India</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-primary-gold" />
                </div>
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-primary-gold" />
                </div>
                <span>hello@tara.com</span>
              </li>
            </ul>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-gold hover:text-slate-950 hover:border-primary-gold transition-all duration-500 hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section (Updated Aesthetic) */}
        <div className="border-t border-slate-900 pt-16 pb-4">
          <h4 className="text-white font-black mb-12 text-center uppercase tracking-[0.4em] text-[10px]">The Minds Behind Tara</h4>
          <div className="flex flex-wrap justify-center gap-16">
            {team.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-4 group cursor-default">
                <div className="relative">
                  <div className="absolute -inset-2 border border-primary-gold/20 rounded-full scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-800 group-hover:border-primary-gold transition-all duration-500 relative z-10 filter grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">{m.name}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{m.work}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} TARA Fashion. Crafting Excellence.
          </p>

          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}
