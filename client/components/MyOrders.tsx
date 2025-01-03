"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionContainer from "./SectionContainer";
import { fetchOrderItems, fetchOrders } from "@/helpers/products_api";
import useToken from "@/hooks/useToken";

type Order = {
  order_id: number;
  total_price: string;
  status: string;
  order_date: string;
};

type OrderItem = {
  product_id: number;
  product_name: string;
  product_description: string;
  product_image: string;
  quantity: number;
  price_at_purchase: string;
};

const MyOrders = () => {
  const tokenDetails = useToken();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Fetch orders using React Query
  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorMessage,
  } = useQuery<Order[]>({
    queryKey: ["orders", tokenDetails?.id],
    queryFn: () => fetchOrders(tokenDetails?.id),
    enabled: !!tokenDetails?.id, // Fetch only if user is logged in
  });

  // Fetch order items for a specific order ID
  const {
    data: orderItems,
    isLoading: orderItemsLoading,
  } = useQuery<OrderItem[]>({
    queryKey: ["orderItems", expandedOrderId],
    queryFn: () => fetchOrderItems(expandedOrderId as number),
    enabled: !!expandedOrderId, // Fetch order items only when an order is expanded
  });

  const handleToggleOrderItems = (orderId: number) => {
    console.log("Toggling order items for orderId:", orderId);

    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse the order
    } else {
      setExpandedOrderId(orderId); // Expand the order
    }
  };

  if (!tokenDetails?.id) {
    return (
      <SectionContainer>Please log in to view your orders.</SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10">
        Your Orders
      </h1>

      {ordersError && (
        <p className="text-red-500">
          {ordersErrorMessage?.message || "Failed to fetch orders."}
        </p>
      )}

      <div className="mt-10">
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="my-5 border p-4 rounded-lg">
              <p>Order ID: {order.order_id}</p>
              <p>Status: {order.status}</p>
              <p>Total Price: Php {order.total_price}</p>
              <p>
                Placed on: {new Date(order.order_date).toLocaleDateString()}
              </p>

              <button
                className="mt-3 text-blue-500"
                onClick={() => handleToggleOrderItems(order.order_id)}
              >
                {expandedOrderId === order.order_id
                  ? "Hide Order Items"
                  : "Show Order Items"}
              </button>

              <div
                className={`transition-all duration-900 ease-in-out overflow-hidden ${
                  expandedOrderId === order.order_id
                    ? "max-h-[5000px]" // Allow for smooth transition for the content
                    : "max-h-0"
                }`}
              >
                {expandedOrderId === order.order_id && (
                  <>
                    {orderItemsLoading ? (
                      <p>Loading order items...</p>
                    ) : orderItems && orderItems.length > 0 ? (
                      <div className="mt-4">
                        <h3 className="font-semibold">Order Items:</h3>
                        <ul>
                          {orderItems.map((item) => (
                            <li key={item.product_id} className="border-b py-4">
                              <div className="flex items-center">
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-16 h-16 mr-4"
                                />
                                <div>
                                  <p className="font-bold">
                                    {item.product_name}
                                  </p>
                                  <p>{item.product_description}</p>
                                  <p>Quantity: {item.quantity}</p>
                                  <p>
                                    Price at Purchase: Php{" "}
                                    {item.price_at_purchase}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No items found for this order.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </SectionContainer>
  );
};

export default MyOrders;
