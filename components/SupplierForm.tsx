
import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (supplier: Omit<Supplier, 'id'>) => void;
  onUpdate: (supplier: Supplier) => void;
  supplier: Supplier | null;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ isOpen, onClose, onAdd, onUpdate, supplier }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
      });
    }
  }, [supplier, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier) {
      onUpdate({ ...formData, id: supplier.id });
    } else {
      onAdd(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Add New Supplier'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Supplier Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Contact Person" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          <Input label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <Input label="Address" id="address" name="address" value={formData.address} onChange={handleChange} />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{supplier ? 'Update Supplier' : 'Add Supplier'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SupplierForm;
