
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Brain, Eye, Stethoscope } from "lucide-react";
import { ToothIcon, FaceIcon } from "./category-icons";
import { useMemo } from "react";

const categories = [
    { label: "Dentistry", icon: <ToothIcon className="w-8 h-8 text-primary" /> },
    { label: "Cardiology", icon: <HeartPulse className="w-8 h-8 text-primary" /> },
    { label: "Dermatology", icon: <FaceIcon className="w-8 h-8 text-primary" /> },
    { label: "Neurology", icon: <Brain className="w-8 h-8 text-primary" /> },
    { label: "Ophthalmology", icon: <Eye className="w-8 h-8 text-primary" /> },
    { label: "General", icon: <Stethoscope className="w-8 h-8 text-primary" /> },
    { label: "Pediatrics", icon: <Stethoscope className="w-8 h-8 text-primary" /> },
    { label: "Orthopedics", icon: <Stethoscope className="w-8 h-8 text-primary" /> },
];

const CategoryCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Card className="shadow-md rounded-2xl aspect-square overflow-hidden bg-accent">
        <CardContent className="p-2 flex flex-col items-center justify-center h-full text-center">
            {icon}
            <h3 className="font-semibold text-xs text-card-foreground leading-tight mt-2">{label}</h3>
        </CardContent>
    </Card>
);

export default function CategoriesList({ searchTerm = "" }: { searchTerm?: string }) {
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <CategoryCard key={category.label} icon={category.icon} label={category.label} />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground">
          No categories found.
        </p>
      )}
    </div>
  );
}
