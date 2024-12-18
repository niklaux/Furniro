import React from "react";
import { useMutation } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { addToCart } from "@/helpers/products_api";

type ProductCardProps = {
  product_id: number;
  name: string;
  price: string;
  image_url: string;
};

// Define the type for the cart data
type CartData = {
  user_id: number;
  product_id: number;
  quantity: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product_id,
  name,
  price,
  image_url,
}) => {
  const tokenDetails = useToken();

  // Use the mutation with a defined mutationFn
  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      alert("Item successfully added to cart!");
    },
    onError: (error: any) => {
      alert("Failed to add item to cart. Please try again.");
    },
  });

  const handleAddToCart = () => {
    if (!tokenDetails?.id) {
      alert("Please log in to add items to your cart.");
      return;
    }

    // Call the mutation function with the correct payload
    mutation.mutate({
      user_id: tokenDetails.id, // User ID from token
      product_id,
      quantity: 1, // Default quantity
    });
  };

  return (
    <div key={product_id}>
      <div className="h-[10rem] mb-5">
        <img
          className="cursor-pointer w-full h-full object-cover shadow-md rounded-[1rem]"
          src={image_url}
          alt={name}
        />
      </div>
      <p className="text-[#78798E] font-bold">{name}</p>
      <div className="flex justify-between items-center">
        <p className="font-bold">₱ {price}</p>
        <button
          onClick={handleAddToCart}
          className="border bg-[#D4DCFB] p-2 rounded-[2rem] font-bold transition-transform duration-200 hover:scale-105 active:font-extrabold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
