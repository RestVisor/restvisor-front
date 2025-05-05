import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { getProductStock } from '../../services/productService';

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
        }, {} as Record<string, boolean>),
    );

    const [productsStock, setProductsStock] = useState<Record<number, number>>({});

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const stockPromises = menuItems.map(async (product) => {
                    const stock = await getProductStock(product.id);
                    return { id: product.id, stock };
                });

                const stockResults = await Promise.all(stockPromises);
                const newStockState = stockResults.reduce((acc, { id, stock }) => {
                    acc[id] = stock;
                    return acc;
                }, {} as Record<number, number>);

                setProductsStock(newStockState);
            } catch (error) {
                console.error('Error al cargar el stock:', error);
                // En caso de error, inicializar con stock por defecto
                const defaultStock = menuItems.reduce((acc, product) => {
                    acc[product.id] = 1;
                    return acc;
                }, {} as Record<number, number>);
                setProductsStock(defaultStock);
            }
        };

        // Realizar la primera verificación inmediatamente
        fetchStock();

        // Configurar el intervalo para verificar cada 6 segundos
        const intervalId = setInterval(fetchStock, 5000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, [menuItems]);

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleItemClick = (product: Product) => {
        if (productsStock[product.id] > 0) {
            handleAddMenuItem(product);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4">MENÚ</h2>
            <div className="space-y-2">
                {Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category} className="bg-gray-700/50 rounded-lg">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full p-4 rounded-lg text-white text-left flex justify-between items-center transition-all duration-500 ease-in-out hover:bg-gray-600/50"
                        >
                            <span className="font-medium">{category}</span>
                            <span
                                className={`transform transition-transform duration-500 ease-in-out ${
                                    expandedCategories[category] ? 'rotate-180' : 'rotate-0'
                                }`}
                            >
                                ▼
                            </span>
                        </button>
                        {expandedCategories[category] && (
                            <div className="p-4 grid grid-cols-2 gap-4">
                                {products.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${
                                            productsStock[item.id] === 0
                                                ? 'cursor-not-allowed bg-red-900/50'
                                                : 'cursor-pointer bg-gray-600/50 hover:bg-gray-500/50'
                                        }`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <h3 className="text-lg text-white">{item.name}</h3>
                                        <p className="text-gray-300">{item.description}</p>
                                        <p className="text-lg font-bold text-white mt-2">${item.price.toFixed(2)}</p>
                                        {productsStock[item.id] === 0 && (
                                            <p className="text-red-300 text-sm mt-2">Agotado</p>
                                        )}
                                        {productsStock[item.id] > 0 && productsStock[item.id] < 10 && (
                                            <p className="text-red-300 text-sm mt-2">
                                                Quedan {productsStock[item.id]} unidades
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuSection;
