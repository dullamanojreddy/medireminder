import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, Medicine } from "../mock/mockPatients";
import patientService from "../services/patientService";
import medicineService from "../services/medicineService";

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => Promise<Patient>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  addMedicine: (patientId: string, medicine: Omit<Medicine, "id">) => Promise<Medicine>;
  updateMedicine: (patientId: string, medicineId: string, medicine: Partial<Medicine>) => Promise<Medicine>;
  deleteMedicine: (patientId: string, medicineId: string) => Promise<void>;
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);

  const refreshPatients = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const apiPatients = await patientService.getPatients();
        setPatients(apiPatients);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      }
    }
  };

  // Load from backend on mount if authorized
  useEffect(() => {
    refreshPatients();
  }, []);

  const addPatient = async (patientData: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
    const created = await patientService.createPatient(patientData);
    setPatients((prev) => [created, ...prev]);
    return created;
  };

  const updatePatient = async (id: string, updatedFields: Partial<Patient>): Promise<Patient> => {
    const updated = await patientService.updatePatient(id, updatedFields);
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...updated, medicines: p.medicines } : p)));
    return updated;
  };

  const deletePatient = async (id: string): Promise<void> => {
    await patientService.deletePatient(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const addMedicine = async (patientId: string, medData: Omit<Medicine, "id">): Promise<Medicine> => {
    const created = await medicineService.createMedicine(patientId, medData);
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            medicines: [...p.medicines, created],
          };
        }
        return p;
      })
    );
    return created;
  };

  const updateMedicine = async (
    patientId: string,
    medicineId: string,
    updatedFields: Partial<Medicine>
  ): Promise<Medicine> => {
    const updated = await medicineService.updateMedicine(patientId, medicineId, updatedFields);
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            medicines: p.medicines.map((m) => (m.id === medicineId ? updated : m)),
          };
        }
        return p;
      })
    );
    return updated;
  };

  const deleteMedicine = async (patientId: string, medicineId: string): Promise<void> => {
    await medicineService.deleteMedicine(patientId, medicineId);
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            medicines: p.medicines.filter((m) => m.id !== medicineId),
          };
        }
        return p;
      })
    );
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        refreshPatients
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}
