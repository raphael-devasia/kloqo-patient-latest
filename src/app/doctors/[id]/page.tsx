
'use client';

import { Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doctors } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Star, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

function DoctorDetailPageContent() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const doctor = doctors.find(d => d.id === id);

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-muted-foreground mb-4">Doctor not found.</p>
                <Button onClick={() => router.push('/doctors')}>Back to Doctors</Button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="relative">
                <div className="absolute left-4 top-4 z-10">
                    <button onClick={() => router.back()} className="bg-white/80 rounded-full p-2 shadow-md">
                        <ChevronLeft className="w-6 h-6 text-primary" />
                    </button>
                </div>

                <div className="h-48 bg-gradient-to-b from-primary/20 to-transparent"></div>

                <div className="px-6 -mt-24">
                    <div className="flex justify-center">
                        <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="text-center mt-4">
                        <h1 className="text-2xl font-bold">{doctor.name}</h1>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{doctor.rating}</span>
                        </div>
                        <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8 space-y-6">
                <Card>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Clinic</p>
                                <p className="font-semibold">{doctor.clinic}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Experience</p>
                                <p className="font-semibold">15+ years</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-muted-foreground text-sm">{doctor.bio}</p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t w-[414px] mx-auto rounded-b-[44px]">
                     <Link href={`/schedule?doctorId=${doctor.id}&specialty=${encodeURIComponent(doctor.specialty)}`} passHref>
                        <Button className="w-full h-12 text-lg">Book Appointment</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default function DoctorDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DoctorDetailPageContent />
        </Suspense>
    )
}
