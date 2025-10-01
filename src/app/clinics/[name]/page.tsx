
"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

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
        </CardContent>
    </Card>
);

export default function ClinicDetailsPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const clinicName = decodeURIComponent(params.name);

  const clinicDoctors = useMemo(() => {
    return doctors.filter(doctor => doctor.clinic === clinicName);
  }, [clinicName]);

  return (
    <div className="space-y-6 px-4 pb-8">
      <div className="relative">
        <div className="absolute left-0 top-4 z-10">
          <button onClick={() => router.back()} className="bg-white/70 rounded-full p-2 shadow">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
        </div>
        
        {/* Profile content below logo */}
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg px-4 pt-6 pb-6 mt-16 mx-auto max-w-screen-sm w-full relative z-20">
          <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
            <h1 className="text-xl font-bold text-center text-gray-900 break-words">{clinicName}</h1>
            <span className="ml-1 text-primary">✔️</span>
          </div>
          <div className="text-gray-500 text-base mb-2 text-center">Multi Super Specialty Hospital</div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary mb-2 justify-center">
            <span className="flex items-center gap-1"><svg width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="8"/></svg> Melattur</span>
            <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor"><path d="M2 8h12"/></svg> 9447273941</span>
          </div>
          <div className="text-gray-500 text-center text-sm mb-2 max-w-xs">
            The clinic provides comprehensive eye care services for patients of all ages, focusing on the diagnosis, treatment, and management of various eye conditions.
            <span className="text-primary cursor-pointer ml-1">read more</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-4">Available Doctors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
}
