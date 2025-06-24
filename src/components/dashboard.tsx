import { useEffect, useCallback } from "react";
import useSession from "../hooks/useSession";
import NewSubscription from "./addNewSub";
import Navbar from "./navbar";
import ShowSubscriptions from "./showSubs";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { usePaymentMethods } from "../hooks/usePaymentMethods.ts";

export default function Dashboard() {
  const { session } = useSession();
  const { subscriptions, loading, error, fetchSubscriptions } =
    useSubscriptions();
  const { paymentMethods, fetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    if (session?.user.id) {
      fetchPaymentMethods(session.user.id);
      fetchSubscriptions(session.user.id);
    }
  }, [fetchSubscriptions, fetchPaymentMethods, session?.user.id]);

  const handleRefresh = useCallback(() => {
    if (session?.user.id) {
      fetchSubscriptions(session.user.id);
    }
  }, [fetchSubscriptions, session?.user.id]);

  return (
    <div className="w-full h-full min-h-screen flex flex-col">
      <Navbar />
      <NewSubscription
        userId={session?.user.id}
        paymentMethods={paymentMethods}
        onRefresh={handleRefresh}
      />
      <div className="flex-1 w-full">
        <ShowSubscriptions
          subscriptions={subscriptions}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
