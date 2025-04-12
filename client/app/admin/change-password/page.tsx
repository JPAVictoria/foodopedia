"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // States for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      openSnackbar("Please fill in both fields", "error");
      return;
    }

    if (password.length < 8) {
      openSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    if (!token) {
      openSnackbar("Invalid or expired reset link", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/admin/reset/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        openSnackbar("Password changed successfully", "success");
        setSubmitted(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } else {
        openSnackbar(data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      openSnackbar("Network error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
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
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              value={password}
              disabled={loading || submitted}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300 pr-10"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute inset-y-10 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative pt-5">
            <Label htmlFor="confirmPassword" className="pb-2 text-[#3E2723]">
              Confirm New Password
            </Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="********"
              value={confirmPassword}
              disabled={loading || submitted}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300 pr-10"
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            <Button
              variant="link"
              className="cursor-pointer pt-3 text-[#3E2723]"
            >
              Go back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
