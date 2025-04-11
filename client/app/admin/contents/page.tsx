"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { useNavbar } from "@/app/context/NavbarContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function Contents() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      openSnackbar("Token is missing", "error");

      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router, openSnackbar]);

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <div
        className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 flex-1 ${
          isNavbarVisible ? "ml-0" : "-ml-60"
        }`}
      >
        <div className="flex justify-end">
          <Link
            href="/admin/createContent"
            target="_blank"
            rel="noopener noreferrer"
          >
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
