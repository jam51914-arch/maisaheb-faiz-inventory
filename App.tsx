
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import BillingView from './components/BillingView';
import ReportsView from './components/ReportsView';
import HistoryView from './components/HistoryView';
import SupplierView from './components/SupplierView';
import { InventoryItem, View, Transaction, TransactionType, Supplier, PurchaseOrder } from './types';
import { INITIAL_INVENTORY, INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const logTransaction = (data: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateItem = (updatedItem: InventoryItem, type: TransactionType = 'EDIT', notes?: string) => {
    const oldItem = inventory.find(item => item.id === updatedItem.id);
    if (!oldItem) return;

    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));

    const quantityChange = updatedItem.quantity - oldItem.quantity;

    if (quantityChange !== 0) {
        logTransaction({
            itemId: updatedItem.id,
            itemName: updatedItem.name,
            type,
            quantityChange,
            quantityBefore: oldItem.quantity,
            quantityAfter: updatedItem.quantity,
            notes: notes || (type === 'EDIT' ? 'Manual edit from form' : undefined)
        });
    }
  };

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const itemWithId: InventoryItem = { ...newItem, id: Date.now() };
    setInventory(prev => [...prev, itemWithId]);
    logTransaction({
      itemId: itemWithId.id,
      itemName: itemWithId.name,
      type: 'CREATE',
      quantityChange: itemWithId.quantity,
      quantityBefore: 0,
      quantityAfter: itemWithId.quantity,
    });
  };

  const handleBulkAddItems = (newItems: Omit<InventoryItem, 'id'>[]) => {
    const itemsWithIds: InventoryItem[] = [];
    const newTransactions: Transaction[] = [];

    newItems.forEach(newItem => {
        const itemWithId: InventoryItem = { ...newItem, id: Date.now() + Math.random() };
        itemsWithIds.push(itemWithId);

        const newTransaction: Transaction = {
            id: Date.now() + Math.random(), // ensure unique id
            timestamp: new Date().toISOString(),
            itemId: itemWithId.id,
            itemName: itemWithId.name,
            type: 'CREATE',
            quantityChange: itemWithId.quantity,
            quantityBefore: 0,
            quantityAfter: itemWithId.quantity,
            notes: 'Bulk import from CSV'
        };
        newTransactions.push(newTransaction);
    });

    setInventory(prev => [...prev, ...itemsWithIds]);
    setTransactions(prev => [...newTransactions, ...prev]);
  };

  const handleDeleteItem = (itemId: number) => {
    const itemToDelete = inventory.find(item => item.id === itemId);
    if (itemToDelete) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
      logTransaction({
          itemId: itemToDelete.id,
          itemName: itemToDelete.name,
          type: 'DELETE',
          quantityChange: -itemToDelete.quantity,
          quantityBefore: itemToDelete.quantity,
          quantityAfter: 0,
      });
    }
  };

  const handleAddSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    const supplierWithId: Supplier = { ...newSupplier, id: Date.now() };
    setSuppliers(prev => [...prev, supplierWithId]);
  };
  
  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const handleDeleteSupplier = (supplierId: number) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    // Optional: Also handle what happens to POs from this supplier
  };

  const handleAddPurchaseOrder = (newPO: Omit<PurchaseOrder, 'id'>) => {
      const poWithId: PurchaseOrder = { ...newPO, id: Date.now() };
      setPurchaseOrders(prev => [poWithId, ...prev]);
  };

  const handleUpdatePurchaseOrder = (updatedPO: PurchaseOrder) => {
      const oldPO = purchaseOrders.find(po => po.id === updatedPO.id);
      setPurchaseOrders(prev => prev.map(po => po.id === updatedPO.id ? updatedPO : po));
  
      if (oldPO && oldPO.status !== 'Delivered' && updatedPO.status === 'Delivered') {
          updatedPO.items.forEach(poItem => {
              const inventoryItem = inventory.find(invItem => invItem.id === poItem.inventoryItemId);
              if (inventoryItem) {
                  const oldQty = inventoryItem.quantity;
                  const oldPrice = inventoryItem.purchasePrice;
                  const addedQty = poItem.quantity;
                  const addedPrice = poItem.purchasePrice;
  
                  const newTotalQty = oldQty + addedQty;
                  const newAvgPrice = newTotalQty > 0 ? ((oldQty * oldPrice) + (addedQty * addedPrice)) / newTotalQty : addedPrice;
  
                  const updatedInventoryItem: InventoryItem = {
                      ...inventoryItem,
                      quantity: newTotalQty,
                      purchasePrice: parseFloat(newAvgPrice.toFixed(2)),
                      lastUpdated: new Date().toISOString(),
                  };
                  
                  handleUpdateItem(updatedInventoryItem, 'INWARDS', `From PO #${updatedPO.id}`);
              }
          });
      }
  };

  const lowStockItems = useMemo(() => inventory.filter(item => item.quantity <= item.lowStockThreshold), [inventory]);
  const expiringSoonItems = useMemo(() => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today.setDate(today.getDate() + 7));
    today.setDate(today.getDate() - 7); // Reset date
    return inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= sevenDaysFromNow && expiry >= today;
    });
  }, [inventory]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
                  inventory={inventory} 
                  lowStockCount={lowStockItems.length} 
                  expiringSoonCount={expiringSoonItems.length} 
                  setView={setCurrentView}
                />;
      case 'inventory':
        return <InventoryView 
                  inventory={inventory} 
                  onUpdate={handleUpdateItem} 
                  onAdd={handleAddItem} 
                  onDelete={handleDeleteItem}
                  onBulkAdd={handleBulkAddItems}
                />;
      case 'suppliers':
        return <SupplierView
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            inventory={inventory}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddPurchaseOrder={handleAddPurchaseOrder}
            onUpdatePurchaseOrder={handleUpdatePurchaseOrder}
        />;
      case 'billing':
        return <BillingView 
                  inventory={inventory} 
                  onUpdate={handleUpdateItem} 
                  lowStockItems={lowStockItems}
                />;
      case 'reports':
        return <ReportsView inventory={inventory} />;
      case 'history':
        return <HistoryView transactions={transactions} />;
      default:
        return <Dashboard 
                  inventory={inventory} 
                  lowStockCount={lowStockItems.length} 
                  expiringSoonCount={expiringSoonItems.length} 
                  setView={setCurrentView}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
