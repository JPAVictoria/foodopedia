"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSnackbar } from "@/components/snackbar";

export default function Signup() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic form validation
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      openSnackbar("Please enter a valid email address", "error");
      return;
    }

    // Password match validation
    if (form.password !== form.confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/admin/signup", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (res.status === 201) {
        openSnackbar("Registration successful!", "success");
        // Add a delay before redirecting
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000); // 3 seconds delay (3000 milliseconds)
      }
    } catch (err: unknown) {
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

        {["firstName", "lastName", "email", "password", "confirmPassword"].map(
          (field, idx) => (
            <div className="pt-5" key={idx}>
              <Label htmlFor={field} className="pb-2 text-[#3E2723] capitalize">
                {field === "confirmPassword"
                  ? "Confirm Password"
                  : field.replace(/([A-Z])/g, " $1")}
              </Label>
              <Input
                type={field.toLowerCase().includes("password") ? "password" : "text"}
                id={field}
                placeholder={
                  field.toLowerCase().includes("password") ? "********" : field === "email" ? "email@example.com" : "example"
                }
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
              />
            </div>
          )
        )}

        <div className="pt-5">
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#4CAF50] text-white py-5 px-4 rounded-md hover:bg-[#45a049] transition duration-200 cursor-pointer"
          >
            Register
          </Button>
        </div>

        <div className="pt-8">
          <p className="font-light text-sm text-[#3E2723]">Remember your account?</p>
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
