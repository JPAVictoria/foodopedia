import Image from "next/image"
import DropdownProducts from "@/app/components/viewer/DropdownProducts"

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-5 px-10">
      <div className="flex items-center gap-8 ml-10">
        <div className="relative w-20 h-20 overflow-hidden">
          <Image
            src="/Foodopedia2.png"
            alt="Logo"
            layout="fill"
          />
        </div>
        <h1 className="font-bold text-[#3E2723] text-[20px]">
          Welcome John Doe
        </h1>
      </div>

      <div className="flex items-center gap-10 mr-10">
        <DropdownProducts />

        <button
          className="flex items-center gap-2 text-[#3E2723] font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Favorites
        </button>

        <button
          className="flex items-center gap-2 text-[#3E2723] font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          Configuration
        </button>
      </div>
    </div>
  )
}
