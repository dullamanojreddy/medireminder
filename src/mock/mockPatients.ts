export interface TimingItem {
  time: string;
  enabled: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  tabletsPerDose?: number;
  totalStock?: number;
  quantity: number;
  times: string[]; // e.g. ["08:00 AM", "02:00 PM"]
  timings?: TimingItem[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Refill Soon';
}

export interface MedicationLogEntry {
  id?: string;
  patientId: string;
  medicineId: string;
  medicineName: string;
  date: string;
  time: string;
  status: 'taken' | 'missed' | 'snoozed';
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  language: 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Marathi';
  emergencyContact: string;
  relationship: string;
  createdAt: string;
  medicines: Medicine[];
}

export const initialPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Ravi Kumar",
    dob: "1955-08-12",
    gender: "Male",
    phone: "9845012345",
    language: "Telugu",
    emergencyContact: "Anitha Kumar",
    relationship: "Daughter",
    createdAt: "2026-01-15T08:30:00Z",
    medicines: [
      {
        id: "med-1-1",
        name: "Paracetamol",
        dosage: "650mg",
        quantity: 12,
        times: ["08:00 AM", "02:00 PM", "08:00 PM"],
        startDate: "2026-07-01",
        endDate: "2026-08-01",
        status: "Active"
      },
      {
        id: "med-1-2",
        name: "Atorvastatin",
        dosage: "10mg",
        quantity: 4,
        times: ["08:00 PM"],
        startDate: "2026-05-10",
        endDate: "2026-11-10",
        status: "Refill Soon"
      }
    ]
  },
  {
    id: "pat-2",
    name: "Savitri Devi",
    dob: "1948-11-03",
    gender: "Female",
    phone: "9765123456",
    language: "Hindi",
    emergencyContact: "Rajesh Devi",
    relationship: "Son",
    createdAt: "2026-02-10T10:15:00Z",
    medicines: [
      {
        id: "med-2-1",
        name: "Metformin",
        dosage: "500mg",
        quantity: 60,
        times: ["08:00 AM", "08:00 PM"],
        startDate: "2026-06-15",
        endDate: "2026-12-15",
        status: "Active"
      },
      {
        id: "med-2-2",
        name: "Amlodipine",
        dosage: "5mg",
        quantity: 8,
        times: ["08:00 AM"],
        startDate: "2026-06-15",
        endDate: "2026-09-15",
        status: "Refill Soon"
      }
    ]
  },
  {
    id: "pat-3",
    name: "Gopal Rao",
    dob: "1950-04-25",
    gender: "Male",
    phone: "8123456789",
    language: "Kannada",
    emergencyContact: "Vikram Rao",
    relationship: "Son",
    createdAt: "2026-02-28T14:45:00Z",
    medicines: [
      {
        id: "med-3-1",
        name: "Losartan",
        dosage: "50mg",
        quantity: 25,
        times: ["08:00 AM"],
        startDate: "2026-03-01",
        endDate: "2026-09-01",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-4",
    name: "Anjana Iyer",
    dob: "1962-12-18",
    gender: "Female",
    phone: "9444012345",
    language: "Tamil",
    emergencyContact: "Sridhar Iyer",
    relationship: "Husband",
    createdAt: "2026-03-12T09:00:00Z",
    medicines: [
      {
        id: "med-4-1",
        name: "Thyroxine",
        dosage: "75mcg",
        quantity: 90,
        times: ["07:00 AM"],
        startDate: "2026-01-01",
        endDate: "2027-01-01",
        status: "Active"
      },
      {
        id: "med-4-2",
        name: "Multivitamin",
        dosage: "1 Capsule",
        quantity: 0,
        times: ["02:00 PM"],
        startDate: "2026-06-01",
        endDate: "2026-07-01",
        status: "Expired"
      }
    ]
  },
  {
    id: "pat-5",
    name: "Madhukar Joshi",
    dob: "1957-01-30",
    gender: "Male",
    phone: "9820098765",
    language: "Marathi",
    emergencyContact: "Suhas Joshi",
    relationship: "Brother",
    createdAt: "2026-03-22T11:20:00Z",
    medicines: [
      {
        id: "med-5-1",
        name: "Pantoprazole",
        dosage: "40mg",
        quantity: 15,
        times: ["07:30 AM"],
        startDate: "2026-07-10",
        endDate: "2026-08-10",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-6",
    name: "Venkat Naidu",
    dob: "1953-07-14",
    gender: "Male",
    phone: "8897011223",
    language: "Telugu",
    emergencyContact: "Ramesh Naidu",
    relationship: "Son",
    createdAt: "2026-04-05T16:10:00Z",
    medicines: [
      {
        id: "med-6-1",
        name: "Clopidogrel",
        dosage: "75mg",
        quantity: 2,
        times: ["08:00 PM"],
        startDate: "2026-04-10",
        endDate: "2026-10-10",
        status: "Refill Soon"
      }
    ]
  },
  {
    id: "pat-7",
    name: "Kamala Krishnan",
    dob: "1960-03-08",
    gender: "Female",
    phone: "9884055667",
    language: "Tamil",
    emergencyContact: "Deepa Krishnan",
    relationship: "Daughter",
    createdAt: "2026-04-18T10:00:00Z",
    medicines: [
      {
        id: "med-7-1",
        name: "Gabapentin",
        dosage: "100mg",
        quantity: 45,
        times: ["08:00 AM", "08:00 PM"],
        startDate: "2026-05-01",
        endDate: "2026-08-01",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-8",
    name: "Harpreet Singh",
    dob: "1945-09-21",
    gender: "Male",
    phone: "9814088990",
    language: "English",
    emergencyContact: "Gurpreet Singh",
    relationship: "Son",
    createdAt: "2026-05-02T12:40:00Z",
    medicines: [
      {
        id: "med-8-1",
        name: "Insulin Glargine",
        dosage: "10 Units",
        quantity: 3,
        times: ["09:00 PM"],
        startDate: "2026-05-05",
        endDate: "2026-11-05",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-9",
    name: "Meera Deshmukh",
    dob: "1965-05-15",
    gender: "Female",
    phone: "9921044332",
    language: "Marathi",
    emergencyContact: "Anand Deshmukh",
    relationship: "Husband",
    createdAt: "2026-05-15T15:30:00Z",
    medicines: [
      {
        id: "med-9-1",
        name: "Calcium carbonate",
        dosage: "500mg",
        quantity: 120,
        times: ["02:00 PM"],
        startDate: "2026-05-20",
        endDate: "2026-11-20",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-10",
    name: "Subba Rao",
    dob: "1942-02-11",
    gender: "Male",
    phone: "9490155443",
    language: "Telugu",
    emergencyContact: "Prasad Rao",
    relationship: "Son",
    createdAt: "2026-05-28T09:15:00Z",
    medicines: [
      {
        id: "med-10-1",
        name: "Ramipril",
        dosage: "2.5mg",
        quantity: 30,
        times: ["08:00 AM"],
        startDate: "2026-06-01",
        endDate: "2026-12-01",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-11",
    name: "Nirmala Sharma",
    dob: "1958-06-25",
    gender: "Female",
    phone: "7011244332",
    language: "Hindi",
    emergencyContact: "Amit Sharma",
    relationship: "Son",
    createdAt: "2026-06-10T11:00:00Z",
    medicines: [
      {
        id: "med-11-1",
        name: "Atorvastatin",
        dosage: "20mg",
        quantity: 28,
        times: ["09:00 PM"],
        startDate: "2026-06-12",
        endDate: "2026-12-12",
        status: "Active"
      }
    ]
  },
  {
    id: "pat-12",
    name: "Balan Nair",
    dob: "1951-10-10",
    gender: "Male",
    phone: "9847055443",
    language: "English",
    emergencyContact: "Sajith Nair",
    relationship: "Son",
    createdAt: "2026-06-25T14:20:00Z",
    medicines: [
      {
        id: "med-12-1",
        name: "Warfarin",
        dosage: "2mg",
        quantity: 14,
        times: ["06:00 PM"],
        startDate: "2026-06-26",
        endDate: "2026-09-26",
        status: "Active"
      }
    ]
  }
];
