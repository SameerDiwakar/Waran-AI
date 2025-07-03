import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from 'react-router-dom';

const LogoutIcon = () => (
  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
  </svg>
);

const emojiArray = [
  { emoji: '😡', label: 'Terrible' },
  { emoji: '😕', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '🤩', label: 'Excellent' },
];

const SettingsSidebar = ({ user }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="card bg-white border-2 shadow-lg rounded-3xl flex flex-col h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="relative py-6 mb-6 rounded-2xl flex flex-col items-center ">
            <div className="flex items-center justify-center mb-2">
              <Avatar className="h-16 w-16 shadow-lg border-4 bg-white border-[#6942EF]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-brand-purple text-xl text-white">{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-xl font-bold text-brand-purple mb-1">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
            <p className="text-brand-purple/80 text-sm max-w-xs text-center">Personalize your WaranAI experience, manage your profile, and keep your warranties safe and smart with AI-powered reminders.</p>
          </div>
          <div className="mb-6 rounded-2xl border-2 p-2 shadow-[0_4px_24px_0_rgba(105,66,239,0.10)] flex justify-center">
            <Calendar 
              className="rounded-xl"
              classNames={{
                caption_label: "text-brand-purple text-lg font-bold",
              }}
            />
          </div>
          <div className="mt-16 w-full flex flex-col items-center gap-2">
            <div className="text-center w-full">
              <span className="block text-2xl font-bold text-brand-purple mb-2">“Thank you for trusting WaranAI to protect your purchases.<br/>Your peace of mind is our mission.”</span>
              <span className="block text-base font-medium text-brand-purple mt-2">- Sameer Diwakar, Founder</span>
            </div>
          </div>
          <div className="flex flex-col items-center mt-8 mb-8">
            <span className="text-xs text-gray-500 mb-2">Rate our service</span>
            <div className="flex gap-3">
              {emojiArray.map(({ emoji, label }, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setRating(idx + 1)}
                  onMouseEnter={() => setHover(idx + 1)}
                  onMouseLeave={() => setHover(0)}
                  className={`focus:outline-none transition-transform duration-150 rounded-full p-1 text-3xl ${idx + 1 === (hover || rating) ? 'scale-125 ring-2 ring-brand-purple/40 bg-brand-purple/10' : ''}`}
                  aria-label={label}
                  title={label}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <nav className="space-y-1 mt-8">
            <Button 
              variant="default" 
              className="w-full justify-center font-bold bg-brand-purple text-white hover:bg-brand-teal hover:text-white transition-colors text-base py-3 rounded-xl flex items-center gap-2 shadow-lg border-2 border-brand-purple"
              onClick={handleLogout}
            >
              <LogoutIcon />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar; 