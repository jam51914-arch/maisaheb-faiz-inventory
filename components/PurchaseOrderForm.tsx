
import React, { useState, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem, Supplier, InventoryItem } from '../types';
import Modal from './ui/Modal';
import Select from './ui/Select';
import Input from './ui/Input';
import Button from './ui/Button';
import { ICONS } from '../constants';

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (po: Omit<PurchaseOrder, 'id'>) => void;
  suppliers: Supplier[];
  inventory: InventoryItem[];
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ isOpen, onClose, onAdd, suppliers, inventory }) => {
  const [supplierId, setSupplierId] = useState<string>('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSupplierId(suppliers.length > 0 ? String(suppliers[0].id) : '');
      const today = new Date();
      today.setDate(today.getDate() + 7); // Default delivery 1 week from now
      setExpectedDeliveryDate(today.toISOString().split('T')[0]);
      setItems([{ inventoryItemId: 0, name: '', quantity: 1, unit: 'units', purchasePrice: 0 }]);
    }
  }, [isOpen, suppliers]);
  
  useEffect(() => {
    const total = items.reduce((acc, item) => acc + (item.quantity * item.purchasePrice), 0);
    setTotalValue(total);
  }, [items]);

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...items];
    if (field === 'inventoryItemId') {
      const selectedItem = inventory.find(inv => inv.id === Number(value));
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          inventoryItemId: selectedItem.id,
          name: selectedItem.name,
          unit: selectedItem.unit,
          purchasePrice: selectedItem.purchasePrice // Default to last purchase price
        };
      }
    } else {
      (newItems[index] as any)[field] = value;
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { inventoryItemId: 0, name: '', quantity: 1, unit: 'units', purchasePrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0) return;

    const finalItems = items.filter(item => item.inventoryItemId > 0 && item.quantity > 0);
    if (finalItems.length === 0) return;

    const newPO: Omit<PurchaseOrder, 'id'> = {
      supplierId: Number(supplierId),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate,
      items: finalItems,
      status: 'Pending',
      totalValue
    };
    onAdd(newPO);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Purchase Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Supplier" id="supplierId" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="Expected Delivery Date" id="expectedDeliveryDate" type="date" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} required />
        </div>
        
        <h3 className="text-lg font-semibold border-t border-slate-700 pt-4">Order Items</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                    <Select label="" id={`item-${index}`} value={item.inventoryItemId} onChange={(e) => handleItemChange(index, 'inventoryItemId', e.target.value)}>
                        <option value="0">Select an item...</option>
                        {inventory.map(invItem => <option key={invItem.id} value={invItem.id}>{invItem.name}</option>)}
                    </Select>
                </div>
                <div className="col-span-2">
                    <Input label="" id={`qty-${index}`} type="number" min="1" step="any" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                </div>
                 <div className="col-span-1 text-center pt-4 text-slate-400">{item.unit}</div>
                <div className="col-span-3">
                     <Input label="" id={`price-${index}`} type="number" min="0" step="0.01" value={item.purchasePrice} onChange={(e) => handleItemChange(index, 'purchasePrice', Number(e.target.value))} />
                </div>
                <div className="col-span-1 pt-4">
                    <Button type="button" variant="danger" className="px-2 py-2" onClick={() => handleRemoveItem(index)}>{ICONS.trash}</Button>
                </div>
            </div>
            ))}
        </div>
        <Button type="button" variant="secondary" onClick={handleAddItem} className="mt-2">Add another Item</Button>
        
        <div className="border-t border-slate-700 pt-4 mt-4 flex justify-end items-center">
            <span className="text-xl font-bold">Total: ₹{totalValue.toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Order</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseOrderForm;
