import React from 'react';
import { Table } from '../types';

interface TableGridProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
}

export function TableGrid({ tables, onTableSelect }: TableGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {tables.map((table) => (
        <button
          key={table.number}
          onClick={() => onTableSelect(table)}
          className="dashboard-card hover-lift group"
        >
          <div className="aspect-square flex flex-col items-center justify-center text-center p-4">
            <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center ${
              table.status === 'available' ? 'bg-green-100' :
              table.status === 'occupied' ? 'bg-red-100' :
              'bg-yellow-100'
            }`}>
              <span className="text-2xl font-bold">{table.number}</span>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{table.seats} seats</p>
              <span className={`status-badge ${table.status}`}>
                {table.status}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}