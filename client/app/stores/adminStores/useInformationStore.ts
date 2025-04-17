import { create } from 'zustand';

type Classification = "DESSERT" | "APPETIZER" | "ENTREE" | "BEVERAGES";

interface ContentFormState {
  recipes: string[];
  instructions: string[];
  selectedClassification: Classification | "";
  foodName: string;
  shortDescription: string;
  status: string;
  setRecipes: (recipes: string[]) => void;
  setInstructions: (instructions: string[]) => void;
  setSelectedClassification: (classification: Classification) => void;
  setFoodName: (name: string) => void;
  setShortDescription: (desc: string) => void;
  setStatus: (status: string) => void;
}

export const useInformationStore = create<ContentFormState>((set) => ({
  recipes: [""],
  instructions: [""],
  selectedClassification: "",
  foodName: "",
  shortDescription: "",
  status: "Draft",
  setRecipes: (recipes) => set({ recipes }),
  setInstructions: (instructions) => set({ instructions }),
  setSelectedClassification: (selectedClassification) => set({ selectedClassification }),
  setFoodName: (foodName) => set({ foodName }),
  setShortDescription: (shortDescription) => set({ shortDescription }),
  setStatus: (status) => set({ status }),
}));