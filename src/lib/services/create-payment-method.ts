import { supabase } from "../../config/supabaseClient";

export const addPaymentMethod = async (
  user_id: string,
  payment_method_name: string
) => {
  if (user_id) {
    // Normalize the service_name to ensure consistent comparison
    const normalizedPaymentMethodName = payment_method_name.trim();

    // Insert the new subscription
    const { data, error } = await supabase.from("payment-method").insert([
      {
        user_id,
        name: normalizedPaymentMethodName, // Use normalized name
        created_at: new Date().toISOString(), // Use ISO string format
      },
    ]);

    if (error) {
      console.error("Error adding payment method:", error);
      return { success: false, error: error.message };
    } else {
      console.log("payment method added:", data);
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
