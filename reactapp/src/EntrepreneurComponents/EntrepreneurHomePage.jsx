import React from 'react';
import { 
  Rocket, 
  Users, 
  Lightbulb, 
  ChevronRight, 
  MessageSquare, 
  PlusCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../EntrepreneurComponents/EntrepreneurNavbar';

const EntrepreneurHome = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Founder';

    // Mock data for the dashboard
    const stats = [
        { label: 'Ideas Submitted', value: '3', icon: <Lightbulb className="text-amber-500" /> },
        { label: 'Active Mentors', value: '2', icon: <Users className="text-blue-500" /> },
        { label: 'Pitch Deck Views', value: '24', icon: <TrendingUp className="text-green-500" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                
                {/* --- WELCOME HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}! 👋</h1>
                        <p className="text-gray-500 mt-1">Here is what's happening with your startups today.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/entrepreneur/submit-idea')}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
                    >
                        <PlusCircle size={20} />
                        Submit New Idea
                    </button>
                </header>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-gray-50 rounded-xl">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* --- MAIN ACTION CARDS (Left Side) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="font-bold text-lg text-gray-900">Your Recent Submissions</h2>
                                <button onClick={() => navigate('/entrepreneur/my-submissions')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                            </div>
                            <div className="p-6">
                                {/* Example of a single submission row */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-lg shadow-sm"><Rocket className="text-indigo-600" size={20}/></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">EcoStream AI</h4>
                                            <p className="text-xs text-gray-500">Submitted 2 days ago</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Pending Review</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-2xl font-bold">Find your perfect Mentor</h2>
                                <p className="text-indigo-100 opacity-90">Browse industry experts ready to help you scale.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/entrepreneur/opportunities')}
                                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-indigo-50 transition-colors"
                            >
                                Explore Opportunities
                            </button>
                        </section>
                    </div>

                    {/* --- SIDEBAR (Right Side) --- */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-indigo-500" /> Upcoming Meetings
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400 italic text-center py-4">No meetings scheduled for this week.</p>
                                <button className="w-full py-2 text-sm font-semibold text-indigo-600 border border-indigo-50 rounded-lg hover:bg-indigo-50 transition-colors">
                                    Book a session
                                </button>
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                            <h3 className="font-bold text-indigo-900 mb-2">Startup Tip of the Day</h3>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                                "Focus on solving a specific problem for a specific group of people. Don't try to build everything at once."
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default EntrepreneurHome;