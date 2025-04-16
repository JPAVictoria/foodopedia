"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useNavbar } from "@/app/context/NavbarContext";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

export default function Configure() {
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
        className={`transition-all mt-20 duration-300 flex-1 p-10 ${
          isNavbarVisible ? "ml-0" : "-ml-54"
        }`}
      >
        <div className="flex justify-center gap-16 mt-10 flex-wrap">
          <div className="flex flex-col items-center w-[400px]">
            <h1 className="font-bold text-[28px] text-transparent mb-7 bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
              Change Password
            </h1>
            <div className="w-full space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
              <form className="flex flex-col gap-7">
                <div>
                  <Label
                    htmlFor="current-password"
                    className="pb-2 text-[#3E2723]"
                  >
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    id="current-password"
                    className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password" className="pb-2 text-[#3E2723]">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    id="new-password"
                    className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="pb-2 text-[#3E2723]"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
                  />
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
