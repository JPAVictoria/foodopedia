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
import { Chip } from "@mui/material";

export default function CreateContent() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isNavbarVisible } = useNavbar();

  const [recipes, setRecipes] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [selectedClassification, setSelectedClassification] =
    useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("Draft");
  const [mediaFiles, setMediaFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const classifications = ["DESSERT", "APPETIZER", "ENTREE", "BEVERAGES"];

  const handleAddField = () => setRecipes([...recipes, ""]);
  const handleInputChange = (index: number, value: string) =>
    setRecipes((prev) => prev.map((item, i) => (i === index ? value : item)));
  const handleDeleteField = (index: number) =>
    setRecipes((prev) => prev.filter((_, i) => i !== index));

  const handleAddInstructionField = () =>
    setInstructions([...instructions, ""]);
  const handleInputInstructionChange = (index: number, value: string) =>
    setInstructions((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  const handleDeleteInstructionField = (index: number) =>
    setInstructions((prev) => prev.filter((_, i) => i !== index));

  const handleClassificationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedClassification(e.target.value);

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

  const validateForm = () => {
    const errorList: string[] = [];

    if (!foodName.trim()) errorList.push("Food name is required.");
    if (!selectedClassification) errorList.push("Classification is required.");
    if (!shortDescription.trim())
      errorList.push("Short description is required.");
    if (recipes.some((r) => !r.trim()))
      errorList.push("All recipe fields must be filled.");
    if (instructions.some((i) => !i.trim()))
      errorList.push("All instruction fields must be filled.");

    if (errorList.length > 0) {
      openSnackbar(errorList.join(" "), "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (selectedStatus: string) => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", foodName.trim()); // Add trim() to remove whitespace
      formData.append("shortDesc", shortDescription);
      formData.append("category", selectedClassification);
      formData.append(
        "status",
        selectedStatus === "Publish" ? "PUBLISHED" : "DRAFT"
      );
      formData.append("ingredients", JSON.stringify(recipes));
      formData.append("instructions", JSON.stringify(instructions));

      mediaFiles.forEach((file) => {
        if (file) formData.append("media", file);
      });

      await axios.post("http://localhost:5000/admin/content/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      openSnackbar(
        `Content ${selectedStatus.toLowerCase()}ed successfully!`,
        "success"
      );
      setTimeout(() => router.push("/admin/contents"), 2000);
    } catch (error) {
      console.error("Submission error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          openSnackbar(
            `"${foodName}" already exists. Please choose a different name.`,
            "error"
          );
        } else {
          openSnackbar(
            error.response?.data?.message || "Failed to create content",
            "error"
          );
        }
      } else {
        openSnackbar("An unexpected error occurred", "error");
      }
    }
  };

  // In your useEffect, no changes are needed as it's just handling authentication
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      openSnackbar("Token is missing", "error");
      const timer = setTimeout(() => router.push("/admin/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [router, openSnackbar]);

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
      <div
        className={`transition-all duration-300 p-15 flex-1 ${
          isNavbarVisible ? "ml-0" : "-ml-60"
        }`}
      >
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
                      backgroundColor:
                        status === "Draft" ? "#FFF8E1" : "#E8F5E9", // Custom color for Draft/Publish
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
              <Label htmlFor="food-name" className="mb-2 block">
                Food Name
              </Label>
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
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
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
                      onChange={(e) =>
                        handleInputInstructionChange(index, e.target.value)
                      }
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
              <Label className="mb-3 block">Upload Media</Label>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="space-y-">
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-sm p-8 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleUploadClick(index)}
                    >
                      <FolderOpenDot className="w-6 h-6 text-gray-500" />
                      <input
                        ref={fileInputRefs[index]}
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          handleFileChange(index, e.target.files[0])
                        }
                        hidden
                      />
                    </div>
                    {file && (
                      <div className="mt-5 flex flex-col gap-y-3 justify-center items-center">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(index)}
                          className="text-[#3E2723] hover:text-[#3e2723a0] ml-2 cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
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
