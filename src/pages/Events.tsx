import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const allEvents = [
  {
    id: 1,
    title: "Neon Beats Festival",
    category: "Музыка",
    date: "15 мая 2026",
    time: "20:00",
    location: "Москва, Олимпийский",
    price: 2500,
    priceLabel: "от 2 500 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/c1540254-e41e-4349-a9dd-2a5ba7a5132e.jpg",
    tag: "Горячее",
    tagColor: "from-orange-500 to-pink-500",
    seats: 120,
  },
  {
    id: 2,
    title: "Чемпионат по футболу",
    category: "Спорт",
    date: "22 мая 2026",
    time: "18:30",
    location: "СПб, Газпром Арена",
    price: 1200,
    priceLabel: "от 1 200 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/015c7a79-a9f6-4133-bbc4-9bb47dcdc938.jpg",
    tag: "Популярное",
    tagColor: "from-violet-500 to-blue-500",
    seats: 45,
  },
  {
    id: 3,
    title: "Stand Up: Новый сезон",
    category: "Стендап",
    date: "1 июня 2026",
    time: "19:00",
    location: "Москва, Comedy Club",
    price: 800,
    priceLabel: "от 800 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/c1540254-e41e-4349-a9dd-2a5ba7a5132e.jpg",
    tag: "Новинка",
    tagColor: "from-green-500 to-teal-500",
    seats: 200,
  },
  {
    id: 4,
    title: "Гала-вечер классической музыки",
    category: "Театр",
    date: "10 июня 2026",
    time: "17:00",
    location: "Москва, Большой театр",
    price: 3500,
    priceLabel: "от 3 500 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/015c7a79-a9f6-4133-bbc4-9bb47dcdc938.jpg",
    tag: "Премиум",
    tagColor: "from-amber-500 to-yellow-500",
    seats: 12,
  },
  {
    id: 5,
    title: "Выставка цифрового искусства",
    category: "Выставки",
    date: "20 июня 2026",
    time: "10:00",
    location: "Москва, ARTPLAY",
    price: 600,
    priceLabel: "от 600 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/c1540254-e41e-4349-a9dd-2a5ba7a5132e.jpg",
    tag: "Топ",
    tagColor: "from-purple-500 to-indigo-500",
    seats: 350,
  },
  {
    id: 6,
    title: "Кинофестиваль Arthouse",
    category: "Кино",
    date: "5 июля 2026",
    time: "21:00",
    location: "Москва, Каро Атриум",
    price: 400,
    priceLabel: "от 400 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/015c7a79-a9f6-4133-bbc4-9bb47dcdc938.jpg",
    tag: "Скоро",
    tagColor: "from-pink-500 to-rose-500",
    seats: 80,
  },
];

const categories = ["Все", "Музыка", "Спорт", "Театр", "Кино", "Стендап", "Выставки"];
const sortOptions = ["По дате", "По цене (возр.)", "По популярности"];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("По дате");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = allEvents
    .filter((e) => (activeCategory === "Все" ? true : e.category === activeCategory))
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "По цене (возр.)") return a.price - b.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Все <span className="gradient-text">события</span>
          </h1>
          <p className="text-muted-foreground">Найди своё идеальное мероприятие</p>
        </div>

        {/* Search & Filters */}
        <div className="glass rounded-2xl neon-border p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию или городу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon name="Grid3X3" size={16} />
              </button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white"
                  : "glass neon-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-muted-foreground text-sm mb-6">
          Найдено: <span className="text-foreground font-medium">{filtered.length}</span> событий
        </p>

        {/* Events Grid/List */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Ничего не найдено</p>
            <p className="text-muted-foreground text-sm mt-1">Попробуй изменить фильтры</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function EventCard({ event }: { event: typeof allEvents[0] }) {
  return (
    <Link to="/profile" className="group block">
      <div className="rounded-2xl overflow-hidden glass neon-border hover:card-glow transition-all duration-300 hover:scale-[1.02]">
        <div className="relative h-44 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${event.tagColor} text-white text-xs font-semibold`}>
            {event.tag}
          </div>
          {event.seats < 50 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500/80 text-white text-xs font-semibold">
              Осталось {event.seats}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-foreground mb-1 truncate">{event.title}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Icon name="Calendar" size={12} />
            {event.date}, {event.time}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
            <Icon name="MapPin" size={12} />
            {event.location}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">{event.priceLabel}</span>
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity">
              Купить
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EventListItem({ event }: { event: typeof allEvents[0] }) {
  return (
    <Link to="/profile" className="group block">
      <div className="rounded-2xl overflow-hidden glass neon-border hover:card-glow transition-all duration-300 flex">
        <div className="relative w-32 sm:w-48 flex-shrink-0 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full bg-gradient-to-r ${event.tagColor} text-white text-xs font-semibold`}>
            {event.tag}
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Icon name="Calendar" size={12} />
                {event.date}, {event.time}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Icon name="MapPin" size={12} />
                {event.location}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Icon name="Tag" size={12} />
                {event.category}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-foreground">{event.priceLabel}</span>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity">
              Купить билет
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
