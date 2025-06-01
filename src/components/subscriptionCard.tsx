import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar, CreditCard, Edit, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  payment_due_date: string;
  payment_due_day: number;
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

// Helper to get next due date for a subscription
function getNextDueDate(payment_due_day: number) {
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

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "active":
//       return "bg-green-100 text-green-800 hover:bg-green-100";
//     case "pending":
//       return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
//     case "cancelled":
//       return "bg-red-100 text-red-800 hover:bg-red-100";
//     default:
//       return "bg-gray-100 text-gray-800 hover:bg-gray-100";
//   }
// };

export const SubscriptionCard = ({
  subscription,
  handleSubscriptionDeleted,
}: {
  subscription: SubscriptionCardProps;
  handleSubscriptionDeleted: () => void;
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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

  return (
    // <Card key={subscription.id} className="border border-gray-400 rounded-2xl">
    //   <CardContent className="font-sans grid grid-cols-4 gap-2 pt-1 px-3">
    //     <div className="flex items-center font-medium text-left">
    //       {logoUrl ? (
    //         <img
    //           src={logoUrl}
    //           alt={`${subscription.service_name} logo`}
    //           className="w-6 h-6 mr-2"
    //         />
    //       ) : (
    //         <div className="w-6 h-6 mr-2">
    //           <CiGlobe className="text-gray-600" size="1.4em" />
    //         </div>
    //       )}
    //       {subscription.service_name}
    //     </div>
    //     <span className="flex items-center text-sm text-gray-700 font-medium">
    //       P{subscription.amount.toFixed(2)}
    //     </span>
    //     <div className="flex items-center text-sm text-gray-700 font-medium">
    //       {formatDate(getNextDueDate(subscription.payment_due_day))}
    //     </div>
    //     <div className="flex items-center text-sm">
    //       {subscription.payment_method}
    //     </div>
    //   </CardContent>
    //   <div className="flex justify-between">
    //     <EditSubscription
    //       subscription={subscription}
    //       onClose={handleSubscriptionDeleted}
    //     />
    //     <DeleteSubscription
    //       subscriptionId={subscription.id}
    //       subscriptionName={subscription.service_name}
    //       deletesub={handleSubscriptionDeleted}
    //     />
    //   </div>
    // </Card>
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex gap-x-2 items-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${subscription.service_name} logo`}
              className="w-6 h-6 mr-1"
            />
          ) : (
            <div className="w-6 h-6 mr-1 flex items-center justify-center">
              <CiGlobe className="text-gray-600" size="1.4em" />
            </div>
          )}
          <h3 className="font-semibold text-base">
            {subscription.service_name}
          </h3>
          {/* <Badge variant="secondary" className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge> */}
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
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="font-semibold text-lg">
            P {subscription.amount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Due Date</span>
          </div>
          <span className="text-sm font-medium">
            {formatDate(getNextDueDate(subscription.payment_due_day))}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Payment Method
            </span>
          </div>
          <span className="text-sm font-medium">
            {subscription.payment_method}
          </span>
        </div>

        <div className="flex space-x-2 pt-1">
          {/* <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 text-xs">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 text-red-600 hover:text-red-700 text-xs"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button> */}
          <EditSubscription
            subscription={subscription}
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
