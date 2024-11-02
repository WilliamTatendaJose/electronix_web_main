

const AboutUs=()=>{
    return <div>
        <section id="about"className="py-24 px-4 md:px-6 bg-black">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2 aspect-video">
                <video autoPlay loop muted className="w-full h-full object-cover rounded-lg">
                  <source src="/iphone_flux.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-4xl text-gray-300 md:text-5xl font-bold tracking-tighter">About Us</h2>
                <p className="text-xl text-justify text-gray-300">
                  Founded in 2023, we strive to be the best Electronics repair and engineering service in Zimbabwe. Our team of expert engineers and technicians combines years of experience with cutting-edge technology to deliver unparalleled service.
                </p>
                <p className="text-xl text-justify text-gray-300">
                  We are not just fixing devices; we are building a more sustainable future by extending the life of electronics and reducing e-waste. Our commitment to quality, speed, and customer satisfaction sets us apart in the industry.
                </p>
            
              </div>
            </div>
          </div>
        </section>

    </div>
}

export default AboutUs