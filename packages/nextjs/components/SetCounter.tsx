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
  // Normalize addresses for comparison (handle both string and bigint formats)
  // Starknet addresses are 251 bits, so we need to pad to 64 hex characters (without 0x)
  const normalizeAddress = (addr: string | bigint | undefined | null): string => {
    if (!addr) return "";
    // Convert bigint to hex string if needed
    let addrStr: string;
    if (typeof addr === "bigint") {
      // Convert to hex and pad to 64 characters (Starknet address length)
      const hexStr = addr.toString(16);
      addrStr = `0x${hexStr.padStart(64, "0")}`;
    } else {
      addrStr = String(addr);
    }
    // Normalize: ensure 0x prefix, convert to lowercase, remove leading zeros after 0x
    if (!addrStr.startsWith("0x")) {
      addrStr = `0x${addrStr}`;
    }
    addrStr = addrStr.toLowerCase();
    // Remove 0x, pad to 64 chars, then add 0x back
    const hexPart = addrStr.replace(/^0x/, "").padStart(64, "0");
    return `0x${hexPart}`;
  };

  const isOwner = connectedAddress && ownerAddress && 
    normalizeAddress(connectedAddress) === normalizeAddress(ownerAddress);

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

  // Show component but disable if not owner
  if (!address) {
    return (
      <div className="card bg-base-200 shadow-lg border border-base-300 p-6">
        <div className="alert alert-warning">
          <span>Please connect your wallet to use this feature</span>
        </div>
      </div>
    );
  }

  if (!ownerAddress) {
    return (
      <div className="card bg-base-200 shadow-lg border border-base-300 p-6">
        <div className="alert alert-warning">
          <span>Loading owner information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-lg border border-base-300 p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="badge badge-info">Owner Only</span>
        Set Counter Value
      </h3>
      
      {!isOwner && (
        <div className="alert alert-error mb-4">
          <span>
            Only the contract owner can set the counter value.
            <br />
            <span className="text-xs mt-1 block">
              Connected: {connectedAddress ? normalizeAddress(connectedAddress) : "N/A"}
              <br />
              Owner: {normalizeAddress(ownerAddress)}
            </span>
          </span>
        </div>
      )}
      
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
          disabled={isPending || !newValue || isNaN(parseInt(newValue)) || !isOwner}
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
          <div>Owner: <Address address={ownerAddress} format="short" /></div>
        </div>
      </div>
    </div>
  );
};

