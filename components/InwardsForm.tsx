
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface InwardsFormData {
  quantityToAdd: number;
  newPurchasePrice: number;
  newExpiryDate?: string;
}

interface InwardsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: InwardsFormData) => void;
  item: InventoryItem | null;
}

const InwardsForm: React.FC<InwardsFormProps> = ({ isOpen, onClose, onConfirm, item }) => {
  const [formData, setFormData] = useState({
    quantityToAdd: '',
    newPurchasePrice: '',
    newExpiryDate: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        quantityToAdd: '',
        newPurchasePrice: String(item.purchasePrice),
        newExpiryDate: item.expiryDate || '',
      });
    }
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: InwardsFormData = {
      quantityToAdd: parseFloat(formData.quantityToAdd) || 0,
      newPurchasePrice: parseFloat(formData.newPurchasePrice) || 0,
      newExpiryDate: formData.newExpiryDate,
    };
    if (data.quantityToAdd > 0) {
        onConfirm(data);
    }
    onClose();
  };
  
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Stock for ${item.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-slate-400">Current Quantity: <span className="font-bold text-light">{item.quantity} {item.unit}</span></p>
        <Input 
          label="Quantity to Add" 
          id="quantityToAdd" 
          name="quantityToAdd" 
          type="number" 
          value={formData.quantityToAdd} 
          onChange={handleChange} 
          required 
          min="0.01" 
          step="any"
          placeholder={`Enter amount in ${item.unit}`}
        />
        <Input 
          label="Purchase Price (for this batch)" 
          id="newPurchasePrice" 
          name="newPurchasePrice" 
          type="number" 
          value={formData.newPurchasePrice} 
          onChange={handleChange} 
          required 
          min="0" 
          step="0.01"
        />
        <Input 
          label="Expiry Date (for this batch)" 
          id="newExpiryDate" 
          name="newExpiryDate" 
          type="date" 
          value={formData.newExpiryDate} 
          onChange={handleChange} 
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Stock</Button>
        </div>
      </form>
    </Modal>
  );
};

export default InwardsForm;
