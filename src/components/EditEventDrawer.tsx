import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { OrgEvent } from "@/types/event";

/* ─── Ticket type ─── */
type TicketType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const AGE_LIMITS = ["0+", "6+", "12+", "16+", "18+", "21+"];

const TABS = ["Основное", "Место и дата", "Билеты", "Описание", "Настройки"] as const;
type Tab = typeof TABS[number];

export default function EditEventDrawer({
  event,
  onClose,
  onSave,
}: {
  event: OrgEvent;
  onClose: () => void;
  onSave: (updated: OrgEvent) => void;
}) {
  const [tab, setTab] = useState<Tab>("Основное");
  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [city, setCity] = useState(event.location.split(",")[0]?.trim() ?? "");
  const [address, setAddress] = useState(event.location.split(",").slice(1).join(",").trim() ?? "");
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [ageLimit, setAgeLimit] = useState("18+");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 1, name: "Стандартный", price: 2000, quantity: event.total },
  ]);
  const [published, setPublished] = useState(event.status === "active");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(URL.createObjectURL(file));
  };

  const addTicket = () =>
    setTickets(prev => [...prev, { id: Date.now(), name: "", price: 0, quantity: 50 }]);

  const updateTicket = (id: number, p: Partial<TicketType>) =>
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...p } : t));

  const removeTicket = (id: number) =>
    setTickets(prev => prev.filter(t => t.id !== id));

  const handleSave = () => {
    onSave({
      ...event,
      name,
      location: [city, address].filter(Boolean).join(", ") || location,
      date,
      time,
      total: tickets.reduce((s, t) => s + t.quantity, 0),
      status: published ? "active" : "paused",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-2xl bg-[#13131f] border-l border-white/5 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base truncate">{name || "Без названия"}</h1>
            <p className="text-xs text-muted-foreground">Редактирование мероприятия</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Published toggle */}
            <button
              onClick={() => setPublished(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${published ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-400" : "bg-muted-foreground"}`} />
              {published ? "Опубликовано" : "Скрыто"}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-amber-400 hover:bg-amber-300 text-black"}`}
            >
              {saved ? <><Icon name="Check" size={14} /> Сохранено</> : "Сохранить"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-white/5 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t ? "border-amber-400 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* ── Основное ── */}
          {tab === "Основное" && (
            <>
              {/* Cover */}
              <div>
                <label className="text-sm font-medium block mb-2">Обложка</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                {cover ? (
                  <div className="relative rounded-xl overflow-hidden border border-border h-40">
                    <img src={cover} alt="cover" className="w-full h-full object-cover" />
                    <button onClick={() => setCover(null)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-border hover:border-amber-400/40 hover:bg-amber-400/5 transition-all text-sm text-muted-foreground justify-center"
                  >
                    <Icon name="ImagePlus" size={20} /> Загрузить обложку
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Рекомендуемое разрешение 1500×900 px, до 15 МБ</p>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium block mb-2">Название <span className="text-red-400">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-muted-foreground"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-sm font-medium block mb-3">Возрастное ограничение</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_LIMITS.map(a => (
                    <button key={a} onClick={() => setAgeLimit(a)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${ageLimit === a ? "border-amber-400 bg-amber-400/15 text-amber-400" : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="text-sm font-medium block mb-3">Где показывать</label>
                <div className="flex flex-wrap gap-4">
                  {["Виджет", "Онлайн-витрина", "Касса"].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded border-2 border-amber-400 bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <Icon name="Check" size={10} className="text-black" />
                      </div>
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Место и дата ── */}
          {tab === "Место и дата" && (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">Город <span className="text-red-400">*</span></label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Москва"
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Площадка / Адрес</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Лужники, Большая спортивная арена"
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Дата <span className="text-red-400">*</span></label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Время начала</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Билеты ── */}
          {tab === "Билеты" && (
            <>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Типы билетов</p>
                <button onClick={addTicket}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-border hover:border-amber-400/40 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  <Icon name="Plus" size={12} /> Добавить
                </button>
              </div>
              <div className="space-y-3">
                {tickets.map((t, idx) => (
                  <div key={t.id} className="bg-secondary/30 border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">Тип {idx + 1}</span>
                      {tickets.length > 1 && (
                        <button onClick={() => removeTicket(t.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Icon name="Trash2" size={13} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-3 sm:col-span-1">
                        <label className="text-xs text-muted-foreground block mb-1">Название</label>
                        <input value={t.name} onChange={e => updateTicket(t.id, { name: e.target.value })} placeholder="Стандартный"
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Цена, ₽</label>
                        <input type="number" value={t.price} min={0} onChange={e => updateTicket(t.id, { price: +e.target.value })}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Кол-во</label>
                        <input type="number" value={t.quantity} min={0} onChange={e => updateTicket(t.id, { quantity: +e.target.value })}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Summary */}
              <div className="bg-card border border-border rounded-2xl p-4 mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Всего мест</span>
                  <span className="font-semibold">{tickets.reduce((s, t) => s + t.quantity, 0).toLocaleString("ru")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Макс. выручка</span>
                  <span className="font-semibold text-green-400">
                    {tickets.reduce((s, t) => s + t.price * t.quantity, 0).toLocaleString("ru")} ₽
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ── Описание ── */}
          {tab === "Описание" && (
            <div>
              <label className="text-sm font-medium block mb-2">Описание мероприятия</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Расскажите о мероприятии: программа, артисты, особенности..."
                rows={10}
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-muted-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1.5">{description.length} символов</p>
            </div>
          )}

          {/* ── Настройки ── */}
          {tab === "Настройки" && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Публикация</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Продажи активны</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Покупатели могут приобретать билеты</p>
                  </div>
                  <button onClick={() => setPublished(p => !p)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${published ? "bg-green-500" : "bg-secondary"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${published ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Возврат билетов</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Разрешить возврат</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Покупатели смогут вернуть билеты</p>
                  </div>
                  <button className="relative w-11 h-6 rounded-full bg-green-500">
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-red-400 mb-1">Опасная зона</h3>
                <p className="text-xs text-muted-foreground mb-4">Необратимые действия</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                  <Icon name="Trash2" size={14} /> Удалить мероприятие
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            Закрыть
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? "bg-green-600 text-white" : "bg-amber-400 hover:bg-amber-300 text-black"}`}
          >
            {saved ? <><Icon name="Check" size={14} /> Сохранено!</> : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}
