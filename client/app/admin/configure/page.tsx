"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useNavbar } from "@/app/context/NavbarContext";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useConfigureStore } from "@/app/stores/adminStores/useConfigureStore";

export default function Configure() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const { firstName, lastName, setFirstName, setLastName } =
    useConfigureStore();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      openSnackbar("Token is missing", "error");
      const timer = setTimeout(() => router.push("/admin/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [router, openSnackbar]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      openSnackbar("New and confirm password do not match.", "error");
      return;
    }

    try {
      const token = Cookies.get("token");

      const res = await axios.put(
        "http://localhost:5000/admin/change/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      openSnackbar(
        res.data.message || "Password updated successfully.",
        "success"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        openSnackbar(
          err.response?.data?.message || "Failed to update password.",
          "error"
        );
      } else {
        openSnackbar("An unexpected error occurred.", "error");
      }
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");

      const res = await axios.put(
        "http://localhost:5000/admin/change/change-name",
        { firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("admin", JSON.stringify({ firstName, lastName }));
      openSnackbar(res.data.message || "Name updated successfully.", "success");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        openSnackbar(
          err.response?.data?.message || "Failed to update name.",
          "error"
        );
      } else {
        openSnackbar("An unexpected error occurred.", "error");
      }
    }
  };

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
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-7"
              >
                <div className="relative">
                  <Label
                    htmlFor="current-password"
                    className="pb-2 text-[#3E2723]"
                  >
                    Current Password
                  </Label>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <div
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="new-password" className="pb-2 text-[#3E2723]">
                    New Password
                  </Label>
                  <Input
                    type={showNew ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <div
                    onClick={() => setShowNew((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <div className="relative">
                  <Label
                    htmlFor="confirm-password"
                    className="pb-2 text-[#3E2723]"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <div
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute top-8 right-3 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white"
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
              <form onSubmit={handleNameSubmit} className="flex flex-col gap-7">
                <div>
                  <Label htmlFor="first-name" className="pb-2 text-[#3E2723]">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="last-name" className="pb-2 text-[#3E2723]">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white"
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
