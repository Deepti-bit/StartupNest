import React, { useEffect, useState } from 'react';
import { 
  Rocket, 
  Users, 
  Lightbulb, 
  PlusCircle,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api'; 
import Navbar from '../EntrepreneurComponents/EntrepreneurNavbar';

const EntrepreneurHome = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        ideasCount: 0,
        mentorsCount: 0,
        recentSubmissions: [],
        upcomingMeetings: []
    });

    const userName = localStorage.getItem('userName') || 'Founder';

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const response = await api.get('/entrepreneur/dashboard');
                
                
                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const statsList = [
        { 
            label: 'Ideas Submitted', 
            value: dashboardData.ideasCount, 
            icon: <Lightbulb className="text-amber-500" /> 
        },
        { 
            label: 'Active Mentors', 
            value: dashboardData.mentorsCount, 
            icon: <Users className="text-blue-500" /> 
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                
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

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* --- STATS GRID (Dynamic values from DB) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {statsList.map((stat, i) => (
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
                            <div className="p-6 space-y-4">
                                {dashboardData.recentSubmissions.length > 0 ? (
                                    dashboardData.recentSubmissions.map((sub) => (
                                        <div key={sub._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Rocket className="text-indigo-600" size={20}/>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{sub.title}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        Submitted {new Date(sub.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                sub.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                                sub.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {sub.status || 'Pending'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <p>No submissions found. Start by submitting an idea!</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
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