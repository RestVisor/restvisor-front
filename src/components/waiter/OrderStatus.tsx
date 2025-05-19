import React, { useEffect, useState } from 'react';
import { Order, OrderDetail, Product, ExtendedOrder, ExtendedOrderDetail } from '../../types';
import { getActiveOrdersByTable, getTableHistoryForTodayAPI } from '../../services/api';
import { generateReceiptPDF } from '../../utils/receiptGenerator';

interface OrderStatusProps {
    selectedTable: { numero: number } | null;
    currentOrder: Order;
    handleRemoveItem: (orderDetail: OrderDetail) => void;
    calculateTotal: () => string;
    handleSubmitOrder: () => void;
    handlePayOrder: () => Promise<void>;
    menuItems: Product[];
    onUpdateDetails?: (details: string) => void;
    setTableTotalOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ExtendedOrder[];
    menuItems: Product[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, menuItems }) => {
    if (!isOpen) return null;

    const handleDownloadReceipt = (order: ExtendedOrder) => {
        // Determine which property has the order details 
        const orderItems = order.orderDetails || order.order_details || [];
        
        // Calculate the total amount
        const totalAmount = orderItems.reduce((sum, detail: OrderDetail | ExtendedOrderDetail) => {
            const productId = detail.producto_id;
            const extendedDetail = detail as ExtendedOrderDetail;
            const productFromDetail = extendedDetail.products || extendedDetail.product || null;
            const productPrice = productFromDetail?.price || 
                menuItems.find(item => item.id === productId)?.price || 
                0;
            return sum + (productPrice * detail.cantidad);
        }, 0).toFixed(2);
        
        // Generate the PDF receipt
        const receiptUrl = generateReceiptPDF(
            order.tableNumber, 
            orderItems as OrderDetail[],
            menuItems,
            totalAmount
        );
        
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = receiptUrl;
        downloadLink.download = `ticket-mesa-${order.tableNumber}-${new Date().getTime()}.pdf`;
        
        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Revoke the blob URL to free up memory
        setTimeout(() => URL.revokeObjectURL(receiptUrl), 100);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/90 p-5 sm:p-6 rounded-xl shadow-2xl max-w-lg md:max-w-xl w-full max-h-[85vh] flex flex-col border border-gray-700/80">
                {/* Header with gradient background */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700/80 bg-gradient-to-r from-blue-900/60 to-purple-900/60 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 px-5 py-4 sm:px-6 sm:py-4 rounded-t-xl">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Historial de Hoy
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
                
                {/* Order History List */}
                <div className="overflow-y-auto flex-grow pr-2 space-y-3">
                    {!history || history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-500/70">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-center">No hay historial para esta mesa hoy.</p>
                        </div>
                    ) : (
                        history.map(order => {
                            // Determine which property has the order details 
                            const orderItems = order.orderDetails || order.order_details || [];
                            
                            // Generate a unique key for the order, fallback to a safer value if id is undefined
                            const orderKey = order.id ? (typeof order.id === 'string' ? order.id : order.id.toString()) : `order-${Math.random().toString(36).substring(2, 9)}`;
                            
                            return (
                                <div key={orderKey} className="bg-gradient-to-br from-gray-700/60 to-gray-800/80 p-3 sm:p-4 rounded-lg border border-gray-600/40 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-500/30">
                                    <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            <span className="text-gray-500 mr-1">#</span> 
                                            <span className="font-medium text-white">
                                                {typeof order.id === 'string' 
                                                  ? (order.id as string).substring(0, 8) 
                                                  : (order.id 
                                                      ? String(order.id).substring(0, 8) 
                                                      : 'N/A')}
                                            </span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-300 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium text-white">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </p>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize flex items-center ${
                                            order.status === 'pagado' ? 'bg-green-500/80 text-white' :
                                            order.status === 'entregado' ? 'bg-blue-500/80 text-white' :
                                            order.status === 'cancelado' ? 'bg-red-500/80 text-white' :
                                            'bg-yellow-600/80 text-white'
                                        }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {order.status}
                                        </span>
                                    </div>
                                    <ul className="mb-1.5 space-y-1">
                                        {orderItems.map((detail: OrderDetail | ExtendedOrderDetail) => {
                                            // Generate a unique key for the detail item, fallback to a safer value if id is undefined
                                            const detailKey = detail.id ? (typeof detail.id === 'string' ? detail.id : detail.id.toString()) : `detail-${Math.random().toString(36).substring(2, 9)}`;
                                            
                                            // Get product details through various potential paths
                                            const productId = detail.producto_id;
                                            
                                            // Check if product info is embedded in the detail
                                            const extendedDetail = detail as ExtendedOrderDetail;
                                            const productFromDetail = extendedDetail.products || extendedDetail.product || null;
                                            
                                            // Name: try embedded product first, then menu lookup
                                            const productName = productFromDetail?.name || 
                                                menuItems.find(item => item.id === productId)?.name || 
                                                "Producto desconocido";
                                            
                                            // Price: try embedded product first, then menu lookup
                                            const productPrice = productFromDetail?.price || 
                                                menuItems.find(item => item.id === productId)?.price || 
                                                0;

                                            return (
                                                <li key={detailKey} className="text-sm text-gray-300 flex justify-between items-center bg-gray-800/30 px-2.5 py-1.5 rounded-md">
                                                    <span>{productName} <span className="text-gray-400 text-xs">×</span> {detail.cantidad}</span>
                                                    <span className="text-gray-200 font-medium">${(productPrice * detail.cantidad).toFixed(2)}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div className="flex justify-between items-center border-t border-gray-600/70 pt-1.5 mt-1.5">
                                        <button
                                            onClick={() => handleDownloadReceipt(order)}
                                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-2 py-1 rounded flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            Ticket
                                        </button>
                                        <p className="text-right font-semibold text-white text-md">
                                            Total: $
                                            {orderItems.reduce((sum, detail: OrderDetail | ExtendedOrderDetail) => {
                                                const productId = detail.producto_id;
                                                
                                                // Check if product info is embedded in the detail
                                                const extendedDetail = detail as ExtendedOrderDetail;
                                                const productFromDetail = extendedDetail.products || extendedDetail.product || null;
                                                
                                                const productPrice = productFromDetail?.price || 
                                                    menuItems.find(item => item.id === productId)?.price || 
                                                    0;
                                                return sum + (productPrice * detail.cantidad);
                                            }, 0).toFixed(2)}
                                        </p>
                                    </div>
                                    {order.details && (
                                        <p className="text-xs text-gray-400/80 mt-1 pt-1 border-t border-gray-600/50 italic">
                                            <span className="not-italic font-medium">Notas:</span> {order.details}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* Footer with Button */}
                <button
                    onClick={onClose}
                    className="mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg w-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Cerrar Historial
                </button>
            </div>
        </div>
    );
};

const OrderStatus: React.FC<OrderStatusProps> = ({
    selectedTable,
    currentOrder,
    handleRemoveItem,
    calculateTotal,
    handleSubmitOrder,
    handlePayOrder,
    menuItems,
    onUpdateDetails,
    setTableTotalOrder,
}) => {
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [details, setDetails] = useState(currentOrder.details || '');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [tableHistory, setTableHistory] = useState<ExtendedOrder[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [localTableTotalOrder, setLocalTableTotalOrder] = useState<Order | null>(null);

    useEffect(() => {
        setDetails(currentOrder.details || '');
    }, [currentOrder]);

    useEffect(() => {
        const fetchTableTotal = async () => {
            if (selectedTable) {
                try {
                    const totalOrder = await getActiveOrdersByTable(selectedTable.numero);
                    if (totalOrder && totalOrder.orderDetails && totalOrder.orderDetails.length > 0) {
                        setLocalTableTotalOrder(totalOrder);
                        setTableTotalOrder(totalOrder);
                    } else {
                        setLocalTableTotalOrder(null);
                        setTableTotalOrder(null);
                    }
                } catch (error) {
                    console.error('Error fetching table total:', error);
                    setLocalTableTotalOrder(null);
                    setTableTotalOrder(null);
                }
            } else {
                setLocalTableTotalOrder(null);
                setTableTotalOrder(null);
            }
        };

        fetchTableTotal();
    }, [selectedTable, setTableTotalOrder]);

    const handleDetailsSubmit = () => {
        if (onUpdateDetails) {
            onUpdateDetails(details);
        }
        setIsEditingDetails(false);
    };

    const handleViewHistory = async () => {
        if (!selectedTable) return;
        
        setIsLoadingHistory(true);
        try {
            const history = await getTableHistoryForTodayAPI(selectedTable.numero);
            setTableHistory(history as ExtendedOrder[]);
            setIsHistoryModalOpen(true);
        } catch (error) {
            console.error("Error fetching table history:", error);
            setTableHistory([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    return (
        <>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700/60 shadow-xl overflow-hidden h-full flex flex-col">
                {/* Header with title and history button */}
                <div className="p-3 bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-b border-gray-700/60">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white tracking-wide flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                            ESTADO DEL PEDIDO
                        </h2>
                        {selectedTable && (
                            <button
                                onClick={handleViewHistory}
                                disabled={isLoadingHistory}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center disabled:opacity-50"
                            >
                                {isLoadingHistory ? (
                                    <>
                                        <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cargando...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                        </svg>
                                        Ver Historial Hoy
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Main content area with overflow */}
                <div className="p-4 overflow-y-auto flex-grow">
                    {selectedTable ? (
                        <div className="space-y-6">
                            {/* Current Order Section */}
                            <div className="space-y-3">
                                <h3 className="text-md text-white font-medium flex items-center">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/70 text-xs mr-2">
                                        {selectedTable.numero}
                                    </span>
                                    Pedido Actual
                                </h3>

                                {/* Order details section */}
                                <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-white text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-blue-400">
                                                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0-3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 13.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                            </svg>
                                            Instrucciones:
                                        </h4>
                                        <button
                                            onClick={() => setIsEditingDetails(!isEditingDetails)}
                                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-0.5">
                                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                            </svg>
                                            {isEditingDetails ? 'Cancelar' : 'Editar'}
                                        </button>
                                    </div>
                                    {isEditingDetails ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm"
                                                placeholder="Escribe las instrucciones para cocina..."
                                                rows={2}
                                            />
                                            <button
                                                onClick={handleDetailsSubmit}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs w-full transition-colors"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 bg-gray-800/20 p-2 rounded-lg text-sm min-h-[40px]">
                                            {details || 'Sin indicaciones especiales'}
                                        </p>
                                    )}
                                </div>

                                {/* Order Items List */}
                                {currentOrder.orderDetails.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-400 flex justify-between px-2">
                                            <span>Producto</span>
                                            <span>Acción</span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {currentOrder.orderDetails.map((orderDetail) => {
                                                const product = menuItems.find(item => item.id === orderDetail.producto_id);
                                                return (
                                                    <li key={orderDetail.id} 
                                                        className="flex justify-between items-center text-white bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-md transition-colors">
                                                        <span className="text-sm">
                                                            {product?.name || 'Producto desconocido'}
                                                            {orderDetail.cantidad > 1 ? 
                                                                <span className="text-xs text-gray-400 ml-1">×{orderDetail.cantidad}</span> : 
                                                                ''}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveItem(orderDetail)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 rounded-full transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-400 bg-gray-800/20 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mb-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">Agrega productos del menú</p>
                                    </div>
                                )}

                                {/* Total and Submit Button */}
                                <div className="space-y-2">
                                    <div className="text-xl font-semibold text-white flex justify-between items-center bg-gray-700/30 p-2 rounded-lg border border-gray-600/30">
                                        <span className="text-gray-300 text-sm">Total:</span>
                                        <span className="text-white">${calculateTotal()}</span>
                                    </div>

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={currentOrder.orderDetails.length === 0}
                                        className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2.5 rounded-lg transition-all w-full font-medium text-sm
                                            ${currentOrder.orderDetails.length === 0 ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02] active:scale-[0.98]'}`}
                                    >
                                        Enviar Pedido
                                    </button>
                                </div>
                            </div>

                            {/* Table Total Section (when present) */}
                            {localTableTotalOrder && localTableTotalOrder.orderDetails && localTableTotalOrder.orderDetails.length > 0 && (
                                <div className="mt-6 border-t border-gray-700/50 pt-4 space-y-3">
                                    <h3 className="text-md text-white font-medium flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1.5 text-green-400">
                                            <path fillRule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clipRule="evenodd" />
                                        </svg>
                                        Total de la Mesa {selectedTable.numero}
                                    </h3>
                                    
                                    <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30 space-y-2">
                                        {/* Items List */}
                                        <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                            {localTableTotalOrder.orderDetails.map((detail: OrderDetail) => {
                                                const product = menuItems.find(item => item.id === detail.producto_id);
                                                const itemTotal = (product?.price || 0) * detail.cantidad;
                                                
                                                return (
                                                    <li key={detail.id} className="flex justify-between items-center text-gray-300 bg-gray-800/30 p-2 rounded-md text-sm">
                                                        <span>
                                                            {product?.name || 'Producto desconocido'}
                                                            <span className="text-xs text-gray-400 ml-1">
                                                                {detail.cantidad > 1 ? `×${detail.cantidad}` : ''}
                                                            </span>
                                                        </span>
                                                        <span className="font-medium text-gray-200">${itemTotal.toFixed(2)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        
                                        {/* Total */}
                                        <div className="flex justify-between items-center border-t border-gray-600/50 pt-2 text-lg font-semibold text-white">
                                            <span className="text-gray-300 text-sm">Total Mesa:</span>
                                            <span>${
                                                localTableTotalOrder.orderDetails
                                                    .reduce((sum: number, detail: OrderDetail) => {
                                                        const product = menuItems.find(item => item.id === detail.producto_id);
                                                        return sum + (product ? product.price * detail.cantidad : 0);
                                                    }, 0)
                                                    .toFixed(2)
                                            }</span>
                                        </div>
                                        
                                        {/* Pay Button */}
                                        <button
                                            onClick={handlePayOrder}
                                            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white p-2.5 rounded-lg transition-all duration-200 w-full font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98] mt-2"
                                        >
                                            Pagar Mesa
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 mb-3 text-gray-500/70">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                            <p className="text-center">Selecciona una mesa para iniciar un pedido</p>
                        </div>
                    )}
                </div>
            </div>
            
            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                history={tableHistory} 
                menuItems={menuItems}
            />
        </>
    );
};

export default OrderStatus;
