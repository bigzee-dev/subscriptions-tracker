import { supabase } from "../config/supabaseClient"; // Adjust the import according to your project structure
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteSubscriptionProps = {
  subscriptionId: string;
  subscriptionName: string;
  deletesub: () => void;
};

export default function DeleteSubscription(props: DeleteSubscriptionProps) {
  const { subscriptionId, subscriptionName, deletesub } = props;

  const handleDelete = async () => {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", subscriptionId);

    if (error) {
      console.error("Error deleting subscription:", error);
    } else {
      console.log("Subscription deleted successfully");
      deletesub(); /* Call the onDelete callback to refresh the list*/
    }
  };

  return (
    <div className="flex-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 text-xs"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subscription{" "}
              <span className="font-medium text-gray-800">
                {subscriptionName}
              </span>{" "}
              and remove its data from our servers
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
