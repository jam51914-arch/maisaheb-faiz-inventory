
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface OutwardsFormData {
  quantityToRemove: number;
  reason?: string;
}

interface OutwardsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: OutwardsFormData) => void;
  item: InventoryItem | null;
}

const OutwardsForm: React.FC<OutwardsFormProps> = ({ isOpen, onClose, onConfirm, item }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    setQuantity(value);
    if (item && numValue > item.quantity) {
      setError(`Cannot remove more than available: ${item.quantity} ${item.unit}`);
    } else if (numValue < 0) {
        setError(`Quantity must be a positive number.`);
    } 
    else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityToRemove = parseFloat(quantity);
    if (!quantityToRemove || quantityToRemove <= 0 || error) {
      return;
    }
    onConfirm({ quantityToRemove, reason });
    onClose();
  };
  
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Usage for ${item.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-slate-400">Current Quantity: <span className="font-bold text-light">{item.quantity} {item.unit}</span></p>
        <Input 
          label="Quantity to Remove" 
          id="quantityToRemove" 
          name="quantityToRemove" 
          type="number" 
          value={quantity} 
          onChange={handleChange} 
          required 
          min="0.01" 
          step="any"
          max={item.quantity}
          placeholder={`Enter amount in ${item.unit}`}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Input 
          label="Reason / Notes (Optional)" 
          id="reason" 
          name="reason" 
          type="text" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Wastage, Staff Meal"
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="warning" disabled={!!error || !quantity}>Record Usage</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OutwardsForm;
