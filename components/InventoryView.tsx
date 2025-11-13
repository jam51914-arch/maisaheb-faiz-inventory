
import React, { useState, useMemo } from 'react';
import { InventoryItem, TransactionType } from '../types';
import Button from './ui/Button';
import { ICONS, CATEGORIES } from '../constants';
import ItemForm from './ItemForm';
import InwardsForm from './InwardsForm';
import OutwardsForm from './OutwardsForm';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdate: (item: InventoryItem, type: TransactionType, notes?: string) => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  onDelete: (id: number) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onUpdate, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // State for Inwards modal
  const [isInwardsModalOpen, setIsInwardsModalOpen] = useState(false);
  const [inwardsItem, setInwardsItem] = useState<InventoryItem | null>(null);

  // State for Outwards modal
  const [isOutwardsModalOpen, setIsOutwardsModalOpen] = useState(false);
  const [outwardsItem, setOutwardsItem] = useState<InventoryItem | null>(null);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [quantityFilter, setQuantityFilter] = useState({ min: '', max: '' });
  const [expiryDateFilter, setExpiryDateFilter] = useState({ start: '', end: '' });

  const handleOpenModal = (item: InventoryItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  // Handlers for Inwards modal
  const handleOpenInwardsModal = (item: InventoryItem) => {
    setInwardsItem(item);
    setIsInwardsModalOpen(true);
  };

  const handleCloseInwardsModal = () => {
    setInwardsItem(null);
    setIsInwardsModalOpen(false);
  };

  const handleConfirmInwards = (data: { quantityToAdd: number; newPurchasePrice: number; newExpiryDate?: string; }) => {
    if (!inwardsItem || !data.quantityToAdd) {
      handleCloseInwardsModal();
      return;
    }

    const { quantityToAdd, newPurchasePrice, newExpiryDate } = data;
    const oldQty = inwardsItem.quantity;
    const oldPrice = inwardsItem.purchasePrice;

    const newTotalQty = oldQty + quantityToAdd;
    
    // Calculate weighted average for the new price
    const newAvgPrice = newTotalQty > 0 ? ((oldQty * oldPrice) + (quantityToAdd * newPurchasePrice)) / newTotalQty : newPurchasePrice;

    // Determine the earliest expiry date to ensure food safety and FIFO principles
    let finalExpiryDate = inwardsItem.expiryDate;
    if (inwardsItem.expiryDate && newExpiryDate) {
        finalExpiryDate = new Date(inwardsItem.expiryDate) < new Date(newExpiryDate) ? inwardsItem.expiryDate : newExpiryDate;
    } else if (newExpiryDate) {
        finalExpiryDate = newExpiryDate;
    }
    
    const updatedItem: InventoryItem = {
      ...inwardsItem,
      quantity: newTotalQty,
      purchasePrice: parseFloat(newAvgPrice.toFixed(2)),
      expiryDate: finalExpiryDate,
      lastUpdated: new Date().toISOString()
    };
    
    onUpdate(updatedItem, 'INWARDS');
    handleCloseInwardsModal();
  };

  // Handlers for Outwards modal
  const handleOpenOutwardsModal = (item: InventoryItem) => {
    setOutwardsItem(item);
    setIsOutwardsModalOpen(true);
  };

  const handleCloseOutwardsModal = () => {
    setOutwardsItem(null);
    setIsOutwardsModalOpen(false);
  };

  const handleConfirmOutwards = (data: { quantityToRemove: number; reason?: string; }) => {
    if (!outwardsItem) {
      handleCloseOutwardsModal();
      return;
    }

    const { quantityToRemove, reason } = data;
    const newQuantity = Math.max(0, outwardsItem.quantity - quantityToRemove);
    
    const updatedItem: InventoryItem = {
      ...outwardsItem,
      quantity: newQuantity,
      lastUpdated: new Date().toISOString()
    };
    
    onUpdate(updatedItem, 'OUTWARDS', reason);
    handleCloseOutwardsModal();
  };
  
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return { text: 'N/A', color: 'text-slate-400' };
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (expiry < today) return { text: 'Expired', color: 'text-danger' };
    if (expiry <= sevenDaysFromNow) return { text: 'Expiring Soon', color: 'text-warning' };
    return { text: new Date(expiryDate).toLocaleDateString(), color: 'text-slate-300' };
  }

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setPriceFilter({ min: '', max: '' });
    setQuantityFilter({ min: '', max: '' });
    setExpiryDateFilter({ start: '', end: '' });
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search term
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      // Category
      if (categoryFilter && item.category !== categoryFilter) return false;
      // Price
      const minPrice = parseFloat(priceFilter.min);
      const maxPrice = parseFloat(priceFilter.max);
      if (!isNaN(minPrice) && item.purchasePrice < minPrice) return false;
      if (!isNaN(maxPrice) && item.purchasePrice > maxPrice) return false;
      // Quantity
      const minQty = parseFloat(quantityFilter.min);
      const maxQty = parseFloat(quantityFilter.max);
      if (!isNaN(minQty) && item.quantity < minQty) return false;
      if (!isNaN(maxQty) && item.quantity > maxQty) return false;
      // Expiry Date
      if (expiryDateFilter.start) {
        if (!item.expiryDate || new Date(item.expiryDate) < new Date(expiryDateFilter.start)) return false;
      }
      if (expiryDateFilter.end) {
          const endDate = new Date(expiryDateFilter.end);
          endDate.setHours(23, 59, 59, 999);
          if (!item.expiryDate || new Date(item.expiryDate) > endDate) return false;
      }
      // Status
      if (statusFilter) {
        const expiryStatus = getExpiryStatus(item.expiryDate).text;
        const isLow = item.quantity <= item.lowStockThreshold;
        if (statusFilter === 'low-stock' && !isLow) return false;
        if (statusFilter === 'expired' && expiryStatus !== 'Expired') return false;
        if (statusFilter === 'expiring-soon' && expiryStatus !== 'Expiring Soon') return false;
      }

      return true;
    });
  }, [inventory, searchTerm, categoryFilter, statusFilter, priceFilter, quantityFilter, expiryDateFilter]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-light">Inventory</h2>
        <Button onClick={() => handleOpenModal()}>
          {ICONS.plus}
          Add New Item
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end mb-4 p-2">
            <Input label="Search by Name" id="search" placeholder="e.g., Wheat Flour" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <Select label="Filter by Category" id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <Select label="Filter by Status" id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="low-stock">Low Stock</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
            </Select>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Price Range</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={priceFilter.min} onChange={e => setPriceFilter(p => ({...p, min: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                    <input type="number" placeholder="Max" value={priceFilter.max} onChange={e => setPriceFilter(p => ({...p, max: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quantity Range</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={quantityFilter.min} onChange={e => setQuantityFilter(q => ({...q, min: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                    <input type="number" placeholder="Max" value={quantityFilter.max} onChange={e => setQuantityFilter(q => ({...q, max: e.target.value}))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date Range</label>
                <div className="flex gap-2">
                    <input type="date" value={expiryDateFilter.start} onChange={e => setExpiryDateFilter(d => ({ ...d, start: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                    <input type="date" value={expiryDateFilter.end} onChange={e => setExpiryDateFilter(d => ({ ...d, end: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent" />
                </div>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
                <Button variant="secondary" onClick={handleResetFilters} className="w-full">Reset Filters</Button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const isLowStock = item.quantity <= item.lowStockThreshold;
                const expiryStatus = getExpiryStatus(item.expiryDate);

                return (
                  <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-mono">{item.quantity} {item.unit}</td>
                    <td className="p-3 font-mono">₹{item.purchasePrice.toFixed(2)} / {item.unit}</td>
                    <td className={`p-3 font-medium ${expiryStatus.color}`}>{expiryStatus.text}</td>
                    <td className="p-3">
                      {isLowStock && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-warning text-dark-accent">Low Stock</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="success" onClick={() => handleOpenInwardsModal(item)} className="px-2 py-1" title="Add Stock">{ICONS.inwards}</Button>
                        <Button variant="warning" onClick={() => handleOpenOutwardsModal(item)} className="px-2 py-1" title="Record Usage">{ICONS.outwards}</Button>
                        <Button variant="secondary" onClick={() => handleOpenModal(item)} className="px-2 py-1" title="Edit Item">{ICONS.edit}</Button>
                        <Button variant="danger" onClick={() => onDelete(item.id)} className="px-2 py-1" title="Delete Item">{ICONS.trash}</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">No items match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ItemForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={onAdd}
        onUpdate={onUpdate}
        item={editingItem}
      />

      <InwardsForm
        isOpen={isInwardsModalOpen}
        onClose={handleCloseInwardsModal}
        onConfirm={handleConfirmInwards}
        item={inwardsItem}
      />

      <OutwardsForm
        isOpen={isOutwardsModalOpen}
        onClose={handleCloseOutwardsModal}
        onConfirm={handleConfirmOutwards}
        item={outwardsItem}
      />
    </div>
  );
};

export default InventoryView;
