import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individuals and families to manage warranties with ease.',
    features: [
      'Unlimited warranty uploads',
      'AI-powered document extraction',
      'Automated expiry reminders',
      'Centralized dashboard',
      'Basic troubleshooting guide',
    ],
    comingSoon: false,
  },
  {
    name: 'Pro',
    price: 'Coming Soon',
    description: 'Advanced features for power users and small businesses.',
    features: [
      'Everything in Starter',
      'Priority support',
      'Advanced analytics',
      'Bulk upload & export',
      'Integration with more AI tools',
    ],
    comingSoon: true,
  },
  {
    name: 'Enterprise',
    price: 'Coming Soon',
    description: 'Custom solutions for large organizations and enterprises.',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'Team management',
      'SLA & compliance',
    ],
    comingSoon: true,
  },
];

const Pricing = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 md:px-0 overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-4 animate-fade-in-up">Pricing</h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in-up delay-100">
              <span className="font-semibold text-brand-purple">WaranAI</span> is currently <span className="font-bold text-green-600">free</span> for all users!<br/>
              As we add more advanced features, subscription plans will be introduced. Stay tuned!
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-16 animate-fade-in-up delay-200">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div key={plan.name} className={`rounded-2xl shadow-lg bg-white p-8 flex flex-col items-center border-2 ${plan.comingSoon ? 'border-gray-300 opacity-70' : 'border-brand-purple'} transition-all duration-300 animate-float`} style={{ animationDelay: `${idx * 0.2}s` }}>
                <h2 className="text-2xl font-bold text-brand-navy mb-2">{plan.name}</h2>
                <div className="text-3xl font-extrabold mb-2 text-brand-purple">{plan.price}</div>
                <p className="text-gray-600 mb-4 text-center">{plan.description}</p>
                <ul className="text-left mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-brand-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.comingSoon ? (
                  <span className="inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-semibold cursor-not-allowed">Coming Soon</span>
                ) : (
                  <span className="inline-block px-4 py-2 bg-brand-purple text-white rounded-lg font-semibold">Current Plan</span>
                )}
              </div>
            ))}
          </div>
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
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Pricing; 