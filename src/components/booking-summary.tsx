
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Phone, MapPin, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Appointment } from '@/lib/types';
import { appointments as appointmentsData } from '@/lib/data';

type AppointmentWithPatient = Omit<Appointment, 'id' | 'status'>;

export default function BookingSummary() {
  const router = useRouter();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<AppointmentWithPatient | null>(null);

  useEffect(() => {
    const appointmentData = sessionStorage.getItem('newAppointment');
    if (appointmentData) {
      setAppointment(JSON.parse(appointmentData));
    } else {
      // Handle case where there's no appointment data, maybe redirect
      router.push('/');
    }
  }, [router]);

  const handleConfirm = () => {
    if (appointment) {
        const finalAppointment = {
            ...appointment,
            id: `appt${appointmentsData.length + 1}`,
            status: 'Upcoming'
        } as Appointment;
        
        // In a real app, you would save this to your database.
        // Here we just add it to the local data for demo purposes.
        appointmentsData.push(finalAppointment);
        
        toast({
            title: "Appointment Booked!",
            description: `Your appointment with ${appointment.doctorName} is confirmed.`,
            variant: "default",
            className: "bg-accent text-accent-foreground",
        });
        
        sessionStorage.removeItem('newAppointment');
        router.push('/appointments');
    }
  };

  if (!appointment) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading appointment details...</p>
        </div>
    )
  }

  const { doctorName, doctorAvatar, doctorClinic, date, time, patientDetails } = appointment;

  return (
    <div className="space-y-6 p-4">
        <div className="flex items-center relative justify-center">
            <button onClick={() => router.back()} className="absolute left-0">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Booking Summary</h1>
        </div>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage src={doctorAvatar} alt={doctorName} />
                        <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{doctorName}</CardTitle>
                        <CardDescription>{doctorClinic}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary"/>
                        <span className="font-semibold">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary"/>
                        <span className="font-semibold">{time}</span>
                    </div>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{patientDetails?.name}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-muted-foreground">Age/Sex:</span>
                    <span className="font-medium">{patientDetails?.age} / {patientDetails?.sex}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{patientDetails?.phone}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{patientDetails?.location}</span>
                </div>
            </CardContent>
        </Card>
        
        <div className="pt-4">
            <Button onClick={handleConfirm} className="w-full h-12 rounded-xl text-lg">
                Confirm & Book Now
            </Button>
        </div>
    </div>
  );
}
