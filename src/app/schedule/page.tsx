
'use client'

import ScheduleForm from "@/components/schedule-form";
import { Suspense } from "react";

function SchedulePageContent() {
  return (
    <div className="space-y-6">
      <ScheduleForm />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulePageContent />
    </Suspense>
  )
}
