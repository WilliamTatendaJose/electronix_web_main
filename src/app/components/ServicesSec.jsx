"use client"
import PropTypes from "prop-types";
import {
  Cpu,
  Briefcase,
  Smartphone,
  Shield,
  Lightbulb,
  Zap,
  GraduationCap,
} from "lucide-react";
import solar from "../components/assets/solar.jpg";
import corporate from "../components/assets/corporate.jpg";
import laptop from "../components/assets/laptop.jpg";
import rack from "../components/assets/rack.jpg";
import school from "../components/assets/school.jpg";
import desiging from"../components/assets/desiging.jpg";


import Image from "next/image";
const shop= "/shop";

const ServiceSec = () => {
  return (
    <div>
      <ServiceSection
        title="Corporate Electronics"
        description="Comprehensive repair and maintenance solutions for businesses of all sizes. We understand the critical nature of your IT infrastructure and provide swift, reliable services to minimize downtime and maximize productivity."
        icon={<Briefcase className="w-12 h-12 " />}
        
      
        
    
        imageSrc={corporate}
        imageAlt="Corporate office with computers"
        features={[
          "24/7 emergency support",
          "On-site and remote assistance",
          "Network infrastructure maintenance",
          "Data recovery and backup solutions",
        ]}
        isReversed={false}
      />

      <ServiceSection
        title="Consumer Devices"
        description="Expert repair services for all your personal electronics. From smartphones to laptops, consoles, tablets to smart home devices, our skilled technicians can diagnose and fix a wide range of issues, ensuring your devices work like new. "
        icon={<Smartphone className="w-12 h-12" />}
        imageSrc={laptop}
        features={[
          "Same-day repairs for most issues",
          "Genuine parts and accessories",
          "Free diagnostics",
          "90-day warranty on all repairs",
          // eslint-disable-next-line react/jsx-key
          <button onClick={() => window.location.href = shop} className=" text-white  underline hover:bg-gray-200 ">Shop here</button>,
        ]}
        isReversed={true}
        
      />
      

      <ServiceSection
        title="Industrial Solutions"
        description="Specialized repair and maintenance for industrial equipment and systems. Our team of experts is trained to handle complex machinery and control systems, ensuring your production lines stay operational and efficient."
        icon={<Cpu className="w-12 h-12" />}
        imageSrc={rack}
        imageAlt="Industrial electronics repair"
        features={[
          "PLC and SCADA system maintenance",
          "PLC, sensor and drive repairs",
          "Calibration services",
          "Preventive maintenance programs",
        ]}
        isReversed={false}
      />

      <ServiceSection
        title="Renewable Energy Systems"
        description="Cutting-edge solutions for renewable energy systems. We specialize in the design, installation, maintenance, and repair of solar systems and energy storage systems, helping you transition to clean, sustainable energy."
        icon={<Zap className="w-12 h-12" />}
        imageSrc={solar}
        features={[
          "Solar system design ,installation and repair",
          "Solar maintenance",
          "Energy storage system optimization",
          "Grid integration services",
           // eslint-disable-next-line react/jsx-key
          <button onClick={() => window.location.href ="/solar"} className=" text-white underline hover:bg-gray-200 ">Design Your System</button>,
          
        ]}
        isReversed={true}
    
      
      />

      <ServiceSection
        title="Educational Technology"
        description="Empowering schools with cutting-edge technology solutions. We provide comprehensive IT support, smart classroom setups, and educational device management to enhance the learning experience for students and educators alike."
        icon={<GraduationCap className="w-12 h-12" />}
        imageSrc={school}
        imageAlt="Modern classroom with technology"
        features={[
          "Smart board installation and maintenance",
          "Computer Lab setup and maintenance",
          "Educational software deployment",
          "IT infrastructure for e-learning",
        ]}
        isReversed={false}
      />
      <ServiceSection
          title="Custom Design Solutions"
          description="Innovative custom designs to solve unique technological challenges. Our team of expert engineers and designers collaborate to create bespoke solutions tailored to your specific needs, pushing the boundaries of what's possible in electronics and technology."
          icon={<Lightbulb className="w-12 h-12" />}
          imageSrc={desiging}
          features={[
            "Tailored problem-solving approach",
            "Cutting-edge technology integration",
            "Rapid prototyping and testing",
            "End-to-end project management"
          ]}
          isReversed={true}
        />
    </div>
  );
};

function ServiceSection({
  title,
  description,
  icon,
  imageSrc,
  videoSrc,
  imageAlt = "Service section image", // Default alt text
  features,
  isReversed,
}) {
  return (
    
    <section className="py-24 px-4 md:px-6 bg-black">
        
      <div className="container mx-auto space-y-6">
         
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 ${
            isReversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div className="w-full lg:w-1/2 aspect-video">
            {videoSrc ? (
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover rounded-lg"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 p-3 rounded-full">{icon}</div>
              <h2 className="text-4xl text-gray-200 md:text-5xl font-bold tracking-tighter">
                {title}
              </h2>
            </div>
            <p className="text-xl text-gray-300">{description}</p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex text-gray-200 items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span >{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Prop validation
ServiceSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  imageSrc: PropTypes.string,
  videoSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  isReversed: PropTypes.bool,
};

export default ServiceSec;
