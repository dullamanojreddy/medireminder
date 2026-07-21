export interface Refill {
  id: string;
  patientId: string;
  patientName: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  remainingTablets: number;
  estimatedRefillDate: string; // e.g. "2026-07-25"
  status: 'Safe' | 'Warning' | 'Critical';
}

export const initialRefills: Refill[] = [
  {
    id: "ref-1",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-2",
    medicineName: "Atorvastatin",
    dosage: "10mg",
    remainingTablets: 4,
    estimatedRefillDate: "2026-07-25",
    status: "Critical"
  },
  {
    id: "ref-2",
    patientId: "pat-2",
    patientName: "Savitri Devi",
    medicineId: "med-2-2",
    medicineName: "Amlodipine",
    dosage: "5mg",
    remainingTablets: 8,
    estimatedRefillDate: "2026-07-29",
    status: "Warning"
  },
  {
    id: "ref-3",
    patientId: "pat-6",
    patientName: "Venkat Naidu",
    medicineId: "med-6-1",
    medicineName: "Clopidogrel",
    dosage: "75mg",
    remainingTablets: 2,
    estimatedRefillDate: "2026-07-23",
    status: "Critical"
  },
  {
    id: "ref-4",
    patientId: "pat-1",
    patientName: "Ravi Kumar",
    medicineId: "med-1-1",
    medicineName: "Paracetamol",
    dosage: "650mg",
    remainingTablets: 12,
    estimatedRefillDate: "2026-08-01",
    status: "Warning"
  },
  {
    id: "ref-5",
    patientId: "pat-3",
    patientName: "Gopal Rao",
    medicineId: "med-3-1",
    medicineName: "Losartan",
    dosage: "50mg",
    remainingTablets: 25,
    estimatedRefillDate: "2026-08-15",
    status: "Safe"
  },
  {
    id: "ref-6",
    patientId: "pat-4",
    patientName: "Anjana Iyer",
    medicineId: "med-4-1",
    medicineName: "Thyroxine",
    dosage: "75mcg",
    remainingTablets: 90,
    estimatedRefillDate: "2026-10-18",
    status: "Safe"
  },
  {
    id: "ref-7",
    patientId: "pat-5",
    patientName: "Madhukar Joshi",
    medicineId: "med-5-1",
    medicineName: "Pantoprazole",
    dosage: "40mg",
    remainingTablets: 15,
    estimatedRefillDate: "2026-08-05",
    status: "Warning"
  },
  {
    id: "ref-8",
    patientId: "pat-7",
    patientName: "Kamala Krishnan",
    medicineId: "med-7-1",
    medicineName: "Gabapentin",
    dosage: "100mg",
    remainingTablets: 45,
    estimatedRefillDate: "2026-09-04",
    status: "Safe"
  }
];
