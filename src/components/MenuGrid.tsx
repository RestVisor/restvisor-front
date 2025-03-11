import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
}

export function MenuGrid({ items, onItemSelect }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="menu-item-card">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          )}
          <span className="price-tag">${item.price.toFixed(2)}</span>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`status-badge ${item.available ? 'available' : 'occupied'}`}>
                {item.available ? 'In Stock' : 'Out of Stock'}
              </span>
              <button
                onClick={() => onItemSelect(item)}
                disabled={!item.available}
                className="btn btn-icon btn-primary disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}