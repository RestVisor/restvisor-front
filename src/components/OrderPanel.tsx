import React from 'react';
import { Order, OrderItem, Table } from '../types';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';

interface OrderPanelProps {
  order: Order;
  table?: Table;
  onUpdateQuantity: (item: OrderItem, newQuantity: number) => void;
  onRemoveItem: (item: OrderItem) => void;
  onSubmitOrder: () => void;
}

export function OrderPanel({
  order,
  table,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}: OrderPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md mx-auto md:mx-0">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          {table ? `Table ${table.number}` : 'New Order'}
        </h2>
        <span className="text-sm text-gray-500">
          {table?.seats} {table?.seats === 1 ? 'seat' : 'seats'}
        </span>
      </div>

      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              {item.notes && (
                <p className="text-xs text-gray-500 italic truncate">{item.notes}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="text-gray-500 hover:text-indigo-600 disabled:opacity-50 p-1"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <span className="w-6 md:w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                className="text-gray-500 hover:text-indigo-600 p-1"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRemoveItem(item)}
                className="text-red-500 hover:text-red-600 ml-1 p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-indigo-600">
            ${order.total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onSubmitOrder}
          disabled={order.items.length === 0}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-transform"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}