import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // --- 1. STATES ---
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', floor: '', type: 'Single', price: '' });
    
    // Filters
    const [filterFloor, setFilterFloor] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');

    // Admin Toggles
    const [showPendingSec, setShowPendingSec] = useState(true);
    const [showAvailableSec, setShowAvailableSec] = useState(false);
    const [showOccupiedSec, setShowOccupiedSec] = useState(true);

    const navigate = useNavigate();

    // --- 2. LOAD DATA ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
            navigate('/login');
        } else {
            setRole(userRole);
            setUserId(userData.id);
            setUserName(userData.name);
            fetchRooms();
        }
    }, [navigate]);

    const fetchRooms = async () => {
        try {
            const res = await axios.get('http://10.10.174.49:5000/api/rooms/all');
            setRooms(res.data);
        } catch (err) {
            console.error("Error fetching rooms", err);
        }
    };

    // --- 3. LOGIC ---
    const getFilteredList = (list) => {
        return list.filter((r) => {
            return (filterFloor === '' || r.floor.toString() === filterFloor) &&
                   (filterType === '' || r.type === filterType) &&
                   (filterMaxPrice === '' || r.price <= parseInt(filterMaxPrice));
        });
    };

    const isAllocatedToMe = (room) => room.occupiedBy.some(u => u._id === userId);
    const myAllocatedRoom = rooms.find(r => isAllocatedToMe(r));
    
    // Logic for Admin Sections
    const rawPending = rooms.filter(r => r.pendingUsers.length > 0 && r.status !== 'Occupied');
    const rawAvailable = rooms.filter(r => r.status === 'Available' && r.pendingUsers.length === 0);
    const rawOccupied = rooms.filter(r => r.occupiedBy.length > 0);

    const viewPending = getFilteredList(rawPending);
    const viewAvailable = getFilteredList(rawAvailable);
    const viewOccupied = getFilteredList(rawOccupied);
    const viewAllStudent = getFilteredList(rooms);

    const handleAction = async (url, body = {}) => {
        await axios.post(url, body);
        fetchRooms();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- 4. ROOM CARD ---
    const RoomCard = ({ room }) => {
        const isMyPending = room.pendingUsers.some(u => u._id === userId);
        const isMyRoom = isAllocatedToMe(room);
        const spotsLeft = room.capacity - room.occupiedBy.length;

        let cardBorder = "border-slate-100";
        let statusBadge = "bg-slate-100 text-slate-400";
        let statusText = "UNKNOWN";

        if (spotsLeft > 0) {
            cardBorder = "hover:border-emerald-200";
            statusBadge = "bg-emerald-50 text-emerald-600";
            statusText = "AVAILABLE";
        } else {
            cardBorder = "hover:border-rose-200";
            statusBadge = "bg-rose-50 text-rose-600";
            statusText = "FULL";
        }

        if (isMyRoom) { 
            cardBorder = "border-indigo-500 ring-4 ring-indigo-50"; 
            statusBadge = "bg-indigo-600 text-white";
            statusText = "MY ROOM";
        }

        return (
            <div className={`bg-white rounded-[3rem] p-8 border ${cardBorder} shadow-2xl shadow-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative group overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[3rem] -z-0"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${statusBadge}`}>
                                {statusText}
                            </span>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                                <span className="text-lg text-slate-400 mr-2">Room no.</span>{room.roomNumber}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Floor {room.floor} • {room.type} Cot</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{room.price}</p>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Per Month</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            <span>Capacity</span>
                            <span>{room.occupiedBy.length} / {room.capacity} Residents</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${spotsLeft === 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${(room.occupiedBy.length / room.capacity) * 100}%` }}></div>
                        </div>
                    </div>

                    {role === 'student' && (
                        <div>
                            {spotsLeft > 0 && !isMyPending && !isMyRoom && (
                                <button onClick={() => handleAction(`http://10.10.174.49:5000/api/rooms/apply/${room._id}`, { userId })} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">Request Booking</button>
                            )}
                            {isMyPending && <div className="p-5 bg-amber-50 text-amber-600 rounded-[2rem] text-center font-bold text-xs uppercase tracking-widest border border-amber-100">Pending Approval</div>}
                            {isMyRoom && <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[2rem] text-center font-bold text-xs uppercase tracking-widest border border-indigo-100">Access Granted</div>}
                            {spotsLeft === 0 && !isMyRoom && <div className="p-5 bg-slate-50 text-slate-300 rounded-[2rem] text-center font-bold text-xs uppercase tracking-widest">Unavailable</div>}
                        </div>
                    )}

                    {role === 'admin' && (
                        <div className="space-y-4 pt-6 border-t border-slate-50">
                            {room.pendingUsers.length > 0 && (
                                <div className="bg-amber-50/50 p-5 rounded-[2rem] border border-amber-100">
                                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-4">Action Required</p>
                                    {room.pendingUsers.map(student => (
                                        <div key={student._id} className="mb-4 last:mb-0">
                                            <div className="flex justify-between items-center mb-3">
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm">{student.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Year: {student.year || "N/A"} •Phone: {student.phoneNumber || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAction(`http://10.10.174.49:5000/api/rooms/approve/${room._id}`, { userId: student._id })} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-emerald-600">Approve</button>
                                                <button onClick={() => handleAction(`http://10.10.174.49:5000/api/rooms/decline/${room._id}`, { userId: student._id })} className="flex-1 bg-white text-rose-500 border border-rose-100 py-2 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-rose-50">Decline</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {room.occupiedBy.length > 0 && (
                                <div className="bg-slate-50 p-5 rounded-[2rem]">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Residents</p>
                                    <div className="space-y-2">
                                        {room.occupiedBy.map(resident => (
                                            <div key={resident._id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">{resident.name?.charAt(0)}</div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-slate-800">{resident.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400">Year: {resident.year || "Yr N/A"} • Phone: {resident.phoneNumber || "N/A"}</p>
                                                </div>
                                                {/* CANCEL BUTTON ADDED HERE */}
                                                <button 
                                                    onClick={() => handleAction(`http://10.10.174.49:5000/api/rooms/cancel/${room._id}`, { userId: resident._id })}
                                                    className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100 text-slate-900">
            <nav className="sticky top-4 z-50 mx-4 md:mx-8 mb-8">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/40 rounded-[2rem] px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm">SH</div>
                        <span className="hidden md:block font-black text-slate-900 tracking-tighter text-xl">SMART<span className="text-indigo-600">HOSTEL</span></span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="text-right hidden sm:block">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Logged In As</p>
                            <p className="text-sm font-black text-slate-800">{userName}</p>
                        </div>
                        <button onClick={handleLogout} className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Sign Out</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">
                        {role === 'admin' ? 'Management' : 'Find Your Space'}<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                        {role === 'admin' ? 'Overview & Controls' : 'Browse Available Accommodations'}
                    </p>
                </div>

                {!(role === 'student' && myAllocatedRoom) && (
                    <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 mb-16 flex flex-wrap gap-2 max-w-5xl">
                        <select value={filterFloor} onChange={e => setFilterFloor(e.target.value)} className="flex-1 bg-transparent p-4 text-sm font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-50 rounded-[2rem] text-center appearance-none min-w-[120px]">
                            <option value="">All Floors</option><option value="1">Floor 1</option><option value="2">Floor 2</option><option value="3">Floor 3</option>
                        </select>
                        <div className="w-px bg-slate-100 my-4 hidden sm:block"></div>
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="flex-1 bg-transparent p-4 text-sm font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-50 rounded-[2rem] text-center appearance-none min-w-[120px]">
                            <option value="">All Types</option><option value="Single">Single Cot</option><option value="Double">Double Cot</option>
                        </select>
                        <div className="w-px bg-slate-100 my-4 hidden sm:block"></div>
                        <input type="number" placeholder="Max Budget (₹)" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} className="flex-1 bg-transparent p-4 text-sm font-bold text-slate-600 outline-none text-center placeholder:text-slate-400 min-w-[140px]" />
                        <button onClick={() => {setFilterFloor(''); setFilterType(''); setFilterMaxPrice('');}} className="bg-slate-100 text-slate-500 px-8 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Reset</button>
                        
                        {role === 'admin' && (
                            <>
                                <div className="w-px bg-slate-100 my-4 hidden sm:block"></div>
                                <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-indigo-200">+ Add Unit</button>
                            </>
                        )}
                    </div>
                )}

                {role === 'admin' ? (
                    <div className="space-y-8">
                        <div className="group">
                            <button onClick={() => setShowPendingSec(!showPendingSec)} className="w-full flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-white hover:border-amber-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${viewPending.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300'}`}>⚠️</div>
                                    <div className="text-left">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Action Required</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewPending.length} Requests</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center transition-transform ${showPendingSec ? 'rotate-180' : ''}`}>▼</div>
                            </button>
                            {showPendingSec && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pl-4">
                                    {viewPending.length > 0 ? viewPending.map(r => <RoomCard key={r._id} room={r} />) : <p className="text-slate-300 font-bold italic pl-4">All clear. No pending requests.</p>}
                                </div>
                            )}
                        </div>

                        <div className="group">
                            <button onClick={() => setShowAvailableSec(!showAvailableSec)} className="w-full flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-white hover:border-emerald-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">✨</div>
                                    <div className="text-left">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inventory</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewAvailable.length} Units Open</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center transition-transform ${showAvailableSec ? 'rotate-180' : ''}`}>▼</div>
                            </button>
                            {showAvailableSec && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pl-4">
                                    {viewAvailable.length > 0 ? viewAvailable.map(r => <RoomCard key={r._id} room={r} />) : <p className="text-slate-300 font-bold italic pl-4">No available rooms match.</p>}
                                </div>
                            )}
                        </div>

                        <div className="group">
                            <button onClick={() => setShowOccupiedSec(!showOccupiedSec)} className="w-full flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-white hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl">👥</div>
                                    <div className="text-left">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resident Log</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewOccupied.length} Active Stays</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center transition-transform ${showOccupiedSec ? 'rotate-180' : ''}`}>▼</div>
                            </button>
                            {showOccupiedSec && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pl-4">
                                    {viewOccupied.length > 0 ? viewOccupied.map(r => <RoomCard key={r._id} room={r} />) : <p className="text-slate-300 font-bold italic">No occupied rooms match.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        {myAllocatedRoom ? (
                            <div className="max-w-xl mx-auto mt-10">
                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase underline decoration-indigo-500 decoration-4">My Allocation</h2>
                                </div>
                                <RoomCard room={myAllocatedRoom} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {viewAllStudent.map(r => <RoomCard key={r._id} room={r} />)}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Add Unit</h2>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">Update Inventory</p>
                        
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await axios.post('http://10.10.174.49:5000/api/rooms/add', newRoom);
                            setShowModal(false); fetchRooms();
                        }} className="space-y-4">
                            <input type="text" placeholder="Room Number (e.g. 101)" required className="w-full p-5 bg-slate-50 rounded-[2rem] outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition" onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Floor" required className="w-full p-5 bg-slate-50 rounded-[2rem] outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition" onChange={e => setNewRoom({...newRoom, floor: e.target.value})} />
                                <select className="w-full p-5 bg-slate-50 rounded-[2rem] outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition appearance-none" onChange={e => setNewRoom({...newRoom, type: e.target.value})}>
                                    <option value="Single">Single</option><option value="Double">Double</option>
                                </select>
                            </div>
                            <input type="number" placeholder="Price (₹)" required className="w-full p-5 bg-slate-50 rounded-[2rem] outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition" onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
                            
                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-xl">Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white text-slate-400 border border-slate-200 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-50 transition">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;