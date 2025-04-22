"use client";
import Navbar from "@/app/components/viewer/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useConfigureStore } from "@/app/stores/useConfigureStore";
import { useToggleStore } from "@/app/stores/useToggleStore";
import { useMutation } from "@tanstack/react-query";
import { useLoading } from "@/app/context/LoaderContext";

export default function Configure() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();

  const { firstName, lastName, setFirstName, setLastName } =
    useConfigureStore();
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrent,
    showNew,
    showConfirm,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    toggleShowCurrent,
    toggleShowNew,
    toggleShowConfirm,
    resetPasswordForm,
  } = useToggleStore();

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      return axios.put(
        "http://localhost:5000/admin/change/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res) => {
      openSnackbar(
        res.data.message || "Password updated successfully.",
        "success"
      );
      resetPasswordForm();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        openSnackbar(
          error.response?.data?.message || "Failed to update password.",
          "error"
        );
      } else {
        openSnackbar("An unexpected error occurred.", "error");
      }
      resetPasswordForm();
    },
  });

  const nameMutation = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      return axios.put(
        "http://localhost:5000/admin/change/change-name",
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res) => {
      localStorage.setItem("admin", JSON.stringify({ firstName, lastName }));
      openSnackbar(res.data.message || "Name updated successfully.", "success");
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        openSnackbar(
          error.response?.data?.message || "Failed to update name.",
          "error"
        );
      } else {
        openSnackbar("An unexpected error occurred.", "error");
      }
    },
  });

  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      openSnackbar("Token is missing", "error");
      const timer = setTimeout(() => router.push("/admin/login"), 2000);
      return () => clearTimeout(timer);
    }

    setLoading(false);
  }, [router, openSnackbar, setLoading]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      openSnackbar("New and confirm password do not match.", "error");
      return;
    }

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      openSnackbar("Password must have a minimum of 8 characters.", "error");
      return;
    }
    passwordMutation.mutate();
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nameMutation.mutate();
  };

  return (
    <div className="">
      <Navbar />
      <div className="transition-all duration-300 flex-1 p-10">
        <div className="flex justify-center gap-16 mt-10 flex-wrap">
          <div className="flex flex-col items-center w-[400px]">
            <h1 className="font-bold text-[32px] text-transparent mb-7 bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FAC36E] to-[#F7D9A5]">
              Change Password
            </h1>
            <div className="w-full space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-7"
              >
                {["current", "new", "confirm"].map((type) => (
                  <div key={type} className="relative">
                    <Label
                      htmlFor={`${type}-password`}
                      className="pb-2 text-[#3E2723]"
                    >
                      {type === "current"
                        ? "Current"
                        : type === "new"
                        ? "New"
                        : "Confirm"}{" "}
                      Password
                    </Label>
                    <Input
                      type={
                        type === "current"
                          ? showCurrent
                            ? "text"
                            : "password"
                          : type === "new"
                          ? showNew
                            ? "text"
                            : "password"
                          : showConfirm
                          ? "text"
                          : "password"
                      }
                      id={`${type}-password`}
                      value={
                        type === "current"
                          ? currentPassword
                          : type === "new"
                          ? newPassword
                          : confirmPassword
                      }
                      onChange={(e) =>
                        type === "current"
                          ? setCurrentPassword(e.target.value)
                          : type === "new"
                          ? setNewPassword(e.target.value)
                          : setConfirmPassword(e.target.value)
                      }
                      className="focus:outline-none focus:border-[#FF9800] focus:shadow-sm focus:shadow-[#FF9800]/30 transition-all duration-300"
                    />
                    <div
                      onClick={
                        type === "current"
                          ? toggleShowCurrent
                          : type === "new"
                          ? toggleShowNew
                          : toggleShowConfirm
                      }
                      className="absolute top-8 right-3 cursor-pointer"
                    >
                      {type === "current" ? (
                        showCurrent ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )
                      ) : type === "new" ? (
                        showNew ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )
                      ) : showConfirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="submit"
                  className="mt-2 bg-[#FF9800] hover:bg-[#FAC36E] text-white"
                  disabled={passwordMutation.isPending}
                >
                  {passwordMutation.isPending ? "Updating..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>

          <div className="flex flex-col items-center w-[400px]">
            <h1 className="font-bold text-[32px] text-transparent mb-7 bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FAC36E] to-[#F7D9A5]">
              Change Name
            </h1>
            <div className="w-full space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
              <form onSubmit={handleNameSubmit} className="flex flex-col gap-7">
                <div>
                  <Label htmlFor="first-name" className="pb-2 text-[#3E2723]">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="focus:outline-none focus:border-[#FF9800] focus:shadow-sm focus:shadow-[#FF9800]/30 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="last-name" className="pb-2 text-[#3E2723]">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="focus:outline-none focus:border-[#FF9800] focus:shadow-sm focus:shadow-[#FF9800]/30 transition-all duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#FF9800] hover:bg-[#FAC36E] text-white"
                  disabled={nameMutation.isPending}
                >
                  {nameMutation.isPending ? "Updating..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
