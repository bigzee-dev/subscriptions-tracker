import React from "react";
import { Subscription } from "../lib/types";

interface StatsProps {
  subscriptions: Subscription[];
}

export const Stats: React.FC<StatsProps> = ({ subscriptions }) => {
  // Sum up the total amount for all subscriptions
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="w-full max-w-lg mx-auto p-2 rounded-lg bg-white shadow flex flex-col items-start">
      <span className="mb-1 text-[12px] font-normal text-neutral-500">
        {subscriptions.length} subscriptions
      </span>

      <div className="text-sm font-semibold text-neutral-900">
        P {totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default Stats;
