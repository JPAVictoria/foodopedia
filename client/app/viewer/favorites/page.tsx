"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLoading } from "@/app/context/LoaderContext";
import ProductCard from "@/app/components/viewer/ProductCard";
import Navbar from "@/app/components/viewer/Navbar";

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

const useFavoriteContents = (viewerId: string | null) => {
  return useQuery<Content[]>({
    queryKey: ["favorites", viewerId],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/viewer/getCard/favorites", {
        params: { viewerId },
      });
      return response.data;
    },
    enabled: !!viewerId, // Only run the query if viewerId is available
  });
};

export default function Favorites() {
  const { setLoading } = useLoading();
  const [viewerId, setViewerId] = useState<string | null>(null);

  useEffect(() => {
    const storedViewer = localStorage.getItem("viewer");
    if (storedViewer) {
      const parsed = JSON.parse(storedViewer);
      setViewerId(parsed.id);
    }
  }, []);

  const { data, isLoading, isError } = useFavoriteContents(viewerId);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const handleCategoryChange = () => {
    // No-op for favorites, required by Navbar prop
  };

  if (isError)
    return <div className="p-4 text-red-600">Failed to load favorites.</div>;

  return (
    <div>
      <Navbar onCategorySelect={handleCategoryChange} />
      <div className="mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1100px] mx-auto mb-20">
          {data?.length ? (
            data.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                shortDesc={item.shortDesc}
                imageURL={item.imageURL}
                adminName={`${item.admin.firstName} ${item.admin.lastName}`}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No favorites yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
