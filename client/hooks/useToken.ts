"use client";
import { useState, useEffect } from "react";

// Custom hook to extract token details
const useToken = () => {
  const [tokenDetails, setTokenDetails] = useState<Record<string, any> | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const details = decodeToken(token);
      setTokenDetails(details);
    } else {
      console.log("No token found.");
      setTokenDetails(null);
    }
  }, []);

  return tokenDetails;
};

// Function to decode the JWT token
const decodeToken = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split(".")[1]; // Extract payload from token
    return JSON.parse(atob(payload)); // Decode and parse payload
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default useToken;
