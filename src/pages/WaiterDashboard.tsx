import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTablesAndMenu } from '../hooks/useTablesAndMenu';
import { Table, Product, Order, OrderDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import TableManagement from '../components/waiter/TableManagement';  // Importar el componente TableManagement
import MenuSection from '../components/waiter/MenuSection';  // Importar el componente MenuSection
import OrderStatus from '../components/waiter/OrderStatus';  // Importar el componente OrderStatus
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const WaiterDashboard = () => {
  const { user, logout } = useAuth();
  const { tables, menuItems, activeOrders, pendingOrders, getTables, getMenuItems, addOrder, submitOrder } = useTablesAndMenu();
  const navigate = useNavigate();

  // Estado de la orden actual
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: Date.now(),
    tableNumber: 0,
    created_at: new Date().toString(),
    status: '',
    orderDetails: [],
    active: true,
  });

  // Estado de la mesa seleccionada
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Función para seleccionar una mesa
  const handleTableSelect = (table: Table) => {

      // Antes de cambiar de mesa, guardar el pedido actual si tiene mesa asignada
      if (currentOrder.tableNumber !== 0) {
          addOrder(currentOrder);
      }
      setSelectedTable(table);

       console.log(pendingOrders)
      // Buscar si existe un pedido pendiente para esta mesa en pendingOrders
      const existingPendingOrder = pendingOrders.find(
        (order) => order.tableNumber === table.numero
      );

      if (existingPendingOrder) {
        // Si existe un pedido pendiente, lo restauramos
        setCurrentOrder(existingPendingOrder);
      } else {
        // Si no existe un pedido, creamos uno nuevo vacío
        const newOrder: Order = {
          id: Date.now(),
          tableNumber: table.numero,
          status: 'pending',
          created_at: new Date().toString(),
          orderDetails: [],
          active: true,
        };
        setCurrentOrder(newOrder); // Actualizamos el estado de currentOrder
        addOrder(newOrder); // Llamamos a addOrder con el nuevo pedido
      }
  };

  // Función para agregar un producto al pedido
  const handleAddMenuItem = (product: Product) => {
    setCurrentOrder((prev) => {
      const existingOrderDetail = prev.orderDetails.find(
        (orderDetail) => orderDetail.producto_id === product.id
      );

      if (existingOrderDetail) {
        return {
          ...prev,
          orderDetails: prev.orderDetails.map((orderDetail) =>
            orderDetail.producto_id === product.id
              ? { ...orderDetail, cantidad: orderDetail.cantidad + 1 }
              : orderDetail
          ),
        };
      } else {
        const newOrderDetail: OrderDetail = {
          id: Date.now(),
          order_id: prev.id,
          producto_id: product.id,
          cantidad: 1,
        };

        return {
          ...prev,
          orderDetails: [...prev.orderDetails, newOrderDetail],
        };
      }
    });
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
    if (!selectedTable) {
      alert('Please select a table first!');
      return;
    }
    addOrder(currentOrder);
    submitOrder(currentOrder);
    setCurrentOrder({
      id: Date.now(),
      tableNumber: 0,
      created_at: new Date().toString(),
      status: '',
      orderDetails: [],
      active: true,
    });
    setSelectedTable(null);
  };

  // Función para calcular el total del pedido
  const calculateTotal = () => {
    return currentOrder.orderDetails.reduce((total, orderDetail) => {
      const item = menuItems.find(item => item.id === orderDetail.producto_id);
      return item ? total + item.price * orderDetail.cantidad : total;
    }, 0).toFixed(2);
  };

  // Función para pagar el pedido
  const handlePayOrder = async () => {
    if (!selectedTable) {
      alert('Por favor selecciona una mesa primero!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token, por favor inicia sesión');
      }

      const response = await axios.post(
        `${API_URL}/orders/desactivar`,
        {
          numero_mesa: selectedTable.numero
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Limpiar el pedido actual
        setCurrentOrder({
          id: Date.now(),
          tableNumber: 0,
          created_at: new Date().toString(),
          status: '',
          orderDetails: [],
          active: true,
        });
        setSelectedTable(null);
        
        // Actualizar el estado de las mesas
        await getTables();
        
        alert('Pedido pagado exitosamente!');
      }
    } catch (error) {
      console.error('Error al pagar el pedido:', error);
      alert('Error al pagar el pedido. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header/Nav */}
      <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Waiter <span className="text-blue-400">Dashboard</span></h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Usamos el componente TableManagement aquí */}
          <TableManagement tables={tables} handleTableSelect={handleTableSelect} />

          {/* Usamos el componente MenuSection aquí */}
          <MenuSection menuItems={menuItems} handleAddMenuItem={handleAddMenuItem} />

          {/* Usamos el componente OrderStatus aquí */}
          <OrderStatus
            selectedTable={selectedTable}
            currentOrder={currentOrder}
            handleRemoveItem={handleRemoveItem}
            calculateTotal={calculateTotal}
            handleSubmitOrder={handleSubmitOrder}
            handlePayOrder={handlePayOrder}
            menuItems={menuItems}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white mb-8">Waiter <span className="text-blue-400">Dashboard</span></span>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Gestiona tu restaurante de forma eficiente con esta moderna plataforma.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">Contacto</span>
              <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">Soporte</span>
              <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">Privacidad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WaiterDashboard;