"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

export const IncreaseCounter = () => {
  const { address: connectedAddress } = useAccount();
  const { sendAsync: increaseCounter, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "increase_counter",
  });

  const handleIncrease = async () => {
    if (!connectedAddress) {
      return;
    }
    try {
      await increaseCounter();
    } catch (error) {
      console.error("Error increasing counter:", error);
    }
  };

  return (
    <button
      className="btn btn-primary btn-lg"
      onClick={handleIncrease}
      disabled={isPending || !connectedAddress}
    >
      {isPending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Increasing...
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
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Increase
        </>
      )}
    </button>
  );
};
