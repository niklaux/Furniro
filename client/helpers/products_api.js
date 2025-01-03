import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_EXPRESS_URL;

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

// Function to post a new product
export const postProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create product");
  }
};

// Function to fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/list-categories`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

// Function to add an item to the cart
export const addToCart = async (cartData) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, cartData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add item to cart");
  }
};

// Function to get items in user's cart
export const fetchCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`); // API endpoint that requires user_id
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cart data");
  }
};

// Function to update the quantity of a cart item
export const updateCartItemQuantity = async (cartData) => {
  try {
    const response = await axios.put(`${API_URL}/cart`, cartData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update cart item quantity");
  }
};

// Function to delete an item from the cart
export const deleteCartItem = async (cartData) => {
  try {
    const response = await axios.delete(`${API_URL}/cart`, { data: cartData });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete cart item");
  }
};

// Function to checkout the cart
export const checkoutCart = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/checkout`, {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to checkout cart");
  }
};

// Function to fetch order batches
export const fetchOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${userId}`);
    return response.data; // Return the orders data
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

// Function to fetch order items with product details
export const fetchOrderItems = async (orderId) => {
  console.log("fetchOrderItems called with orderId:", orderId); // Add log here
  try {
    const response = await axios.get(`${API_URL}/order-items/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch order items");
  }
};
