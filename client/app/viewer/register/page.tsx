"use client";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterStore } from "@/app/stores/useRegisterStore";
import { useLoading } from "@/app/context/LoaderContext";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function Signup() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setLoading: setGlobalLoading } = useLoading();

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    submitted,
    showPassword,
    showConfirmPassword,
    setField,
    setLoading,
    setSubmitted,
    toggleShowPassword,
    toggleShowConfirmPassword,
    resetForm,
  } = useRegisterStore();

  const isDisabled = loading || submitted;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField(e.target.id, e.target.value);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      openSnackbar("Please enter a valid email address", "error");
      return;
    }

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      openSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    setLoading(true);
    setGlobalLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/viewer/register/signup",
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }
      );

      if (res.status === 201) {
        openSnackbar("Registration successful!", "success");
        setSubmitted(true);

        setTimeout(() => {
          router.push("/viewer/login");
          resetForm();
        }, 2000);
      } else {
        openSnackbar(res.data.message || "Something went wrong", "error");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      openSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
      setTimeout(() => setGlobalLoading(false), 2500);
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
          Register now
        </h1>

        {[
          {
            id: "firstName",
            label: "First Name",
            value: firstName,
            type: "text",
          },
          { id: "lastName", label: "Last Name", value: lastName, type: "text" },
          { id: "email", label: "Email", value: email, type: "email" },
          {
            id: "password",
            label: "Password",
            value: password,
            type: showPassword ? "text" : "password",
            isPassword: true,
            toggle: toggleShowPassword,
            show: showPassword,
          },
          {
            id: "confirmPassword",
            label: "Confirm Password",
            value: confirmPassword,
            type: showConfirmPassword ? "text" : "password",
            isPassword: true,
            toggle: toggleShowConfirmPassword,
            show: showConfirmPassword,
          },
        ].map((field, idx) => (
          <div className="pt-5 relative" key={idx}>
            <Label htmlFor={field.id} className="pb-2 text-[#3E2723]">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder={
                field.id === "email"
                  ? "email@example.com"
                  : field.isPassword
                  ? "********"
                  : "example"
              }
              className="focus:outline-none focus:border-[#FF9800] focus:shadow-sm focus:shadow-[#FF9800]/30 transition-all duration-300 pr-10"
            />
            {field.isPassword && (
              <div
                onClick={field.toggle}
                className="absolute inset-y-15 right-3 flex items-center cursor-pointer text-gray-500 hover:text-[#FF9800] transition"
              >
                {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            )}
          </div>
        ))}

        <div className="pt-5">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`w-full text-white py-5 px-4 rounded-md transition duration-200 ${
              isDisabled
                ? "bg-[#FF9800] cursor-not-allowed"
                : "bg-[#FF9800] hover:bg-[#FAC36E] cursor-pointer"
            }`}
          >
            {loading ? "Registering..." : submitted ? "Registered" : "Register"}
          </Button>
        </div>

        <div className="pt-8">
          <p className="font-light text-sm text-[#3E2723]">
            Remember your account?
          </p>
          <Link href="/viewer/login">
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
