import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Product, Order } from '../types';
import { getTablesAPI, getMenuItemsAPI, submitOrderAPI, submitDetailOrderAPI } from '../services/api';

interface TablesAndMenuContextType {
  tables: Table[];
  menuItems: Product[];
  activeOrders: Order[];
  getTables: () => void;
  getMenuItems: () => void;
  addOrder: (order: Order) => void;
  submitOrder: (order: Order) => void;
}

const TablesAndMenuContext = createContext<TablesAndMenuContextType | null>(null);

export const TablesAndMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTables(); 
    getMenuItems();
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
    setActiveOrders((prevOrders) => [...prevOrders, order]);  
  };

  const submitOrder = async (order: Order) => {
    try {
      const response = await submitOrderAPI(order); 
      console.log('Order submitted:', response); 
  
      if (response == null) {
        const orderId = order.id;
        
        console.log('Order ID:', orderId); // Agregado para depuración

        await Promise.all(
          order.orderDetails.map(async (detail) => {
            await submitDetailOrderAPI(orderId, detail);
          })
        );
  
        setActiveOrders((prevOrders) =>
          prevOrders.filter((activeOrder) => activeOrder.id !== order.id)
        );
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error submitting order:', error); 
    }
  };

  return (
    <TablesAndMenuContext.Provider
      value={{
        tables,
        menuItems,
        activeOrders,
        getTables,
        getMenuItems,
        addOrder,
        submitOrder,
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