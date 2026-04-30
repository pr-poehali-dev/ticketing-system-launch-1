import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

type Mode = "login" | "register";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<UserRole>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Заполните все поля"); return; }
    if (mode === "register" && !name) { setError("Введите имя"); return; }

    if (mode === "login") {
      login(email, password, role);
    } else {
      register(name, email, password, role);
    }
    navigate("/profile");
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Icon name="Ticket" size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            TicketWave
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "login" ? "Войдите в свой аккаунт" : "Регистрация занимает 30 секунд"}
            </p>
          </div>

          <div className="glass neon-border rounded-3xl p-6">
            {/* Role selector */}
            <div className="flex gap-2 p-1 bg-secondary/50 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  role === "buyer"
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name="Ticket" size={14} />
                Покупатель
              </button>
              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  role === "organizer"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name="Building2" size={14} />
                Организатор
              </button>
            </div>

            {role === "organizer" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <Icon name="Info" size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-400">Аккаунт организатора даёт доступ к CRM, созданию событий и QR-сканеру</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "register" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Имя</label>
                  <input
                    type="text"
                    placeholder="Александр Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Пароль</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] mt-2 ${
                  role === "organizer"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-violet-600 to-pink-600"
                }`}
              >
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                <span className="text-primary font-medium">
                  {mode === "login" ? "Зарегистрироваться" : "Войти"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
