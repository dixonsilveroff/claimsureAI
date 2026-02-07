import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
  inverse?: boolean; // If true, low score is better (not used for these specific metrics usually, but good for flexibility)
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, color }) => {
  const getColorClass = () => {
    switch(color) {
      case 'green': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      case 'yellow': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'red': return 'text-rose-600 border-rose-200 bg-rose-50';
      case 'blue': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getBarColor = () => {
     switch(color) {
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      case 'red': return 'bg-rose-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${getColorClass()}`}>
      <span className="text-sm font-medium uppercase tracking-wider opacity-80 mb-1">{label}</span>
      <span className="text-4xl font-bold mb-2">{score}</span>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${getBarColor()}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};