
"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, ArrowUpDown, Ticket, Hospital, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";


const ClinicCard = ({ clinicName }: { clinicName: string }) => (
  <Link href={`/clinics/${encodeURIComponent(clinicName)}`}>
    <Card className="w-full">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Hospital className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold">{clinicName}</h2>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </CardContent>
    </Card>
  </Link>
);


export default function DoctorsList({ specialty }: { specialty?: string | null }) {
  const [searchTerm, setSearchTerm] = useState(specialty || "");
  const [sortOrder, setSortOrder] = useState("a-z");

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors
      .filter((doctor) => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;

        if (specialty) {
          return doctor.specialty.toLowerCase() === specialty.toLowerCase() && 
                 (doctor.name.toLowerCase().includes(term) || doctor.clinic.toLowerCase().includes(term));
        }

        return (
          doctor.name.toLowerCase().includes(term) ||
          doctor.specialty.toLowerCase().includes(term) ||
          doctor.clinic.toLowerCase().includes(term)
        );
      });

    switch (sortOrder) {
      case "z-a":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case "top-rated":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "a-z":
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [searchTerm, sortOrder, specialty]);

  const doctorsByClinic = useMemo(() => {
    return filteredAndSortedDoctors.reduce((acc, doctor) => {
      if (!acc[doctor.clinic]) {
        acc[doctor.clinic] = [];
      }
      acc[doctor.clinic].push(doctor);
      return acc;
    }, {} as Record<string, Doctor[]>);
  }, [filteredAndSortedDoctors]);

  const clinicNames = Object.keys(doctorsByClinic);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search doctor, specialty, or clinic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 rounded-xl pl-4 pr-12 text-base bg-white text-foreground placeholder:text-muted-foreground border-border"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg h-8 w-8 flex items-center justify-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0 rounded-xl">
                    <ArrowUpDown className="h-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                    <DropdownMenuRadioItem value="a-z">Alphabetical (A-Z)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="z-a">Alphabetical (Z-A)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="top-rated">Top Rated</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {clinicNames.length > 0 ? (
          clinicNames.map((clinicName) => (
            <ClinicCard key={clinicName} clinicName={clinicName} />
          ))
        ) : (
          <p className="col-span-full mt-4 text-center text-muted-foreground">
            No doctors or clinics found.
          </p>
        )}
      </div>
    </div>
  );
}
