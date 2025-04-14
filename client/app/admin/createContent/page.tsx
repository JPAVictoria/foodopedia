"use client";
import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "@/app/components/ui/navbar/navbar";
import { FolderOpenDot, BookPlus, Trash2, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import axios from "axios";

export default function CreateContent() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const [recipes, setRecipes] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [foodName, setFoodName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [mediaFiles, setMediaFiles] = useState<(File | null)[]>([null, null, null]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const classifications = ["Dessert", "Appetizer", "Entrée", "Beverages"];

  const handleAddField = () => setRecipes([...recipes, ""]);
  const handleInputChange = (index: number, value: string) => setRecipes(prev => prev.map((item, i) => i === index ? value : item));
  const handleDeleteField = (index: number) => setRecipes(recipes.filter((_, i) => i !== index));

  const handleAddInstructionField = () => setInstructions([...instructions, ""]);
  const handleInputInstructionChange = (index: number, value: string) => setInstructions(prev => prev.map((item, i) => i === index ? value : item));
  const handleDeleteInstructionField = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleClassificationChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedClassification(event.target.value);

  const handleFileChange = (index: number, file: File) => {
    const updated = [...mediaFiles];
    updated[index] = file;
    setMediaFiles(updated);
  };

  const handleDeleteFile = (index: number) => {
    const updated = [...mediaFiles];
    updated[index] = null;
    setMediaFiles(updated);
  };

  const handleUploadClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleSubmit = async (selectedStatus: string) => {
    try {
      const formData = new FormData();
      formData.append("foodName", foodName);
      formData.append("shortDescription", shortDescription);
      formData.append("classification", selectedClassification);
      formData.append("status", selectedStatus);

      recipes.forEach((recipe, i) => formData.append(`recipes[${i}]`, recipe));
      instructions.forEach((inst, i) => formData.append(`instructions[${i}]`, inst));

      // Fix: Removed the unused index 'i' for mediaFiles
      mediaFiles.forEach((file) => {
        if (file) formData.append("media", file);
      });

      await axios.post("http://localhost:5000/admin/content/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      openSnackbar(`Content ${selectedStatus.toLowerCase()}ed successfully`, "success");
    } catch (err) {
      console.log(err);
      openSnackbar("An error occurred", "error");
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
                <p className="text-sm text-muted-foreground">Status: {status}</p>
                <p className="text-sm text-muted-foreground">Viewer Count:</p>
                <p className="text-sm text-muted-foreground">Likes Count:</p>
              </div>
            </div>

            <div className="flex space-x-4">
              {["Draft", "Publish"].map((type, index) => (
                <div key={index} className="rounded-md transition cursor-pointer">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center p-4 min-h-[3rem] hover:bg-[#c5cadc17] cursor-pointer"
                    onClick={() => { setStatus(type); handleSubmit(type); }}
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

            <div className="bg-[#fffaec] p-8 rounded-sm border border-[#2d2d2d4e]">
              <Label className="mb-3 block">Images & Videos:</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {mediaFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-sm p-2 transition cursor-pointer hover:bg-gray-100"
                    onClick={() => handleUploadClick(i)}
                  >
                    <FolderOpenDot className="w-6 h-6 text-gray-500" />
                    {file ? (
                      <span className="text-xs text-gray-700 bg-white mt-2 px-1 rounded-sm text-center">{file.name}</span>
                    ) : (
                      <span className="text-xs text-gray-500 mt-2">Upload</span>
                    )}
                    <input
                      ref={fileInputRefs[i]}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(i, e.target.files[0]);
                        }
                      }}
                    />
                    {file && (
                      <button
                        className="text-xs text-red-500 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(i);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
