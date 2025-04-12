"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSnackbar } from "@/app/context/SnackbarContext"; // Assuming you are using your Snackbar context

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbar(); // To show success/error messages
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This will run after the component has mounted (client-side)
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

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        openSnackbar("Invalid or expired reset link", "error");
        return;
      }

      // Send request to change the password
      const response = await fetch("http://localhost:5000/admin/reset/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newPassword: password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        openSnackbar("Password changed successfully", "success");
        // You can directly navigate to the login page or another action
      } else {
        openSnackbar(data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      openSnackbar("Network error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
          Change your password
        </h1>
        <form onSubmit={handleSubmit} className="pt-5">
          <div>
            <Label htmlFor="password" className="pb-2 text-[#3E2723]">
              New Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
          </div>
          <div className="pt-5">
            <Label htmlFor="confirmPassword" className="pb-2 text-[#3E2723]">
              Confirm New Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
          </div>
          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4CAF50] text-white py-5 px-4 rounded-md hover:bg-[#45a049] transition duration-200 cursor-pointer"
            >
              {loading ? "Changing..." : "Submit"}
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
