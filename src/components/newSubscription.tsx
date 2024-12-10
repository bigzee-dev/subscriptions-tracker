import { useState, useEffect } from "react";
import { addSubscription } from "../lib/services/addSubscription";
import useSession from "../hooks/useSession";

import { Button } from "@/components/ui/button";
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

export default function NewSubscription() {
  const [service_name, setServiceName] = useState<string>("");
  const [payment_due_date, setPaymentDueDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [payment_method, setPaymentMethod] = useState<string>("");
  const [submiting, setSubmiting] = useState<boolean>(false);
  //   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);

    const response = await addSubscription(
      session,
      service_name,
      payment_due_date,
      parseFloat(amount), // Convert amount to number
      payment_method
    );
    if (response && response.success) {
      alert("Subscription added successfully");
      setSubmiting(false);
    }
    setServiceName("");
    setPaymentDueDate("");
    setAmount("");
    setPaymentMethod("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new subscription</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceName" className="text-right">
              Name
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
            <Label htmlFor="paymentDueDate" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount.toString()}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method
            </Label>
            <Input
              id="paymentMethod"
              type="text"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submiting}>
              Add Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
