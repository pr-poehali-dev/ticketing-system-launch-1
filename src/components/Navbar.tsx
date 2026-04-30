import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Главная", path: "/" },
  { label: "События", path: "/events" },
  { label: "Поддержка", path: "/support" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
              <Icon name="Ticket" size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              TicketWave
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3 relative">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass neon-border hover:bg-white/5 transition-all"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${user.role === "organizer" ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-violet-500 to-pink-500"}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass neon-border rounded-2xl py-2 shadow-2xl z-50">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <span className={`text-xs mt-1 inline-flex items-center gap-1 ${user.role === "organizer" ? "text-amber-400" : "text-violet-400"}`}>
                        <Icon name={user.role === "organizer" ? "Crown" : "Ticket"} size={10} />
                        {user.role === "organizer" ? "Организатор" : "Покупатель"}
                      </span>
                    </div>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors">
                      <Icon name={user.role === "organizer" ? "LayoutDashboard" : "Ticket"} size={14} className="text-muted-foreground" />
                      {user.role === "organizer" ? "CRM / Кабинет" : "Мои билеты"}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <Icon name="LogOut" size={14} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Icon name="User" size={14} />
                Войти
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/5 mt-2 pt-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-white/5">
                  <Icon name={user.role === "organizer" ? "LayoutDashboard" : "Ticket"} size={14} />
                  {user.role === "organizer" ? "CRM / Кабинет" : "Мои билеты"}
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <Icon name="LogOut" size={14} /> Выйти
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium">
                <Icon name="User" size={14} /> Войти / Зарегистрироваться
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
