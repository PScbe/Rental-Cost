import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Possible Studio</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium video production and dubbing studio in Coimbatore.
                            Professional equipment, sound-treated spaces, and expert support.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <span>+91 99948 58927</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                <span>hello@possiblestudio.in</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                                <span>Coimbatore, Tamil Nadu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/possiblestudioofficial/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <Instagram size={24} />
                            </a>
                            {/* Add more social icons as needed */}
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} Possible Studio. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
