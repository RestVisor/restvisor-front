// src/components/TableGrid.tsx
import React from 'react';
import { Table } from '../../types';

interface TableGridProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => onTableSelect(table)}
          className={`p-4 border rounded-lg cursor-pointer ${table.state === 'occupied' ? 'bg-red-500' : 'bg-green-500'}`}
        >
          <span className="text-white">Table {table.numero}</span>
        </div>
      ))}
    </div>
  );
};

export { TableGrid };