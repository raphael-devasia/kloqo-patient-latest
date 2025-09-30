
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

export const doctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Priya Varma', specialty: 'Cardiology', avatar: findImage('doctor-1'), clinic: 'Wellness Clinic', rating: 4.9, reviews: 128, currentToken: 58, location: { latitude: 40.7128, longitude: -74.0060 }, isFavourite: true, bio: 'Dr. Priya Varma is a renowned cardiologist with over 15 years of experience in treating heart conditions. She is dedicated to providing compassionate and comprehensive care to her patients.', fee: 500 },
  { id: 'doc2', name: 'Dr. Katherine Rose', specialty: 'Dermatology', avatar: findImage('doctor-2'), clinic: 'City Clinic', rating: 4.8, reviews: 92, currentToken: 32, location: { latitude: 40.7580, longitude: -73.9855 }, isFavourite: false, bio: 'Dr. Katherine Rose is a board-certified dermatologist specializing in cosmetic and medical dermatology. She is passionate about helping her patients achieve healthy, beautiful skin.', fee: 350 },
  { id: 'doc3', name: 'Dr. Varun Vikas', specialty: 'Pediatrics', avatar: findImage('doctor-3'), clinic: 'Wellness Clinic', rating: 5.0, reviews: 215, currentToken: 41, location: { latitude: 40.7128, longitude: -74.0060 }, isFavourite: false, bio: 'Dr. Varun Vikas is a caring and experienced pediatrician who is committed to the health and well-being of children. He takes a family-centered approach to care.', fee: 250 },
  { id: 'doc4', name: 'Dr. Dona Wilson', specialty: 'Neurology', avatar: findImage('doctor-4'), clinic: 'Healthway Medical', rating: 4.7, reviews: 89, currentToken: 18, location: { latitude: 40.730610, longitude: -73.935242 }, isFavourite: true, bio: 'Dr. Dona Wilson is a neurologist who specializes in the diagnosis and treatment of disorders of the nervous system. She has a special interest in migraine and epilepsy.', fee: 450 },
  { id: 'doc5', name: 'Dr. Ashiq Syed', specialty: 'Dentistry', avatar: findImage('doctor-5'), clinic: 'Bright Smiles Dental', rating: 4.9, reviews: 152, currentToken: 25, location: { latitude: 40.7484, longitude: -73.9857 }, isFavourite: false, bio: 'Dr. Ashiq Syed is a friendly and skilled dentist who provides a wide range of dental services. He is known for his gentle touch and ability to put even the most anxious patients at ease.', fee: 200 },
];

export const appointments: Appointment[] = [
  {
    id: 'appt1',
    doctorId: 'doc1',
    doctorName: 'Dr. Priya Varma',
    doctorAvatar: findImage('doctor-1'),
    doctorClinic: 'Wellness Clinic',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Upcoming',
  },
  {
    id: 'appt2',
    doctorId: 'doc2',
    doctorName: 'Dr. Rohan Pillai',
    doctorAvatar: findImage('doctor-2'),
    doctorClinic: 'City Clinic',
    date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    time: '02:30 PM',
    type: 'Follow-up',
    status: 'Upcoming',
  },
   {
    id: 'appt5',
    doctorId: 'doc3',
    doctorName: 'Dr. Anjali Menon',
    doctorAvatar: findImage('doctor-3'),
    doctorClinic: 'Wellness Clinic',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    time: '09:30 AM',
    type: 'Consultation',
    status: 'Upcoming',
  },
  {
    id: 'appt3',
    doctorId: 'doc3',
    doctorName: 'Dr. Anjali Menon',
    doctorAvatar: findImage('doctor-3'),
    doctorClinic: 'Wellness Clinic',
    date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    time: '11:00 AM',
    type: 'Check-up',
    status: 'Past',
  },
  {
    id: 'appt4',
    doctorId: 'doc1',
    doctorName: 'Dr. Priya Varma',
    doctorAvatar: findImage('doctor-1'),
    doctorClinic: 'Wellness Clinic',
    date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    time: '09:00 AM',
    type: 'Consultation',
    status: 'Past',
  },
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
