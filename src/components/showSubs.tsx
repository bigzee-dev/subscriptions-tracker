import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionCard } from "./subscriptionCard";
import { Subscription } from "../lib/types";

interface ShowSubscriptionsProps {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function ShowSubscriptions(props: ShowSubscriptionsProps) {
  const { subscriptions, loading, error, onRefresh } = props;

  // For display, use getNextDueDate(subscription.payment_due_day)
  // const formatDate = (date: Date) => date.toLocaleDateString("en-GB");

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

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  const subscriptionsWithDueDay = subscriptions.map((sub) => ({
    ...sub,
    payment_due_day: new Date(sub.payment_due_date).getDate(),
  }));

  const sortedSubscriptions = [...subscriptionsWithDueDay].sort((a, b) => {
    const aDue = getNextDueDate(a.payment_due_day);
    const bDue = getNextDueDate(b.payment_due_day);

    return aDue.getTime() - bDue.getTime();
  });

  function handleSubscriptionDeleted() {
    console.log("Subscription deleted, refreshing list...");
    onRefresh();
  }

  const NoSubsFound = () => {
    if (!loading) {
      return (
        <Card>
          <CardContent className="p-4 text-center">
            <p>No subscriptions found.</p>
          </CardContent>
        </Card>
      );
    }
  };
  return (
    <div className="flex flex-col items-center font-sans px-4">
      {sortedSubscriptions.length > 0 ? (
        <div className="w-full space-y-5">
          {sortedSubscriptions.map((subscription) => {
            console.log(subscription);
            return (
              // <Card key={subscription.id} className="rounded-2xl">
              //   <CardContent className="font-sans grid grid-cols-3 gap-2 pt-1 px-3">
              //     <div className="flex items-center font-medium text-left">
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
              //   <div className="flex justify-between p-3">
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
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                handleSubscriptionDeleted={handleSubscriptionDeleted}
              />
            );
          })}
        </div>
      ) : (
        <NoSubsFound />
      )}
      {loading && (
        <Card>
          <CardContent className="p-4 text-center">
            <p>Loading subscriptions...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-4 text-center text-red-500">
            <p>Error: {error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
