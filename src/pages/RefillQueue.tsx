import React, { useState, useEffect } from "react";
import { RefreshCw, Search, Check, AlertTriangle, Pill, ChevronRight, SlidersHorizontal, Eye, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "../components/Toast";
import SearchBar from "../components/common/SearchBar";
import Badge from "../components/common/Badge";
import Button from "../components/Button";
import EmptyState from "../components/common/EmptyState";
import { Refill } from "../mock/mockRefills";
import refillService from "../services/refillService";

export default function RefillQueue() {
  const { addToast } = useToast();
  const [refills, setRefills] = useState<Refill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadRefills = async () => {
    setIsLoading(true);
    try {
      const data = await refillService.getRefills();
      setRefills(data);
    } catch (err) {
      addToast("Failed to load medication stocks.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRefills();
  }, []);

  const handleRefillAction = async (id: string, currentQty: number) => {
    try {
      // Add standard batch of 30 tablets on refill logging
      const newQty = currentQty + 30;
      const updated = await refillService.updateRefillQuantity(id, newQty);
      
      setRefills((prev) => prev.map((r) => (r.id === id ? updated : r)));
      addToast(`Logged 30 Tablets refill order for ${updated.medicineName}. Stock reset to Safe.`, "success");
    } catch (err) {
      addToast("Failed to process refill order.", "danger");
    }
  };

  // Filter Logic
  const filteredRefills = refills.filter((r) => {
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
            Medication Refill Queue
          </h1>
          <p className="text-sm text-text-secondary font-semibold">
            Track patient-specific tablet stocks, low alerts, and log shipment updates.
          </p>
        </div>

        <Button
          id="refresh-refills-btn"
          variant="outline"
          onClick={loadRefills}
          className="gap-2 h-[42px] border-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Reload Stock</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white border border-brand-border p-4 rounded-card shadow-xs">
        <SearchBar
          id="refill-queue-search"
          value={search}
          onChange={setSearch}
          placeholder="Search by patient name or medication..."
          className="flex-1 max-w-full lg:max-w-md"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Severity:</span>
          </div>

          <div className="relative">
            <select
              id="refill-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-gray-50 border border-brand-border rounded-input text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all cursor-pointer appearance-none"
            >
              <option value="All">All Stocks</option>
              <option value="Critical">Critical (≤ 5 Tablets)</option>
              <option value="Warning">Warning (6-15 Tablets)</option>
              <option value="Safe">Safe (&gt; 15 Tablets)</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-t-text-secondary border-x-4 border-x-transparent" />
          </div>
        </div>
      </div>

      {/* Main Refill Table list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-secondary font-semibold">Synchronizing Stocks...</span>
        </div>
      ) : filteredRefills.length === 0 ? (
        <div className="py-8">
          <EmptyState
            id="refills-empty-state"
            title="All Stocks Secured"
            description="No medications matched your filter parameters. All patient stocks are currently loaded and secure."
            actionText="Clear Search Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            icon={<Pill className="w-8 h-8 text-primary" />}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* Column Header Headers on Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100/60 border border-brand-border rounded-input text-xs font-bold text-text-secondary uppercase tracking-wider text-left">
            <div className="col-span-3">Patient Name</div>
            <div className="col-span-3">Medication & Strength</div>
            <div className="col-span-2">Remaining Stock</div>
            <div className="col-span-2">Est. Refill Date</div>
            <div className="col-span-2 text-right">Inventory Order</div>
          </div>

          {/* List Cards */}
          <div className="flex flex-col gap-3">
            {filteredRefills.map((ref) => {
              const statusLabel = ref.status;
              
              return (
                <div
                  key={ref.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 bg-white border border-brand-border rounded-card hover:shadow-soft transition-all text-left ${
                    ref.status === "Critical" 
                      ? "bg-red-50/10 border-red-100" 
                      : ref.status === "Warning"
                      ? "bg-amber-50/5"
                      : ""
                  }`}
                >
                  {/* Patient Info */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                    <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      ref.status === "Critical"
                        ? "bg-red-50 text-danger border border-red-100"
                        : ref.status === "Warning"
                        ? "bg-amber-50 text-warning border border-amber-100"
                        : "bg-green-50 text-success border border-green-100"
                    }`}>
                      <Pill className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text-primary truncate">
                        {ref.patientName}
                      </p>
                      <Link 
                        to={`/patients/${ref.patientId}`} 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-0.5"
                      >
                        <span>View Profile</span>
                        <Eye className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Medicine and strength */}
                  <div className="col-span-1 md:col-span-3">
                    <p className="text-[14px] font-bold text-text-primary truncate">
                      {ref.medicineName}
                    </p>
                    <span className="text-xs text-text-secondary font-semibold">
                      Dose Strength: {ref.dosage}
                    </span>
                  </div>

                  {/* Remaining Stock with progress indicator */}
                  <div className="col-span-1 md:col-span-2 flex items-center md:flex-col md:items-start gap-4 md:gap-1.5">
                    <Badge type={statusLabel}>{statusLabel}</Badge>
                    <span className="text-xs font-bold text-text-primary leading-tight">
                      {ref.remainingTablets} Tablets left
                    </span>
                  </div>

                  {/* Estimated Refill Date */}
                  <div className="col-span-1 md:col-span-2 text-sm font-semibold text-text-primary">
                    <span className="md:hidden text-text-secondary text-xs block mb-0.5 font-bold uppercase">Refill Est:</span>
                    {ref.estimatedRefillDate}
                  </div>

                  {/* Orders logging button */}
                  <div className="col-span-1 md:col-span-2 flex justify-end">
                    <Button
                      id={`refill-action-btn-${ref.id}`}
                      variant={ref.status === "Critical" ? "primary" : "outline"}
                      onClick={() => handleRefillAction(ref.id, ref.remainingTablets)}
                      className="h-[36px] px-3 gap-1.5 text-xs font-bold border-gray-200"
                    >
                      <PackagePlus className="w-4 h-4" />
                      <span>Refill Order</span>
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
