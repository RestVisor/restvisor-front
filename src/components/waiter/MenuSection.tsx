import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { getProductStock } from '../../services/productService';

interface MenuSectionProps {
    menuItems: Product[];
    handleAddMenuItem: (product: Product) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, handleAddMenuItem }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter menu items based on search term
    const filteredMenuItems = useMemo(() => {
        if (!searchTerm) return menuItems;
        return menuItems.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [menuItems, searchTerm]);

    // Agrupar productos por categoría (using filtered items)
    const groupedProducts = useMemo(() => {
        return filteredMenuItems.reduce((acc, product) => {
            const category = product.category || 'Sin categoría';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [filteredMenuItems]);

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // Initialize expandedCategories: expand all if no search, otherwise expand categories with results
    useEffect(() => {
        const initialExpanded: Record<string, boolean> = {};
        Object.keys(groupedProducts).forEach(category => {
            initialExpanded[category] = true; // Expand all categories that have items after filtering
        });
        setExpandedCategories(initialExpanded);
    }, [groupedProducts]); // Re-run when groupedProducts changes (due to search)
    

    const [productsStock, setProductsStock] = useState<Record<number, number>>({});

    useEffect(() => {
        const fetchStock = async () => {
            // Only fetch stock for currently visible (filtered) items if performance is an issue
            // For simplicity, fetching for all original menuItems here, assuming not too many unique items overall.
            if (menuItems.length === 0) return;
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
                const defaultStock = menuItems.reduce((acc, product) => {
                    acc[product.id] = product.stock !== undefined ? product.stock : 1; // Use actual stock if available, else default
                    return acc;
                }, {} as Record<number, number>);
                setProductsStock(defaultStock);
            }
        };

        fetchStock();
        const intervalId = setInterval(fetchStock, 5000);
        return () => clearInterval(intervalId);
    }, [menuItems]); // menuItems dependency for stock fetching

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

    const capitalizeCategory = (category: string) => {
        return category.toUpperCase();
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/60 shadow-xl max-h-[calc(100vh-12rem)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">MENÚ</h2>
            
            {/* Search Bar */}
            <div className="mb-6">
                <input 
                    type="text"
                    placeholder="Buscar en el menú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-700/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            {Object.keys(groupedProducts).length === 0 && searchTerm && (
                 <p className="text-gray-400 text-center py-4">No se encontraron productos para "{searchTerm}".</p>
            )}
            
            <div className="space-y-3">
                {Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category} className="bg-gray-700/40 rounded-lg shadow-md">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full p-4 rounded-t-lg text-white text-left flex justify-between items-center transition-colors duration-300 ease-in-out hover:bg-gray-600/50 focus:outline-none"
                        >
                            <span className="font-semibold text-lg tracking-wide">{capitalizeCategory(category)}</span>
                            <span
                                className={`transform transition-transform duration-300 ease-in-out ${expandedCategories[category] ? 'rotate-180' : ''}`}
                            >
                                {/* Chevron Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                        {expandedCategories[category] && (
                            <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 border-t border-gray-600/30">
                                {products.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3 sm:p-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl relative overflow-hidden
                                            ${
                                            productsStock[item.id] === 0
                                                ? 'bg-red-700/30 border border-red-600/50 cursor-not-allowed'
                                                : 'bg-gray-600/50 border border-gray-500/50 hover:bg-blue-600/40 hover:border-blue-500/70 cursor-pointer'
                                        }`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <h3 className="text-md sm:text-lg font-semibold text-white">{item.name}</h3>
                                        {item.description && <p className="text-xs sm:text-sm text-gray-300 mb-1 truncate">{item.description}</p>}
                                        <p className="text-lg sm:text-xl font-bold text-white mt-2">${item.price.toFixed(2)}</p>
                                        
                                        {/* Stock Info Overlay or Badge */}
                                        <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold
                                            ${
                                            productsStock[item.id] === 0 ? 'bg-red-500 text-white' :
                                            productsStock[item.id] > 0 && productsStock[item.id] < 10 ? 'bg-yellow-500 text-black' :
                                            'hidden' // Hide if stock is >= 10 or undefined
                                            }
                                        `}>
                                            {productsStock[item.id] === 0 ? 'Agotado' : 
                                             productsStock[item.id] < 10 ? `Quedan ${productsStock[item.id]}` : ''}
                                        </div>
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
