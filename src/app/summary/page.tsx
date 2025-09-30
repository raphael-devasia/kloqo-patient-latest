
'use client';

import { Suspense } from 'react';
import BookingSummary from '@/components/booking-summary';

function SummaryPageContent() {
    return (
        <div className="space-y-6">
            <BookingSummary />
        </div>
    );
}

export default function SummaryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SummaryPageContent />
        </Suspense>
    )
}
