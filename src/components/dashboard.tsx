
"use client";

import { user, doctors, appointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Star, Clock, Video, MessageCircle, BrainCircuit, HeartPulse, Calendar, VideoIcon, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { format, isPast } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
  <Card className="p-4 flex flex-col items-center justify-center gap-2 aspect-square rounded-2xl shadow-sm hover:bg-accent/50 transition-colors">
    <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full">
      {icon}
    </div>
    <span className="text-sm font-medium text-center">{label}</span>
  </Card>
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

  return (
    <div className="space-y-8 bg-slate-50/80 -m-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary fill-primary/20" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <h1 className="text-base font-bold text-gray-800">
                  {location ? `${location.city}, ${location.country}` : 'Loading...'}
                </h1>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setLocation({ city: 'London', country: 'UK' })}>London, UK</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLocation({ city: 'Tokyo', country: 'Japan' })}>Tokyo, Japan</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLocation({ city: 'Sydney', country: 'Australia' })}>Sydney, Australia</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-6 w-6 text-gray-500" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </header>

      <div className="relative">
        <Input
          placeholder="Search Doctors..."
          className="h-14 rounded-xl border-2 border-slate-200/80 bg-white pl-12 text-base focus-visible:ring-primary/40"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"/>
        <Button size="icon" variant="ghost" className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" /></svg>
        </Button>
      </div>

      {nextAppointment && nextDoctor && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Upcoming appointments</h2>
            <Link href="/appointments">
              <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
            </Link>
          </div>
          <Card className="bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 overflow-hidden">
            <CardContent className="p-4">
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
                  <p className="text-sm text-primary-foreground/80">{nextDoctor.specialty}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm bg-primary-foreground/10 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4"/>
                  <span>{format(new Date(nextAppointment.date), "dd MMM, EEEE")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4"/>
                  <span>{nextAppointment.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-4">
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
  );
}
