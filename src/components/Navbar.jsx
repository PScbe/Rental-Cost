import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Video, Mic, Calendar } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                                <span className="text-black font-bold text-xl">P</span>
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">Possible Studio</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link to="/services" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</Link>
                            <Link to="/booking" className="bg-primary text-black hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2">
                                <Calendar size={16} />
                                Book Now
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/services" className="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Services</Link>
                        <Link to="/booking" className="text-primary font-bold block px-3 py-2 rounded-md text-base" onClick={() => setIsOpen(false)}>Book Now</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
