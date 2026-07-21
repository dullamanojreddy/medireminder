import React, { useState, useEffect } from "react";
import { Pill, Plus, Trash2, PlusCircle, Save, Clock } from "lucide-react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { Medicine } from "../../mock/mockPatients";

interface MedicineModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (medData: Omit<Medicine, "id"> & { id?: string }) => void;
  medicine?: Medicine | null; // Null if adding, populated if editing
}

export default function MedicineModal({
  id,
  isOpen,
  onClose,
  onSave,
  medicine,
}: MedicineModalProps) {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    tabletsPerDose: 1,
    totalStock: 30,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Active" as Medicine["status"],
  });

  const [reminderTimes, setReminderTimes] = useState<string[]>(["08:00 AM"]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || "",
        dosage: medicine.dosage || "",
        tabletsPerDose: medicine.tabletsPerDose || 1,
        totalStock: medicine.totalStock || medicine.quantity || 30,
        startDate: medicine.startDate || new Date().toISOString().split("T")[0],
        endDate: medicine.endDate || "",
        status: medicine.status || "Active",
      });
      setReminderTimes(
        medicine.times && medicine.times.length > 0
          ? [...medicine.times]
          : ["08:00 AM"]
      );
    } else {
      const today = new Date().toISOString().split("T")[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      setForm({
        name: "",
        dosage: "",
        tabletsPerDose: 1,
        totalStock: 30,
        startDate: today,
        endDate: thirtyDaysLater,
        status: "Active",
      });
      setReminderTimes(["08:00 AM", "02:00 PM"]);
    }
    setErrors({});
  }, [medicine, isOpen]);

  const handleAddTime = () => {
    // Default time options based on existing array length
    const defaultSuggestions = ["08:00 AM", "02:00 PM", "09:00 PM", "07:00 AM", "06:00 PM"];
    const nextTime = defaultSuggestions[reminderTimes.length % defaultSuggestions.length] || "08:00 PM";
    setReminderTimes([...reminderTimes, nextTime]);
  };

  const handleRemoveTime = (index: number) => {
    if (reminderTimes.length <= 1) {
      setErrors((prev) => ({ ...prev, timings: "At least one reminder time is required." }));
      return;
    }
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, timings: "" }));
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...reminderTimes];
    updated[index] = value;
    setReminderTimes(updated);
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!form.name.trim()) tempErrors.name = "Medicine name is required.";
    if (!form.dosage.trim()) tempErrors.dosage = "Dosage / strength (e.g. 500mg) is required.";
    if (form.tabletsPerDose <= 0) tempErrors.tabletsPerDose = "Tablets per dose must be at least 1.";
    if (form.totalStock < 0) tempErrors.totalStock = "Stock cannot be negative.";
    if (!form.startDate) tempErrors.startDate = "Start date is required.";
    if (reminderTimes.length === 0 || reminderTimes.some((t) => !t.trim())) {
      tempErrors.timings = "Please provide valid reminder times.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: medicine?.id,
      name: form.name,
      dosage: form.dosage,
      tabletsPerDose: Number(form.tabletsPerDose),
      totalStock: Number(form.totalStock),
      quantity: Number(form.totalStock),
      times: reminderTimes,
      timings: reminderTimes.map((t) => ({ time: t, enabled: true })),
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
    });
    onClose();
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      title={medicine ? "Edit Medicine Details" : "Schedule New Medicine"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 text-left">
        {/* Medicine Name */}
        <Input
          id={`${id}-name`}
          name="medName"
          label="Medicine Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Paracetamol, Metformin"
          error={errors.name}
        />

        {/* Dosage & Tablets Per Dose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id={`${id}-dosage`}
            name="medDosage"
            label="Dosage / Strength"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            placeholder="e.g. 500mg, 10ml, 1 Puff"
            error={errors.dosage}
          />

          <Input
            id={`${id}-tablets-per-dose`}
            name="tabletsPerDose"
            label="Tablets per dose"
            type="number"
            value={String(form.tabletsPerDose)}
            onChange={(e) => setForm({ ...form, tabletsPerDose: Number(e.target.value) })}
            placeholder="e.g. 1"
            error={errors.tabletsPerDose}
          />
        </div>

        {/* Total Stock */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            id={`${id}-total-stock`}
            name="totalStock"
            label="Total Stock (Tablets Available)"
            type="number"
            value={String(form.totalStock)}
            onChange={(e) => setForm({ ...form, totalStock: Number(e.target.value) })}
            placeholder="e.g. 30"
            error={errors.totalStock}
          />
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id={`${id}-start-date`}
            name="startDate"
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            error={errors.startDate}
          />

          <Input
            id={`${id}-end-date`}
            name="endDate"
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        {/* Custom Reminder Times Section */}
        <div className="flex flex-col gap-2.5 bg-blue-50/40 p-4 rounded-input border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Reminder Times
              </span>
            </div>
            <button
              id={`${id}-add-time-btn`}
              type="button"
              onClick={handleAddTime}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-blue-700 bg-white border border-blue-200 px-3 py-1 rounded-md shadow-xs transition-all hover:border-blue-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Time</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {reminderTimes.map((timeVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  id={`${id}-time-input-${idx}`}
                  type="text"
                  value={timeVal}
                  onChange={(e) => handleTimeChange(idx, e.target.value)}
                  placeholder="e.g. 08:00 AM or 14:00"
                  className="flex-1 h-[42px] px-3.5 bg-white border border-brand-border rounded-input text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  id={`${id}-remove-time-btn-${idx}`}
                  type="button"
                  onClick={() => handleRemoveTime(idx)}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-input transition-colors"
                  title="Remove time"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {errors.timings && (
            <span className="text-xs text-danger font-medium mt-1">
              {errors.timings}
            </span>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 mt-3 border-t border-brand-border pt-4">
          <Button
            id={`${id}-cancel-btn`}
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id={`${id}-submit-btn`}
            type="submit"
            variant="primary"
            className="gap-2"
          >
            {medicine ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{medicine ? "Save Changes" : "Schedule Medicine"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
