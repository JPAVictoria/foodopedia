import { useLoginStore } from "@/app/stores/useLoginStore";

export default function NavbarTitle() {
  const admin = useLoginStore((state) => state.admin); 
  return (
    <div className="bg-[#F3E7C7] p-4 rounded-md text-[#3E2723]">
      <h1 className="text-xl font-bold">{admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}</h1>
      <p className="text-[14px] pt-1">Admin</p>
    </div>
  );
}
