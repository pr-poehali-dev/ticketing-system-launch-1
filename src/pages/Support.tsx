import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    q: "Как получить билет после покупки?",
    a: "Билет с QR-кодом автоматически появляется в вашем личном кабинете в разделе «Мои билеты». Также мы отправляем его на email, указанный при регистрации.",
  },
  {
    q: "Можно ли вернуть билет?",
    a: "Да, возврат возможен не менее чем за 24 часа до начала мероприятия. Для возврата обратитесь в службу поддержки через форму ниже.",
  },
  {
    q: "Как пройти на мероприятие по QR-коду?",
    a: "Откройте личный кабинет, найдите нужный билет и нажмите «QR-код». Сотрудник на входе отсканирует QR-код с экрана вашего телефона.",
  },
  {
    q: "Безопасно ли платить на сайте?",
    a: "Да, все платежи защищены SSL-шифрованием. Мы не храним данные карт — платежи обрабатываются через сертифицированные платёжные системы.",
  },
  {
    q: "Что делать, если билет не пришёл на email?",
    a: "Проверьте папку «Спам». Если письма нет — войдите в личный кабинет, там билет точно есть. Или напишите нам — поможем!",
  },
];

const contacts = [
  { icon: "Mail", label: "Email", value: "support@ticketwave.ru", color: "from-violet-500 to-pink-500" },
  { icon: "Phone", label: "Телефон", value: "8 800 555-35-35", color: "from-blue-500 to-cyan-500" },
  { icon: "MessageCircle", label: "Telegram", value: "@ticketwave_support", color: "from-sky-500 to-blue-500" },
  { icon: "Clock", label: "Режим работы", value: "Пн–Вс, 09:00–21:00", color: "from-amber-500 to-orange-500" },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border text-sm text-muted-foreground mb-6">
            <Icon name="Headphones" size={14} />
            Служба поддержки
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Как мы можем{" "}
            <span className="gradient-text">помочь?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ответим на любой вопрос о покупке билетов, мероприятиях и использовании платформы
          </p>
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contacts.map((c) => (
            <div key={c.label} className="glass neon-border rounded-2xl p-5 text-center hover:card-glow transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mx-auto mb-3`}>
                <Icon name={c.icon} size={20} className="text-white" />
              </div>
              <p className="text-muted-foreground text-xs mb-1">{c.label}</p>
              <p className="font-semibold text-sm">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Частые вопросы
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`glass rounded-2xl overflow-hidden transition-all ${openFaq === i ? "neon-border card-glow" : "border border-white/5"}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <Icon
                      name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                      size={16}
                      className={`flex-shrink-0 transition-transform ${openFaq === i ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Написать нам
            </h2>
            {sent ? (
              <div className="glass neon-border rounded-3xl p-10 text-center animate-slide-up">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Icon name="CheckCircle" size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Сообщение отправлено!</h3>
                <p className="text-muted-foreground">Мы ответим в течение 2 часов в рабочее время</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl glass neon-border text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Написать ещё раз
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass neon-border rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Ваше имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Александр"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Тема обращения</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Выберите тему...</option>
                    <option>Возврат билета</option>
                    <option>Проблема с QR-кодом</option>
                    <option>Ошибка при оплате</option>
                    <option>Вопрос о мероприятии</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Сообщение</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Опишите ваш вопрос или проблему..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Icon name="Send" size={16} />
                  Отправить сообщение
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
