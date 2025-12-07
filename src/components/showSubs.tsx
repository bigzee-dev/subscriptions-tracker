import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionCard } from "./subscription-card";
import { Subscription } from "../lib/types";
import { PaymentMethod } from "../lib/types";

interface ShowSubscriptionsProps {
  subscriptions: Subscription[];
  paymentMethods?: PaymentMethod[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function ShowSubscriptions(props: ShowSubscriptionsProps) {
  const { subscriptions, paymentMethods, loading, error, onRefresh } = props;

  // For display, use getNextDueDate(subscription.payment_due_day)
  // const formatDate = (date: Date) => date.toLocaleDateString("en-GB");

  // Helper to get next due date for a subscription
  // Compute the next due date for any subscription based on its initial payment_due_date and payment_cycle
  function getNextDueDateForSubscription(sub: Subscription) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const init = new Date(sub.payment_due_date);
    const initDay = init.getDate();
    const initMonth = init.getMonth();
    const initYear = init.getFullYear();

    const cycleToMonths: Record<string, number> = {
      monthly: 1,
      quarterly: 3,
      "semi-annual": 6,
      annual: 12,
    };

    const cycleMonths = cycleToMonths[sub.payment_cycle] ?? 1;

    // Number of months difference between the initial date and today
    const diffMonths =
      (today.getFullYear() - initYear) * 12 + (today.getMonth() - initMonth);

    // Find the smallest k >= 0 such that init month + k*cycleMonths yields a date >= today
    let k = Math.floor(diffMonths / cycleMonths);
    if (k < 0) k = 0;

    let candidate = new Date(initYear, initMonth + k * cycleMonths, initDay);

    // If candidate is before today, step forward until it's >= today
    while (candidate < today) {
      k += 1;
      candidate = new Date(initYear, initMonth + k * cycleMonths, initDay);
    }

    return candidate;
  }

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // Compute next due date for each subscription and attach it for sorting and display
  const subsWithNextDue = subscriptions.map((sub) => {
    const nextDue = getNextDueDateForSubscription(sub);
    return {
      ...sub,
      payment_due_day: new Date(sub.payment_due_date).getDate(),
      payment_next_due_date: nextDue.toISOString(),
    } as Subscription & {
      payment_due_day: number;
      payment_next_due_date: string;
    };
  });

  // Upcoming = within the next 30 days (including today)
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  cutoff.setDate(cutoff.getDate() + 30);

  const upcoming = subsWithNextDue
    .filter((s) => new Date(s.payment_next_due_date) <= cutoff)
    .sort(
      (a, b) =>
        new Date(a.payment_next_due_date).getTime() -
        new Date(b.payment_next_due_date).getTime()
    );

  // Remaining groups: quarterly, semi-annual, annual (exclude any already in upcoming)
  const notUpcoming = subsWithNextDue.filter(
    (s) => !upcoming.some((u) => u.id === s.id)
  );

  const quarterly = notUpcoming
    .filter((s) => s.payment_cycle === "quarterly")
    .sort(
      (a, b) =>
        new Date(a.payment_next_due_date).getTime() -
        new Date(b.payment_next_due_date).getTime()
    );

  const semiAnnual = notUpcoming
    .filter((s) => s.payment_cycle === "semi-annual")
    .sort(
      (a, b) =>
        new Date(a.payment_next_due_date).getTime() -
        new Date(b.payment_next_due_date).getTime()
    );

  const annual = notUpcoming
    .filter((s) => s.payment_cycle === "annual")
    .sort(
      (a, b) =>
        new Date(a.payment_next_due_date).getTime() -
        new Date(b.payment_next_due_date).getTime()
    );

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
    <div className="flex  flex-col items-center font-sans px-6 space-y-6 ">
      {upcoming.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold">Upcoming (next 30 days)</h2>
          <div className="grid grid-cols-2 justify-center w-full gap-6">
            {upcoming.map((subscription) => {
              return (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={{
                    ...subscription,
                    payment_next_due_date: subscription.payment_next_due_date,
                  }}
                  paymentMethods={paymentMethods}
                  handleSubscriptionDeleted={handleSubscriptionDeleted}
                />
              );
            })}
          </div>
        </>
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
      {/* Other cycles */}
      {quarterly.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Quarterly</h2>
          <div className="grid grid-cols-2 justify-center gap-6 w-full mt-6">
            {quarterly.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                paymentMethods={paymentMethods}
                handleSubscriptionDeleted={handleSubscriptionDeleted}
              />
            ))}
          </div>
        </>
      )}

      {semiAnnual.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Semi-Annual</h2>
          <div className="grid grid-cols-2  justify-center gap-6 w-full mt-6">
            {semiAnnual.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                paymentMethods={paymentMethods}
                handleSubscriptionDeleted={handleSubscriptionDeleted}
              />
            ))}
          </div>
        </>
      )}

      {annual.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Annual</h2>
          <div className="grid grid-cols-2  justify-center gap-6 w-full mt-6">
            {annual.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                paymentMethods={paymentMethods}
                handleSubscriptionDeleted={handleSubscriptionDeleted}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
