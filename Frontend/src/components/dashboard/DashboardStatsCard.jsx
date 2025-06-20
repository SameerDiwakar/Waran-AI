import React from 'react';

const DashboardStatsCard = ({ title, value, icon, iconBgClass }) => (
  <div className="card">
    <div className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-brand-navy mt-2">{value}</h3>
      </div>
      <div className={`${iconBgClass} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

export default DashboardStatsCard; 