"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If token is missing, redirect to login
      if (pathname !== "/login") {
        router.push("/login");
      }
      return;
    }

    // Simulate token validation logic (you can replace this with a real API call)
    const isValidToken = validateToken(token);

    if (isValidToken) {
      // If token is valid, redirect only if not on an authenticated page
      if (pathname === "/login") {
        router.push("/"); // Redirect to home if on login page
      }
    } else {
      localStorage.removeItem("token"); // Remove invalid token
      router.push("/login");
    }
  }, [router, pathname]);
};

// Example validation function (Replace with your logic)
const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const exp = payload.exp * 1000; // Expiration time in ms
    return Date.now() < exp; // Check if token is still valid
  } catch (error) {
    return false; // If parsing fails, treat token as invalid
  }
};

export default useAuthRedirect;
