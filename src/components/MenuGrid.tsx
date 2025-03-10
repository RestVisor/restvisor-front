import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
}

export function MenuGrid({ items, onItemSelect }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`relative p-3 md:p-4 rounded-lg border transition-all ${
            item.available
              ? 'bg-white border-gray-200 hover:border-indigo-500'
              : 'bg-gray-100 border-gray-300 opacity-60'
          }`}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 md:mb-3"
            />
          )}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{item.description}</p>
            </div>
            <span className="ml-2 text-base md:text-lg font-semibold text-indigo-600 whitespace-nowrap">
              ${item.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => onItemSelect(item)}
            disabled={!item.available}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}