import { Home, FileText, Settings, LogOut, AlignRight, Menu } from "lucide-react";
import NavbarTitle from "./navbarTitle";
import { useNavbar } from "@/app/context/NavbarContext";
import Cookies from "js-cookie";
import { useLoading } from "@/app/context/LoaderContext";
import { useRouter } from "next/navigation"; 

export default function Navbar() {
  const { isNavbarVisible, toggleNavbar } = useNavbar();
  const { setLoading } = useLoading();
  const router = useRouter(); 

  const handleLogout = () => {
    setLoading(true);
    Cookies.remove("token");
    localStorage.removeItem("admin");
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 1000);
  };

  const handleNavigation = (path: string) => {
    setLoading(true); 
    router.push(path);
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
          <button 
            onClick={() => handleNavigation("/admin")} 
            className="block w-full text-left"
          >
            <NavItem label="Home" Icon={Home} />
          </button>
          <button 
            onClick={() => handleNavigation("/admin/contents")} 
            className="block w-full text-left"
          >
            <NavItem label="Contents" Icon={FileText} />
          </button>
          <button 
            onClick={() => handleNavigation("/admin/configure")} 
            className="block w-full text-left"
          >
            <NavItem label="Configuration" Icon={Settings} />
          </button>
        </div>

        <div>
          <button onClick={handleLogout} className="w-full text-left">
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