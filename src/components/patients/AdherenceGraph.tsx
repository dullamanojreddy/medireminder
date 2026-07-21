import React, { useState } from "react";
import { Activity, Info } from "lucide-react";
import Card from "../Card";
import { MedicationLogEntry } from "../../mock/mockPatients";

interface AdherenceGraphProps {
  logs: MedicationLogEntry[];
  patientName?: string;
  onboardingDate?: string;
}

interface TooltipData {
  dateStr: string;
  formattedDate: string;
  entries: MedicationLogEntry[];
  dominantStatus: "taken" | "missed" | "snoozed" | "none";
}

export default function AdherenceGraph({ logs, patientName, onboardingDate }: AdherenceGraphProps) {
  const [activeTooltip, setActiveTooltip] = useState<{
    data: TooltipData;
    x: number;
    y: number;
  } | null>(null);

  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const addMonths = (date: Date, months: number) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  };

  const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Start from the exact patient onboarding date, then show at least four months.
  // For older patients, continue day-by-day through today like a contribution graph.
  const today = normalizeDate(new Date());
  const parsedOnboardingDate = onboardingDate ? new Date(onboardingDate) : new Date();
  const startDate = normalizeDate(
    isNaN(parsedOnboardingDate.getTime()) ? new Date() : parsedOnboardingDate
  );
  const minimumEndDate = normalizeDate(addMonths(startDate, 4));
  const endDate = today > minimumEndDate ? today : minimumEndDate;
  const days: { date: Date; dateStr: string }[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateObj = new Date(d);
    days.push({ date: dateObj, dateStr: toDateKey(dateObj) });
  }

  // Index logs by date string
  const logsByDate: Record<string, MedicationLogEntry[]> = {};
  logs.forEach((log) => {
    if (!logsByDate[log.date]) {
      logsByDate[log.date] = [];
    }
    logsByDate[log.date].push(log);
  });

  // Determine square color status for a date
  const getDayStatus = (dateStr: string): "taken" | "missed" | "snoozed" | "none" => {
    const dayLogs = logsByDate[dateStr];
    if (!dayLogs || dayLogs.length === 0) return "none";

    const hasMissed = dayLogs.some((l) => l.status === "missed");
    if (hasMissed) return "missed";

    const hasSnoozed = dayLogs.some((l) => l.status === "snoozed");
    if (hasSnoozed) return "snoozed";

    const hasTaken = dayLogs.some((l) => l.status === "taken");
    if (hasTaken) return "taken";

    return "none";
  };

  const getSquareColor = (status: "taken" | "missed" | "snoozed" | "none") => {
    switch (status) {
      case "taken":
        return "bg-emerald-500 hover:bg-emerald-600 border-emerald-600/20";
      case "missed":
        return "bg-red-500 hover:bg-red-600 border-red-600/20";
      case "snoozed":
        return "bg-amber-400 hover:bg-amber-500 border-amber-500/20";
      case "none":
      default:
        return "bg-gray-150 bg-gray-200/60 hover:bg-gray-300 border-gray-300/40";
    }
  };

  // Group days into columns of 7 (weeks)
  const weeks: { date: Date; dateStr: string }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels header
  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, colIdx) => {
    const firstDay = week[0].date;
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      const monthName = firstDay.toLocaleDateString("en-US", { month: "short" });
      monthLabels.push({ label: monthName, colIndex: colIdx });
      lastMonth = month;
    }
  });

  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSquareMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    dateObj: { date: Date; dateStr: string }
  ) => {
    const dayLogs = logsByDate[dateObj.dateStr] || [];
    const rect = e.currentTarget.getBoundingClientRect();
    const dominantStatus = getDayStatus(dateObj.dateStr);

    setActiveTooltip({
      data: {
        dateStr: dateObj.dateStr,
        formattedDate: formatDateLabel(dateObj.date),
        entries: dayLogs,
        dominantStatus,
      },
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <Card id="adherence-graph-card" className="border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-5 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-text-primary text-base tracking-tight">
              Medication Adherence History
            </h3>
            <p className="text-xs text-text-secondary font-medium">
              Daily intake contribution graph from onboarding
            </p>
          </div>
        </div>

        {/* Graph Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span>Taken</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
            <span>Snoozed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-red-500 inline-block" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-gray-200 inline-block" />
            <span>No Data</span>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin">
        <div className="min-w-max flex flex-col gap-2">
          {/* Month Headers */}
          <div className="flex text-[11px] text-text-secondary font-bold pl-8">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                style={{ marginLeft: idx === 0 ? `${m.colIndex * 18}px` : `${(m.colIndex - (monthLabels[idx - 1]?.colIndex || 0)) * 18 - 24}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Days of Week + Grid */}
          <div className="flex items-start gap-2">
            {/* Day Labels (Sun - Sat or Mon - Sun) */}
            <div className="flex flex-col gap-[3px] text-[10px] text-text-secondary font-semibold pt-0.5">
              <span className="h-3.5 leading-none">Mon</span>
              <span className="h-3.5 leading-none opacity-0">Tue</span>
              <span className="h-3.5 leading-none">Wed</span>
              <span className="h-3.5 leading-none opacity-0">Thu</span>
              <span className="h-3.5 leading-none">Fri</span>
              <span className="h-3.5 leading-none opacity-0">Sat</span>
              <span className="h-3.5 leading-none">Sun</span>
            </div>

            {/* Contribution Grid */}
            <div className="flex gap-[4.5px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[4.5px]">
                  {week.map((dayObj, dIdx) => {
                    const status = getDayStatus(dayObj.dateStr);
                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={(e) => handleSquareMouseEnter(e, dayObj)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className={`w-3.5 h-3.5 rounded-xs cursor-pointer border transition-all duration-150 transform hover:scale-125 hover:z-10 ${getSquareColor(
                          status
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {activeTooltip && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none max-w-xs border border-slate-700 font-sans"
          style={{ left: `${activeTooltip.x}px`, top: `${activeTooltip.y}px` }}
        >
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between gap-3">
            <span>{activeTooltip.data.formattedDate}</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
              {activeTooltip.data.dominantStatus}
            </span>
          </div>

          {activeTooltip.data.entries.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {activeTooltip.data.entries.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                  <span className="font-semibold text-slate-100">{entry.medicineName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{entry.time}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        entry.status === "taken"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : entry.status === "snoozed"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-red-950 text-red-300 border border-red-800"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic">No medicine scheduled / no logs for this date.</div>
          )}

          {/* Tooltip Tail Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-slate-900" />
        </div>
      )}
    </Card>
  );
}
