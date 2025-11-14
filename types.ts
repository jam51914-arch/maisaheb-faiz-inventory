
export type TransactionType = 'INWARDS' | 'OUTWARDS' | 'BILLING' | 'EDIT' | 'CREATE' | 'DELETE';

export interface Transaction {
  id: number;
  itemId: number;
  itemName: string;
  type: TransactionType;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  notes?: string;
  timestamp: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  purchaseDate: string;
  expiryDate?: string;
  lowStockThreshold: number;
  lastUpdated: string;
}

export type PurchaseOrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface PurchaseOrderItem {
  inventoryItemId: number;
  name: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  totalValue: number;
}

export type View = 'dashboard' | 'inventory' | 'billing' | 'reports' | 'history' | 'suppliers';

export interface ChartData {
  name: string;
  value: number;
}
