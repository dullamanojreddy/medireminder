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

// Mock data removed in production cleanup. Real data is fetched from the API.
