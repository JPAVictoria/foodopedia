"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type NavbarContextType = {
  isNavbarVisible: boolean;
  toggleNavbar: () => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const toggleNavbar = () => {
    setNavbarVisible((prev) => !prev);
  };

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}
