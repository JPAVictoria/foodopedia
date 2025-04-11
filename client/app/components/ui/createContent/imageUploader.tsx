import { Label } from "@/app/components/ui/label";
import { FolderOpenDot } from "lucide-react";
export default function ImageUploader(){

    return (
        <div className="bg-[#fffaec] p-8 rounded-sm border border-[#2d2d2d4e]">
        <Label className="mb-3 block">Images & Videos:</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-sm p-2 cursor-pointer hover:bg-gray-100 transition"
            >
              <FolderOpenDot className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-500 mt-2">Upload</span>
            </div>
          ))}
        </div>
      </div>
    )
}