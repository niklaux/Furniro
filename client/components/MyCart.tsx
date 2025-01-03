"use client";
import React from "react";
import SectionContainer from "./SectionContainer";
import {
  fetchCart,
  updateCartItemQuantity,
  deleteCartItem,
  checkoutCart, // Import the checkout function
} from "@/helpers/products_api";
import useToken from "@/hooks/useToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

type CartProduct = {
  product_id: number;
  name: string;
  price: string;
  description: string;
  image_url: string;
  quantity: number;
};

type MutationError = {
  message: string;
};

const MyCart = () => {
  const tokenDetails = useToken();
  const queryClient = useQueryClient();
  const [checkoutStatus, setCheckoutStatus] = React.useState<string | null>(null);

  const {
    data: cartItems,
    isLoading,
    isError,
  } = useQuery<CartProduct[]>({
    queryKey: ["cart", tokenDetails?.id],
    queryFn: () => fetchCart(tokenDetails?.id),
    enabled: !!tokenDetails?.id,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", tokenDetails?.id],
      });
    },
    onError: (error: MutationError) => {
      alert(`Failed to update quantity: ${error.message}`);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", tokenDetails?.id],
      });
    },
    onError: (error: MutationError) => {
      alert(`Failed to delete item: ${error.message}`);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutCart,
    onSuccess: () => {
      setCheckoutStatus("Checkout successful!");
      queryClient.invalidateQueries({
        queryKey: ["cart", tokenDetails?.id],
      });
    },
    onError: (error: MutationError) => {
      setCheckoutStatus(`Checkout failed: ${error.message}`);
    },
  });

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (!tokenDetails?.id) {
      alert("User is not logged in.");
      return;
    }

    if (newQuantity < 1) {
      handleDeleteItem(productId);
      return;
    }

    updateQuantityMutation.mutate({
      user_id: tokenDetails.id,
      product_id: productId,
      quantity: newQuantity,
    });
  };

  const handleDeleteItem = (productId: number) => {
    if (!tokenDetails?.id) {
      alert("User is not logged in.");
      return;
    }

    deleteItemMutation.mutate({
      user_id: tokenDetails.id,
      product_id: productId,
    });
  };

  const handleCheckout = () => {
    if (!tokenDetails?.id) {
      alert("User is not logged in.");
      return;
    }

    checkoutMutation.mutate(tokenDetails.id); // Trigger the checkout with the user's ID
  };

  if (!tokenDetails?.id) {
    return (
      <SectionContainer>Please log in to view your cart.</SectionContainer>
    );
  }

  if (isLoading)
    return <SectionContainer>Loading your cart...</SectionContainer>;
  if (isError)
    return <SectionContainer>There are no items in your cart.</SectionContainer>;

  return (
    <SectionContainer>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10">
        Your Cart
      </h1>

      <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 my-10 gap-4">
        {["Items", "Description", "Quantity", "Price"].map((header, index) => (
          <div
            key={index}
            className="flex justify-center sm:justify-start items-start"
          >
            <p className="border bg-[#DFEBF9] py-2 px-3 rounded-full my-2">
              {header}
            </p>
          </div>
        ))}
      </div>

      <div>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((product) => (
            <div
              key={product.product_id}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 my-10 gap-4"
            >
              <div className="flex justify-center sm:justify-start items-start">
                <Image
                  className="w-full sm:w-[10rem] md:w-[12rem] lg:w-[16rem] h-auto rounded-[1rem]"
                  src={product.image_url}
                  alt={product.name}
                  width={160} // Optional, since the width is controlled by Tailwind
                  height={160} // Optional, since the height will be determined automatically
                />
              </div>

              <div className="flex flex-col justify-start sm:justify-start items-start">
                <h1 className="text-lg font-bold">{product.name}</h1>
                <p className="text-sm">{product.description}</p>
              </div>

              <div className="flex justify-center sm:justify-start items-start">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        product.product_id,
                        product.quantity - 1
                      )
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded-full"
                    disabled={updateQuantityMutation.status === "pending"}
                  >
                    -
                  </button>
                  <p className="mx-3">{product.quantity}</p>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        product.product_id,
                        product.quantity + 1
                      )
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded-full"
                    disabled={updateQuantityMutation.status === "pending"}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-center sm:justify-start items-start">
                <div className="flex justify-between items-center w-full">
                  <p className="font-semibold">Php {product.price}</p>
                  <button
                    onClick={() => handleDeleteItem(product.product_id)}
                    className="px-3 py-1 bg-red-700 text-white rounded-full"
                    disabled={deleteItemMutation.status === "pending"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in your cart.</p>
        )}
      </div>

      <div className="mt-10">
        {checkoutStatus && (
          <p className={`text-center font-semibold ${checkoutStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {checkoutStatus}
          </p>
        )}
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-blue-600 text-white rounded-full w-full sm:w-auto"
        >
          Checkout
        </button>
      </div>
    </SectionContainer>
  );
};

export default MyCart;
