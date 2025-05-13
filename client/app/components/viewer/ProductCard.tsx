"use client";

import React, { useState, useEffect } from "react";
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

  const imageSrc =
    imageURL && imageURL.startsWith("http") ? imageURL : "/placeholder.jpg";

  // Check if the product is already favorited when the component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      const viewer = JSON.parse(localStorage.getItem("viewer") || "{}");
      const viewerId = viewer?.id;

      if (!viewerId) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/viewer/getCard/favorites",
          {
            params: { viewerId },
          }
        );

        if (response?.data?.length) {
          const isThisFavorited = response.data.some(
            (fav: { id: string }) => fav.id === id
          );
          setIsFavorited(isThisFavorited);
        }
      } catch (error) {
        console.error("Failed to fetch favorite status:", error);
      }
    };

    fetchFavorites();
  }, [id]);

  // Handle favorite/unfavorite
  const handleFavoriteClick = async () => {
    if (loading) return;

    const viewer = JSON.parse(localStorage.getItem("viewer") || "{}");
    const viewerId = viewer?.id;

    if (!viewerId) {
      openSnackbar("You must be logged in to favorite.", "error");
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        const response = await axios.delete(
          "http://localhost:5000/viewer/getCard/favorite",
          {
            data: { contentId: id, viewerId },
          }
        );
        if (response.status === 200) {
          setIsFavorited(false);
          openSnackbar("Removed from favorites.", "success");
        } else {
          openSnackbar("Failed to remove from favorites.", "error");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/viewer/getCard/favorite",
          {
            contentId: id,
            viewerId,
          }
        );

        if (response.status === 200) {
          setIsFavorited(true);
          openSnackbar("Added to favorites!", "success");
        } else {
          openSnackbar("Failed to add to favorites.", "error");
        }
      }
    } catch (error) {
      console.error("Error favoriting:", error);
      openSnackbar("Failed to update favorites.", "error");
    } finally {
      setLoading(false);
    }
  };

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
