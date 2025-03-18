import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Table, MenuItem } from '../types';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

export function AdminDashboard() {
  const [tables, setTables] = useState<Table[]>([
    { number: 1, seats: 4, status: 'available' },
    { number: 2, seats: 2, status: 'occupied' },
    { number: 3, seats: 6, status: 'reserved' },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Classic Burger',
      price: 12.99,
      category: 'main',
      available: true,
      description: 'Beef patty with lettuce, tomato, and cheese',
      stock: 50,
    },
    {
      id: '2',
      name: 'French Fries',
      price: 4.99,
      category: 'sides',
      available: true,
      description: 'Crispy golden fries',
      stock: 100,
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'tables' | 'menu' | 'orders'>('tables');
  const [editingTable, setEditingTable] = useState<number | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null);

  const handleAddTable = () => {
    const newTableNumber = Math.max(...tables.map(t => t.number)) + 1;
    setTables([...tables, {
      number: newTableNumber,
      seats: 4,
      status: 'available'
    }]);
  };

  const handleDeleteTable = (number: number) => {
    setTables(tables.filter(t => t.number !== number));
  };

  const handleEditTable = (number: number) => {
    setEditingTable(number);
  };

  const handleSaveTable = (number: number, seats: number, status: string) => {
    setTables(tables.map(t => t.number === number ? { ...t, seats, status } : t));
    setEditingTable(null);
  };

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: 'New Item',
      price: 0,
      category: 'main',
      available: true,
      description: '',
      stock: 0,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleEditMenuItem = (id: string) => {
    setEditingMenuItem(id);
  };

  const handleSaveMenuItem = (id: string, name: string, price: number, category: string, available: boolean, description: string, stock: number) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, name, price, category, available, description, stock } : item));
    setEditingMenuItem(null);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(['tables', 'menu', 'orders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`${
                    selectedTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {selectedTab === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Tables Management</h2>
              <button
                onClick={handleAddTable}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <div
                  key={table.number}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  {editingTable === table.number ? (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Table {table.number}</h3>
                          <input
                            type="number"
                            value={table.seats}
                            onChange={(e) => setTables(tables.map(t => t.number === table.number ? { ...t, seats: parseInt(e.target.value) } : t))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                          <select
                            value={table.status}
                            onChange={(e) => setTables(tables.map(t => t.number === table.number ? { ...t, status: e.target.value } : t))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveTable(table.number, table.seats, table.status)}
                            className="p-2 text-gray-400 hover:text-green-600"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Table {table.number}</h3>
                          <p className="text-sm text-gray-500">{table.seats} seats</p>
                          <p className="text-sm text-gray-500 capitalize">{table.status}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTable(table.number)}
                            className="p-2 text-gray-400 hover:text-indigo-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTable(table.number)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu Management</h2>
              <button
                onClick={handleAddMenuItem}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  {editingMenuItem === item.id ? (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, price: parseFloat(e.target.value) } : i))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                          <select
                            value={item.category}
                            onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, category: e.target.value } : i))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          >
                            <option value="main">Main</option>
                            <option value="sides">Sides</option>
                            <option value="drinks">Drinks</option>
                            <option value="desserts">Desserts</option>
                          </select>
                          <textarea
                            value={item.description}
                            onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, stock: parseInt(e.target.value) } : i))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                          <label className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={item.available}
                              onChange={(e) => setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, available: e.target.checked } : i))}
                              className="form-checkbox"
                            />
                            <span className="ml-2">Available</span>
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveMenuItem(item.id, item.name, item.price, item.category, item.available, item.description, item.stock)}
                            className="p-2 text-gray-400 hover:text-green-600"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          <p className="text-sm text-gray-500">{item.available ? 'Available' : 'Unavailable'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMenuItem(item.id)}
                            className="p-2 text-gray-400 hover:text-indigo-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'orders' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Order History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample order history data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #12345
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Table 1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3 items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $45.98
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2024-03-15
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}