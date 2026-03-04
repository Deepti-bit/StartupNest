import React from 'react';
import { LogIn, Bell, ChevronDown, Users, Sparkles, BookOpen, Rocket, Target, Globe } from 'lucide-react';

const Navbar = () => {
  // Navigation items configuration
  const navLinks = [
    { 
      name: 'Home', 
      content: (
        <div className="grid grid-cols-2 gap-4 w-[400px]">
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Target size={20} /></div>
            <div>
              <p className="font-bold text-sm text-gray-900">Personal Feed</p>
              <p className="text-xs text-gray-500">Your curated daily updates</p>
            </div>
          </div>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Sparkles size={20} /></div>
            <div>
              <p className="font-bold text-sm text-gray-900">Explore</p>
              <p className="text-xs text-gray-500">Trending topics today</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      name: 'Community', 
      content: (
        <div className="w-[300px] space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">Top Groups</p>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-between">
            <span className="text-sm font-medium">Designers Circle</span>
            <Users size={16} className="text-gray-400" />
          </div>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-between">
            <span className="text-sm font-medium">Tech Founders</span>
            <Globe size={16} className="text-gray-400" />
          </div>
        </div>
      )
    },
    { 
      name: 'For Entrepreneurs', 
      content: (
        <div className="w-[450px] p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <Rocket className="text-emerald-600 mb-2" size={24} />
               <p className="font-bold text-gray-900">Launchpad</p>
               <p className="text-xs text-emerald-700">Get your MVP ready in 30 days.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
               <BookOpen className="text-orange-600 mb-2" size={24} />
               <p className="font-bold text-gray-900">Knowledge Base</p>
               <p className="text-xs text-orange-700">Scaling guides for Series A.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-[#00a36c] text-2xl font-black tracking-tighter uppercase cursor-pointer">
              'COMPANY'
            </span>
          </div>

          {/* Navigation Links with Hover Modals */}
          <div className="hidden md:flex items-center h-full space-x-2">
            {navLinks.map((link) => (
              <div key={link.name} className="group relative h-full flex items-center">
                {/* The Link Trigger */}
                <button className="flex items-center gap-1 px-4 h-full text-[15px] font-semibold text-gray-700 group-hover:text-[#00a36c] transition-colors">
                  {link.name}
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* The Modal (Hidden by default, shown on group hover) */}
                <div className="absolute top-[64px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  {/* Invisible Bridge (Prevents modal closing when moving mouse down) */}
                  <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                  
                  {/* Modal Container */}
                  <div className="bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 min-w-max">
                    {link.content}
                    
                    {/* Optional Footer for all modals */}
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
                      <button className="text-[11px] font-bold text-[#00a36c] uppercase tracking-wider hover:underline">
                        View all resources →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={22} />
            </button>

            <button className="flex items-center gap-2 bg-[#0d141c] text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95">
              <LogIn size={18} />
              <span className="text-[15px]">Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
