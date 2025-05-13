"use client";

import React, { useState } from "react";
import { Heart, CornerDownRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "@/app/context/SnackbarContext";

interface ProductCardProps {
  title: string;
  shortDesc: string;
  imageURL?: string;
  adminName: string;
  id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  shortDesc,
  imageURL,
  adminName,
  id,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbar();

  const handleFavoriteClick = async () => {
    if (isFavorited || loading) return;

    const viewer = JSON.parse(localStorage.getItem("viewer") || "{}");
    const viewerId = viewer?.id;

    if (!viewerId) {
      openSnackbar("You must be logged in to favorite.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/viewer/getCard/favorite", {
        contentId: id,
        viewerId,
      });

      if (response && response.status === 200) {
        setIsFavorited(true);
        openSnackbar("Added to favorites!", "success");
      } else {
        openSnackbar("Failed to add to favorites.", "error");
      }
    } catch (error) {
      console.error("Error favoriting:", error);
      setIsFavorited(false);
      openSnackbar("Failed to add to favorites.", "error");
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = imageURL && imageURL.startsWith("http") ? imageURL : "/placeholder.jpg";

  return (
    <div className="w-full sm:w-[300px] h-[330px] rounded-sm shadow-md border border-[#2d2d2d5b] bg-[#fffaee] overflow-hidden">
      <div className="px-2 pt-2">
        <div className="relative w-full h-[120px] shadow-sm rounded-sm overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="object-cover w-full h-full rounded-sm"
          />
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between h-[calc(100%-120px)]">
        <div className="overflow-hidden mt-2">
          <h2 className="font-bold text-md text-[#3E2723] leading-snug line-clamp-2">
            {title}
          </h2>
          <p className="text-xs text-gray-600 mt-1 mb-3">
            Published by: {adminName}
          </p>
          <p className="text-xs text-[#3E2723] leading-[1.5] tracking-[0.01em] line-clamp-4">
            {shortDesc}
          </p>
        </div>
        <div className="flex justify-end items-center gap-3 mb-2">
          <Heart
            className={`w-4 h-4 cursor-pointer transition ${
              isFavorited ? "text-red-500" : "text-[#3E2723]"
            }`}
            onClick={handleFavoriteClick}
          />
          <Link href={`/viewer/specificPage?id=${id}`}>
            <CornerDownRight className="w-4 h-4 text-[#3E2723] cursor-pointer hover:scale-110 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
