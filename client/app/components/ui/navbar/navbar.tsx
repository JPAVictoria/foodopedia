import { Home, FileText, Settings, LogOut, AlignRight, Menu } from "lucide-react";
import NavbarTitle from "./navbarTitle";
import Link from "next/link";
import { useNavbar } from "@/app/context/NavbarContext";
import Cookies from "js-cookie";

export default function Navbar() {
  const { isNavbarVisible, toggleNavbar } = useNavbar();

  const handleLogout = () => {
    Cookies.remove("token");
    console.log("JWT token removed from cookies");

    // Manually remove admin data from localStorage
    localStorage.removeItem("admin");
    console.log("Admin data cleared from localStorage");

    window.location.href = "/admin/login"; // Redirect to login page
  };

  return (
    <>
      {!isNavbarVisible && (
        <button
          onClick={toggleNavbar}
          className="fixed top-4 left-4 p-2 text-[#3E2723] bg-transparent border-none cursor-pointer hover:bg-[#F1E5D8] z-50 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <div
        className={`${
          isNavbarVisible ? "translate-x-0" : "-translate-x-full"
        } fixed md:static top-0 left-0 z-40 min-h-screen md:h-auto w-64 bg-[#F5EEDC] flex flex-col p-4 border-r border-[#3E2723] transition-transform duration-300`}
      >
        {/* Close icon */}
        <button
          onClick={toggleNavbar}
          className="absolute top-4 right-4 p-2 text-[#3E2723] bg-transparent border-none cursor-pointer hover:bg-[#F1E5D8] transition"
        >
          <AlignRight className="w-6 h-6" />
        </button>

        <div className="mt-12">
          <NavbarTitle />
        </div>

        <div className="space-y-8 mt-20 flex-grow">
          <Link href={"/admin"} className="block">
            <NavItem label="Home" Icon={Home} />
          </Link>
          <Link href={"/admin/contents"} className="block">
            <NavItem label="Contents" Icon={FileText} />
          </Link>
          <Link href={"/admin/configure"} className="block">
            <NavItem label="Configuration" Icon={Settings} />
          </Link>
        </div>

        <div>
          <button onClick={handleLogout}>
            <NavItem label="Logout" Icon={LogOut} />
          </button>
        </div>
      </div>
    </>
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
