import { createContext, useContext, useState, useEffect } from 'react';
import { Table, Product, Order } from '../types';
import { getTablesAPI, getMenuItemsAPI, submitOrderAPI, submitDetailOrderAPI, updateTableState, getActiveOrders } from '../services/api';

interface TablesAndMenuContextType {
  tables: Table[];
  menuItems: Product[];
  activeOrders: Order[];
  pendingOrders: Order[];
  getTables: () => void;
  getMenuItems: () => void;
  addOrder: (order: Order) => void;
  submitOrder: (order: Order) => void;
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  tablesWithReadyOrders: number[];
  tableTotalOrder: Order | null;
}

const TablesAndMenuContext = createContext<TablesAndMenuContextType | null>(null);

export const TablesAndMenuProvider = ({ children }: { children: React.ReactNode }) => {
  // Declaramos el estado de las órdenes y las mesas dentro de la función
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [tablesWithReadyOrders, setTablesWithReadyOrders] = useState<number[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [tableTotalOrder, setTableTotalOrder] = useState<Order | null>(null);

  // Initial data load
  useEffect(() => {
    getTables();
    getMenuItems();
  }, []);

  // Real-time data synchronization effect
  useEffect(() => {
    const syncData = async () => {
      try {
        console.log(`Syncing data at ${new Date().toLocaleTimeString()}`);
        
        // Get current state of tables
        await getTables();
        
        // Get menu items (to refresh stock levels)
        await getMenuItems();
        
        // Get active orders and determine which tables have ready orders
        const orders = await getActiveOrders();
        const readyOrders = orders.filter(order =>
          order.active && order.status === 'listo'
        );

        const tablesWithReady = readyOrders.map(order => order.tableNumber);
        setTablesWithReadyOrders(tablesWithReady);
        
        // Update active orders state
        setActiveOrders(orders);
        
        // Update last sync time
        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    };

    // Sync immediately on component mount
    syncData();

    // Configure interval to sync every 5 seconds
    const intervalId = setInterval(syncData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getTables = async () => {
    try {
      const tablesData = await getTablesAPI();
      setTables(tablesData);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const getMenuItems = async () => {
    try {
      const menuData = await getMenuItemsAPI();
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const addOrder = (order: Order) => {
    const existingPendingOrder = pendingOrders.find(
      (pendingOrder) => pendingOrder.tableNumber === order.tableNumber
    );

    if (existingPendingOrder) {
      const updatedOrder = {
        ...existingPendingOrder,
        orderDetails: order.orderDetails,
      };

      setPendingOrders((prevOrders) =>
        prevOrders.map((pendingOrder) =>
          pendingOrder.id === existingPendingOrder.id ? updatedOrder : pendingOrder
        )
      );
    } else {
      // Si no existe un pedido pendiente, agregamos un nuevo pedido a pendingOrders
      setPendingOrders((prevOrders) => [...prevOrders, order]);
    }
  };

  const submitOrder = async (order: Order) => {
    try {
      const response = await submitOrderAPI(order);
      console.log('Order submitted:', response);

      if (response !== 500) {
        const orderId = order.id;

        console.log('Order ID:', orderId); // Para depuración

        await Promise.all(
          order.orderDetails.map(async (detail) => {
            await submitDetailOrderAPI(orderId, detail);
            console.log('Detail submitted:', detail); // Para depuración
          })
        );

        // Encontrar el id de la mesa basado en su número
        const table = tables.find(t => t.numero === order.tableNumber);
        if (table) {
          // Actualizar el estado de la mesa a ocupada
          await updateTableState(table.id, 'ocupada');

          // Actualizar la lista de mesas para refrescar la vista
          await getTables();
        }

        // Mover el pedido de pendingOrders a activeOrders
        setActiveOrders((prevOrders) => [...prevOrders, order]);
        setPendingOrders((prevOrders) =>
          prevOrders.filter((pendingOrder) => pendingOrder.id !== order.id)
        );
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  return (
    <TablesAndMenuContext.Provider
      value={{
        tables,
        menuItems,
        activeOrders,
        pendingOrders,
        getTables,
        getMenuItems,
        addOrder,
        submitOrder,
        setActiveOrders,
        tablesWithReadyOrders,
        tableTotalOrder
      }}
    >
      {children}
    </TablesAndMenuContext.Provider>
  );
};

export const useTablesAndMenu = () => {
  const context = useContext(TablesAndMenuContext);
  if (!context) {
    throw new Error('useTablesAndMenu must be used within a TablesAndMenuProvider');
  }
  return context;
};
