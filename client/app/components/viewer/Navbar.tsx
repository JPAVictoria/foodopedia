"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DropdownProducts from "@/app/components/viewer/DropdownProducts";
import { useLoading } from "@/app/context/LoaderContext";

export default function Navbar({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const { loading, setLoading } = useLoading();
  const [viewer, setViewer] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const storedViewer = localStorage.getItem("viewer");
    if (storedViewer) {
      setViewer(JSON.parse(storedViewer));
    }
  }, []);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("viewer");
    setTimeout(() => {
      window.location.href = "/viewer/login";
    }, 1000);
  };

  const handleGoHome = () => {
    window.location.href = "/viewer/home"; // Full page reload
  };

  const handleGoFavorites = () => {
    window.location.href = "/viewer/favorites"; // Full page reload
  };

  return (
    <div className="flex items-center justify-between p-5 px-10">
      <div className="flex items-center gap-8 ml-10">
        <div className="relative w-20 h-20 overflow-hidden">
          <Image src="/Foodopedia2.png" alt="Logo" layout="fill" />
        </div>
        <h1 className="font-bold text-[#3E2723] text-[20px]">
          {loading ? "Loading..." : `Welcome, ${viewer ? `${viewer.firstName} ${viewer.lastName}` : "Guest"}`}
        </h1>
      </div>

      <div className="flex items-center gap-15 mr-20">
        {/* Pass category change handler to DropdownProducts */}
        <DropdownProducts onSelectCategory={onCategorySelect} />

        {/* Home Button with hard refresh */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 text-[#3E2723] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Home
        </button>

        {/* Favorites Button with hard refresh */}
        <button
          onClick={handleGoFavorites}
          className="flex items-center gap-2 text-[#3E2723] hover:underline font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Favorites
        </button>

        {/* Profile Link */}
        <button
          onClick={() => window.location.href = "/viewer/profile"}
          className="flex items-center gap-2 text-[#3E2723] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#3E2723] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
