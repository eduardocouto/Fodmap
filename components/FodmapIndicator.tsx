
import React from 'react';

interface FodmapIndicatorProps {
  name: string;
  load: number;
  warningThreshold?: number;
  dangerThreshold?: number;
}

const FodmapIndicator: React.FC<FodmapIndicatorProps> = ({ name, load, warningThreshold = 75, dangerThreshold = 100 }) => {
  const percentage = Math.round(load * 100);
  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-800';
  let statusText = 'Seguro';

  if (percentage > dangerThreshold) {
    barColor = 'bg-red-500';
    textColor = 'text-red-800';
    statusText = 'Alto - Risco de Acumulação';
  } else if (percentage > warningThreshold) {
    barColor = 'bg-yellow-500';
    textColor = 'text-yellow-800';
    statusText = 'Moderado';
  }

  const barWidth = Math.min(percentage, 100);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold text-gray-700 text-sm">{name}</span>
        <span className={`font-bold text-sm ${textColor}`}>{statusText} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FodmapIndicator;