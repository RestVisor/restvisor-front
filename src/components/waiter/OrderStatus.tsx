import React, { useEffect, useState } from 'react';
import { Order, OrderDetail } from '../../types';
import { getActiveOrdersByTable } from '../../services/api';

interface OrderStatusProps {
    selectedTable: { numero: number } | null;
    currentOrder: Order;
    handleRemoveItem: (orderDetail: OrderDetail) => void;
    calculateTotal: () => string;
    handleSubmitOrder: () => void;
    handlePayOrder: () => Promise<void>;
    menuItems: { id: number; name: string; price: number }[];
    onUpdateDetails?: (details: string) => void;
}

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

    useEffect(() => {
        setDetails(currentOrder.details || '');
    }, [currentOrder]);

    useEffect(() => {
        const fetchTableTotal = async () => {
            if (selectedTable) {
                console.log('Selected table:', selectedTable);
                try {
                    const totalOrder = await getActiveOrdersByTable(selectedTable.numero);
                    console.log('Received total order:', totalOrder);

                    if (totalOrder && totalOrder.orderDetails && totalOrder.orderDetails.length > 0) {
                        console.log('Setting table total order with details:', totalOrder.orderDetails);
                        setTableTotalOrder(totalOrder);
                    } else {
                        console.log('No valid order details found, setting to null');
                        setTableTotalOrder(null);
                    }
                } catch (error) {
                    console.error('Error fetching table total:', error);
                    setTableTotalOrder(null);
                }
            } else {
                console.log('No table selected, clearing table total');
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

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4">Estado del Pedido</h2>
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
                            className={`bg-blue-600 text-white p-2 rounded transition-all duration-200 transform hover:scale-105 w-full mt-4 ${currentOrder.orderDetails.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
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
    );
};

export default OrderStatus;
