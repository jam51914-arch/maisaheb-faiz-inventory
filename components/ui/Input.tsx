
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent"
        {...props}
      />
    </div>
  );
};

export default Input;
