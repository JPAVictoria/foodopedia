"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { SquarePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useNavbar } from "@/app/context/NavbarContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import axios from "axios";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";

interface ContentItem {
  uuid: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function Contents() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const [rows, setRows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      openSnackbar("Token is missing", "error");

      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 2000);

      return () => clearTimeout(timer);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/content",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRows(response.data); // Assuming data is an array of ContentItem
      } catch (error: unknown) {
        console.error("Error fetching content:", error);
        openSnackbar("Failed to load content.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, openSnackbar]);

  const columns: GridColDef[] = [
    {
      field: "uuid",
      headerName: "Product Code",
      width: 220,
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ color: "#3E2723" }}>{params.value}</span>
      ),
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "title",
      headerName: "Food Name",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 300,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: () => (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Button
            size="medium"
            variant="text"
            sx={{
              minWidth: "auto",
              padding: "8px 16px",
              color: "#3E2723",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: "100%",
            }}
          >
            <Pencil className="w-4 h-4" />
            <Typography variant="caption" sx={{ color: "#3E2723", fontSize: "0.7rem", marginTop: "4px", textTransform: "none" }}>
              Edit
            </Typography>
          </Button>

          <Button
            size="medium"
            variant="text"
            sx={{
              minWidth: "auto",
              padding: "8px 16px",
              color: "#3E2723",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: "100%",
            }}
          >
            <Trash2 className="w-4 h-4" />
            <Typography variant="caption" sx={{ color: "#3E2723", fontSize: "0.7rem", marginTop: "4px", textTransform: "none" }}>
              Delete
            </Typography>
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <div className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 flex-1 ${isNavbarVisible ? "ml-0" : "-ml-60"}`}>
        <div className="flex justify-end">
          <Link href="/admin/createContent" target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center rounded-md p-2 cursor-pointer transition">
              <SquarePlus className="w-5 h-5 text-[#3E2723]" />
              <span className="text-xs text-[#3E2723] mt-1">Create</span>
            </div>
          </Link>
        </div>

        <h1 className="text-[24px] font-bold text-[#4CAF50] mt-4 text-center sm:text-[18px] md:text-[22px] lg:text-[24px]">
          Content Overview
        </h1>

        <Box sx={{ height: 500, width: "100%", marginTop: 5 }}>
          <DataGrid
            getRowId={(row) => row.uuid}
            rows={rows}
            columns={columns}
            loading={loading}
            pagination
            pageSizeOptions={[5, 10, 20]}
            disableColumnMenu
            disableColumnResize
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            rowHeight={80}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fff",
                color: "#3E2723",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none !important",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "hidden !important",
              },
              "& .MuiDataGrid-row": {
                ":hover": { backgroundColor: "transparent" },
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}
