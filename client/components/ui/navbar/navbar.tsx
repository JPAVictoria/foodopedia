"use client";
import { Home, FileText, Settings, LogOut, AlignRight, Menu } from "lucide-react";
import { useState } from "react";
import NavbarTitle from "./navbarTitle";
import Link from "next/link";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const toggleNavbar = () => {
    setNavbarVisible(!isNavbarVisible);
  };

  return (
    <div className="relative">
      {/* Burger icon when navbar is hidden */}
      {!isNavbarVisible && (
        <button
          onClick={toggleNavbar}
          className="absolute top-4 left-4 p-2 text-[#3E2723] bg-transparent border-none cursor-pointer hover:bg-[#F1E5D8] transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Navbar Content */}
      <div
        className={`h-screen w-64 bg-[#F5EEDC] flex flex-col p-4 border border-[#3E2723] transition-all duration-300 ${
          isNavbarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleNavbar}
          className="absolute top-4 right-4 p-2 text-[#3E2723] bg-transparent border-none cursor-pointer hover:bg-[#F1E5D8] transition"
        >
          <AlignRight className="w-6 h-6" />
        </button>

        <div className="mt-12">
          <NavbarTitle />
        </div>

        {/* Navbar Options */}
        <div className="space-y-8 mt-20 flex-grow">
          <Link href={"/admin"} className="block">
            <NavItem label="Home" Icon={Home} />
          </Link>
          <Link href={"/admin/contents"} className="block">
            <NavItem label="Contents" Icon={FileText} />
          </Link>
          <Link href={"/admin//configure"} className="block">
            <NavItem label="Configuration" Icon={Settings} />
          </Link>
        </div>

        {/* Bottom nav item (Logout) */}
        <div>
          <NavItem label="Logout" Icon={LogOut} />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  label,
  Icon,
}: {
  label: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer font-medium px-2 py-2 rounded hover:bg-[#F1E5D8] transition">
      <Icon className="w-5 h-5 text-[#3E2723]" />
      <span>{label}</span>
    </div>
  );
}
