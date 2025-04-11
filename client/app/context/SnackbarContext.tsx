"use client";
import React, { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

// Define types for the Snackbar severity (success, error, info, warning)
type SnackbarType = "success" | "error" | "info" | "warning";

// Define the context for Snackbar
interface SnackbarContextType {
  openSnackbar: (message: string, type: SnackbarType) => void;
}

// Create a context for Snackbar
const SnackbarContext = React.createContext<SnackbarContextType | undefined>(
  undefined
);

// Type for the SnackbarProvider component to include children prop
interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarType>("info");

  const openSnackbar = useCallback((msg: string, type: SnackbarType) => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  // Close handler
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use Snackbar
export const useSnackbar = (): SnackbarContextType => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
