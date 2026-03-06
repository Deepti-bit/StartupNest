import React from 'react';
import {
    Search,
    Users,
    Target,
    MessageSquare,
    TrendingUp,
    ChevronRight,
    Heart,
    Lightbulb,
    Star,
    Rocket,
    ShieldCheck
} from 'lucide-react';
import Navbar from '../MentorComponents/MentorNavbar';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100">

            {/* --- HERO SECTION --- */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                        <Rocket size={16} /> Now supporting 500+ Early Stage Startups
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                        Turn your vision into a <span className="text-indigo-600">Scalable Reality.</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                        The ultimate bridge connecting ambitious founders with mentors who have already walked the path to exit.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/signup', { state: { role: 'Entrepreneur' } })}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            Launch My Startup
                        </button>
                        <button 
                            onClick={() => navigate('/signup', { state: { role: 'Mentor' } })}
                            className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:border-indigo-600 transition-all"
                        >
                            Become a Mentor
                        </button>
                    </div>
                </div>

                <div className="relative hidden lg:flex justify-center">
                    <div className="relative w-[450px] h-[450px] bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden border border-gray-100">
                        <img
                            src="https://res.cloudinary.com/daiuxfzzc/image/upload/v1772479377/Company-cuate_2_jcg3sb.svg"
                            alt="Collaboration"
                            className="w-[80%] h-auto z-10 animate-float"
                        />
                    </div>
                    {/* Floating Stats */}
                    <div className="absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="text-green-600" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Average Growth</p>
                            <p className="text-xl font-black">+140%</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LOGO BAR --- */}
            <div className="max-w-7xl mx-auto px-6 py-10 border-y border-gray-50">
                <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Mentors from the world's leading ecosystems</p>
                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="text-2xl font-black">Y Combinator</span>
                    <span className="text-2xl font-black text-blue-600">Techstars</span>
                    <span className="text-2xl font-black">Sequoia</span>
                    <span className="text-2xl font-black text-red-500">500 Global</span>
                </div>
            </div>

            {/* --- CORE VALUE PROP --- */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-bold">Why Founders Choose Our Interface</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">We’ve stripped away the noise to focus on what matters: actionable advice and fundraising readiness.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: "Smart Matching", 
                                icon: <Target className="text-indigo-400" size={32}/>, 
                                desc: "Our algorithm connects you with mentors specifically in your industry vertical and growth stage." 
                            },
                            { 
                                title: "Verified Track Records", 
                                icon: <ShieldCheck className="text-indigo-400" size={32}/>, 
                                desc: "Every mentor is vetted for real-world success. No 'theorists', only builders and investors." 
                            },
                            { 
                                title: "Direct Pitch Access", 
                                icon: <MessageSquare className="text-indigo-400" size={32}/>, 
                                desc: "Skip the cold emails. Get your pitch deck reviewed directly by people who write the checks." 
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500 transition-colors group">
                                <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           

            {/* --- MINIMAL FOOTER --- */}
            <footer className="bg-gray-50 border-t border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                    <h3 className="text-2xl font-bold">Ready to scale?</h3>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => navigate('/signup')} className="text-indigo-600 font-bold hover:underline">Register as Entrepreneur</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => navigate('/signup')} className="text-indigo-600 font-bold hover:underline">Apply as Mentor</button>
                    </div>
                    <p className="text-gray-400 text-sm">© 2024 StartupBridge Inc. Accelerating the next generation of founders.</p>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;