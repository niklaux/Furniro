"use client"
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchProducts, fetchCategories } from "../helpers/products_api"; // Ensure fetchCategories is imported
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

type Category = {
  category_id: number;
  name: string;
};

const HeroCollection = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // State to store selected category

  // Fetch Products
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Fetch Categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isProductsLoading || isCategoriesLoading) {
    return <SectionContainer>Loading...</SectionContainer>;
  }

  if (isProductsError || isCategoriesError) {
    return <SectionContainer>Failed to load data.</SectionContainer>;
  }

  // Map category IDs to their names for quick lookup
  const categoryMap = categories?.reduce((acc, category) => {
    acc[category.category_id] = category.name;
    return acc;
  }, {} as Record<number, string>);

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? products?.filter((product) => product.category_id === selectedCategory)
    : products;

  return (
    <SectionContainer>
      <h1 className="text-6xl font-bold mb-10">
        Stylish Collection of Furniture
      </h1>
      <p className="text-gray-500">
        Stay updated with our information and engaging blog posts about modern
        Furniture and Fashion on the industry
      </p>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 my-5">
        {/* "All" Button */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`min-w-16 p-2 rounded-full transition-colors ${
            selectedCategory === null
              ? "bg-black text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          All
        </button>

        {/* Category Buttons */}
        {categories?.map((category) => (
          <button
            key={category.category_id}
            onClick={() => setSelectedCategory(category.category_id)}
            className={`p-2 rounded-full transition-colors ${
              selectedCategory === category.category_id
                ? "bg-black text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-10 md:gap-16 my-10">
        {filteredProducts?.map((product) => {
          const categoryName = categoryMap?.[product.category_id] || "Unknown";
          return (
            <ProductCard
              key={product.product_id}
              product_id={product.product_id}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
              category={categoryName} // Passing category name to ProductCard
            />
          );
        })}
      </div>
    </SectionContainer>
  );
};

export default HeroCollection;
