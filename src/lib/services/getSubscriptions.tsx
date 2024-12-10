import { supabase } from "../../config/supabaseClient";

export const getSubscriptions = async (user_id: string) => {
  if (user_id) {
    console.log(user_id);
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error getting subscriptions:", error);
      return { success: false, error };
    } else {
      console.log("Subscriptions:", data);
      return { success: true, data };
    }
  } else {
    return { success: false, error: "No session available" };
  }
};
