
import React, { useState, useMemo } from 'react';
import { Supplier, PurchaseOrder, InventoryItem, PurchaseOrderStatus } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { ICONS } from '../constants';
import SupplierForm from './SupplierForm';
import PurchaseOrderForm from './PurchaseOrderForm';
import Select from './ui/Select';

interface SupplierViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  inventory: InventoryItem[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: number) => void;
  onAddPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  onUpdatePurchaseOrder: (po: PurchaseOrder) => void;
}

type Tab = 'suppliers' | 'purchaseOrders';

const SupplierView: React.FC<SupplierViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('purchaseOrders');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  const handleOpenSupplierModal = (supplier: Supplier | null = null) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };
  
  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Delivered': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const supplierMap = useMemo(() => {
    return props.suppliers.reduce((acc, supplier) => {
      acc[supplier.id] = supplier.name;
      return acc;
    }, {} as Record<number, string>);
  }, [props.suppliers]);

  const handleUpdateStatus = (po: PurchaseOrder, newStatus: PurchaseOrderStatus) => {
    if (po.status === 'Delivered' || po.status === 'Cancelled') return; // Cannot change status after final state
    props.onUpdatePurchaseOrder({ ...po, status: newStatus });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-light">Supplier & Vendor Management</h2>
      </div>
      
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('purchaseOrders')}
            className={`${activeTab === 'purchaseOrders' ? 'border-accent text-accent' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`${activeTab === 'suppliers' ? 'border-accent text-accent' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Suppliers
          </button>
        </nav>
      </div>

      {activeTab === 'purchaseOrders' && (
        <Card>
           <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">All Purchase Orders</h3>
                <Button onClick={() => setIsPOModalOpen(true)}>{ICONS.plus} Create Purchase Order</Button>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="p-3">PO ID</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Order Date</th>
                  <th className="p-3">Expected Delivery</th>
                  <th className="p-3">Lead Time</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {props.purchaseOrders.map(po => {
                    const orderDate = new Date(po.orderDate);
                    const deliveryDate = new Date(po.expectedDeliveryDate);
                    const leadTime = Math.ceil((deliveryDate.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
                    return (
                        <tr key={po.id} className="border-b border-slate-800 hover:bg-slate-800">
                            <td className="p-3 font-mono">#{po.id}</td>
                            <td className="p-3 font-medium">{supplierMap[po.supplierId] || 'Unknown'}</td>
                            <td className="p-3">{orderDate.toLocaleDateString()}</td>
                            <td className="p-3">{deliveryDate.toLocaleDateString()}</td>
                            <td className="p-3">{leadTime} days</td>
                            <td className="p-3 font-mono">₹{po.totalValue.toFixed(2)}</td>
                            <td className="p-3">
                                <Select 
                                    label=""
                                    value={po.status}
                                    onChange={(e) => handleUpdateStatus(po, e.target.value as PurchaseOrderStatus)}
                                    className={`!p-1 !text-xs !font-bold !rounded-full text-center ${getStatusColor(po.status)} text-white border-0`}
                                    disabled={po.status === 'Delivered' || po.status === 'Cancelled'}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Select>
                            </td>
                        </tr>
                    )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'suppliers' && (
        <Card>
           <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">All Suppliers</h3>
                <Button onClick={() => handleOpenSupplierModal()}>{ICONS.plus} Add Supplier</Button>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.suppliers.map(s => (
                  <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">{s.contactPerson}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="secondary" className="px-2 py-1" onClick={() => handleOpenSupplierModal(s)}>{ICONS.edit}</Button>
                        <Button variant="danger" className="px-2 py-1" onClick={() => props.onDeleteSupplier(s.id)}>{ICONS.trash}</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      <SupplierForm 
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onAdd={props.onAddSupplier}
        onUpdate={props.onUpdateSupplier}
        supplier={editingSupplier}
      />
      
      <PurchaseOrderForm
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        onAdd={props.onAddPurchaseOrder}
        suppliers={props.suppliers}
        inventory={props.inventory}
      />

    </div>
  );
};

export default SupplierView;
