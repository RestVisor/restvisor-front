// src/components/MenuGrid.tsx
import React from 'react';
import { Product } from '../types';

interface MenuGridProps {
  items: Product[];
  onItemSelect: (product: Product) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, onItemSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemSelect(item)}
          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200"
        >
          <img src={`https://via.placeholder.com/150`} alt={item.name} className="w-full h-32 object-cover mb-2" />
          <h3 className="font-semibold">{item.name}</h3>
          <p>{item.description}</p>
          <span className="text-lg font-bold">${item.price}</span>
        </div>
      ))}
    </div>
  );
};

export { MenuGrid };