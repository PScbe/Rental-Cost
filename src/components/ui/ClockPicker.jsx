import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ClockPicker = ({
    value, // "HH:MM" 24h format
    onChange,
    checkAvailability, // (hour, minute, period) => boolean
    className
}) => {
    const [view, setView] = useState('hours'); // 'hours' | 'minutes'
    const [period, setPeriod] = useState('AM'); // 'AM' | 'PM'
    const [selectedHour, setSelectedHour] = useState(10);
    const [selectedMinute, setSelectedMinute] = useState(0);

    // Parse initial value
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            let p = 'AM';
            let hour12 = h;

            if (h >= 12) {
                p = 'PM';
                if (h > 12) hour12 = h - 12;
            }
            if (h === 0) hour12 = 12;

            setPeriod(p);
            setSelectedHour(hour12);
            setSelectedMinute(m);
        }
    }, [value]);

    const handleHourClick = (h) => {
        setSelectedHour(h);
        setView('minutes');
    };

    const handleMinuteClick = (m) => {
        setSelectedMinute(m);
        // Construct 24h time string
        let h24 = selectedHour;
        if (period === 'PM' && h24 !== 12) h24 += 12;
        if (period === 'AM' && h24 === 12) h24 = 0;

        const timeStr = `${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        onChange(timeStr);
    };

    const handlePeriodChange = (p) => {
        setPeriod(p);
        // Update parent immediately if we have a full time
        let h24 = selectedHour;
        if (p === 'PM' && h24 !== 12) h24 += 12;
        if (p === 'AM' && h24 === 12) h24 = 0;
        const timeStr = `${h24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        onChange(timeStr);
    };

    // Render Clock Face
    const renderClockFace = () => {
        const items = [];
        const radius = 70; // Reduced from 90
        const center = 96; // Reduced from 128 (half of w-48)

        if (view === 'hours') {
            for (let i = 1; i <= 12; i++) {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);

                // Check availability (rough check: is ANY minute in this hour available?)
                // We'll just check the hour block generally or specific :00
                // Ideally, we check if the hour is completely blocked.
                // For simplicity, let's check if 00, 15, 30, 45 are ALL blocked.
                let isAvailable = false;
                if (checkAvailability) {
                    isAvailable = [0, 15, 30, 45].some(m => checkAvailability(i, m, period));
                } else {
                    isAvailable = true;
                }

                const isSelected = selectedHour === i;

                items.push(
                    <button
                        key={i}
                        disabled={!isAvailable}
                        onClick={() => handleHourClick(i)}
                        style={{ left: x, top: y }}
                        className={cn(
                            "absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            isSelected ? "bg-primary text-black shadow-md z-10" : "text-gray-400 hover:bg-zinc-800",
                            !isAvailable && "text-red-900/50 line-through decoration-red-900/50 bg-red-900/10 cursor-not-allowed hover:bg-red-900/10"
                        )}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Minutes: 00, 15, 30, 45
            const minutes = [0, 15, 30, 45];
            minutes.forEach((m, i) => {
                // Position at 12, 3, 6, 9 o'clock positions basically
                // 0 -> -90deg (12 o'clock)
                // 15 -> 0deg (3 o'clock)
                // 30 -> 90deg (6 o'clock)
                // 45 -> 180deg (9 o'clock)
                const angle = (m * 6 - 90) * (Math.PI / 180);
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);

                let isAvailable = true;
                if (checkAvailability) {
                    isAvailable = checkAvailability(selectedHour, m, period);
                }

                const isSelected = selectedMinute === m;

                items.push(
                    <button
                        key={m}
                        disabled={!isAvailable}
                        onClick={() => handleMinuteClick(m)}
                        style={{ left: x, top: y }}
                        className={cn(
                            "absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            isSelected ? "bg-primary text-black shadow-md z-10" : "text-gray-400 hover:bg-zinc-800",
                            !isAvailable && "text-red-900/50 line-through decoration-red-900/50 bg-red-900/10 cursor-not-allowed hover:bg-red-900/10"
                        )}
                    >
                        {m.toString().padStart(2, '0')}
                    </button>
                );
            });

            // Add center dot
            items.push(
                <div key="center" className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-0.75 -mt-0.75 bg-primary rounded-full" />
            );

            // Add hand (visual only, pointing to selected)
            // ... skipping complex hand drawing for simplicity, the selected bubble is enough
        }

        return items;
    };

    return (
        <div className={cn("flex flex-col items-center", className)}>
            {/* Digital Display / Toggles */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-end gap-0.5">
                    <button
                        onClick={() => setView('hours')}
                        className={cn("text-3xl font-bold transition-colors", view === 'hours' ? "text-primary" : "text-gray-600 hover:text-gray-400")}
                    >
                        {selectedHour.toString().padStart(2, '0')}
                    </button>
                    <span className="text-3xl font-bold text-zinc-700 mb-1">:</span>
                    <button
                        onClick={() => setView('minutes')}
                        className={cn("text-3xl font-bold transition-colors", view === 'minutes' ? "text-primary" : "text-gray-600 hover:text-gray-400")}
                    >
                        {selectedMinute.toString().padStart(2, '0')}
                    </button>
                </div>
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={() => handlePeriodChange('AM')}
                        className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors", period === 'AM' ? "bg-primary text-black" : "bg-zinc-800 text-gray-600 hover:text-gray-400")}
                    >
                        AM
                    </button>
                    <button
                        onClick={() => handlePeriodChange('PM')}
                        className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors", period === 'PM' ? "bg-primary text-black" : "bg-zinc-800 text-gray-600 hover:text-gray-400")}
                    >
                        PM
                    </button>
                </div>
            </div>

            {/* Clock Face */}
            <div className="relative w-48 h-48 bg-zinc-900/50 rounded-full border-2 border-zinc-800">
                {renderClockFace()}
            </div>

            <div className="mt-2 text-[10px] text-gray-600 uppercase tracking-wider">
                {view === 'hours' ? 'Select Hour' : 'Select Minute'}
            </div>
        </div>
    );
};

export default ClockPicker;
