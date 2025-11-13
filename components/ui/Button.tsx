
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-white transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-primary hover:bg-accent focus:ring-2 focus:ring-blue-400 text-dark-accent",
    secondary: "bg-secondary hover:bg-slate-600 focus:ring-2 focus:ring-slate-500",
    danger: "bg-danger hover:bg-red-600 focus:ring-2 focus:ring-red-400",
    success: "bg-success hover:bg-green-600 focus:ring-2 focus:ring-green-400",
    warning: "bg-warning hover:bg-orange-600 focus:ring-2 focus:ring-orange-400",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;