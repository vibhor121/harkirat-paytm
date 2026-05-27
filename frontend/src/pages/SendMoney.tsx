import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import * as api from "../lib/api";

export default function SendMoney() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const toId = searchParams.get("to") ?? "";
  const toName = searchParams.get("name") ?? "Unknown User";

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transferredAmount, setTransferredAmount] = useState(0);

  const initials = toName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userName = localStorage.getItem("userName") ?? "";

  async function handleSend(e: React.SyntheticEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!toId || isNaN(num) || num <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setError("");

    const { ok, data } = await api.transfer(toId, num);
    if (!ok) {
      setError((data as any).message || "Transfer failed. Please try again.");
    } else {
      setTransferredAmount(num);
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Navbar userName={userName} />

      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {success ? (
            /* ── Success State ── */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-1">Transfer Successful!</h2>
              <p className="text-gray-500 text-sm mb-1">
                You sent{" "}
                <span className="font-semibold text-gray-800">
                  ₹{transferredAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-6">
                to <span className="font-semibold text-gray-800">{toName}</span>
              </p>

              <Button onClick={() => navigate("/dashboard")} fullWidth size="lg">
                Back to Home
              </Button>
            </div>
          ) : (
            <>
              {/* ── Header stripe ── */}
              <div className="bg-gradient-to-r from-[#002970] to-[#0055cc] px-6 py-5 text-white">
                <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Sending to</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{toName}</p>
                    <p className="text-blue-300 text-xs">Paytm User</p>
                  </div>
                </div>
              </div>

              {/* ── Form ── */}
              <div className="p-6">
                <form onSubmit={handleSend} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-3.5 text-xl font-bold text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:border-[#00BAF2] transition-colors placeholder:text-gray-300 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  {/* Quick amount chips */}
                  <div className="flex gap-2">
                    {[100, 500, 1000, 2000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(String(val))}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          amount === String(val)
                            ? "border-[#00BAF2] bg-[#00BAF2]/10 text-[#00BAF2]"
                            : "border-gray-200 text-gray-500 hover:border-[#00BAF2] hover:text-[#00BAF2]"
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>

                  {error && <ErrorAlert message={error} />}

                  <Button
                    type="submit"
                    disabled={loading || !amount}
                    fullWidth
                    size="lg"
                  >
                    {loading ? "Sending..." : `Send ₹${amount ? parseFloat(amount).toLocaleString("en-IN") : "0"}`}
                  </Button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
