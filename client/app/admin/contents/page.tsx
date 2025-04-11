"use client"; // This will make sure the component runs client-side

import Navbar from "@/components/ui/navbar/navbar";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { useNavbar } from "@/app/context/NavbarContext";

export default function Contents() {
  const { isNavbarVisible } = useNavbar(); // Now it works because it's in a client-side component

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <div
        className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 flex-1 ${
          isNavbarVisible ? "ml-0" : "-ml-40"
        }`}
      >
        <div className="flex justify-end">
          <Link href="/admin/createContent" target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center hover:bg-[#c5cadc17] rounded-md p-2 cursor-pointer transition">
              <SquarePlus className="w-5 h-5 text-[#3E2723]" />
              <span className="text-xs text-[#3E2723] mt-1">Create</span>
            </div>
          </Link>
        </div>

        <h1 className="text-[24px] font-bold text-[#4CAF50] mt-4 text-center sm:text-[18px] md:text-[22px] lg:text-[24px]">
          Content Overview
        </h1>
      </div>
    </div>
  );
}
