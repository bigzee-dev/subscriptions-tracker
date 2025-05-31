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
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("service_name")
      .eq("user_id", user_id)
      .eq("service_name", normalizedServiceName)
      .single();

    /* if there is an existing subscription with the same name we alert the user and return 
       from the function */
    if (existingSubscription) {
      alert(
        `Subscription with this name ${existingSubscription.service_name} already exists`
      );
      return {
        success: false,
        error: "Subscription with the name already exists",
      };
    }

    if (checkError) {
      return {
        success: false,
        error:
          "Was not able to check if an existing subscription with the same name exists",
      };
    }

    // Insert the new subscription
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id,
        service_name,
        payment_due_date,
        amount,
        payment_method,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error("Error adding subscription:", error);
      return { success: false, error };
    } else {
      console.log("Subscription added:", data);
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
