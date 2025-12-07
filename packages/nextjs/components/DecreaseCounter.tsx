"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

type DecreaseCounterProps = {
  counter: number;
};

export const DecreaseCounter = ({ counter }: DecreaseCounterProps) => {
  const { address: connectedAddress } = useAccount();
  const { sendAsync: decreaseCounter, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "decrease_counter",
  });

  const handleDecrease = async () => {
    if (!connectedAddress) {
      return;
    }
    try {
      await decreaseCounter();
    } catch (error) {
      console.error("Error decreasing counter:", error);
    }
  };

  const isDisabled = isPending || !connectedAddress || counter === 0;

  return (
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleDecrease}
      disabled={isDisabled}
      title={counter === 0 ? "Counter cannot be negative" : ""}
    >
      {isPending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Decreasing...
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
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Decrease
        </>
      )}
    </button>
  );
};

