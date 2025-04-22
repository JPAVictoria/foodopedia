import { Heart, CornerDownRight } from "lucide-react";
import Image from "next/image";

export default function ProductCard() {
  return (
    <div className="w-[300px] h-[335px] rounded-sm shadow-md border border-[#2d2d2d5b] bg-[#fffaee] overflow-hidden transition-transform hover:scale-[1.01]">
      <div className="px-2 pt-2">
        <div className="relative w-full h-[120px] shadow-sm rounded-sm overflow-hidden">
          <Image
            src="/IMG_9840.png"
            alt="Hungarian Overload"
            fill
            className="object-cover rounded-sm"
          />
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between h-[calc(100%-120px)]">
        <div className="overflow-hidden mt-2">
          <h2 className="font-bold text-md text-[#3E2723] leading-snug line-clamp-2">
            Hungarian Overload ni Diwata
          </h2>
          <p className="text-xs text-gray-600 mt-1 mb-3">Published by: Admin Name</p>
          <p className="text-xs text-[#3E2723] leading-[1.5] tracking-[0.01em] line-clamp-4">
            Hungarian Overload is a feast of bold and hearty flavors, packed
            with traditional Hungarian favorites like rich goulash, savory
            sausages, cheesy lángos, and spicy paprika stews. This dish is a
            true celebration of Hungary’s culinary heritage, delivering a
            satisfying and indulgent experience in every bite!
          </p>
        </div>
        <div className="flex justify-end items-center gap-3 mb-2">
          <Heart className="w-4 h-4 text-[#3E2723] cursor-pointer hover:scale-110 transition" />
          <CornerDownRight className="w-4 h-4 text-[#3E2723] cursor-pointer hover:scale-110 transition" />
        </div>
      </div>
    </div>
  );
}
