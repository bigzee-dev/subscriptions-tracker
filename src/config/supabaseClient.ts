import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xjbepcnkosalqodkkvur.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmVwY25rb3NhbHFvZGtrdnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTEyMDMsImV4cCI6MjA0OTA2NzIwM30.nsNMwrbjBT46HPZfueLHp6DQ8VCuWi1i9F1l0XRHIWo";

export const supabase = createClient(supabaseUrl, supabaseKey);
