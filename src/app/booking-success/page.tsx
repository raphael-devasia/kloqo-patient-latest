
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

function BookingSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-background">
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Successful!</h1>
            <p className="text-muted-foreground mb-6">Your appointment has been confirmed.</p>

            {token && (
                <div className="bg-accent p-4 rounded-lg">
                    <p className="text-sm text-accent-foreground">Your Token Number is</p>
                    <p className="text-4xl font-bold text-primary">{String(token).padStart(3, '0')}</p>
                </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-8">
                You will be redirected to the homepage shortly.
            </p>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingSuccessContent />
        </Suspense>
    )
}
