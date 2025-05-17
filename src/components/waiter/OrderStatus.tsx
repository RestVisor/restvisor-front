import React, { useEffect, useState } from 'react';
import { Order, OrderDetail, Product, ExtendedOrder, ExtendedOrderDetail } from '../../types';
import { getActiveOrdersByTable, getTableHistoryForTodayAPI } from '../../services/api';

interface OrderStatusProps {
    selectedTable: { numero: number } | null;
    currentOrder: Order;
    handleRemoveItem: (orderDetail: OrderDetail) => void;
    calculateTotal: () => string;
    handleSubmitOrder: () => void;
    handlePayOrder: () => Promise<void>;
    menuItems: Product[];
    onUpdateDetails?: (details: string) => void;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ExtendedOrder[];
    menuItems: Product[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, menuItems }) => {
    if (!isOpen) return null;

    // Console log to debug structure
    console.log("History data in modal:", history);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-5 sm:p-6 rounded-xl shadow-2xl max-w-lg md:max-w-xl w-full max-h-[85vh] flex flex-col border border-gray-700">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">Historial de Hoy</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors text-3xl">&times;</button>
                </div>
                <div className="overflow-y-auto flex-grow pr-2 space-y-3">
                    {!history || history.length === 0 ? (
                        <p className="text-gray-400 text-center py-5">No hay historial para esta mesa hoy.</p>
                    ) : (
                        history.map(order => {
                            // Determine which property has the order details 
                            const orderItems = order.orderDetails || order.order_details || [];
                            console.log("Order items:", orderItems);
                            
                            // Generate a unique key for the order, fallback to a safer value if id is undefined
                            const orderKey = order.id ? (typeof order.id === 'string' ? order.id : order.id.toString()) : `order-${Math.random().toString(36).substring(2, 9)}`;
                            
                            return (
                                <div key={orderKey} className="bg-gray-700/60 p-3 sm:p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            Pedido: <span className="font-medium text-white">
                                                {typeof order.id === 'string' 
                                                  ? (order.id as string).substring(0, 8) 
                                                  : (order.id 
                                                      ? String(order.id).substring(0, 8) 
                                                      : 'N/A')}
                                            </span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            Hora: <span className="font-medium text-white">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </p>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                                            order.status === 'pagado' ? 'bg-green-500/80 text-white' :
                                            order.status === 'entregado' ? 'bg-blue-500/80 text-white' :
                                            order.status === 'cancelado' ? 'bg-red-500/80 text-white' :
                                            'bg-yellow-600/80 text-white'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <ul className="mb-1.5 space-y-0.5">
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
                                                <li key={detailKey} className="text-sm text-gray-300 flex justify-between items-center">
                                                    <span>{productName} <span className="text-gray-400 text-xs">x</span> {detail.cantidad}</span>
                                                    <span className="text-gray-200 font-medium">${(productPrice * detail.cantidad).toFixed(2)}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <p className="text-right font-semibold text-white text-md border-t border-gray-600/70 pt-1.5 mt-1.5">
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
                                    {order.details && (
                                        <p className="text-xs text-gray-400/80 mt-1 pt-1 border-t border-gray-600/50">
                                            Notas: <span className="italic">{order.details}</span>
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
}) => {
    const [tableTotalOrder, setTableTotalOrder] = useState<Order | null>(null);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [details, setDetails] = useState(currentOrder.details || '');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [tableHistory, setTableHistory] = useState<ExtendedOrder[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        setDetails(currentOrder.details || '');
    }, [currentOrder]);

    useEffect(() => {
        const fetchTableTotal = async () => {
            if (selectedTable) {
                try {
                    const totalOrder = await getActiveOrdersByTable(selectedTable.numero);
                    if (totalOrder && totalOrder.orderDetails && totalOrder.orderDetails.length > 0) {
                        setTableTotalOrder(totalOrder);
                    } else {
                        setTableTotalOrder(null);
                    }
                } catch (error) {
                    console.error('Error fetching table total:', error);
                    setTableTotalOrder(null);
                }
            } else {
                setTableTotalOrder(null);
            }
        };

        fetchTableTotal();
    }, [selectedTable]);

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
            console.log("Fetching history for table", selectedTable.numero);
            const history = await getTableHistoryForTodayAPI(selectedTable.numero);
            console.log("History received:", history);
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
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <h2 className="text-xl font-semibold text-white mb-4 flex justify-between items-center">
                    <span>Estado del Pedido</span>
                    {selectedTable && (
                        <button
                            onClick={handleViewHistory}
                            disabled={isLoadingHistory}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {isLoadingHistory ? 'Cargando...' : 'Ver Historial Hoy'}
                        </button>
                    )}
                </h2>
                {selectedTable ? (
                    <div>
                        <div className="mb-8">
                            <h3 className="text-lg text-white">Mesa {selectedTable.numero} - Pedido Actual</h3>

                            {/* Sección de detalles del pedido */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white">Detalles para cocina:</h4>
                                    <button
                                        onClick={() => setIsEditingDetails(!isEditingDetails)}
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        {isEditingDetails ? 'Cancelar' : 'Editar'}
                                    </button>
                                </div>
                                {isEditingDetails ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={details}
                                            onChange={(e) => setDetails(e.target.value)}
                                            className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                            placeholder="Escribe las indicaciones para cocina..."
                                            rows={3}
                                        />
                                        <button
                                            onClick={handleDetailsSubmit}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                                        {details || 'Sin indicaciones especiales'}
                                    </p>
                                )}
                            </div>

                            <ul>
                                {currentOrder.orderDetails.map((orderDetail) => (
                                    <li key={orderDetail.id} className="flex justify-between items-center text-white">
                                        <span>
                                            {menuItems.find((item) => item.id === orderDetail.producto_id)?.name}
                                            {orderDetail.cantidad > 1 ? ` x${orderDetail.cantidad}` : ''}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveItem(orderDetail)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="text-xl font-semibold text-white mt-4">Total: ${calculateTotal()}</div>

                            <button
                                onClick={handleSubmitOrder}
                                disabled={currentOrder.orderDetails.length === 0}
                                className={`bg-blue-600 text-white p-2 rounded transition-all duration-200 transform hover:scale-105 w-full mt-4 ${
                                    currentOrder.orderDetails.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Enviar Pedido
                            </button>
                        </div>

                        {tableTotalOrder && tableTotalOrder.orderDetails && tableTotalOrder.orderDetails.length > 0 && (
                            <div className="mt-8 border-t border-gray-700 pt-4">
                                <h3 className="text-lg text-white mb-4">Total de la Mesa</h3>
                                <ul>
                                    {tableTotalOrder.orderDetails.map((detail: OrderDetail) => (
                                        <li key={detail.id} className="flex justify-between items-center text-gray-400">
                                            <span>
                                                {menuItems.find((item) => item.id === detail.producto_id)?.name}
                                                {detail.cantidad > 1 ? ` x${detail.cantidad}` : ''}
                                            </span>
                                            <span>
                                                $
                                                {(menuItems.find((item) => item.id === detail.producto_id)?.price || 0) *
                                                    detail.cantidad}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-xl font-semibold text-white mt-4">
                                    Total: $
                                    {tableTotalOrder.orderDetails
                                        .reduce((sum: number, detail: OrderDetail) => {
                                            const item = menuItems.find((item) => item.id === detail.producto_id);
                                            return sum + (item ? item.price * detail.cantidad : 0);
                                        }, 0)
                                        .toFixed(2)}
                                </div>
                                <button
                                    onClick={handlePayOrder}
                                    className="bg-green-600 text-white p-2 rounded transition-all duration-200 transform hover:scale-105 w-full mt-4"
                                >
                                    Pagar
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">Selecciona una mesa para iniciar un pedido</p>
                )}
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
