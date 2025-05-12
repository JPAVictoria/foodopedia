"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SpecificPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/adobong-sitaw-1.jpg",
    "/adobong-sitaw-2.jpg",
    "/adobong-sitaw-3.jpg",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mt-5 flex justify-start">
        <Link
          href="/viewer/home"
          className="flex items-center text-[#3E2723] hover:text-[#5D4037] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="mt-20 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div
            className="relative aspect-square rounded-lg overflow-hidden mb-4 
                         border border-[#2d2d2d] border-opacity-25 shadow-sm"
          >
            <Image
              src={images[currentImageIndex]}
              alt="Adobong Sitaw"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex justify-center gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors border border-[#2d2d2d] ${
                  currentImageIndex === index
                    ? "bg-[#F7D9A5]"
                    : "bg-[#ffffff] cursor-pointer"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="ml-5 w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-[#3E2723] mb-4">
            Adobong Sitaw
          </h1>

          <div className="mb-6">
            <p className="text-[#3E2723] tracking-[0.01em] leading-[1.5] mb-4">
              Hungarian Overload is a feast of bold and hearty flavors, packed
              with traditional Hungarian favorites like rich goulash, savory
              sausages, cheesy lángos, and spicy paprika stews. This dish is a
              true celebration of Hungary's culinary heritage, delivering a
              satisfying and indulgent experience in every bite!
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] mb-2">
              Ingredients:
            </h2>
            <p className="text-[#3E2723] tracking-[0.01em] leading-[1.5]">
              Olive oil, downy, zonrox, sayote, amapalaya, kung ano-ano pa Olive
              oil, downy, zonrox, sayote, amapalaya, kung ano-ano pa
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#3E2723] mb-2">
              Instructions to make:
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <li
                  key={index}
                  className="text-[#3E2723] tracking-[0.01em] leading-[1.5]"
                >
                  Olive oil, downy, zonrox, sayote, amapalaya, kung ano-ano pa
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
