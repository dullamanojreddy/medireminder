import React, { useState, useEffect } from "react";
import { Clock, SlidersHorizontal, Eye, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "../components/Toast";
import SearchBar from "../components/common/SearchBar";
import Badge from "../components/common/Badge";
import Button from "../components/Button";
import EmptyState from "../components/common/EmptyState";
import { Reminder } from "../mock/mockReminders";
import reminderService from "../services/reminderService";

export default function ReminderQueue() {
  const { addToast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const data = await reminderService.getReminders();
      // Sort today's reminders first or keep chronological list
      setReminders(data);
    } catch (err) {
      addToast("Failed to load reminder logs.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  // Filter Logic
  const filteredReminders = reminders.filter((r) => {
    const matchesSearch = 
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.medicineName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            Medicine Reminder Queue
          </h1>
          <p className="text-sm text-text-secondary font-semibold">
            Track real-time patient reminders, alarm attempts, and snooze cycles.
          </p>
        </div>

        <Button
          id="refresh-queue-btn"
          variant="outline"
          onClick={loadReminders}
          className="gap-2 h-[42px] border-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Reload Queue</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white border border-brand-border p-4 rounded-card shadow-xs">
        <SearchBar
          id="reminder-queue-search"
          value={search}
          onChange={setSearch}
          placeholder="Search by patient name or medication..."
          className="flex-1 max-w-full lg:max-w-md"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Status:</span>
          </div>

          <div className="relative">
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-gray-50 border border-brand-border rounded-input text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all cursor-pointer appearance-none"
            >
              <option value="All">All Alarms</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Snoozed">Snoozed</option>
              <option value="Expired">Expired (Missed)</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-t-text-secondary border-x-4 border-x-transparent" />
          </div>
        </div>
      </div>

      {/* Main Queue List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-secondary font-semibold">Synchronizing Alarms...</span>
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="py-8">
          <EmptyState
            id="reminders-empty-state"
            title="No Alarms Found"
            description="No medicine reminders found for your active criteria. Refresh the queue or edit filters."
            actionText="Clear Search Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            icon={<Clock className="w-8 h-8 text-primary" />}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* Column Header Headers on Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100/60 border border-brand-border rounded-input text-xs font-bold text-text-secondary uppercase tracking-wider text-left">
            <div className="col-span-2">Scheduled Time</div>
            <div className="col-span-3">Patient Name</div>
            <div className="col-span-4">Medication Details</div>
            <div className="col-span-3">Alarm Attempts</div>
          </div>

          {/* List Cards */}
          <div className="flex flex-col gap-3">
            {filteredReminders.map((r) => (
                <div
                  key={r.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 bg-white border border-brand-border rounded-card hover:shadow-soft transition-all text-left ${
                    r.status === "Expired" 
                      ? "bg-red-50/10 border-red-100" 
                      : r.status === "Completed"
                      ? "bg-green-50/5"
                      : ""
                  }`}
                >
                  {/* Scheduled Time */}
                  <div className="col-span-1 md:col-span-2 flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      r.status === "Completed"
                        ? "bg-green-50 text-success"
                        : r.status === "Expired"
                        ? "bg-red-50 text-danger"
                        : "bg-blue-50 text-primary animate-pulse"
                    }`}>
                      <Clock className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-sm font-extrabold text-text-primary tracking-wide">
                      {r.time}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="col-span-1 md:col-span-3">
                    <p className="text-[15px] font-bold text-text-primary truncate">
                      {r.patientName}
                    </p>
                    <Link 
                      to={`/patients/${r.patientId}`} 
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-0.5"
                    >
                      <span>View Profile</span>
                      <Eye className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Medication Details */}
                  <div className="col-span-1 md:col-span-4">
                    <p className="text-[14px] font-bold text-text-primary truncate">
                      {r.medicineName}
                    </p>
                    <span className="text-xs text-text-secondary font-semibold">
                      Date Scheduled: {r.date}
                    </span>
                  </div>

                  {/* Attempt Logs & Status Badge */}
                  <div className="col-span-1 md:col-span-3 flex items-center md:flex-col md:items-start gap-4 md:gap-1.5">
                    <Badge type={r.status}>{r.status}</Badge>
                    <span className="text-xs font-semibold text-text-secondary leading-tight">
                      Alert Attempts: <span className="font-bold text-text-primary">{r.attempt}</span>
                    </span>
                  </div>

                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
