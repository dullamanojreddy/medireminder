import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { usePatients } from "../context/PatientContext";
import { useToast } from "../components/Toast";
import Badge from "../components/common/Badge";
import { Patient } from "../mock/mockPatients";
import { Reminder } from "../mock/mockReminders";
import reminderService from "../services/reminderService";

function StatSummaryCard({
  id,
  title,
  value,
  description,
  tone,
  icon,
}: {
  id: string;
  title: string;
  value: number;
  description: string;
  tone: "blue" | "amber" | "rose";
  icon: React.ReactNode;
}) {
  const toneClasses = {
    blue: "bg-blue-50/80 text-blue-600 border-blue-100",
    amber: "bg-amber-50/80 text-amber-600 border-amber-100",
    rose: "bg-rose-50/80 text-rose-600 border-rose-100",
  };

  return (
    <div
      id={id}
      className="bg-white rounded-2xl border border-slate-200/60 p-6 flex items-center justify-between shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-150"
    >
      <div className="space-y-1.5 pr-4">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <h2 className={`text-3xl font-bold tracking-tight ${tone === "rose" ? "text-rose-600" : "text-slate-900"}`}>
          {value}
        </h2>
        <p className="text-xs leading-snug text-slate-500 font-medium">
          {description}
        </p>
      </div>
      <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        {icon}
      </div>
    </div>
  );
}

function getPatientStatus(patient: Patient) {
  if (!patient.medicines || patient.medicines.length === 0) return "Inactive";
  if (patient.medicines.some((medicine) => medicine.status === "Refill Soon")) return "Refill Soon";
  if (patient.medicines.some((medicine) => medicine.status === "Active")) return "Active";
  return "Expired";
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function PatientInitial({ name }: { name: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100 shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Dashboard() {
  const { patients } = usePatients();
  const { addToast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    let active = true;

    async function fetchReminders() {
      try {
        const reminderItems = await reminderService.getReminders();
        if (active) {
          setReminders(reminderItems.filter((reminder) => reminder.date === getTodayKey()));
        }
      } catch (err) {
        if (active) {
          addToast("Failed to load reminder stats.", "danger");
        }
      }
    }

    fetchReminders();
    return () => {
      active = false;
    };
  }, [addToast]);

  const todayKey = getTodayKey();
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const newOnboardsToday = patients.filter((patient) => patient.createdAt?.slice(0, 10) === todayKey).length;
  const failedReminders = reminders.filter((reminder) => reminder.status === "Expired").length;

  return (
    <div className="space-y-8 text-left">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Caregiver Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, edit, and log medication tasks for all assigned patients.
          </p>
        </div>

        <Link
          to="/patients/add"
          id="dashboard-add-patient-btn"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-150 self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Patient</span>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatSummaryCard
          id="stat-card-total-patients"
          title="Total Patients"
          value={patients.length}
          description="Total number of patients assigned to this caregiver."
          tone="blue"
          icon={<Users className="h-5 w-5" />}
        />
        <StatSummaryCard
          id="stat-card-new-onboards"
          title="New Onboards Today"
          value={newOnboardsToday}
          description="Number of new patients added today."
          tone="amber"
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatSummaryCard
          id="stat-card-failed-reminders"
          title="Failed Reminders"
          value={failedReminders}
          description="Number of medicine reminders that failed to send today."
          tone="rose"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Recently Logged Patients
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Quick summary of your assigned profiles
            </p>
          </div>

          <Link
            to="/patients"
            id="dash-view-all-patients-btn"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Patients</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                {["Patient", "Phone", "Medicines", "Language", "Status", "Action"].map((heading) => (
                  <th
                    key={heading}
                    className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${
                      heading === "Action" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Users className="w-9 h-9" />
                      <p className="text-base font-semibold">No patients registered yet.</p>
                      <Link
                        to="/patients/add"
                        className="mt-1 inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        Add Patient
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                recentPatients.map((patient) => {
                  const status = getPatientStatus(patient);
                  const statusType =
                    status === "Active" ? "success" :
                    status === "Refill Soon" ? "warning" :
                    status === "Expired" ? "gray" : "gray";

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <PatientInitial name={patient.name} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                              {patient.name}
                            </p>
                            <span className="text-xs text-slate-400 font-medium">
                              {patient.gender}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 tracking-wider">
                        +91&nbsp;&nbsp;{patient.phone}
                      </td>
                      <td className="px-6 py-4">
                        <Badge type={patient.medicines?.length > 0 ? "success" : "gray"} className="text-xs px-2.5 py-0.5">
                          {patient.medicines?.length || 0} Meds
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge type="primary" className="text-xs px-2.5 py-0.5">
                          {patient.language}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge type={statusType} className="text-xs px-2.5 py-0.5">
                          {status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/patients/${patient.id}`}
                          id={`recent-view-btn-${patient.id}`}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
