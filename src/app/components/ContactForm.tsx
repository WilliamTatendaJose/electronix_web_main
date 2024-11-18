"use client"

import { useState } from 'react';


const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    setError(null);

    const data = {
      name,
      email,
      subject,
      message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form" className="py-24 px-4 md:px-6 bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl text-white md:text-5xl font-bold mb-12 text-center">
          Get in Touch
        </h2>
          
       
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
          
               <input
              className="bg-gray-800 border-gray-700  p-3 border rounded-lg w-full  text-white px-2 "
              placeholder="Your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
             <input
              className="bg-gray-800 border-gray-700 p-3 border rounded-lg w-full text-white px-2"
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          
           
           
            <input
              className="bg-gray-800 border-gray-700 w-full p-3 border rounded-lg text-white px-2"
              placeholder="Subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              className="w-full h-40 bg-gray-800 border-gray-700 p-3 border rounded-lg text-white px-2"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-black rounded-lg  hover:bg-gray-200 text-lg py-6"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Message sent successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;