import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar, CreditCard, Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RiExternalLinkFill } from "react-icons/ri";
import { PaymentMethod } from "../lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
import EditSubscription from "./editSub";
import DeleteSubscription from "./deleteSub";
import { CiGlobe } from "react-icons/ci";

interface SubscriptionCardProps {
  id: string;
  user_id: string;
  service_name: string;
  amount: number;
  payment_cycle: string;
  payment_due_date: string;
  payment_due_day: number;
  payment_next_due_date?: string;
  payment_method: string;
  created_at: string;
}

const getLogoUrl = async (serviceName: string) => {
  try {
    const response = await axios.get(
      `https://logo.clearbit.com/${serviceName}.com`
    );
    return response.config.url;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
};

// For display, use getNextDueDate(subscription.payment_due_day)
const formatDate = (date: Date) => date.toLocaleDateString("en-GB");

// Helper to get next due date for a subscription.
// If payment_next_due_date is provided (ISO string), prefer it.
function getNextDueDate(
  payment_due_day: number,
  payment_next_due_date?: string
) {
  if (payment_next_due_date) return new Date(payment_next_due_date);

  const now = new Date();
  // Set to midnight to ignore time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = today.getFullYear();
  const month = today.getMonth();

  // Try to create a date for this month
  let dueDate = new Date(year, month, payment_due_day);

  // If due date has already passed, move to next month
  if (dueDate < today) {
    // Handle months with fewer days (e.g., Feb 30th becomes Mar 2nd)
    dueDate = new Date(year, month + 1, payment_due_day);
  }

  return dueDate;
}

const getDaysLeft = (
  payment_due_day: number,
  payment_next_due_date?: string
) => {
  const today = new Date();
  const nextDue = getNextDueDate(payment_due_day, payment_next_due_date);
  // Calculate difference in milliseconds, then convert to days
  const diffTime = nextDue.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const SubscriptionCard = ({
  subscription,
  paymentMethods,
  handleSubscriptionDeleted,
}: {
  subscription: SubscriptionCardProps;
  paymentMethods?: PaymentMethod[];
  handleSubscriptionDeleted: () => void;
}) => {
  console.log("SubscriptionCard paymentMethods:", paymentMethods);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Calculate days left — prefer computed next due date
  const daysLeft = getDaysLeft(
    subscription.payment_due_day,
    subscription.payment_next_due_date
  );

  const handleClick = () => {
    return "";
  };

  useEffect(() => {
    const fetchLogo = async () => {
      const url = await getLogoUrl(subscription.service_name);
      setLogoUrl(url ?? null);
    };

    fetchLogo();
  }, [subscription.service_name]);

  const infoBox = "flex flex-col items-start gap-y-2 max-w-max ";

  return (
    <Card className="w-full col-span-1 border border-neutral-400">
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-1">
        <div className="flex gap-x-1.5 items-center ">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${subscription.service_name} logo`}
              className="w-6 h-6 mr-1"
            />
          ) : (
            <div className="w-6 h-6 mr-1 flex items-center justify-center">
              <CiGlobe className="text-neutral-600" size="1.4em" />
            </div>
          )}
          <h3 className="font-semibold text-base">
            {subscription.service_name}
          </h3>
          <span className="absolute left-1/2 -translate-x-1/2">
            <RiExternalLinkFill size="1.2em" />
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClick} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-x-4 mt-1">
          <span className="capitalize text-xs text-neutral-800 font-medium">
            {subscription.payment_cycle}
          </span>
          <div className="flex items-center">
            {daysLeft === 0 ? (
              <span className="text-xs font-semibold text-red-600">
                Payment due today
              </span>
            ) : (
              <span className="text-xs font-normal text-neutral-800">
                ({daysLeft} days left)
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className={infoBox}>
            <div className="flex items-center space-x-2 text-neutral-600">
              <Calendar className="h-4 w-4 " />
              <span className="text-xs">Amount</span>
            </div>
            <span className="font-medium text-sm text-neutral-900">
              P {subscription.amount.toFixed(2)}
            </span>
          </div>

          <div className={infoBox}>
            <div className="flex items-center space-x-2 text-neutral-600">
              <Calendar className="h-4 w-4 " />
              <span className="text-xs">Due Date</span>
            </div>
            <span className="text-sm font-medium text-neutral-900">
              {formatDate(
                getNextDueDate(
                  subscription.payment_due_day,
                  subscription.payment_next_due_date
                )
              )}
            </span>
          </div>

          <div className={infoBox}>
            <div className="flex items-center space-x-2 text-neutral-600">
              <CreditCard className="h-4 w-4 " />
              <span className="text-xs">Method</span>
            </div>
            <span className="text-sm font-medium text-neutral-900">
              {subscription.payment_method}
            </span>
          </div>
        </div>

        <div className="flex space-x-2 pt-1">
          <EditSubscription
            subscription={subscription}
            paymentMethods={paymentMethods}
            onClose={handleSubscriptionDeleted}
          />
          <DeleteSubscription
            subscriptionId={subscription.id}
            subscriptionName={subscription.service_name}
            deletesub={handleSubscriptionDeleted}
          />
        </div>
      </CardContent>
    </Card>
  );
};
