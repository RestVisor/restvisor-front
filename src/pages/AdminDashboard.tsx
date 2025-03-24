import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const AddProductForm = () => {
  const { user, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit = async (data: Product) => {
    try {
      const token = localStorage.getItem('token'); // O donde guardes el token
  
      if (!token) {
        throw new Error("Token no encontrado, no autenticado");
      }
  
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Agregar token al encabezado
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
  
      const result = await response.json();
      console.log("Product added:", result);
      alert("Product added successfully");
      reset();
    } catch (error: unknown) { // Aseguramos que el tipo de error sea "Error"
      if (error instanceof Error) { // Comprobamos si el error es una instancia de Error
        console.error("Error adding product:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
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
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">ID</label>
              <input
                type="number"
                {...register("id", { required: "ID is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Add Product
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProductForm;
