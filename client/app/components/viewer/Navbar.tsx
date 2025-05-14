"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DropdownProducts from "@/app/components/viewer/DropdownProducts";
import { useLoading } from "@/app/context/LoaderContext";
import { useRouter } from "next/navigation"; 
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function Navbar({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const { loading, setLoading } = useLoading();
  const [viewer, setViewer] = useState<{ firstName: string; lastName: string } | null>(null);
  const router = useRouter(); 
  const { openSnackbar } = useSnackbar(); 

  useEffect(() => {
    const storedViewer = localStorage.getItem("user");
    if (storedViewer) {
      setViewer(JSON.parse(storedViewer));
    }
  }, []);

const handleLogout = () => {
  openSnackbar("Successfully Logged out!", "success"); 
  setLoading(true); 


  setTimeout(() => {
    localStorage.removeItem("user");
    router.push("/viewer/login");
  }, 1000); 
};

  const handleGoHome = () => {
  window.location.href = "/viewer/home"; 
  };

const handleGoFavorites = () => {
  window.location.href = "/viewer/favorites"; 
};


  const handleGoProfile = () => {
    router.push("/viewer/profile"); 
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

        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 text-[#3E2723] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Home
        </button>

        <button
          onClick={handleGoFavorites}
          className="flex items-center gap-2 text-[#3E2723] hover:underline font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Favorites
        </button>

        <button
          onClick={handleGoProfile}
          className="flex items-center gap-2 text-[#3E2723] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Profile
        </button>

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
