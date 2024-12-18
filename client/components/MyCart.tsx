"use client";
import React from "react";
import SectionContainer from "./SectionContainer";
import ProductCard from "./ProductCard"; // Reuse ProductCard component to display items
import { fetchCart } from "@/helpers/products_api";
import useToken from "@/hooks/useToken";
import { useQuery } from "@tanstack/react-query";

type CartProduct = {
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
};

const MyCart = () => {
  const tokenDetails = useToken(); // Retrieve user token (or user ID)

  // Always call the useQuery hook, even if the user is not logged in
  const {
    data: cartItems,
    isLoading,
    isError,
  } = useQuery<CartProduct[]>({
    queryKey: ["cart", tokenDetails?.id],
    queryFn: () => fetchCart(tokenDetails?.id),
    enabled: !!tokenDetails?.id, // Ensures the query only runs when there's a valid user ID
  });

  // Early return if user is not logged in
  if (!tokenDetails?.id) {
    return (
      <SectionContainer>Please log in to view your cart.</SectionContainer>
    );
  }

  if (isLoading)
    return <SectionContainer>Loading your cart...</SectionContainer>;
  if (isError)
    return <SectionContainer>Failed to load cart items.</SectionContainer>;

  return (
    <SectionContainer>
      <h1 className="text-6xl font-bold mb-10">Your Cart</h1>

      {/* Render cart items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-10 md:gap-16 my-10">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((product) => (
            <ProductCard
              key={product.product_id}
              product_id={product.product_id}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
            />
          ))
        ) : (
          <p>No items in your cart.</p>
        )}
      </div>
    </SectionContainer>
  );
};

export default MyCart;
