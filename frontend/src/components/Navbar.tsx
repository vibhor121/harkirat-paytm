import { useNavigate } from "react-router-dom";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/signin");
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Paytm Logo */}
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-[#002970] font-black text-xl tracking-tight">
            Pay<span className="text-[#00BAF2]">TM</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-gray-600 hidden sm:block font-medium">
              Hi, {userName.split(" ")[0]}
            </span>
          )}

          <div
            className="w-8 h-8 bg-[#002970] text-white rounded-full flex items-center justify-center text-xs font-bold"
            title={userName}
          >
            {initials}
          </div>

          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-gray-800 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
