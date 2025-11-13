
import React, { useState, useMemo } from 'react';
import { InventoryItem, TransactionType } from '../types';
import Card from './ui/Card';
import LowStockAlerts from './LowStockAlerts';

interface BillingViewProps {
  inventory: InventoryItem[];
  onUpdate: (item: InventoryItem, type: TransactionType) => void;
  lowStockItems: InventoryItem[];
}

const BillingView: React.FC<BillingViewProps> = ({ inventory, onUpdate, lowStockItems }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (expiry < today) return { text: 'Expired', color: 'bg-danger text-white' };
    if (expiry <= sevenDaysFromNow) return { text: 'Use First!', color: 'bg-warning text-dark-accent' };
    return null;
  };

  const handleUseItem = (item: InventoryItem) => {
    if (item.expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(item.expiryDate);
      if (expiry < today) {
        return; // Do not use expired items
      }
    }

    if (item.quantity > 0) {
      onUpdate({ ...item, quantity: item.quantity - 1, lastUpdated: new Date().toISOString() }, 'BILLING');
    }
  };

  const filteredAndSortedInventory = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inventory
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aExpiry = a.expiryDate ? new Date(a.expiryDate) : null;
        const bExpiry = b.expiryDate ? new Date(b.expiryDate) : null;
        const aIsExpired = aExpiry ? aExpiry < today : false;
        const bIsExpired = bExpiry ? bExpiry < today : false;

        // Expired items go to the bottom
        if (aIsExpired && !bIsExpired) return 1;
        if (!aIsExpired && bIsExpired) return -1;

        // Items with expiry dates come before those without
        if (a.expiryDate && !b.expiryDate) return -1;
        if (!a.expiryDate && b.expiryDate) return 1;

        // If both have expiry dates, sort by date
        if (a.expiryDate && b.expiryDate) {
          if (a.expiryDate < b.expiryDate) return -1;
          if (a.expiryDate > b.expiryDate) return 1;
        }
        
        // Fallback to alphabetical sorting
        return a.name.localeCompare(b.name);
      });
  }, [inventory, searchTerm]);


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="lg:w-2/3 space-y-6">
        <h2 className="text-3xl font-bold text-light">Billing & Usage</h2>
        <Card>
          <input
            type="text"
            placeholder="Search for an item to use..."
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredAndSortedInventory.map(item => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              const isExpired = expiryStatus?.text === 'Expired';
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleUseItem(item)}
                  className={`relative p-4 bg-dark-accent rounded-lg shadow-md transition-all transform 
                    ${isExpired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-700 hover:scale-105'}`}
                >
                  {expiryStatus && (
                    <span className={`absolute top-0 right-0 -mt-2 -mr-2 text-xs font-bold px-2 py-1 rounded-full ${expiryStatus.color} z-10`}>
                      {expiryStatus.text}
                    </span>
                  )}
                  <p className="font-bold text-light truncate pt-2">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.category}</p>
                  <p className={`mt-2 font-mono ${item.quantity <= item.lowStockThreshold ? 'text-warning' : 'text-accent'}`}>
                    {item.quantity} {item.unit} left
                  </p>
                </div>
              );
            })}
          </div>
           <p className="text-sm text-slate-500 mt-4">FIFO Principle: Items are sorted by expiry date to encourage using older stock first. Expired items are disabled.</p>
        </Card>
      </div>
      <div className="lg:w-1/3">
        <LowStockAlerts lowStockItems={lowStockItems} />
      </div>
    </div>
  );
};

export default BillingView;