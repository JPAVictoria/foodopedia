"use client";

import Navbar from "@/app/components/ui/navbar/navbar";
import { SquarePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useNavbar } from "@/app/context/NavbarContext";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSnackbar } from "@/app/context/SnackbarContext"; // Add Snackbar context

interface ContentItem {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function Contents() {
  const { isNavbarVisible } = useNavbar();
  const { openSnackbar } = useSnackbar(); // Get the snackbar function

  const [rows, setRows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/content");
        setRows(response.data); 
      } catch (error) {
        console.error("Error fetching content data", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Food Name",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 350,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Link href={`/admin/updateContent?id=${params.row.id}`}>
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
          </Link>

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
            onClick={() => handleDelete(params.row.id)} // Add the delete handler
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

  const handleDelete = async (id: string) => {
    try {
      // Perform a soft delete by updating the status to "deleted"
      await axios.put(`http://localhost:5000/admin/content/softDelete/${id}`, {}, { withCredentials: true });
      
      // Update the rows state to reflect the change
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));

      openSnackbar("Content deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting content", error);
      openSnackbar("Failed to delete content", "error");
    }
  };

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

        <Box sx={{ height: 500, width: "auto", marginTop: 5 }}>
          <DataGrid
            getRowId={(row) => row.id}  
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
