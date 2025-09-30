
"use client";

import DoctorsList from "@/components/doctors-list";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialty = searchParams.get('specialty');

  return (
    <div className="space-y-4">
      <div className="flex items-center relative justify-center">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{specialty || 'Doctors'}</h1>
      </div>
      <DoctorsList specialty={specialty} />
    </div>
  );
}
