import { useState, useCallback } from "react";
import { getPaymentMethods } from "@/lib/services/read-payment-methods";
import { PaymentMethod } from "../lib/types";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getPaymentMethods(userId);

    if (fetchError) {
      console.error("Error fetching payment methods:", fetchError);
      setError(
        (fetchError as Error).message ||
          "An unknown error occurred while fetching payment methods."
      );
      setPaymentMethods([]);
    } else {
      setPaymentMethods(data || []);
    }
    setLoading(false);
  }, []);

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    refetch: fetchPaymentMethods,
  };
};
