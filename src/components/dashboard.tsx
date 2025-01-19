import NewSubscription from "./addNewSub";
import Navbar from "./navbar";
import ShowSubscriptions from "./showSubs";
import ShowSubs from "./testLogos";

export default function Dashboard() {
  return (
    <div className="max-w-xl">
      <Navbar />
      <img src="https://img.logo.dev/cloud.digitalocean.com" alt="" />
      <NewSubscription />
      <ShowSubs />
    </div>
  );
}
