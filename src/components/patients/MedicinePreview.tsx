import React from "react";
import { Pill, Clock, Calendar, Edit, Trash2, AlertCircle, Package } from "lucide-react";
import Card from "../Card";
import Badge from "../common/Badge";
import Button from "../Button";
import { Medicine } from "../../mock/mockPatients";

interface MedicinePreviewProps {
  medicines: Medicine[];
  onEditMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
}

export default function MedicinePreview({
  medicines,
  onEditMedicine,
  onDeleteMedicine,
}: MedicinePreviewProps) {
  if (!medicines || medicines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 rounded-card bg-gray-50/50 gap-4 w-full">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
          <Pill className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-text-primary text-base">No Scheduled Medications</h4>
          <p className="text-xs text-text-secondary mt-1">
            Click "Add Medicine" to configure medication schedules and reminder alerts.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeType = (status: Medicine["status"]) => {
    switch (status) {
      case "Active":
        return "success";
      case "Refill Soon":
        return "warning";
      case "Expired":
        return "danger";
      default:
        return "gray";
    }
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "Ongoing";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {medicines.map((med) => {
        const tabletsPerDose = med.tabletsPerDose || 1;
        const totalStock = med.totalStock || med.quantity || 0;
        const reminderTimes = med.times && med.times.length > 0 ? med.times : ["08:00 AM"];

        return (
          <div key={med.id} className="w-full flex">
            <Card
              id={`medicine-preview-card-${med.id}`}
              hoverable
              className={`p-5 border-gray-100/90 hover:border-blue-200 transition-all flex flex-col justify-between text-left gap-4.5 relative overflow-hidden w-full bg-white shadow-sm ${
                med.status === "Refill Soon" ? "bg-amber-50/10" : ""
              }`}
            >
              {/* Top Row: Name & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      med.status === "Expired"
                        ? "bg-red-50 text-danger"
                        : med.status === "Refill Soon"
                        ? "bg-amber-50 text-warning"
                        : "bg-blue-50 text-primary"
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-text-primary text-base tracking-tight truncate">
                      {med.name}
                    </h4>
                    <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-0.5">
                      {med.dosage}
                    </span>
                  </div>
                </div>

                <Badge type={getStatusBadgeType(med.status)}>{med.status}</Badge>
              </div>

              {/* Medicine Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-gray-100 py-3 bg-gray-50/50 px-3.5 rounded-input">
                {/* Dose Amount */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                    Dose Intake
                  </span>
                  <span className="text-text-primary font-extrabold">
                    {tabletsPerDose} {tabletsPerDose === 1 ? "tablet" : "tablets"} per dose
                  </span>
                </div>

                {/* Stock Remaining */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <Package className="w-3 h-3 text-text-secondary" />
                    Total Stock
                  </span>
                  <span className={`font-extrabold ${totalStock <= 10 ? "text-danger" : "text-text-primary"}`}>
                    {totalStock} tablets
                  </span>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-0.5 col-span-2 pt-1 border-t border-gray-100/70">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-text-secondary" />
                    Duration
                  </span>
                  <span className="text-text-primary font-bold">
                    {formatDateDisplay(med.startDate)} — {formatDateDisplay(med.endDate)}
                  </span>
                </div>
              </div>

              {/* Reminder Timings List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  Reminder Times
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reminderTimes.map((time, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md tracking-tight flex items-center gap-1"
                    >
                      <span>{time}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning */}
              {totalStock <= 10 && med.status !== "Expired" && (
                <div className="flex items-center gap-2 text-warning text-xs font-semibold bg-amber-50 border border-amber-200 p-2.5 rounded-input">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span className="text-amber-800">Stock running low! Schedule refill.</span>
                </div>
              )}

              {/* Actions: Edit & Delete */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-50">
                <Button
                  id={`med-edit-btn-${med.id}`}
                  variant="outline"
                  onClick={() => onEditMedicine(med)}
                  className="h-[34px] px-3 gap-1.5 text-xs font-semibold border-gray-200 hover:border-blue-300 text-text-primary"
                >
                  <Edit className="w-3.5 h-3.5 text-text-secondary" />
                  <span>Edit</span>
                </Button>
                <Button
                  id={`med-delete-btn-${med.id}`}
                  variant="outline"
                  onClick={() => onDeleteMedicine(med.id)}
                  className="h-[34px] px-3 gap-1.5 text-xs font-semibold border-gray-200 hover:border-red-300 hover:bg-red-50 text-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
