import React, { useState, useEffect, useMemo } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { trackLead, trackInitiateCheckout } from '../../utils/metaPixel';

const PackageCalculator = () => {
    // State
    const [cameras, setCameras] = useState(1);
    const [reels, setReels] = useState(5);
    const [fullLength, setFullLength] = useState(0);
    const [posters, setPosters] = useState(0);
    const [sameShoot, setSameShoot] = useState(true);

    // Calculation Logic
    const { total, shootHours, fullLengthDuration } = useMemo(() => {
        let totalShootHours = 0;
        let totalShootCost = 0;
        let totalReelCost = 0;
        let totalFullLengthCost = 0;
        let totalPosterCost = 0;

        // 1. Calculate Total Shoot Hours
        // 1 hour for every 2 reels, rounded up
        let reelShootHours = Math.ceil(reels / 2);

        let fullLengthShootHours = 0;
        if (fullLength > 0 && !sameShoot) {
            // 1 hour for every 2 full length videos, rounded up
            fullLengthShootHours = Math.ceil(fullLength / 2);
        }

        totalShootHours = reelShootHours + fullLengthShootHours;

        // 1b. Apply New Minimum Shoot Time Rule
        if (fullLength > 0) {
            const totalFullLengthDurationMins = fullLength * 15;
            const minShootTimeMins = totalFullLengthDurationMins + 30;
            const minShootTimeHours = Math.ceil(minShootTimeMins / 60);
            totalShootHours = Math.max(totalShootHours, minShootTimeHours);
        }

        // 2. Calculate Total Shoot Cost
        if (totalShootHours > 0) {
            if (cameras === 1) {
                totalShootCost = 1500 + Math.max(0, totalShootHours - 1) * 1000;
            } else if (cameras === 2) {
                totalShootCost = 2500 + Math.max(0, totalShootHours - 1) * 2000;
            } else if (cameras === 3) {
                totalShootCost = 3500; // 1st hour
                if (totalShootHours > 1) totalShootCost += 3500; // 2nd hour
                if (totalShootHours > 2) totalShootCost += (totalShootHours - 2) * 2500; // 3rd+ hours
            }
        }

        // 3. Calculate Reel Cost
        const reelRate = (cameras === 3) ? 4500 : 3500;
        totalReelCost = reels * reelRate;

        // 4. Calculate Full Length Video Cost
        if (fullLength > 0) {
            let editRate = 1500; // 1 cam
            if (cameras === 2) editRate = 2500;
            if (cameras === 3) editRate = 3500;
            totalFullLengthCost = fullLength * editRate;
        }

        // 5. Calculate Poster Cost
        totalPosterCost = posters * 500;

        const total = totalShootCost + totalReelCost + totalFullLengthCost + totalPosterCost;

        return {
            total,
            shootHours: totalShootHours,
            fullLengthDuration: fullLength * 15
        };
    }, [cameras, reels, fullLength, posters, sameShoot]);

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

    const handleBookPackage = () => {
        // Track conversion events
        trackInitiateCheckout({
            name: 'Monthly Package',
            category: 'package',
            numItems: reels + fullLength + posters,
            value: total,
            currency: 'INR',
        });

        trackLead({
            name: 'Monthly Package',
            category: 'package',
            value: total,
            currency: 'INR',
        });

        // You can add WhatsApp integration or other booking flow here
        alert('Package booking feature - integrate with your booking system');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: Inputs */}
            <div className="lg:col-span-2 space-y-6">

                {/* Camera Setup */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <label className="block text-base font-bold text-white mb-4">1. Camera Setup</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                onClick={() => setCameras(num)}
                                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${cameras === num
                                    ? 'bg-primary text-black shadow-lg scale-105'
                                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {num === 1 ? 'Single Camera' : `${num} Cameras`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Package Details */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-8">

                    {/* Reels */}
                    <div className="flex justify-between items-center">
                        <div>
                            <label className="block text-base font-bold text-white">Reels (With Editing)</label>
                            <p className="text-xs text-gray-500">Min 5 reels required</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setReels(Math.max(5, reels - 1))}
                                className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                            >
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <span className="text-2xl font-bold text-primary w-8 text-center">{reels}</span>
                            <button
                                onClick={() => setReels(reels + 1)}
                                className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <hr className="border-zinc-800" />

                    {/* Full Length Videos */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="block text-base font-bold text-white">Full Length Videos (With Editing)</label>
                                <p className="text-xs text-gray-500">8-15 mins duration</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setFullLength(Math.max(0, fullLength - 1))}
                                    className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                                >
                                    <Minus size={18} strokeWidth={3} />
                                </button>
                                <span className="text-2xl font-bold text-primary w-8 text-center">{fullLength}</span>
                                <button
                                    onClick={() => setFullLength(fullLength + 1)}
                                    className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {fullLength > 0 && (
                            <div className="bg-black/30 p-4 rounded-lg border border-zinc-800/50 animate-slide-down">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Total Duration</span>
                                    <span className="text-primary font-mono">{fullLengthDuration} mins</span>
                                </div>

                                {reels > 4 && (
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sameShoot ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                            {sameShoot && <Check size={14} className="text-black" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={sameShoot}
                                            onChange={(e) => setSameShoot(e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                            Same video for reel and Full length video
                                        </span>
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-zinc-800" />

                    {/* Posters */}
                    <div className="flex justify-between items-center">
                        <label className="block text-base font-bold text-white">Posters</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPosters(Math.max(0, posters - 1))}
                                className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                            >
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <span className="text-2xl font-bold text-primary w-8 text-center">{posters}</span>
                            <button
                                onClick={() => setPosters(posters + 1)}
                                className="w-10 h-10 rounded-full bg-zinc-800 text-primary hover:bg-zinc-700 flex items-center justify-center"
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT: Estimation */}
            <div className="lg:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl sticky top-24">
                    <h3 className="text-lg font-bold text-white mb-6">Estimated Cost</h3>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                            <span className="text-gray-400">Allotted Shoot Time</span>
                            <span className="text-xl font-bold text-white">{shootHours} Hrs</span>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Total Estimation</span>
                            <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                {formatINR(total)}
                            </span>
                        </div>

                        <button
                            onClick={handleBookPackage}
                            className="w-full bg-primary hover:bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                        >
                            Book Package
                        </button>

                        <p className="text-xs text-center text-gray-500">
                            *Final price may vary based on specific requirements.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PackageCalculator;
