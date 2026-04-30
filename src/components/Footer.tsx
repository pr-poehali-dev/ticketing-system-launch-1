import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Icon name="Ticket" size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                TicketWave
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Современная платформа для покупки билетов на лучшие мероприятия. Быстро, удобно, безопасно.
            </p>
            <div className="flex gap-3 mt-4">
              {["Instagram", "Twitter", "Youtube"].map((sn) => (
                <button
                  key={sn}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={sn === "Instagram" ? "Instagram" : sn === "Twitter" ? "Twitter" : "Youtube"} size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Навигация</h4>
            <ul className="space-y-2">
              {[
                { label: "Главная", to: "/" },
                { label: "События", to: "/events" },
                { label: "Мой кабинет", to: "/profile" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Поддержка</h4>
            <ul className="space-y-2">
              {[
                { label: "Помощь", to: "/support" },
                { label: "Контакты", to: "/support" },
                { label: "FAQ", to: "/support" },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">© 2026 TicketWave. Все права защищены.</p>
          <p className="text-muted-foreground text-xs">Сделано с ❤️ для вас</p>
        </div>
      </div>
    </footer>
  );
}
