import React from 'react';
import { Order } from '../../services/chefService';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: number, status: string) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
    // Get the next status based on current status
    const getNextStatus = (currentStatus: string): string => {
        switch (currentStatus) {
            case 'pending':
                return 'en preparación';
            case 'en preparación':
                return 'listo';
            case 'listo':
                return 'entregado';
            default:
                return currentStatus;
        }
    };

    // Get button text based on current status
    const getButtonText = (currentStatus: string): string => {
        switch (currentStatus) {
            case 'pending':
                return 'Comenzar Preparación';
            case 'en preparación':
                return 'Marcar como Listo';
            case 'listo':
                return 'Marcar como Entregado';
            default:
                return 'Actualizar Estado';
        }
    };

    // Get status badge styling
    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'en preparación':
                return 'bg-blue-500';
            case 'listo':
                return 'bg-green-500';
            case 'entregado':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Get status text in Spanish
    const getStatusText = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'en preparación':
                return 'En Preparación';
            case 'listo':
                return 'Listo';
            case 'entregado':
                return 'Entregado';
            default:
                return status;
        }
    };

    // Check if we can update the status
    const canUpdateStatus = order.status !== 'entregado';

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 transition-all duration-300 hover:bg-gray-700/50">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">Mesa {order.tables?.numero || order.tableNumber}</h3>
                <span
                    className={`${getStatusBadgeClass(
                        order.status,
                    )} text-white text-xs px-2 py-1 rounded-full font-medium`}
                >
                    {getStatusText(order.status)}
                </span>
                
            </div>
            <span className="text-md font-medium text-white"> 
                Detalles: <br/>
                <span className="text-gray-400 mb-2">
                    {order.details}
                </span>
            </span>        
            <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">
                    ID Pedido: {order.id} • Creado: {new Date(order.created_at).toLocaleString()}
                </p>
                <ul className="space-y-2 text-gray-300 mb-4">
                    {order.order_details.map((item) => (
                        <li key={item.id} className="flex justify-between">
                            <span>
                                {item.cantidad}x {item.products.name}
                            </span>
                            <span className="text-gray-400">${item.products.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {canUpdateStatus && (
                <button
                    onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                >
                    {getButtonText(order.status)}
                </button>
            )}
        </div>
    );
};

export default OrderCard;
