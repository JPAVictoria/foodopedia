import { Heart, CornerDownRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  shortDesc: string;
  imageURL?: string;
  adminName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  shortDesc,
  imageURL,
  adminName,
}) => {
  // Check if the image URL is valid (starts with 'http' or 'https')
  const imageSrc = imageURL && imageURL.startsWith("http")
    ? imageURL
    : "/placeholder.jpg"; // Fallback to placeholder image

  return (
    <div className="w-full sm:w-[300px] h-[330px] rounded-sm shadow-md border border-[#2d2d2d5b] bg-[#fffaee] overflow-hidden">
      <div className="px-2 pt-2">
        <div className="relative w-full h-[120px] shadow-sm rounded-sm overflow-hidden">
          {/* Using the <img> tag for external image links */}
          <img
            src={imageSrc}
            alt={title}
            className="object-cover w-full h-full rounded-sm"
          />
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between h-[calc(100%-120px)]">
        <div className="overflow-hidden mt-2">
          <h2 className="font-bold text-md text-[#3E2723] leading-snug line-clamp-2">
            {title}
          </h2>
          <p className="text-xs text-gray-600 mt-1 mb-3">
            Published by: {adminName}
          </p>
          <p className="text-xs text-[#3E2723] leading-[1.5] tracking-[0.01em] line-clamp-4">
            {shortDesc}
          </p>
        </div>
        <div className="flex justify-end items-center gap-3 mb-2">
          <Heart className="w-4 h-4 text-[#3E2723] cursor-pointer hover:scale-110 transition" />
          <CornerDownRight className="w-4 h-4 text-[#3E2723] cursor-pointer hover:scale-110 transition" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
