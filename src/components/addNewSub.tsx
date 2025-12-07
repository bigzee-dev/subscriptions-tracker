import { useState } from "react";
import { addSubscription } from "../lib/services/createSubscription";
import NewPaymentPopover from "./payment-method-popover";
import { PaymentMethod } from "../lib/types";
// import useSession from "../hooks/useSession";
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
  DialogClose,
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

interface PaymentMethodProps {
  userId?: string;
  paymentMethods?: PaymentMethod[];
  onRefresh: () => void;
}

export default function NewSubscription({
  userId,
  paymentMethods,
  onRefresh,
}: PaymentMethodProps) {
  const [service_name, setServiceName] = useState<string>("");
  const [payment_due_date, setPaymentDueDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [payment_method, setPaymentMethod] = useState<string>("");
  const paymentCyclesList = ["monthly", "quarterly", "semi-annual", "annual"];
  const [payment_cycle, setPaymentCycle] = useState<string>(
    paymentCyclesList[0]
  );
  const [submiting, setSubmiting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);

    if (userId) {
      const response = await addSubscription(
        userId,
        service_name,
        payment_due_date,
        payment_cycle,
        parseFloat(amount), // Convert amount to number
        payment_method
      );

      if (response && response.success) {
        alert("Subscription added successfully");
        setSubmiting(false);
        setServiceName("");
        setPaymentDueDate("");
        setAmount("");
        setPaymentMethod("");
        onRefresh();
      }
      if (response && !response.success && response.error === "name-exists") {
        alert(
          `Subscription with this name "${response.existingSubscription}" already exists`
        );
        setSubmiting(false);
      }
    } else {
      return { success: false, error: "No session available" };
    }
  };

  const handleAddNewPaymentMethod = () => {
    // Logic to add a new payment method
    alert("Add new payment method functionality not implemented yet.");
    return <div>Nice</div>;
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center justify-center bg-blue-600">
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
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-4  gap-4 py-4"
          >
            {/* Subscription name */}
            <div className="col-span-4">
              <Label htmlFor="serviceName" className="text-right">
                Name
              </Label>
              <Input
                id="serviceName"
                className=""
                type="text"
                value={service_name}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>
            {/* Payment due date */}
            <div className="col-span-2">
              <Label htmlFor="paymentDueDate" className="text-right">
                Payment due on:
              </Label>

              <Input
                id="paymentDueDate"
                type="date"
                value={payment_due_date}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                required
                className="col-span-3 flex justify-center"
              />
            </div>
            {/* Amount */}
            <div className="col-span-2">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount.toString()}
                onChange={(e) => setAmount(e.target.value)}
                required
                className=""
              />
            </div>
            {/* Payment cycle */}
            <div className="col-span-2">
              <Label htmlFor="paymentCycle" className="text-right">
                Payment cycle
              </Label>
              <Select
                value={payment_cycle}
                onValueChange={(value: string) => {
                  setPaymentCycle(value);
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentCyclesList.map((cycle: string) => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Payment method */}
            <div className="col-span-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Payment Method
              </Label>
              <div id="paymentMethod">
                <Select
                  value={payment_method}
                  onValueChange={(value: string) => {
                    if (value === "add-new") {
                      handleAddNewPaymentMethod(); // Call your custom function here
                    } else {
                      setPaymentMethod(value);
                    }
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <NewPaymentPopover user_id={userId} onRefresh={onRefresh} />

                    {(paymentMethods ?? []).map((pm) => (
                      <SelectItem key={pm.id ?? pm.name} value={pm.name}>
                        {pm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="col-span-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
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
