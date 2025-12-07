"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark";
import { useMemo } from "react";

export const CounterStats = () => {
  const {
    data: events,
    isLoading,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
    blockData: false,
    transactionData: false,
    receiptData: false,
  });

  const stats = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalChanges: 0,
        increases: 0,
        decreases: 0,
        resets: 0,
        sets: 0,
        uniqueCallers: 0,
      };
    }

    const increases = events.filter((e) => {
      const reason = e.parsedArgs?.reason;
      if (typeof reason === "string") return reason === "Increase";
      if (typeof reason === "object" && reason) {
        return Object.keys(reason).includes("Increase");
      }
      return false;
    }).length;

    const decreases = events.filter((e) => {
      const reason = e.parsedArgs?.reason;
      if (typeof reason === "string") return reason === "Decrease";
      if (typeof reason === "object" && reason) {
        return Object.keys(reason).includes("Decrease");
      }
      return false;
    }).length;

    const resets = events.filter((e) => {
      const reason = e.parsedArgs?.reason;
      if (typeof reason === "string") return reason === "Reset";
      if (typeof reason === "object" && reason) {
        return Object.keys(reason).includes("Reset");
      }
      return false;
    }).length;

    const sets = events.filter((e) => {
      const reason = e.parsedArgs?.reason;
      if (typeof reason === "string") return reason === "Set";
      if (typeof reason === "object" && reason) {
        return Object.keys(reason).includes("Set");
      }
      return false;
    }).length;

    const uniqueCallers = new Set(
      events
        .map((e) => e.parsedArgs?.caller?.toString())
        .filter((c) => c !== undefined),
    ).size;

    return {
      totalChanges: events.length,
      increases,
      decreases,
      resets,
      sets,
      uniqueCallers,
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-base-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-bold mb-4">Counter Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Total Changes</div>
            <div className="text-2xl font-bold">{stats.totalChanges}</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Increases</div>
            <div className="text-2xl font-bold text-success">{stats.increases}</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Decreases</div>
            <div className="text-2xl font-bold text-warning">{stats.decreases}</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Resets</div>
            <div className="text-2xl font-bold text-error">{stats.resets}</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Sets</div>
            <div className="text-2xl font-bold text-info">{stats.sets}</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="text-sm text-base-content/60">Unique Users</div>
            <div className="text-2xl font-bold">{stats.uniqueCallers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

