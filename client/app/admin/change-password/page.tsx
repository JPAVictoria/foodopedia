"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useToggleStore } from "@/app/stores/adminStores/useToggleStore"; 
import { useStateStore } from "@/app/stores/adminStores/useStateStore"; 
import { useLoading } from "@/app/context/LoaderContext";

import axios from "axios";


export default function ChangePassword() {
  const {
    newPassword,
    confirmPassword,
    showNew,
    showConfirm,
    setNewPassword,
    setConfirmPassword,
    toggleShowNew,
    toggleShowConfirm,
  } = useToggleStore();

  const { loading, setLoading, submitted, setSubmitted } = useStateStore();
  const { setLoading: setGlobalLoading } = useLoading(); 
  const [token, setToken] = useState<string | null>(null);
  const { openSnackbar } = useSnackbar();
  const router = useRouter();


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      openSnackbar("Please fill in both fields", "error");
      return;
    }

    if (newPassword.length < 8) {
      openSnackbar("Password must be at least 8 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    if (!token) {
      openSnackbar("Invalid or expired reset link", "error");
      return;
    }

    setLoading(true);
    setGlobalLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/admin/reset/reset", {
        newPassword,
        token,
      });

      if (res.status === 200 || res.status === 201) {
        openSnackbar(res.data.message || "Password changed successfully", "success");
        setSubmitted(true);
        setTimeout(() => router.push("/admin/login"), 2000);
      } else {
        openSnackbar(res.data.message || "Something went wrong", "error");
      }
    } catch (error: unknown) {
      console.error(error);

      let message = "Something went wrong. Please try again.";

      if (error instanceof Error) {
        message =
          error.message || "An unexpected error occurred. Please try again later.";
      }

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.message ||
          "Server responded with an unknown error.";
      }

      openSnackbar(message, "error");
    } finally {
      setLoading(false);
      setTimeout(() => setGlobalLoading(false), 2500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
          Change your password
        </h1>
        <form onSubmit={handleSubmit} className="pt-5">
          <div className="relative">
            <Label htmlFor="password" className="pb-2 text-[#3E2723]">
              New Password
            </Label>
            <Input
              type={showNew ? "text" : "password"}
              id="password"
              placeholder="********"
              value={newPassword}
              disabled={loading || submitted}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30"
            />
            <div
              onClick={toggleShowNew}
              className="absolute inset-y-10 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50]"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative pt-5">
            <Label htmlFor="confirmPassword" className="pb-2 text-[#3E2723]">
              Confirm New Password
            </Label>
            <Input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              placeholder="********"
              value={confirmPassword}
              disabled={loading || submitted}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30"
            />
            <div
              onClick={toggleShowConfirm}
              className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50]"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading || submitted}
              className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
                loading || submitted
                  ? "bg-[#A5D6A7] cursor-not-allowed"
                  : "bg-[#4CAF50] hover:bg-[#45a049] cursor-pointer"
              }`}
            >
              {loading ? "Changing..." : submitted ? "Submitted" : "Submit"}
            </Button>
          </div>
        </form>

        <div className="pt-5">
          <Link href="/admin/login">
            <Button variant="link" className="cursor-pointer pt-3 text-[#3E2723]">
              Go back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
