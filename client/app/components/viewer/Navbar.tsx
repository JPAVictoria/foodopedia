import Image from "next/image"
import DropdownProducts from "@/app/components/viewer/DropdownProducts"
import { Button } from "@/app/components/ui/button"

export default function Navbar() {
  return (
    <div className="flex items-center p-5">
      <div className="flex items-center gap-10">  
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={32}  
          height={32} 
          className="rounded-full object-contain ml-20"  
        />
        <span className="font-bold text-[#3E2723] text-[20px]">Foodopedia</span>
      </div>

      <div className="flex items-center gap-20 ml-60"> 
        <DropdownProducts />
        <Button
          className="flex items-center gap-2 text-[#3E2723] font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Favorites
        </Button>
      </div>
    </div>
  )
}
