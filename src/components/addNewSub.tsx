import { useState, useEffect, SetStateAction } from "react";
import { addSubscription } from "../lib/services/addSubscription";
import useSession from "../hooks/useSession";
import { Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

    if (session) {
      const response = await addSubscription(
        session.user.id,
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
    } else {
      return { success: false, error: "No session available" };
    }
  };

  return (
    <div className="flex justify-end p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center justify-center bg-gray-900">
            <Plus />
          </Button>
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
              {/* <select
              id="paymentMethod"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="col-span-3"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select> */}
              <div className="col-span-3" id="paymentMethod">
                <Select
                  value={payment_method}
                  onValueChange={(value: string) => setPaymentMethod(value)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="" />
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
                Add Subscription
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
