export type Subscription = {
  id: string;
  user_id: string;
  service_name: string;
  amount: number;
  payment_due_date: string;
  payment_cycle: "monthly" | "quarterly" | "semi-annual" | "annual"; 
  payment_method: string;
  created_at: string;
};

export type PaymentMethod = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};
