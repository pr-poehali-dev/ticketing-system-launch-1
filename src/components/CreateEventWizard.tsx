import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── Types ─── */
export type NewEvent = {
  type: "single" | "periodic" | "non-periodic";
  category: string;
  subcategory: string;
  name: string;
  description: string;
  ageLimit: string;
  cover: string | null;
  city: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  totalTickets: number;
  ticketTypes: TicketType[];
};

export type TicketType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

/* ─── Data ─── */
const CATEGORIES: Record<string, string[]> = {
  "Балет": ["Классический балет", "Современный балет", "Другое..."],
  "Бизнес": ["Конференция", "Форум", "Мастер-класс", "Нетворкинг", "Другое..."],
  "Вечеринки": ["Клубная вечеринка", "День рождения", "Корпоратив", "Другое..."],
  "Выставки": ["Арт", "Фото", "Технологии", "Другое..."],
  "Детям": ["Спектакль", "Аниматоры", "Мастер-класс", "Другое..."],
  "Здоровье": ["Йога", "Медитация", "Семинар", "Другое..."],
  "Кино": ["Премьера", "Ретро", "Документальный", "Другое..."],
  "Концерты": [
    "Ska Punk", "Stand up", "World music", "Альтернатива", "Блюз", "Выставки",
    "Детям", "Джаз", "Инди", "Классика", "Металл", "Опера", "Панк", "Поп",
    "Рок", "Рэп/Хип-хоп", "Фолк", "Шансон", "Шоу - программа", "Электроника",
    "Эстрада", "Юмор", "Другое...",
  ],
  "Музеи": ["Экскурсия", "Выставка", "Мастер-класс", "Другое..."],
  "Развитие": ["Тренинг", "Вебинар", "Курс", "Другое..."],
  "Спорт": ["Футбол", "Баскетбол", "Бокс", "Единоборства", "Другое..."],
  "Театры": ["Драма", "Комедия", "Опера", "Мюзикл", "Другое..."],
  "Фестивали": ["Музыкальный", "Гастрономический", "Культурный", "Другое..."],
  "Шоу": ["Цирк", "Иллюзионист", "Шоу талантов", "Другое..."],
  "Экскурсии": ["Городская", "Пешеходная", "Автобусная", "Другое..."],
};

const AGE_LIMITS = ["0+", "6+", "12+", "16+", "18+", "21+"];

const EVENT_TYPES = [
  { id: "single", label: "Одиночное мероприятие", desc: "Проходит один раз в конкретную дату" },
  { id: "periodic", label: "Периодическое мероприятие", desc: "Повторяется по расписанию" },
  { id: "non-periodic", label: "Непериодическое мероприятие", desc: "Несколько дат без строгого расписания" },
] as const;

const STEPS = ["Тип", "Категория", "Основное", "Место и дата", "Билеты"] as const;

const INIT_TICKET: TicketType = { id: 1, name: "Стандартный", price: 1500, quantity: 100 };

/* ─── Main Wizard ─── */
export default function CreateEventWizard({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (e: NewEvent) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewEvent>({
    type: "single",
    category: "",
    subcategory: "",
    name: "",
    description: "",
    ageLimit: "18+",
    cover: null,
    city: "",
    address: "",
    date: "",
    time: "20:00",
    duration: "3",
    totalTickets: 500,
    ticketTypes: [{ ...INIT_TICKET }],
  });
  const [subcatOpen, setSubcatOpen] = useState(false);
  const [createDropOpen, setCreateDropOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const patch = (p: Partial<NewEvent>) => setForm(f => ({ ...f, ...p }));

  const canNext = () => {
    if (step === 0) return !!form.type;
    if (step === 1) return !!form.category && !!form.subcategory;
    if (step === 2) return !!form.name;
    if (step === 3) return !!form.date && !!form.city;
    return true;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    patch({ cover: url });
  };

  const addTicketType = () => {
    patch({ ticketTypes: [...form.ticketTypes, { id: Date.now(), name: "", price: 0, quantity: 50 }] });
  };

  const updateTicket = (id: number, p: Partial<TicketType>) => {
    patch({ ticketTypes: form.ticketTypes.map(t => t.id === id ? { ...t, ...p } : t) });
  };

  const removeTicket = (id: number) => {
    patch({ ticketTypes: form.ticketTypes.filter(t => t.id !== id) });
  };

  const submit = () => {
    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0f0f17]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#13131f] border-r border-white/5 p-4 flex-shrink-0">
        <div className="mb-8 px-2 pt-2">
          <span className="font-bold text-sm gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TicketWave</span>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 px-2">Шаги</p>
        {STEPS.map((s, i) => (
          <div key={s}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm ${i === step ? "text-foreground font-semibold" : i < step ? "text-muted-foreground" : "text-muted-foreground/40"}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === step ? "bg-violet-600 text-white" : i < step ? "bg-green-500/20 text-green-400" : "bg-white/5 text-muted-foreground"}`}>
              {i < step ? <Icon name="Check" size={12} /> : i + 1}
            </div>
            {s}
          </div>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#13131f]">
          <div>
            <h1 className="font-bold text-lg">Создание мероприятия</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Шаг {step + 1} из {STEPS.length}: {STEPS[step]}</p>
          </div>
          {/* Mobile steps indicator */}
          <div className="lg:hidden flex items-center gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-violet-500" : i < step ? "w-3 bg-green-500" : "w-3 bg-white/10"}`} />
            ))}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">

          {/* Step 0 — Тип */}
          {step === 0 && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Выберите тип мероприятия</h2>
              <div className="space-y-3">
                {EVENT_TYPES.map(t => (
                  <button key={t.id} onClick={() => patch({ type: t.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${form.type === t.id ? "border-violet-500 bg-violet-500/10" : "border-border bg-card hover:border-white/20 hover:bg-white/2"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.type === t.id ? "border-violet-500" : "border-border"}`}>
                      {form.type === t.id && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Категория */}
          {step === 1 && (
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold mb-6">Категория <span className="text-red-400">*</span></h2>
              {!form.category ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => { patch({ category: cat, subcategory: "" }); setSubcatOpen(true); }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-violet-500/40 hover:bg-violet-500/5 text-left text-sm font-medium transition-all"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-6 flex-col sm:flex-row">
                  {/* Left: categories */}
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    {Object.keys(CATEGORIES).map(cat => (
                      <button key={cat} onClick={() => { patch({ category: cat, subcategory: "" }); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${form.category === cat ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.category === cat ? "border-amber-400" : "border-border"}`}>
                          {form.category === cat && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                        </div>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Right: subcategories */}
                  <div className="flex-1 border border-violet-500/40 rounded-2xl p-4 max-h-[500px] overflow-y-auto bg-card">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{form.category}</p>
                    <div className="space-y-1">
                      {CATEGORIES[form.category]?.map(sub => (
                        <button key={sub} onClick={() => patch({ subcategory: sub })}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-white/5 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.subcategory === sub ? "border-amber-400 bg-amber-400" : "border-border"}`}>
                            {form.subcategory === sub && <Icon name="Check" size={10} className="text-black" />}
                          </div>
                          {sub}
                        </button>
                      ))}
                    </div>
                    {form.subcategory && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <button onClick={() => setStep(2)}
                          className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold transition-colors"
                        >
                          Далее
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {form.category && form.subcategory && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/30 font-medium">
                    {form.category}, {form.subcategory}
                  </span>
                  <button onClick={() => patch({ category: "", subcategory: "" })} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Основное */}
          {step === 2 && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold">Основная информация</h2>

              {/* Category display */}
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Категория <span className="text-red-400">*</span></label>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card text-sm">
                  <span>{form.category}, {form.subcategory}</span>
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                </div>
              </div>

              {/* Cover */}
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Обложка</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                {form.cover ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
                    <img src={form.cover} alt="cover" className="w-full h-full object-cover" />
                    <button onClick={() => patch({ cover: null })} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-white/5 text-sm font-medium transition-colors"
                  >
                    <Icon name="Plus" size={16} /> Загрузить обложку
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Рекомендуемое разрешение 1500×900 px, максимальный размер 15МБ</p>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Название <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={e => patch({ name: e.target.value })}
                  placeholder="Введите название мероприятия"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Описание</label>
                <textarea
                  value={form.description}
                  onChange={e => patch({ description: e.target.value })}
                  placeholder="Короткое описание, которое раскрывает детали мероприятия"
                  rows={4}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Age limit */}
              <div>
                <label className="text-sm text-muted-foreground block mb-3">Ограничение <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {AGE_LIMITS.map(a => (
                    <button key={a} onClick={() => patch({ ageLimit: a })}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${form.ageLimit === a ? "border-violet-500 bg-violet-500/15 text-violet-400" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-white/20"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="text-sm text-muted-foreground block mb-3">Где будет видно</label>
                <div className="flex flex-wrap gap-4">
                  {["Виджет", "Онлайн-витрина", "Касса"].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded border-2 border-amber-400 bg-amber-400 flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-black" />
                      </div>
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Место и дата */}
          {step === 3 && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold">Место и дата</h2>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Город <span className="text-red-400">*</span></label>
                <input value={form.city} onChange={e => patch({ city: e.target.value })}
                  placeholder="Москва"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Адрес площадки</label>
                <input value={form.address} onChange={e => patch({ address: e.target.value })}
                  placeholder="Ленинградский проспект, 80"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Дата <span className="text-red-400">*</span></label>
                  <input type="date" value={form.date} onChange={e => patch({ date: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Время начала</label>
                  <input type="time" value={form.time} onChange={e => patch({ time: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Продолжительность (часов)</label>
                <input type="number" value={form.duration} onChange={e => patch({ duration: e.target.value })}
                  min={1} max={24}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {form.type !== "single" && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <p className="text-sm text-amber-400 flex items-center gap-2">
                    <Icon name="Info" size={14} /> Для периодических мероприятий можно добавить несколько дат после создания
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Билеты */}
          {step === 4 && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold">Типы билетов</h2>
              <p className="text-sm text-muted-foreground -mt-4">Добавьте один или несколько типов билетов</p>

              <div className="space-y-3">
                {form.ticketTypes.map((t, idx) => (
                  <div key={t.id} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">Тип {idx + 1}</span>
                      {form.ticketTypes.length > 1 && (
                        <button onClick={() => removeTicket(t.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Icon name="Trash2" size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="text-xs text-muted-foreground block mb-1">Название</label>
                        <input value={t.name} onChange={e => updateTicket(t.id, { name: e.target.value })}
                          placeholder="Стандартный"
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Цена, ₽</label>
                        <input type="number" value={t.price} onChange={e => updateTicket(t.id, { price: +e.target.value })}
                          min={0}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Количество</label>
                        <input type="number" value={t.quantity} onChange={e => updateTicket(t.id, { quantity: +e.target.value })}
                          min={1}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addTicketType}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-violet-500/40 hover:bg-violet-500/5 text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                <Icon name="Plus" size={14} /> Добавить тип билета
              </button>

              {/* Summary */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-sm font-semibold mb-3">Итого</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Всего мест</span>
                  <span className="font-semibold">{form.ticketTypes.reduce((s, t) => s + t.quantity, 0).toLocaleString("ru")}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Максимальная выручка</span>
                  <span className="font-semibold text-green-400">
                    {(form.ticketTypes.reduce((s, t) => s + t.price * t.quantity, 0)).toLocaleString("ru")} ₽
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#13131f] flex items-center justify-between">
          <button
            onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Icon name="ArrowLeft" size={14} />
            {step === 0 ? "Отмена" : "Назад"}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${canNext() ? "bg-amber-400 hover:bg-amber-300 text-black" : "bg-white/5 text-muted-foreground cursor-not-allowed"}`}
            >
              {step === 2 ? "К месту и дате" : step === 3 ? "К билетам" : "Далее"}
              <Icon name="ArrowRight" size={14} />
            </button>
          ) : (
            <button onClick={submit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
            >
              <Icon name="Check" size={14} /> Создать мероприятие
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
