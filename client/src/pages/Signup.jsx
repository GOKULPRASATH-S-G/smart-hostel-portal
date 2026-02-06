import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', year: '', phoneNumber: '' });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://10.10.174.49:5000/api/auth/signup', formData);
            navigate('/login');
        } catch (err) {
            alert("Error: User might already exist.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Join Us</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Create Your Identity</p>
                    </div>
                    
                    <form onSubmit={handleSignup} className="space-y-4">
                        
                        {/* ROLE SELECTION (Moved to top for better UX) */}
                        <div className="px-2 mb-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">I am a...</label>
                             <select className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="student">Student</option>
                               
                            </select>
                        </div>

                        <input type="text" placeholder="Full Name" required className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <input type="email" placeholder="Email Address" required className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        
                        {/* CONDITIONAL FIELDS: Only show for Students */}
                        {formData.role === 'student' && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <input type="text" placeholder="Year" required className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none"
                                    onChange={(e) => setFormData({...formData, year: e.target.value})} />
                                <input type="text" placeholder="Phone" required className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none"
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                            </div>
                        )}

                        <input type="password" placeholder="Password" required className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />

                        <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-xl active:scale-95 mt-4">
                            Register
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-800 underline decoration-2 underline-offset-4">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;