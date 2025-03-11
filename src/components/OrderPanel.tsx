import React from 'react';
import { Order, OrderItem, Table } from '../types';
import { Trash2, MinusCircle, PlusCircle, Receipt } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {table ? `Table ${table.number}` : 'New Order'}
            </h2>
            {table && (
              <p className="text-sm text-gray-500">
                {table.seats} {table.seats === 1 ? 'seat' : 'seats'}
              </p>
            )}
          </div>
          <Receipt className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              {item.notes && (
                <p className="text-xs text-gray-500 italic truncate">{item.notes}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="btn btn-icon btn-ghost disabled:opacity-50"
              >
                <MinusCircle className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                className="btn btn-icon btn-ghost"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemoveItem(item)}
                className="btn btn-icon btn-destructive ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {order.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No items added yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${order.total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onSubmitOrder}
          disabled={order.items.length === 0}
          className="btn btn-primary w-full"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}