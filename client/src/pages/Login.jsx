import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();
    
    // Auto-detect local vs production API
    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api/auth' 
        : 'https://smart-hostel-api.onrender.com/api/auth';

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axios.post(`${API_BASE}/google-login`, { 
                token: response.credential, 
                role: selectedRole 
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('userRole', res.data.user.role);
            navigate('/dashboard');
        } catch (err) { 
            alert(err.response?.data?.msg || "Login Failed"); 
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
             {/* Subtle Background Decoration */}
             <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
             
             <div className="w-full max-w-lg relative z-10">
                <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 text-center">
                    
                    {/* Header Text */}
                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic">
                            Who are <span className="text-indigo-600 text-6xl block not-italic mt-2">YOU?</span>
                        </h2>
                    </div>
                    
                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-12">
                        {/* Resident Button */}
                        <button 
                            onClick={() => setSelectedRole('student')}
                            className={`group relative p-10 rounded-[3rem] border-2 transition-all duration-500 flex flex-col items-center
                            ${selectedRole === 'student' 
                                ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100' 
                                : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200'}`}
                        >
                            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎓</span>
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] 
                            ${selectedRole === 'student' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                Resident
                            </span>
                        </button>

                        {/* Admin Button */}
                        <button 
                            onClick={() => setSelectedRole('admin')}
                            className={`group relative p-10 rounded-[3rem] border-2 transition-all duration-500 flex flex-col items-center
                            ${selectedRole === 'admin' 
                                ? 'border-slate-900 bg-slate-900 shadow-xl shadow-slate-200' 
                                : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200'}`}
                        >
                            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔑</span>
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] 
                            ${selectedRole === 'admin' ? 'text-white' : 'text-slate-400'}`}>
                                Admin
                            </span>
                        </button>
                    </div>

                    {/* Google Login Interaction Area */}
                    <div className="min-h-[100px] flex items-center justify-center">
                        {selectedRole ? (
                            <div className="animate-in fade-in zoom-in duration-500 scale-125 hover:scale-[1.3] transition-transform">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess} 
                                    onError={() => alert("Google Login Failed")}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                />
                            </div>
                        ) : (
                            <div className="w-full py-6 border-2 border-dashed border-indigo-100 rounded-[2.5rem]">
                                <p className="border:border-indigo-100 transition-all text-[10px] font-black uppercase tracking-[0.15em]">
                                    Please select a role above to proceed
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div className="mt-12 pt-8 border-t border-slate-50">
                        <div className="flex justify-center items-center gap-2 opacity-30">
                            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-[8px]">SH</div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Smart Portal Cloud Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;