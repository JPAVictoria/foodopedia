"use client";

import { useEffect, useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProductView {
  id: string;
  title: string;
  views: number;
}

export default function AdminDashboard() {
  useRoleGuard(["admin"]);
  const { setLoading } = useLoading();
  const { isNavbarVisible } = useNavbar();

  const adminId = useMemo(() => {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  }, []);

  const {
    data: productViews = [],
    isLoading,
    isError,
  } = useQuery<ProductView[]>({
    queryKey: ["productViews", adminId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/viewer/analytics/${adminId}`
      );
      return res.data;
    },
    enabled: !!adminId,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

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
            <CardTitle className="text-md text-[#2d2d2d] font-medium">
              Area Chart - Product Views
            </CardTitle>
            <CardDescription className="text-[13px] font-regular text-[#2d2d2d]">
              Number of views per published product
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isError ? (
              <p className="text-red-500">Failed to load data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={450} className="mt-10">
                <AreaChart
                  data={productViews.map((p) => ({
                    name: p.title,
                    views: p.views,
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 50 }} 
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={0}
                    textAnchor="middle"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 12, fill: "#2d2d2d" }}
                    tickFormatter={(value) =>
                      value.length > 15 ? value.slice(0, 15) + "…" : value
                    }
                  />

                  <YAxis
                    ticks={[0, 20, 40, 60, 80, 100]} 
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
