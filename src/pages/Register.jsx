import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, CheckCircle2, ShoppingBag, ShieldCheck } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        console.log("Registration Success", formData);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20 px-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-gold rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden relative z-10 border border-slate-100 flex flex-col md:flex-row animate-in slide-in-from-bottom duration-700">
        
        {/* Left: Info Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-950 p-12 text-white flex flex-col justify-between items-start space-y-12">
           <div className="space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-primary-gold/20 flex items-center justify-center text-primary-gold border border-primary-gold/30">
                 <ShieldCheck size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">
                 Create <br/> <span className="text-primary-gold">Impact</span>
              </h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] pt-2">Join the premium community</p>
           </div>
           
           <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-gold group-hover:bg-primary-gold group-hover:text-slate-950 transition-all duration-500">
                    <CheckCircle2 size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Priority Access To Sales</p>
              </div>
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-gold group-hover:bg-primary-gold group-hover:text-slate-950 transition-all duration-500">
                    <ShoppingBag size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Exclusive Reward Points</p>
              </div>
           </div>

           <div className="pt-8 w-full">
              <Link to="/login" className="flex items-center justify-between group p-3 border-t border-white/10">
                 <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest leading-none">Already member?</p>
                 <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary-gold transition-colors">Sign In <ArrowRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
           </div>
        </div>

        {/* Right: Register Form */}
        <div className="flex-1 p-8 sm:p-14 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary-gold'}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full bg-slate-50 border rounded-3xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 transition-all font-bold text-sm ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-slate-50 focus:ring-primary-gold/10'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary-gold'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full bg-slate-50 border rounded-3xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 transition-all font-bold text-sm ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-50 focus:ring-primary-gold/10'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary-gold'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-3xl py-4 pl-12 pr-12 text-slate-900 focus:outline-none focus:ring-4 transition-all font-bold text-sm ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-50 focus:ring-primary-gold/10'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-3xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 transition-all font-bold text-sm ${errors.confirmPassword ? 'border-red-500 focus:ring-red-100' : 'border-slate-50 focus:ring-primary-gold/10'}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" required className="w-5 h-5 rounded-lg border-2 border-slate-100 checked:bg-primary-gold checked:border-primary-gold transition-all cursor-pointer" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">I agree to the <span className="text-primary-gold">Terms of Service</span> & Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 mt-4 ${isLoading ? 'bg-slate-400 text-white' : 'bg-slate-950 text-white hover:bg-primary-gold hover:shadow-primary-gold/30'}`}
            >
              {isLoading ? 'Creating Magic...' : 'Join The Premium Experience'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-slate-400 text-[8px] font-black uppercase tracking-[0.4em] pt-4">
            Secured by bank-level SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
