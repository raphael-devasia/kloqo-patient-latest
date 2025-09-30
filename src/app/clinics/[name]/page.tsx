
"use client";

import { doctors } from "@/lib/data";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

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
    <div className="space-y-4">
      <div className="flex items-center relative justify-center">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-center px-8">{clinicName}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {clinicDoctors.length > 0 ? (
          clinicDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
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
