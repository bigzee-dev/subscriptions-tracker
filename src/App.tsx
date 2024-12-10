// FILE: src/App.tsx
import "./app.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./config/supabaseClient";
import useSession from "./hooks/useSession";
import Dashboard from "./components/dashboard";

export default function App() {
  const session = useSession();

  return (
    <div className="max-w-xl mx-auto p-4">
      {session ? (
        <Dashboard />
      ) : (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      )}
    </div>
  );
}
