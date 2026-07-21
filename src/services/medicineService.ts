import api from "./api";
import { Medicine } from "../mock/mockPatients";
import { mapMedicine } from "./patientService";

export const medicineService = {
  createMedicine: async (patientId: string, medData: Omit<Medicine, "id">): Promise<Medicine> => {
    const response = await api.post("/medicines", {
      patientId,
      medicineName: medData.name,
      dosage: medData.dosage,
      tabletsPerDose: Number(medData.tabletsPerDose || 1),
      totalStock: Number(medData.totalStock || medData.quantity || 30),
      quantity: Number(medData.totalStock || medData.quantity || 30),
      times: medData.times,
      timings: medData.timings,
      startDate: medData.startDate,
      endDate: medData.endDate || "",
      status: medData.status ? medData.status.toUpperCase() : "ACTIVE"
    });

    return mapMedicine(response.data?.data);
  },

  updateMedicine: async (patientId: string, medicineId: string, updatedFields: Partial<Medicine>): Promise<Medicine> => {
    const payload: any = {};
    if (updatedFields.name) payload.medicineName = updatedFields.name;
    if (updatedFields.dosage) payload.dosage = updatedFields.dosage;
    if (updatedFields.tabletsPerDose !== undefined) payload.tabletsPerDose = Number(updatedFields.tabletsPerDose);
    if (updatedFields.totalStock !== undefined || updatedFields.quantity !== undefined) {
      const stock = Number(updatedFields.totalStock !== undefined ? updatedFields.totalStock : updatedFields.quantity);
      payload.totalStock = stock;
      payload.quantity = stock;
    }
    if (updatedFields.times) payload.times = updatedFields.times;
    if (updatedFields.timings) payload.timings = updatedFields.timings;
    if (updatedFields.startDate) payload.startDate = updatedFields.startDate;
    if (updatedFields.endDate !== undefined) payload.endDate = updatedFields.endDate || "";
    if (updatedFields.status) payload.status = updatedFields.status.toUpperCase();

    const response = await api.put(`/medicines/${medicineId}`, payload);
    return mapMedicine(response.data?.data);
  },

  patchMedicine: async (medicineId: string, fields: Partial<Medicine>): Promise<Medicine> => {
    const payload: any = {};
    if (fields.name) payload.medicineName = fields.name;
    if (fields.dosage) payload.dosage = fields.dosage;
    if (fields.tabletsPerDose !== undefined) payload.tabletsPerDose = Number(fields.tabletsPerDose);
    if (fields.totalStock !== undefined || fields.quantity !== undefined) {
      const stock = Number(fields.totalStock !== undefined ? fields.totalStock : fields.quantity);
      payload.totalStock = stock;
      payload.quantity = stock;
    }
    if (fields.times) payload.times = fields.times;
    if (fields.timings) payload.timings = fields.timings;
    if (fields.startDate) payload.startDate = fields.startDate;
    if (fields.endDate !== undefined) payload.endDate = fields.endDate || "";
    if (fields.status) payload.status = fields.status.toUpperCase();

    const response = await api.patch(`/medicines/${medicineId}`, payload);
    return mapMedicine(response.data?.data);
  },

  deleteMedicine: async (patientId: string, medicineId: string): Promise<void> => {
    await api.delete(`/medicines/${medicineId}`);
  },

  getAdherenceHistory: async (patientId: string): Promise<any[]> => {
    const response = await api.get(`/patients/${patientId}/adherence`);
    return response.data?.data || [];
  },

  logIntakeStatus: async (patientId: string, logData: { medicineId: string; medicineName?: string; date: string; time: string; status: 'taken' | 'missed' | 'snoozed' }): Promise<any> => {
    const response = await api.post(`/patients/${patientId}/logs`, logData);
    return response.data?.data;
  }
};

export default medicineService;
