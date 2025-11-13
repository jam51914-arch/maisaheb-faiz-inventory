
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-dark-accent rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-light">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-light transition">&times;</button>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
