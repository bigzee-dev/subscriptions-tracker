import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../config/supabaseClient"; // Adjust the import according to your project structure

type Subscription = {
  id: string;
  user_id: string;
  service_name: string;
  amount: number;
  payment_due_date: string;
  payment_method: string;
  created_at: string;
};

type EditSubscriptionProps = {
  subscription: Subscription | null;
  onClose: () => void;
};

export default function EditSubscription({
  subscription,
  onClose,
}: EditSubscriptionProps) {
  const [service_name, setServiceName] = useState<string>("");
  const [payment_due_date, setPaymentDueDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [payment_method, setPaymentMethod] = useState<string>("Credit Card");
  const [submiting, setSubmiting] = useState<boolean>(false);

  useEffect(() => {
    if (subscription) {
      setServiceName(subscription.service_name);
      setPaymentDueDate(subscription.payment_due_date);
      setAmount(subscription.amount.toString());
      setPaymentMethod(subscription.payment_method);
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);

    const { error } = await supabase
      .from("subscriptions")
      .update({
        service_name,
        payment_due_date,
        amount: parseFloat(amount), // Convert amount to number
        payment_method,
      })
      .eq("id", subscription?.id);

    if (error) {
      console.error("Error updating subscription:", error);
    } else {
      console.log("Subscription updated successfully");
      onClose();
    }
    setSubmiting(false);
  };

  return (
    <div className="flex-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceName" className="text-right">
                Service Name
              </Label>
              <Input
                id="serviceName"
                className="col-span-3"
                type="text"
                value={service_name}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentDueDate" className="text-right">
                Payment due on:
              </Label>
              <Input
                id="paymentDueDate"
                type="date"
                value={payment_due_date}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Payment Method</Label>
              <div className="col-span-3">
                <Select value={payment_method} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submiting}>
                Update Subscription
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
