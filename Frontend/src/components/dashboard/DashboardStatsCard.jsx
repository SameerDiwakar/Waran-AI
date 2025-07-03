import React, { useEffect, useRef, useState } from 'react';

const DashboardStatsCard = ({ title, value, icon, iconBgClass }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValue = useRef(0);
  useEffect(() => {
    let start = startValue.current;
    let end = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(end)) end = 0;
    if (start === end) return;
    const duration = 1000;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(start + (end - start) * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
    return () => {};
  }, [value]);
  return (
    <div className="card">
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-brand-navy mt-2 transition-all duration-500">{displayValue}</h3>
        </div>
        <div className={`${iconBgClass} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCard; 