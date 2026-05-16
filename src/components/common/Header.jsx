import { Menu, Search, User, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "/Images/LOGO.PNG";
import { Link } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        const data = await response.json();
        // Extract names and ensure "All Products" is handled if needed
        // but typically we'll just list what's in the DB and add "All Products"
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Base categories as requested by the user
  const baseCategories = [
    "Just Launched",
    "Kurta sets",
    "Kurti & Top",
    "Bottoms wear",
    "Tie Dye",
    "Sale",
    "Dupattas",
  ];

  // Merge base categories with backend categories, avoiding duplicates (case-insensitive normalization)
  const dynamicCategoryNames = categories.map(c => c.name);
  
  // Normalize to avoid duplicates like "Kurta sets" vs "Kurta Sets"
  const normalize = (name) => name.toLowerCase().trim();
  const seen = new Set(baseCategories.map(normalize));
  
  const uniqueDynamicCategories = dynamicCategoryNames.filter(name => {
    const norm = normalize(name);
    if (seen.has(norm)) return false;
    seen.add(norm);
    return true;
  });

  const navItems = [...baseCategories, ...uniqueDynamicCategories, "All Products"];

  const getSlug = (item) => item.toLowerCase().replace(/\s+/g, '-');

  return (
    <header className="w-full shadow-md bg-white sticky top-0 z-50">
      {/* Top strip */}
      <div
        className="flex items-center justify-center bg-black h-[50px] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-10 animate-pulse"></div>
        <h1 className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] relative z-10">
          COD Available | <span className="text-primary-gold">Express Shipping</span> (PAN INDIA)
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-black min-h-[100px] lg:h-32">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center mr-4">
          <img src={logo} alt="Logo" className="w-auto h-24 lg:h-32 transform transition-transform hover:scale-105 duration-500" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex gap-3 xl:gap-5 font-black text-[10px] xl:text-[11px] uppercase tracking-tighter xl:tracking-widest text-slate-950 flex-1 justify-center px-2">
          {navItems.map((item, index) => (
            <Link
              to={`/category/${getSlug(item)}`}
              key={index}
              className="hover:text-primary-gold transition-colors relative group py-2 whitespace-nowrap"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden sm:flex items-center gap-6 border-r border-slate-100 pr-8 mr-2">
            <Search
              className="w-5 h-5 cursor-pointer hover:text-primary-gold transition-colors"
              strokeWidth={2}
            />
            <Link to="/login">
              <User
                className="w-5 h-5 cursor-pointer hover:text-primary-gold transition-colors"
                strokeWidth={2}
              />
            </Link>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 sm:p-3 relative group rounded-2xl bg-slate-50 hover:bg-slate-950 hover:text-white transition-all duration-300"
          >
            <ShoppingCart
              className="w-5 h-5"
              strokeWidth={2}
            />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary-gold text-white text-[9px] font-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white">
              0
            </span>
          </button>

          {/* Hamburger Menu */}
          <button
            className="lg:hidden p-2 sm:p-3 rounded-2xl bg-slate-50 hover:bg-slate-950 hover:text-white transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-50 px-8 py-10 space-y-6 flex flex-col items-center animate-in slide-in-from-top duration-500">
          {navItems.map((item, index) => (
            <Link
              to={`/category/${getSlug(item)}`}
              key={index}
              onClick={() => setIsOpen(false)}
              className="text-lg font-black uppercase tracking-widest text-slate-950 hover:text-primary-gold transition-all"
            >
              {item}
            </Link>
          ))}
          <div className="pt-8 border-t border-slate-100 w-full flex justify-center gap-8">
            <Search size={22} className="cursor-pointer hover:text-primary-gold" />
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <User size={22} className="cursor-pointer hover:text-primary-gold" />
            </Link>
          </div>
        </nav>
      )}

      {/* Cart Drawer Integrated */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

