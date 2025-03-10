import React from 'react';
import { Table } from '../types';

interface TableGridProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
}

export function TableGrid({ tables, onTableSelect }: TableGridProps) {
  const getTableStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {tables.map((table) => (
        <button
          key={table.number}
          onClick={() => onTableSelect(table)}
          className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${getTableStatusColor(
            table.status
          )}`}
        >
          <div className="text-lg font-bold">Table {table.number}</div>
          <div className="text-sm">{table.seats} seats</div>
          <div className="text-xs capitalize mt-1">{table.status}</div>
        </button>
      ))}
    </div>
  );
}