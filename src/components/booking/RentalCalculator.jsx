import React, { useState, useEffect, useMemo } from 'react';
import { Video, Mic, Plus, Minus, Trash2, MessageCircle, X, Calendar as CalendarIcon, Clock, AlertTriangle, Lock, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import Calendar from '../ui/Calendar';
import ClockPicker from '../ui/ClockPicker';
import { trackLead, trackInitiateCheckout } from '../../utils/metaPixel';


const PRICING = {
    video: {
        0: { rate: 1000, minHours: 3, desc: "Space Rental" },
        1: { rate: 1500, minHours: 1, desc: "Single Cam Setup" },
        2: { rate: 2500, minHours: 1, desc: "Two Cam Setup" },
        3: { rate: 3500, minHours: 2, desc: "Three Cam Setup" }
    },
    audio: { rate: 799, minHours: 1, desc: "Dubbing / VO" }
};

const WHATSAPP_NUMBER = "919994858927";

const RentalCalculator = () => {
    // Input State
    const [serviceType, setServiceType] = useState('video'); // 'video' | 'audio'
    const [cameras, setCameras] = useState(1);
    const [hours, setHours] = useState(1);

    // Cart State
    const [bookings, setBookings] = useState([]);

    // Modal & Time State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState(null); // Date object
    const [isSplitTiming, setIsSplitTiming] = useState(false);

    // Single Time State: "HH:MM" (24h)
    const [singleTime, setSingleTime] = useState('');

    // Split Time State: { [id]: "HH:MM" }
    const [splitTimes, setSplitTimes] = useState({});
    const [activeSessionId, setActiveSessionId] = useState(null); // For Split Time UI

    // Firebase State
    const [existingBookings, setExistingBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);

    // Fetch Bookings from Firebase
    useEffect(() => {
        const rentalsRef = ref(database, 'rentals');
        const unsubscribe = onValue(rentalsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedBookings = [];
            if (data) {
                Object.values(data).forEach(rental => {
                    if (rental.bookingSegments) {
                        rental.bookingSegments.forEach(segment => {
                            if (segment.date && segment.startTime && segment.endTime) {
                                loadedBookings.push({
                                    date: segment.date,
                                    start: segment.startTime, // "HH:MM" 24h format
                                    end: segment.endTime      // "HH:MM" 24h format
                                });
                            }
                        });
                    }
                });
            }
            setExistingBookings(loadedBookings);
            setIsLoadingBookings(false);
        });

        return () => unsubscribe();
    }, []);

    // Derived State for Input Validation
    const currentConfig = useMemo(() => {
        if (serviceType === 'video') {
            return PRICING.video[cameras];
        }
        return PRICING.audio;
    }, [serviceType, cameras]);

    // Reset hours when config changes to ensure minHours is met
    useEffect(() => {
        if (hours < currentConfig.minHours) {
            setHours(currentConfig.minHours);
        }
    }, [currentConfig, hours]);

    // Initialize split times when bookings change
    useEffect(() => {
        setSplitTimes(prev => {
            const newTimes = { ...prev };
            bookings.forEach(b => {
                if (!newTimes[b.id]) {
                    newTimes[b.id] = ''; // Default empty
                }
            });
            return newTimes;
        });

        // Set active session to first booking if not set
        if (bookings.length > 0 && !activeSessionId) {
            setActiveSessionId(bookings[0].id);
        }
    }, [bookings]);

    // --- LOGIC ---
    const getDiscountMultiplier = (hourIndex) => {
        if (hourIndex <= 2) return 1.0;
        if (hourIndex <= 4) return 0.9;
        if (hourIndex <= 7) return 0.85;
        return 0.8;
    };

    const calculateRangeRawCost = (startHourCount, duration, rate) => {
        let cost = 0;
        for (let i = 1; i <= duration; i++) {
            const currentHourIndex = startHourCount + i;
            cost += rate * getDiscountMultiplier(currentHourIndex);
        }
        return cost;
    };

    // Calculate Totals
    const { updatedBookings, grandTotal, totalSavings, totalHours } = useMemo(() => {
        let cumulativeHours = 0;
        let listTotalRaw = 0;
        let totalSavings = 0;
        let totalListHours = 0;

        const updated = bookings.map(b => {
            const rawCost = calculateRangeRawCost(cumulativeHours, b.hours, b.rate);
            const originalCost = b.hours * b.rate;
            const savings = originalCost - rawCost;

            cumulativeHours += b.hours;
            listTotalRaw += rawCost;
            totalSavings += savings;
            totalListHours += b.hours;

            return { ...b, displayCost: rawCost, savings };
        });

        return {
            updatedBookings: updated,
            grandTotal: Math.round(listTotalRaw),
            totalSavings,
            totalHours: totalListHours
        };
    }, [bookings]);

    // Preview Calculation
    const previewData = useMemo(() => {
        const rate = currentConfig.rate;
        const inputRawCost = calculateRangeRawCost(totalHours, hours, rate);
        const inputOriginalCost = hours * rate;
        const previewCost = Math.round(inputRawCost);
        const previewSavings = inputOriginalCost - previewCost;

        return { cost: previewCost, savings: previewSavings };
    }, [totalHours, hours, currentConfig]);

    // --- TIME HELPERS ---
    const addHoursToTime = (timeStr, hoursToAdd) => {
        if (!timeStr) return null;
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        date.setHours(date.getHours() + hoursToAdd);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDisplayTime = (timeStr) => {
        if (!timeStr) return '--:--';
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // --- AVAILABILITY CHECKER ---
    // Returns { isAvailable: boolean, reason: string }
    const checkSlotAvailability = (start24h, durationHrs, currentId = null) => {
        if (!start24h || !bookingDate) return { isAvailable: true, reason: '' };

        const end24h = addHoursToTime(start24h, durationHrs);

        // Fix: Use local date string for comparison to match Firebase data format (YYYY-MM-DD)
        const year = bookingDate.getFullYear();
        const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
        const day = String(bookingDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // 1. Check against Firebase Bookings
        for (const existing of existingBookings) {
            if (existing.date === dateStr) {
                // Overlap: (StartA < EndB) AND (EndA > StartB)
                if (start24h < existing.end && end24h > existing.start) {
                    return { isAvailable: false, reason: 'Booked' };
                }
            }
        }

        // 2. Check against other bookings in cart (for Split Time)
        if (isSplitTiming && currentId) {
            for (const b of bookings) {
                if (b.id === currentId) continue; // Skip self

                const otherStart = splitTimes[b.id];
                if (!otherStart) continue; // Skip unset

                const otherEnd = addHoursToTime(otherStart, b.hours);

                if (start24h < otherEnd && end24h > otherStart) {
                    return { isAvailable: false, reason: 'Overlap' };
                }
            }
        }

        return { isAvailable: true, reason: '' };
    };

    // Wrapper for ClockPicker to check availability
    const checkClockAvailability = (hour, minute, period, durationHrs, currentId) => {
        let h24 = hour;
        if (period === 'PM' && h24 !== 12) h24 += 12;
        if (period === 'AM' && h24 === 12) h24 = 0;

        const timeStr = `${h24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const { isAvailable } = checkSlotAvailability(timeStr, durationHrs, currentId);
        return isAvailable;
    };


    // --- HANDLERS ---
    const handleAddBooking = () => {
        const newBooking = {
            id: Date.now(),
            type: serviceType,
            desc: currentConfig.desc,
            details: serviceType === 'video' ? (cameras > 0 ? `${cameras} Camera(s)` : 'No Equipment') : 'Audio Booth',
            hours,
            rate: currentConfig.rate,
            mergeKey: serviceType === 'video' ? `video-${cameras}` : 'audio'
        };

        // Check if mergeable
        const existingIndex = bookings.findIndex(b => b.mergeKey === newBooking.mergeKey);
        if (existingIndex > -1) {
            const newBookings = [...bookings];
            newBookings[existingIndex].hours += hours;
            setBookings(newBookings);
        } else {
            setBookings([...bookings, newBooking]);
        }

        // Reset to defaults
        setHours(currentConfig.minHours);
    };

    const handleRemoveBooking = (id) => {
        const newBookings = bookings.filter(b => b.id !== id);
        setBookings(newBookings);
        if (activeSessionId === id && newBookings.length > 0) {
            setActiveSessionId(newBookings[0].id);
        }
    };

    const openModal = () => {
        if (bookings.length === 0) return;
        if (!bookingDate) {
            setBookingDate(new Date());
        }
        if (bookings.length > 0 && !activeSessionId) {
            setActiveSessionId(bookings[0].id);
        }
        setIsModalOpen(true);
    };

    const handleConfirmBooking = () => {
        if (!bookingDate) {
            alert("Please select a date.");
            return;
        }

        // Validate
        if (isSplitTiming) {
            for (const b of updatedBookings) {
                if (!splitTimes[b.id]) {
                    alert(`Please select a time for "${b.desc}".`);
                    return;
                }
            }
        } else {
            if (!singleTime) {
                alert("Please select a start time.");
                return;
            }
        }

        // Track conversion events
        trackInitiateCheckout({
            name: 'Studio Rental Booking',
            category: 'rental',
            numItems: updatedBookings.length,
            value: grandTotal,
            currency: 'INR',
        });

        trackLead({
            name: 'Studio Rental Booking',
            category: 'rental',
            value: grandTotal,
            currency: 'INR',
        });

        // Format Date
        const formattedDate = bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        let msg = `*STUDIO BOOKING REQUEST*\n\n`;
        msg += `*Date:* ${formattedDate}\n`;
        msg += `--------------------------------\n\n`;

        if (isSplitTiming) {
            updatedBookings.forEach((b, index) => {
                const startStr = splitTimes[b.id];
                const endStr = addHoursToTime(startStr, b.hours);
                const displayStart = formatDisplayTime(startStr);
                const displayEnd = formatDisplayTime(endStr);

                msg += `*${index + 1}. ${b.desc}*\n`;
                msg += `   Time: ${displayStart} - ${displayEnd} (${b.hours} hr${b.hours > 1 ? 's' : ''})\n`;
                msg += `   Cost: ${formatINR(Math.round(b.displayCost))}`;
                if (b.savings > 0) msg += `  _(Saved ${formatINR(b.savings)})_`;
                msg += `\n\n`;
            });
        } else {
            const startStr = singleTime;
            const endStr = addHoursToTime(startStr, totalHours);
            const displayStart = formatDisplayTime(startStr);
            const displayEnd = formatDisplayTime(endStr);

            msg += `*Time:* ${displayStart} - ${displayEnd}\n`;
            msg += `*Duration:* ${totalHours} hr${totalHours > 1 ? 's' : ''}\n\n`;
            msg += `*Session Details:*\n`;

            updatedBookings.forEach(b => {
                msg += `- ${b.desc}`;
                msg += ` : ${formatINR(Math.round(b.displayCost))}`;
                if (b.savings > 0) msg += ` _(Saved ${formatINR(b.savings)})_`;
                msg += `\n`;
            });
            msg += `\n`;
        }

        msg += `--------------------------------\n`;
        msg += `*GRAND TOTAL: ${formatINR(grandTotal)}*`;
        if (totalSavings > 0) msg += `\n*Total Savings: ${formatINR(totalSavings)}*`;
        msg += `\n--------------------------------\n`;
        msg += `\nPlease confirm availability.`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        setIsModalOpen(false);
    };

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

            {/* LEFT: Configuration */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">Configure Session</h2>

                    {/* Tabs */}
                    <div className="flex p-1 bg-zinc-800 rounded-xl mb-8">
                        <button
                            onClick={() => setServiceType('video')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${serviceType === 'video' ? 'bg-primary text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Video size={18} /> Video
                        </button>
                        <button
                            onClick={() => setServiceType('audio')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${serviceType === 'audio' ? 'bg-primary text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Mic size={18} /> Audio
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">

                        {/* Camera Stepper (Video Only) */}
                        {serviceType === 'video' && (
                            <div className="flex-1 flex flex-col items-center">
                                <label className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Cameras</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCameras(Math.max(0, cameras - 1))}
                                        disabled={cameras <= 0}
                                        className="w-12 h-12 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                    >
                                        <Minus size={20} strokeWidth={3} />
                                    </button>
                                    <span className="text-4xl font-bold text-white w-12 text-center">{cameras}</span>
                                    <button
                                        onClick={() => setCameras(Math.min(3, cameras + 1))}
                                        disabled={cameras >= 3}
                                        className="w-12 h-12 rounded-full bg-primary text-black hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center transition-colors"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-gray-400 font-medium">{currentConfig.desc}</p>
                                {cameras > 0 && <p className="text-xs text-primary mt-1">Includes: 4K Cam, Mics, Lights & Tech</p>}
                            </div>
                        )}

                        {/* Hours Stepper */}
                        <div className="flex-1 flex flex-col items-center">
                            <label className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Hours</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setHours(Math.max(currentConfig.minHours, hours - 1))}
                                    disabled={hours <= currentConfig.minHours}
                                    className="w-12 h-12 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                >
                                    <Minus size={20} strokeWidth={3} />
                                </button>
                                <span className="text-4xl font-bold text-white w-12 text-center">{hours}</span>
                                <button
                                    onClick={() => setHours(hours + 1)}
                                    className="w-12 h-12 rounded-full bg-primary text-black hover:bg-yellow-400 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-500">Min {currentConfig.minHours} hr{currentConfig.minHours > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddBooking}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg flex justify-between px-6 items-center transition-all transform active:scale-[0.99] group"
                    >
                        <span className="text-lg">Add to Bookings</span>
                        <div className="flex items-center gap-3">
                            {previewData.savings > 0 && (
                                <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-extrabold uppercase animate-pulse">
                                    Save {formatINR(previewData.savings)}
                                </span>
                            )}
                            <span className="bg-black/20 px-3 py-1 rounded-lg font-mono text-xl">
                                {formatINR(previewData.cost)}
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* RIGHT: Summary */}
            <div className="lg:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Bookings</h2>
                        {bookings.length > 0 && (
                            <button onClick={() => setBookings([])} className="text-xs text-red-400 hover:text-red-300 underline">
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="flex-grow space-y-3 mb-6 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                        {updatedBookings.length === 0 ? (
                            <div className="h-32 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl text-gray-500 text-sm">
                                No sessions added yet.
                            </div>
                        ) : (
                            updatedBookings.map(b => (
                                <div key={b.id} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 flex justify-between items-center group">
                                    <div>
                                        <div className="font-bold text-white text-sm">{b.desc}</div>
                                        <div className="text-xs text-gray-400">{b.hours} hrs • {b.details}</div>
                                        {b.savings > 0 && <div className="text-[10px] text-green-400 font-medium">Saved {formatINR(b.savings)}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">{formatINR(Math.round(b.displayCost))}</div>
                                        <button
                                            onClick={() => handleRemoveBooking(b.id)}
                                            className="text-[10px] text-red-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Totals */}
                    <div className="border-t border-zinc-800 pt-4 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Total Duration</span>
                            <span className="text-white font-medium">{totalHours} hrs</span>
                        </div>
                        {totalSavings > 0 && (
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-400">Total Savings</span>
                                <span className="text-green-400 font-bold">-{formatINR(totalSavings)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-6">
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Grand Total</span>
                            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                {formatINR(grandTotal)}
                            </span>
                        </div>

                        <button
                            onClick={openModal}
                            disabled={bookings.length === 0}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                        >
                            <MessageCircle size={20} />
                            Book on WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* BOOKING MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700 shrink-0">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CalendarIcon size={20} className="text-primary" /> Select Date & Time
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col md:flex-row h-full">

                                {/* LEFT: Calendar */}
                                <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-700 md:w-1/2 flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Date</label>
                                        {isLoadingBookings && <span className="flex items-center gap-1 text-xs text-primary"><Loader2 size={12} className="animate-spin" /> Checking...</span>}
                                    </div>
                                    <div className="flex-grow flex items-center justify-center">
                                        <Calendar
                                            selectedDate={bookingDate}
                                            onSelectDate={setBookingDate}
                                            className="w-full max-w-sm"
                                        />
                                    </div>
                                </div>

                                {/* RIGHT: Time Selection */}
                                <div className="p-6 md:w-1/2 flex flex-col bg-zinc-950/30">
                                    {/* Split Timing Toggle */}
                                    <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg border border-zinc-800 mb-6">
                                        <span className="text-sm text-gray-300 font-medium">Split Timing for Sessions?</span>
                                        <button
                                            onClick={() => setIsSplitTiming(!isSplitTiming)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isSplitTiming ? 'bg-primary' : 'bg-zinc-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isSplitTiming ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex-grow flex flex-col items-center">
                                        {isSplitTiming ? (
                                            // SPLIT TIMING UI
                                            <div className="w-full flex flex-col h-full">
                                                {/* Session List */}
                                                <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 mb-4 pr-2 custom-scrollbar">
                                                    {updatedBookings.map((b, idx) => {
                                                        const isActive = activeSessionId === b.id;
                                                        const timeSet = splitTimes[b.id];
                                                        const endTime = addHoursToTime(timeSet, b.hours);

                                                        return (
                                                            <button
                                                                key={b.id}
                                                                onClick={() => setActiveSessionId(b.id)}
                                                                className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center group ${isActive ? 'bg-zinc-800 border-primary shadow-md' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                                                            >
                                                                <div>
                                                                    <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                                        {idx + 1}. {b.desc}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{b.hours} hrs</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    {timeSet ? (
                                                                        <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                                            {formatDisplayTime(timeSet)} - {formatDisplayTime(endTime)}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-xs text-gray-600 italic">Set Time</div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Active Clock */}
                                                {activeSessionId && (
                                                    <div className="flex flex-col items-center border-t border-zinc-800 pt-4">
                                                        <ClockPicker
                                                            value={splitTimes[activeSessionId]}
                                                            onChange={(val) => setSplitTimes(prev => ({ ...prev, [activeSessionId]: val }))}
                                                            checkAvailability={(h, m, p) => {
                                                                const session = updatedBookings.find(b => b.id === activeSessionId);
                                                                return session ? checkClockAvailability(h, m, p, session.hours, activeSessionId) : false;
                                                            }}
                                                        />
                                                        {splitTimes[activeSessionId] && (() => {
                                                            const session = updatedBookings.find(b => b.id === activeSessionId);
                                                            if (!session) return null;
                                                            const { isAvailable } = checkSlotAvailability(splitTimes[activeSessionId], session.hours, activeSessionId);
                                                            return !isAvailable ? (
                                                                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                                                                    <AlertTriangle size={14} />
                                                                    <span>Selected time is unavailable.</span>
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // SINGLE TIMING UI
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="mb-6 text-center">
                                                    <h4 className="text-sm font-bold text-white mb-1">Select Start Time</h4>
                                                    <p className="text-xs text-gray-400 mb-3">Duration: {totalHours} hrs</p>

                                                    {singleTime ? (
                                                        <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                                                            <span className="text-xl font-bold text-white">{formatDisplayTime(singleTime)}</span>
                                                            <span className="text-gray-500"><ChevronRight size={16} /></span>
                                                            <span className="text-xl font-bold text-primary">{formatDisplayTime(addHoursToTime(singleTime, totalHours))}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500 italic">--:-- to --:--</div>
                                                    )}
                                                </div>

                                                <ClockPicker
                                                    value={singleTime}
                                                    onChange={setSingleTime}
                                                    checkAvailability={(h, m, p) => checkClockAvailability(h, m, p, totalHours)}
                                                />

                                                {singleTime && !checkSlotAvailability(singleTime, totalHours).isAvailable && (
                                                    <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                                                        <AlertTriangle size={14} />
                                                        <span>Selected time is unavailable. Please choose another.</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-zinc-800 border-t border-zinc-700 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-zinc-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg transition-all flex items-center gap-2"
                            >
                                <MessageCircle size={18} /> Confirm & Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RentalCalculator;
