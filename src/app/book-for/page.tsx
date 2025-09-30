
'use client';

import { Suspense } from 'react';
import BookingOptions from '@/components/booking-options';

function BookingForPageContent() {
    return (
        <div className="space-y-6">
            <BookingOptions />
        </div>
    );
}

export default function BookingForPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingForPageContent />
        </Suspense>
    )
}
