import Navbar from "@/app/components/viewer/Navbar"
import ProductCard from "@/app/components/viewer/ProductCard"

export default function ViewerHome() {
  return (
    <div className="">
        <Navbar />
      <div className="mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[950px] mx-auto">
          {Array.from({ length: 9 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}