import React from 'react';
import { Table } from '../../types';

interface TableMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  onTableSelect: (table: Table) => void;
  selectedTableId?: number | null;
  tablesWithReadyOrders: number[];
}

const TableMapModal: React.FC<TableMapModalProps> = ({ 
  isOpen, 
  onClose, 
  tables,
  onTableSelect,
  selectedTableId,
  tablesWithReadyOrders
}) => {
  if (!isOpen) return null;

  // Helper function to get table status color
  const getTableStatusStyles = (table: Table) => {
    const isSelected = selectedTableId === table.id;
    const hasReadyOrders = tablesWithReadyOrders.includes(table.numero);
    
    if (hasReadyOrders) {
      return {
        bg: "bg-orange-500/90",
        border: "border-orange-400",
        shadow: "shadow-orange-500/30",
        text: "LISTO"
      };
    }
    
    switch (table.estado) {
      case 'ocupada':
        return {
          bg: "bg-rose-500/90",
          border: "border-rose-400",
          shadow: "shadow-rose-500/30",
          text: "OCUPADA"
        };
      case 'reservada':
        return {
          bg: "bg-amber-500/90",
          border: "border-amber-400",
          shadow: "shadow-amber-500/30",
          text: "RESERVADA"
        };
      default:
        return {
          bg: "bg-emerald-500/90",
          border: "border-emerald-400", 
          shadow: "shadow-emerald-500/30",
          text: "LIBRE"
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 p-5 sm:p-6 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-gray-700/80">
        {/* Header with gradient background */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700/80 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 px-5 py-4 sm:px-6 sm:py-4 rounded-t-xl">
          <h3 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            Mapa del Restaurante
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-gray-700/50 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Restaurant Map Container */}
        <div className="flex-grow overflow-auto">
          <div className="relative w-full h-[500px] bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            {/* Restaurant elements */}
            
            {/* Kitchen Area */}
            <div className="absolute top-4 left-4 w-[180px] h-[120px] bg-gray-800/70 border border-gray-600/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto text-yellow-500 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                </svg>
                <p className="text-yellow-500 font-medium text-sm">COCINA</p>
              </div>
            </div>
            
            {/* Bar Area */}
            <div className="absolute bottom-4 left-4 w-[320px] h-[80px] bg-gray-800/70 border border-gray-600/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mx-auto text-blue-400 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <p className="text-blue-400 font-medium text-sm">BARRA</p>
              </div>
            </div>
            
            {/* Entrance */}
            <div className="absolute top-4 right-4 w-[100px] h-[80px] bg-gray-800/70 border border-gray-600/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto text-green-400 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <p className="text-green-400 font-medium text-sm">ENTRADA</p>
              </div>
            </div>
            
            {/* Bathroom */}
            <div className="absolute bottom-4 right-4 w-[100px] h-[80px] bg-gray-800/70 border border-gray-600/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto text-gray-400 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <p className="text-gray-400 font-medium text-sm">BAÑOS</p>
              </div>
            </div>
            
            {/* Dynamic Tables */}
            {tables.map((table, index) => {
              const { bg, border, shadow, text } = getTableStatusStyles(table);
              
              // Calculate positions for a nice layout of 8 tables
              // This creates a layout of tables around the restaurant floor
              let top = "50%";
              let left = "50%";
              let size = "h-[70px] w-[70px]";
              
              // Arrange tables in a specific layout
              if (index === 0) { // Table 1 - Top left
                top = "30%";
                left = "30%";
                size = "h-[90px] w-[90px]"; // Larger table
              } else if (index === 1) { // Table 2 - Top right
                top = "30%";
                left = "70%";
                size = "h-[90px] w-[90px]"; // Larger table
              } else if (index === 2) { // Table 3 - Middle left
                top = "50%";
                left = "22%";
              } else if (index === 3) { // Table 4 - Middle right
                top = "50%";
                left = "78%";
              } else if (index === 4) { // Table 5 - Bottom left
                top = "70%";
                left = "30%";
              } else if (index === 5) { // Table 6 - Bottom right
                top = "70%";
                left = "70%";
              } else if (index === 6) { // Table 7 - Center top
                top = "35%";
                left = "50%";
                size = "h-[60px] w-[60px]"; // Smaller table
              } else if (index === 7) { // Table 8 - Center bottom
                top = "65%";
                left = "50%";
                size = "h-[60px] w-[60px]"; // Smaller table
              }
              
              return (
                <div 
                  key={table.id}
                  onClick={() => onTableSelect(table)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${size} ${bg} ${border} rounded-xl 
                    flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                    shadow-lg ${shadow} hover:scale-110 ${selectedTableId === table.id ? 'ring-4 ring-white' : ''}`}
                  style={{ top, left }}
                >
                  <span className="text-white font-bold text-xl">{table.numero}</span>
                  <span className="text-white text-xs font-medium mt-1">{text}</span>
                </div>
              );
            })}
            
            {/* Decorative elements */}
            <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[180px] h-[100px] border-2 border-dashed border-gray-600/40 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 text-xs">ÁREA CENTRAL</div>
            </div>
            
            {/* Plants decoration */}
            <div className="absolute top-[25%] right-[30%] h-6 w-6 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zm0 15a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM12 6a.75.75 0 01.75.75V12a.75.75 0 01-1.5 0V6.75A.75.75 0 0112 6zm8.25 4.5a.75.75 0 010 1.5h-2.25a.75.75 0 010-1.5h2.25zm-16.5 0a.75.75 0 010 1.5H6a.75.75 0 010-1.5H3.75zm14.346-4.47a.75.75 0 011.06 1.06l-1.59 1.59a.75.75 0 11-1.06-1.06l1.59-1.59zm-12.152 12.15a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06l-1.59-1.59a.75.75 0 010-1.06zm12.152-10.03l-1.59 1.59a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.06zm-10.06 10.03a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 01-1.06-1.06l1.59-1.59a.75.75 0 011.06 0z" />
              </svg>
            </div>
            
            <div className="absolute bottom-[30%] left-[25%] h-6 w-6 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zm0 15a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM12 6a.75.75 0 01.75.75V12a.75.75 0 01-1.5 0V6.75A.75.75 0 0112 6zm8.25 4.5a.75.75 0 010 1.5h-2.25a.75.75 0 010-1.5h2.25zm-16.5 0a.75.75 0 010 1.5H6a.75.75 0 010-1.5H3.75zm14.346-4.47a.75.75 0 011.06 1.06l-1.59 1.59a.75.75 0 11-1.06-1.06l1.59-1.59zm-12.152 12.15a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06l-1.59-1.59a.75.75 0 010-1.06zm12.152-10.03l-1.59 1.59a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.06zm-10.06 10.03a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 01-1.06-1.06l1.59-1.59a.75.75 0 011.06 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Footer with Legend */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-700/50 pt-4">
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-emerald-500/90 mr-2"></div>
            <span className="text-gray-300 text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-rose-500/90 mr-2"></div>
            <span className="text-gray-300 text-sm">Ocupada</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-amber-500/90 mr-2"></div>
            <span className="text-gray-300 text-sm">Reservada</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-orange-500/90 mr-2"></div>
            <span className="text-gray-300 text-sm">Pedido Listo</span>
          </div>
          <div className="flex items-center ml-auto">
            <div className="h-4 w-4 rounded-full ring-4 ring-white mr-2"></div>
            <span className="text-gray-300 text-sm">Seleccionada</span>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold px-4 py-2.5 rounded-lg w-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Cerrar Mapa
        </button>
      </div>
    </div>
  );
};

export default TableMapModal; 
