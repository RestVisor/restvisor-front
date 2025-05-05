import React from 'react';
import { Table } from '../../types';

interface TableManagementProps {
    tables: Table[];
    handleTableSelect: (table: Table) => void;
}

const TableManagement: React.FC<TableManagementProps> = ({ tables, handleTableSelect }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4">Gestión de Mesas</h2>
            <div className="grid grid-cols-3 gap-4">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`p-4 rounded-lg cursor-pointer ${
                            table.estado === 'ocupada'
                                ? 'bg-red-500'
                                : table.estado === 'reservada'
                                ? 'bg-green-800'
                                : 'bg-green-500'
                        }`}
                        onClick={() => handleTableSelect(table)}
                    >
                        <h3 className="text-xl text-center text-white">Mesa {table.numero}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableManagement;
