import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, Pill } from "lucide-react";

import { usePatients } from "../context/PatientContext";
import { useToast } from "../components/Toast";
import PatientInfo from "../components/patients/PatientInfo";
import MedicinePreview from "../components/patients/MedicinePreview";
import MedicineModal from "../components/patients/MedicineModal";
import AdherenceGraph from "../components/patients/AdherenceGraph";
import ConfirmModal from "../components/common/ConfirmModal";
import Button from "../components/Button";
import { Medicine, MedicationLogEntry } from "../mock/mockPatients";
import medicineService from "../services/medicineService";

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const { patients, addMedicine, updateMedicine, deleteMedicine } = usePatients();
  const { addToast } = useToast();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Adherence history logs state
  const [adherenceLogs, setAdherenceLogs] = useState<MedicationLogEntry[]>([]);

  // Modal control states
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const [isDeleteMedModalOpen, setIsDeleteMedModalOpen] = useState(false);
  const [deleteMedId, setDeleteMedId] = useState<string | null>(null);

  // Load adherence history from backend
  const fetchAdherenceLogs = useCallback(async (patientId: string) => {
    try {
      const logs = await medicineService.getAdherenceHistory(patientId);
      setAdherenceLogs(logs || []);
    } catch (err) {
      console.error("Failed to load adherence history:", err);
    }
  }, []);

  // Sync current patient and load adherence history
  useEffect(() => {
    if (patients.length > 0) {
      const found = patients.find((p) => p.id === id);
      if (found) {
        setPatient(found);
        if (id) {
          fetchAdherenceLogs(id);
        }
      } else {
        setPatient(null);
      }
      setLoading(false);
    }
  }, [id, patients, fetchAdherenceLogs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-secondary font-semibold">Loading Patient Demographics & Trackers...</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Patient Profile Not Found</h2>
        <p className="text-text-secondary max-w-md">The patient profile you are looking for does not exist or has been removed.</p>
        <Link to="/patients">
          <Button id="patient-details-notfound-back" variant="primary">Return to Registry</Button>
        </Link>
      </div>
    );
  }

  // Handle Add / Edit Medicine Save
  const handleSaveMedicine = async (medData: Omit<Medicine, "id"> & { id?: string }) => {
    if (!id) return;

    try {
      if (medData.id) {
        // Edit flow
        const updated = await updateMedicine(id, medData.id, {
          name: medData.name,
          dosage: medData.dosage,
          tabletsPerDose: medData.tabletsPerDose,
          totalStock: medData.totalStock,
          quantity: medData.totalStock || medData.quantity,
          times: medData.times,
          timings: medData.timings,
          startDate: medData.startDate,
          endDate: medData.endDate,
          status: medData.status,
        });
        addToast(`${updated.name} updated successfully.`, "success");
      } else {
        // Add flow
        const created = await addMedicine(id, medData);
        addToast(`${created.name} added to schedule successfully.`, "success");
      }
      fetchAdherenceLogs(id);
    } catch (err) {
      addToast("Failed to save medicine information.", "danger");
    } finally {
      setSelectedMedicine(null);
    }
  };

  // Trigger Delete flow
  const handleDeleteMedClick = (medId: string) => {
    setDeleteMedId(medId);
    setIsDeleteMedModalOpen(true);
  };

  const handleConfirmDeleteMedicine = async () => {
    if (id && deleteMedId) {
      try {
        await deleteMedicine(id, deleteMedId);
        addToast("Medicine deleted from schedule.", "success");
        fetchAdherenceLogs(id);
      } catch (err) {
        addToast("Failed to delete medicine.", "danger");
      } finally {
        setDeleteMedId(null);
        setIsDeleteMedModalOpen(false);
      }
    }
  };

  const handleEditMedClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsMedModalOpen(true);
  };

  const handleAddMedClick = () => {
    setSelectedMedicine(null);
    setIsMedModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-7xl mx-auto pb-12">
      {/* 1. Patient Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-5">
        <div>
          <Link 
            to="/patients" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patients Registry</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                {patient.name}
              </h1>
              <span className="text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md">
                Active Tracking
              </span>
            </div>
            <p className="text-xs md:text-sm text-text-secondary font-semibold">
              Patient ID: <span className="font-mono text-text-primary">{patient.id}</span> • Healthcare Monitoring Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/patients/${patient.id}/edit`}>
              <Button id="edit-patient-profile-btn" variant="outline" className="border-gray-200 text-xs font-bold">
                Edit Profile
              </Button>
            </Link>
            <Button
              id="add-medicine-profile-btn"
              variant="primary"
              onClick={handleAddMedClick}
              className="gap-2 text-xs font-extrabold shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Medicine</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Patient Information */}
      <PatientInfo patient={patient} />

      {/* 3. Medicine Tracking */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-text-primary text-base tracking-tight">
                Scheduled Medications
              </h3>
              <p className="text-xs text-text-secondary font-semibold">
                Tracked dosage schedules and remaining stocks
              </p>
            </div>
          </div>

          <Button
            id="inline-add-med-btn"
            variant="outline"
            onClick={handleAddMedClick}
            className="h-[34px] text-xs font-semibold border-blue-200 hover:border-blue-300 text-primary self-start sm:self-center"
          >
            Add Medicine
          </Button>
        </div>

        <MedicinePreview
          medicines={patient.medicines || []}
          onEditMedicine={handleEditMedClick}
          onDeleteMedicine={handleDeleteMedClick}
        />
      </section>

      {/* 4. Medication Adherence Graph (LeetCode Style) */}
      <AdherenceGraph
        logs={adherenceLogs}
        patientName={patient.name}
        onboardingDate={patient.createdAt}
      />

      {/* Add / Edit Medicine Modal */}
      <MedicineModal
        id="medicine-action-modal"
        isOpen={isMedModalOpen}
        onClose={() => {
          setIsMedModalOpen(false);
          setSelectedMedicine(null);
        }}
        onSave={handleSaveMedicine}
        medicine={selectedMedicine}
      />

      {/* Delete Medicine Confirm Modal */}
      <ConfirmModal
        id="delete-medicine-modal"
        isOpen={isDeleteMedModalOpen}
        onClose={() => setIsDeleteMedModalOpen(false)}
        onConfirm={handleConfirmDeleteMedicine}
        title="Delete Scheduled Medicine"
        message="Are you sure you want to delete this medication schedule? All notification configurations and logs for this specific medicine will be removed from this patient's profile immediately."
      />
    </div>
  );
}
