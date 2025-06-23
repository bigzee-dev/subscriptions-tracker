import { useEffect, useState, useCallback } from "react";
import { getSubscriptions } from "@/lib/services/getSubscriptions";
import useSession from "../hooks/useSession";
import NewSubscription from "./addNewSub";
import Navbar from "./navbar";
import ShowSubscriptions from "./showSubs";
import { Subscription } from "../lib/types";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useSession();

  const fetchSubscriptions = useCallback(async () => {
    if (!session) {
      console.error("No valid session found, cannot fetch subscriptions.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getSubscriptions(session.user.id);

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      setError(
        (fetchError as Error).message ||
          "An unknown error occurred while fetching subscriptions."
      );
      setSubscriptions([]);
    } else {
      setSubscriptions(data || []);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div className="w-full h-full min-h-screen flex flex-col">
      <Navbar />
      <NewSubscription
        userId={session?.user.id}
        onRefresh={fetchSubscriptions}
      />
      <div className="flex-1 w-full">
        <ShowSubscriptions
          subscriptions={subscriptions}
          loading={loading}
          error={error}
          onRefresh={fetchSubscriptions}
        />
      </div>
    </div>
  );
}
