import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Mic, ArrowRight, Star, CheckCircle, Calendar } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-20 pb-20">

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient/Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black z-0">
                    {/* Custom studio background image */}
                    <div className="absolute inset-0 bg-[url('/studio-hero-bg.png')] bg-cover bg-center opacity-30"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-primary text-sm font-bold tracking-wider uppercase animate-slide-down">
                        Premium Studio Space in Coimbatore
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-slide-down" style={{ animationDelay: '0.1s' }}>
                        Create. Record. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Inspire.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-down" style={{ animationDelay: '0.2s' }}>
                        Professional video production floor and dubbing suite equipped with 4K cameras, cinema-grade lighting, and expert technician support.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-down" style={{ animationDelay: '0.3s' }}>
                        <Link to="/booking" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-yellow-400 text-black font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2">
                            Book Studio Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to create professional content, under one roof.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Video Rental */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-primary/50 transition-all group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                            <Video className="text-primary group-hover:text-black transition-colors" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Video Studio Rental</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Spacious shooting floor with customizable sets. Includes 4K cameras (Sony FX30/A7IV), Godox lighting setup, and professional audio gear.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Multi-camera setup (1-3 cams)</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Technician included</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Chroma key & Black backdrops</span>
                            </li>
                        </ul>
                        <Link to="/booking" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Book Video Slot <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Audio/Dubbing */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-primary/50 transition-all group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                            <Mic className="text-primary group-hover:text-black transition-colors" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Dubbing Suite</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Acoustically treated soundproof booth for crystal clear voiceovers, dubbing, and podcast recording. Industry-standard microphones and monitoring.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Lewitt PURE Tube</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Logic Pro with apollo X6</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-primary" /> <span>Sound engineer support</span>
                            </li>
                        </ul>
                        <Link to="/booking" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Book Audio Slot <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features/Trust Section */}
            <section className="bg-zinc-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="flex justify-center mb-4 text-primary">
                                <Star size={40} fill="currentColor" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Premium Equipment</h4>
                            <p className="text-gray-400 text-sm">Latest cameras, lenses, and lights maintained in pristine condition.</p>
                        </div>
                        <div>
                            <div className="flex justify-center mb-4 text-primary">
                                <CheckCircle size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Expert Support</h4>
                            <p className="text-gray-400 text-sm">Our on-site technicians ensure your shoot runs smoothly without technical glitches.</p>
                        </div>
                        <div>
                            <div className="flex justify-center mb-4 text-primary">
                                <Calendar size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Flexible Booking</h4>
                            <p className="text-gray-400 text-sm">Book by the hour or choose monthly packages for regular content creation.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
