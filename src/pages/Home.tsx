import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const featuredEvents = [
  {
    id: 1,
    title: "Neon Beats Festival",
    category: "Музыка",
    date: "15 мая 2026",
    time: "20:00",
    location: "Москва, Олимпийский",
    price: "от 2 500 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/c1540254-e41e-4349-a9dd-2a5ba7a5132e.jpg",
    tag: "Горячее",
    tagColor: "from-orange-500 to-pink-500",
  },
  {
    id: 2,
    title: "Чемпионат по футболу",
    category: "Спорт",
    date: "22 мая 2026",
    time: "18:30",
    location: "Санкт-Петербург, Газпром Арена",
    price: "от 1 200 ₽",
    image: "https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/015c7a79-a9f6-4133-bbc4-9bb47dcdc938.jpg",
    tag: "Популярное",
    tagColor: "from-violet-500 to-blue-500",
  },
];

const categories = [
  { name: "Музыка", icon: "Music", color: "from-violet-500/20 to-pink-500/20", border: "border-violet-500/30" },
  { name: "Спорт", icon: "Trophy", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30" },
  { name: "Театр", icon: "Drama", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
  { name: "Кино", icon: "Film", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
  { name: "Стендап", icon: "Mic", color: "from-green-500/20 to-teal-500/20", border: "border-green-500/30" },
  { name: "Выставки", icon: "Palette", color: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30" },
];

const stats = [
  { value: "50 000+", label: "Довольных покупателей" },
  { value: "1 200+", label: "Мероприятий в год" },
  { value: "150+", label: "Городов России" },
  { value: "99.9%", label: "Uptime платформы" },
];

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border text-sm text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Более 1 200 мероприятий прямо сейчас
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Твои лучшие{" "}
            <span className="gradient-text">впечатления</span>
            <br />начинаются здесь
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Покупай билеты на концерты, спортивные матчи, театры и фестивали. Быстро, безопасно и с QR-кодом на входе.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 animate-pulse-glow"
            >
              <Icon name="Search" size={20} />
              Найти событие
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass neon-border text-foreground font-semibold text-lg hover:bg-white/5 transition-all hover:scale-105"
            >
              <Icon name="Ticket" size={20} />
              Мои билеты
            </Link>
          </div>
        </div>

        {/* Floating badges */}
        <div className="relative mt-16 flex justify-center items-center">
          <div className="absolute -left-4 top-0 animate-float hidden lg:block">
            <div className="glass neon-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                <Icon name="Check" size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Продано только что</p>
                <p className="text-xs text-muted-foreground">Neon Beats Festival</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 bottom-8 animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
            <div className="glass neon-border-pink rounded-2xl px-4 py-3 flex items-center gap-2">
              <Icon name="Star" size={16} className="text-yellow-400" />
              <div>
                <p className="text-xs font-semibold text-foreground">Рейтинг 4.9</p>
                <p className="text-xs text-muted-foreground">1 200+ отзывов</p>
              </div>
            </div>
          </div>
          <img
            src="https://cdn.poehali.dev/projects/40972b4f-7601-4819-88c4-96426f5eecbe/files/c1540254-e41e-4349-a9dd-2a5ba7a5132e.jpg"
            alt="Concert"
            className="rounded-3xl w-full max-w-3xl h-72 object-cover card-glow neon-border"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Категории событий
            </h2>
            <p className="text-muted-foreground mt-1">Выбирай, что нравится</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/events"
              className={`group p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} flex flex-col items-center gap-3 hover:scale-105 transition-all duration-200`}
            >
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:animate-pulse-glow">
                <Icon name={cat.icon} size={22} className="text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Популярные события
            </h2>
            <p className="text-muted-foreground mt-1">Не пропусти лучшее</p>
          </div>
          <Link to="/events" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
            Все события <Icon name="ArrowRight" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredEvents.map((event) => (
            <Link key={event.id} to="/events" className="group block">
              <div className="rounded-3xl overflow-hidden glass neon-border hover:card-glow transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-52 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${event.tagColor} text-white text-xs font-semibold`}>
                    {event.tag}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-xl">{event.title}</p>
                      <p className="text-white/70 text-sm">{event.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{event.price}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Icon name="Calendar" size={14} />
                    {event.date}, {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Icon name="MapPin" size={14} />
                    {event.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden relative ticket-gradient neon-border p-12 text-center">
          <div className="absolute inset-0 shimmer opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Готов к незабываемым{" "}
              <span className="gradient-text">впечатлениям?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Зарегистрируйся и получи персональные рекомендации мероприятий
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 animate-pulse-glow"
            >
              <Icon name="Zap" size={20} />
              Начать сейчас
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}