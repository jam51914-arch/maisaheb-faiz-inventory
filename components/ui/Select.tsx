
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
