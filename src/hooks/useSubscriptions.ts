import { useState, useCallback } from "react";
import { getSubscriptions } from "@/lib/services/readSubscriptions";
import { Subscription } from "../lib/types";

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getSubscriptions(userId);

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
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    refetch: fetchSubscriptions,
  };
};
