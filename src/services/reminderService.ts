import api from "./api";
import { Reminder } from "../mock/mockReminders";

export const mapReminder = (r: any): any => {
  const patient = r.patientId || {};
  const medicine = r.medicineId || {};
  
  // Format scheduled time to 12h format for display, e.g., "08:00 AM"
  let displayTime = "08:00 AM";
  let displayDate = "2026-07-21";
  if (r.scheduledTime) {
    const d = new Date(r.scheduledTime);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    displayTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    
    // Extrapolate date in local timezone format
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    displayDate = `${d.getFullYear()}-${month}-${day}`;
  }

  let displayStatus: Reminder["status"] = "Pending";
  const statusUpper = (r.status || "").toUpperCase();
  if (statusUpper === "COMPLETED" || statusUpper === "TAKEN") {
    displayStatus = "Completed";
  } else if (statusUpper === "SNOOZED") {
    displayStatus = "Snoozed";
  } else if (statusUpper === "EXPIRED" || statusUpper === "MISSED") {
    displayStatus = "Expired";
  }

  return {
    id: r._id || r.id,
    patientId: patient._id || patient.id || "",
    patientName: patient.name || "Unknown Patient",
    medicineId: medicine._id || medicine.id || "",
    medicineName: medicine.medicineName || "Unknown Medicine",
    dosage: medicine.dosage || "",
    time: displayTime,
    scheduledTime: displayTime,
    date: displayDate,
    status: displayStatus,
    phone: patient.phone || "",
    language: patient.preferredLanguage || "English",
    attempt: r.attempt || 1,
  };
};

export const reminderService = {
  getReminders: async (): Promise<Reminder[]> => {
    // Fetch top 100 reminders to cover all daily logs
    const response = await api.get("/reminders?limit=100");
    const backendItems = response.data?.data?.items || [];
    return backendItems.map(mapReminder);
  },

  updateReminderStatus: async (id: string, status: Reminder["status"]): Promise<Reminder> => {
    // Translate client statuses to backend actions:
    // Taken/Completed -> COMPLETED, Snoozed -> SNOOZED, Missed -> EXPIRED
    let action = "EXPIRED";
    const statusUpper = (status || "").toUpperCase();
    if (statusUpper === "TAKEN" || statusUpper === "COMPLETED") {
      action = "COMPLETED";
    } else if (statusUpper === "SNOOZED") {
      action = "SNOOZED";
    }

    const response = await api.put(`/reminders/${id}/action`, { action });
    return mapReminder(response.data?.data);
  }
};

export default reminderService;
