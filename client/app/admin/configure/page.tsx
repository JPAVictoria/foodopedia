"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useNavbar } from "@/app/context/NavbarContext";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function Configure() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        className={`transition-all mt-20 duration-300 flex-1 p-10 ${
          isNavbarVisible ? "ml-0" : "-ml-54"
        }`}
      >
        <div className="flex justify-center gap-16 mt-10 flex-wrap">
          {/* Change Password Card */}
          <div className="flex flex-col items-center w-[400px]">
            <h1 className="font-bold text-[28px] text-transparent mb-7 bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
              Change Password
            </h1>
            <div className="w-full space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
              <form className="flex flex-col gap-7">
                {/* Current Password */}
                <div className="relative">
                  <Label htmlFor="current-password" className="pb-2 text-[#3E2723]">
                    Current Password
                  </Label>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    id="current-password"
                    className="w-full pr-10 focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                  <div
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <Label htmlFor="new-password" className="pb-2 text-[#3E2723]">
                    New Password
                  </Label>
                  <Input
                    type={showNew ? "text" : "password"}
                    id="new-password"
                    className="w-full pr-10 focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                  <div
                    onClick={() => setShowNew((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Label htmlFor="confirm-password" className="pb-2 text-[#3E2723]">
                    Confirm Password
                  </Label>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    id="confirm-password"
                    className="w-full pr-10 focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                  <div
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-2 transition-all duration-300 cursor-pointer"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>

          {/* Change Name Card */}
          <div className="flex flex-col items-center w-[400px]">
            <h1 className="font-bold text-[28px] text-transparent mb-7 bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
              Change Name
            </h1>
            <div className="w-full space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
              <form className="flex flex-col gap-7">
                <div>
                  <Label htmlFor="first-name" className="pb-2 text-[#3E2723]">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="first-name"
                    className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300 "
                  />
                </div>

                <div>
                  <Label htmlFor="last-name" className="pb-2 text-[#3E2723]">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="last-name"
                    className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-2 transition-all cursor-pointer duration-300"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
