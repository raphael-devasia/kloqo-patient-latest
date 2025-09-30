

"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, ArrowUpDown, Ticket, Hospital, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
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

// Haversine formula to calculate distance between two lat/lon points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0.1;
  }
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d < 0.1 ? 0.1 : d;
};

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <Card className="w-full">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold text-base">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground/80">{doctor.clinic}</p>
            </div>
          </div>
           <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </CardContent>
    </Card>
);


const ClinicCard = ({ clinic, userLocation }: { clinic: { name: string; location: { latitude: number; longitude: number; } }, userLocation: { latitude: number; longitude: number; } | null }) => {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation && clinic.location) {
      const dist = getDistance(userLocation.latitude, userLocation.longitude, clinic.location.latitude, clinic.location.longitude);
      setDistance(dist.toFixed(1) + " km");
    }
  }, [userLocation, clinic.location]);
  
  return (
    <Link href={`/clinics/${encodeURIComponent(clinic.name)}`}>
      <Card className="w-full">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Hospital className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{clinic.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {distance ? (
                <>
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">{distance}</span>
                </>
            ) : (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
};


export default function DoctorsList({ specialty }: { specialty?: string | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Fallback location (e.g., city center)
          setUserLocation({ latitude: 40.7128, longitude: -74.0060 });
        }
      );
    } else {
        // Fallback for browsers that don't support geolocation
        setUserLocation({ latitude: 40.7128, longitude: -74.0060 });
    }
  }, []);

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors;

    if (specialty) {
        filtered = doctors.filter(doctor => doctor.specialty.toLowerCase() === specialty.toLowerCase());
    }

    if (searchTerm) {
        filtered = filtered.filter((doctor) => {
            const term = searchTerm.toLowerCase();
            return (
              doctor.name.toLowerCase().includes(term) ||
              doctor.specialty.toLowerCase().includes(term) ||
              doctor.clinic.toLowerCase().includes(term)
            );
        });
    }

    switch (sortOrder) {
      case "z-a":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case "top-rated":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "a-z":
      default:
        return filtered.sort((a, b) => a.name.localeCompare(a.name));
    }
  }, [searchTerm, sortOrder, specialty]);
  
  const clinics = useMemo(() => {
      const clinicMap = new Map<string, { name: string; location: { latitude: number; longitude: number; } }>();
      const term = searchTerm.toLowerCase();
      
      let doctorsToConsider = specialty ? 
        doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase()) : 
        doctors;

      if (searchTerm) {
        doctorsToConsider = doctorsToConsider.filter(doctor => 
          doctor.clinic.toLowerCase().includes(term) || 
          doctor.name.toLowerCase().includes(term) ||
          doctor.specialty.toLowerCase().includes(term)
        );
      }

      doctorsToConsider.forEach(doctor => {
          if (!clinicMap.has(doctor.clinic) && (doctor.clinic.toLowerCase().includes(term) || !searchTerm)) {
              clinicMap.set(doctor.clinic, { name: doctor.clinic, location: doctor.location });
          }
      });
      return Array.from(clinicMap.values());
  }, [searchTerm, specialty]);

  const showClinics = !specialty;

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
        {showClinics && clinics.length > 0 && (
            <div className="space-y-2">
                <h2 className="text-lg font-bold">Clinics</h2>
                <div className="space-y-4">
                    {clinics.map((clinic) => (
                        <ClinicCard key={clinic.name} clinic={clinic} userLocation={userLocation} />
                    ))}
                </div>
            </div>
        )}

        {filteredAndSortedDoctors.length > 0 && (
            <div className="space-y-2">
                 <h2 className="text-lg font-bold">Doctors</h2>
                 <div className="space-y-4">
                    {filteredAndSortedDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            </div>
        )}

        {clinics.length === 0 && filteredAndSortedDoctors.length === 0 && (
          <p className="col-span-full mt-4 text-center text-muted-foreground">
            No doctors or clinics found.
          </p>
        )}
      </div>
    </div>
  );
}
