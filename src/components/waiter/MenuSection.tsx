import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { getProductStock } from '../../services/productService';

interface MenuSectionProps {
    menuItems: Product[];
    handleAddMenuItem: (product: Product) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, handleAddMenuItem }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [productsStock, setProductsStock] = useState<Record<number, number>>({});

    // Get all unique categories
    const categories = useMemo(() => {
        const cats = menuItems.map(item => item.category || 'Sin categoría');
        return [...new Set(cats)];
    }, [menuItems]);
    
    // Set first category as active initially
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    // Filter menu items based on search term and active category
    const filteredItems = useMemo(() => {
        if (!menuItems) return [];
        
        let items = menuItems;
        
        // Apply search filter
        if (searchTerm) {
            items = items.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } 
        // Apply category filter if no search term
        else if (activeCategory) {
            items = items.filter(product => 
                (product.category || 'Sin categoría') === activeCategory
            );
        }
        
        return items;
    }, [menuItems, searchTerm, activeCategory]);

    // Fetch stock data
    useEffect(() => {
        const fetchStock = async () => {
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
                    acc[product.id] = product.stock !== undefined ? product.stock : 1;
                    return acc;
                }, {} as Record<number, number>);
                setProductsStock(defaultStock);
            }
        };

        fetchStock();
        const intervalId = setInterval(fetchStock, 10000);
        return () => clearInterval(intervalId);
    }, [menuItems]);

    const handleItemClick = (product: Product) => {
        if (productsStock[product.id] > 0) {
            handleAddMenuItem(product);
        }
    };

    // Helper function to get stock level styles
    const getStockStyles = (stockLevel: number) => {
        if (stockLevel <= 0) {
            return {
                bgGradient: 'from-red-950/40 to-red-900/20',
                border: 'border-red-800/40',
                cursor: 'cursor-not-allowed opacity-70',
                color: 'text-red-500',
                badge: 'bg-red-600'
            };
        } else if (stockLevel < 3) { 
            return {
                bgGradient: 'from-gray-700/40 to-gray-800/60',
                border: 'border-amber-600/40',
                cursor: 'cursor-pointer hover:border-blue-500/50 hover:from-blue-900/30 hover:to-blue-800/20',
                color: 'text-amber-500',
                badge: 'bg-amber-500'
            };
        } else if (stockLevel < 5) {
            return {
                bgGradient: 'from-gray-700/40 to-gray-800/60',
                border: 'border-yellow-600/30',
                cursor: 'cursor-pointer hover:border-blue-500/50 hover:from-blue-900/30 hover:to-blue-800/20',
                color: 'text-yellow-500',
                badge: 'bg-yellow-500/90'
            };
        } else {
            return {
                bgGradient: 'from-gray-700/40 to-gray-800/60',
                border: 'border-gray-600/30',
                cursor: 'cursor-pointer hover:border-blue-500/50 hover:from-blue-900/30 hover:to-blue-800/20',
                color: 'text-gray-400',
                badge: 'bg-emerald-500/80'
            };
        }
    };

    return (
        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700/60 shadow-xl overflow-hidden h-full flex flex-col">
            {/* Header with Search */}
            <div className="p-3 bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-b border-gray-700/60">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white tracking-wide flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        MENÚ
                    </h2>
                    <div className="relative w-36">
                        <input 
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-1 px-2 bg-gray-900/70 border border-gray-600/50 rounded-md text-white placeholder-gray-400 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-1 top-1 text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Category Pills */}
                {!searchTerm && (
                    <div className="flex overflow-x-auto pb-1 hide-scrollbar space-x-1">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-2 py-1 rounded-full text-xs whitespace-nowrap font-medium transition-all duration-200 ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Menu Items Grid */}
            <div className="flex-grow overflow-y-auto p-2 grid grid-cols-2 gap-2 bg-gradient-to-b from-gray-800/20 to-gray-900/40">
                {filteredItems.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <p className="text-gray-400 text-sm text-center">
                            {searchTerm ? `No se encontraron productos para "${searchTerm}"` : 'No hay productos en esta categoría'}
                        </p>
                    </div>
                )}
                
                {filteredItems.map((item) => {
                    const stockLevel = productsStock[item.id] || 0;
                    const isOutOfStock = stockLevel === 0;
                    const stockStyles = getStockStyles(stockLevel);
                    
                    return (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`relative overflow-hidden group rounded-lg transition-all duration-200 ${
                                stockStyles.bgGradient
                            } border ${stockStyles.border} ${stockStyles.cursor} p-2 flex flex-col justify-between`}
                        >
                            {/* Product Name & Price */}
                            <div>
                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                                    {item.name}
                                </h3>
                                {item.description && (
                                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                                )}
                            </div>
                            
                            {/* Price & Add Button */}
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm font-bold text-white">${item.price.toFixed(2)}</p>
                                
                                {!isOutOfStock && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Enhanced Stock Indicator */}
                            <div className="absolute top-0 right-0 flex items-center">
                                {/* Stock Badge */}
                                <span className={`flex items-center justify-center ${stockStyles.badge} text-white text-xs px-1.5 py-0.5 rounded-bl-md font-medium`}>
                                    {isOutOfStock ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                                            <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0016.5 2h-11zM10 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                                            <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                    )}
                                    {isOutOfStock ? 'Sin stock' : stockLevel}
                                </span>
                            </div>
                            
                            {/* Add item animation */}
                            <div className="absolute inset-0 bg-blue-500/20 pointer-events-none opacity-0 
                                group-hover:opacity-100 transition-opacity rounded-lg">
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Custom CSS */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default MenuSection;
