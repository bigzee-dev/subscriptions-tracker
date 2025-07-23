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
      <h2 className="text-xs font-medium mb-1 text-neutral-600">
        Monthly Spend
      </h2>
      <div className="text-sm font-semibold text-neutral-900">
        P {totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default Stats;
