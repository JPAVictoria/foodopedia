"use client";
import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "@/components/ui/navbar/navbar";
import RecipeList from "@/components/ui/createContent/recipeList";
import ContentHeader from "@/components/ui/createContent/contentHeader";
import FoodDetails from "@/components/ui/createContent/foodDetails";
import ImageUploader from "@/components/ui/createContent/imageUploader";

export default function CreateContent() {
  const { isNavbarVisible } = useNavbar();

  return (
    <div className="flex min-h-screen text-[#3E2723]">
      <Navbar />

      <div
        className={`transition-all duration-300 p-15 flex-1 ${
          isNavbarVisible ? "ml-0" : "-ml-40"
        }`}
      >
        <div className="pb-8">
        <ContentHeader />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FoodDetails />
          <div className="space-y-6">
            <RecipeList />
            <ImageUploader />
          </div>
        </div>
      </div>
    </div>
  );
}
