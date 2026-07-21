import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../Button";
import { Patient } from "../../mock/mockPatients";

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatus = (patient: Patient) => {
    if (!patient.medicines || patient.medicines.length === 0) return "Inactive";
    const hasActive = patient.medicines.some((m) => m.status === "Active");
    const hasRefill = patient.medicines.some((m) => m.status === "Refill Soon");
    if (hasRefill) return "Refill Soon";
    if (hasActive) return "Active";
    return "Expired";
  };

  return (
    <div className="w-full overflow-x-auto rounded-card border border-brand-border bg-white shadow-soft">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-brand-border">
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Medicines
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Language
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {patients.map((patient) => {
            const status = getStatus(patient);
            const statusType = 
              status === "Active" ? "success" : 
              status === "Refill Soon" ? "warning" : 
              status === "Expired" ? "gray" : "gray";

            return (
              <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Patient Profile & Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-primary font-bold text-xs flex items-center justify-center border border-blue-100 flex-shrink-0">
                      {getInitials(patient.name)}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-text-primary leading-tight">
                        {patient.name}
                      </p>
                      <span className="text-xs text-text-secondary font-medium">
                        {patient.gender}
                      </span>
                    </div>
                  </div>
                </td>
                
                {/* Phone */}
                <td className="px-6 py-4 text-[14px] font-semibold text-text-primary">
                  +91 {patient.phone}
                </td>
                
                {/* Medicines */}
                <td className="px-6 py-4">
                  <Badge type={patient.medicines?.length > 0 ? "success" : "gray"}>
                    {patient.medicines?.length || 0} Meds
                  </Badge>
                </td>
                
                {/* Language */}
                <td className="px-6 py-4">
                  <Badge type="primary">{patient.language}</Badge>
                </td>
                
                {/* Status */}
                <td className="px-6 py-4">
                  <Badge type={statusType}>{status}</Badge>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <Link to={`/patients/${patient.id}`}>
                    <Button
                      id={`recent-view-btn-${patient.id}`}
                      variant="secondary"
                      className="h-[36px] px-3.5 gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
