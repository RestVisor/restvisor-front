import React from 'react';
import { Table } from '../../types';
import { useTablesAndMenu } from '../../hooks/useTablesAndMenu';

interface TableManagementProps {
    tables: Table[];
    handleTableSelect: (table: Table) => void;
    selectedTableId?: number | null;
}

const TableManagement: React.FC<TableManagementProps> = ({ tables, handleTableSelect, selectedTableId }) => {
    const { tablesWithReadyOrders } = useTablesAndMenu();

    return (
        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700/60 shadow-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-b border-gray-700/60">
                <h2 className="text-lg font-bold text-white tracking-wide flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    GESTIÓN DE MESAS
                </h2>
            </div>
            
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-gradient-to-b from-gray-800/20 to-gray-900/40">
                {tables.map((table) => {
                    const isSelected = selectedTableId === table.id;
                    const isOccupied = table.estado === 'ocupada';
                    const isReserved = table.estado === 'reservada';
                    const hasReadyOrders = isOccupied && tablesWithReadyOrders.includes(table.numero);

                    // Define status styles based on table state
                    let statusStyles = {
                        bgGradient: 'from-emerald-600/80 to-emerald-700/80',
                        borderColor: 'border-emerald-500/70',
                        ringColor: 'ring-emerald-400/50',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                            </svg>
                        ),
                        statusText: 'DISPONIBLE'
                    };

                    if (hasReadyOrders) {
                        statusStyles = {
                            bgGradient: 'from-orange-500/80 to-orange-600/80',
                            borderColor: 'border-orange-400/70',
                            ringColor: 'ring-orange-300/50',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                                    <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clipRule="evenodd" />
                                </svg>
                            ),
                            statusText: 'LISTO'
                        };
                    } else if (isOccupied) {
                        statusStyles = {
                            bgGradient: 'from-rose-500/80 to-rose-600/80',
                            borderColor: 'border-rose-400/70',
                            ringColor: 'ring-rose-300/50',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            ),
                            statusText: 'OCUPADA'
                        };
                    } else if (isReserved) {
                        statusStyles = {
                            bgGradient: 'from-amber-500/80 to-amber-600/80',
                            borderColor: 'border-amber-400/70',
                            ringColor: 'ring-amber-300/50',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>
                            ),
                            statusText: 'RESERVADA'
                        };
                    }

                    return (
                        <div
                            key={table.id}
                            className={`cursor-pointer group transition-all duration-200 ${
                                isSelected ? 'scale-105 z-10' : 'hover:scale-105'
                            }`}
                            onClick={() => handleTableSelect(table)}
                        >
                            <div className={`bg-gradient-to-br ${statusStyles.bgGradient} 
                                p-3 rounded-lg border ${statusStyles.borderColor} 
                                ${hasReadyOrders ? 'animate-pulse' : ''} 
                                ${isSelected ? `ring-2 ${statusStyles.ringColor}` : ''}
                                transition-all duration-200 shadow-md hover:shadow-lg`}>
                                
                                <div className="flex items-center gap-2.5">
                                    {/* Table number in circle */}
                                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white font-bold text-xl">{table.numero}</span>
                                    </div>
                                    
                                    {/* Status information */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white">{statusStyles.icon}</span>
                                            <span className="text-white text-xs font-semibold tracking-wider">
                                                {statusStyles.statusText}
                                            </span>
                                        </div>
                                        {hasReadyOrders && (
                                            <div className="text-[10px] text-white/80 mt-0.5 rounded-sm">
                                                Pedido listo para servir
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 bg-white w-3 h-3 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
                
                {tables.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <p>No hay mesas disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableManagement;
