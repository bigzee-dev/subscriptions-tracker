import React from "react";
import { Subscription } from "../lib/types";

interface StatsProps {
  subscriptions: Subscription[];
}

export const Stats: React.FC<StatsProps> = ({ subscriptions }) => {
  // Compute the average monthly amount by converting each subscription
  // to its monthly equivalent based on its payment cycle.
  const monthsInCycle = (cycle: Subscription["payment_cycle"]) => {
    switch (cycle) {
      case "monthly":
        return 1;
      case "quarterly":
        return 3;
      case "semi-annual":
        return 6;
      case "annual":
        return 12;
      default:
        return 1;
    }
  };

  const avgMonthlyAmount = subscriptions.reduce((sum, sub) => {
    const months = monthsInCycle(
      sub.payment_cycle as Subscription["payment_cycle"]
    );
    return sum + sub.amount / months;
  }, 0);

  return (
    <div className="w-full max-w-lg mx-auto p-2 rounded-lg bg-white shadow flex flex-col items-start">
      <span className="mb-1 text-[12px] font-normal text-neutral-500">
        {subscriptions.length} subscriptions
      </span>

      <div className="text-sm font-semibold text-neutral-900">
        Avg Monthly P {avgMonthlyAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default Stats;
