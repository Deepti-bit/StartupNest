import React from 'react';
import Navbar from '../MentorComponents/MentorNavbar'; 
import { Apple, Mail } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden font-sans">
      {/* 1. NAVBAR - Stays at the top */}
      <Navbar />

      {/* 2. FULL SCREEN HERO CONTAINER */}
      <main className="flex-1 relative flex flex-col items-center justify-center py-12 px-6">
        
        {/* BACKGROUND SVG: Full Screen Absolute Positioning */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
          <img 
            src="https://res.cloudinary.com/daiuxfzzc/image/upload/v1772479377/Company-cuate_2_jcg3sb.svg" 
            alt="Background Illustration" 
            className="w-full h-full max-w-7xl object-contain transform scale-110 lg:scale-125 animate-float"
          />
        </div>

        {/* 3. TOP HEADING: Positioned over the background */}
        {/* <div className="relative z-10 w-full max-w-5xl text-center mb-8">
          <h1 className="text-[#00a36c] text-4xl md:text-6xl font-black tracking-tight leading-tight">
            You deserve a job that loves you back
          </h1>
        </div> */}

        {/* 4. THE CENTERED MODAL */}
        <div className="relative z-20 w-full max-w-[440px]">
          <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 text-center">
            
            {/* Partnership Logos */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-[#00a36c] text-xl font-black tracking-tighter uppercase">'COMPANY'</span>
              <span className="text-gray-300 text-xl">•</span>
              <span className="text-[#2557a7] text-2xl font-bold italic tracking-tighter">indeed</span>
            </div>

            {/* Modal Text */}
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Signup and Give your ideas Wings 🪽</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Streamline your research and get better job matches across 
                Company and Indeed with <span className="underline cursor-pointer font-medium hover:text-[#00a36c]">one login.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Google Sign In */}
              <button className="w-full flex items-center justify-center gap-3 bg-[#42d38a] hover:bg-[#3bc27d] text-gray-900 font-bold py-3.5 px-4 rounded-lg transition-all shadow-sm active:scale-[0.98]">
                <div className="bg-white p-1 rounded-full shadow-sm">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                </div>
                Continue with Google
              </button>

              {/* Apple / Email Alternative */}
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-900 text-gray-900 font-bold py-3.5 px-4 rounded-lg hover:bg-gray-50 transition-all active:scale-[0.98]">
                <Apple size={22} fill="currentColor" />
                Continue with Apple or email
              </button>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-gray-100 w-full" />

            {/* Modal Footer */}
            <div className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Have an existing Company account and don't want one login with Indeed? 
                If so, <span className="text-[#00a36c] font-bold cursor-pointer hover:underline">sign in here</span>
              </p>
            </div>
          </div>
        </div>

        {/* 5. STORYSET ATTRIBUTION: Sticky at the bottom right */}
        <div className="absolute bottom-6 right-8 z-10">
          <a 
            href="https://storyset.com/people" 
            className="text-[10px] text-gray-400 hover:text-[#00a36c] transition-colors uppercase tracking-widest font-bold"
            target="_blank" 
            rel="noopener noreferrer"
          >
            People illustrations by Storyset
          </a>
        </div>
      </main>

      {/* Floating Animation for the Background Image */}
      
    </div>
  );
};

export default HomePage;