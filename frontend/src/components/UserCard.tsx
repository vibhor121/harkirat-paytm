import { useNavigate } from "react-router-dom";
import Button from "./Button";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();
  const initials = (user.firstName[0] + (user.lastName[0] ?? "")).toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`;

  function handleSend() {
    navigate(`/send?to=${user._id}&name=${encodeURIComponent(fullName)}`);
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00BAF2] to-[#009FD4] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{fullName}</p>
          <p className="text-xs text-gray-400">Paytm User</p>
        </div>
      </div>
      <Button onClick={handleSend} size="sm">
        Send
      </Button>
    </div>
  );
}
