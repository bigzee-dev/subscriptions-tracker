import { UserCog } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900">
      <div className="w-full h-full bg-green-600/30 flex items-center justify-between p-4">
        <h1 className="text-2xl font-semibold text-green-400">Subscriptions</h1>
        <button className="flex justify-center items-center bg-neutral-300/20 p-2 rounded-full text-white">
          <UserCog className="text-green-400 w-8 h-8" />
        </button>
      </div>
    </nav>
  );
}
