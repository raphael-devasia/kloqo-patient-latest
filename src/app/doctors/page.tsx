
"use client";

import DoctorsList from "@/components/doctors-list";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialty = searchParams.get('specialty');

  const pageTitle = specialty ? specialty : "Clinic / Doctors";

  return (
    <div className="space-y-4">
      <div className="flex items-center relative justify-center mt-4">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <DoctorsList specialty={specialty} />
    </div>
  );
}
