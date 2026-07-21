import api from "./api";
import { Refill } from "../mock/mockRefills";

export const mapRefill = (r: any): Refill => {
  const patient = r.patientId || {};
  const medicine = r.medicineId || {};
  
  let formattedDate = "";
  if (r.estimatedRefillDate) {
    formattedDate = new Date(r.estimatedRefillDate).toISOString().split("T")[0];
  }

  let displayStatus: Refill["status"] = "Safe";
  const statusUpper = (r.status || "").toUpperCase();
  if (statusUpper === "CRITICAL") {
    displayStatus = "Critical";
  } else if (statusUpper === "WARNING") {
    displayStatus = "Warning";
  }

  return {
    id: r._id || r.id,
    patientId: patient._id || patient.id || "",
    patientName: patient.name || "Unknown Patient",
    medicineId: medicine._id || medicine.id || "",
    medicineName: medicine.medicineName || "Unknown Medicine",
    dosage: medicine.dosage || "",
    remainingTablets: r.remainingQuantity !== undefined ? r.remainingQuantity : (medicine.remainingQuantity || 0),
    estimatedRefillDate: formattedDate,
    status: displayStatus,
  };
};

export const refillService = {
  getRefills: async (): Promise<Refill[]> => {
    const response = await api.get("/refills?limit=100");
    const backendItems = response.data?.data?.items || [];
    return backendItems.map(mapRefill);
  },

  updateRefillQuantity: async (id: string, newQuantity: number): Promise<Refill> => {
    // Standard refill logging added quantity is usually 30
    const quantityAdded = 30;
    const response = await api.put(`/refills/${id}`, { quantity: quantityAdded });
    return mapRefill(response.data?.data);
  }
};

export default refillService;
