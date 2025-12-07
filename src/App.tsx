// FILE: src/App.tsx
import "./App.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./config/supabaseClient";
import useSession from "./hooks/useSession";
import Dashboard from "./components/dashboard";

export default function App() {
  const { session, loading } = useSession();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="bg-neutral-100 max-w-lg mx-auto">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-neutral-100 max-w-6xl mx-auto">
      {session ? (
        <Dashboard />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </div>
      )}
    </div>
  );
}
