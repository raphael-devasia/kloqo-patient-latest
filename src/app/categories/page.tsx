
"use client";

import CategoriesList from "@/components/categories-list";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center relative justify-center mt-2">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Categories</h1>
      </div>

      <div className="relative">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 rounded-xl pl-4 pr-12 text-base bg-white text-foreground placeholder:text-muted-foreground border-border"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg h-8 w-8 flex items-center justify-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="pt-4">
        <CategoriesList searchTerm={searchTerm} />
      </div>
    </div>
  );
}
