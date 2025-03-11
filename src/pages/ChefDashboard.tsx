import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Order, OrderItem } from '../types';
import { Timer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function ChefDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      tableNumber: 1,
      items: [
        {
          id: '1',
          name: 'Classic Burger',
          price: 12.99,
          category: 'main',
          available: true,
          quantity: 2,
          estimatedPrepTime: 15,
        },
        {
          id: '2',
          name: 'French Fries',
          price: 4.99,
          category: 'sides',
          available: true,
          quantity: 2,
          estimatedPrepTime: 8,
        },
      ],
      status: 'pending',
      total: 35.96,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const startPreparation = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'preparing',
          items: order.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                startedAt: new Date(),
              };
            }
            return item;
          }),
        };
      }
      return order;
    }));
  };

  const completeItem = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              completedAt: new Date(),
            };
          }
          return item;
        });

        // Check if all items are completed
        const allCompleted = updatedItems.every(item => item.completedAt);
        
        return {
          ...order,
          status: allCompleted ? 'ready' : 'preparing',
          items: updatedItems,
          actualCompletionTime: allCompleted ? new Date() : undefined,
          chefName: user?.name,
        };
      }
      return order;
    }));
  };

  const addPreparationNote = (orderId: string, note: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          preparationNotes: note,
        };
      }
      return order;
    }));
  };

  const calculateProgress = (item: OrderItem) => {
    if (!item.startedAt) return 0;
    if (item.completedAt) return 100;
    
    const elapsed = Date.now() - item.startedAt.getTime();
    const estimatedTime = (item.estimatedPrepTime || 15) * 60 * 1000;
    return Math.min(Math.round((elapsed / estimatedTime) * 100), 99);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Pending: {orders.filter(o => o.status === 'pending').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">In Progress: {orders.filter(o => o.status === 'preparing').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Ready: {orders.filter(o => o.status === 'ready').length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Ordered at: {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="p-4 space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      {!item.startedAt ? (
                        <button
                          onClick={() => startPreparation(order.id, item.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Start
                        </button>
                      ) : !item.completedAt ? (
                        <button
                          onClick={() => completeItem(order.id, item.id)}
                          className="btn btn-success btn-sm"
                        >
                          Complete
                        </button>
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>

                    {item.startedAt && !item.completedAt && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${calculateProgress(item)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Notes
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={order.preparationNotes || ''}
                    onChange={(e) => addPreparationNote(order.id, e.target.value)}
                    placeholder="Add any special preparation notes..."
                  />
                </div>
              </div>

              {order.status === 'preparing' && (
                <div className="p-4 bg-yellow-50 border-t">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-700">
                      Estimated completion time: {new Date(order.createdAt.getTime() + 20 * 60000).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ChefDashboard;