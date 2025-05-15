
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="bg-brand-purple text-white p-1 rounded">
            <span className="font-bold text-xl">W</span>
          </div>
          <span className="text-2xl font-bold text-brand-navy">WaranAI</span>
        </Link>
      </div>

      <RegisterForm />
    </div>
  );
};

export default Register;
