"use client";
import Navbar from "@/app/components/viewer/Navbar"
import ProductCard from "@/app/components/viewer/ProductCard"
import { useLoading } from "@/app/context/LoaderContext"; // Import the loader context
import { useEffect } from "react";

export default function ViewerHome() {

  const { setLoading } = useLoading(); 

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="">
        <Navbar />
      <div className="mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[950px] mx-auto mb-20">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}