import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://smart-hostel-api.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome Back</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Enter Credentials to Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                            <input type="email" required placeholder="hello@student.com"
                                className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300"
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
                            <input type="password" required placeholder="••••••••"
                                className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300"
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 shadow-xl active:scale-95 mt-4">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            New here? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 underline decoration-2 underline-offset-4">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;