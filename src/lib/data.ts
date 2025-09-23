import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Appointment, Doctor, UserProfile } from '@/lib/types';
import { subDays, format, addDays } from 'date-fns';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const user: UserProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  phone: '123-456-7890',
  dob: '1990-05-15',
  address: '123 Health St, Wellness City, 10101',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '098-765-4321',
  },
  avatar: findImage('user-avatar'),
};

export const doctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Evelyn Reed', specialty: 'Cardiology', avatar: findImage('doctor-1'), clinic: 'Wellness Clinic' },
  { id: 'doc2', name: 'Dr. Marcus Thorne', specialty: 'Dermatology', avatar: findImage('doctor-2'), clinic: 'City Clinic' },
  { id: 'doc3', name: 'Dr. Elena Vance', specialty: 'Pediatrics', avatar: findImage('doctor-3'), clinic: 'Wellness Clinic' },
];

export const appointments: Appointment[] = [
  {
    id: 'appt1',
    doctorId: 'doc1',
    doctorName: 'Dr. Evelyn Reed',
    doctorAvatar: findImage('doctor-1'),
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Upcoming',
  },
  {
    id: 'appt2',
    doctorId: 'doc2',
    doctorName: 'Dr. Marcus Thorne',
    doctorAvatar: findImage('doctor-2'),
    date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    time: '02:30 PM',
    type: 'Follow-up',
    status: 'Upcoming',
  },
   {
    id: 'appt5',
    doctorId: 'doc3',
    doctorName: 'Dr. Elena Vance',
    doctorAvatar: findImage('doctor-3'),
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    time: '09:30 AM',
    type: 'Consultation',
    status: 'Upcoming',
  },
  {
    id: 'appt3',
    doctorId: 'doc3',
    doctorName: 'Dr. Elena Vance',
    doctorAvatar: findImage('doctor-3'),
    date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    time: '11:00 AM',
    type: 'Check-up',
    status: 'Past',
  },
  {
    id: 'appt4',
    doctorId: 'doc1',
    doctorName: 'Dr. Evelyn Reed',
    doctorAvatar: findImage('doctor-1'),
    date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    time: '09:00 AM',
    type: 'Consultation',
    status: 'Past',
  },
];

export const doctorAvailability = {
  "doc1": { // Dr. Evelyn Reed
    "next_7_days": [
      { "date": format(addDays(new Date(), 1), 'yyyy-MM-dd'), "slots": ["09:00 AM", "11:00 AM", "02:00 PM"] },
      { "date": format(addDays(new Date(), 2), 'yyyy-MM-dd'), "slots": ["10:00 AM", "12:00 PM"] },
      { "date": format(addDays(new Date(), 4), 'yyyy-MM-dd'), "slots": ["09:30 AM", "11:30 AM", "03:00 PM"] },
    ]
  },
  // ... other doctors
};

export const userSchedule = {
  "personal_meetings": [
    { "date": format(addDays(new Date(), 1), 'yyyy-MM-dd'), "start_time": "10:00 AM", "end_time": "11:00 AM", "title": "Project Sync" },
    { "date": format(addDays(new Date(), 2), 'yyyy-MM-dd'), "start_time": "01:00 PM", "end_time": "02:00 PM", "title": "Team Lunch" },
  ]
};
