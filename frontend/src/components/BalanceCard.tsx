interface BalanceCardProps {
  balance: number | null;
  loading?: boolean;
  userName?: string;
}

export default function BalanceCard({ balance, loading, userName }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#002970] via-[#003d9e] to-[#0055cc] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -right-4 w-48 h-48 bg-white/5 rounded-full" />

      <div className="relative z-10">
        {userName && (
          <p className="text-blue-200 text-sm mb-3 font-medium">Welcome back, {userName.split(" ")[0]}!</p>
        )}

        <p className="text-blue-300 text-xs uppercase tracking-wider mb-1 font-medium">Paytm Wallet Balance</p>

        {loading ? (
          <div className="h-10 w-44 bg-white/20 rounded-lg animate-pulse mt-1" />
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-200">₹</span>
            <span className="text-4xl font-black tracking-tight">
              {balance !== null
                ? balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "—"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <p className="text-blue-200 text-xs">Account Active</p>
        </div>
      </div>
    </div>
  );
}
