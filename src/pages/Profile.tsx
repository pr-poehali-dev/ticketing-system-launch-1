import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import jsQR from "jsqr";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

/* ─── Mock data ─── */
const mockTickets = [
  { id: "TW-2026-001", event: "Neon Beats Festival", date: "15 мая 2026", time: "20:00", location: "Москва, Олимпийский", seat: "Сектор A, ряд 5, место 12", price: "3 200 ₽", status: "active", color: "from-violet-500 to-pink-500" },
  { id: "TW-2026-002", event: "Чемпионат по футболу", date: "22 мая 2026", time: "18:30", location: "СПб, Газпром Арена", seat: "Северная трибуна, ряд 10, место 7", price: "1 800 ₽", status: "active", color: "from-blue-500 to-cyan-500" },
  { id: "TW-2025-087", event: "Stand Up Night", date: "12 апр 2025", time: "19:00", location: "Москва, Comedy Club", seat: "VIP зона, стол 3", price: "2 000 ₽", status: "used", color: "from-green-500 to-teal-500" },
];

const crmStats = [
  { label: "Продано билетов", value: "3 842", change: "+12%", icon: "Ticket", color: "from-violet-500 to-pink-500" },
  { label: "Выручка за месяц", value: "₽ 9.2M", change: "+8%", icon: "TrendingUp", color: "from-blue-500 to-cyan-500" },
  { label: "Активных событий", value: "24", change: "+3", icon: "Calendar", color: "from-amber-500 to-orange-500" },
  { label: "Покупателей", value: "1 201", change: "+156", icon: "Users", color: "from-green-500 to-teal-500" },
];

const initTasks = [
  { id: 1, title: "Разместить рекламу Neon Beats", assignee: "Анна К.", deadline: "12 мая", status: "todo", event: "Neon Beats Festival" },
  { id: 2, title: "Согласовать схему зала", assignee: "Дмитрий В.", deadline: "10 мая", status: "inprogress", event: "Чемпионат по футболу" },
  { id: 3, title: "Настроить сканеры входа", assignee: "Сергей Л.", deadline: "14 мая", status: "inprogress", event: "Neon Beats Festival" },
  { id: 4, title: "Отчёт по продажам апрель", assignee: "Анна К.", deadline: "5 мая", status: "done", event: "" },
];

const orgEvents = [
  { id: 1, name: "Neon Beats Festival", date: "15 мая 2026", sold: 880, total: 1000, revenue: "2.2M", status: "active" },
  { id: 2, name: "Чемпионат по футболу", date: "22 мая 2026", sold: 32000, total: 45000, revenue: "5.8M", status: "active" },
  { id: 3, name: "Stand Up: Новый сезон", date: "1 июня 2026", sold: 120, total: 300, revenue: "96K", status: "active" },
];

const ZONE_COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
type Zone = { id: number; name: string; x: number; y: number; w: number; h: number; color: string };

const DEFAULT_ZONES: Zone[] = [
  { id: 1, name: "Сцена", x: 280, y: 20, w: 240, h: 80, color: "#8B5CF6" },
  { id: 2, name: "Танцпол", x: 160, y: 140, w: 480, h: 200, color: "#EC4899" },
  { id: 3, name: "VIP Лево", x: 20, y: 140, w: 120, h: 200, color: "#F59E0B" },
  { id: 4, name: "VIP Право", x: 660, y: 140, w: 120, h: 200, color: "#F59E0B" },
  { id: 5, name: "Бар", x: 20, y: 380, w: 160, h: 80, color: "#10B981" },
  { id: 6, name: "Вход", x: 300, y: 460, w: 200, h: 60, color: "#06B6D4" },
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
      <Navbar />

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedTicket(null)}>
          <div className="glass rounded-3xl p-6 max-w-sm w-full neon-border card-glow animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">{selectedTicket.event}</h3>
                <p className="text-muted-foreground text-sm">{selectedTicket.id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-lg hover:bg-white/5">
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
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

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="glass neon-border rounded-3xl p-5 mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
              <Icon name="User" size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user?.name}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs text-violet-400 mt-1">
              <Icon name="Ticket" size={11} /> Покупатель
            </span>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass neon-border text-sm text-muted-foreground hover:text-foreground transition-all">
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl neon-border mb-6 w-fit">
          {(["active", "used"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === t ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "active" ? `Активные (${active.length})` : `Использованные (${used.length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(activeTab === "active" ? active : used).map((ticket) => (
            <div key={ticket.id} className={`rounded-2xl overflow-hidden glass transition-all ${ticket.status === "used" ? "opacity-60" : "neon-border hover:card-glow"}`}>
              <div className={`h-1.5 bg-gradient-to-r ${ticket.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm">{ticket.event}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{ticket.id}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ticket.status === "used" ? "bg-muted text-muted-foreground" : "bg-green-500/20 text-green-400"}`}>
                    {ticket.status === "used" ? "Использован" : "Активен"}
                  </span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="Calendar" size={12} />{ticket.date}, {ticket.time}</div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="MapPin" size={12} />{ticket.location}</div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon name="Armchair" size={12} />{ticket.seat}</div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════
   ORGANIZER PROFILE (CRM)
══════════════════════════════════════════════ */
const ORG_TABS = ["Дашборд", "События", "Задачи", "Сканер", "Схемы"] as const;
type OrgTab = typeof ORG_TABS[number];

function OrgProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrgTab>("Дашборд");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] border-r border-white/5 bg-card/50 p-4 sticky top-16">
          {/* User card */}
          <div className="glass neon-border rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Icon name="Building2" size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <span className="text-xs text-amber-400 flex items-center gap-1"><Icon name="Crown" size={10} />Организатор</span>
              </div>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground transition-all">
              <Icon name="LogOut" size={12} /> Выйти
            </button>
          </div>

          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 px-2">Управление</p>
          {ORG_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${activeTab === tab ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
            >
              <Icon name={tab === "Дашборд" ? "LayoutDashboard" : tab === "События" ? "Calendar" : tab === "Задачи" ? "CheckSquare" : tab === "Сканер" ? "ScanLine" : "Map"} size={16} />
              {tab}
            </button>
          ))}
        </aside>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5 px-1 py-2 flex justify-around">
          {ORG_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${activeTab === tab ? "text-amber-400" : "text-muted-foreground"}`}>
              <Icon name={tab === "Дашборд" ? "LayoutDashboard" : tab === "События" ? "Calendar" : tab === "Задачи" ? "CheckSquare" : tab === "Сканер" ? "ScanLine" : "Map"} size={18} />
              {tab}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl overflow-x-hidden">
          {activeTab === "Дашборд" && <OrgDashboard />}
          {activeTab === "События" && <OrgEvents />}
          {activeTab === "Задачи" && <OrgTasks />}
          {activeTab === "Сканер" && <QRScanner />}
          {activeTab === "Схемы" && <VenueScheme />}
        </main>
      </div>
    </div>
  );
}

/* ─── Org Dashboard ─── */
function OrgDashboard() {
  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          CRM <span className="gradient-text">Дашборд</span>
        </h1>
        <p className="text-muted-foreground mt-1">Сегодня, 30 апреля 2026</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {crmStats.map((s) => (
          <div key={s.label} className="glass neon-border rounded-2xl p-4 hover:card-glow transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
            <p className="text-green-400 text-xs mt-1 font-medium">{s.change}</p>
          </div>
        ))}
      </div>
      <div className="glass neon-border rounded-2xl p-5">
        <h3 className="font-bold mb-4">Продажи по событиям</h3>
        <div className="space-y-4">
          {orgEvents.map((e) => {
            const pct = Math.round((e.sold / e.total) * 100);
            return (
              <div key={e.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{e.name}</span>
                  <span className="text-muted-foreground">₽{e.revenue} · {pct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Org Events ─── */
function OrgEvents() {
  const [showAdd, setShowAdd] = useState(false);
  const [events, setEvents] = useState(orgEvents);
  const [form, setForm] = useState({ name: "", date: "", total: "", status: "active" });

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    setEvents([...events, { id: Date.now(), name: form.name, date: form.date, sold: 0, total: Number(form.total) || 500, revenue: "0", status: form.status as "active" | "soon" }]);
    setForm({ name: "", date: "", total: "", status: "active" });
    setShowAdd(false);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Мои события</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90">
          <Icon name="Plus" size={14} /> Создать
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addEvent} className="glass neon-border rounded-2xl p-5 mb-6 animate-slide-up">
          <h3 className="font-bold mb-4">Новое событие</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input required placeholder="Название события" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <input type="number" placeholder="Кол-во мест" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
              <option value="active">Активно</option>
              <option value="soon">Скоро</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90">Создать</button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground">Отмена</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {events.map((e) => {
          const pct = Math.round((e.sold / e.total) * 100);
          return (
            <div key={e.id} className="glass neon-border rounded-2xl p-5 hover:card-glow transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{e.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "active" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {e.status === "active" ? "Активно" : "Скоро"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{e.date}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div><p className="text-xl font-bold">{e.sold.toLocaleString()}</p><p className="text-xs text-muted-foreground">Продано</p></div>
                  <div><p className="text-xl font-bold text-amber-400">₽{e.revenue}</p><p className="text-xs text-muted-foreground">Выручка</p></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{e.sold.toLocaleString()} из {e.total.toLocaleString()} билетов</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Org Tasks ─── */
function OrgTasks() {
  const [tasks, setTasks] = useState(initTasks);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", assignee: "", deadline: "", status: "todo" });

  const addTask = () => {
    if (!form.title) return;
    setTasks([...tasks, { ...form, id: Date.now(), event: "" }]);
    setForm({ title: "", assignee: "", deadline: "", status: "todo" });
    setShowAdd(false);
  };

  const cols = ["todo", "inprogress", "done"] as const;
  const colLabel: Record<string, string> = { todo: "К выполнению", inprogress: "В работе", done: "Готово" };
  const colDot: Record<string, string> = { todo: "bg-muted-foreground", inprogress: "bg-blue-400", done: "bg-green-400" };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Задачи</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90">
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </div>

      {showAdd && (
        <div className="glass neon-border rounded-2xl p-4 mb-5 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input placeholder="Название задачи" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <input placeholder="Исполнитель" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
              <option value="todo">К выполнению</option>
              <option value="inprogress">В работе</option>
              <option value="done">Готово</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addTask} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90">Сохранить</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground">Отмена</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map((col) => (
          <div key={col} className="glass rounded-2xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${colDot[col]}`} />
              <span className="font-semibold text-sm">{colLabel[col]}</span>
              <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === col).length}</span>
            </div>
            <div className="space-y-2">
              {tasks.filter(t => t.status === col).map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <p className="text-sm font-medium mb-1">{t.title}</p>
                  {t.event && <p className="text-xs text-amber-400 mb-1">{t.event}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{t.assignee}</p>
                    {t.deadline && <p className="text-xs text-muted-foreground">{t.deadline}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
    <div className="animate-slide-up max-w-lg">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>QR-сканер</h1>
      <p className="text-muted-foreground text-sm mb-6">Сканируй билеты на входе мероприятия</p>
      <div className="glass neon-border rounded-3xl overflow-hidden mb-4">
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
              <div className="w-48 h-48 border-2 border-primary rounded-2xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
              </div>
            </div>
          )}
        </div>
        {result && (
          <div className={`p-4 border-t border-white/10 ${result.status === "Действителен" ? "bg-green-500/10" : "bg-red-500/10"}`}>
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
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${scanning ? "glass neon-border text-foreground" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"}`}>
        <Icon name={scanning ? "CameraOff" : "ScanLine"} size={16} />
        {scanning ? "Остановить сканер" : "Запустить сканер"}
      </button>
    </div>
  );
}

/* ─── Venue Scheme ─── */
function VenueScheme() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [selected, setSelected] = useState<number | null>(null);
  const [venueName, setVenueName] = useState("Клуб Арена");
  const [dragging, setDragging] = useState<{ id: number; ox: number; oy: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#0a0a12"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    zones.forEach((z) => {
      const isSel = z.id === selected;
      ctx.save(); ctx.shadowColor = z.color; ctx.shadowBlur = isSel ? 20 : 8;
      ctx.fillStyle = z.color + "44"; ctx.strokeStyle = z.color; ctx.lineWidth = isSel ? 3 : 1.5;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(z.x + r, z.y); ctx.lineTo(z.x + z.w - r, z.y); ctx.quadraticCurveTo(z.x + z.w, z.y, z.x + z.w, z.y + r);
      ctx.lineTo(z.x + z.w, z.y + z.h - r); ctx.quadraticCurveTo(z.x + z.w, z.y + z.h, z.x + z.w - r, z.y + z.h);
      ctx.lineTo(z.x + r, z.y + z.h); ctx.quadraticCurveTo(z.x, z.y + z.h, z.x, z.y + z.h - r);
      ctx.lineTo(z.x, z.y + r); ctx.quadraticCurveTo(z.x, z.y, z.x + r, z.y);
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px Inter,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(z.name, z.x + z.w / 2, z.y + z.h / 2);
    });
  }, [zones, selected]);

  useEffect(() => { draw(); }, [draw]);

  const zoneAt = (x: number, y: number) => [...zones].reverse().find(z => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h);

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = canvasRef.current!.width / rect.width;
    const sy = canvasRef.current!.height / rect.height;
    const x = (e.clientX - rect.left) * sx;
    const y = (e.clientY - rect.top) * sy;
    const zone = zoneAt(x, y);
    if (zone) { setSelected(zone.id); setDragging({ id: zone.id, ox: x - zone.x, oy: y - zone.y }); }
    else setSelected(null);
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = canvasRef.current!.width / rect.width;
    const sy = canvasRef.current!.height / rect.height;
    const x = (e.clientX - rect.left) * sx - dragging.ox;
    const y = (e.clientY - rect.top) * sy - dragging.oy;
    setZones(prev => prev.map(z => z.id === dragging.id ? { ...z, x: Math.max(0, x), y: Math.max(0, y) } : z));
  };

  const selZone = zones.find(z => z.id === selected);
  const updateZone = (patch: Partial<Zone>) => setZones(zones.map(z => z.id === selected ? { ...z, ...patch } : z));
  const addZone = () => { const id = Date.now(); setZones([...zones, { id, name: "Зона " + (zones.length + 1), x: 100, y: 100, w: 120, h: 80, color: ZONE_COLORS[zones.length % ZONE_COLORS.length] }]); setSelected(id); };
  const removeZone = (id: number) => { setZones(zones.filter(z => z.id !== id)); if (selected === id) setSelected(null); };
  const exportPNG = () => { const a = document.createElement("a"); a.download = `${venueName}.png`; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Схемы площадок</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Перетаскивай зоны для редактирования</p>
        </div>
        <button onClick={exportPNG} className="flex items-center gap-2 px-4 py-2 rounded-xl glass neon-border text-sm text-foreground hover:bg-white/5 transition-colors">
          <Icon name="Download" size={14} /> PNG
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="glass neon-border rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
              <input value={venueName} onChange={e => setVenueName(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none" />
              <button onClick={addZone} className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium hover:opacity-90">
                <Icon name="Plus" size={12} /> Зона
              </button>
            </div>
            <canvas ref={canvasRef} width={800} height={560} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)} className="w-full cursor-grab active:cursor-grabbing" style={{ maxHeight: "420px" }} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="glass neon-border rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Зоны ({zones.length})</h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {zones.map(z => (
                <div key={z.id} onClick={() => setSelected(z.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${selected === z.id ? "bg-amber-500/10 border border-amber-500/30" : "hover:bg-secondary/40"}`}>
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: z.color }} />
                  <span className="text-sm flex-1 truncate">{z.name}</span>
                  <button onClick={e => { e.stopPropagation(); removeZone(z.id); }} className="text-muted-foreground hover:text-red-400"><Icon name="Trash2" size={12} /></button>
                </div>
              ))}
            </div>
          </div>
          {selZone && (
            <div className="glass rounded-2xl border border-amber-500/20 p-4 animate-slide-up">
              <h3 className="font-bold text-sm mb-3">Редактор зоны</h3>
              <div className="space-y-2">
                <input value={selZone.name} onChange={e => updateZone({ name: e.target.value })} className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={selZone.w} onChange={e => updateZone({ w: +e.target.value })} placeholder="Ширина" className="bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                  <input type="number" value={selZone.h} onChange={e => updateZone({ h: +e.target.value })} placeholder="Высота" className="bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {ZONE_COLORS.map(c => (
                    <button key={c} onClick={() => updateZone({ color: c })} className={`w-7 h-7 rounded-lg hover:scale-110 transition-transform ${selZone.color === c ? "ring-2 ring-white ring-offset-1 ring-offset-background" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center px-4">
          <div className="glass neon-border rounded-3xl p-10 max-w-md w-full text-center animate-slide-up">
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
      </div>
    );
  }

  return user.role === "organizer" ? <OrgProfile /> : <BuyerProfile />;
}
