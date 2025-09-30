
"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, ArrowUpDown, Ticket, Hospital } from "lucide-react";
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

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <Card className="shadow-md rounded-2xl aspect-square overflow-hidden" style={{ backgroundColor: '#d4E0EE', border: 'none' }}>
        <CardContent className="p-2 flex flex-col items-center justify-center h-full text-center">
            <Avatar className="h-12 w-12 md:h-16 md:w-16 rounded-full mb-1 md:mb-2">
                <AvatarImage src={doctor.avatar} alt={doctor.name} className="object-cover" />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-card-foreground leading-tight">{doctor.name}</h3>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-2 bg-black/10 rounded-full px-2 py-0.5">
              <Ticket className="w-3 h-3 text-foreground/80" />
              <span className="text-xs font-bold text-foreground/80">{doctor.currentToken}</span>
            </div>
        </CardContent>
    </Card>
);

const ClinicCard = ({ clinicName, doctors }: { clinicName: string, doctors: Doctor[] }) => (
  <Card className="w-full">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Hospital className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">{clinicName}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
      </div>
    </CardContent>
  </Card>
);


export default function DoctorsList({ specialty, clinic }: { specialty?: string | null, clinic?: string | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors
      .filter((doctor) => {
        if (specialty && doctor.specialty.toLowerCase() !== specialty.toLowerCase()) {
          return false;
        }

        if (clinic && doctor.clinic.toLowerCase() !== clinic.toLowerCase()) {
          return false;
        }

        const term = searchTerm.toLowerCase();
        if (!term) return true;

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
  }, [searchTerm, sortOrder, specialty, clinic]);

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
                    <ArrowUpDown className="h-5 w-5" />
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
            <ClinicCard key={clinicName} clinicName={clinicName} doctors={doctorsByClinic[clinicName]} />
          ))
        ) : (
          <p className="col-span-full mt-4 text-center text-muted-foreground">
            No doctors found.
          </p>
        )}
      </div>
    </div>
  );
}
