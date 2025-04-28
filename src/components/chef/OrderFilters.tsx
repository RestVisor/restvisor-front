import React from 'react';

interface OrderFiltersProps {
    activeFilter: string;
    orderCount: Record<string, number>;
    onFilterChange: (filter: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ activeFilter, orderCount, onFilterChange }) => {
    const filters = [
        { key: 'all', label: 'Todos los Pedidos' },
        { key: 'pending', label: 'Pendientes' },
        { key: 'en preparación', label: 'En Preparación' },
        { key: 'listo', label: 'Listos' },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
            ${activeFilter === filter.key ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    <span>{filter.label}</span>
                    {orderCount[filter.key] > 0 && (
                        <span className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                            {orderCount[filter.key]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default OrderFilters;
