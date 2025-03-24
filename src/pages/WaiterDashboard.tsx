import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTablesAndMenu } from '../hooks/useTablesAndMenu'; 
import { Table, Product, Order, OrderDetail } from '../types'; 
import { useAuth } from '../hooks/useAuth'; 

const WaiterDashboard = () => {
  const { user, logout } = useAuth(); 
  const { tables, menuItems, activeOrders, getTables, getMenuItems, addOrder, submitOrder } = useTablesAndMenu(); 
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: Date.now(),
    tableNumber: 0,
    dateCreated: new Date(),
    state: 'pending',
    orderDetails: [],
  });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  
  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCurrentOrder((prev) => ({
      ...prev,
      tableNumber: table.numero,  
    }));
  };

 
  const handleAddMenuItem = (product: Product) => {
    const newOrderDetail: OrderDetail = {
      id: Date.now(),
      order_id: currentOrder.id,
      product_id: product.id,
      amount: 1,
    };
    setCurrentOrder((prev) => ({
      ...prev,
      orderDetails: [...prev.orderDetails, newOrderDetail],
    }));
  };

  
  const handleUpdateQuantity = (orderDetail: OrderDetail, newQuantity: number) => {
    if (newQuantity < 1) return; // No permitir cantidades negativas
    setCurrentOrder((prev) => ({
      ...prev,
      orderDetails: prev.orderDetails.map((od) =>
        od.id === orderDetail.id ? { ...od, amount: newQuantity } : od
      ),
    }));
  };

  // Función para eliminar un producto del pedido
  const handleRemoveItem = (orderDetail: OrderDetail) => {
    setCurrentOrder((prev) => ({
      ...prev,
      orderDetails: prev.orderDetails.filter((od) => od.id !== orderDetail.id),
    }));
  };

  // Función para enviar el pedido
  const handleSubmitOrder = () => {
    addOrder(currentOrder);  // Agregamos el pedido a la lista de órdenes activas
    submitOrder(currentOrder);  // Enviamos el pedido a la API
    setCurrentOrder({
      id: Date.now(),
      tableNumber: 0,
      dateCreated: new Date(),
      state: 'pending',
      orderDetails: [],
    });
    setSelectedTable(null);  // Limpiamos la mesa seleccionada
    navigate('/orders');  // Navegamos a la página de órdenes
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Waiter Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section for Table Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Table Management</h2>
            <div className="grid grid-cols-3 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    table.state === 'occupied' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  onClick={() => handleTableSelect(table)}
                >
                  <h3 className="text-xl">Table {table.numero}</h3>
                  <p>Status: {table.state}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section for Menu Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg cursor-pointer"
                  onClick={() => handleAddMenuItem(item)}
                >
                  <h3 className="text-lg">{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section for Active Orders */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            {selectedTable ? (
              <div>
                <h3 className="text-lg">Table {selectedTable.numero} - Order</h3>
                <ul>
                  {currentOrder.orderDetails.map((orderDetail) => (
                    <li key={orderDetail.id} className="flex justify-between items-center">
                      <span>
                        {orderDetail.amount} x {menuItems.find(item => item.id === orderDetail.product_id)?.name}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(orderDetail)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSubmitOrder}
                  className="bg-blue-600 text-white p-2 rounded mt-4"
                >
                  Submit Order
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Select a table to start an order</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaiterDashboard;