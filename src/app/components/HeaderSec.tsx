"use client"
import  { useState } from 'react';
import { Menu,X } from 'lucide-react';

const HeaderSec=()=>{
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return <div>
         <header className="fixed w-full top-0 z-50 bg-transparent">
                <nav className="max-w-screen-xl mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        <div className="text-2xl text-white font-bold">TECHREHUB</div>

                        {/* Desktop Navigation */}
                        <div className="text-white hidden md:flex space-x-8">
                            <a href="#services" className="hover:text-gray-600">Services</a>
                            <a href="#services" className="hover:text-gray-600">Corporate</a>
                            <a href="#about" className="hover:text-gray-600">About Us</a>
                            <a href="#contact-form" className="hover:text-gray-600">Contact</a>
                            <a href="/shop" className="hover:text-gray-600">Shop here</a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-white"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                   <div className="fixed inset-0 z-40 text-white bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-8">
                    <a className="text-2xl font-medium hover:text-gray-300" href="#" onClick={() => setIsMenuOpen(false)}>
                    Home
                 </a>
                 <a className="text-2xl font-medium hover:text-gray-300" href="#services" onClick={() => setIsMenuOpen(false)}>
                    Services
                 </a>
                <a className="text-2xl font-medium hover:text-gray-300" href="#about" onClick={() => setIsMenuOpen(false)}>
                 About
                </a>
                <a className="text-2xl font-medium hover:text-gray-300" href="#contact-form" onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                 </a>
                 <a className="text-2xl font-medium hover:text-gray-300" href="/shop" onClick={() => setIsMenuOpen(false)}>
                 Shop here
                 </a>
                 </div>
                )}
            </header>

    </div>
}
export default HeaderSec
