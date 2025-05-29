import { useEffect, useState, useCallback } from "react";
import { getSubscriptions } from "@/lib/services/getSubscriptions";
import useSession from "../hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";
import EditSubscription from "./editSub";
import DeleteSubscription from "./deleteSub";

type subscription = {
  id: string;
  user_id: string;
  service_name: string;
  amount: number;
  payment_due_date: string;
  payment_method: string;
  created_at: string;
};

export default function ShowSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = useSession();

  const fetchSubscriptions = useCallback(async () => {
    console.log("fetchSubscriptions ran");
    if (!session) {
      console.error("No valid session found, cannot fetch subscriptions.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getSubscriptions(session.user.id); // Renamed 'error' to 'fetchError' to avoid conflict if 'error' is a global or already used variable.

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      // FIX HERE: Assert 'fetchError' as an Error object or a general object with a 'message' property
      setError(
        (fetchError as Error).message ||
          "An unknown error occurred while fetching subscriptions."
      );
      setSubscriptions([]);
    } else {
      setSubscriptions(data || []);
      console.log(subscriptions);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    return (
      new Date(a.payment_due_date).getTime() -
      new Date(b.payment_due_date).getTime()
    );
  });

  function handleSubscriptionDeleted() {
    console.log("Subscription deleted, refreshing list...");
    fetchSubscriptions();
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p>Loading subscriptions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-red-500">
          <p>Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="font-sans max-w-2xl mx-auto p-4">
      {sortedSubscriptions.length > 0 ? (
        <div className="space-y-6">
          {sortedSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="rounded-2xl">
              <CardContent className="font-sans grid grid-cols-3 gap-2 pt-1 px-3">
                <div className="flex items-center font-medium text-left">
                  {subscription.service_name}
                </div>
                <span className="flex items-center text-sm text-gray-700 font-medium">
                  P{subscription.amount.toFixed(2)}
                </span>
                <div className="flex items-center text-sm text-gray-700 font-medium">
                  {formatDate(subscription.payment_due_date)}
                </div>
                <div className="flex items-center text-sm">
                  {subscription.payment_method}
                </div>
              </CardContent>
              <div className="flex justify-between p-3">
                <EditSubscription subscription={subscription} />
                <DeleteSubscription
                  subscriptionId={subscription.id}
                  subscriptionName={subscription.service_name}
                  deletesub={handleSubscriptionDeleted}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4 text-center">
            <p>No subscriptions found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
