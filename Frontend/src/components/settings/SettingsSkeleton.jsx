import React from 'react';

const SettingsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse flex flex-col gap-8 p-8">
    <div className="h-10 w-1/3 bg-gray-200 rounded mb-4" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-8 w-1/2 bg-gray-200 rounded" />
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-brand-teal via-brand-purple to-brand-navy p-6 shadow-lg flex items-center gap-4">
          <div className="bg-white rounded-full p-3 shadow-md border-2 border-brand-teal h-16 w-16" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-white/40 rounded" />
            <div className="h-4 w-2/3 bg-white/30 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsSkeleton; 