"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <Card className="shadow-md rounded-2xl">
    <CardContent className="p-3">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 rounded-2xl">
          <AvatarImage src={doctor.avatar} alt={doctor.name} className="object-cover" />
          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-base">{doctor.name}</h3>
          <div className="flex items-center gap-1 text-sm text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">4.9</span>
            <span className="text-muted-foreground">(37 Reviews)</span>
          </div>
          <p className="text-sm text-muted-foreground">{doctor.specialty} - {doctor.clinic}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors
    .filter((doctor) => {
      const term = searchTerm.toLowerCase();
      return (
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.clinic.toLowerCase().includes(term)
      );
    });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Search doctor, specialty, or clinic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 rounded-xl pl-4 pr-12 text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/20 text-primary rounded-lg h-8 w-8 flex items-center justify-center">
            <Search className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
        ) : (
          <p className="col-span-full mt-4 text-center text-muted-foreground">
            No doctors found.
          </p>
        )}
      </div>
    </div>
  );
}
