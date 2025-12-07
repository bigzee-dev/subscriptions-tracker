import { supabase } from "../../config/supabaseClient";

export const addNewPaymentMethod = async (
  payment_method_name: string,
  user_id?: string
) => {
  if (user_id) {
    console.log("userid in function:", user_id);
    // Normalize the service_name to ensure consistent comparison
    const normalizedPaymentMethodName = payment_method_name.trim();

    // Insert the new subscription
    const { data, error } = await supabase.from("payment_methods").insert([
      {
        user_id,
        name: normalizedPaymentMethodName, // Use normalized name
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
