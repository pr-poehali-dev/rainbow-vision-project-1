import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

const ROOMS_API = "https://functions.poehali.dev/9d8dc40f-548f-4a38-b857-de8c0359ae9d"

type TimeOfDay = "day" | "night"

interface OccupiedRoom {
  room_number: number
  player_nickname: string
  player_avatar: string
  player_role: string
}

const roomThemes = [
  { id: 1, wall: "#1a0a0a", floor: "#2d1515", bedColor: "#8B0000", bedSheet: "#3d0000", curtain: "#4a0000", decoration: "🩸", extra: "spider", windowGlow: "rgba(180,0,0,0.4)", accent: "#ff2200" },
  { id: 2, wall: "#0d0a1a", floor: "#1a1530", bedColor: "#2d1b69", bedSheet: "#1a0d3d", curtain: "#1f0d4a", decoration: "💀", extra: "cobweb", windowGlow: "rgba(100,0,180,0.4)", accent: "#9933ff" },
  { id: 3, wall: "#0a1a0a", floor: "#0d1f0d", bedColor: "#1a3d1a", bedSheet: "#0d2b0d", curtain: "#0a2a0a", decoration: "🕷️", extra: "slime", windowGlow: "rgba(0,150,0,0.3)", accent: "#00cc44" },
  { id: 4, wall: "#1a0f00", floor: "#2a1a00", bedColor: "#6b3a00", bedSheet: "#3d2000", curtain: "#4a2800", decoration: "🔥", extra: "fire", windowGlow: "rgba(200,80,0,0.4)", accent: "#ff6600" },
  { id: 5, wall: "#030a1a", floor: "#050f2a", bedColor: "#0a1f5c", bedSheet: "#050f3d", curtain: "#03082e", decoration: "👻", extra: "ghost", windowGlow: "rgba(0,50,200,0.4)", accent: "#3366ff" },
  { id: 6, wall: "#1a0505", floor: "#2a0808", bedColor: "#7a0000", bedSheet: "#4a0000", curtain: "#5a0000", decoration: "🩸", extra: "cracks", windowGlow: "rgba(220,0,0,0.5)", accent: "#ff0000" },
  { id: 7, wall: "#0f0a1f", floor: "#1a1530", bedColor: "#3d1a6b", bedSheet: "#2a0d4a", curtain: "#280a5a", decoration: "🕸️", extra: "cobweb", windowGlow: "rgba(120,0,220,0.4)", accent: "#cc00ff" },
  { id: 8, wall: "#00100f", floor: "#001a18", bedColor: "#003d35", bedSheet: "#002820", curtain: "#002520", decoration: "☠️", extra: "bones", windowGlow: "rgba(0,180,150,0.3)", accent: "#00ddbb" },
  { id: 9, wall: "#1a0510", floor: "#2a0818", bedColor: "#7a002a", bedSheet: "#4a001a", curtain: "#5a0022", decoration: "🦇", extra: "bat", windowGlow: "rgba(200,0,80,0.4)", accent: "#ff0055" },
  { id: 10, wall: "#1a0f00", floor: "#2a1800", bedColor: "#6b3d00", bedSheet: "#4a2800", curtain: "#3d1f00", decoration: "💀", extra: "skull", windowGlow: "rgba(180,80,0,0.4)", accent: "#ffaa00" },
  { id: 11, wall: "#000f1a", floor: "#00182a", bedColor: "#003d5c", bedSheet: "#002840", curtain: "#00253d", decoration: "👁️", extra: "eye", windowGlow: "rgba(0,150,200,0.4)", accent: "#00ccff" },
  { id: 12, wall: "#0a0a0a", floor: "#151515", bedColor: "#2a2a2a", bedSheet: "#1a1a1a", curtain: "#1f1f1f", decoration: "⚰️", extra: "coffin", windowGlow: "rgba(150,150,150,0.3)", accent: "#888888" },
]

function getRoomNumber(entrance: number, floor: number) {
  return (floor - 1) * 2 + entrance
}

function MiniRoomSVG({ theme, occupant }: { theme: typeof roomThemes[0]; occupant?: OccupiedRoom | null }) {
  return (
    <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="120" height="90" fill={theme.wall} />
      {[0,1,2,3,4,5].map(col =>
        [0,1,2,3].map(row => (
          <text key={`${col}-${row}`} x={col*22+6} y={row*22+16} fontSize="7" fill="rgba(255,255,255,0.03)" fontFamily="serif">✝</text>
        ))
      )}
      <rect y="68" width="120" height="22" fill={theme.floor} />
      <rect x="36" y="6" width="38" height="28" rx="3" fill="#050505" />
      <rect x="37" y="7" width="36" height="26" rx="2" fill="#080818" />
      <rect x="37" y="7" width="36" height="26" rx="2" fill={theme.windowGlow} />
      <circle cx="64" cy="20" r="9" fill="#e8e0c0" opacity="0.5" />
      <circle cx="67" cy="18" r="7.5" fill="#080818" opacity="0.9" />
      <path d="M 36 6 Q 28 16 30 32 Q 36 24 37 34 L 36 34 Z" fill={theme.curtain} opacity="0.95" />
      <path d="M 74 6 Q 82 16 80 32 Q 74 24 73 34 L 74 34 Z" fill={theme.curtain} opacity="0.95" />
      <rect x="6" y="50" width="58" height="22" rx="3" fill={theme.bedColor} />
      <rect x="7" y="51" width="56" height="18" rx="2" fill={theme.bedSheet} />
      <rect x="20" y="52" width="42" height="15" rx="2" fill={theme.bedColor} opacity="0.7" />
      <rect x="9" y="53" width="18" height="11" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="4" y="44" width="7" height="28" rx="3" fill={theme.bedColor} />
      <rect x="90" y="54" width="22" height="36" rx="2" fill="#050202" stroke={theme.curtain} strokeWidth="1" opacity="0.8" />
      <circle cx="99" cy="72" r="1.5" fill={theme.accent} opacity="0.7" />
      {/* Avatar on bed if occupied */}
      {occupant && occupant.player_avatar && (
        <>
          <clipPath id={`clip-${theme.id}`}>
            <circle cx="28" cy="56" r="7" />
          </clipPath>
          <image href={occupant.player_avatar} x="21" y="49" width="14" height="14" clipPath={`url(#clip-${theme.id})`} />
          <circle cx="28" cy="56" r="7" fill="none" stroke={theme.accent} strokeWidth="1" opacity="0.8" />
        </>
      )}
    </svg>
  )
}

export default function Host() {
  const navigate = useNavigate()
  const location = useLocation()
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day")
  const [occupiedRooms, setOccupiedRooms] = useState<OccupiedRoom[]>([])
  const [transitioning, setTransitioning] = useState(false)

  const user = location.state || JSON.parse(sessionStorage.getItem("mafia_user") || "{}")

  const fetchRooms = useCallback(async () => {
    const res = await fetch(ROOMS_API)
    const data = await res.json()
    setOccupiedRooms(data.rooms || [])
    if (data.time_of_day) setTimeOfDay(data.time_of_day as TimeOfDay)
  }, [])

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000)
    return () => clearInterval(interval)
  }, [fetchRooms])

  const switchTime = async (newTime: TimeOfDay) => {
    if (newTime === timeOfDay || transitioning) return
    setTransitioning(true)
    await new Promise(r => setTimeout(r, 200))
    setTimeOfDay(newTime)
    await fetch(ROOMS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_time", time_of_day: newTime }),
    })
    setTransitioning(false)
  }

  const floors = [6, 5, 4, 3, 2, 1]
  const isNight = timeOfDay === "night"

  const skyBg = isNight
    ? "radial-gradient(ellipse at 50% 0%, #0a0020 0%, #00000f 60%, #000008 100%)"
    : "radial-gradient(ellipse at 50% 0%, #87ceeb 0%, #4fa8d5 40%, #b0d4e8 100%)"

  const buildingGlow = isNight
    ? "0 0 80px rgba(100,0,0,0.5), 0 0 160px rgba(40,0,0,0.3)"
    : "0 0 40px rgba(255,200,100,0.2), 0 0 80px rgba(255,150,50,0.1)"

  const totalPlayers = occupiedRooms.length

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{ background: isNight ? "#05010a" : "#e8f4fd" }}
    >
      {/* Sky / atmosphere */}
      <AnimatePresence mode="wait">
        <motion.div
          key={timeOfDay}
          className="fixed inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8 }}
          style={{ background: skyBg }}
        />
      </AnimatePresence>

      {/* Night: Stars */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 55}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.4 + Math.random() * 0.6,
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Night: Moon */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            className="fixed pointer-events-none"
            style={{ top: "6%", right: "12%" }}
            initial={{ opacity: 0, y: -60, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div
              className="rounded-full"
              style={{
                width: 64,
                height: 64,
                background: "radial-gradient(circle at 35% 35%, #fff8e0, #e8d88a)",
                boxShadow: "0 0 30px rgba(255,240,150,0.5), 0 0 60px rgba(255,220,100,0.25)",
              }}
            />
            {/* Moon craters */}
            <div className="absolute top-3 left-4 w-3 h-3 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
            <div className="absolute top-7 left-9 w-2 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }} />
            <div className="absolute top-4 left-10 w-4 h-4 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day: Sun */}
      <AnimatePresence>
        {!isNight && (
          <motion.div
            className="fixed pointer-events-none"
            style={{ top: "4%", right: "10%" }}
            initial={{ opacity: 0, y: -80, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.7 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Sun rays */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: 3,
                  height: 22,
                  background: "linear-gradient(to top, rgba(255,200,0,0.8), transparent)",
                  transformOrigin: "50% 100%",
                  transform: `rotate(${i * 30}deg) translateY(-48px)`,
                  top: "50%",
                  left: "50%",
                  marginLeft: -1.5,
                  borderRadius: 2,
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
            <div
              className="relative rounded-full"
              style={{
                width: 72,
                height: 72,
                background: "radial-gradient(circle at 40% 35%, #fff5a0, #ffcc00, #ff9900)",
                boxShadow: "0 0 40px rgba(255,200,0,0.7), 0 0 80px rgba(255,150,0,0.4), 0 0 140px rgba(255,100,0,0.2)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day: Clouds */}
      <AnimatePresence>
        {!isNight && (
          <motion.div className="fixed inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            {[
              { top: "8%", left: "-5%", scale: 1.2, duration: 40 },
              { top: "14%", left: "20%", scale: 0.9, duration: 55 },
              { top: "5%", left: "55%", scale: 1, duration: 48 },
            ].map((c, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: c.top, left: c.left, transform: `scale(${c.scale})` }}
                animate={{ x: ["0%", "110%"] }}
                transition={{ duration: c.duration, repeat: Infinity, ease: "linear", delay: i * 8 }}
              >
                <div className="relative" style={{ width: 120, height: 50 }}>
                  <div className="absolute rounded-full" style={{ width: 80, height: 40, background: "rgba(255,255,255,0.85)", top: 10, left: 0 }} />
                  <div className="absolute rounded-full" style={{ width: 60, height: 50, background: "rgba(255,255,255,0.85)", top: 0, left: 25 }} />
                  <div className="absolute rounded-full" style={{ width: 50, height: 35, background: "rgba(255,255,255,0.8)", top: 12, left: 65 }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xl px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/login")}
            className="text-xs transition-colors px-2 py-1 rounded"
            style={{ color: isNight ? "#555" : "#888", background: isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)" }}
          >
            ← Выйти
          </button>
          <div className="text-center">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "serif",
                color: isNight ? "#cc3300" : "#8b1a1a",
                textShadow: isNight ? "0 0 20px rgba(220,0,0,0.5)" : "none",
              }}
            >
              ЖК «Мафия»
            </h1>
            <p className="text-xs" style={{ color: isNight ? "#555" : "#999" }}>
              Ведущий: {user.nickname || "Ведущий"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold" style={{ color: isNight ? "#ff4422" : "#8b1a1a" }}>
              {totalPlayers}/12
            </div>
            <div className="text-xs" style={{ color: isNight ? "#555" : "#aaa" }}>игроков</div>
          </div>
        </div>

        {/* Negotiations button — only in daytime */}
        <AnimatePresence>
          {!isNight && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <motion.button
                onClick={() => navigate("/negotiations", { state: user })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, #1a1005, #2d1f08)",
                  color: "#f59e0b",
                  border: "2px solid #d97706",
                  boxShadow: "0 0 24px rgba(217,119,6,0.35), inset 0 1px 0 rgba(255,200,50,0.1)",
                }}
              >
                <span className="text-xl">🪑</span>
                <span>Стол переговоров</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Night / Morning buttons */}
        <div className="flex gap-3 mb-5">
          <motion.button
            onClick={() => switchTime("night")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base transition-all"
            style={{
              background: isNight
                ? "linear-gradient(135deg, #1a0000, #3a0000)"
                : "linear-gradient(135deg, #111, #2a0000)",
              color: "#ff3300",
              border: isNight ? "2px solid #aa0000" : "2px solid #3a0000",
              boxShadow: isNight ? "0 0 24px rgba(180,0,0,0.5), inset 0 1px 0 rgba(255,100,100,0.1)" : "none",
            }}
          >
            <span className="text-xl">💀</span>
            <span>Ночь</span>
          </motion.button>

          <motion.button
            onClick={() => switchTime("day")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base transition-all"
            style={{
              background: !isNight
                ? "linear-gradient(135deg, #0a3a00, #1a6000)"
                : "linear-gradient(135deg, #0a1a00, #0d2800)",
              color: !isNight ? "#aaff44" : "#336600",
              border: !isNight ? "2px solid #44aa00" : "2px solid #1a3a00",
              boxShadow: !isNight ? "0 0 24px rgba(80,200,0,0.4), inset 0 1px 0 rgba(150,255,50,0.1)" : "none",
            }}
          >
            <span className="text-xl">☀️</span>
            <span>Утро</span>
          </motion.button>
        </div>

        {/* Building */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          animate={{
            borderColor: isNight ? "rgba(100,0,0,0.5)" : "rgba(200,160,100,0.4)",
          }}
          transition={{ duration: 1.5 }}
          style={{
            border: "1px solid",
            background: isNight ? "#080303" : "#1a1000",
            boxShadow: buildingGlow,
          }}
        >
          {/* Sky above building */}
          <motion.div
            className="w-full"
            animate={{
              background: isNight
                ? "linear-gradient(to bottom, #000010, #05020a)"
                : "linear-gradient(to bottom, #87ceeb, #b8d8ea)",
            }}
            transition={{ duration: 2 }}
            style={{ height: 40, position: "relative", overflow: "hidden" }}
          >
            {/* Roof spikes */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-8">
              {[14, 20, 26, 20, 14].map((h, i) => (
                <div key={i} className="rounded-t" style={{ width: 10, height: h, background: isNight ? "#0d0303" : "#1a1000", border: isNight ? "1px solid #200505" : "1px solid #3a2800" }} />
              ))}
            </div>

            {/* Inline stars/moon for night (small) */}
            {isNight && (
              <>
                {[[15,30],[30,15],[55,25],[75,10],[90,35]].map(([x, y], i) => (
                  <div key={i} className="absolute rounded-full bg-white" style={{ width: 2, height: 2, left: `${x}%`, top: `${y}%`, opacity: 0.8 }} />
                ))}
              </>
            )}
          </motion.div>

          {/* Floors grid */}
          <div className="px-3 pt-1 pb-2 space-y-1.5">
            {floors.map(floor => (
              <div key={floor} className="flex items-center gap-1.5">
                <span className="text-xs w-4 text-right font-mono shrink-0" style={{ color: isNight ? "#3a0505" : "#6b4a00", fontSize: "9px" }}>{floor}</span>

                <div className="flex-1 grid grid-cols-2 gap-1.5">
                  {[1, 2].map(entrance => {
                    const roomNum = getRoomNumber(entrance, floor)
                    const theme = roomThemes[roomNum - 1]
                    const occupant = occupiedRooms.find(r => r.room_number === roomNum)

                    return (
                      <div
                        key={entrance}
                        className="relative rounded-lg overflow-hidden"
                        style={{
                          aspectRatio: "4/3",
                          border: occupant
                            ? `1.5px solid ${theme.accent}88`
                            : `1px solid ${isNight ? "#1a0505" : "#3a2800"}`,
                          boxShadow: occupant ? `0 0 8px ${theme.accent}33` : "none",
                        }}
                      >
                        <MiniRoomSVG theme={theme} occupant={occupant} />

                        {/* Lit window glow for occupied rooms */}
                        {occupant && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0.15, 0.3, 0.15] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ background: `radial-gradient(ellipse at 55% 30%, ${theme.windowGlow}, transparent 60%)` }}
                          />
                        )}

                        {/* Occupant info bottom */}
                        {occupant && (
                          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-1 pb-0.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}>
                            {occupant.player_avatar ? (
                              <img src={occupant.player_avatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" style={{ border: `1px solid ${theme.accent}` }} />
                            ) : (
                              <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center" style={{ background: theme.accent + "33", border: `1px solid ${theme.accent}`, fontSize: 7 }}>👤</div>
                            )}
                            <span className="text-white truncate" style={{ fontSize: "7px", textShadow: "0 1px 2px #000", fontWeight: 600 }}>
                              {occupant.player_nickname}
                            </span>
                          </div>
                        )}

                        {/* Empty room — dark overlay */}
                        {!occupant && (
                          <div className="absolute inset-0" style={{ background: isNight ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)" }} />
                        )}

                        {/* Room number */}
                        <div className="absolute top-0.5 left-1 font-mono" style={{ fontSize: "7px", color: occupant ? theme.accent : isNight ? "#2a0505" : "#4a3800", opacity: 0.8 }}>
                          {roomNum}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="w-4 shrink-0 flex flex-col items-center justify-center gap-0.5">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-3 rounded" style={{ height: 2, background: isNight ? `rgba(80,10,10,${0.4 - i * 0.07})` : `rgba(120,80,0,${0.3 - i * 0.05})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Entrance */}
          <div className="flex gap-2 px-3 pb-3">
            <div className="w-4 shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-1.5">
              {[1, 2].map(e => (
                <div key={e} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-10 h-8 rounded-t-full flex items-end justify-center pb-1"
                    style={{ background: isNight ? "linear-gradient(to bottom, #1a0505, #0a0202)" : "linear-gradient(to bottom, #2a1800, #1a0f00)", border: isNight ? "1px solid #300a0a" : "1px solid #4a3000" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: isNight ? "#8B0000" : "#aa6600" }} />
                  </div>
                  <span style={{ color: isNight ? "#400a0a" : "#6b4a00", fontSize: "8px" }}>Подъезд {e}</span>
                </div>
              ))}
            </div>
            <div className="w-4 shrink-0" />
          </div>
        </motion.div>

        {/* Players list */}
        {totalPlayers > 0 && (
          <motion.div
            className="mt-4 rounded-2xl p-4"
            style={{ background: isNight ? "rgba(10,3,3,0.95)" : "rgba(255,255,255,0.85)", border: isNight ? "1px solid #2a0505" : "1px solid #e0c87a" }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: isNight ? "#cc3300" : "#8b1a1a", fontFamily: "serif" }}>
              Заселились ({totalPlayers})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {occupiedRooms.map(p => (
                <div key={p.room_number} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: isNight ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)" }}>
                  {p.player_avatar ? (
                    <img src={p.player_avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: `1.5px solid ${roomThemes[p.room_number - 1].accent}` }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-base" style={{ background: roomThemes[p.room_number - 1].accent + "22", border: `1.5px solid ${roomThemes[p.room_number - 1].accent}` }}>👤</div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isNight ? "#fff" : "#1a0a0a" }}>{p.player_nickname}</div>
                    <div style={{ fontSize: "9px", color: roomThemes[p.room_number - 1].accent }}>Ком. {p.room_number}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {totalPlayers === 0 && (
          <div className="mt-4 text-center" style={{ color: isNight ? "#3a0505" : "#9a8060" }}>
            <p className="text-sm">Игроки ещё не заселились</p>
          </div>
        )}
      </div>
    </div>
  )
}