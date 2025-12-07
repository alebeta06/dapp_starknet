"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark";

export const CounterDisplay = () => {
  const { data: counterData, isLoading } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
    watch: true,
  });

  const counter = counterData ? Number(counterData) : 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-6xl font-bold mb-2 transition-all duration-300">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {counter}
          </span>
        )}
      </div>
      <p className="text-sm text-base-content/60">Current Counter Value</p>
    </div>
  );
};


