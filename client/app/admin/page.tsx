"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "@/app/components/ui/navbar/navbar";
import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@mui/material";

export default function AdminDashboard() {
  const { isNavbarVisible } = useNavbar();
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      openSnackbar("Token is missing", "error");

      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router, openSnackbar]);

  const pieChartData = [
    { id: 0, value: 30, color: "#06b6d4" },
    { id: 1, value: 40, color: "#a855f7" },
    { id: 2, value: 30, color: "#14b8a6" },
  ];

  const filterButtons = ["Custom", "Monthly", "All time"];

  const buttonStyles = {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "rgba(45, 45, 45, 0.1)",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "rgba(45, 45, 45, 0.2)",
    },
  };

  const valueFormatter = (value: { value: number }) => {
    return `${value.value}%`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className={`transition-all mt-10 duration-300 flex-1 p-10 ${
          isNavbarVisible ? "ml-0" : "-ml-54"
        }`}>
        <h1 className="mt-5 text-2xl font-bold text-center text-[#4CAF50] mb-10">
          Content Analytics Dashboard
        </h1>

        <div className="mt-25 grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {/* Card 1: Most Liked Products */}
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md min-h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-[#4CAF50] text-center">
              Top 10 Most Liked Products
            </h2>

            <div className="pt-10 flex justify-center space-x-2 mb-4">
              {filterButtons.map((label) => (
                <Button
                  key={label}
                  variant="outlined"
                  size="small"
                  sx={buttonStyles}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="flex-1 flex justify-center items-center ml-25">
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                    valueFormatter,
                  },
                ]}
                height={250}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md min-h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-[#4CAF50] text-center">
              Top 10 Most Viewed Products
            </h2>

            <div className="pt-10 flex justify-center space-x-2 mb-4">
              {filterButtons.map((label) => (
                <Button
                  key={label}
                  variant="outlined"
                  size="small"
                  sx={buttonStyles}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="flex-1 flex justify-center items-center ml-25">
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                    valueFormatter,
                  },
                ]}
                height={250}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
