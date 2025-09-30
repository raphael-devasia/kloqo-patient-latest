
"use client";

import CategoriesList from "@/components/categories-list";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center relative justify-center">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Categories</h1>
      </div>
      <CategoriesList />
    </div>
  );
}
