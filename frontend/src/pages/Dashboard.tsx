import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import SearchBar from "../components/SearchBar";
import UserCard from "../components/UserCard";
import * as api from "../lib/api";

type User = { _id: string; firstName: string; lastName: string };

const QUICK_ACTIONS = [
  { icon: "💸", label: "Send Money" },
  { icon: "📱", label: "Mobile Recharge" },
  { icon: "💡", label: "Electricity" },
  { icon: "🏧", label: "Add Money" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const userName = localStorage.getItem("userName") ?? "";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
      return;
    }
    fetchBalance();
    fetchUsers("");
  }, []);

  const fetchUsers = useCallback(async (q: string) => {
    setUsersLoading(true);
    const { ok, data } = await api.getUsers(q);
    if (ok) setUsers(data.users);
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(filter), 300);
    return () => clearTimeout(timer);
  }, [filter, fetchUsers]);

  async function fetchBalance() {
    setBalanceLoading(true);
    const { ok, data } = await api.getBalance();
    if (!ok) {
      navigate("/signin");
      return;
    }
    setBalance(data.balance);
    setBalanceLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Navbar userName={userName} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Balance */}
        <BalanceCard balance={balance} loading={balanceLoading} userName={userName} />

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                onClick={() => {
                  if (action.label === "Send Money") navigate("/send");
                }}
              >
                <div className="w-12 h-12 bg-[#00BAF2]/10 rounded-full flex items-center justify-center text-xl group-hover:bg-[#00BAF2]/20 transition-colors">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Transfer to Someone */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Transfer Money
          </h2>

          <SearchBar
            value={filter}
            onChange={setFilter}
            placeholder="Search users by name..."
          />

          <div className="mt-3 divide-y divide-gray-100">
            {usersLoading ? (
              <div className="py-6 flex justify-center">
                <div className="w-5 h-5 border-2 border-[#00BAF2] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">No users found</p>
              </div>
            ) : (
              users.map((user) => <UserCard key={user._id} user={user} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
