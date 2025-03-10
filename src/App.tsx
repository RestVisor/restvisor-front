import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { TableGrid } from './components/TableGrid';
import { MenuGrid } from './components/MenuGrid';
import { OrderPanel } from './components/OrderPanel';
import { useAuth } from './hooks/useAuth';
import { Order, Table, MenuItem, OrderItem } from './types';

// Mock menu items for demonstration
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    price: 12.99,
    category: 'main',
    available: true,
    description: 'Beef patty with lettuce, tomato, and cheese',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
  },
  {
    id: '2',
    name: 'French Fries',
    price: 4.99,
    category: 'sides',
    available: true,
    description: 'Crispy golden fries',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500'
  },
  {
    id: '3',
    name: 'Coca Cola',
    price: 2.99,
    category: 'drinks',
    available: true,
    description: '16 oz',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500'
  },
  {
    id: '4',
    name: 'Ice Cream Sundae',
    price: 6.99,
    category: 'desserts',
    available: true,
    description: 'Vanilla ice cream with chocolate sauce',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'
  }
];

function App() {
  const { isAuthenticated } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: crypto.randomUUID(),
    items: [],
    status: 'pending',
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [tables, setTables] = useState<Table[]>([
    { number: 1, seats: 4, status: 'available' },
    { number: 2, seats: 2, status: 'occupied' },
    { number: 3, seats: 6, status: 'reserved' },
    { number: 4, seats: 4, status: 'available' },
    { number: 5, seats: 8, status: 'available' },
    { number: 6, seats: 2, status: 'occupied' },
  ]);

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    if (!currentOrder.tableNumber) {
      setCurrentOrder(prev => ({ ...prev, tableNumber: table.number }));
    }
  };

  const handleAddMenuItem = (item: MenuItem) => {
    setCurrentOrder(prev => {
      const existingItem = prev.items.find(i => i.id === item.id);
      
      if (existingItem) {
        const updatedItems = prev.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return {
          ...prev,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          updatedAt: new Date(),
        };
      }

      const newItems = [...prev.items, { ...item, quantity: 1 }];
      return {
        ...prev,
        items: newItems,
        total: calculateTotal(newItems),
        updatedAt: new Date(),
      };
    });
  };

  const handleUpdateQuantity = (item: OrderItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCurrentOrder(prev => {
      const updatedItems = prev.items.map(i =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      );
      return {
        ...prev,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        updatedAt: new Date(),
      };
    });
  };

  const handleRemoveItem = (item: OrderItem) => {
    setCurrentOrder(prev => {
      const updatedItems = prev.items.filter(i => i.id !== item.id);
      return {
        ...prev,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        updatedAt: new Date(),
      };
    });
  };

  const handleSubmitOrder = () => {
    if (currentOrder.items.length === 0) return;

    setActiveOrders(prev => [...prev, currentOrder]);
    
    if (selectedTable) {
      setTables(prev =>
        prev.map(t =>
          t.number === selectedTable.number
            ? { ...t, status: 'occupied', currentOrderId: currentOrder.id }
            : t
        )
      );
    }

    setCurrentOrder({
      id: crypto.randomUUID(),
      items: [],
      status: 'pending',
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setSelectedTable(null);
  };

  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Tables Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Tables</h2>
            <TableGrid tables={tables} onTableSelect={handleTableSelect} />
          </div>

          {/* Menu Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Menu</h2>
            <MenuGrid items={mockMenuItems} onItemSelect={handleAddMenuItem} />
          </div>
        </div>

        {/* Order Panel */}
        <div className="lg:col-span-1">
          <OrderPanel
            order={currentOrder}
            table={selectedTable || undefined}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleSubmitOrder}
          />

          {/* Active Orders */}
          <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Active Orders</h2>
            <div className="space-y-3 md:space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 md:p-4 border rounded-lg hover:border-indigo-500 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {order.items.length} items · ${order.total.toFixed(2)}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;