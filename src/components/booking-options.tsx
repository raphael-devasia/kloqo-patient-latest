
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doctors, user, appointments as appointmentsData } from '@/lib/data';
import { Appointment } from '@/lib/types';
import { format } from 'date-fns';

export default function BookingOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const doctor = doctors.find(d => d.id === doctorId);

  const handleBooking = (forSelf: boolean) => {
    if (!doctor || !date || !time) {
      toast({
        title: 'Booking Error',
        description: 'Missing appointment details. Please try again.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    // Here you would typically save the new appointment to your database.
    // For this demo, we'll just show a toast.
    const newAppointment: Omit<Appointment, 'id'> = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      doctorClinic: doctor.clinic,
      date,
      time,
      type: 'Consultation',
      status: 'Upcoming',
    };
    console.log('New Appointment:', newAppointment);
    
    const patientName = forSelf ? user.name : 'someone else';

    toast({
      title: 'Appointment Booked!',
      description: `Your appointment for ${patientName} with ${doctor.name} on ${format(new Date(date), 'PPP')} at ${time} is confirmed.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
    });

    router.push('/appointments');
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center relative justify-center">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Book For</h1>
      </div>

      <div className="space-y-4">
        <Card
          onClick={() => handleBooking(true)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">For Myself</h2>
              <p className="text-sm text-muted-foreground">Book an appointment for {user.name}.</p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleBooking(false)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">For Someone Else</h2>
              <p className="text-sm text-muted-foreground">Book for a family member or a friend.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 text-center">
        <p className="text-sm text-muted-foreground">
            You will be able to add patient details after confirming.
        </p>
      </div>
    </div>
  );
}
