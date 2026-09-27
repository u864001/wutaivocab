import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const GlassCard = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const { isDark } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-5 sm:p-6 transition-all duration-300
        ${isDark ? 'glass-panel-night' : 'glass-panel-day'}
        ${hoverable ? 'hover:-translate-y-1.5 hover:shadow-xl cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
