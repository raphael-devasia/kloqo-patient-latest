import { user, doctors, appointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Star, Clock, Video, MessageCircle, BrainCircuit, HeartPulse } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"


const CategoryCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <button className="flex items-center justify-center w-16 h-16 bg-card rounded-2xl shadow-sm">
      {icon}
    </button>
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
  </div>
);

export default function Dashboard() {
  const recentVisits = appointments.filter(
    (appt) => appt.status === "Past"
  ).slice(0,2);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <Image src={user.avatar} alt={user.name} width={48} height={48} />
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Hello</p>
            <h1 className="text-xl font-bold">{user.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="relative">
        <Input
          placeholder="Search Doctor"
          className="h-12 rounded-xl bg-card pl-4 pr-12 text-base"
        />
        <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9">
          <Search className="h-5 w-5"/>
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Category</h2>
          <Button variant="link" className="text-primary pr-0">See All</Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <CategoryCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M7.3 6.2c.5.5.8 1.2.8 2 0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8-.8 0-1.5-.3-2-.8-.5-.5-.8-1.2-.8-2 0-.8.3-1.5.8-2 .5-.5 1.2-.8 2-.8.8 0 1.5.3 2 .8Z"/><path d="M15 6.2c.5.5.8 1.2.8 2 0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8-.8 0-1.5-.3-2-.8-.5-.5-.8-1.2-.8-2 0-.8.3-1.5.8-2 .5-.5 1.2-.8 2-.8.8 0 1.5.3 2 .8Z"/><path d="M12.5 2.2c.5-.5 1.2-.8 2-.8.8 0 1.5.3 2 .8.5.5.8 1.2.8 2 0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8-.8 0-1.5-.3-2-.8-.5-.5-.8-1.2-.8-2 0-.8.3-1.5.8-2Z"/><path d="M14.5 9c.6 0 1.1.2 1.5.5 1 .7 1.1 2.4.4 3.4-.6 1-1.8 1.2-2.8 2.2-1.3 1.3-2.6 2.9-2.6 4.9v.5h-2v-.5c0-2.2 1.1-4.1 2.3-5.3.9-.9 2.2-1.2 2.7-2.2.3-.5.3-1.2 0-1.7-.5-.6-1.2-.7-1.5-.7-1.3 0-2 .5-2 .5"/><path d="M10.1 21.8c-.8 0-1.5-.3-2-.8-.5-.5-.8-1.2-.8-2 0-.8.3-1.5.8-2s1.2-.8 2-.8c.8 0 1.5.3 2 .8.5.5.8 1.2.8 2 0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8Z"/></svg>} label="Dental" />
          <CategoryCard icon={<BrainCircuit className="h-7 w-7 text-primary" />} label="Neurologist" />
          <CategoryCard icon={<HeartPulse className="h-7 w-7 text-primary" />} label="Cardiology" />
          <CategoryCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>} label="General" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">My Recent Visit</h2>
          <Button variant="link" className="text-primary pr-0">See All</Button>
        </div>
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-2">
            {recentVisits.map((visit) => {
              const doctor = doctors.find(d => d.id === visit.doctorId);
              return (
              <CarouselItem key={visit.id} className="basis-3/4 pl-2">
                <Card className="shadow-md">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2">
                        <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
                        <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-base">{doctor?.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-accent text-accent-foreground rounded-lg p-2">
                       <span className="font-medium">{format(new Date(visit.date), "EEEE")}</span>
                       <div className="flex items-center gap-1">
                         <Clock className="w-4 h-4" />
                         <span className="font-medium">{visit.time}</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2"/>
                        Message
                      </Button>
                      <Button className="w-full">
                        <Video className="w-4 h-4 mr-2"/>
                        Video Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            )})}
          </CarouselContent>
        </Carousel>
      </section>
    </div>
  );
}
