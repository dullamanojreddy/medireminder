export interface Reminder {
  id: string;
  patientId: string;
  patientName: string; // for easier join
  medicineId: string;
  medicineName: string; // for easier join
  time: string; // e.g. "08:00 AM" or ISO string
  date: string; // e.g. "2026-07-21"
  attempt: number;
  status: 'Pending' | 'Completed' | 'Expired' | 'Snoozed';
}

export const initialReminders: Reminder[] = [
  {
    id: "rem-1",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-2",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "02:00 PM",
    date: "2026-07-21",
    attempt: 1,
    status: "Pending"
  },
  {
    id: "rem-3",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "08:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-4",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-2",
    medicineName: "Atorvastatin",
    time: "08:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-5",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-1",
    medicineName: "Metformin",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 2,
    status: "Completed"
  },
  {
    id: "rem-6",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-1",
    medicineName: "Metformin",
    time: "08:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-7",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-2",
    medicineName: "Amlodipine",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Snoozed"
  },
  {
    id: "rem-8",
    patientId: "pat-3",
    patientName: "Gopal Rao",
    medicineId: "med-3-1",
    medicineName: "Losartan",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-9",
    patientId: "pat-4",
    patientName: "Anjana Iyer",
    medicineId: "med-4-1",
    medicineName: "Thyroxine",
    time: "07:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-10",
    patientId: "pat-5",
    patientName: "Madhukar Joshi",
    medicineId: "med-5-1",
    medicineName: "Pantoprazole",
    time: "07:30 AM",
    date: "2026-07-21",
    attempt: 3,
    status: "Expired"
  },
  {
    id: "rem-11",
    patientId: "pat-6",
    patientName: "Venkat Naidu",
    medicineId: "med-6-1",
    medicineName: "Clopidogrel",
    time: "08:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-12",
    patientId: "pat-7",
    patientName: "Kamala Krishnan",
    medicineId: "med-7-1",
    medicineName: "Gabapentin",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-13",
    patientId: "pat-7",
    patientName: "Kamala Krishnan",
    medicineId: "med-7-1",
    medicineName: "Gabapentin",
    time: "08:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-14",
    patientId: "pat-8",
    patientName: "Harpreet Singh",
    medicineId: "med-8-1",
    medicineName: "Insulin Glargine",
    time: "09:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-15",
    patientId: "pat-9",
    patientName: "Meera Deshmukh",
    medicineId: "med-9-1",
    medicineName: "Calcium carbonate",
    time: "02:00 PM",
    date: "2026-07-21",
    attempt: 1,
    status: "Pending"
  },
  {
    id: "rem-16",
    patientId: "pat-10",
    patientName: "Subba Rao",
    medicineId: "med-10-1",
    medicineName: "Ramipril",
    time: "08:00 AM",
    date: "2026-07-21",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-17",
    patientId: "pat-11",
    patientName: "Nirmala Sharma",
    medicineId: "med-11-1",
    medicineName: "Atorvastatin",
    time: "09:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-18",
    patientId: "pat-12",
    patientName: "Balan Nair",
    medicineId: "med-12-1",
    medicineName: "Warfarin",
    time: "06:00 PM",
    date: "2026-07-21",
    attempt: 0,
    status: "Pending"
  },
  {
    id: "rem-19",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-20",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "02:00 PM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-21",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    time: "08:00 PM",
    date: "2026-07-20",
    attempt: 2,
    status: "Snoozed"
  },
  {
    id: "rem-22",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-1",
    medicineName: "Metformin",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-23",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-1",
    medicineName: "Metformin",
    time: "08:00 PM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-24",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-2",
    medicineName: "Amlodipine",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-25",
    patientId: "pat-3",
    patientName: "Gopal Rao",
    medicineId: "med-3-1",
    medicineName: "Losartan",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 3,
    status: "Expired"
  },
  {
    id: "rem-26",
    patientId: "pat-4",
    patientName: "Anjana Iyer",
    medicineId: "med-4-1",
    medicineName: "Thyroxine",
    time: "07:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-27",
    patientId: "pat-5",
    patientName: "Madhukar Joshi",
    medicineId: "med-5-1",
    medicineName: "Pantoprazole",
    time: "07:30 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-28",
    patientId: "pat-7",
    patientName: "Kamala Krishnan",
    medicineId: "med-7-1",
    medicineName: "Gabapentin",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-29",
    patientId: "pat-7",
    patientName: "Kamala Krishnan",
    medicineId: "med-7-1",
    medicineName: "Gabapentin",
    time: "08:00 PM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  },
  {
    id: "rem-30",
    patientId: "pat-10",
    patientName: "Subba Rao",
    medicineId: "med-10-1",
    medicineName: "Ramipril",
    time: "08:00 AM",
    date: "2026-07-20",
    attempt: 1,
    status: "Completed"
  }
];
