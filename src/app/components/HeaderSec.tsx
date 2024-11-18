"use client"
import  { useState } from 'react';
import { Menu,X } from 'lucide-react';
import Link from 'next/link';

const HeaderSec=()=>{
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return <div>
         <header className="fixed w-full top-0 z-50 bg-transparent">
                <nav className="max-w-screen-xl mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="text-2xl text-white font-bold">TECHREHUB</Link>

                        {/* Desktop Navigation */}
                        <div className="text-white hidden md:flex space-x-8">
                            <Link href="/#services" className="hover:text-gray-600">Services</Link>
                            <Link href="/#services" className="hover:text-gray-600">Corporate</Link>
                            <Link href="/#about" className="hover:text-gray-600">About Us</Link>
                            <Link href="/#contact-form" className="hover:text-gray-600">Contact</Link>
                            <Link href="/solar" className="hover:text-gray-600">Solar</Link>
                            <Link href="/shop" className="hover:text-gray-600">Shop here</Link>
                            
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
                
                 <a className="text-2xl font-medium hover:text-gray-300" href="/solar" onClick={() => setIsMenuOpen(false)}>
                 Solar
                 </a>
                 <a className="text-2xl font-medium hover:text-gray-300" href="/shop" onClick={() => setIsMenuOpen(false)}>
                 Shop Here
                 </a>
                 </div>
                )}
            </header>

    </div>
}
export default HeaderSec
