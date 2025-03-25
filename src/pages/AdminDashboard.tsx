import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const AdminProductManagement = () => {
  const { user, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const onSubmit = async (data: Product) => {
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save product");
      fetchProducts();
      reset();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue("id", product.id);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("category", product.category);
  };

  const handleCancelEdit = () => {
    reset();
    setEditingProduct(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
        <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">ID</label>
              <input
                type="number"
                {...register("id", { required: "ID is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                disabled={!!editingProduct}
              />
            </div>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Product List</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="flex justify-between border-b py-2">
                <span>{product.name} - ${product.price}</span>
                <div>
                  <button onClick={() => handleEdit(product)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminProductManagement;
