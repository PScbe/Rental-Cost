import React from 'react';
import { Camera, Mic, Zap, Users } from 'lucide-react';

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">Our Equipment & Services</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    We provide industry-standard gear to ensure your production looks and sounds world-class.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Cameras */}
                <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <Camera className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Cameras & Lenses</h2>
                    </div>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Sony FX30 Cinema Line</span>
                            <span className="text-primary font-mono text-sm">4K 120p</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Sony A7 IV</span>
                            <span className="text-primary font-mono text-sm">33MP / 4K 60p</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Sony G Master Lenses</span>
                            <span className="text-primary font-mono text-sm">24-70mm, 85mm</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Tripods & Gimbals</span>
                            <span className="text-primary font-mono text-sm">DJI RS3</span>
                        </li>
                    </ul>
                </div>

                {/* Audio */}
                <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <Mic className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Audio Gear</h2>
                    </div>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Sennheiser MKH 416</span>
                            <span className="text-primary font-mono text-sm">Shotgun Mic</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Shure SM7B</span>
                            <span className="text-primary font-mono text-sm">Podcast Mic</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Rode Wireless Pro</span>
                            <span className="text-primary font-mono text-sm">Lavalier</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Zoom F6 Field Recorder</span>
                            <span className="text-primary font-mono text-sm">32-bit Float</span>
                        </li>
                    </ul>
                </div>

                {/* Lighting */}
                <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <Zap className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Lighting</h2>
                    </div>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Godox VL150 / VL300</span>
                            <span className="text-primary font-mono text-sm">Key Lights</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Aputure Amaran RGB</span>
                            <span className="text-primary font-mono text-sm">Accent Lights</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Softboxes & Grids</span>
                            <span className="text-primary font-mono text-sm">Modifiers</span>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <Users className="text-primary" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Studio Support</h2>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        Every booking comes with a dedicated studio technician to help you set up lights, audio, and cameras. We ensure you spend your time creating, not troubleshooting.
                    </p>
                    <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-white font-bold mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300">High-Speed WiFi</span>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300">Makeup Area</span>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300">Changing Room</span>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300">Air Conditioning</span>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300">Power Backup</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Services;
