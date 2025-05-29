import axios from "axios";
import { useEffect, useState } from "react";
import { getSubscriptions } from "@/lib/services/getSubscriptions";
import useSession from "../hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";
import EditSubscription from "./editSub";
import DeleteSubscription from "./deleteSub";
import { Globe } from "lucide-react";
import { Subscriptions } from "@/lib/types";

const getLogoUrl = async (serviceName: string) => {
  try {
    const response = await axios.get(
      `https://logo.clearbit.com/${serviceName}.com`
    );
    return response.config.url;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
};

// const getFaviconUrl = (serviceName: string) => {
//   return `https://www.google.com/s2/favicons?domain=cloud.digitalocean.com`;
// };

const SubscriptionCard = ({
  subscription,
}: {
  subscription: Subscriptions;
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  //   const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const url = await getLogoUrl(subscription.service_name);
      setLogoUrl(url ?? null);
    };

    fetchLogo();
  }, [subscription.service_name]);
  //   useEffect(() => {
  //     const fetchFavicon = async () => {
  //       const url = getFaviconUrl(subscription.service_name);
  //       setFaviconUrl(url);
  //     };

  //     fetchFavicon();
  //   }, [subscription.service_name]);

  // format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
  };

  return (
    <Card key={subscription.id} className="border border-gray-400 rounded-2xl">
      <CardContent className="font-sans grid grid-cols-4 gap-2 pt-1 px-3">
        <div className="flex items-center font-medium text-left">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${subscription.service_name} logo`}
              className="w-6 h-6 mr-2"
            />
          ) : (
            <Globe className="text-gray-600" />
          )}
          {/* {faviconUrl && (
            <img
              src={faviconUrl}
              alt={`${subscription.service_name} logo`}
              className="w-6 h-6 mr-2"
            />
          )} */}
          {subscription.service_name}
        </div>
        <span className="flex items-center text-sm text-gray-700 font-medium">
          P{subscription.amount.toFixed(2)}
        </span>
        <div className="flex items-center text-sm text-gray-700 font-medium">
          {formatDate(subscription.payment_due_date)}
        </div>
        <div className="flex items-center text-sm">
          {subscription.payment_method}
        </div>
      </CardContent>
      <div className="flex justify-between">
        <EditSubscription subscription={subscription} />
        <DeleteSubscription
          subscriptionId={subscription.id}
          subscriptionName={subscription.service_name}
        />
      </div>
    </Card>
  );
};

// const ShowSubs = () => {
//   const [subscriptions, setSubscriptions] = useState<Subscriptions[]>([]);
//   const session = useSession();
//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       if (session) {
//         const { data, error } = await getSubscriptions(session.user.id);
//         if (error) {
//           console.error("Error fetching subscriptions:", error);
//         } else {
//           setSubscriptions(data || []);
//         }
//       } else {
//         console.error("No valid session found");
//       }
//     };

//     fetchSubscriptions();
//   }, [session]);

//   // Sort subscriptions by payment_due_date in ascending order
//   const sortedSubscriptions = subscriptions.sort((a, b) => {
//     return (
//       new Date(a.payment_due_date).getTime() -
//       new Date(b.payment_due_date).getTime()
//     );
//   });

//   return (
//     <div className="font-sans max-w-2xl mx-auto p-4">
//       {sortedSubscriptions.length > 0 ? (
//         <div className="space-y-6">
//           {sortedSubscriptions.map((subscription) => (
//             <SubscriptionCard
//               key={subscription.id}
//               subscription={subscription}
//             />
//           ))}
//         </div>
//       ) : (
//         <div>No subscriptions found</div>
//       )}
//     </div>
//   );
// };

// export default ShowSubs;
