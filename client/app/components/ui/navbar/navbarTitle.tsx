import { useEffect, useState } from "react";

export default function NavbarTitle() {
  const [admin, setAdmin] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    // Load admin data from localStorage when the component mounts
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <div className="bg-[#F3E7C7] p-4 rounded-md text-[#3E2723]">
      <h1 className="text-xl font-bold">
        {admin ? `${admin.firstName} ${admin.lastName}` : "Loading..."}
      </h1>
      <p className="text-[14px] pt-1">Admin</p>
    </div>
  );
}
