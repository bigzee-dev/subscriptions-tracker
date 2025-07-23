import { UserCog } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-neutral-800">
      <div className="w-full h-full  flex items-center justify-between p-4">
        <h1 className="text-2xl font-semibold text-neutral-300">
          Subscriptions
        </h1>
        <button className="flex justify-center items-center bg-neutral-300/20 p-2 rounded-full ">
          <UserCog className="text-blue-400 w-8 h-8" />
        </button>
      </div>
    </nav>
  );
}
