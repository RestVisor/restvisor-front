import React, { useState } from 'react';
import { Table } from '../../types';
import { useTablesAndMenu } from '../../hooks/useTablesAndMenu';
// Suggesting simple icons. You might use an icon library like react-icons.
const TableIconFree = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TableIconOccupied = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const TableIconReserved = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TableIconReady = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;

interface TableManagementProps {
    tables: Table[];
    handleTableSelect: (table: Table) => void;
    selectedTableId?: number | null; // Added to indicate selected table
}

const TableManagement: React.FC<TableManagementProps> = ({ tables, handleTableSelect, selectedTableId }) => {
    const { tablesWithReadyOrders } = useTablesAndMenu();
    const [hoveredTable, setHoveredTable] = useState<number | null>(null);

    return (
        <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-700/60 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700/50 pb-4 tracking-tight">Gestión de Mesas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                {tables.map((table) => {
                    const isHovered = hoveredTable === table.id;
                    const isSelected = selectedTableId === table.id;
                    const isOccupied = table.estado === 'ocupada';
                    const isReserved = table.estado === 'reservada';
                    const isFree = table.estado === 'disponible'; // Explicitly check for 'disponible'
                    const hasReadyOrders = isOccupied && tablesWithReadyOrders.includes(table.numero);

                    let bgColor = 'bg-emerald-500/90';
                    let borderColor = 'border-emerald-600/80';
                    let textColor = 'text-emerald-300';
                    let icon = <TableIconFree />;
                    let statusText = table.estado;

                    if (hasReadyOrders) {
                        bgColor = 'bg-orange-500/90';
                        borderColor = 'border-orange-600/80';
                        textColor = 'text-orange-300';
                        icon = <TableIconReady />;
                        statusText = 'Pedido Listo';
                    } else if (isOccupied) {
                        bgColor = 'bg-rose-500/90';
                        borderColor = 'border-rose-600/80';
                        textColor = 'text-rose-300';
                        icon = <TableIconOccupied />;
                    } else if (isReserved) {
                        bgColor = 'bg-amber-500/90';
                        borderColor = 'border-amber-600/80';
                        textColor = 'text-amber-300';
                        icon = <TableIconReserved />;
                    } // isFree will use default emerald

                    return (
                        <div
                            key={table.id}
                            className={`relative cursor-pointer group transform transition-all duration-300 ease-in-out 
                                        ${isHovered && !isSelected ? 'scale-105 shadow-lg' : ''} 
                                        ${isSelected ? 'scale-105 shadow-xl ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800/50 rounded-lg' : ''}`}
                            onClick={() => handleTableSelect(table)}
                            onMouseEnter={() => setHoveredTable(table.id)}
                            onMouseLeave={() => setHoveredTable(null)}
                        >
                            <div className={`flex flex-col items-center p-4 rounded-lg border-2 ${borderColor} ${bgColor} ${hasReadyOrders ? 'animate-pulse' : ''} transition-all duration-300`}>
                                <div className="mb-2 text-white">
                                    {icon}
                                </div>
                                <span className="text-white font-bold text-2xl mb-1">
                                    {table.numero}
                                </span>
                                <span className={`text-xs uppercase font-semibold tracking-wider ${textColor}`}>
                                    {statusText}
                                </span>
                            </div>
                            {/* Optional: Add a small visual cue for hover when not selected */}
                            {isHovered && !isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-75"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TableManagement;
