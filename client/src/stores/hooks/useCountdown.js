import { useState, useEffect } from 'react';

/**
 * Custom hook để tính toán countdown timer
 * @param {Date|string|number} targetDate - Ngày đích (Date object, ISO string, hoặc timestamp)
 * @returns {Object} - Object chứa days, hours, minutes, seconds
 */
export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      let endTime;

      // Xử lý targetDate có thể là Date object, string, hoặc number
      if (targetDate instanceof Date) {
        endTime = targetDate.getTime();
      } else if (typeof targetDate === 'string') {
        endTime = new Date(targetDate).getTime();
      } else if (typeof targetDate === 'number') {
        endTime = targetDate;
      } else {
        // Default: 30 ngày từ hôm nay
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        endTime = defaultDate.getTime();
      }

      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};