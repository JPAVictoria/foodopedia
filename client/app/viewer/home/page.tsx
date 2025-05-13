"use client";

import Navbar from "@/app/components/viewer/Navbar";
import ProductCard from "@/app/components/viewer/ProductCard";
import { useLoading } from "@/app/context/LoaderContext";  // Ensure your context is correctly imported
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ContentItem {
  id: string;
  title: string;
  shortDesc: string;
  imageURL?: string;
  admin: {
    firstName: string;
    lastName: string;
  };
}

const useContents = () => {
  return useQuery<ContentItem[]>({
    queryKey: ["contents"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/viewer/getCard");
      return response.data;
    },
  });
};

export default function ViewerHome() {
  const { setLoading } = useLoading();
  const { data, isLoading, isError } = useContents();

  useEffect(() => {
    if (isLoading) {
      setLoading(true);  
    } else {
      setLoading(false);  
    }
  }, [isLoading, setLoading]);

  if (isError) return <div className="p-4 text-red-600">Error loading contents.</div>;

  return (
    <div className="">
      <Navbar />
      <div className="mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1100px] mx-auto mb-20">
          {data?.map((item) => (
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
