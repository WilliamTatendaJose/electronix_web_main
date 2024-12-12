"use client"
import React from 'react';
import { ChevronDown} from 'lucide-react';
import AppointmentModal from '../components/AppointmentModel';



const HomeSec=()=>{
    return <div>
        <section id="home" className="relative h-screen flex items-center   justify-center">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
            <source src="/motherboard.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 "></div>
          <div className="relative z-10 text-center text-gray-200 space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Redefining Electronics
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Cutting-edge solutions for businesses and individuals
            </p>
            
           <button
              className="bg-white text-black hover:bg-gray-200 rounded-lg  text-lg py-6 px-12"
              onClick={() => {
                const contactForm = document.getElementById('services');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our Services
            </button>
            <AppointmentModal 
            trigger={
              <button className="border border-white m-6 rounded-lg  text-lg py-6 px-12  hover:bg-white hover:text-black transition duration-300">
                Schedule Service
              </button>
            } 
          />
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <ChevronDown className="w-8 h-8 text-white animate-bounce" />
          </div>
        </section>

    </div>
}
export default HomeSec