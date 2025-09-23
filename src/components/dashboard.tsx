
"use client";

import { user, doctors, appointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, HeartPulse, Brain, Eye, Stethoscope, Star, MoreHorizontal, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import { format, isPast } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";


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
        <path d="M11 2c-2.5 1.5-2.5 4.5 0 6" />
        <path d="M13 2c2.5 1.5 2.5 4.5 0 6" />
        <path d="M4 12c-1.5 1.5-1.5 3.5 0 5s3.5 1.5 5 0" />
        <path d="M20 12c1.5 1.5 1.5 3.5 0 5s-3.5 1.5-5 0" />
        <path d="M7 19c-1-2-1-4 0-6" />
        <path d="M17 19c1-2 1-4 0-6" />
        <path d="M12 22v-4" />
        <path d="M12 14c-1.5-1.5-1.5-3.5 0-5" />
        <path d="M12 14c1.5-1.5 1.5-3.5 0-5" />
    </svg>
);

const FaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
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
  
  const popularHealers = doctors.slice(0, 2);

  const categories = [
    { label: "Dentistry", icon: <ToothIcon className="w-8 h-8 text-primary" /> },
    { label: "Cardiology", icon: <HeartPulse className="w-8 h-8 text-primary" /> },
    { label: "Dermatology", icon: <FaceIcon className="w-8 h-8 text-primary" /> },
    { label: "Neurology", icon: <Brain className="w-8 h-8 text-primary" /> },
    { label: "Ophthalmology", icon: <Eye className="w-8 h-8 text-primary" /> },
    { label: "General", icon: <Stethoscope className="w-8 h-8 text-primary" /> },
  ];

  const AppointmentCard = ({ appointment, index }: { appointment: Appointment, index: number }) => {
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const cardColors = ['bg-[#F2FFE3]', 'bg-[#FFE0B2]'];
    const dateColors = ['bg-[#D9F5B3]', 'bg-[#F9C88A]'];
    const cardColor = cardColors[index % cardColors.length];
    const dateColor = dateColors[index % dateColors.length];

    return (
        <Card className={cn("flex-shrink-0 w-64 rounded-2xl shadow-md", cardColor)}>
            <CardContent className="p-4 text-gray-800">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={cn("flex flex-col items-center justify-center rounded-lg p-2 w-16", dateColor)}>
                            <span className="text-2xl font-bold">{format(new Date(appointment.date), 'dd')}</span>
                            <span className="font-semibold">{format(new Date(appointment.date), 'E')}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                            <h3 className="font-bold text-base mt-1">{doctor?.name}</h3>
                            <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-600">
                        <MoreHorizontal />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

  return (
    <div className="relative min-h-full">
      <div className="bg-primary p-6 pt-6 pb-20 rounded-b-[3rem]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary-foreground fill-primary-foreground/20" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto text-primary-foreground">
                  <span className="text-sm font-normal">
                    {location ? `${location.city}, ${location.country}` : 'Loading...'}
                  </span>
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

        <div className="relative mt-4">
          <Input
            placeholder="Search Doctors..."
            className="h-12 rounded-full border-0 bg-primary-foreground/20 pl-12 text-base text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/80"/>
        </div>
      </div>
      
      <div className="px-6 -mt-12 space-y-4">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Upcoming appointments</h2>
                    <Link href="/appointments">
                        <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
                    </Link>
                </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6">
              {upcomingAppointments.map((appointment, index) => (
                <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="pb-6">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                <Link href="#">
                    <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
                </Link>
            </div>
            <Carousel opts={{
              align: "start",
              dragFree: true,
            }} className="w-full">
              <CarouselContent className="-ml-2">
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="pl-2 basis-1/4">
                    <CategoryCard icon={category.icon} label={category.label} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          <section className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Doctors</h2>
              <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-1/2 pr-2">
                <Card className="flex items-center justify-center gap-1 p-1 bg-primary/10 border-primary/20">
                  <span className="font-semibold text-primary text-xs">Near you</span>
                </Card>
                <Card className="flex items-center justify-center gap-1 p-1">
                  <Star className="w-4 h-4 text-muted-foreground"/>
                  <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">Favourites</span>
                </Card>
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
