"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartPulse, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
      <Avatar className="h-16 w-16 border">
        <AvatarImage src={doctor.avatar} alt={doctor.name} />
        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        <p className="text-xs text-muted-foreground/80">{doctor.clinic}</p>
      </div>
       <Button variant="ghost" size="icon">
        <Star className="w-5 h-5 text-muted-foreground" />
      </Button>
    </CardHeader>
    <CardContent className="flex justify-end gap-2">
       <Button className="w-full">Book Now</Button>
    </CardContent>
  </Card>
);

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const specialties = ["all", ...new Set(doctors.map((doc) => doc.specialty))];

  const filteredDoctors = doctors
    .filter((doctor) =>
      selectedSpecialty === "all" ? true : doctor.specialty === selectedSpecialty
    )
    .filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Search by doctor's name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty === "all" ? "All Specialties" : specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
