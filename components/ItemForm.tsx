
import React, { useState, useEffect } from 'react';
import { InventoryItem, TransactionType } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { CATEGORIES, UNITS } from '../constants';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdate: (item: InventoryItem, type: TransactionType, notes?: string) => void;
  item: InventoryItem | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ isOpen, onClose, onAdd, onUpdate, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    quantity: '',
    unit: UNITS[0],
    purchasePrice: '',
    purchaseDate: '',
    expiryDate: '',
    lowStockThreshold: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: String(item.quantity),
        unit: item.unit,
        purchasePrice: String(item.purchasePrice),
        purchaseDate: item.purchaseDate || today,
        expiryDate: item.expiryDate || '',
        lowStockThreshold: String(item.lowStockThreshold),
      });
    } else {
      setFormData({
        name: '',
        category: CATEGORIES[0],
        quantity: '',
        unit: UNITS[0],
        purchasePrice: '',
        purchaseDate: today,
        expiryDate: '',
        lowStockThreshold: '',
      });
    }
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate || undefined,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
      lastUpdated: new Date().toISOString(),
    };

    if (item) {
      onUpdate({ ...payload, id: item.id }, 'EDIT');
    } else {
      onAdd(payload);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Item' : 'Add New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Item Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
        <Select label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Quantity" id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required min="0" step="any"/>
          <Select label="Unit" id="unit" name="unit" value={formData.unit} onChange={handleChange}>
            {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Purchase Price" id="purchasePrice" name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required min="0" step="0.01"/>
          <Input label="Low Stock Threshold" id="lowStockThreshold" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} required min="0"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Input label="Purchase Date" id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required />
            <Input label="Expiry Date" id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{item ? 'Update Item' : 'Add Item'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemForm;