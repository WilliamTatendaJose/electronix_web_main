import { Wrench, Clock,Shield } from "lucide-react"
import circuitboard from '../components/assets/circuitboard.jpg'

import Image from "next/image"
const WhyChooseUS=()=>{
    return <div>
        <section className="relative h-screen flex items-center justify-center">
          <Image src={circuitboard} alt="Electronics repair" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10   text-gray-200 text-center space-y-6 max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Why Choose Harare Tech?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <Wrench className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Technicians</h3>
                <p>Gifted professionals ensuring top-quality repairs</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold mb-2">Quick Turnaround</h3>
                <p>Minimizing downtime for your business and personal devices</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold mb-2">Great Warranty</h3>
                <p>Genuine Warranty on all our services for your peace of mind</p>
              </div>
            </div>
          </div>
        </section>

    </div>
}

export default WhyChooseUS