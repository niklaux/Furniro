import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchProducts } from "../helpers/products_api";

const HeroCollection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to Load products.</div>;

  return <div>HeroCollection</div>;
};

export default HeroCollection;
