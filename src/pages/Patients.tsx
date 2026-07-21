import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, SlidersHorizontal, Globe } from "lucide-react";

import { usePatients } from "../context/PatientContext";
import { useToast } from "../components/Toast";
import PatientCard from "../components/patients/PatientCard";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import ConfirmModal from "../components/common/ConfirmModal";
import Button from "../components/Button";

export default function Patients() {
  const { patients, deletePatient } = usePatients();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Extract unique languages for filter dropdown
  const languagesList = ["All", ...Array.from(new Set(patients.map((p) => p.language).filter(Boolean)))];

  // Filtering Logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search);
    
    const matchesLang = langFilter === "All" || patient.language === langFilter;

    return matchesSearch && matchesLang;
  });

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deletePatient(deleteId);
        addToast("Patient profile deleted successfully.", "success");
      } catch (err) {
        addToast("Failed to delete patient.", "danger");
      } finally {
        setDeleteId(null);
        setIsDeleteModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            Patients Registry
          </h1>
          <p className="text-sm text-text-secondary font-semibold">
            Manage patient demographic logs, contacts, and active medicine schedules.
          </p>
        </div>

        <Link to="/patients/add" className="self-start sm:self-auto">
          <Button id="add-patient-registry-btn" variant="primary" className="gap-2">
            <UserPlus className="w-4.5 h-4.5" />
            <span>Add Patient</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filters Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white border border-brand-border p-4 rounded-card shadow-xs">
        <SearchBar
          id="patients-registry-search"
          value={search}
          onChange={setSearch}
          placeholder="Search patients by name, ID, or phone number..."
          className="flex-1 max-w-full lg:max-w-md"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <select
              id="lang-filter-select"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="h-[40px] pl-9 pr-8 bg-gray-50 border border-brand-border rounded-input text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all cursor-pointer appearance-none"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary pointer-events-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-t-text-secondary border-x-4 border-x-transparent" />
          </div>
        </div>
      </div>

      {/* Grid of Patient Cards or Empty State */}
      {filteredPatients.length === 0 ? (
        <div className="py-12">
          <EmptyState
            id="patients-empty-state"
            title={patients.length === 0 ? "No Patients Registered yet" : "No Match Found"}
            description={
              patients.length === 0 
                ? "Click the button below to register your first patient and begin managing their medications." 
                : "No patients matched your search criteria. Try removing some filters or search query."
            }
            actionText={patients.length === 0 ? "Register Patient" : "Reset Filters"}
            onAction={
              patients.length === 0 
                ? () => {} // Handled by Link above or button click
                : () => { setSearch(""); setLangFilter("All"); }
            }
            icon={<Users className="w-8 h-8 text-primary" />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="w-full">
              <PatientCard
                patient={patient}
                onDeleteClick={handleDeleteClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Deletion Confirm Modal */}
      <ConfirmModal
        id="delete-patient-modal"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Patient Record"
        message="Are you sure you want to delete this patient profile? All active medication lists and future scheduled reminders for this patient will be deleted immediately."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
