import { useEffect, useState } from "react";
import { getSubscriptions } from "@/lib/services/getSubscriptions";
import useSession from "../hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";

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
      console.log("fetchSubscriptions");
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>
      {sortedSubscriptions.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-500 mb-2">
            <div>Service</div>
            <div>Amount</div>
            <div>Due Date</div>
            <div>Payment Method</div>
          </div>
          {sortedSubscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="grid grid-cols-4 gap-4 py-4">
                <div className="font-medium">{subscription.service_name}</div>
                <div>P{subscription.amount.toFixed(2)}</div>
                <div>{formatDate(subscription.payment_due_date)}</div>
                <div>{subscription.payment_method}</div>
              </CardContent>
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
