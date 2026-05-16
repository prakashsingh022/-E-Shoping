import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

const CartDrawer = ({ isOpen, onClose }) => {
  // Cart items State (now starts empty)
  const [cartItems, setCartItems] = useState([]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-500 ease-premium-in-out animate-in slide-in-from-right h-full">
          <div className="flex flex-col h-full bg-white shadow-2xl rounded-l-[40px]">
            
            {/* Header */}
            <div className="px-8 py-8 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-slate-950" />
                <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Your Bag</h2>
                <span className="bg-primary-gold text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">
                  {cartItems.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-950 hover:text-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scrollbar-hide">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="group flex gap-6 items-start">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-1 flex flex-col h-32 py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-slate-950 font-bold text-sm leading-tight line-clamp-2 max-w-[180px]">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.variant}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-400 hover:text-slate-950 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black text-slate-950 w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-400 hover:text-slate-950 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-lg font-black text-slate-950">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <ShoppingBag size={40} strokeWidth={1} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-950 font-black uppercase tracking-tighter">Your bag is empty</p>
                    <p className="text-slate-400 text-xs font-medium">Add something high-end to start shopping</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="btn-premium py-4 w-full rounded-2xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-slate-50/50 backdrop-blur-md rounded-t-[40px] border-t border-white space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] px-1">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] px-1 border-b border-slate-200 pb-4">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center px-1 pt-2">
                    <span className="text-slate-950 font-black text-xl uppercase tracking-tighter italic">Total Amount</span>
                    <span className="text-3xl font-black text-slate-950 tracking-tighter">₹{subtotal}</span>
                  </div>
                </div>
                <button className="btn-premium w-full py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-primary-gold/20 group">
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest pt-2">
                  Taxes & discounts calculated at checkout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
