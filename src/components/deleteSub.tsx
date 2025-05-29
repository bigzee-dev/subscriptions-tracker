import { supabase } from "../config/supabaseClient"; // Adjust the import according to your project structure
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
  console.log("DeleteSubscription props:", props);
  const { subscriptionId, subscriptionName, deletesub } = props;
  // Add this debug line
  console.log("DeleteSubscription props:", {
    subscriptionId,
    subscriptionName,
    deletesub,
    typeOfOnDelete: typeof deletesub,
  });

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
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="text-red-600" variant="outline">
            X
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
