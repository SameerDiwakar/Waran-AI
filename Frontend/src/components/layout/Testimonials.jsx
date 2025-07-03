import React, { useEffect, useState } from 'react';

const testimonialsData = [
  {
    name: "Amit Sharma",
    text: "WaranAI helped me keep track of all my appliance warranties. No more searching for bills!",
    title: "IT Professional, Delhi"
  },
  {
    name: "Priya Singh",
    text: "The reminders are so useful. I claimed my AC warranty just in time!",
    title: "Homemaker, Mumbai"
  },
  {
    name: "Rahul Verma",
    text: "Uploading receipts is super easy. The dashboard is very user-friendly.",
    title: "Student, Bangalore"
  },
  {
    name: "Sneha Nair",
    text: "I love how everything is organized. I never miss a warranty expiry now.",
    title: "Designer, Kochi"
  },
  {
    name: "Vikram Patel",
    text: "Managing warranties for my family is now stress-free. Highly recommended!",
    title: "Business Owner, Ahmedabad"
  },
  {
    name: "Anjali Rao",
    text: "Customer support is very responsive and helpful. Great experience!",
    title: "Engineer, Hyderabad"
  },
  {
    name: "Rohit Gupta",
    text: "I used to lose warranty cards all the time. Not anymore, thanks to WaranAI!",
    title: "Photographer, Jaipur"
  },
  {
    name: "Meera Iyer",
    text: "The app is a must-have for anyone with lots of gadgets. Super easy to use!",
    title: "Doctor, Chennai"
  },
  {
    name: "Siddharth Joshi",
    text: "I never realized how much money I was losing on expired warranties. WaranAI changed that!",
    title: "Consultant, Pune"
  },
];

const getRandomTestimonials = (arr, n) => {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const Testimonials = () => {
  const [visible, setVisible] = useState(false);
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);

  useEffect(() => {
    setDisplayedTestimonials(getRandomTestimonials(testimonialsData, 5));
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <section className="py-12" style={{ backgroundColor: '#43369B' }}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <div className="waranai-container">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
          {displayedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md px-3 py-4 w-full max-w-[210px] flex flex-col items-center border border-[#6942EF] transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms`, animation: 'float 2.5s ease-in-out infinite', animationDelay: `${idx * 0.2}s` }}
            >
              <p className="text-sm text-brand-navy font-medium mb-2 text-center">"{t.text}"</p>
              <div className="text-[#6942EF] font-bold text-xs">{t.name}</div>
              <div className="text-gray-400 text-xs">{t.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
