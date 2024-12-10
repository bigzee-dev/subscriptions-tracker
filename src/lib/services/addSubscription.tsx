import { supabase } from "../../config/supabaseClient";
import { Session } from "@supabase/supabase-js";

export const addSubscription = async (
  session: Session | null,
  service_name: string,
  payment_due_date: string,
  amount: number,
  payment_method: string
) => {
  if (session) {
    const { user } = session;

    // Normalize the service_name to ensure consistent comparison
    const normalizedServiceName = service_name.trim().toLowerCase();

    // Check if a subscription with the same name already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("service_name")
      .eq("user_id", user.id)
      .eq("service_name", normalizedServiceName);

    console.log("existingSubscription", existingSubscription);
    console.log("checkError", checkError);

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing subscription:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existingSubscription) {
      alert("Subscription with this name already exists");
      return {
        success: false,
        error: "Subscription with this name already exists",
      };
    }

    // insert the new subscription
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id: user.id,
        service_name,
        payment_due_date,
        amount,
        payment_method,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error("Error adding subscription:", error);
      //   return { success: false, error };
    } else {
      console.log("Subscription added:", data);
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
