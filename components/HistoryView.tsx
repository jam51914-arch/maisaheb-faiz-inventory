
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { ICONS } from '../constants';

interface HistoryViewProps {
  transactions: Transaction[];
}

const TRANSACTION_TYPES: TransactionType[] = ['INWARDS', 'OUTWARDS', 'BILLING', 'EDIT', 'CREATE', 'DELETE'];

const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [quantityChangeFilter, setQuantityChangeFilter] = useState({ min: '', max: '' });


  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter ? t.type === typeFilter : true;
      
      let matchesDate = true;
      if (dateFilter.start || dateFilter.end) {
          const transactionDate = new Date(t.timestamp);
          if (dateFilter.start && transactionDate < new Date(dateFilter.start)) {
              matchesDate = false;
          }
          if (dateFilter.end) {
              const endDate = new Date(dateFilter.end);
              endDate.setHours(23, 59, 59, 999);
              if (transactionDate > endDate) {
                  matchesDate = false;
              }
          }
      }

      const minQty = parseFloat(quantityChangeFilter.min);
      const maxQty = parseFloat(quantityChangeFilter.max);
      let matchesQuantity = true;
      if (!isNaN(minQty) && t.quantityChange < minQty) matchesQuantity = false;
      if (!isNaN(maxQty) && t.quantityChange > maxQty) matchesQuantity = false;

      return matchesSearch && matchesType && matchesDate && matchesQuantity;
    });
  }, [transactions, searchTerm, typeFilter, dateFilter, quantityChangeFilter]);
  
  const getChangeColor = (type: TransactionType) => {
    switch(type) {
        case 'INWARDS':
        case 'CREATE':
            return 'text-success';
        case 'OUTWARDS':
        case 'BILLING':
        case 'DELETE':
        case 'EDIT':
             return 'text-danger';
        default:
            return 'text-light';
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setDateFilter({ start: '', end: '' });
    setQuantityChangeFilter({ min: '', max: '' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-3xl font-bold text-light">Transaction History</h2>
        <Button onClick={handlePrint} variant="secondary">
            {ICONS.print}
            Print History
        </Button>
      </div>
      
      <Card className="no-print">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input 
                label="Search by Item Name"
                id="search"
                placeholder="e.g., Wheat Flour"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select 
                label="Filter by Type" 
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
            >
                <option value="">All Types</option>
                {TRANSACTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date Range</label>
                <div className="flex gap-2">
                    <input type="date" value={dateFilter.start} onChange={e => setDateFilter(d => ({...d, start: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                    <input type="date" value={dateFilter.end} onChange={e => setDateFilter(d => ({...d, end: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quantity Change</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={quantityChangeFilter.min} onChange={e => setQuantityChangeFilter(p => ({...p, min: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                    <input type="number" placeholder="Max" value={quantityChangeFilter.max} onChange={e => setQuantityChangeFilter(p => ({...p, max: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
            </div>
            <div className="md:col-start-1 lg:col-start-auto">
              <Button variant="secondary" onClick={handleResetFilters} className="w-full">Reset Filters</Button>
            </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-center">Change</th>
                <th className="p-3 text-center">New Quantity</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-800">
                    <td className="p-3 text-sm text-slate-400">{new Date(t.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-medium">{t.itemName}</td>
                    <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-light`}>
                            {t.type}
                        </span>
                    </td>
                    <td className={`p-3 font-mono text-center font-bold ${getChangeColor(t.type)}`}>
                        {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                    </td>
                    <td className="p-3 font-mono text-center">{t.quantityAfter}</td>
                    <td className="p-3 text-sm text-slate-400 italic">{t.notes || '---'}</td>
                  </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">No transactions match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default HistoryView;
