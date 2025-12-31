
import React, { useState, useEffect } from 'react';

interface TimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationMinutes, onTimeUp, isActive }) => {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      onTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyClass = () => {
    if (seconds <= 60) return 'text-red-500 animate-pulse';
    if (seconds <= 300) return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Time Left</span>
      <div className={`font-mono text-2xl font-black transition-colors duration-500 ${getUrgencyClass()}`}>
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default Timer;
