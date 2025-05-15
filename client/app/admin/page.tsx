"use client";

import { useEffect } from "react";
import { useNavbar } from "@/app/context/NavbarContext";
import { useLoading } from "@/app/context/LoaderContext";
import Navbar from "@/app/components/ui/navbar/navbar";
import useRoleGuard from "../hooks/useRoleGuard";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export default function AdminDashboard() {
  useRoleGuard(["admin"]);
  const { setLoading } = useLoading();
  const { isNavbarVisible } = useNavbar();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main
        className={`transition-all mt-10 duration-300 flex-1 p-10 ${
          isNavbarVisible ? "ml-0" : "-ml-54"
        }`}
      >
        <h1 className="text-2xl font-bold text-center text-[#4CAF50] mb-8">
          Content Analytics Dashboard
        </h1>

        <Card className="bg-white rounded-lg shadow-md p-6 w-full border-0">
          <CardHeader>
            <CardTitle className="text-md text-[#2d2d2d] font-medium">Area Chart - Product Views</CardTitle>
            <CardDescription className="text-[13px] font-regular text-[#2d2d2d]">
              Number of views per product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={(val) => val.slice(0, 3)} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="mobile"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="desktop"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
