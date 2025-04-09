import { FolderOpenDot, BookPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContentHeader(){
    return(
        <div>
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[32px] font-bold text-balance pb-5 text-[#3E2723]">PC - 001</h1>
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Status:</p>
              <p className="text-sm text-muted-foreground">Viewer Count:</p>
              <p className="text-sm text-muted-foreground">Likes Count:</p>
            </div>
          </div>

          <div className="flex space-x-4">
            {[
              {
                icon: <FolderOpenDot className="w-5 h-5 text-[#3E2723]" />,
                label: "Draft",
              },
              {
                icon: <BookPlus className="w-5 h-5 text-[#3E2723]" />,
                label: "Publish",
              },
              {
                icon: <Trash2 className="w-5 h-5 text-[#3E2723]" />,
                label: "Delete",
              },
            ].map(({ icon, label }, index) => (
              <div
                key={index}
                className="py-2 hover:bg-muted rounded-md transition cursor-pointer"
              >
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-1 p-1 bg-transparent hover:bg-transparent cursor-pointer"
                >
                  {icon}
                  <span className="text-xs text-[#3E2723]">{label}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        </div>
    )
}