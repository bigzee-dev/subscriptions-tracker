import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { useState } from "react";
import { addNewPaymentMethod } from "@/lib/services/create-payment-method";

export default function NewPaymentPopover({
  user_id,
  onRefresh,
}: {
  user_id?: string;
  onRefresh: () => void;
}) {
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>("");
  const [submiting, setSubmiting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);

    if (user_id) {
      const response = await addNewPaymentMethod(newPaymentMethod, user_id);

      if (response && response.success) {
        alert("new  Payment method added successfully");
        onRefresh();
        setSubmiting(false);
      }
      if (response && !response.success) {
        alert(`adding payment method failed: ${response.error}`);
        setSubmiting(false);
      }
    } else {
      return { success: false, error: "No session available" };
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Payment Method</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <Label htmlFor="newpaymentMethod" className="text-right">
              Amount
            </Label>
            <Input
              id="newpaymentMethod"
              type="string"
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              required
              className=""
            />
          </div>
          {/* <Button type="submit" disabled={submiting}>
            Add Payment method
          </Button> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={submiting}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
