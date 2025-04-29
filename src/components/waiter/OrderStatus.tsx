import React from 'react';
import { Order, OrderDetail } from '../../types';

interface OrderStatusProps {
  selectedTable: { numero: number } | null;
  currentOrder: Order;
  handleRemoveItem: (orderDetail: OrderDetail) => void;
  calculateTotal: () => string;
  handleSubmitOrder: () => void;
  handlePayOrder: () => Promise<void>;
  menuItems: { id: number; name: string; price: number }[]; // Definir el tipo de menuItems
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  selectedTable,
  currentOrder,
  handleRemoveItem,
  calculateTotal,
  handleSubmitOrder,
  handlePayOrder,
  menuItems,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-4">Estado del Pedido</h2>
      {selectedTable ? (
        <div>
          <h3 className="text-lg text-white">Mesa {selectedTable.numero} - Pedido</h3>
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

          {/* Total */}
          <div className="text-xl font-semibold text-white mt-4">
            Total: ${calculateTotal()}
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSubmitOrder}
              className="bg-blue-600 text-white p-2 rounded transition-all duration-200 transform hover:scale-105 flex-1"
            >
              Enviar Pedido
            </button>
            <button
              onClick={handlePayOrder}
              className="bg-green-600 text-white p-2 rounded transition-all duration-200 transform hover:scale-105 flex-1"
            >
              Pagar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Selecciona una mesa para comenzar un pedido</p>
      )}
    </div>
  );
};

export default OrderStatus;