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
  language: 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Marathi' | 'Bengali' | 'Punjabi' | 'Gujarati';
  emergencyContact: string;
  relationship: string;
  createdAt: string;
  medicines: Medicine[];
}

// Mock data removed in production cleanup. Real data is fetched from the API.
