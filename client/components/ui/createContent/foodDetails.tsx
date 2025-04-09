import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function foodDetails(){

    return (
        <div className="space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
        <div>
          <Label htmlFor="food-name" className="mb-2 block">Food Name</Label>
          <Input
            id="food-name"
            className="bg-white border border-[#2d2d2d4e] rounded-none"
          />
        </div>

        <div>
          <Label className="mt-5 mb-1 block">Classification:</Label>
          <div className="flex space-x-16 pt-3">
            {["Dessert", "Appetizer", "Entrée", "Beverages"].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="radio"
                  name="classification"
                  value={type}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="short-description" className="mt-5 mb-1 block">
            Short Description
          </Label>
          <textarea
            id="short-description"
            className="w-full mt-1 bg-white border border-[#2d2d2d4e] p-2 resize-none h-24 rounded-none"
          />
        </div>

        <div>
          <Label htmlFor="instructions" className="mt-6 mb-1 block">
            Instructions
          </Label>
          <textarea
            id="instructions"
            className="w-full mt-1 bg-white border border-[#2d2d2d4e] p-2 resize-none h-24 rounded-none"
          />
        </div>
      </div>
    )
}