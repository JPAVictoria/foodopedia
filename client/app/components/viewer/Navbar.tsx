import Image from "next/image"
import DropdownProducts from "@/app/components/viewer/DropdownProducts"
import Link from "next/link"

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
        <h1 className="font-bold text-[#FF9800] text-[20px]">
          Welcome, John Doe
        </h1>
      </div>

      <div className="flex items-center gap-20 mr-20">
        <DropdownProducts />

        <Link href="/viewer/favorites">
          <button
            className="flex items-center gap-2 text-[#FF9800] hover:underline font-medium cursor-pointer outline-none focus:outline-none focus:ring-0"
          >
            Favorites
          </button>
        </Link>

        <Link href="/viewer/profile">
          <button
            className="flex items-center gap-2 text-[#FF9800] font-medium hover:underline cursor-pointer outline-none focus:outline-none focus:ring-0"
          >
            Profile
          </button>
        </Link>
      </div>
    </div>
  )
}
