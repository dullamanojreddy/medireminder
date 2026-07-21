import React from "react";
import Card from "../Card";

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBgClass?: string;
}

export default function StatCard({
  id,
  title,
  value,
  description,
  icon,
  iconBgClass = "bg-blue-50 text-primary",
}: StatCardProps) {
  return (
    <Card id={id} hoverable className="p-6 border-gray-100 hover:border-blue-100 transition-all flex items-center justify-between">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[13px] font-bold text-text-secondary uppercase tracking-wider">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-text-primary tracking-tight">
          {value}
        </span>
        <span className="text-xs text-text-secondary font-medium">
          {description}
        </span>
      </div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgClass}`}>
        {icon}
      </div>
    </Card>
  );
}
