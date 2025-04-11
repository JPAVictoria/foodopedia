import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([""]);

  const handleAddField = () => {
    setRecipes([...recipes, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedRecipes = [...recipes];
    updatedRecipes[index] = value;
    setRecipes(updatedRecipes);
  };

  const handleDeleteField = (index: number) => {
    const updatedRecipes = recipes.filter((_, i) => i !== index);
    setRecipes(updatedRecipes);
  };

  return (
    <div className="bg-[#fffaec] p-8 rounded-sm border border-[#2d2d2d4e]">
      <Label className="mb-3 block">Recipes:</Label>
      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={recipe}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full bg-white border border-[#2d2d2d4e] p-2 h-8 resize-none rounded-none"
            />
            {recipes.length > 1 && (
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
  );
}
