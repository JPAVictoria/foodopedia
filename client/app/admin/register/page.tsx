"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRegisterStore } from "@/app/stores/useRegisterStore";

export default function Signup() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  // Accessing store data and actions
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    submitted,
    setField,
    setLoading,
    setSubmitted,
  } = useRegisterStore();

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const isDisabled = loading || submitted;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // No type guard here, but it will still work as long as the fields are valid
    setField(e.target.id, e.target.value);
  };

  const toggleVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev: { password: boolean; confirmPassword: boolean }) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,}$/;
    if (!emailRegex.test(email)) {
      openSnackbar("Please enter a valid email address", "error");
      return;
    }

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/admin/register/signup", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (res.status === 201) {
        openSnackbar("Registration successful!", "success");
        setSubmitted(true);

        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      }
    } catch (err: unknown) {
      setLoading(false);
      const error = err as { response?: { data?: { message: string } } };
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      openSnackbar(errorMessage, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
          Register now
        </h1>

        {["firstName", "lastName", "email", "password", "confirmPassword"].map((field, idx) => {
          const isPassword = field.toLowerCase().includes("password");
          const isPassField = field === "password" || field === "confirmPassword";
          const show = showPassword[field as keyof typeof showPassword];

          return (
            <div className="pt-5 relative" key={idx}>
              <Label htmlFor={field} className="pb-2 text-[#3E2723] capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field.replace(/([A-Z])/g, " $1")}
              </Label>

              <Input
                type={isPassword && show ? "text" : isPassword ? "password" : "text"}
                id={field}
                placeholder={
                  isPassword
                    ? "********"
                    : field === "email"
                    ? "email@example.com"
                    : "example"
                }
                value={field === "firstName" ? firstName : field === "lastName" ? lastName : field === "email" ? email : field === "password" ? password : confirmPassword}
                onChange={handleChange}
                disabled={isDisabled}
                className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300 pr-10"
              />

              {isPassField && (
                <div
                  onClick={() => toggleVisibility(field as "password" | "confirmPassword")}
                  className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#4CAF50] transition"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-5">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
              isDisabled
                ? "bg-[#A5D6A7] cursor-not-allowed"
                : "bg-[#4CAF50] hover:bg-[#45a049] cursor-pointer"
            }`}
          >
            {loading ? "Registering..." : submitted ? "Registered" : "Register"}
          </Button>
        </div>

        <div className="pt-8">
          <p className="font-light text-sm text-[#3E2723]">Remember your account?</p>
          <Link href="/admin/login">
            <Button
              variant="link"
              disabled={isDisabled}
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
