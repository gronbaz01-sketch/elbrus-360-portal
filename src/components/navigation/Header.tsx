import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Mountain } from "lucide-react";
import { NavItem } from "./NavItem";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Главная" },
    { to: "/apartments", label: "Жильё" },
    { to: "/cafes", label: "Кафе" },
    { to: "/taxi", label: "Такси" },
    { to: "/cameras", label: "Камеры" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Mountain className="w-8 h-8 text-accent transition-transform group-hover:scale-110" />
            <span className="text-lg md:text-xl font-display font-bold text-white">
              Приэльбрусье <span className="text-accent">360</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-primary/98 backdrop-blur-md border-b border-white/10 overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </NavItem>
          ))}
        </nav>
      </div>
    </header>
  );
};
