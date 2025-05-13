"use client";

import React, { useState, useEffect } from "react";
import { useLoading } from "@/app/context/LoaderContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/app/components/viewer/Navbar";
import ProductCard from "@/app/components/viewer/ProductCard";

// Define the type for a single content item
interface Content {
  id: string;
  title: string;
  shortDesc: string;
  imageURL: string;
  admin: {
    firstName: string;
    lastName: string;
  };
}

// Query hook to fetch products based on the selected category
const useContents = (category: string) => {
  return useQuery<Content[]>({
    queryKey: ["contents", category],  // Include category in query key to refetch when it changes
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/viewer/getCard", {
        params: { category },  // Pass category as query parameter
      });
      return response.data;
    },
  });
};

export default function ViewerHome() {
  const { setLoading } = useLoading();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading, isError } = useContents(selectedCategory);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading, setLoading]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (isError) return <div className="p-4 text-red-600">Error loading contents.</div>;

  return (
    <div>
      <Navbar onCategorySelect={handleCategoryChange} />
      <div className="mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1100px] mx-auto mb-20">
          {data?.map((item: Content) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              shortDesc={item.shortDesc}
              imageURL={item.imageURL}
              adminName={`${item.admin.firstName} ${item.admin.lastName}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
