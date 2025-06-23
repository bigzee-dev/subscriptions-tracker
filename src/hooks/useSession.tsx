import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient"; // Adjust the import according to your project structure

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // get the user session if it exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        console.log("session", session);
      }
    });

    // provide a listener to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // cleanup function to remove the listener when the component is unmounted
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};

export default useSession;
