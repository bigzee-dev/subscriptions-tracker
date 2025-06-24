import { supabase } from "../../config/supabaseClient";

export const addSubscription = async (
  user_id: string,
  service_name: string,
  payment_due_date: string,
  amount: number,
  payment_method: string
) => {
  if (user_id) {
    // Normalize the service_name to ensure consistent comparison
    const normalizedServiceName = service_name.trim();

    // Check if a subscription with the same name already exists
    // Remove .single() - it causes 406 when no records found
    const { data: existingSubscriptions, error: checkError } = await supabase
      .from("subscriptions")
      .select("service_name")
      .eq("user_id", user_id)
      .eq("service_name", normalizedServiceName);

    // Handle the check error (but ignore "no rows" scenario)
    if (checkError) {
      console.error("Error checking existing subscription:", checkError);
      return {
        success: false,
        error:
          "Was not able to check if an existing subscription with the same name exists",
      };
    }

    // Check if any subscriptions were found
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      console.log(
        `Subscription with this name "${normalizedServiceName}" already exists`
      );
      return {
        success: false,
        error: "name-exists",
        existingSubscription: normalizedServiceName,
      };
    }

    // Insert the new subscription
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id,
        service_name: normalizedServiceName, // Use normalized name
        payment_due_date,
        amount,
        payment_method,
        created_at: new Date().toISOString(), // Use ISO string format
      },
    ]);

    if (error) {
      console.error("Error adding subscription:", error);
      return { success: false, error: error.message };
    } else {
      console.log("Subscription added:", data);
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
