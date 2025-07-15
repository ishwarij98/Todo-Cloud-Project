import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const token = localStorage.getItem("id");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/private/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/private/deletetodo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/private/deletealltodo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Delete all error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/private/addtodo`,
        { title: form.title, description: form.description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ title: "", description: "" });
      setShowAddModal(false);
      fetchTodos();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleEditTodo = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/private/updatetodo/${editTodo._id}`,
        { title: form.title, description: form.description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowEditModal(false);
      setEditTodo(null);
      setForm({ title: "", description: "" });
      fetchTodos();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800">My Todos</h1>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setForm({ title: "", description: "" });
                  setShowAddModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Todo
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-600">No todos found.</p>
          ) : (
            <div className="grid gap-4">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{todo.title}</h2>
                    <p className="text-gray-600">{todo.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditTodo(todo);
                        setForm({ title: todo.title, description: todo.description });
                        setShowEditModal(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Todo</h3>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full mb-3 px-3 py-2 border rounded"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Todo</h3>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full mb-3 px-3 py-2 border rounded"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditTodo(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTodo}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
