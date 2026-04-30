import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import jsQR from "jsqr";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import CreateEventWizard, { NewEvent } from "@/components/CreateEventWizard";

/* ─── Mock data ─── */
const mockTickets = [
  { id: "TW-2026-001", event: "Neon Beats Festival", date: "15 мая 2026", time: "20:00", location: "Москва, Олимпийский", seat: "Сектор A, ряд 5, место 12", price: "3 200 ₽", status: "active", color: "from-violet-500 to-pink-500" },
  { id: "TW-2026-002", event: "Чемпионат по футболу", date: "22 мая 2026", time: "18:30", location: "СПб, Газпром Арена", seat: "Северная трибуна, ряд 10, место 7", price: "1 800 ₽", status: "active", color: "from-blue-500 to-cyan-500" },
  { id: "TW-2025-087", event: "Stand Up Night", date: "12 апр 2025", time: "19:00", location: "Москва, Comedy Club", seat: "VIP зона, стол 3", price: "2 000 ₽", status: "used", color: "from-green-500 to-teal-500" },
];

type OrgEvent = {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  total: number;
  sold: number;
  reserved: number;
  invited: number;
  revenue: number;
  status: "active" | "paused" | "past";
  expanded: boolean;
  image?: string;
};

const initOrgEvents: OrgEvent[] = [
  { id: 1, name: "Neon Beats Festival", location: "Москва, Олимпийский", date: "15 мая 2026", time: "20:00", total: 1000, sold: 880, reserved: 12, invited: 5, revenue: 2816000, status: "active", expanded: false },
  { id: 2, name: "Чемпионат по футболу", location: "СПб, Газпром Арена", date: "22 мая 2026", time: "18:30", total: 45000, sold: 32000, reserved: 800, invited: 200, revenue: 57600000, status: "active", expanded: false },
  { id: 3, name: "Stand Up: Новый сезон", location: "Москва, Comedy Club", date: "1 июня 2026", time: "19:00", total: 300, sold: 120, reserved: 8, invited: 0, revenue: 240000, status: "active", expanded: false },
];

const pastOrgEvents: OrgEvent[] = [
  { id: 10, name: "Stand Up Night", location: "Москва, Comedy Club", date: "12 апр 2025", time: "19:00", total: 300, sold: 298, reserved: 0, invited: 2, revenue: 596000, status: "past", expanded: false },
];

/* ══════════════════════════════════════════════
   BUYER PROFILE
══════════════════════════════════════════════ */
function BuyerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "used">("active");
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);

  const active = mockTickets.filter(t => t.status === "active");
  const used = mockTickets.filter(t => t.status === "used");

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-white/5 flex items-center px-5 gap-4">
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Icon name="Ticket" size={14} className="text-white" />
          </div>
          <span className="font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TicketWave</span>
        </Link>
        <div className="flex-1" />
        <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
        <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass neon-border text-sm text-muted-foreground hover:text-foreground transition-all">
          <Icon name="LogOut" size={13} /> Выйти
        </button>
      </header>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedTicket(null)}>
          <div className="glass rounded-3xl p-6 max-w-sm w-full neon-border card-glow" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div><h3 className="font-bold text-lg">{selectedTicket.event}</h3><p className="text-muted-foreground text-sm">{selectedTicket.id}</p></div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-lg hover:bg-white/5"><Icon name="X" size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="bg-white rounded-2xl p-4 flex items-center justify-center mb-5">
              <QRCodeSVG value={`TICKETWAVE:${selectedTicket.id}:${selectedTicket.event}:${selectedTicket.date}`} size={200} bgColor="#ffffff" fgColor="#1a0533" level="H" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Icon name="Calendar" size={14} />{selectedTicket.date}, {selectedTicket.time}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Icon name="MapPin" size={14} />{selectedTicket.location}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Icon name="Armchair" size={14} />{selectedTicket.seat}</div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Предъяви QR на входе</span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Активен</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 pb-8 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Icon name="User" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user?.name}</h1>
            <span className="text-xs text-violet-400 flex items-center gap-1"><Icon name="Ticket" size={11} /> Покупатель</span>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-6 w-fit">
          {(["active", "used"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "active" ? `Активные (${active.length})` : `Использованные (${used.length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(activeTab === "active" ? active : used).map(ticket => (
            <div key={ticket.id} className={`rounded-2xl overflow-hidden bg-card border border-border transition-all ${ticket.status === "used" ? "opacity-60" : "hover:border-violet-500/40"}`}>
              <div className={`h-1 bg-gradient-to-r ${ticket.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="font-bold text-sm">{ticket.event}</h3><p className="text-muted-foreground text-xs mt-0.5">{ticket.id}</p></div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ticket.status === "used" ? "bg-muted text-muted-foreground" : "bg-green-500/20 text-green-400"}`}>{ticket.status === "used" ? "Использован" : "Активен"}</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="Calendar" size={12} />{ticket.date}, {ticket.time}</div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="MapPin" size={12} />{ticket.location}</div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="Armchair" size={12} />{ticket.seat}</div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-bold text-sm">{ticket.price}</span>
                  {ticket.status === "active" && (
                    <button onClick={() => setSelectedTicket(ticket)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90">
                      <Icon name="QrCode" size={13} /> QR-код
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ORGANIZER PROFILE — TicketsCloud style
══════════════════════════════════════════════ */
const SIDEBAR_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "events", label: "Мероприятия", icon: "Calendar" },
  { id: "orders", label: "Сделки", icon: "ShoppingCart", badge: 40 },
  { id: "promo", label: "Продвижение", icon: "Megaphone" },
  { id: "contractors", label: "Подрядчики", icon: "Users" },
  { id: "analytics", label: "Аналитика", icon: "BarChart2" },
  { id: "money", label: "Деньги", icon: "Wallet" },
  { id: "docs", label: "Документы", icon: "FileText" },
  { id: "settings", label: "Настройки", icon: "Settings" },
  { id: "integrations", label: "Интеграции", icon: "Plug" },
  { id: "scanner", label: "QR-сканер", icon: "ScanLine" },
] as const;

type SidebarId = typeof SIDEBAR_ITEMS[number]["id"];

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function OrgProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarId>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = (id: SidebarId) => { setActiveSection(id); setSidebarOpen(false); };

  return (
    <div className="flex min-h-screen bg-[#0f0f17] text-foreground">
      {/* ── Sidebar ── */}
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full z-50 w-56 bg-[#13131f] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Org name */}
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Организатор</p>
            </div>
            <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => nav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${activeSection === item.id ? "bg-white/8 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/4"}`}
            >
              {activeSection === item.id && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-violet-500" />}
              <Icon name={item.icon} size={16} />
              {item.label}
              {"badge" in item && item.badge ? (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <Icon name="LogOut" size={16} /> Выход
          </button>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TicketWave</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-white/5 bg-[#13131f] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/5">
            <Icon name="Menu" size={20} />
          </button>
          <span className="font-bold text-sm gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TicketWave</span>
        </header>

        <main className="flex-1 p-5 sm:p-7 max-w-6xl w-full">
          {activeSection === "home" && <OrgHome onNav={nav} />}
          {activeSection === "events" && <OrgEvents />}
          {activeSection === "orders" && <OrgOrders />}
          {activeSection === "analytics" && <OrgAnalytics />}
          {activeSection === "money" && <OrgMoney />}
          {activeSection === "scanner" && <QRScanner />}
          {(activeSection === "promo" || activeSection === "contractors" || activeSection === "docs" || activeSection === "settings" || activeSection === "integrations") && <ComingSoon label={SIDEBAR_ITEMS.find(i => i.id === activeSection)?.label ?? ""} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Org Home (Dashboard) ─── */
function OrgHome({ onNav }: { onNav: (id: SidebarId) => void }) {
  const [eventsTab, setEventsTab] = useState<"current" | "past">("current");
  const [events, setEvents] = useState(initOrgEvents);
  const [showWizard, setShowWizard] = useState(false);

  const totalBalance = 137835;
  const totalSold = 163500;
  const totalWithdrawable = 0;
  const incomingOrders = 40;
  const todaySales = 0;

  const toggle = (id: number) => setEvents(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));
  const toggleStatus = (id: number) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "active" ? "paused" : "active" } : e));

  const displayed = eventsTab === "current" ? events.filter(e => e.status !== "past") : pastOrgEvents;

  const handleCreate = (ev: NewEvent) => {
    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";
    setEvents(prev => [...prev, {
      id: Date.now(), name: ev.name,
      location: [ev.city, ev.address].filter(Boolean).join(", "),
      date: dateStr, time: ev.time,
      total: ev.ticketTypes.reduce((s, t) => s + t.quantity, 0),
      sold: 0, reserved: 0, invited: 0, revenue: 0,
      status: "active" as const, expanded: false,
    }]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Главная</h1>
        <CreateButton onOpen={(type) => { setWizardType(type); setShowWizard(true); }} />
      </div>

      {/* Finance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-2">Состояние счёта</p>
          <p className="text-3xl font-bold">{fmt(totalBalance)}</p>
        </div>
        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm text-muted-foreground mb-2">Продано на будущие мероприятия</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold">{fmt(totalSold)}</p>
            <span className="flex items-center gap-1 text-sm text-muted-foreground mb-1"><Icon name="Lock" size={13} /> 100%</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm text-muted-foreground mb-2">Сумма к возврату</p>
            <div className="flex flex-col items-end gap-1">
              <button className="text-xs text-violet-400 hover:underline">Подробнее</button>
              <button className="text-xs text-violet-400 hover:underline">Все возвраты</button>
            </div>
          </div>
          <p className="text-3xl font-bold">0 ₽</p>
        </div>
        {/* Card 4 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-muted-foreground">Доступно к выводу</p>
            <div className="flex gap-2">
              <Icon name="Maximize2" size={14} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              <button className="text-xs text-violet-400 hover:underline">История выводов</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{fmt(totalWithdrawable)}</p>
            <button className="text-sm text-muted-foreground hover:text-foreground">Вывести</button>
          </div>
        </div>
        {/* Card 5 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-muted-foreground">Входящие сделки</p>
            <button className="text-xs text-violet-400 hover:underline">Смотреть</button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{incomingOrders}</p>
          </div>
        </div>
        {/* Card 6 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-muted-foreground">Продажи за сегодня</p>
            <button className="text-xs text-violet-400 hover:underline" onClick={() => onNav("orders")}>Все продажи</button>
          </div>
          <p className="text-3xl font-bold">{fmt(todaySales)}</p>
        </div>
      </div>

      {/* Events tabs */}
      <div className="flex gap-6 border-b border-border mb-0">
        {(["current", "past"] as const).map(t => (
          <button key={t} onClick={() => setEventsTab(t)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${eventsTab === t ? "border-violet-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t === "current" ? "Текущие мероприятия" : "Прошедшие мероприятия"}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="divide-y divide-border border-b border-border">
        {displayed.map(ev => (
          <EventRow key={ev.id} event={ev} onToggle={() => toggle(ev.id)} onToggleStatus={() => toggleStatus(ev.id)} isPast={eventsTab === "past"} />
        ))}
        {displayed.length === 0 && <p className="py-10 text-center text-muted-foreground text-sm">Мероприятий нет</p>}
      </div>

      {showWizard && (
        <CreateEventWizard
          onClose={() => setShowWizard(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ─── Event Row ─── */
function EventRow({ event, onToggle, onToggleStatus, isPast }: { event: OrgEvent; onToggle: () => void; onToggleStatus: () => void; isPast: boolean }) {
  const remaining = event.total - event.sold - event.reserved;

  return (
    <div className="py-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Poster placeholder */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
          <Icon name="Music" size={24} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-0.5">{event.name}</h3>
          <p className="text-sm text-muted-foreground">{event.location}</p>
          <p className="text-sm text-muted-foreground">{event.date}, {event.time}</p>
        </div>

        {!isPast && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onToggleStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${event.status === "active" ? "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20" : "border-green-500/40 text-green-400 hover:bg-green-500/10"}`}
            >
              <Icon name={event.status === "active" ? "Pause" : "Play"} size={12} />
              {event.status === "active" ? "Остановить продажи" : "Запустить продажи"}
            </button>
            <button className="p-1.5 rounded-lg border border-border hover:bg-white/5 text-muted-foreground">
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Details toggle */}
      <button onClick={onToggle} className="flex items-center gap-1.5 mt-3 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
        Показать детали <Icon name={event.expanded ? "ChevronUp" : "ChevronDown"} size={13} />
      </button>

      {event.expanded && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-muted-foreground text-xs">
                <td className="py-2 pr-8 font-medium">Итого:</td>
                <td className="py-2 pr-8 text-right font-medium">Всего билетов</td>
                <td className="py-2 pr-8 text-right font-medium">Осталось</td>
                <td className="py-2 pr-8 text-right font-medium">Продано</td>
                <td className="py-2 pr-8 text-right font-medium">Бронь</td>
                <td className="py-2 pr-8 text-right font-medium">Пригласительные</td>
                <td className="py-2 text-right font-medium">Сумма продаж</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-8 text-muted-foreground text-xs">Итого:</td>
                <td className="py-2 pr-8 text-right font-semibold">{event.total.toLocaleString("ru")}</td>
                <td className="py-2 pr-8 text-right font-semibold">{remaining.toLocaleString("ru")}</td>
                <td className="py-2 pr-8 text-right font-semibold">{event.sold.toLocaleString("ru")}</td>
                <td className="py-2 pr-8 text-right font-semibold">{event.reserved}</td>
                <td className="py-2 pr-8 text-right font-semibold">{event.invited}</td>
                <td className="py-2 text-right font-semibold text-green-400">{fmt(event.revenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Create button with dropdown ─── */
function CreateButton({ onOpen }: { onOpen: (type: NewEvent["type"]) => void }) {
  const [open, setOpen] = useState(false);
  const types: { id: NewEvent["type"]; label: string }[] = [
    { id: "single", label: "Одиночное мероприятие" },
    { id: "periodic", label: "Периодическое мероприятие" },
    { id: "non-periodic", label: "Непериодическое мероприятие" },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold transition-colors"
      >
        Создать <Icon name="ChevronDown" size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-[#1a1a2e] border border-border rounded-2xl shadow-2xl py-2">
            {types.map(t => (
              <button key={t.id} onClick={() => { setOpen(false); onOpen(t.id); }}
                className="w-full text-left px-5 py-3 text-sm hover:bg-white/5 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Org Events section ─── */
function OrgEvents() {
  const [events, setEvents] = useState(initOrgEvents);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardType, setWizardType] = useState<NewEvent["type"]>("single");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "board">("list");

  const toggle = (id: number) => setEvents(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));
  const toggleStatus = (id: number) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "active" ? "paused" : "active" } : e));

  const handleCreate = (ev: NewEvent) => {
    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";
    setEvents(prev => [...prev, {
      id: Date.now(), name: ev.name,
      location: [ev.city, ev.address].filter(Boolean).join(", "),
      date: dateStr, time: ev.time,
      total: ev.ticketTypes.reduce((s, t) => s + t.quantity, 0),
      sold: 0, reserved: 0, invited: 0, revenue: 0,
      status: "active" as const, expanded: false,
    }]);
  };

  const filtered = events.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  const quickFilters = ["Текущие мероприятия", "Пройдут в этом месяце", "Пройдут в следующем месяце"];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Мероприятия</h1>
        <CreateButton onOpen={(type) => { setWizardType(type); setShowWizard(true); }} />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск"
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Статус</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">Все</option>
            <option value="active">В продаже</option>
            <option value="paused">Остановлено</option>
          </select>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-violet-500/20 text-violet-400" : "text-muted-foreground hover:bg-white/5"}`}>
            <Icon name="List" size={16} />
          </button>
          <button onClick={() => setView("board")} className={`p-2 rounded-lg transition-colors ${view === "board" ? "bg-violet-500/20 text-violet-400" : "text-muted-foreground hover:bg-white/5"}`}>
            <Icon name="LayoutGrid" size={16} />
          </button>
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-xs text-muted-foreground self-center">Быстрые фильтры:</span>
        {quickFilters.map(f => (
          <button key={f} onClick={() => setQuickFilter(quickFilter === f ? null : f)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${quickFilter === f ? "border-violet-500 bg-violet-500/15 text-violet-400" : "border-border text-muted-foreground hover:text-foreground hover:border-white/20"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs text-muted-foreground font-medium">
          <span>Название</span>
          <span>Статус</span>
          <span>Город</span>
          <span></span>
          <span></span>
        </div>

        <div className="divide-y divide-border">
          {filtered.map(ev => (
            <div key={ev.id} className="px-5 py-4">
              <div className="flex items-start gap-4">
                {/* Poster */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Music" size={22} className="text-white" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight mb-0.5">{ev.name}</h3>
                  <p className="text-xs text-muted-foreground">{ev.location}</p>
                  <p className="text-xs text-muted-foreground">{ev.date}{ev.time ? `, ${ev.time}` : ""}</p>
                </div>
                {/* Status badge */}
                <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-semibold hidden sm:inline-flex items-center gap-1 ${ev.status === "active" ? "bg-blue-600 text-white" : ev.status === "paused" ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"}`}>
                  {ev.status === "active" ? "В продаже" : ev.status === "paused" ? "Остановлено" : "Прошло"}
                </span>
                {/* City */}
                <span className="hidden lg:block text-sm text-muted-foreground flex-shrink-0 w-24 truncate">
                  {ev.location.split(",")[0]}
                </span>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleStatus(ev.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
                  >
                    <Icon name={ev.status === "active" ? "Pause" : "Play"} size={11} />
                    {ev.status === "active" ? "Остановить" : "Запустить"}
                  </button>
                  <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors">
                    Виджет
                  </button>
                </div>
              </div>

              {/* Details expand */}
              <button onClick={() => toggle(ev.id)}
                className="flex items-center gap-1.5 mt-3 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Показать детали <Icon name={ev.expanded ? "ChevronUp" : "ChevronDown"} size={12} />
              </button>

              {ev.expanded && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs">
                    <thead className="border-b border-border bg-secondary/30">
                      <tr className="text-muted-foreground">
                        <td className="px-4 py-2 font-medium"></td>
                        <td className="px-4 py-2 font-medium text-right">Всего билетов</td>
                        <td className="px-4 py-2 font-medium text-right">Осталось</td>
                        <td className="px-4 py-2 font-medium text-right">Продано</td>
                        <td className="px-4 py-2 font-medium text-right">Бронь</td>
                        <td className="px-4 py-2 font-medium text-right">Пригласительные</td>
                        <td className="px-4 py-2 font-medium text-right">Сумма продаж</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-muted-foreground font-medium">Итого:</td>
                        <td className="px-4 py-3 text-right font-semibold">{ev.total.toLocaleString("ru")}</td>
                        <td className="px-4 py-3 text-right font-semibold">{(ev.total - ev.sold - ev.reserved).toLocaleString("ru")}</td>
                        <td className="px-4 py-3 text-right font-semibold">{ev.sold.toLocaleString("ru")}</td>
                        <td className="px-4 py-3 text-right font-semibold">{ev.reserved}</td>
                        <td className="px-4 py-3 text-right font-semibold">{ev.invited}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-400">{fmt(ev.revenue)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              <Icon name="Calendar" size={32} className="mx-auto mb-3 opacity-30" />
              <p>Мероприятий не найдено</p>
            </div>
          )}
        </div>
      </div>

      {showWizard && (
        <CreateEventWizard
          onClose={() => setShowWizard(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ─── Orders ─── */
function OrgOrders() {
  const orders = [
    { id: "ORD-0001", event: "Neon Beats Festival", buyer: "Алексей К.", date: "30 апр 2026", tickets: 2, total: 6400, status: "paid" },
    { id: "ORD-0002", event: "Чемпионат по футболу", buyer: "Мария В.", date: "29 апр 2026", tickets: 4, total: 7200, status: "paid" },
    { id: "ORD-0003", event: "Stand Up: Новый сезон", buyer: "Сергей П.", date: "28 апр 2026", tickets: 1, total: 2000, status: "refund" },
    { id: "ORD-0004", event: "Neon Beats Festival", buyer: "Ольга М.", date: "27 апр 2026", tickets: 3, total: 9600, status: "paid" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Сделки</h1>
        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">40</span>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Заказ</th>
              <th className="text-left px-5 py-3 font-medium">Мероприятие</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Покупатель</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Дата</th>
              <th className="text-right px-5 py-3 font-medium">Сумма</th>
              <th className="text-right px-5 py-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                <td className="px-5 py-3 font-medium">{o.event}</td>
                <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{o.buyer}</td>
                <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{o.date}</td>
                <td className="px-5 py-3 text-right font-semibold">{fmt(o.total)}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${o.status === "paid" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                    {o.status === "paid" ? "Оплачен" : "Возврат"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Analytics ─── */
function OrgAnalytics() {
  const data = [
    { month: "Янв", sales: 320 }, { month: "Фев", sales: 480 }, { month: "Мар", sales: 390 },
    { month: "Апр", sales: 720 }, { month: "Май", sales: 880 }, { month: "Июн", sales: 610 },
  ];
  const max = Math.max(...data.map(d => d.sales));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Аналитика</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5"><p className="text-sm text-muted-foreground mb-1">Конверсия</p><p className="text-3xl font-bold">3.8%</p></div>
        <div className="bg-card border border-border rounded-2xl p-5"><p className="text-sm text-muted-foreground mb-1">Средний чек</p><p className="text-3xl font-bold">2 400 ₽</p></div>
        <div className="bg-card border border-border rounded-2xl p-5"><p className="text-sm text-muted-foreground mb-1">Повторные покупки</p><p className="text-3xl font-bold">34%</p></div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-6">Продажи по месяцам</h3>
        <div className="flex items-end gap-3 h-40">
          {data.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{d.sales}</span>
              <div className="w-full rounded-t-lg bg-violet-600/80 transition-all" style={{ height: `${(d.sales / max) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Money ─── */
function OrgMoney() {
  const txns = [
    { date: "30 апр", desc: "Продажа билетов — Neon Beats Festival", amount: 12800, type: "income" },
    { date: "28 апр", desc: "Продажа билетов — Чемпионат", amount: 36000, type: "income" },
    { date: "25 апр", desc: "Возврат — Stand Up Night", amount: -2000, type: "refund" },
    { date: "20 апр", desc: "Вывод средств", amount: -50000, type: "withdraw" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Деньги</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Баланс счёта</p>
          <p className="text-3xl font-bold">137 835 ₽</p>
          <button className="mt-3 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">Вывести</button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Продано (заморожено)</p>
          <p className="text-3xl font-bold">163 500 ₽</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Icon name="Lock" size={12} /> Поступит после мероприятия</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold">История операций</h3>
        </div>
        <div className="divide-y divide-border">
          {txns.map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === "income" ? "bg-green-500/15" : t.type === "refund" ? "bg-red-500/15" : "bg-muted"}`}>
                <Icon name={t.type === "income" ? "ArrowDownLeft" : t.type === "refund" ? "RotateCcw" : "ArrowUpRight"} size={14} className={t.type === "income" ? "text-green-400" : t.type === "refund" ? "text-red-400" : "text-muted-foreground"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.desc}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <span className={`font-semibold text-sm flex-shrink-0 ${t.amount > 0 ? "text-green-400" : "text-muted-foreground"}`}>
                {t.amount > 0 ? "+" : ""}{fmt(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── QR Scanner ─── */
function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ id: string; event: string; status: string } | null>(null);
  const [error, setError] = useState("");
  const [lastScan, setLastScan] = useState("");

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(""); setResult(null); setLastScan("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setScanning(true);
      intervalRef.current = setInterval(() => {
        const video = videoRef.current; const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d"); if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data !== lastScan) {
          setLastScan(code.data);
          const parts = code.data.split(":");
          setResult(parts[0] === "TICKETWAVE" ? { id: parts[1], event: parts[2], status: "Действителен" } : { id: code.data, event: "Неизвестный билет", status: "Не найден" });
        }
      }, 400);
    } catch { setError("Нет доступа к камере. Разрешите доступ в браузере."); }
  }, [lastScan]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>QR-сканер</h1>
      <p className="text-muted-foreground text-sm mb-6">Сканируй билеты на входе мероприятия</p>
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div className="relative bg-black aspect-square max-h-72 flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon name="Camera" size={48} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Камера выключена</p>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-violet-400 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-violet-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-violet-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-violet-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-violet-400 rounded-br-xl" />
              </div>
            </div>
          )}
        </div>
        {result && (
          <div className={`p-4 border-t border-border ${result.status === "Действителен" ? "bg-green-500/10" : "bg-red-500/10"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.status === "Действителен" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                <Icon name={result.status === "Действителен" ? "CheckCircle" : "XCircle"} size={20} className={result.status === "Действителен" ? "text-green-400" : "text-red-400"} />
              </div>
              <div>
                <p className="font-bold text-sm">{result.status}</p>
                <p className="text-muted-foreground text-xs">{result.id} · {result.event}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      <button onClick={scanning ? stopCamera : startCamera}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${scanning ? "bg-card border border-border text-foreground hover:bg-white/5" : "bg-violet-600 hover:bg-violet-500 text-white"}`}>
        <Icon name={scanning ? "CameraOff" : "ScanLine"} size={16} />
        {scanning ? "Остановить сканер" : "Запустить сканер"}
      </button>
    </div>
  );
}

/* ─── Coming Soon ─── */
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
        <Icon name="Construction" size={24} className="text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold mb-2">{label}</h2>
      <p className="text-muted-foreground text-sm">Раздел в разработке</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════ */
export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="glass neon-border rounded-3xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Icon name="Lock" size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Войдите в аккаунт</h2>
          <p className="text-muted-foreground mb-6">Для доступа к личному кабинету необходима авторизация</p>
          <button onClick={() => navigate("/login")} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Войти / Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  return user.role === "organizer" ? <OrgProfile /> : <BuyerProfile />;
}