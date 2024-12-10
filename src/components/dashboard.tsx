import useSession from "../hooks/useSession";
import NewSubscription from "./newSubscription";
import ShowSubscriptions from "./showSubscriptions";

export default function Dashboard() {
  const session = useSession();

  return (
    <div className="max-w-xl">
      <h2>Dashboard</h2>
      <p>{`Hi ${session?.user.email} `}</p>
      <NewSubscription />
      <ShowSubscriptions />
    </div>
  );
}
