import React from 'react';
import { Product } from '../../types';

interface MenuSectionProps {
  menuItems: Product[];
  handleAddMenuItem: (product: Product) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, handleAddMenuItem }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-4">Menu</h2>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300"
            onClick={() => handleAddMenuItem(item)}
          >
            <h3 className="text-lg text-white">{item.name}</h3>
            <p className="text-gray-400">{item.description}</p>
            <p className="text-lg font-bold text-white">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;