

"use client";

import { user, doctors as initialDoctors } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, HeartPulse, Brain, Eye, Stethoscope, Star, MapPin, Clock, Loader2, Heart, Hospital, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { format, isPast, formatDistanceToNow, parseISO } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useMemo, useState, useRef } from "react";
import { Appointment, Doctor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ToothIcon, FaceIcon } from "./category-icons";
import { appointments } from "@/lib/data";
import NotificationsDialog from "./notifications-dialog";
import LocationDialog from "./location-dialog";
import { useRouter } from "next/navigation";


// Haversine formula to calculate distance between two lat/lon points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0.1;
  }
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d < 0.1 ? 0.1 : d;
};


const CategoryCard = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => (
  <Link href={href} className="flex flex-col items-center justify-center gap-2 text-center">
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

const DoctorCard = ({ 
  doctor, 
  userLocation,
  onToggleFavourite
}: { 
  doctor: Doctor, 
  userLocation: { latitude: number; longitude: number; } | null 
  onToggleFavourite: (doctorId: string) => void;
}) => {
    const [distance, setDistance] = useState<string | null>(null);

    useEffect(() => {
        if (userLocation && doctor.location) {
        const dist = getDistance(userLocation.latitude, userLocation.longitude, doctor.location.latitude, doctor.location.longitude);
        setDistance(dist.toFixed(1) + " km");
        }
    }, [userLocation, doctor.location]);
    
    return (
        <Card className="p-4 relative">
            <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h3 className="font-bold text-base">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground/80">{doctor.clinic}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onToggleFavourite(doctor.id)}>
                <Heart className={cn("w-5 h-5", doctor.isFavourite ? "text-red-500 fill-red-500" : "text-muted-foreground")} />
            </Button>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-muted-foreground">
                {distance ? (
                    <>
                        <MapPin className="w-3 h-3" />
                        <span>{distance}</span>
                    </>
                ) : (
                    <Loader2 className="w-3 h-3 animate-spin" />
                )}
            </div>
        </Card>
    )
}

type Suggestion = {
  type: 'doctor' | 'clinic' | 'specialty';
  label: string;
  id: string;
  avatar?: string;
  specialty?: string;
};


export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [activeTab, setActiveTab] = useState<'near' | 'favourites'>('near');
  const [relativeDate, setRelativeDate] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);


  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    router.push(`/doctors?search=${encodeURIComponent(term)}`);
    setSearchTerm('');
    setIsSearchFocused(false);
  };
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm('');
    setIsSearchFocused(false);
    if (suggestion.type === 'clinic') {
      router.push(`/clinics/${encodeURIComponent(suggestion.label)}`);
    } else if (suggestion.type === 'specialty') {
        router.push(`/doctors?specialty=${encodeURIComponent(suggestion.label)}`);
    } else { // doctor
      router.push(`/doctors?search=${encodeURIComponent(suggestion.label)}`);
    }
  };

  const suggestions = useMemo((): Suggestion[] => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: Suggestion[] = [];
    const addedClinics = new Set<string>();
    const addedSpecialties = new Set<string>();

    initialDoctors.forEach(doctor => {
      // Add doctors
      if (doctor.name.toLowerCase().includes(term)) {
        results.push({ type: 'doctor', label: doctor.name, id: `doc-${doctor.id}`, avatar: doctor.avatar, specialty: doctor.specialty });
      }
      // Add clinics
      if (doctor.clinic.toLowerCase().includes(term) && !addedClinics.has(doctor.clinic)) {
        results.push({ type: 'clinic', label: doctor.clinic, id: `clinic-${doctor.clinic}` });
        addedClinics.add(doctor.clinic);
      }
      // Add specialties
      if (doctor.specialty.toLowerCase().includes(term) && !addedSpecialties.has(doctor.specialty)) {
        results.push({ type: 'specialty', label: doctor.specialty, id: `spec-${doctor.specialty}` });
        addedSpecialties.add(doctor.specialty);
      }
    });

    return results.slice(0, 7); // Limit to 7 suggestions
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleToggleFavourite = (doctorId: string) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doc =>
        doc.id === doctorId ? { ...doc, isFavourite: !doc.isFavourite } : doc
      )
    );
  };

  const displayedDoctors = useMemo(() => {
    if (activeTab === 'favourites') {
      return doctors.filter(doc => doc.isFavourite);
    }
    return doctors.slice(0, 2); // Show first 2 for "Near you"
  }, [activeTab, doctors]);
  
  const fetchAndSetLocation = async (latitude: number, longitude: number) => {
    try {
      setUserLocation({ latitude, longitude });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const { city, country } = data.address;
      setLocation({ city, country });
    } catch (error) {
      console.error("Error fetching location:", error);
      // Fallback or error handling
      setLocation({ city: 'New York', country: 'USA' });
      setUserLocation({ latitude: 40.7128, longitude: -74.0060 });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAndSetLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Fallback to default if user denies permission
          fetchAndSetLocation(40.7128, -74.0060);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      fetchAndSetLocation(40.7128, -74.0060);
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);
  
  const upcomingAppointments = appointments
    .filter((appt) => appt.status === "Upcoming" && !isPast(new Date(appt.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextAppointment = upcomingAppointments[0];

  useEffect(() => {
    if (nextAppointment) {
      const updateRelativeDate = () => {
        setRelativeDate(formatDistanceToNow(parseISO(nextAppointment.date), { addSuffix: true }));
      };
      updateRelativeDate();
      const interval = setInterval(updateRelativeDate, 60000);
      return () => clearInterval(interval);
    }
  }, [nextAppointment]);

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
    const cardColors = ['bg-[#F2FFE3]', 'bg-[#E7D7C9]'];
    const dateColors = ['bg-[#D9F5B3]', 'bg-[#DBCFB9]'];
    const cardColor = cardColors[index % cardColors.length];
    const dateColor = dateColors[index % dateColors.length];

    return (
      <Link href="/appointments" className="block">
        <Card className={cn("flex-shrink-0 w-64 rounded-2xl shadow-md", cardColor)}>
            <CardContent className="p-4 text-gray-800">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={cn("flex flex-col items-center justify-center rounded-lg p-1 w-16 h-16", dateColor)}>
                            <span className="text-xs font-semibold">{format(new Date(appointment.date), 'MMM')}</span>
                            <span className="text-xl font-bold">{format(new Date(appointment.date), 'dd')}</span>
                            <span className="text-xs font-semibold">{format(new Date(appointment.date), 'E')}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                            <h3 className="font-bold text-base mt-1">{doctor?.name}</h3>
                            <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">{doctor?.clinic}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </Link>
    );
};

const handleLocationUpdate = async (newCity: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${newCity}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const addressParts = display_name.split(', ');
        const city = addressParts[0];
        const country = addressParts[addressParts.length - 1];

        setUserLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setLocation({ city, country });
      } else {
        console.error("Location not found");
        // Optionally: show a toast notification to the user
      }
    } catch (error) {
      console.error("Error fetching new location:", error);
    }
  };
  
  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch(type) {
      case 'doctor': return <UserIcon className="w-4 h-4 text-muted-foreground" />;
      case 'clinic': return <Hospital className="w-4 h-4 text-muted-foreground" />;
      case 'specialty': return <Stethoscope className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  }

  return (
    <div className="relative min-h-full">
      <div className="bg-[#869A73] p-6 h-[50vh] rounded-b-[3rem] flex flex-col">
        <header className="flex items-center justify-between text-white pt-4">
          <div>
            <h2 className="text-xl font-bold">Morning, {user.name.split(' ')[0]}</h2>
            <LocationDialog onLocationUpdate={handleLocationUpdate} onUseCurrentLocation={handleUseCurrentLocation}>
              <div className="flex items-center gap-1.5 text-sm cursor-pointer">
                <MapPin className="w-4 h-4" />
                <p>
                  {location ? `${location.city}, ${location.country}` : 'Finding your location...'}
                </p>
              </div>
            </LocationDialog>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsDialog />
          </div>
        </header>

         <div ref={searchRef} className="relative mt-auto mb-4">
          <form onSubmit={handleSearchSubmit}>
            <Input
              placeholder="Search Doctors, clinics, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="h-10 rounded-full border-0 bg-primary-foreground/20 pl-12 text-base text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/80"/>
          </form>
          {isSearchFocused && suggestions.length > 0 && (
            <Card className="absolute top-full mt-2 w-full z-20 max-h-80 overflow-y-auto">
              <CardContent className="p-2">
                <ul>
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2.5 flex items-center gap-3 rounded-lg hover:bg-accent"
                      >
                         {suggestion.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={suggestion.avatar} alt={suggestion.label} />
                            <AvatarFallback>{suggestion.label.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          getSuggestionIcon(suggestion.type)
                        )}
                        <div>
                          <p className="font-semibold text-sm">{suggestion.label}</p>
                          {suggestion.specialty && (
                            <p className="text-xs text-muted-foreground">{suggestion.specialty}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="px-6 -mt-[calc(50vh-140px)] space-y-4">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-2">
             <div className="flex justify-center items-center">
                    <h2 className="text-xl font-bold text-gray-800">Upcoming appointments</h2>
                </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6">
              {upcomingAppointments.map((appointment, index) => (
                <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
              ))}
            </div>
          </div>
        )}

        {nextAppointment && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl flex justify-between items-center border border-yellow-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <p className="font-semibold text-sm">Your next medical checkup</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{relativeDate || '...'}</span>
            </div>
          </div>
        )}

        <div className="pb-6">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                <Link href="/categories">
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
                    <Link href={`/doctors?specialty=${encodeURIComponent(category.label)}`}>
                        <CategoryCard 
                        icon={category.icon} 
                        label={category.label} 
                        href={`/doctors?specialty=${encodeURIComponent(category.label)}`}
                        />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          <section className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Clinics/Doctors</h2>
              <Link href="/doctors">
                <Button variant="link" className="text-primary pr-0 font-semibold">See All</Button>
              </Link>
            </div>
            <div className="flex gap-2">
                <Card 
                  onClick={() => setActiveTab('near')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 p-0 h-8 cursor-pointer",
                    activeTab === 'near' ? 'bg-primary/10 border-primary/20' : ''
                  )}
                >
                  <span className={cn(
                    "font-semibold text-xs whitespace-nowrap",
                    activeTab === 'near' ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    Near you
                  </span>
                </Card>
                <Card 
                  onClick={() => setActiveTab('favourites')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 p-0 h-8 cursor-pointer",
                    activeTab === 'favourites' ? 'bg-primary/10 border-primary/20' : ''
                  )}
                >
                  <Star className={cn(
                    "w-4 h-4",
                    activeTab === 'favourites' ? 'text-primary' : 'text-muted-foreground'
                  )}/>
                  <span className={cn(
                    "font-semibold text-xs whitespace-nowrap",
                    activeTab === 'favourites' ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    Favourites
                  </span>
                </Card>
            </div>
            <div className="space-y-3">
              {displayedDoctors.length > 0 ? (
                displayedDoctors.map((doctor) => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    userLocation={userLocation}
                    onToggleFavourite={handleToggleFavourite}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground pt-4">You have no favourite doctors yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
