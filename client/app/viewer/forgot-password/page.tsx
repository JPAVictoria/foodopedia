"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useForgotPasswordStore } from "@/app/stores/useForgotStore";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function ForgotPassword() {
  const { openSnackbar } = useSnackbar();
  const { email, loading, setEmail, setLoading } = useForgotPasswordStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      openSnackbar("Please enter an email address", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/viewer/forgot/forgot",
        { email }
      );

      if (res.status === 200 || res.status === 201) {
        openSnackbar(res.data.message, "success");
      } else {
        openSnackbar(res.data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);

      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.message ||
          "Server responded with an unknown error.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      openSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={5}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FAC36E] to-[#F7D9A5]">
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
              className="focus:outline-none focus:border-[#FF9800] focus:shadow-sm focus:shadow-[#FF9800]/30 transition-all duration-300"
            />
          </div>
          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9800] text-white py-5 px-4 rounded-md hover:bg-[#FAC36E] transition duration-200 cursor-pointer"
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>
        <div className="pt-8">
          <p className="font-light text-sm text-[#3E2723]">
            Remember your password?
          </p>
          <Link href="/viewer/login">
            <Button
              variant="link"
              className="cursor-pointer pt-3 text-[#3E2723]"
            >
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
