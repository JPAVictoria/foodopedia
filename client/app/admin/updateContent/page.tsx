"use client";
import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "@/app/components/ui/navbar/navbar";
import { FolderOpenDot, BookPlus, Trash2, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Chip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useInformationStore } from "@/app/stores/adminStores/useInformationStore";
import { useLoading } from "@/app/context/LoaderContext"; 


type Classification = "DESSERT" | "APPETIZER" | "ENTREE" | "BEVERAGES";

interface Recipe {
  ingredient: string;
}

interface Instruction {
  instruction: string;
  stepNumber: number;
}

interface ContentResponse {
  title: string;
  shortDesc: string;
  category: Classification;
  status: "PUBLISHED" | "DRAFT";
  recipes: Recipe[];
  instructions: Instruction[];
}

export default function UpdateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading } = useLoading(); 
  const contentId = searchParams.get("id");
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();
  const queryClient = useQueryClient();

  const {
    recipes,
    instructions,
    selectedClassification,
    foodName,
    shortDescription,
    status,
    setRecipes,
    setInstructions,
    setSelectedClassification,
    setFoodName,
    setShortDescription,
    setStatus,
  } = useInformationStore();

  const classifications: Classification[] = ["DESSERT", "APPETIZER", "ENTREE", "BEVERAGES"];

  const handleAddField = () => setRecipes([...recipes, ""]);
  const handleInputChange = (index: number, value: string) =>
    setRecipes(recipes.map((item, i) => (i === index ? value : item)));
  const handleDeleteField = (index: number) =>
    setRecipes(recipes.filter((_, i) => i !== index));

  const handleAddInstructionField = () => setInstructions([...instructions, ""]);
  const handleInputInstructionChange = (index: number, value: string) =>
    setInstructions(instructions.map((item, i) => (i === index ? value : item)));
  const handleDeleteInstructionField = (index: number) =>
    setInstructions(instructions.filter((_, i) => i !== index));

  const handleClassificationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedClassification(e.target.value as Classification);

  const {  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: async (): Promise<ContentResponse> => {
      const res = await axios.get(`http://localhost:5000/admin/content/${contentId}`, {
        withCredentials: true,
      });
      const data: ContentResponse = res.data;

      setFoodName(data.title || "");
      setShortDescription(data.shortDesc || "");
      setSelectedClassification(data.category || "");
      setStatus(data.status === "PUBLISHED" ? "Publish" : "Draft");

      const recipeStrings = data.recipes?.map((r) => r.ingredient) || [""];
      setRecipes(recipeStrings.length ? recipeStrings : [""]);

      const instructionStrings = data.instructions
        ?.sort((a, b) => a.stepNumber - b.stepNumber)
        ?.map((i) => i.instruction) || [""];
      setInstructions(instructionStrings.length ? instructionStrings : [""]);

      return data;
    },
    enabled: !!contentId,
  });

  const updateMutation = useMutation({
    mutationFn: async (selectedStatus: string) => {
      setLoading(true);
      const payload = {
        title: foodName.trim(),
        shortDesc: shortDescription,
        category: selectedClassification,
        status: selectedStatus === "Publish" ? "PUBLISHED" : "DRAFT",
        ingredients: JSON.stringify(recipes.filter((r) => r.trim())),
        instructions: JSON.stringify(instructions.filter((i) => i.trim())),
      };

      return axios.put(`http://localhost:5000/admin/content/${contentId}`, payload, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      openSnackbar("Content updated successfully", "success");
      setTimeout(() => {
        setLoading(false); 
        router.push("/admin/contents");
      }); 
    },
    onError: (error: unknown) => {
      console.error(error);
      setLoading(false);
      if (axios.isAxiosError(error)) {
        openSnackbar(error.response?.data?.message || "Failed to update content", "error");
      } else {
        openSnackbar("An unexpected error occurred", "error");
      }
    },
  });

  const validateForm = () => {
    const errorList: string[] = [];

    if (!foodName.trim()) errorList.push("Food name is required.");
    if (!selectedClassification) errorList.push("Classification is required.");
    if (!shortDescription.trim()) errorList.push("Short description is required.");
    if (recipes.some((i) => !i.trim())) errorList.push("All recipes must be filled.");
    if (instructions.some((i) => !i.trim())) errorList.push("All instructions must be filled.");

    if (errorList.length > 0) {
      openSnackbar(errorList.join(" "), "error");
      return false;
    }
    return true;
  };

  const handleSubmit = (selectedStatus: string) => {
    if (!validateForm()) return;
    setStatus(selectedStatus);
    updateMutation.mutate(selectedStatus);
  };



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
              marginLeft: "8px",
              backgroundColor: status === "Draft" ? "#FFF8E1" : "#E8F5E9", 
              color: status === "Draft" ? "#FBC02D" : "#4CAF50", 
              borderRadius: "12px", 
              padding: "4px 12px", 
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