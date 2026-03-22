import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, Chrome, Facebook } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
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
        console.log("Login Success", formData);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20 px-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-gold rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-xl bg-white rounded-[48px] shadow-2xl p-8 sm:p-14 relative z-10 border border-slate-100 flex flex-col md:flex-row gap-12 overflow-hidden animate-in fade-in zoom-in duration-700">
        
        {/* Left: Form */}
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
              Sign <span className="text-primary-gold">In</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Access your premium dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary-gold'}`} size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className={`w-full bg-slate-50 border rounded-3xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 transition-all font-bold text-sm ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-50 focus:ring-primary-gold/10'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1 animate-in slide-in-from-top-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Password</label>
                <button type="button" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary-gold'}`} size={18} />
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
              {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1 animate-in slide-in-from-top-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 ${isLoading ? 'bg-slate-400 text-white' : 'bg-slate-950 text-white hover:bg-primary-gold hover:shadow-primary-gold/30'}`}
            >
              {isLoading ? 'Processing...' : 'Secure Login'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Social Login */}
          <div className="space-y-6 pt-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">Or Continue With</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 border-2 border-slate-50 rounded-2xl flex items-center justify-center gap-2 hover:border-primary-gold transition-all group">
                <Chrome size={18} className="text-slate-400 group-hover:text-primary-gold" />
                <span className="text-[10px] font-black text-slate-900 hidden sm:inline uppercase">Google</span>
              </button>
              <button className="flex-1 py-4 border-2 border-slate-50 rounded-2xl flex items-center justify-center gap-2 hover:border-primary-gold transition-all group">
                <Facebook size={18} className="text-slate-400 group-hover:text-primary-gold" />
                <span className="text-[10px] font-black text-slate-900 hidden sm:inline uppercase">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Sidebar (Right) */}
        <div className="hidden md:flex md:w-48 flex-col justify-between bg-slate-50/50 rounded-[32px] p-8 border border-slate-100">
           <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-gold">
                 <ShieldCheck size={24} />
              </div>
              <p className="text-slate-950 font-black text-lg uppercase tracking-tighter leading-tight italic">
                 Handcrafted <br/> & Secure
              </p>
              <p className="text-slate-400 text-[9px] font-bold leading-relaxed uppercase tracking-widest">
                 Your data is encrypted with bank-level security.
              </p>
           </div>
           
           <Link to="/register" className="group space-y-2">
              <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em]">Join The Club</p>
              <p className="text-slate-950 font-black text-[10px] uppercase tracking-widest group-hover:text-primary-gold transition-colors underline underline-offset-4">
                Create Account
              </p>
           </Link>
        </div>
      </div>
    </div>
  );
}
