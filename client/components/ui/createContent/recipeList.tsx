import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function RecipeList(){

    return (
            <div className="bg-[#fffaec] p-8 rounded-sm border border-[#2d2d2d4e]">
              <Label className="mb-3 block">Recipes:</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Input
                    key={i}
                    className="bg-white border border-[#2d2d2d4e] rounded-none"
                  />
                ))}
              </div>
            </div>
    )
}