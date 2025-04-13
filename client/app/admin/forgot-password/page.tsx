"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useSnackbar } from "@/app/context/SnackbarContext"; // Assuming you are using your Snackbar context

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { openSnackbar } = useSnackbar(); // To show success/error messages
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      openSnackbar("Please enter an email address", "error");
      return;
    }

    setLoading(true);

    try {
      // Directly using the API URL
      const response = await fetch("http://localhost:5000/admin/forgot/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        openSnackbar(data.message, "success"); // Show success message
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
          Forgot your password?
        </h1>
        <form onSubmit={handleSubmit} className="pt-5">
          <div>
            <Label htmlFor="email" className="pb-2 text-[#3E2723]">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
          </div>
          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4CAF50] text-white py-5 px-4 rounded-md hover:bg-[#45a049] transition duration-200 cursor-pointer"
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>
        <div className="pt-8">
          <p className="font-light text-sm text-[#3E2723]">Remember your password?</p>
          <Link href="/admin/login">
            <Button variant="link" className="cursor-pointer pt-3 text-[#3E2723]">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
