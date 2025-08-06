import React, { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, AlertCircle, Star } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";
import toast from "react-hot-toast";

const Orders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/confirm/${orderId}`);
      toast.success("Order confirmed successfully!");
      fetchOrders(); // Refresh orders
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to confirm order");
    }
  };

  const getStatusIcon = (isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? "Completed" : "In Progress";
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "buying") {
      return order.buyerId === currentUser?._id;
    } else {
      return order.sellerId === currentUser?._id;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">
            Manage your {currentUser?.isSeller ? "sales and purchases" : "purchases"}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("buying")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "buying"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {currentUser?.isSeller ? "My Purchases" : "My Orders"}
              </button>
              {currentUser?.isSeller && (
                <button
                  onClick={() => setActiveTab("selling")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "selling"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Sales
                </button>
              )}
            </nav>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab === "buying" ? "orders" : "sales"} yet
                </h3>
                <p className="text-gray-600">
                  {activeTab === "buying"
                    ? "When you purchase services, they will appear here."
                    : "When you receive orders, they will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <img
                          src={order.img}
                          alt={order.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {order.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>Order ID: {order._id.slice(-8)}</span>
                            <span>Price: ${order.price}</span>
                            <span>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.isCompleted)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.isCompleted
                              )}`}
                            >
                              {getStatusText(order.isCompleted)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        {activeTab === "selling" && !order.isCompleted && (
                          <button
                            onClick={() => handleConfirmOrder(order._id)}
                            className="btn-primary text-sm"
                          >
                            Mark as Complete
                          </button>
                        )}
                        <a
                          href={`/message/${order._id}`}
                          className="btn-outline text-sm"
                        >
                          View Messages
                        </a>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Payment Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.payment_intent && order.payment_intent !== "temporary"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.payment_intent && order.payment_intent !== "temporary"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
