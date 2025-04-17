"use client";
import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "@/app/components/ui/navbar/navbar";
import { FolderOpenDot, BookPlus, Trash2, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import axios from "axios";
import { Chip } from "@mui/material";


export default function UpdateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id"); // grab ID from URL
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const [recipes, setRecipes] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [selectedClassification, setSelectedClassification] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("Draft");
  const classifications = ["DESSERT", "APPETIZER", "ENTREE", "BEVERAGES"];

  const handleAddField = () => setRecipes([...recipes, ""]);
  const handleInputChange = (index: number, value: string) => setRecipes((prev) => prev.map((item, i) => (i === index ? value : item)));
  const handleDeleteField = (index: number) => setRecipes((prev) => prev.filter((_, i) => i !== index));

  const handleAddInstructionField = () => setInstructions([...instructions, ""]);
  const handleInputInstructionChange = (index: number, value: string) => setInstructions((prev) => prev.map((item, i) => (i === index ? value : item)));
  const handleDeleteInstructionField = (index: number) => setInstructions((prev) => prev.filter((_, i) => i !== index));

  const handleClassificationChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedClassification(e.target.value);


  interface Recipe {
    ingredient: string;
  }
  
  interface Instruction {
    instruction: string;
    stepNumber: number;
  }

 
  const validateForm = () => {
    const errorList: string[] = [];

    if (!foodName.trim()) errorList.push("Food name is required.");
    if (!selectedClassification) errorList.push("Classification is required.");
    if (!shortDescription.trim()) errorList.push("Short description is required.");
    if (recipes.some((i) => typeof i !== "string" || i.trim() === "")) {
        openSnackbar("Please fill in all recipes", "error");
        return;
      }
      
      if (instructions.some((i) => typeof i !== "string" || i.trim() === "")) {
        openSnackbar("Please fill in all instructions", "error");
        return;
      }
      

    if (errorList.length > 0) {
      openSnackbar(errorList.join(" "), "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (selectedStatus: string) => {
    if (!validateForm()) return;
  
    try {
      const payload = {
        title: foodName.trim(),
        shortDesc: shortDescription,
        category: selectedClassification,
        status: selectedStatus === 'Publish' ? 'PUBLISHED' : 'DRAFT',
        ingredients: JSON.stringify(recipes.filter(r => r.trim())), // Filter empty and stringify
        instructions: JSON.stringify(instructions.filter(i => i.trim())) // Filter empty and stringify
      };
  
      await axios.put(`http://localhost:5000/admin/content/${contentId}`, payload, {
        headers: { 
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      openSnackbar(`Content updated successfully`, "success");
      setTimeout(() => router.push("/admin/contents"), 2000);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          openSnackbar(err.response.data.message, "error");
        } else {
          openSnackbar(
            err.response?.data?.message || "Failed to update content", 
            "error"
          );
        }
      } else {
        openSnackbar("An unexpected error occurred", "error");
      }
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      openSnackbar("Token is missing", "error");
      const timer = setTimeout(() => router.push("/admin/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [router, openSnackbar]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/content/${contentId}`, {
          withCredentials: true,
        });
        const data = res.data;
    
        setFoodName(data.title || "");
        setShortDescription(data.shortDesc || "");
        setSelectedClassification(data.category || "");
        
        // Fix: Convert backend status to frontend display format
        setStatus(data.status === 'PUBLISHED' ? 'Publish' : 'Draft');
    
        // Properly typed recipe transformation
        const recipeStrings = data.recipes?.map((r: Recipe) => r.ingredient) || [""];
        setRecipes(recipeStrings.length ? recipeStrings : [""]);
    
        // Properly typed instruction transformation
        const instructionStrings = data.instructions
          ?.sort((a: Instruction, b: Instruction) => a.stepNumber - b.stepNumber)
          ?.map((i: Instruction) => i.instruction) || [""];
        setInstructions(instructionStrings.length ? instructionStrings : [""]);
    
      } catch (err) {
        console.error(err);
        openSnackbar("Failed to fetch content", "error");
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId, openSnackbar]);

  return (
    <div className="flex min-h-screen text-[#3E2723]">
      <Navbar />
      <div className={`transition-all duration-300 p-15 flex-1 ${isNavbarVisible ? "ml-0" : "-ml-60"}`}>
      <div className="pb-8">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-[32px] font-bold text-balance pb-5 text-[#3E2723]">
        {foodName || ""}
      </h1>
      <div className="flex flex-col space-y-5">
        <div className="text-sm text-muted-foreground">
          <span>Status:</span>
          <Chip
            label={status}
            sx={{
              marginLeft: "8px", // Space between text and chip
              backgroundColor: status === "Draft" ? "#FFF8E1" : "#E8F5E9", // Custom color for Draft/Publish
              color: status === "Draft" ? "#FBC02D" : "#4CAF50", // Text color depending on the status
              borderRadius: "12px", // Rounded corners for the chip
              padding: "4px 12px", // Padding inside the chip
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground">Viewer Count:</p>
        <p className="text-sm text-muted-foreground">Likes Count:</p>
      </div>
    </div>
    <div className="flex space-x-4">
      {["Draft", "Publish"].map((type) => (
        <div key={type} className="transition cursor-pointer">
          <Button
            variant="ghost"
            className="flex flex-col items-center p-4 min-h-[3rem] hover:bg-[#c5cadc17] cursor-pointer"
            onClick={() => {
              setStatus(type);
              handleSubmit(type);
            }}
          >
            {type === "Draft" ? (
              <FolderOpenDot className="w-5 h-5 text-[#3E2723]" />
            ) : (
              <BookPlus className="w-5 h-5 text-[#3E2723]" />
            )}
            <span className="text-xs text-[#3E2723]">{type}</span>
          </Button>
        </div>
      ))}
    </div>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-[#fffaec] p-8 border border-[#2d2d2d4e] rounded-sm">
            <div>
              <Label htmlFor="food-name" className="mb-2 block">Food Name</Label>
              <Input
                id="food-name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="bg-white border border-[#2d2d2d4e] rounded-none"
              />
            </div>

            <div>
              <Label className="mt-5 mb-1 block">Classification:</Label>
              <div className="flex flex-wrap justify-between pt-3">
                {classifications.map((type) => (
                  <label key={type} className="flex items-center space-x-2 text-sm w-full sm:w-auto">
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
              <Label htmlFor="short-description" className="mt-5 mb-1 block">Short Description</Label>
              <textarea
                id="short-description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full mt-1 bg-white border border-[#2d2d2d4e] p-2 resize-none h-24 rounded-none"
              />
            </div>

            <div>
              <Label htmlFor="instructions" className="mt-6 mb-4 block">Instructions</Label>
              <div className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={instruction}
                      onChange={(e) => handleInputInstructionChange(index, e.target.value)}
                      className="w-full bg-white border border-[#2d2d2d4e] p-2 resize-none h-8 rounded-none"
                    />
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteInstructionField(index)}
                        className="text-[#3E2723] hover:text-[#3e2723a0] ml-2 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div
                className="flex items-center space-x-2 text-sm text-[#3E2723] cursor-pointer mt-4"
                onClick={handleAddInstructionField}
              >
                <Plus size={16} />
                <span>Add</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
              <div
                className="flex items-center space-x-2 text-sm text-[#3E2723] cursor-pointer mt-4"
                onClick={handleAddField}
              >
                <Plus size={16} />
                <span>Add</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}