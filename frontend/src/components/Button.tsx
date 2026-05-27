interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
  fullWidth,
  size = "md",
}: ButtonProps) {
  const base =
    "font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-[#00BAF2] hover:bg-[#009FD4] active:bg-[#0090C0] text-white shadow-sm",
    secondary: "bg-[#002970] hover:bg-[#001a50] active:bg-[#001240] text-white shadow-sm",
    ghost: "text-[#00BAF2] hover:bg-[#00BAF2]/10 active:bg-[#00BAF2]/20 border border-[#00BAF2]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}
