
import React from 'react';
import { InventoryItem } from '../types';
import Card from './ui/Card';
import { ICONS } from '../constants';

interface LowStockAlertsProps {
  lowStockItems: InventoryItem[];
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ lowStockItems }) => {
  return (
    <Card className="sticky top-6">
      <h3 className="text-lg font-bold mb-4 text-light flex items-center gap-2">
        {ICONS.warning}
        Low Stock Alerts
      </h3>
      {lowStockItems.length > 0 ? (
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {lowStockItems.map(item => (
            <li key={item.id} className="p-3 bg-dark-accent rounded-md border border-warning">
              <p className="font-semibold text-warning">{item.name}</p>
              <p className="text-sm text-slate-300">
                Only <span className="font-bold">{item.quantity} {item.unit}</span> left. Threshold is {item.lowStockThreshold}.
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">No items are currently low on stock. Well done!</p>
      )}
    </Card>
  );
};

export default LowStockAlerts;
