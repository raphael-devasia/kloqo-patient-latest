

"use client";

import { user, doctors, appointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, HeartPulse, Clock, Brain, Calendar, ChevronRight, MapPin, ChevronDown, Eye, Activity, Stethoscope } from "lucide-react";
import Image from "next/image";
import { format, isPast } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const CategoryCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 text-center">
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const DoctorCard = ({ doctor }: { doctor: { id: string, name: string, specialty: string, avatar: string } }) => (
  <Card className="p-4">
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16 border">
        <AvatarImage src={doctor.avatar} alt={doctor.name} />
        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-bold text-base">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
      </div>
      <Button variant="ghost" size="icon">
        <HeartPulse className="w-5 h-5 text-muted-foreground" />
      </Button>
    </div>
  </Card>
)

const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.34 1.13a1.5 1.5 0 0 0-2.68 0L3.5 6.26a1.5 1.5 0 0 0 0 1.48l1.37 2.62a1.5 1.5 0 0 0 1.34.74h5.58a1.5 1.5 0 0 0 1.34-.74l1.37-2.62a1.5 1.5 0 0 0 0-1.48Z" />
      <path d="M9.5 11v8.5a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5V11" />
    </svg>
  );

export default function Dashboard() {
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const { city, country } = data.address;
            setLocation({ city, country });
          } catch (error) {
            console.error("Error fetching location:", error);
            // Fallback or error handling
            setLocation({ city: 'New York', country: 'USA' });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
           // Fallback or error handling
          setLocation({ city: 'New York', country: 'USA' });
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
       // Fallback or error handling
      setLocation({ city: 'New York', country: 'USA' });
    }
  }, []);
  
  const upcomingAppointments = appointments
    .filter((appt) => appt.status === "Upcoming" && !isPast(new Date(appt.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextAppointment = upcomingAppointments[0];
  const nextDoctor = nextAppointment ? doctors.find(d => d.id === nextAppointment.doctorId) : null;
  const popularHealers = doctors.slice(0, 2);

  const categories = [
    { label: "Dentistry", icon: <ToothIcon className="w-6 h-6 text-primary" /> },
    { label: "Cardiology", icon: <HeartPulse className="w-6 h-6 text-primary" /> },
    { label: "Dermatology", icon: <Activity className="w-6 h-6 text-primary" /> },
    { label: "Neurology", icon: <Brain className="w-6 h-6 text-primary" /> },
    { label: "Ophthalmology", icon: <Eye className="w-6 h-6 text-primary" /> },
    { label: "General", icon: <Stethoscope className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div className="relative min-h-full">
      <div className="bg-primary p-6 pb-24 rounded-b-[3rem]">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary-foreground fill-primary-foreground/20" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto text-primary-foreground">
                  <h1 className="text-base font-bold">
                    {location ? `${location.city}, ${location.country}` : 'Loading...'}
                  </h1>
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setLocation({ city: 'London', country: 'UK' })}>London, UK</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation({ city: 'Tokyo', country: 'Japan' })}>Tokyo, Japan</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation({ city: 'Sydney', country: 'Australia' })}>Sydney, Australia</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full relative text-primary-foreground">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
          </Button>
        </header>

        <div className="relative">
          <Input
            placeholder="Search Doctors..."
            className="h-14 rounded-full border-0 bg-primary-foreground/20 pl-12 text-base text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/80"/>
        </div>
      </div>
      
      <div className="px-6 -mt-16 space-y-4">
        {nextAppointment && nextDoctor && (
          <div className="space-y-4">
            <Card className="bg-[#F7F4ED] text-foreground rounded-2xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Upcoming appointments</h2>
                    <Link href="/appointments">
                        <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white">
                    <AvatarImage src={nextDoctor.avatar} alt={nextDoctor.name} />
                    <AvatarFallback>{nextDoctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-base">{nextDoctor.name}</h3>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{nextDoctor.specialty}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm bg-accent/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary"/>
                    <span>{format(new Date(nextAppointment.date), "dd MMM, EEEE")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary"/>
                    <span>{nextAppointment.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="pb-6 pt-2">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-4">Categories</h2>
            <Carousel opts={{
              align: "start",
              dragFree: true,
            }} className="w-full">
              <CarouselContent className="px-4 -ml-2">
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="pl-2 basis-1/4">
                    <CategoryCard icon={category.icon} label={category.label} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          <section className="space-y-4 pt-6 px-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Popular healers</h2>
              <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
            </div>
            <div className="space-y-3">
              {popularHealers.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

    

    

    

