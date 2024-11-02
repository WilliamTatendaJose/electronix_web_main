"use client"

const CallToAction=()=>{
    return <div>
                <section className="py-24 px-4 md:px-6 bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl text-gray-300 md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let us discuss how we can address your unique technology needs. Our team is ready to provide expert solutions tailored to your requirements.
            </p>
            <button
              className="bg-white text-black rounded-lg  hover:bg-gray-200 text-lg py-6 px-12"
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us Now
            </button>
          </div>
        </section>

    </div>
}

export default CallToAction