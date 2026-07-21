import React from "react";
import { Link } from "react-router-dom";
import { Phone, Globe, Pill, Eye, Edit2, Trash2 } from "lucide-react";
import Card from "../Card";
import Badge from "../common/Badge";
import Button from "../Button";
import { Patient } from "../../mock/mockPatients";

interface PatientCardProps {
  patient: Patient;
  onDeleteClick: (patientId: string) => void;
}

export default function PatientCard({ patient, onDeleteClick }: PatientCardProps) {
  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const age = calculateAge(patient.dob);
  const medCount = patient.medicines ? patient.medicines.length : 0;

  return (
    <Card id={`patient-card-${patient.id}`} hoverable className="p-6 border-gray-100 hover:border-blue-100 transition-all flex flex-col justify-between h-full text-left gap-6">
      <div className="flex items-start gap-4">
        {/* Patient Letter Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-extrabold text-lg tracking-wider border border-blue-100">
          {getInitials(patient.name)}
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-text-primary tracking-tight truncate">
            {patient.name}
          </h3>
          <span className="text-sm font-semibold text-text-secondary">
            {age} Years • {patient.gender}
          </span>
        </div>
      </div>

      {/* Patient Specific Information */}
      <div className="flex flex-col gap-2.5 text-sm font-medium border-t border-b border-brand-border py-4">
        <div className="flex items-center gap-2.5 text-text-primary">
          <Phone className="w-4 h-4 text-text-secondary" />
          <span>+91 {patient.phone}</span>
        </div>
        
        <div className="flex items-center gap-2.5 text-text-primary">
          <Globe className="w-4 h-4 text-text-secondary" />
          <span className="mr-1">Preferred:</span>
          <Badge type="primary">{patient.language}</Badge>
        </div>

        <div className="flex items-center gap-2.5 text-text-primary">
          <Pill className="w-4 h-4 text-text-secondary" />
          <span>Medicines Tracking:</span>
          <Badge type={medCount > 0 ? "success" : "gray"}>
            {medCount} {medCount === 1 ? "Medicine" : "Medicines"}
          </Badge>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Link to={`/patients/${patient.id}`} className="w-full">
          <Button
            id={`patient-card-view-${patient.id}`}
            variant="secondary"
            fullWidth
            className="h-[40px] px-2 gap-1.5 text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-text-secondary" />
            <span>View</span>
          </Button>
        </Link>

        <Link to={`/patients/${patient.id}/edit`} className="w-full">
          <Button
            id={`patient-card-edit-${patient.id}`}
            variant="outline"
            fullWidth
            className="h-[40px] px-2 gap-1.5 text-xs border-gray-200 hover:border-blue-300"
          >
            <Edit2 className="w-3.5 h-3.5 text-text-secondary" />
            <span>Edit</span>
          </Button>
        </Link>

        <Button
          id={`patient-card-delete-${patient.id}`}
          variant="outline"
          onClick={() => onDeleteClick(patient.id)}
          className="h-[40px] px-2 gap-1.5 text-xs border-gray-200 hover:border-red-300 hover:bg-red-50 text-danger"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </Button>
      </div>
    </Card>
  );
}
