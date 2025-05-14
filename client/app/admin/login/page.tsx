"use client";
import { useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useLoginStore } from "@/app/stores/useLoginStore";
import { useLoading } from "@/app/context/LoaderContext";
import Cookies from "js-cookie";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function Login() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  const {
    email,
    password,
    loading,
    submitted,
    setEmail,
    setPassword,
    setSubmitted,
    resetLoginForm,
    showPassword,
    toggleShowPassword,
  } = useLoginStore();

  useEffect(() => {
    return () => {
      resetLoginForm();
    };
  }, [resetLoginForm]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      openSnackbar("Email and password are required.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login/login",
        {
          email,
          password,
        }
      );

      const { token, admin } = response.data;

      if (token && admin) {
        Cookies.set("token", token, { expires: 1 });
        localStorage.setItem("user", JSON.stringify({ ...admin, role: "admin" })); 
        openSnackbar("Login successful!", "success");

        setSubmitted(true);
        setLoading(true);
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Invalid email or password."
        : "An unexpected error occurred.";
      openSnackbar(msg, "error");
    } finally {
    }
  };

  const isDisabled = loading || submitted;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={5}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
          Welcome back
        </h1>

        <form onSubmit={handleLogin} className="pt-5">
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
              disabled={isDisabled}
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
          </div>

          <div className="pt-5 relative">
            <Label htmlFor="password" className="pb-2 text-[#3E2723]">
              Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isDisabled}
              className="w-full focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300 pr-10"
            />
            <div
              onClick={toggleShowPassword}
              className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/admin/forgot-password">
                <Button
                  variant="link"
                  className="text-[#3E2723] text-xs p-0 h-auto cursor-pointer font-medium"
                  disabled={isDisabled}
                >
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              disabled={isDisabled}
              className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
                isDisabled
                  ? "bg-[#A5D6A7] cursor-not-allowed"
                  : "bg-[#4CAF50] hover:bg-[#45a049] cursor-pointer"
              }`}
            >
              {loading ? "Logging in..." : submitted ? "Logged in" : "Login"}
            </Button>
          </div>

          <div className="pt-8">
            <p className="font-light text-sm text-[#3E2723]">
              Don&apos;t have an account yet?
            </p>
            <Link href="/admin/register">
              <Button
                variant="link"
                className="cursor-pointer pt-3 text-[#3E2723]"
                disabled={isDisabled}
              >
                Get Started here
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
