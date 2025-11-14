
import React from 'react';
import { InventoryItem, View } from '../types';
import Card from './ui/Card';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  inventory: InventoryItem[];
  lowStockCount: number;
  expiringSoonCount: number;
  setView: (view: View) => void;
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, onClick }) => (
    <Card className={`flex items-center p-4 ${onClick ? 'cursor-pointer hover:bg-slate-700 transition-colors' : ''}`} onClick={onClick}>
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ inventory, lowStockCount, expiringSoonCount, setView }) => {
  const totalValue = inventory.reduce((acc, item) => acc + (item.quantity * item.purchasePrice), 0).toFixed(2);
  const totalProductTypes = inventory.length;

  const chartData = inventory.slice(0, 10).map(item => ({
    name: item.name,
    quantity: item.quantity,
    threshold: item.lowStockThreshold
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-light">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ICONS.inventory} title="Total Product Types" value={totalProductTypes} color="bg-blue-500" />
        <StatCard icon={<span className="text-2xl font-bold">₹</span>} title="Total Inventory Value" value={`₹${totalValue}`} color="bg-green-500" />
        <StatCard icon={ICONS.warning} title="Low Stock Alerts" value={lowStockCount} color="bg-orange-500" onClick={() => setView('inventory')} />
        <StatCard icon={ICONS.warning} title="Expiring Soon" value={expiringSoonCount} color="bg-red-500" onClick={() => setView('inventory')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Stock Levels Overview">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Bar dataKey="quantity" fill="#3b82f6" name="Current Quantity" />
                        <Bar dataKey="threshold" fill="#f97316" name="Low Stock Threshold" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </Card>
           <Card title="Quick Actions">
               <div className="flex flex-col space-y-4">
                  <button onClick={() => setView('inventory')} className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition">View Full Inventory</button>
                  <button onClick={() => setView('billing')} className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition">Go to Billing Screen</button>
                  <button onClick={() => setView('reports')} className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition">Generate Reports</button>
               </div>
           </Card>
      </div>
    </div>
  );
};

export default Dashboard;
