

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doctors, user, appointments as appointmentsData } from '@/lib/data';
import { Appointment } from '@/lib/types';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const patientDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.string().min(1, "Age is required."),
  sex: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  location: z.string().min(3, "Location is required."),
  phone: z.string().min(10, "Phone number seems too short."),
});

type PatientDetailsFormValues = z.infer<typeof patientDetailsSchema>;

export default function BookingOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [bookingFor, setBookingFor] = useState<'self' | 'other'>('self');

  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const doctor = doctors.find(d => d.id === doctorId);

  const form = useForm<PatientDetailsFormValues>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      name: '',
      age: '',
      sex: undefined,
      location: '',
      phone: '',
    }
  });

  useEffect(() => {
    if (bookingFor === 'self') {
      const userAge = user.dob ? String(new Date().getFullYear() - new Date(user.dob).getFullYear()) : '';
      form.reset({
        name: user.name,
        age: userAge,
        sex: 'male', // Assuming a default, this could be part of user profile
        location: user.address,
        phone: user.phone,
      });
    } else {
      form.reset({
        name: '',
        age: '',
        sex: undefined,
        location: '',
        phone: '',
      });
    }
  }, [bookingFor, form, user]);

  const handleBooking = (values: PatientDetailsFormValues) => {
    if (!doctor || !date || !time) {
      toast({
        title: 'Booking Error',
        description: 'Missing appointment details. Please try again.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }
    
    const newAppointment: Omit<Appointment, 'id' | 'status'> = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      doctorClinic: doctor.clinic,
      date,
      time,
      type: 'Consultation',
      patientDetails: values,
    };
    
    // For demo: store in session storage to pass to summary page
    sessionStorage.setItem('newAppointment', JSON.stringify(newAppointment));
    
    router.push('/summary');
  };
  
  if (!doctor || !date || !time) {
    return (
        <div className="flex items-center justify-center h-full p-4 text-center">
            <div>
                <p className="text-muted-foreground">Appointment details are missing.</p>
                <Button onClick={() => router.push('/')} className="mt-4">Go to Home</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center relative justify-center">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Booking</h1>
      </div>

       <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-bold text-base">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.clinic}</p>
                        </div>
                    </div>
                    <div className="text-right text-sm">
                        <div className="flex items-center gap-2 justify-end">
                            <Calendar className="w-4 h-4 text-primary"/>
                            <span className="font-medium whitespace-nowrap">{format(new Date(date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <Clock className="w-4 h-4 text-primary"/>
                            <span className="font-medium">{time}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

      <div className="space-y-4">
        <Card
          onClick={() => setBookingFor('self')}
          className={cn("cursor-pointer transition-colors", bookingFor === 'self' ? 'bg-primary/10 border-primary' : 'hover:bg-accent')}
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
          onClick={() => setBookingFor('other')}
          className={cn("cursor-pointer transition-colors", bookingFor === 'other' ? 'bg-primary/10 border-primary' : 'hover:bg-accent')}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-6 pt-4">
          <h2 className="text-lg font-semibold">Patient Details</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="male" id="male" />
                        </FormControl>
                        <Label htmlFor="male">Male</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="female" id="female" />
                        </FormControl>
                        <Label htmlFor="female">Female</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
             <Button type="submit" className="w-full h-12 rounded-xl text-lg">Confirm Appointment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

    

    
