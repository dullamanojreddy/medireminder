import React from "react";
import { CheckCircle2, Clock, Pill } from "lucide-react";
import Card from "../Card";
import Button from "../Button";
import { MedicationLogEntry, Medicine } from "../../mock/mockPatients";

interface MedicationLogTableProps {
  logs: MedicationLogEntry[];
  medicines: Medicine[];
  onUpdateStatus: (logData: {
    medicineId: string;
    medicineName: string;
    date: string;
    time: string;
    status: "taken" | "snoozed";
  }) => void;
}

export default function MedicationLogTable({
  logs,
  medicines,
  onUpdateStatus,
}: MedicationLogTableProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Helper to format date display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card id="medication-history-card" className="border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-text-primary text-base tracking-tight">
              Record Today's Intake
            </h3>
            <p className="text-xs text-text-secondary font-medium">
              Mark each scheduled medicine as taken or snoozed
            </p>
          </div>
        </div>
      </div>

      {medicines.length > 0 && (
        <div className="bg-gray-50/70 border border-gray-200/80 p-4 rounded-input flex flex-col gap-3">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-blue-500" />
            <span>Record Today's Intake ({formatDate(todayStr)})</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {medicines.map((med) => {
              const defaultTime = med.times && med.times.length > 0 ? med.times[0] : "08:00 AM";
              const existingTodayLog = logs.find(
                (l) => l.medicineId === med.id && l.date === todayStr
              );
              const currentStatus = existingTodayLog?.status;

              return (
                <div
                  key={med.id}
                  className="bg-white border border-gray-200 p-3 rounded-md flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-text-primary truncate">
                      {med.name} ({med.dosage})
                    </div>
                    <div className="text-[11px] text-text-secondary font-medium">
                      Scheduled: {defaultTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      id={`mark-taken-btn-${med.id}`}
                      variant="outline"
                      onClick={() =>
                        onUpdateStatus({
                          medicineId: med.id,
                          medicineName: med.name,
                          date: todayStr,
                          time: defaultTime,
                          status: "taken",
                        })
                      }
                      className={`h-[30px] px-2 text-[11px] font-extrabold gap-1 border transition-all ${
                        currentStatus === "taken"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Taken</span>
                    </Button>

                    <Button
                      id={`mark-snoozed-btn-${med.id}`}
                      variant="outline"
                      onClick={() =>
                        onUpdateStatus({
                          medicineId: med.id,
                          medicineName: med.name,
                          date: todayStr,
                          time: defaultTime,
                          status: "snoozed",
                        })
                      }
                      className={`h-[30px] px-2 text-[11px] font-extrabold gap-1 border transition-all ${
                        currentStatus === "snoozed"
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Snooze</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
