import Navbar from "@/components/ui/navbar/navbar";
import { SquarePlus } from "lucide-react";
import Link from "next/link";

export default function Contents() {
  return (
    <div className="flex relative min-h-screen">
      <Navbar />

      <div className="flex-1 pt-10 p-15">
        <div className="flex justify-end">
          <Link href="/admin/createContent" target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center hover:bg-[#c5cadc17] rounded-md p-2 cursor-pointer transition">
              <SquarePlus className="w-5 h-5 text-[#3E2723]" />
              <span className="text-xs text-[#3E2723] mt-1">Create</span>
            </div>
          </Link>
        </div>

        <h1 className="text-[24px] font-bold text-[#4CAF50] mt-4 text-center">Content Overview</h1>
        
      </div>
    </div>
  );
}
