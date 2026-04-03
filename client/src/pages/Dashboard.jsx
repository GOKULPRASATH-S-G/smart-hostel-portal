import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // --- 1. STATES ---
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showModal, setShowModal] = useState(false); 
    const [profileData, setProfileData] = useState({ phoneNumber: '', year: '', name: '' });
    const [newRoom, setNewRoom] = useState({ roomNumber: '', floor: '', type: 'Single', price: '' });
    
    const [filterFloor, setFilterFloor] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');

    const [showAvailableSec, setShowAvailableSec] = useState(true);
    const [showBookedSec, setShowBookedSec] = useState(true);

    const navigate = useNavigate();
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://smart-hostel-api.onrender.com/api';

    // --- 2. LOAD DATA ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (!token || !userStr) return navigate('/login');

        const user = JSON.parse(userStr);
        setRole(user.role || 'student');
        setUserId(user.id || user._id);
        setUserName(user.name || 'User');

        if (user.role === 'student' && (!user.phoneNumber || !user.year)) {
            setProfileData(prev => ({ ...prev, name: user.name }));
            setShowProfileModal(true);
        }
        fetchRooms();
    }, [navigate]);

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${API_BASE}/rooms/all`);
            setRooms(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error(err); }
    };

    const handleAction = async (url, body = {}, id) => {
        setLoadingId(id);
        try {
            await axios.post(url, body);
            fetchRooms(); 
        } catch (err) {
            alert(err.response?.data?.msg || "Action failed.");
        } finally {
            setLoadingId(null);
        }
    };

    const applyFilters = (list) => {
        return list.filter((r) => (filterFloor === '' || r.floor?.toString() === filterFloor) && (filterType === '' || r.type === filterType) && (filterMaxPrice === '' || r.price <= parseInt(filterMaxPrice)));
    };

    const isAllocatedToMe = (room) => room.occupiedBy?.some(u => (u._id === userId || u === userId));
    const myAllocatedRoom = rooms.find(r => isAllocatedToMe(r));

    // --- 3. ROOM CARD COMPONENT ---
    const RoomCard = ({ room }) => {
        const isMyRoom = isAllocatedToMe(room);
        const currentCount = room.occupiedBy?.length || 0;
        const maxCap = room.capacity || 1;
        const spotsLeft = maxCap - currentCount;
        const isProcessing = loadingId === room._id;
        
        // Define dynamic styles
        const isFull = spotsLeft === 0;
        
        // Card Glow logic
        const baseClass = "bg-white rounded-[3.5rem] p-10 border transition-all duration-500 relative";
        const hoverGlow = "hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:-translate-y-2";
        const occupiedGlow = isFull ? "shadow-[0_0_25px_rgba(239,68,68,0.15)] border-rose-100" : "border-slate-100";
        const myRoomStyle = isMyRoom ? "border-indigo-500 ring-4 ring-indigo-50 shadow-[0_0_30px_rgba(79,70,229,0.2)]" : occupiedGlow;

        return (
            <div className={`${baseClass} ${hoverGlow} ${myRoomStyle}`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {/* Status Badge */}
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            isMyRoom ? 'bg-indigo-600 text-white border-indigo-600' : 
                            isFull ? 'bg-rose-50 text-rose-500 border-rose-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                            'bg-emerald-50 text-emerald-500 border-emerald-100'
                        }`}>
                            {isMyRoom ? 'Confirmed' : isFull ? 'Occupied' : 'Available'}
                        </span>
                        
                        {/* Room Number Change: # to Room no. */}
                        <h3 className="mt-4 text-2xl font-black text-slate-400 tracking-tighter">
                            Room no.<span className="text-5xl text-slate-900 ml-2">{room.roomNumber}</span>
                        </h3>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Floor {room.floor} • {room.type} Cot</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-2xl font-black ${isFull && !isMyRoom ? 'text-rose-500' : 'text-indigo-600'}`}>₹{room.price}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Monthly</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                        <span>Occupancy</span>
                        <span className={isFull ? 'text-rose-500' : 'text-slate-900'}>{currentCount} / {maxCap} Full</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${isMyRoom ? 'bg-indigo-600' : isFull ? 'bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-indigo-400'}`} 
                            style={{ width: `${(currentCount / maxCap) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {role === 'student' && (
                    <div>
                        {isMyRoom ? (
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[2rem] text-center font-black text-xs uppercase border border-indigo-100 shadow-inner">Booked Successfully</div>
                        ) : !isFull ? (
                            <button 
                                disabled={isProcessing || myAllocatedRoom} 
                                onClick={() => handleAction(`${API_BASE}/rooms/book/${room._id}`, { userId }, room._id)} 
                                className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition active:scale-95 ${isProcessing ? 'bg-slate-200' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                            >
                                {isProcessing ? '...' : 'Instant Book'}
                            </button>
                        ) : (
                            <div className="p-5 bg-rose-50 text-rose-500 rounded-[2rem] text-center font-black text-xs uppercase tracking-widest border border-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                Occupied
                            </div>
                        )}
                    </div>
                )}

                {role === 'admin' && (
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        {room.occupiedBy?.length > 0 ? room.occupiedBy.map(res => (
                            <div key={res._id || res} className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 hover:bg-white transition-colors">
                                <div className="text-xs">
                                    <p className="font-black text-slate-800">{res.name}</p>
                                    <p className="text-slate-400 text-[10px]">{res.year} • {res.phoneNumber}</p>
                                </div>
                                <button onClick={() => handleAction(`${API_BASE}/rooms/cancel/${room._id}`, { userId: (res._id || res) }, room._id)} className="text-rose-500 font-black text-[10px] uppercase underline ml-2 hover:text-rose-700">Cancel</button>
                            </div>
                        )) : <p className="text-center text-[10px] text-slate-300 font-black py-2 tracking-widest uppercase italic">Vacant Unit</p>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-10 py-6 flex justify-between items-center shadow-sm">
                <span className="font-black text-2xl uppercase tracking-tighter italic">Smart<span className="text-indigo-600">Portal</span></span>
                <div className="flex items-center gap-8">
                    <p className="text-sm font-black text-slate-800 hidden sm:block">{userName} <span className="text-[10px] text-slate-300 ml-2">({role.toUpperCase()})</span></p>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-xs hover:bg-rose-600 transition-all shadow-lg">SIGN OUT</button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-12">
                <div className="mb-14">
                    <h1 className="text-7xl font-black tracking-tighter mb-4 uppercase">Choose Cot<span className="text-indigo-600">.</span></h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] italic">Instant allocation system </p>
                </div>

                {/* Filters */}
                {!(role === 'student' && myAllocatedRoom) && (
                    <div className="bg-white p-3 rounded-[3.5rem] shadow-2xl border mb-16 flex flex-wrap gap-4 items-center">
                        <select value={filterFloor} onChange={e => setFilterFloor(e.target.value)} className="flex-1 p-5 bg-slate-50 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest outline-none hover:bg-white transition-all text-center appearance-none cursor-pointer"><option value="">All Floors</option><option value="1">Floor 1</option><option value="2">Floor 2</option><option value="3">Floor 3</option></select>
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="flex-1 p-5 bg-slate-50 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest outline-none hover:bg-white transition-all text-center appearance-none cursor-pointer"><option value="">All Layouts</option><option value="Single">Single</option><option value="Double">Double</option></select>
                        <input type="number" placeholder="BUDGET MAX (₹)" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} className="flex-1 p-5 bg-slate-50 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest outline-none text-center placeholder:text-slate-300" />
                        {role === 'admin' && <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase shadow-xl hover:bg-slate-900 transition-all">+ Add Unit</button>}
                    </div>
                )}

                {role === 'admin' ? (
                    <div className="space-y-12">
                        {/* INVENTORY */}
                        <div className="animate-in fade-in duration-500">
                            <button onClick={() => setShowAvailableSec(!showAvailableSec)} className="w-full flex justify-between bg-white p-10 rounded-[4rem] shadow-xl font-black text-2xl uppercase items-center border hover:border-indigo-100 transition-all">
                                <span>Available Inventory ({applyFilters(rooms.filter(r => r.occupiedBy.length < r.capacity)).length})</span>
                                <span>{showAvailableSec ? '▲' : '▼'}</span>
                            </button>
                            {showAvailableSec && <div className="shadow-xl font-black text-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">{applyFilters(rooms.filter(r => r.occupiedBy.length < r.capacity)).map(r => <RoomCard key={r._id} room={r} />)}</div>}
                        </div>
                        {/* FULLY BOOKED */}
                        <div className="animate-in fade-in duration-700">
                            <button onClick={() => setShowBookedSec(!showBookedSec)} className="w-full flex justify-between bg-white p-10 rounded-[4rem] shadow-xl font-black text-2xl uppercase items-center border hover:border-indigo-100 transition-all">
                                <span>Fully Occupied Units ({applyFilters(rooms.filter(r => r.occupiedBy.length === r.capacity)).length})</span>
                                <span>{showBookedSec ? '▲' : '▼'}</span>
                            </button>
                            {showBookedSec && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">{applyFilters(rooms.filter(r => r.occupiedBy.length === r.capacity)).map(r => <RoomCard key={r._id} room={r} />)}</div>}
                        </div>
                    </div>
                ) : (
                    /* STUDENT VIEW */
                    <div className="animate-in fade-in duration-500">
                        {myAllocatedRoom ? (
                            <div className="max-w-xl mx-auto text-center mt-10 zoom-in animate-in">
                                <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter uppercase underline decoration-indigo-500 decoration-8 underline-offset-[12px]">My Allocation</h2>
                                <RoomCard room={myAllocatedRoom} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{applyFilters(rooms).map(r => <RoomCard key={r._id} room={r} />)}</div>
                        )}
                    </div>
                )}
            </main>

            {/* Profile Setup Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 z-[200]">
                    <div className="bg-white rounded-[4rem] p-16 max-w-lg w-full text-center shadow-2xl relative border-t-8 border-indigo-600">
                        <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase italic">Identity Setup</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await axios.post(`${API_BASE}/auth/update-profile`, { userId, ...profileData });
                            localStorage.setItem('user', JSON.stringify(res.data.user));
                            setShowProfileModal(false);
                        }} className="space-y-4">
                            <input type="text" placeholder="FULL NAME" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center text-lg focus:ring-4 focus:ring-indigo-100" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                            <input type="text" placeholder="PHONE NUMBER" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center text-lg focus:ring-4 focus:ring-indigo-100" onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})} />
                            <input type="text" placeholder="ACADEMIC YEAR" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center text-lg focus:ring-4 focus:ring-indigo-100" onChange={e => setProfileData({...profileData, year: e.target.value})} />
                            <button className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-[0.3em] shadow-2xl mt-8 hover:bg-indigo-600 transition-all">Verify & Enter</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-6 z-100">
                    <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md p-14 relative">
                        <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter uppercase italic">New Entry</h2>
                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <input type="text" placeholder="ROOM ID" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center" onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="FLOOR" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center" onChange={e => setNewRoom({...newRoom, floor: e.target.value})} />
                                <select className="w-full p-6 bg-slate-50 rounded-[2.5rem] font-black outline-none bg-white cursor-pointer text-center appearance-none" onChange={e => setNewRoom({...newRoom, type: e.target.value})}><option value="Single">Single</option><option value="Double">Double</option></select>
                            </div>
                            <input type="number" placeholder="RATE (₹)" required className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none font-black text-center" onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="flex-1 bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl">SAVE</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white text-slate-300 border border-slate-100 py-6 rounded-[2.5rem] font-black uppercase">EXIT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Dashboard;