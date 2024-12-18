import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_EXPRESS_URL;

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users: " + error.response?.data.message);
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to register user: " + error.response?.data.message);
  }
};

// Log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Returns token and user info
  } catch (error) {
    throw new Error("Failed to log in: " + error.response?.data.message);
  }
};