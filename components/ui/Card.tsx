
import React from 'react';

// FIX: Allow passing additional props like onClick to the Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, ...props }) => {
  return (
    <div className={`bg-dark-accent rounded-lg shadow-lg p-4 sm:p-6 ${className}`} {...props}>
      {title && <h3 className="text-lg font-bold mb-4 text-slate-200">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
