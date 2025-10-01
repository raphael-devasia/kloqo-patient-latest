

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, Calendar, Clock, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doctors, user, appointments as appointmentsData, savedPatients } from '@/lib/data';
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
import Image from 'next/image';

const patientDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.string().min(1, "Age is required."),
  sex: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  location: z.string().min(3, "Location is required."),
  phone: z.string().min(10, "Phone number seems too short.").max(10, "Phone number cannot be more than 10 digits."),
});

type PatientDetailsFormValues = z.infer<typeof patientDetailsSchema>;

export default function BookingOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [bookingFor, setBookingFor] = useState<'self' | 'other' | string>('self');

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
    } else if (bookingFor === 'other') {
      form.reset({
        name: '',
        age: '',
        sex: undefined,
        location: '',
        phone: '',
      });
    } else {
        const patient = savedPatients.find(p => p.name === bookingFor);
        if (patient) {
            const patientAge = patient.dob ? String(new Date().getFullYear() - new Date(patient.dob).getFullYear()) : '';
            form.reset({
                name: patient.name,
                age: patientAge,
                sex: 'female', // This should be part of patient data
                location: patient.address,
                phone: patient.phone,
            });
        }
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
      specialty: doctor.specialty,
      fee: doctor.fee,
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
      <div className="flex items-center relative justify-center mt-6">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Booking</h1>
      </div>

       <Card className="mt-8">
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
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
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
      
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-semibold text-center">Who is this appointment for?</h2>
        <div className="flex justify-center items-start gap-4">
          <div 
            onClick={() => setBookingFor('self')}
            className={cn(
              "flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg",
              bookingFor === 'self' && 'bg-primary/10'
            )}
          >
            <Avatar className={cn(
              "h-16 w-16 border-2",
              bookingFor === 'self' ? 'border-primary' : 'border-transparent'
            )}>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user.name.split(' ')[0]} (You)</span>
          </div>

            {savedPatients.map(patient => (
                <div 
                    key={patient.name}
                    onClick={() => setBookingFor(patient.name)}
                    className={cn(
                    "flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg",
                    bookingFor === patient.name && 'bg-primary/10'
                    )}
                >
                    <Avatar className={cn(
                    "h-16 w-16 border-2",
                    bookingFor === patient.name ? 'border-primary' : 'border-transparent'
                    )}>
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{patient.name.split(' ')[0]}</span>
                </div>
            ))}

          <div 
            onClick={() => setBookingFor('other')}
            className={cn(
              "flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg",
              bookingFor === 'other' && 'bg-primary/10'
            )}
          >
            <div className={cn(
                "h-16 w-16 rounded-full border-2 flex items-center justify-center bg-muted/50",
                 bookingFor === 'other' ? 'border-primary' : 'border-dashed'
            )}>
                <PlusCircle className={cn("w-8 h-8", bookingFor === 'other' ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <span className="text-sm font-medium">Add Patient</span>
          </div>
        </div>
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
          <div className="grid grid-cols-3 gap-4">
             <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="col-span-1">
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
                <FormItem className="space-y-3 col-span-2">
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
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="other" id="other" />
                        </FormControl>
                        <Label htmlFor="other">Other</Label>
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
                  <Input placeholder="Calicut" {...field} />
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

    

    
