import React, { useState } from 'react';
import { Product } from '../../types';

interface MenuSectionProps {
  menuItems: Product[];
  handleAddMenuItem: (product: Product) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, handleAddMenuItem }) => {
  // Agrupar productos por categoría
  const groupedProducts = menuItems.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Estado para controlar qué categorías están expandidas
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(groupedProducts).reduce((acc, category) => {
      acc[category] = true; // Por defecto, todas las categorías están expandidas
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-4">Menú</h2>
      <div className="space-y-2">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="bg-gray-700/50 rounded-lg">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full p-4 rounded-lg text-white text-left flex justify-between items-center transition-all duration-500 ease-in-out hover:bg-gray-600/50"
            >
              <span className="font-medium">{category}</span>
              <span className={`transform transition-transform duration-500 ease-in-out ${expandedCategories[category] ? 'rotate-180' : 'rotate-0'}`}>
                ▼
              </span>
            </button>
            <div
              className={`transition-all duration-500 ease-in-out origin-top ${
                expandedCategories[category]
                  ? 'opacity-100 max-h-[2000px] scale-y-100'
                  : 'opacity-0 max-h-0 scale-y-95'
              }`}
            >
              <div className="p-4 grid grid-cols-2 gap-4">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg cursor-pointer bg-gray-600/50 hover:bg-gray-500/50 transition-all duration-300 transform hover:scale-102 hover:shadow-lg"
                    onClick={() => handleAddMenuItem(item)}
                  >
                    <h3 className="text-lg text-white">{item.name}</h3>
                    <p className="text-gray-300">{item.description}</p>
                    <p className="text-lg font-bold text-white mt-2">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;