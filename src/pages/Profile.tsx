import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const mockTickets = [
  {
    id: "TW-2026-001",
    event: "Neon Beats Festival",
    date: "15 мая 2026",
    time: "20:00",
    location: "Москва, Олимпийский",
    seat: "Сектор A, ряд 5, место 12",
    price: "3 200 ₽",
    status: "active",
    category: "Музыка",
    color: "from-violet-500 to-pink-500",
  },
  {
    id: "TW-2026-002",
    event: "Чемпионат по футболу",
    date: "22 мая 2026",
    time: "18:30",
    location: "СПб, Газпром Арена",
    seat: "Северная трибуна, ряд 10, место 7",
    price: "1 800 ₽",
    status: "active",
    category: "Спорт",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "TW-2025-087",
    event: "Stand Up Night",
    date: "12 апреля 2025",
    time: "19:00",
    location: "Москва, Comedy Club",
    seat: "VIP зона, стол 3",
    price: "2 000 ₽",
    status: "used",
    category: "Стендап",
    color: "from-green-500 to-teal-500",
  },
];

const tabs = ["Мои билеты", "Профиль", "История"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Мои билеты");
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [isLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center px-4">
          <div className="glass neon-border rounded-3xl p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Icon name="User" size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Войдите в аккаунт</h2>
            <p className="text-muted-foreground mb-6">Чтобы видеть свои билеты и историю покупок</p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity">
              Войти / Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTickets = mockTickets.filter((t) => t.status === "active");
  const usedTickets = mockTickets.filter((t) => t.status === "used");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* QR Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="glass rounded-3xl p-6 max-w-sm w-full neon-border card-glow animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">{selectedTicket.event}</h3>
                <p className="text-muted-foreground text-sm">{selectedTicket.id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center justify-center mb-5">
              <QRCodeSVG
                value={`TICKETWAVE:${selectedTicket.id}:${selectedTicket.event}:${selectedTicket.date}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#1a0533"
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Calendar" size={14} />
                {selectedTicket.date}, {selectedTicket.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="MapPin" size={14} />
                {selectedTicket.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Armchair" size={14} />
                {selectedTicket.seat}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Предъяви QR на входе</span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Активен</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="glass neon-border rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
              <Icon name="User" size={28} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Александр Иванов</h1>
            <p className="text-muted-foreground text-sm">alex.ivanov@email.com</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-muted-foreground"><span className="text-foreground font-semibold">{activeTickets.length}</span> активных билета</span>
              <span className="text-xs text-muted-foreground"><span className="text-foreground font-semibold">{mockTickets.length}</span> всего покупок</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl glass neon-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors flex items-center gap-2">
            <Icon name="Settings" size={14} />
            Настройки
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl neon-border mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* My Tickets Tab */}
        {activeTab === "Мои билеты" && (
          <div>
            {activeTickets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Активные билеты
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onShowQR={() => setSelectedTicket(ticket)} />
                  ))}
                </div>
              </div>
            )}

            {usedTickets.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-muted-foreground">Использованные</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {usedTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onShowQR={() => {}} used />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "Профиль" && (
          <div className="glass neon-border rounded-3xl p-6 max-w-lg">
            <h2 className="font-bold text-lg mb-6">Личные данные</h2>
            <div className="space-y-4">
              {[
                { label: "Имя", value: "Александр Иванов", icon: "User" },
                { label: "Email", value: "alex.ivanov@email.com", icon: "Mail" },
                { label: "Телефон", value: "+7 999 123-45-67", icon: "Phone" },
                { label: "Город", value: "Москва", icon: "MapPin" },
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground">
                    <Icon name={field.icon} size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium">{field.value}</p>
                  </div>
                  <button className="ml-auto text-muted-foreground hover:text-foreground">
                    <Icon name="Pencil" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity">
              Сохранить изменения
            </button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "История" && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg mb-4">История покупок</h2>
            {mockTickets.map((ticket) => (
              <div key={ticket.id} className="glass neon-border rounded-2xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ticket.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name="Ticket" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ticket.event}</p>
                  <p className="text-muted-foreground text-xs">{ticket.date} • {ticket.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">{ticket.price}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ticket.status === "active" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {ticket.status === "active" ? "Активен" : "Использован"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function TicketCard({
  ticket,
  onShowQR,
  used = false,
}: {
  ticket: typeof mockTickets[0];
  onShowQR: () => void;
  used?: boolean;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden glass transition-all ${used ? "opacity-60" : "neon-border hover:card-glow"}`}>
      <div className={`h-1.5 bg-gradient-to-r ${ticket.color}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm">{ticket.event}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">{ticket.id}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            used ? "bg-muted text-muted-foreground" : "bg-green-500/20 text-green-400"
          }`}>
            {used ? "Использован" : "Активен"}
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Icon name="Calendar" size={12} />
            {ticket.date}, {ticket.time}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Icon name="MapPin" size={12} />
            {ticket.location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Icon name="Armchair" size={12} />
            {ticket.seat}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="font-bold text-sm">{ticket.price}</span>
          {!used && (
            <button
              onClick={onShowQR}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Icon name="QrCode" size={13} />
              QR-код
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
