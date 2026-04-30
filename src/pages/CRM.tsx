import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const stats = [
  { label: "Продано билетов", value: "3 842", change: "+12%", icon: "Ticket", color: "from-violet-500 to-pink-500" },
  { label: "Выручка за месяц", value: "₽ 9.2M", change: "+8%", icon: "TrendingUp", color: "from-blue-500 to-cyan-500" },
  { label: "Активных событий", value: "24", change: "+3", icon: "Calendar", color: "from-amber-500 to-orange-500" },
  { label: "Покупателей", value: "1 201", change: "+156", icon: "Users", color: "from-green-500 to-teal-500" },
];

const tasks = [
  { id: 1, title: "Разместить рекламу Neon Beats", assignee: "Анна К.", deadline: "12 мая", status: "todo", event: "Neon Beats Festival" },
  { id: 2, title: "Согласовать схему зала", assignee: "Дмитрий В.", deadline: "10 мая", status: "inprogress", event: "Чемпионат по футболу" },
  { id: 3, title: "Настроить сканеры входа", assignee: "Сергей Л.", deadline: "14 мая", status: "inprogress", event: "Neon Beats Festival" },
  { id: 4, title: "Отчёт по продажам апрель", assignee: "Анна К.", deadline: "5 мая", status: "done", event: "" },
  { id: 5, title: "Добавить VIP-зону", assignee: "Дмитрий В.", deadline: "20 мая", status: "todo", event: "Гала-вечер" },
  { id: 6, title: "Обновить условия возврата", assignee: "Сергей Л.", deadline: "8 мая", status: "done", event: "" },
];

const events = [
  { id: 1, name: "Neon Beats Festival", date: "15 мая", sold: 880, total: 1000, revenue: "2.2M", status: "active" },
  { id: 2, name: "Чемпионат по футболу", date: "22 мая", sold: 32000, total: 45000, revenue: "5.8M", status: "active" },
  { id: 3, name: "Stand Up: Новый сезон", date: "1 июня", sold: 120, total: 300, revenue: "96K", status: "active" },
  { id: 4, name: "Гала-вечер классики", date: "10 июня", sold: 45, total: 200, revenue: "157K", status: "soon" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  todo: { label: "К выполнению", color: "bg-muted text-muted-foreground" },
  inprogress: { label: "В работе", color: "bg-blue-500/20 text-blue-400" },
  done: { label: "Готово", color: "bg-green-500/20 text-green-400" },
};

const crmTabs = ["Дашборд", "Задачи", "События", "Сканер", "Схемы"];

export default function CRM() {
  const [activeTab, setActiveTab] = useState("Дашборд");
  const [taskFilter, setTaskFilter] = useState("all");
  const [newTask, setNewTask] = useState({ title: "", assignee: "", deadline: "", status: "todo" });
  const [taskList, setTaskList] = useState(tasks);
  const [showAddTask, setShowAddTask] = useState(false);

  const filteredTasks = taskFilter === "all" ? taskList : taskList.filter((t) => t.status === taskFilter);

  const addTask = () => {
    if (!newTask.title) return;
    setTaskList([...taskList, { ...newTask, id: Date.now(), event: "" }]);
    setNewTask({ title: "", assignee: "", deadline: "", status: "todo" });
    setShowAddTask(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 min-h-[calc(100vh-5rem)] border-r border-white/5 bg-card/50 p-4 sticky top-20">
          <div className="mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 px-2">CRM</p>
            {crmTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-violet-600/20 to-pink-600/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon name={
                  tab === "Дашборд" ? "LayoutDashboard" :
                  tab === "Задачи" ? "CheckSquare" :
                  tab === "События" ? "Calendar" :
                  tab === "Сканер" ? "ScanLine" : "Map"
                } size={16} />
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-auto">
            <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
              <Icon name="ArrowLeft" size={16} />
              На сайт
            </Link>
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5 px-2 py-2 flex justify-around">
          {crmTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                activeTab === tab ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon name={
                tab === "Дашборд" ? "LayoutDashboard" :
                tab === "Задачи" ? "CheckSquare" :
                tab === "События" ? "Calendar" :
                tab === "Сканер" ? "ScanLine" : "Map"
              } size={18} />
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 max-w-5xl">

          {/* DASHBOARD */}
          {activeTab === "Дашборд" && (
            <div className="animate-slide-up">
              <div className="mb-6">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  CRM <span className="gradient-text">Дашборд</span>
                </h1>
                <p className="text-muted-foreground mt-1">Сегодня, 30 апреля 2026</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent tasks */}
                <div className="glass neon-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Задачи в работе</h3>
                    <button onClick={() => setActiveTab("Задачи")} className="text-primary text-xs hover:underline">Все</button>
                  </div>
                  <div className="space-y-2">
                    {taskList.filter(t => t.status === "inprogress").map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{t.title}</p>
                          <p className="text-xs text-muted-foreground">{t.assignee} · {t.deadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events summary */}
                <div className="glass neon-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Продажи по событиям</h3>
                    <button onClick={() => setActiveTab("События")} className="text-primary text-xs hover:underline">Все</button>
                  </div>
                  <div className="space-y-3">
                    {events.slice(0, 3).map((e) => {
                      const pct = Math.round((e.sold / e.total) * 100);
                      return (
                        <div key={e.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="truncate pr-2">{e.name}</span>
                            <span className="text-muted-foreground flex-shrink-0">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TASKS (Kanban) */}
          {activeTab === "Задачи" && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Задачи</h1>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Icon name="Plus" size={14} />
                  Добавить
                </button>
              </div>

              {showAddTask && (
                <div className="glass neon-border rounded-2xl p-4 mb-6 animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input placeholder="Название задачи" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input placeholder="Исполнитель" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="todo">К выполнению</option>
                      <option value="inprogress">В работе</option>
                      <option value="done">Готово</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addTask} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium hover:opacity-90">Сохранить</button>
                    <button onClick={() => setShowAddTask(false)} className="px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground">Отмена</button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                {[["all", "Все"], ["todo", "К выполнению"], ["inprogress", "В работе"], ["done", "Готово"]].map(([v, l]) => (
                  <button key={v} onClick={() => setTaskFilter(v)} className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${taskFilter === v ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white" : "glass neon-border text-muted-foreground hover:text-foreground"}`}>{l}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["todo", "inprogress", "done"] as const).map((col) => {
                  const colTasks = taskFilter === "all" ? taskList.filter(t => t.status === col) : filteredTasks.filter(t => t.status === col);
                  return (
                    <div key={col} className="glass rounded-2xl border border-white/5 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${col === "todo" ? "bg-muted-foreground" : col === "inprogress" ? "bg-blue-400" : "bg-green-400"}`} />
                        <span className="font-semibold text-sm">{statusConfig[col].label}</span>
                        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{colTasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {colTasks.map((t) => (
                          <div key={t.id} className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                            <p className="text-sm font-medium mb-1">{t.title}</p>
                            {t.event && <p className="text-xs text-primary mb-1">{t.event}</p>}
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{t.assignee}</p>
                              {t.deadline && <p className="text-xs text-muted-foreground">{t.deadline}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === "События" && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>События</h1>
                <Link to="/events" className="flex items-center gap-2 px-4 py-2 rounded-xl glass neon-border text-sm font-medium text-foreground hover:bg-white/5">
                  <Icon name="ExternalLink" size={14} />
                  Каталог
                </Link>
              </div>
              <div className="space-y-4">
                {events.map((e) => {
                  const pct = Math.round((e.sold / e.total) * 100);
                  return (
                    <div key={e.id} className="glass neon-border rounded-2xl p-5 hover:card-glow transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                          <div>
                            <p className="text-xl font-bold">{e.sold.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Продано</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-primary">₽{e.revenue}</p>
                            <p className="text-xs text-muted-foreground">Выручка</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>{e.sold.toLocaleString()} из {e.total.toLocaleString()} билетов</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCANNER */}
          {activeTab === "Сканер" && <QRScanner />}

          {/* VENUE SCHEME */}
          {activeTab === "Схемы" && <VenueScheme />}

        </main>
      </div>
    </div>
  );
}

/* ────── QR SCANNER ────── */
import { useEffect, useRef, useCallback } from "react";
import jsQR from "jsqr";

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
    setError("");
    setResult(null);
    setLastScan("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);

      intervalRef.current = setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data !== lastScan) {
          setLastScan(code.data);
          const parts = code.data.split(":");
          if (parts[0] === "TICKETWAVE") {
            setResult({ id: parts[1], event: parts[2], status: "Действителен" });
          } else {
            setResult({ id: code.data, event: "Неизвестный билет", status: "Не найден" });
          }
        }
      }, 400);
    } catch {
      setError("Нет доступа к камере. Разрешите доступ в браузере.");
    }
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
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-2xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-primary animate-[scan_2s_ease-in-out_infinite]" style={{ animation: "scan 2s ease-in-out infinite" }} />
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

      <button
        onClick={scanning ? stopCamera : startCamera}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
          scanning
            ? "glass neon-border text-foreground hover:bg-white/5"
            : "bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 animate-pulse-glow"
        }`}
      >
        <Icon name={scanning ? "CameraOff" : "ScanLine"} size={16} />
        {scanning ? "Остановить сканер" : "Запустить сканер"}
      </button>

      <style>{`@keyframes scan { 0%,100%{top:10%}50%{top:80%} }`}</style>
    </div>
  );
}

/* ────── VENUE SCHEME EDITOR ────── */
import { useRef as useCanvasRef } from "react";

type Zone = { id: number; name: string; x: number; y: number; w: number; h: number; color: string };

const COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

const DEFAULT_ZONES: Zone[] = [
  { id: 1, name: "Сцена", x: 280, y: 20, w: 240, h: 80, color: "#8B5CF6" },
  { id: 2, name: "Танцпол", x: 160, y: 140, w: 480, h: 200, color: "#EC4899" },
  { id: 3, name: "VIP Лево", x: 20, y: 140, w: 120, h: 200, color: "#F59E0B" },
  { id: 4, name: "VIP Право", x: 660, y: 140, w: 120, h: 200, color: "#F59E0B" },
  { id: 5, name: "Бар", x: 20, y: 380, w: 160, h: 80, color: "#10B981" },
  { id: 6, name: "Вход", x: 300, y: 460, w: 200, h: 60, color: "#06B6D4" },
];

function VenueScheme() {
  const canvasRef2 = useCanvasRef<HTMLCanvasElement>(null);
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [selected, setSelected] = useState<number | null>(null);
  const [venueName, setVenueName] = useState("Клуб Арена");
  const [dragging, setDragging] = useState<{ id: number; ox: number; oy: number } | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    zones.forEach((z) => {
      const isSelected = z.id === selected;
      ctx.save();
      ctx.shadowColor = z.color;
      ctx.shadowBlur = isSelected ? 20 : 8;
      ctx.fillStyle = z.color + "44";
      ctx.strokeStyle = z.color;
      ctx.lineWidth = isSelected ? 3 : 1.5;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(z.x + r, z.y);
      ctx.lineTo(z.x + z.w - r, z.y);
      ctx.quadraticCurveTo(z.x + z.w, z.y, z.x + z.w, z.y + r);
      ctx.lineTo(z.x + z.w, z.y + z.h - r);
      ctx.quadraticCurveTo(z.x + z.w, z.y + z.h, z.x + z.w - r, z.y + z.h);
      ctx.lineTo(z.x + r, z.y + z.h);
      ctx.quadraticCurveTo(z.x, z.y + z.h, z.x, z.y + z.h - r);
      ctx.lineTo(z.x, z.y + r);
      ctx.quadraticCurveTo(z.x, z.y, z.x + r, z.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(z.name, z.x + z.w / 2, z.y + z.h / 2);
    });
  }, [zones, selected]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const getZoneAt = (x: number, y: number) =>
    [...zones].reverse().find((z) => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef2.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const zone = getZoneAt(x, y);
    if (zone) {
      setSelected(zone.id);
      setDragging({ id: zone.id, ox: x - zone.x, oy: y - zone.y });
    } else {
      setSelected(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const rect = canvasRef2.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.ox;
    const y = e.clientY - rect.top - dragging.oy;
    setZones((prev) => prev.map((z) => z.id === dragging.id ? { ...z, x: Math.max(0, x), y: Math.max(0, y) } : z));
  };

  const addZone = () => {
    const id = Date.now();
    setZones([...zones, { id, name: "Зона " + (zones.length + 1), x: 100, y: 100, w: 120, h: 80, color: COLORS[zones.length % COLORS.length] }]);
    setSelected(id);
  };

  const removeZone = (id: number) => {
    setZones(zones.filter((z) => z.id !== id));
    if (selected === id) setSelected(null);
  };

  const updateZone = (id: number, patch: Partial<Zone>) => {
    setZones(zones.map((z) => z.id === id ? { ...z, ...patch } : z));
  };

  const selectedZone = zones.find((z) => z.id === selected);

  const exportPNG = () => {
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${venueName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Схемы площадок</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Перетаскивай зоны для редактирования</p>
        </div>
        <button onClick={exportPNG} className="flex items-center gap-2 px-4 py-2 rounded-xl glass neon-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors">
          <Icon name="Download" size={14} />
          Скачать PNG
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="xl:col-span-2">
          <div className="glass neon-border rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
              <input
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground focus:outline-none"
              />
              <div className="ml-auto flex gap-2">
                <button onClick={addZone} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-medium hover:opacity-90">
                  <Icon name="Plus" size={12} />
                  Зона
                </button>
              </div>
            </div>
            <canvas
              ref={canvasRef2}
              width={800}
              height={560}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
              className="w-full cursor-grab active:cursor-grabbing"
              style={{ maxHeight: "420px" }}
            />
          </div>
        </div>

        {/* Zone list & editor */}
        <div className="flex flex-col gap-3">
          <div className="glass neon-border rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Зоны ({zones.length})</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setSelected(z.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${selected === z.id ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/40"}`}
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: z.color }} />
                  <span className="text-sm flex-1 truncate">{z.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeZone(z.id); }} className="text-muted-foreground hover:text-red-400 transition-colors">
                    <Icon name="Trash2" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="glass neon-border-pink rounded-2xl p-4 animate-slide-up">
              <h3 className="font-bold text-sm mb-3">Редактор зоны</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Название</label>
                  <input value={selectedZone.name} onChange={e => updateZone(selectedZone.id, { name: e.target.value })} className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Ширина</label>
                    <input type="number" value={selectedZone.w} onChange={e => updateZone(selectedZone.id, { w: +e.target.value })} className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Высота</label>
                    <input type="number" value={selectedZone.h} onChange={e => updateZone(selectedZone.id, { h: +e.target.value })} className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Цвет</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => updateZone(selectedZone.id, { color: c })}
                        className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${selectedZone.color === c ? "ring-2 ring-white ring-offset-1 ring-offset-background" : ""}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
