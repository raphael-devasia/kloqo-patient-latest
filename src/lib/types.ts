export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  clinic: string;
  rating: number;
  reviews: number;
  currentToken: number;
  location: {
    latitude: number;
    longitude: number;
  };
  isFavourite?: boolean;
};

export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorClinic: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Check-up';
  status: 'Upcoming' | 'Past' | 'Cancelled';
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  avatar: string;
};

export type Notification = {
  id: string;
  type: 'appointment' | 'delay' | 'availability';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
};
