import { useEffect, useState } from "react";
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

  const session = useSession();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (session) {
        const { data, error } = await getSubscriptions(session.user.id);
        if (error) {
          console.error("Error fetching subscriptions:", error);
        } else {
          setSubscriptions(data || []);
        }
      } else {
        console.error("No valid session found");
      }
    };

    fetchSubscriptions();
  }, [session]);

  // format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
  };

  // Sort subscriptions by payment_due_date in ascending order
  const sortedSubscriptions = subscriptions.sort((a, b) => {
    return (
      new Date(a.payment_due_date).getTime() -
      new Date(b.payment_due_date).getTime()
    );
  });

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
              <div className="flex justify-between">
                <EditSubscription subscription={subscription} />
                <DeleteSubscription
                  subscriptionId={subscription.id}
                  subscriptionName={subscription.service_name}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4 text-center">
            <p>Loading...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
