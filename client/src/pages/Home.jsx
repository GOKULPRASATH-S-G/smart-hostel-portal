import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans overflow-hidden">
            {/* Simple Top Bar */}
            <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">SH</div>
                    <span className="font-black text-slate-800 tracking-tighter text-xl">SMART <span className="text-indigo-600">HOSTEL PORTAL</span></span>
                </div>
                <button 
                    onClick={() => navigate('/login')}
                    className="text-sm font-black text-slate-400 hover:text-indigo-600 transition uppercase tracking-widest"
                >
                    Member Login
                </button>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Next-Gen Allocation System
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                        Find your <br />
                        <span className="text-indigo-600">Perfect Stay.</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                        A smart, automated portal for students and admins to manage hostel room allocations with zero paperwork and instant approvals.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-indigo-200 hover:bg-indigo-600 transition-all duration-500 hover:-translate-y-1 active:scale-95"
                        >
                            GET STARTED NOW
                        </button>
                        <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 rounded-[2rem]">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white"></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">500+ Residents</span>
                        </div>
                    </div>
                </div>

                {/* Visual Decoration */}
                <div className="flex-1 relative hidden lg:block">
                    <div className="w-[500px] h-[500px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[4rem] rotate-12 absolute -z-10 opacity-10 blur-3xl"></div>
                    <div className="grid grid-cols-2 gap-6 rotate-3">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 transform -translate-y-12">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">₹</div>
                            <p className="font-black text-slate-800">Budget Friendly</p>
                            <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">Starting from ₹500/mo with all-inclusive amenities.</p>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white transform translate-y-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-xl">⚡</div>
                            <p className="font-black">Instant Booking</p>
                            <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">Real-time room availability and admin approval system.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">© 2026 Smart Hostel Portal. All Rights Reserved.</p>
                <div className="flex gap-8">
                    <span className="text-slate-300 font-bold text-xs uppercase cursor-pointer hover:text-indigo-600 transition">Privacy</span>
                    <span className="text-slate-300 font-bold text-xs uppercase cursor-pointer hover:text-indigo-600 transition">Support</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;