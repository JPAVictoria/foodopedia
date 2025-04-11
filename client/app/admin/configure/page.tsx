"use client";
import Navbar from "@/app/components/ui/navbar/navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function Configure() {

  const router = useRouter();
  const { openSnackbar } = useSnackbar();

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
    
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-6">
        
      </div>
    </div>
  );
}
