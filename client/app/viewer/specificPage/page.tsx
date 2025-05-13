"use client";

import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoading } from "@/app/context/LoaderContext";
import { useSearchParams } from "next/navigation";

interface Recipe {
  ingredient: string;
}

interface Instruction {
  instruction: string;
}

interface Content {
  id: string;
  title: string;
  shortDesc: string;
  imageURL: string;
  recipes: Recipe[];
  instructions: Instruction[];
}

export default function SpecificPage() {
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id");

  const {
    data: content,
    isLoading,
    isError,
  } = useQuery<Content | undefined>({
    queryKey: ["content", contentId],
    queryFn: async () => {
      if (!contentId) throw new Error("Content ID is missing");
      const res = await axios.get<Content>(
        `http://localhost:5000/viewer/getCard/${contentId}`
      );
      return res.data;
    },
    enabled: !!contentId,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (!contentId || !content || isError) return null;

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

      {/* Content Section */}
      <div className="mt-20 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-[#2d2d2d] border-opacity-25 shadow-sm">
            <img
              src={content.imageURL || "/placeholder.jpg"}
              alt={content.title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <div className="ml-5 w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-[#3E2723] mb-4">
            {content.title}
          </h1>

          <div className="mb-6">
            <p className="text-[#3E2723] text-[14px] tracking-[0.01em] leading-[1.5] mb-4">
              {content.shortDesc}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#3E2723] mb-3">
              Ingredients:
            </h2>
            <p className="text-[#3E2723] text-[14px] tracking-[0.01em] leading-[1.5]">
              {content.recipes.map((r) => r.ingredient).join(", ")}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#3E2723] mb-3">
              Instructions:
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              {content.instructions.map((step, index) => (
                <li
                  key={index}
                  className="text-[#3E2723] text-[14px] tracking-[0.01em] leading-[1.5]"
                >
                  {step.instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
