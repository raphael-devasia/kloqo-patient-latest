
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Brain, Eye, Stethoscope } from "lucide-react";
import { ToothIcon, FaceIcon } from "./category-icons";

const categories = [
    { label: "Dentistry", icon: <ToothIcon className="w-10 h-10 text-primary" /> },
    { label: "Cardiology", icon: <HeartPulse className="w-10 h-10 text-primary" /> },
    { label: "Dermatology", icon: <FaceIcon className="w-10 h-10 text-primary" /> },
    { label: "Neurology", icon: <Brain className="w-10 h-10 text-primary" /> },
    { label: "Ophthalmology", icon: <Eye className="w-10 h-10 text-primary" /> },
    { label: "General", icon: <Stethoscope className="w-10 h-10 text-primary" /> },
    { label: "Pediatrics", icon: <Stethoscope className="w-10 h-10 text-primary" /> },
    { label: "Orthopedics", icon: <Stethoscope className="w-10 h-10 text-primary" /> },
];

const CategoryCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Card className="shadow-md rounded-2xl aspect-square overflow-hidden bg-accent">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
            {icon}
            <h3 className="font-bold text-sm text-card-foreground leading-tight mt-4">{label}</h3>
        </CardContent>
    </Card>
);

export default function CategoriesList() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.label} icon={category.icon} label={category.label} />
      ))}
    </div>
  );
}
