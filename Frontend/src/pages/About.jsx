import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 md:px-0 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-4 animate-fade-in-up">About <span className="text-brand-purple">WaranAI</span></h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in-up delay-100">
              Empowering you to manage your warranties with ease, intelligence, and peace of mind.
            </p>
            <div className="flex justify-center animate-fade-in-up delay-200">
              <svg className="w-24 h-24 text-brand-purple animate-bounce-slow" fill="none" viewBox="0 0 48 48" stroke="currentColor">
                <circle cx="24" cy="24" r="22" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 24l6 6 10-10" />
              </svg>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-white animate-fade-in-up delay-300">
          <div className="max-w-5xl mx-auto px-4 md:px-0 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg mb-4">
                At WaranAI, we envision a world where every consumer can effortlessly keep track of their warranties, never miss an expiration, and always get the support they deserve. Our mission is to simplify warranty management using the power of AI, making it accessible, reliable, and stress-free for everyone.
              </p>
              <ul className="list-disc pl-6 text-brand-purple text-base space-y-2">
                <li>AI-powered document extraction</li>
                <li>Automated reminders for expiring warranties</li>
                <li>Centralized dashboard for all your products</li>
                <li>Instant troubleshooting and support guidance</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Vision" className="rounded-2xl shadow-lg w-full max-w-xs animate-float" />
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-16 bg-gradient-to-r from-brand-purple/10 to-brand-navy/5 animate-fade-in-up delay-500">
          <div className="max-w-5xl mx-auto px-4 md:px-0 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80" alt="Documentation" className="rounded-2xl shadow-lg w-full max-w-xs animate-float-reverse" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Documentation & Tech Stack</h2>
              <p className="text-gray-700 text-lg mb-4">
                WaranAI is built using a modern, scalable tech stack to deliver a seamless experience:
              </p>
              <ul className="list-disc pl-6 text-brand-purple text-base space-y-2 mb-4">
                <li><b>React</b> for a fast, interactive frontend</li>
                <li><b>Node.js & Express</b> for a robust backend API</li>
                <li><b>Multer</b> for secure file uploads</li>
                <li><b>Cloudinary</b> for image and document storage</li>
                <li><b>Gemini API</b> for advanced AI document extraction and analysis</li>
                <li><b>MongoDB</b> for scalable data storage</li>
                <li><b>Tailwind CSS</b> for beautiful, responsive design</li>
                <li><b>React Query</b> for efficient data fetching and caching</li>
                <li><b>Sonner</b> and <b>Radix UI</b> for modern UI components and notifications</li>
              </ul>
              <p className="text-gray-700 text-base">
                Our documentation covers everything from uploading invoices to integrating with AI-powered features. Explore the codebase or reach out for more details!
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 text-center animate-fade-in-up delay-700">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">Ready to experience hassle-free warranty management?</h2>
          <p className="text-lg text-gray-600 mb-8">Join WaranAI today and take control of your purchases!</p>
          <a href="/" className="inline-block px-8 py-3 bg-brand-purple text-white rounded-lg shadow hover:bg-brand-navy transition-colors font-semibold text-lg animate-fade-in-up delay-800">Start your Journey</a>
        </section>
      </main>
      <Footer />
      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1s forwards;
        }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in-up.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in-up.delay-700 { animation-delay: 0.7s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
        @keyframes floatReverse {
          0% { transform: translateY(0); }
          50% { transform: translateY(12px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default About; 