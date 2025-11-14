
import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '../types';
import { CATEGORIES, UNITS } from '../constants';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Omit<InventoryItem, 'id'>[]) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'result';

const INVENTORY_FIELDS: { key: keyof Omit<InventoryItem, 'id'|'lastUpdated'|'purchaseDate'>; label: string; required: boolean, example: string }[] = [
  { key: 'name', label: 'Item Name', required: true, example: 'Wheat Flour' },
  { key: 'category', label: 'Category', required: true, example: 'Grains & Flours' },
  { key: 'quantity', label: 'Quantity', required: true, example: '50' },
  { key: 'unit', label: 'Unit', required: true, example: 'kg' },
  { key: 'purchasePrice', label: 'Purchase Price', required: true, example: '45.50' },
  { key: 'lowStockThreshold', label: 'Low Stock Threshold', required: true, example: '10' },
  { key: 'expiryDate', label: 'Expiry Date (YYYY-MM-DD)', required: false, example: '2025-12-31' },
];

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<{ item: Omit<InventoryItem, 'id'>, errors: string[] }[]>([]);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const resetState = useCallback(() => {
    setStep('upload');
    setFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setMapping({});
    setPreviewData([]);
    setImportResult(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsv(text);
        setStep('mapping');
      };
      reader.readAsText(selectedFile);
    }
  };
  
  const parseCsv = (csvText: string) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) return;
    
    // Naive header parsing, assumes comma-separated without quotes
    const headers = lines[0].split(',').map(h => h.trim());
    setCsvHeaders(headers);

    const data = lines.slice(1).map(line => {
      // This is a naive parser and won't handle commas inside quoted strings.
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i];
      });
      return row;
    });
    setCsvData(data);

    // Auto-mapping
    const newMapping: Record<string, string> = {};
    INVENTORY_FIELDS.forEach(field => {
        const foundHeader = headers.find(h => h.toLowerCase().replace(/ /g, '') === field.label.toLowerCase().replace(/ /g, '').replace(/\(.*\)/, ''));
        if (foundHeader) {
            newMapping[field.key] = foundHeader;
        }
    });
    setMapping(newMapping);
  };

  const handleMappingChange = (fieldKey: string, csvHeader: string) => {
    setMapping(prev => ({ ...prev, [fieldKey]: csvHeader }));
  };

  const goToPreview = () => {
    const validationResult = csvData.map((row, index) => {
      const item: any = {};
      const errors: string[] = [];
      
      INVENTORY_FIELDS.forEach(field => {
        const csvHeader = mapping[field.key];
        const value = csvHeader ? row[csvHeader] : undefined;

        if (field.required && (value === undefined || value === '')) {
          errors.push(`Row ${index + 2}: Missing required field '${field.label}'.`);
        }
        
        if (value) {
            switch(field.key) {
                case 'name':
                case 'category':
                case 'unit':
                    item[field.key] = value;
                    break;
                case 'quantity':
                case 'purchasePrice':
                case 'lowStockThreshold':
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                        errors.push(`Row ${index + 2}: Invalid number for '${field.label}': "${value}".`);
                    } else {
                        item[field.key] = numValue;
                    }
                    break;
                case 'expiryDate':
                    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        errors.push(`Row ${index + 2}: Invalid date format for Expiry Date. Use YYYY-MM-DD.`);
                    } else if (value) {
                        item[field.key] = value;
                    }
                    break;
            }
        }
      });
      item.lastUpdated = new Date().toISOString();
      item.purchaseDate = new Date().toISOString().split('T')[0];

      return { item: item as Omit<InventoryItem, 'id'>, errors };
    });
    setPreviewData(validationResult);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    const validItems = previewData.filter(d => d.errors.length === 0).map(d => d.item);
    const failedRows = previewData.filter(d => d.errors.length > 0);
    
    onImport(validItems);

    setImportResult({
        success: validItems.length,
        failed: failedRows.length,
        errors: failedRows.flatMap(r => r.errors)
    });
    setStep('result');
  };
  
  const generateTemplateCSV = () => {
    const headers = INVENTORY_FIELDS.map(f => f.label).join(',');
    const exampleRow = INVENTORY_FIELDS.map(f => f.example).join(',');
    const csvContent = `${headers}\n${exampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "inventory_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium text-light mb-2">Upload your CSV File</h3>
            <p className="text-sm text-slate-400 mb-4">Select a CSV file to import your inventory items. Make sure it has a header row.</p>
            <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg">
                <input type="file" accept=".csv" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark-accent hover:file:bg-accent"/>
            </div>
            <p className="text-xs text-slate-500 mt-4">
                Need a template? <button onClick={generateTemplateCSV} className="text-accent hover:underline">Download CSV Template</button>
            </p>
          </div>
        );
      case 'mapping':
        return (
          <div>
            <h3 className="text-lg font-medium text-light mb-2">Map CSV Columns</h3>
            <p className="text-sm text-slate-400 mb-4">Match your CSV columns to the inventory fields. Required fields are marked with an asterisk (*).</p>
            <div className="space-y-3">
              {INVENTORY_FIELDS.map(field => (
                <div key={field.key} className="grid grid-cols-2 items-center gap-4">
                  <label className="font-semibold text-slate-300">
                    {field.label} {field.required && <span className="text-danger">*</span>}
                  </label>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent"
                  >
                    <option value="">-- Do not import --</option>
                    {csvHeaders.map(header => <option key={header} value={header}>{header}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-6">
                <Button variant="secondary" onClick={() => setStep('upload')}>Back</Button>
                <Button onClick={goToPreview}>Preview Data</Button>
            </div>
          </div>
        );
    case 'preview':
        const validCount = previewData.filter(d => d.errors.length === 0).length;
        const invalidCount = previewData.length - validCount;
        return (
            <div>
                 <h3 className="text-lg font-medium text-light mb-2">Preview Import</h3>
                 <p className="text-sm text-slate-400 mb-4">Review your data before importing. Rows with errors will be skipped.</p>
                 <div className="mb-4 p-3 bg-slate-800 rounded-md text-sm">
                    <p className="text-success font-semibold">{validCount} rows ready for import.</p>
                    {invalidCount > 0 && <p className="text-danger font-semibold">{invalidCount} rows have errors and will be skipped.</p>}
                 </div>
                 <div className="max-h-60 overflow-y-auto border border-slate-700 rounded-md">
                     <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-dark-accent">
                            <tr>
                                {INVENTORY_FIELDS.filter(f => mapping[f.key]).map(f => <th key={f.key} className="p-2">{f.label}</th>)}
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.slice(0, 10).map((data, index) => (
                                <tr key={index} className={data.errors.length > 0 ? 'bg-red-900/50' : ''}>
                                    {INVENTORY_FIELDS.filter(f => mapping[f.key]).map(f => <td key={f.key} className="p-2 truncate max-w-xs">{String(data.item[f.key] || '')}</td>)}
                                    <td className="p-2">
                                        {data.errors.length > 0 ? <span className="text-danger font-bold">Error</span> : <span className="text-success">OK</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                     {previewData.length > 10 && <p className="text-center text-xs text-slate-500 p-2">... and {previewData.length - 10} more rows.</p>}
                 </div>
                {invalidCount > 0 && (
                    <div className="mt-4 max-h-24 overflow-y-auto bg-slate-800 p-2 rounded-md">
                        <h4 className="font-bold text-warning">Errors found:</h4>
                        <ul className="text-xs list-disc list-inside">
                            {previewData.flatMap(d => d.errors).slice(0,10).map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}
                 <div className="flex justify-end gap-2 pt-6">
                    <Button variant="secondary" onClick={() => setStep('mapping')}>Back</Button>
                    <Button onClick={handleConfirmImport} disabled={validCount === 0}>Import {validCount} Items</Button>
                </div>
            </div>
        )
      case 'result':
        return (
            <div className="text-center">
                <h3 className="text-lg font-medium text-light mb-2">Import Complete</h3>
                <p className="text-success text-2xl font-bold">{importResult?.success} items successfully imported.</p>
                {importResult && importResult.failed > 0 && <p className="text-danger mt-1">{importResult.failed} rows failed.</p>}
                
                {importResult && importResult.errors.length > 0 && (
                    <div className="mt-4 max-h-40 text-left overflow-y-auto bg-slate-800 p-3 rounded-md text-sm">
                        <h4 className="font-bold text-warning mb-2">Error Details:</h4>
                        <ul className="text-xs list-disc list-inside space-y-1">
                            {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-6">
                    <Button onClick={onClose}>Done</Button>
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Inventory">
      {renderContent()}
    </Modal>
  );
};

export default BulkImportModal;
