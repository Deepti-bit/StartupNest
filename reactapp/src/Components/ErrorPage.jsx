// import React from 'react';

// const ErrorPage = () => {
//   return (
//     <div>
//       <h1>Oops! Something Went Wrong</h1>

//       <p>Please try again later.</p>
//     </div>
//   );
// };

// export default ErrorPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#080b1a] flex items-center justify-center overflow-hidden relative px-4 font-sans">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-[3.5rem] p-8 md:p-14 text-center">

        <div className="inline-block bg-rose-500/80 text-white font-black px-5 py-1.5 rounded-full text-xs tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.4)] mb-8 animate-pulse border border-rose-400/50">
          SYSTEM CRASHED : 500
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">

          <div className="relative group">
            <div className="relative w-56 h-56 md:w-72 md:h-64">

              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.5rem] rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl"></div>

              <div className="relative w-full h-full bg-slate-800 rounded-[2rem] overflow-hidden border-4 border-white shadow-inner z-10 animate-float">
                <img
                  src="https://media1.tenor.com/m/OBQ6JUJeHl0AAAAd/idk-what-is-this.gif"
                  alt="Oggy and Jack"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -top-6 -right-4 bg-white text-slate-900 px-4 py-2 rounded-2xl rounded-bl-none font-black text-xs shadow-2xl z-20 animate-bounce">
                OH NO! 500! 🙀
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-5">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Oops! <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Something</span> <br />
              Went Wrong
            </h1>

            <p className="text-slate-400 text-sm md:text-base font-medium max-w-sm mx-auto md:mx-0 leading-relaxed">
              Our startup cat got stuck in the server! <br />
              We are working hard to pull him out before the cockroaches find him.
            </p>

            <div className="flex flex-row gap-4 pt-4 justify-center md:justify-start">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-slate-800 text-white font-black rounded-2xl transition-all hover:bg-slate-700 active:scale-95 shadow-[0_5px_0px_#050505] border border-white/5 text-sm"
              >
                ← GO BACK
              </button>

              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 shadow-[0_5px_0px_#1e3a8a] text-sm"
              >
                HOME BASE 🚀
              </button>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;