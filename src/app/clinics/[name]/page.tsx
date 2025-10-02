

"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <Card className="shadow-md rounded-2xl w-36 h-36 overflow-hidden" style={{ backgroundColor: '#E1E8F0', border: 'none' }}>
        <CardContent className="p-2 flex flex-col items-center justify-center h-full text-center">
            <Avatar className="h-14 w-14 rounded-full mb-2">
                <AvatarImage src={doctor.avatar} alt={doctor.name} className="object-cover" />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-card-foreground leading-tight">{doctor.name}</h3>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
        </CardContent>
    </Card>
);

export default function ClinicDetailsPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const { name } = use(params);
  const clinicName = decodeURIComponent(name);

  const clinicDoctors = useMemo(() => {
    return doctors.filter(doctor => doctor.clinic === clinicName);
  }, [clinicName]);

  return (
    <div className="space-y-6 pb-8 -mx-6">
      <div className="relative">
        <div className="absolute left-4 top-4 z-30">
          <button onClick={() => router.back()} className="bg-white/70 rounded-full p-2 shadow">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
        </div>
        
        {/* Profile content below logo */}
        <div className="flex flex-col items-center bg-[#7A997D] rounded-b-2xl shadow-lg px-4 pt-6 pb-6 w-full relative">
          <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
            <h1 className="text-xl font-bold text-center break-words text-white">{clinicName}</h1>
          </div>
          <div className="text-base mb-2 text-center text-white/90">Multi Super Specialty Hospital</div>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-2 justify-center text-white/90">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Melattur
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              9447273941
            </span>
          </div>
          <div className="text-center text-sm mb-2 max-w-xs text-white/90">
            The clinic provides comprehensive eye care services for patients of all ages, focusing on the diagnosis, treatment, and management of various eye conditions.
            <span className="font-semibold cursor-pointer ml-1">read more</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-4">Available Doctors</h2>
        <div className="flex flex-wrap gap-4">
          {clinicDoctors.length > 0 ? (
            clinicDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/schedule?doctorId=${doctor.id}&specialty=${encodeURIComponent(doctor.specialty)}`} className="block transition-transform hover:scale-105">
                <DoctorCard doctor={doctor} />
              </Link>
            ))
          ) : (
            <p className="col-span-full mt-4 text-center text-muted-foreground">
              No doctors found for this clinic.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
