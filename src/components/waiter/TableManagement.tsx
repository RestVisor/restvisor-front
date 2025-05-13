import React, { useState } from 'react';
import { Table } from '../../types';
import { useTablesAndMenu } from '../../hooks/useTablesAndMenu';

interface TableManagementProps {
    tables: Table[];
    handleTableSelect: (table: Table) => void;
}

const TableManagement: React.FC<TableManagementProps> = ({ tables, handleTableSelect }) => {
    const { tablesWithReadyOrders } = useTablesAndMenu();
    const [hoveredTable, setHoveredTable] = useState<number | null>(null);

    return (
        <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-8 border-b border-gray-700/50 pb-4">Gestión de Mesas</h2>
            <div className="grid grid-cols-3 gap-8">
                {tables.map((table) => {
                    const isHovered = hoveredTable === table.id;
                    const isOccupied = table.estado === 'ocupada';
                    const isReserved = table.estado === 'reservada';
                    const isFree = !isOccupied && !isReserved;
                    const hasReadyOrders = isOccupied && tablesWithReadyOrders.includes(table.numero);

                    return (
                        <div
                            key={table.id}
                            className="relative cursor-pointer group"
                            onClick={() => handleTableSelect(table)}
                            onMouseEnter={() => setHoveredTable(table.id)}
                            onMouseLeave={() => setHoveredTable(null)}
                        >
                            <div className="flex flex-col items-center">
                                {/* Contenedor de la mesa con sombra */}
                                <div
                                    className={`relative transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''
                                        }`}
                                >
                                    {/* Mesa Superior - Diseño Flat/Minimal */}
                                    <div
                                        className={`
                                        w-24 h-24 
                                        rounded-md
                                        flex items-center justify-center
                                        transition-all duration-300
                                        border-2
                                        ${hasReadyOrders
                                                ? 'bg-orange-500/90 border-orange-600/80 animate-pulse'
                                                : isOccupied
                                                    ? 'bg-rose-500/90 border-rose-600/80'
                                                    : isReserved
                                                        ? 'bg-amber-500/90 border-amber-600/80'
                                                        : 'bg-emerald-500/90 border-emerald-600/80'
                                            }
                                        ${isHovered ? 'shadow-lg shadow-black/20' : 'shadow-md shadow-black/10'}
                                    `}
                                    >
                                        {/* Indicadores de uso en la mesa */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            {/* Círculos decorativos para mesa ocupada */}
                                            {isOccupied && !hasReadyOrders && (
                                                <>
                                                    <div className="absolute w-6 h-6 rounded-full border-2 border-white/30 top-2 left-2"></div>
                                                    <div className="absolute w-5 h-5 rounded-full border-2 border-white/30 bottom-3 right-3"></div>
                                                </>
                                            )}

                                            {/* Líneas para mesa reservada */}
                                            {isReserved && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-px bg-white/40"></div>
                                                    <div className="h-12 w-px bg-white/40"></div>
                                                </div>
                                            )}

                                            {/* Patrón para mesa libre */}
                                            {isFree && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                    <div className="w-16 h-16 border-2 border-white/40 rounded-sm transform rotate-45"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Número de mesa */}
                                        <span
                                            className={`
                                            text-white font-medium text-lg
                                            z-10 relative
                                            transition-all duration-300
                                            ${isHovered ? 'text-shadow shadow-black/50' : ''}
                                        `}
                                        >
                                            {table.numero}
                                        </span>
                                    </div>

                                    {/* Sombra debajo de la mesa */}
                                    <div
                                        className={`
                                        absolute -bottom-1 left-1/2 transform -translate-x-1/2
                                        w-20 h-1.5 rounded-full
                                        transition-all duration-300
                                        ${hasReadyOrders
                                                ? 'bg-orange-900/40'
                                                : isOccupied
                                                    ? 'bg-rose-900/40'
                                                    : isReserved
                                                        ? 'bg-amber-900/40'
                                                        : 'bg-emerald-900/40'
                                            }
                                        ${isHovered ? 'blur-sm w-16 opacity-70' : 'blur-[2px] opacity-50'}
                                    `}
                                    ></div>
                                </div>

                                {/* Información de estado */}
                                <div
                                    className={`
                                    mt-4 
                                    text-xs uppercase 
                                    tracking-wider 
                                    font-medium
                                    transition-all duration-300
                                    ${isHovered ? 'opacity-100' : 'opacity-80'}
                                    ${hasReadyOrders
                                            ? 'text-orange-300'
                                            : isOccupied
                                                ? 'text-rose-300'
                                                : isReserved
                                                    ? 'text-amber-300'
                                                    : 'text-emerald-300'
                                        }
                                `}
                                >
                                    {hasReadyOrders ? 'Pedido Listo' : table.estado}
                                </div>

                                {/* Barra de estado - visible solo en hover */}
                                <div
                                    className={`
                                    w-12 h-0.5 mt-1.5
                                    transition-all duration-300
                                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                                    ${hasReadyOrders
                                            ? 'bg-orange-500'
                                            : isOccupied
                                                ? 'bg-rose-500'
                                                : isReserved
                                                    ? 'bg-amber-500'
                                                    : 'bg-emerald-500'
                                        }
                                `}
                                ></div>
                            </div>

                            {/* Círculo de selección - aparece en hover */}
                            <div
                                className={`
                                absolute -top-1 -right-1
                                w-5 h-5
                                rounded-full
                                flex items-center justify-center
                                transform scale-0
                                transition-all duration-200
                                ${isHovered ? 'scale-100' : ''}
                                ${hasReadyOrders
                                        ? 'bg-orange-700'
                                        : isOccupied
                                            ? 'bg-rose-700'
                                            : isReserved
                                                ? 'bg-amber-700'
                                                : 'bg-emerald-700'
                                    }
                            `}
                            >
                                <span className="text-white text-xs font-bold">+</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TableManagement;
