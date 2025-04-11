import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export default function FoodDetails() {
  const [instructions, setInstructions] = useState([""]);
  const [selectedClassification, setSelectedClassification] = useState("");

  const classifications = ["Dessert", "Appetizer", "Entrée", "Beverages"]; // Array for classification values

  const handleAddField = () => {
    setInstructions([...instructions, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const handleDeleteField = (index: number) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  const handleClassificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedClassification(event.target.value);
  };

  return (
    <div className="space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
      <div>
        <Label htmlFor="food-name" className="mb-2 block">
          Food Name
        </Label>
        <Input
          id="food-name"
          className="bg-white border border-[#2d2d2d4e] rounded-none"
        />
      </div>

      <div>
        <Label className="mt-5 mb-1 block">Classification:</Label>
        <div className="flex flex-wrap justify-between pt-3">
          {classifications.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 text-sm w-full sm:w-auto"
            >
              <input
                type="radio"
                name="classification"
                value={type}
                checked={selectedClassification === type}
                onChange={handleClassificationChange}
                className="text-sm"
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
        <Label htmlFor="instructions" className="mt-6 mb-4 block">
          Instructions
        </Label>
        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                value={instruction}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full bg-white border border-[#2d2d2d4e] p-2 resize-none h-8 rounded-none"
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteField(index)}
                  className="text-[#3E2723] hover:text-[#3e2723a0] ml-2 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add button */}
        <div
          className="flex items-center space-x-2 text-sm text-[#3E2723] cursor-pointer mt-4"
          onClick={handleAddField}
        >
          <Plus size={16} />
          <span>Add</span>
        </div>
      </div>
    </div>
  );
}
