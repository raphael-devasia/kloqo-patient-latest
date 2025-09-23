export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
};

export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
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
