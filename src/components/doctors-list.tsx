
"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, ArrowUpDown, Ticket, Hospital, ChevronRight, MapPin, Loader2, Heart, Phone } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    <Card className="w-full bg-white rounded-2xl shadow-sm flex items-center px-4 py-3 mb-3 border-0">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
          <AvatarImage src={doctor.avatar} alt={doctor.name} />
          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <Link href={`/schedule?doctorId=${doctor.id}&specialty=${encodeURIComponent(doctor.specialty)}`}>
              <span className="block font-semibold text-base text-gray-900">{doctor.name}</span>
            </Link>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-800">{doctor.rating?.toFixed(1) || '4.9'}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-sm text-gray-500">{doctor.specialty}</span>
          </div>
        </div>
      </div>
      <Link href={`/schedule?doctorId=${doctor.id}&specialty=${encodeURIComponent(doctor.specialty)}`}>
        <button className="ml-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow active:scale-95 transition-all">Book Now</button>
      </Link>
    </Card>
  );
  

const ClinicCard = ({ clinic, userLocation }: { clinic: { name: string; city: string; phone: string; location: { latitude: number; longitude: number; } }, userLocation: { latitude: number; longitude: number; } | null }) => {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation && clinic.location) {
      const dist = getDistance(userLocation.latitude, userLocation.longitude, clinic.location.latitude, clinic.location.longitude);
      setDistance(Math.round(dist).toString() + " km");
    }
  }, [userLocation, clinic.location]);

  return (
    <Link href={`/clinics/${encodeURIComponent(clinic.name)}`}>
      <Card className="w-full relative">
        <CardContent className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Hospital className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{clinic.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{clinic.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="w-4 h-4" />
                <span>{clinic.phone}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
        </CardContent>
        {distance && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{distance}</span>
          </div>
        )}
        {!distance && (
            <div className="absolute bottom-2 right-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
        )}
      </Card>
    </Link>
  );
};


export default function DoctorsList({ specialty, initialSearchTerm }: { specialty?: string | null, initialSearchTerm?: string | null }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
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
    const clinicMap = new Map<string, { name: string; city: string; phone: string; location: { latitude: number; longitude: number } }>();
    const term = searchTerm.toLowerCase();

    // Determine the pool of doctors to consider for clinic listing
    let doctorsToConsiderForClinics = doctors;
    if (specialty) {
        // If a specialty is selected, clinics should only be those that have doctors of that specialty.
        doctorsToConsiderForClinics = doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
    }

    doctorsToConsiderForClinics.forEach(doctor => {
        // Add clinic if it hasn't been added and it matches the search term (if any)
        if (!clinicMap.has(doctor.clinic)) {
            if (!searchTerm || doctor.clinic.toLowerCase().includes(term)) {
                clinicMap.set(doctor.clinic, { name: doctor.clinic, location: doctor.location, city: doctor.clinicCity || 'Unknown City', phone: doctor.clinicPhone || 'N/A' });
            }
        }
    });

    return Array.from(clinicMap.values());
}, [searchTerm, specialty]);

  const showClinics = !specialty || (specialty && clinics.length > 0 && searchTerm);


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

      <Tabs defaultValue="clinics" className="w-full mt-4">
        <TabsList className="w-full">
          <TabsTrigger value="clinics" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">Clinics</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">Doctors</TabsTrigger>
        </TabsList>
        <TabsContent value="clinics">
          {showClinics && clinics.length > 0 ? (
            <div className="space-y-4">
              {clinics.map((clinic) => (
                <ClinicCard key={clinic.name} clinic={clinic} userLocation={userLocation} />
              ))}
            </div>
          ) : (
            <p className="col-span-full mt-4 text-center text-muted-foreground">No clinics found.</p>
          )}
        </TabsContent>
        <TabsContent value="doctors">
          {filteredAndSortedDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <p className="col-span-full mt-4 text-center text-muted-foreground">No doctors found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    