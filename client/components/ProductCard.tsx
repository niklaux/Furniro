import React from "react";

// Define the type for props
type ProductCardProps = {
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  category?: string; // Optional category name prop
};

const ProductCard: React.FC<ProductCardProps> = ({
  product_id,
  name,
  price,
  image_url,
  category,
}) => {
  return (
    <div
      className="transition-transform duration-300 hover:scale-105"
      key={product_id}
    >
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
        <button className="border bg-[#D4DCFB] p-2 rounded-[2rem] font-bold">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
