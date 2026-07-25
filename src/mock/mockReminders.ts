export interface Reminder {
  id: string;
  patientId: string;
  patientName: string; // for easier join
  medicineId: string;
  medicineName: string; // for easier join
  time: string; // e.g. "08:00 AM" or ISO string
  date: string; // e.g. "2026-07-21"
  scheduledTime: string; // ISO date string
  attempt: number;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'SNOOZED' | 'COMPLETED' | 'EXPIRED';
}

// Mock data removed in production cleanup. Real data is fetched from the API.
