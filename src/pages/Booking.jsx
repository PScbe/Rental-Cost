import React, { useState } from 'react';
import RentalCalculator from '../components/booking/RentalCalculator';
import PackageCalculator from '../components/booking/PackageCalculator';

const Booking = () => {
    const [activeTab, setActiveTab] = useState('rental');

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Book Your Session</h1>
                <p className="text-gray-400">Choose between hourly studio rental or value-packed monthly packages.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-12">
                <div className="bg-zinc-900 p-1 rounded-xl inline-flex border border-zinc-800">
                    <button
                        onClick={() => setActiveTab('rental')}
                        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'rental'
                            ? 'bg-primary text-black shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Hourly Rental
                    </button>
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'packages'
                            ? 'bg-primary text-black shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Monthly Packages - With Editing
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-slide-down">
                {activeTab === 'rental' ? <RentalCalculator /> : <PackageCalculator />}
            </div>
        </div>
    );
};

export default Booking;
