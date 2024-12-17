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
