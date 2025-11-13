
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { getDemandForecast } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';
import { ICONS } from '../constants';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsViewProps {
  inventory: InventoryItem[];
}

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#dc2626', '#8b5cf6', '#ec4899'];

const ReportsView: React.FC<ReportsViewProps> = ({ inventory }) => {
  const [forecast, setForecast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    const result = await getDemandForecast(inventory);
    setForecast(result);
    setIsLoading(false);
  };

  const categoryDistribution = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.purchasePrice * item.quantity);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryDistribution).map(key => ({
    name: key,
    value: parseFloat(categoryDistribution[key].toFixed(2))
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-light">Reports & AI Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Inventory Value by Category">
             <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </Card>
           <Card title="AI Demand Forecast">
               <div className="space-y-4">
                  <p className="text-slate-300">
                    Use our AI assistant to analyze your current inventory levels and generate a demand forecast. This can help you make smarter purchasing decisions.
                  </p>
                   <Button onClick={handleGenerateForecast} disabled={isLoading}>
                       {ICONS.ai}
                       {isLoading ? 'Generating...' : 'Get AI Forecast'}
                   </Button>
               </div>
           </Card>
      </div>

      {forecast && (
        <Card title="AI Forecast Results">
            <div className="prose prose-invert max-w-none">
            {forecast.split('\n').map((line, index) => {
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <p key={index} className="ml-4">{line}</p>
                }
                return <p key={index}>{line}</p>;
            })}
            </div>
        </Card>
      )}

    </div>
  );
};

export default ReportsView;
