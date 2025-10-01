import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Appointment, Doctor, UserProfile, Notification } from '@/lib/types';
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

export const savedPatients: UserProfile[] = [
  {
    name: 'Ava Sam',
    email: 'ava.sam@example.com',
    phone: '111-222-3333',
    dob: '2018-08-20',
    address: '456 Child St, Playful Town, 20202',
    emergencyContact: {
      name: 'Alex Doe',
      phone: '123-456-7890',
    },
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhc2lhbiUyMGdpcmx8ZW58MHx8fHwxNzU4NjI2MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  }
];

export const doctors: Doctor[] = [
  { 
    id: 'doc1', 
    name: 'Dr. Priya Varma', 
    specialty: 'Cardiology', 
    avatar: findImage('doctor-1'), 
    clinic: 'Wellness Clinic', 
    clinicCity: 'Wandoor',
    clinicPhone: '212-555-1234',
    rating: 4.9, 
    reviews: 128, 
    currentToken: 58, 
    location: { latitude: 11.1954, longitude: 76.2301 }, 
    isFavourite: true, 
    bio: 'Dr. Priya Varma is a renowned cardiologist with over 15 years of experience in treating heart conditions. She is dedicated to providing compassionate and comprehensive care to her patients.', 
    fee: 500 
  },
  { 
    id: 'doc2', 
    name: 'Dr. Katherine Rose', 
    specialty: 'Dermatology', 
    avatar: findImage('doctor-2'), 
    clinic: 'City Clinic', 
    clinicCity: 'Pandikkad',
    clinicPhone: '212-555-5678',
    rating: 4.8, 
    reviews: 92, 
    currentToken: 32, 
    location: { latitude: 11.1175, longitude: 76.2323 }, 
    isFavourite: false, 
    bio: 'Dr. Katherine Rose is a board-certified dermatologist specializing in cosmetic and medical dermatology. She is passionate about helping her patients achieve healthy, beautiful skin.', 
    fee: 350 
  },
  { 
    id: 'doc4', 
    name: 'Dr. Dona Wilson', 
    specialty: 'Neurology', 
    avatar: findImage('doctor-4'), 
    clinic: 'Healthway Medical', 
    clinicCity: 'Chungam',
    clinicPhone: '718-555-1111',
    rating: 4.7, 
    reviews: 89, 
    currentToken: 18, 
    location: { latitude: 10.9755, longitude: 76.2230 }, 
    isFavourite: true, 
    bio: 'Dr. Dona Wilson is a neurologist who specializes in the diagnosis and treatment of disorders of the nervous system. She has a special interest in migraine and epilepsy.', 
    fee: 450 
  },
  { 
    id: 'doc5', 
    name: 'Dr. Ashiq Syed', 
    specialty: 'Dentistry', 
    avatar: findImage('doctor-5'), 
    clinic: 'Bright Smiles Dental', 
    clinicCity: 'Perinthalmanna',
    clinicPhone: '212-555-2222',
    rating: 4.9, 
    reviews: 152, 
    currentToken: 25, 
    location: { latitude: 10.9782, longitude: 76.2247 }, 
    isFavourite: false, 
    bio: 'Dr. Ashiq Syed is a friendly and skilled dentist who provides a wide range of dental services. He is known for his gentle touch and ability to put even the most anxious patients at ease.', 
    fee: 200 
  },
  { 
    id: 'doc6', 
    name: 'Dr. Swee', 
    specialty: 'General', 
    avatar: findImage('doctor-2'), 
    clinic: 'General Hospital', 
    clinicCity: 'Wandoor',
    clinicPhone: '212-555-3333',
    rating: 4.5, 
    reviews: 75, 
    currentToken: 10, 
    location: { latitude: 11.1954, longitude: 76.2301 }, 
    isFavourite: false, 
    bio: 'Dr. Swee is a dedicated general practitioner with a holistic approach to patient care.', 
    fee: 150 
  },
];

export const appointments: Appointment[] = [
  {
    id: 'appt1',
    doctorId: 'doc1',
    doctorName: 'Dr. Priya Varma',
    doctorAvatar: findImage('doctor-1'),
    doctorClinic: 'Wellness Clinic',
    specialty: 'Cardiology',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Upcoming',
    patientDetails: {
      name: 'Alex Doe',
      age: '34',
      sex: 'male',
      location: 'Wellness City',
      phone: '123-456-7890'
    }
  },
  {
    id: 'appt2',
    doctorId: 'doc2',
    doctorName: 'Dr. Rohan Pillai',
    doctorAvatar: findImage('doctor-2'),
    doctorClinic: 'City Clinic',
    specialty: 'Dermatology',
    date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    time: '02:30 PM',
    type: 'Follow-up',
    status: 'Upcoming',
    patientDetails: {
      name: 'Alex Doe',
      age: '34',
      sex: 'male',
      location: 'Wellness City',
      phone: '123-456-7890'
    }
  },
  {
    id: 'appt5',
    doctorId: 'doc3',
    doctorName: 'Dr. Anjali Menon',
    doctorAvatar: findImage('doctor-3'),
    doctorClinic: 'Wellness Clinic',
    specialty: 'Pediatrics',
    date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    time: '11:00 AM',
    type: 'Check-up',
    status: 'Past',
    patientDetails: {
      name: 'Ava Sam',
      age: '5',
      sex: 'female',
      location: 'Playful Town',
      phone: '111-222-3333',
    }
  },
  {
    id: 'appt4',
    doctorId: 'doc1',
    doctorName: 'Dr. Priya Varma',
    doctorAvatar: findImage('doctor-1'),
    doctorClinic: 'Wellness Clinic',
    specialty: 'Cardiology',
    date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    time: '09:00 AM',
    type: 'Consultation',
    status: 'Past',
    patientDetails: {
      name: 'Alex Doe',
      age: '34',
      sex: 'male',
      location: 'Wellness City',
      phone: '123-456-7890'
    }
  },
  {
    id: 'appt6',
    doctorId: 'doc6',
    doctorName: 'Dr. Swee',
    doctorAvatar: findImage('doctor-2'),
    doctorClinic: 'General Hospital',
    specialty: 'General',
    date: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
    time: '09:30 AM',
    type: 'Consultation',
    status: 'Upcoming',
    patientDetails: {
      name: 'Ava Sam',
      age: '5',
      sex: 'female',
      location: 'Playful Town',
      phone: '111-222-3333',
    }
  }
];

export const doctorAvailability = {
  "doc1": { // Dr. Priya Varma
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

export const notifications: Notification[] = [
  {
    id: 'notif1',
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Priya Varma is confirmed for tomorrow at 10:00 AM. Your token number is 065.',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    isRead: false,
  },
  {
    id: 'notif2',
    type: 'delay',
    title: 'Doctor Running Late',
    message: 'Dr. Katherine Rose is running approximately 30 minutes late for today\'s appointments.',
    date: format(new Date(), 'yyyy-MM-dd'),
    isRead: false,
  },
  {
    id: 'notif3',
    type: 'availability',
    title: 'Schedule Change',
    message: 'Dr. Varun Vikas has new availability next week. Check the schedule to book a new slot.',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    isRead: true,
  },
  {
    id: 'notif4',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Reminder: You have a follow-up with Dr. Dona Wilson in 2 days.',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    isRead: false,
  },
];
