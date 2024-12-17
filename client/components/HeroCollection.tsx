import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchProducts } from "../helpers/products_api";
import SectionContainer from "./SectionContainer";
import ProductCard from "./ProductCard";

type Product = {
  product_id: number;
  category_id: number;
  name: string;
  price: string;
  stock_quantity: number;
  description: string;
  image_url: string;
};

const HeroCollection = () => {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to Load products.</div>;

  return (
    <SectionContainer>
      <h1 className="text-6xl font-bold mb-10">
        Stylish Collection of Furniture
      </h1>
      <p className="text-gray-500">
        Stay updated with our information and engaging blog posts about modern
        Furniture and Fashion on the industry
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-16 my-10">
        {data?.map((item) => {
          return (
            <ProductCard
              key={item.product_id}
              product_id={item.product_id}
              name={item.name}
              price={item.price}
              image_url={item.image_url}
            />
          );
        })}
      </div>
    </SectionContainer>
  );
};

export default HeroCollection;
