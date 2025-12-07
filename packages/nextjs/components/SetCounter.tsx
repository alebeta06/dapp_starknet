"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { Address } from "./scaffold-stark";

type SetCounterProps = {
  connectedAddress: string;
  ownerAddress: string;
};

export const SetCounter = ({ connectedAddress, ownerAddress }: SetCounterProps) => {
  const { address } = useAccount();
  const [newValue, setNewValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { sendAsync: setCounter, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: newValue ? [parseInt(newValue)] : undefined,
  });

  // Check if connected address is the owner
  const isOwner = connectedAddress && ownerAddress && 
    connectedAddress.toLowerCase() === ownerAddress.toLowerCase();

  const handleSetCounter = async () => {
    if (!address || !isOwner) {
      setError("Only the owner can set the counter");
      return;
    }

    const value = parseInt(newValue);
    if (isNaN(value) || value < 0) {
      setError("Please enter a valid non-negative number");
      return;
    }

    setError("");
    try {
      await setCounter({ args: [value] });
      setNewValue(""); // Clear input on success
    } catch (error) {
      console.error("Error setting counter:", error);
      setError("Failed to set counter");
    }
  };

  // Don't show if user is not the owner
  if (!isOwner || !address) {
    return null;
  }

  return (
    <div className="card bg-base-200 shadow-lg border border-base-300 p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="badge badge-info">Owner Only</span>
        Set Counter Value
      </h3>
      
      <div className="flex flex-col gap-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text">New Counter Value</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Enter new value"
            className={`input input-bordered w-full ${error ? "input-error" : ""}`}
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setError("");
            }}
            disabled={isPending}
          />
          {error && (
            <label className="label">
              <span className="label-text-alt text-error">{error}</span>
            </label>
          )}
        </div>

        <button
          className="btn btn-info btn-lg"
          onClick={handleSetCounter}
          disabled={isPending || !newValue || isNaN(parseInt(newValue))}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Setting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Set Counter
            </>
          )}
        </button>

        <div className="text-xs text-base-content/60 mt-2">
          <p>Owner: <Address address={ownerAddress} format="short" /></p>
        </div>
      </div>
    </div>
  );
};

