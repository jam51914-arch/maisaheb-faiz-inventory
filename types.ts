
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

export type View = 'dashboard' | 'inventory' | 'billing' | 'reports' | 'history';

export interface ChartData {
  name: string;
  value: number;
}