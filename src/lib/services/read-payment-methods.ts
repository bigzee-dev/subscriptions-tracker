import { supabase } from "../../config/supabaseClient";

export const getPaymentMethods = async (user_id: string) => {
  if (user_id) {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error getting payment methods:", error);
      return { success: false, error };
    } else {
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
