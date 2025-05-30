// FILE: src/App.tsx
import "./App.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./config/supabaseClient";
import useSession from "./hooks/useSession";
import Dashboard from "./components/dashboard";

export default function App() {
  const session = useSession();

  return (
    <div className="bg-neutral-100 max-w-lg mx-auto">
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
