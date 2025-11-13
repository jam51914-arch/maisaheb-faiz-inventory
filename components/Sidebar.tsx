import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  isSidebarOpen: boolean;
}> = ({ view, label, icon, currentView, setView, isSidebarOpen }) => {
  const isActive = currentView === view;
  return (
    <li
      onClick={() => setView(view)}
      className={`
        flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200
        ${isActive ? 'bg-accent text-white' : 'text-slate-300 hover:bg-dark-accent hover:text-white'}
      `}
    >
      {icon}
      <span className={`ml-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-dark-accent text-white transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-16'} no-print`}>
      <div className="flex items-center justify-between p-3 h-16 border-b border-slate-700">
        <h1 className={`font-bold text-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>SmartStock</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-slate-700">
          {isOpen ? ICONS.chevronLeft : ICONS.chevronRight}
        </button>
      </div>
      <nav className="p-2">
        <ul>
          <NavItem view="dashboard" label="Dashboard" icon={ICONS.dashboard} currentView={currentView} setView={setView} isSidebarOpen={isOpen} />
          <NavItem view="inventory" label="Inventory" icon={ICONS.inventory} currentView={currentView} setView={setView} isSidebarOpen={isOpen} />
          <NavItem view="billing" label="Billing Screen" icon={ICONS.billing} currentView={currentView} setView={setView} isSidebarOpen={isOpen} />
          {/* FIX: Corrected typo in prop name from 'currentVew' to 'currentView'. */}
          <NavItem view="reports" label="Reports & AI" icon={ICONS.reports} currentView={currentView} setView={setView} isSidebarOpen={isOpen} />
          <NavItem view="history" label="History" icon={ICONS.history} currentView={currentView} setView={setView} isSidebarOpen={isOpen} />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;