import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavItem = ({ to, children, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "nav-link",
        isActive && "bg-white/20 text-white"
      )}
    >
      {children}
    </Link>
  );
};
