"use client"

import HomeSec from './components/HomeSec';
import AboutUs from './components/AboutUs';
import ServiceSec from './components/ServicesSec';
import CallToAction from './components/CallToAction';
import WhyChooseUS from './components/WhyChooseUs';
import ContactForm from './components/ContactForm';
import HeaderSec from './components/HeaderSec';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="relative">
            {/* Fixed Header */}
             <Head>
        <title>TECHREHUB | Expert Electronics Repair Services</title>
        <meta name="description" content="TECHREHUB offers cutting-edge electronics repair services for businesses and individuals. Specializing in corporate, consumer, and industrial solutions." />
        <meta name="keywords" content="electronics repair,smartphone repair,computer repair,industrial repair, console repair, tv repair,Harare, tech solutions, corporate electronics, consumer devices, industrial solutions, door-to-door service, home service, on-site service, remote service, mobile repair, laptop repair, tablet repair, smartphone repair, computer repair, industrial repair, console repair, tv repair, Harare, Zimbabwe, expert technicians, quality service, customer satisfaction, affordable prices, quick turnaround, flexible scheduling, expert advice, reliable repairs, warranty options, expert technicians, quality service, customer satisfaction, affordable prices, quick turnaround, flexible scheduling, expert advice, reliable repairs, warranty options" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.techrehub.co.zw" />
        <meta property="og:title" content="TECHREHUB | Expert Electronics Repair Services" />
        <meta property="og:description" content="Cutting-edge electronics repair services for businesses and individuals in Harare." />
        <meta property="og:image" content="https://www.techrehub.co.zw/og-image.jpg" />
        <meta property="og:url" content="https://www.techrehub.co.zw" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
       
            
           
        <main className="flex-1">
           <HeaderSec/>
          
           <HomeSec/>
           <AboutUs/>
           <section id='services' className='py-24 px-4 md:px-6 bg-black'>
             <div className="container mx-auto text-left space-y-6 md:text-center">
                 <h2 className="text-4xl text-gray-200  md:text-5xl font-bold  tracking-tighter">Our Services</h2>
                <p className="text-xl text-gray-300">
                  We offer a comprehensive range of electronic repair and maintenance services. Our expert technicians are equipped to handle everything from corporate IT infrastructure to personal devices ,industrial equipment and energy systems.
                </p>
            </div>
             <ServiceSec/>
           </section>
           
           
            <CallToAction/>
            <WhyChooseUS/>
            <ContactForm/>
         
            
        
        </main>

        </div>
   
  );
}
