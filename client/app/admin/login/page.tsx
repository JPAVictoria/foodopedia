"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; 
import { useSnackbar } from "@/app/context/SnackbarContext"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); 
  const { openSnackbar } = useSnackbar(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
  
    
    if (!email || !password) {
      openSnackbar("Email and password are required.", "error");
      setLoading(false);
      return; 
    }
  
    try {
      
      const response = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });
  
      console.log("Login response:", response);
  
      
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 }); 
        console.log("Token set in cookie"); 
  
        
        openSnackbar("Login successful!", "success");
  
        
        setTimeout(() => {
          router.push("/admin"); 
          console.log("Redirection initiated to /admin");
        }, 2000); 
      }
    } catch (err) {
      
      
      if (axios.isAxiosError(err) && err.response) {
        openSnackbar(err.response.data.message || "Invalid email or password.", "error");
      } else {
        openSnackbar("An unexpected error occurred. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen">
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
              className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
          </div>

          <div className="pt-5">
            <Label htmlFor="password" className="pb-2 text-[#3E2723]">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
            />
            <div className="flex justify-end pt-1">
              <Link href="/admin/forgot-password">
                <Button
                  variant="link"
                  className="text-[#3E2723] text-xs p-0 h-auto cursor-pointer font-medium"
                >
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Show error message */}

          <div className="pt-5">
            <Button
              type="submit"
              className="w-full bg-[#4CAF50] text-white py-5 px-4 rounded-md hover:bg-[#45a049] transition duration-200 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>

          <div className="pt-8">
            <p className="font-light text-sm text-[#3E2723]">
              Don’t have an account yet?
            </p>
            <Link href="/admin/register">
              <Button
                variant="link"
                className="cursor-pointer pt-3 text-[#3E2723]"
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
