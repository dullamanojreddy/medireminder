import api from "./api";
import { Patient, Medicine } from "../mock/mockPatients";

export const mapPatient = (p: any): Patient => ({
  id: p._id || p.id,
  name: p.name,
  dob: p.dob,
  gender: p.gender,
  phone: p.phone,
  language: p.preferredLanguage || p.language || "English",
  emergencyContact: p.emergencyContactName || p.emergencyContact || "",
  relationship: p.relationship || "",
  createdAt: p.createdAt,
  medicines: []
});

export const mapMedicine = (m: any): Medicine => {
  let displayStatus: Medicine["status"] = "Active";
  const statusUpper = (m.status || "").toUpperCase();
  if (statusUpper === "EXPIRED") {
    displayStatus = "Expired";
  } else if (statusUpper === "REFILL SOON" || (m.remainingQuantity !== undefined && m.remainingQuantity <= 5)) {
    displayStatus = "Refill Soon";
  }

  const timesArray = m.times && m.times.length > 0 ? m.times : [];
  const rawTimings = m.timings && m.timings.length > 0
    ? m.timings.map((t: any) => typeof t === "string" ? { time: t, enabled: true } : { time: t.time, enabled: t.enabled !== false })
    : timesArray.map((t: string) => ({ time: t, enabled: true }));

  return {
    id: m._id || m.id,
    name: m.medicineName || m.name,
    dosage: m.dosage,
    tabletsPerDose: m.tabletsPerDose || 1,
    totalStock: m.totalStock || m.quantity || 30,
    quantity: m.quantity || 30,
    times: timesArray,
    timings: rawTimings,
    startDate: m.startDate,
    endDate: m.endDate || "",
    status: displayStatus
  };
};

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const response = await api.get("/patients?limit=100");
    const backendItems = response.data?.data?.items || [];
    
    // For each patient, load their medicines to match frontend's nested structure
    const mappedPatients = await Promise.all(
      backendItems.map(async (p: any) => {
        const patient = mapPatient(p);
        try {
          const medsRes = await api.get(`/medicines?patientId=${patient.id}&limit=100`);
          const meds = medsRes.data?.data?.items || [];
          patient.medicines = meds.map(mapMedicine);
        } catch (err) {
          patient.medicines = [];
        }
        return patient;
      })
    );

    return mappedPatients;
  },

  getPatientById: async (id: string): Promise<Patient | undefined> => {
    const response = await api.get(`/patients/${id}`);
    const data = response.data?.data;
    if (!data) return undefined;

    const patient = mapPatient(data);
    try {
      const medsRes = await api.get(`/medicines?patientId=${patient.id}&limit=100`);
      const meds = medsRes.data?.data?.items || [];
      patient.medicines = meds.map(mapMedicine);
    } catch (err) {
      patient.medicines = [];
    }

    return patient;
  },

  createPatient: async (patient: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
    const response = await api.post("/patients", {
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      preferredLanguage: patient.language,
      emergencyContactName: patient.emergencyContact,
      relationship: patient.relationship
    });

    return mapPatient(response.data?.data);
  },

  updatePatient: async (id: string, updatedFields: Partial<Patient>): Promise<Patient> => {
    const payload: any = {};
    if (updatedFields.name) payload.name = updatedFields.name;
    if (updatedFields.dob) payload.dob = updatedFields.dob;
    if (updatedFields.gender) payload.gender = updatedFields.gender;
    if (updatedFields.phone) payload.phone = updatedFields.phone;
    if (updatedFields.language) payload.preferredLanguage = updatedFields.language;
    if (updatedFields.emergencyContact) payload.emergencyContactName = updatedFields.emergencyContact;
    if (updatedFields.relationship) payload.relationship = updatedFields.relationship;

    const response = await api.put(`/patients/${id}`, payload);
    return mapPatient(response.data?.data);
  },

  deletePatient: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  }
};

export default patientService;
