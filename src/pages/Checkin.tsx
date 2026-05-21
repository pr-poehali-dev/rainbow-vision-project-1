import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

const ROOMS_API = "https://functions.poehali.dev/9d8dc40f-548f-4a38-b857-de8c0359ae9d"

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

function RoomSVG({ theme, large = false }: { theme: typeof roomThemes[0]; large?: boolean }) {
  const s = large ? 3 : 1

  const extras: Record<string, JSX.Element> = {
    spider: (
      <g>
        <line x1="84" y1="4" x2="84" y2="22" stroke="#666" strokeWidth="0.8" />
        <ellipse cx="84" cy="25" rx="5" ry="4" fill="#111" />
        <ellipse cx="84" cy="22" rx="3.5" ry="3" fill="#222" />
        {[-3,-1.5,0,1.5,3].map((x,i) => (
          <line key={i} x1="84" y1="24" x2={84+x*6} y2="30" stroke="#444" strokeWidth="0.7" />
        ))}
        {[-3,-1.5,0,1.5,3].map((x,i) => (
          <line key={i} x1="84" y1="24" x2={84+x*6} y2="18" stroke="#444" strokeWidth="0.7" />
        ))}
        <circle cx="82" cy="23" r="0.8" fill="#ff2200" />
        <circle cx="86" cy="23" r="0.8" fill="#ff2200" />
      </g>
    ),
    cobweb: (
      <g opacity="0.8">
        {[8,16,24,32].map(r => (
          <ellipse key={r} cx="108" cy="8" rx={r} ry={r*0.6} fill="none" stroke="#888" strokeWidth="0.6" />
        ))}
        {[0,30,60,90,120,150,180].map((a,i) => {
          const rad = a * Math.PI / 180
          return <line key={i} x1="108" y1="8" x2={108+35*Math.cos(rad)} y2={8+35*Math.sin(rad)} stroke="#777" strokeWidth="0.5" />
        })}
      </g>
    ),
    slime: (
      <g>
        <ellipse cx="15" cy="8" rx="10" ry="5" fill="#00aa44" opacity="0.6" />
        <path d="M 10 8 Q 8 20 6 25" stroke="#00cc55" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M 18 8 Q 20 18 19 26" stroke="#00cc55" strokeWidth="2" fill="none" opacity="0.7" />
        <ellipse cx="6" cy="27" rx="4" ry="3" fill="#00aa44" opacity="0.5" />
        <ellipse cx="19" cy="28" rx="3" ry="2" fill="#00aa44" opacity="0.5" />
      </g>
    ),
    ghost: (
      <g opacity="0.6">
        <ellipse cx="100" cy="22" rx="10" ry="13" fill="white" />
        <path d="M 90 32 Q 93 38 96 32 Q 99 38 102 32 Q 105 38 108 32 L 110 22 Q 110 9 100 9 Q 90 9 90 22 Z" fill="white" />
        <circle cx="96" cy="20" r="2.5" fill="#222" />
        <circle cx="104" cy="20" r="2.5" fill="#222" />
        <path d="M 96 26 Q 100 29 104 26" stroke="#ccc" strokeWidth="1" fill="none" />
      </g>
    ),
    bat: (
      <g opacity="0.8">
        <ellipse cx="20" cy="14" rx="5" ry="4" fill="#2a1a2a" />
        <path d="M 15 14 Q 4 6 0 14 Q 6 11 10 16 Z" fill="#2a1a2a" />
        <path d="M 25 14 Q 36 6 40 14 Q 34 11 30 16 Z" fill="#2a1a2a" />
        <circle cx="18" cy="12" r="1" fill="#ff0044" />
        <circle cx="22" cy="12" r="1" fill="#ff0044" />
      </g>
    ),
    bones: (
      <g opacity="0.7">
        <line x1="6" y1="55" x2="22" y2="72" stroke="#ccc" strokeWidth="3" strokeLinecap="round" />
        <circle cx="6" cy="55" r="4" fill="#ccc" />
        <circle cx="22" cy="72" r="4" fill="#ccc" />
        <circle cx="6" cy="59" r="4" fill="#ccc" />
        <circle cx="22" cy="68" r="4" fill="#ccc" />
        <line x1="18" y1="55" x2="6" y2="70" stroke="#ccc" strokeWidth="3" strokeLinecap="round" />
        <circle cx="18" cy="55" r="4" fill="#ccc" />
        <circle cx="6" cy="70" r="4" fill="#ccc" />
        <circle cx="18" cy="59" r="4" fill="#ccc" />
        <circle cx="6" cy="66" r="4" fill="#ccc" />
      </g>
    ),
    skull: (
      <g opacity="0.65" transform="translate(4,50) scale(0.7)">
        <ellipse cx="20" cy="18" rx="18" ry="16" fill="#ddd" />
        <rect x="8" y="28" width="24" height="12" rx="3" fill="#ddd" />
        <circle cx="13" cy="18" r="5" fill="#333" />
        <circle cx="27" cy="18" r="5" fill="#333" />
        <rect x="12" y="30" width="4" height="9" rx="1.5" fill="#333" />
        <rect x="18" y="30" width="4" height="9" rx="1.5" fill="#333" />
        <rect x="24" y="30" width="4" height="9" rx="1.5" fill="#333" />
        <ellipse cx="20" cy="12" rx="6" ry="3" fill="#bbb" opacity="0.4" />
      </g>
    ),
    eye: (
      <g>
        <ellipse cx="100" cy="22" rx="12" ry="8" fill="#0a0a0a" stroke={theme.accent} strokeWidth="1.2" />
        <circle cx="100" cy="22" r="5" fill={theme.accent} opacity="0.9" />
        <circle cx="100" cy="22" r="2.5" fill="#111" />
        <circle cx="101.5" cy="20.5" r="1.2" fill="white" opacity="0.8" />
        {[0,60,120,180,240,300].map((a,i) => {
          const r = a*Math.PI/180
          return <line key={i} x1={100+12*Math.cos(r)} y1={22+8*Math.sin(r)} x2={100+16*Math.cos(r)} y2={22+11*Math.sin(r)} stroke={theme.accent} strokeWidth="0.7" opacity="0.5" />
        })}
      </g>
    ),
    fire: (
      <g>
        <defs>
          <linearGradient id="fg1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffcc00" />
            <stop offset="60%" stopColor="#ff4400" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 10 72 Q 6 56 14 48 Q 10 62 18 56 Q 14 44 24 38 Q 18 54 26 50 Q 22 60 20 72 Z" fill="url(#fg1)" opacity="0.85" />
        <path d="M 20 72 Q 18 62 22 58 Q 20 65 26 60 Q 24 52 30 46 Q 27 58 32 72 Z" fill="url(#fg1)" opacity="0.7" />
      </g>
    ),
    cracks: (
      <g stroke="#8B0000" strokeWidth="1" opacity="0.6">
        <path d="M 8 25 L 18 42 L 12 55 M 18 42 L 26 48" fill="none" strokeLinecap="round" />
        <path d="M 105 15 L 110 36 L 104 50 M 110 36 L 118 42" fill="none" strokeLinecap="round" />
        <path d="M 55 70 L 60 80 L 56 88 M 60 80 L 65 84" fill="none" strokeLinecap="round" />
      </g>
    ),
    coffin: (
      <g opacity="0.65" transform="translate(4,46) scale(0.55)">
        <path d="M 15 0 L 35 0 L 48 18 L 48 64 L 25 74 L 2 64 L 2 18 Z" fill="#111" stroke="#555" strokeWidth="2" />
        <path d="M 15 0 L 35 0 L 48 18 L 2 18 Z" fill="#1a1a1a" stroke="#555" strokeWidth="1" />
        <line x1="2" y1="32" x2="48" y2="32" stroke="#444" strokeWidth="1" />
        <ellipse cx="25" cy="48" rx="7" ry="11" fill="#555" opacity="0.5" />
        <ellipse cx="25" cy="20" rx="6" ry="4" fill="#444" opacity="0.4" />
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Wall */}
      <rect width="120" height="90" fill={theme.wall} />

      {/* Wallpaper subtle pattern */}
      {[0,1,2,3,4,5].map(col =>
        [0,1,2,3].map(row => (
          <text key={`${col}-${row}`} x={col*22+6} y={row*22+16} fontSize="7" fill="rgba(255,255,255,0.035)" fontFamily="serif">✝</text>
        ))
      )}

      {/* Floor */}
      <rect y="68" width="120" height="22" fill={theme.floor} />
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={i*25} y1="68" x2={i*25+15} y2="90" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
      ))}

      {/* Blood puddle */}
      <ellipse cx="44" cy="78" rx="10" ry="4" fill="#8B0000" opacity="0.3" />
      <ellipse cx="90" cy="83" rx="6" ry="2.5" fill="#8B0000" opacity="0.25" />

      {/* Window frame outer */}
      <rect x="36" y="6" width="38" height="28" rx="3" fill="#050505" />
      {/* Window glow (night sky) */}
      <rect x="37" y="7" width="36" height="26" rx="2" fill="#080818" />
      <rect x="37" y="7" width="36" height="26" rx="2" fill={theme.windowGlow} />
      {/* Stars */}
      {[[45,12],[52,10],[62,13],[68,10],[74,15],[42,18]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity="0.7" />
      ))}
      {/* Moon */}
      <circle cx="64" cy="20" r="9" fill="#e8e0c0" opacity="0.55" />
      <circle cx="67" cy="18" r="7.5" fill="#080818" opacity="0.9" />
      {/* Window cross */}
      <line x1="55" y1="7" x2="55" y2="33" stroke={theme.curtain} strokeWidth="1.5" opacity="0.8" />
      <line x1="37" y1="20" x2="73" y2="20" stroke={theme.curtain} strokeWidth="1.5" opacity="0.8" />
      {/* Curtains */}
      <path d="M 36 6 Q 28 16 30 32 Q 36 24 37 34 L 36 34 Z" fill={theme.curtain} opacity="0.95" />
      <path d="M 74 6 Q 82 16 80 32 Q 74 24 73 34 L 74 34 Z" fill={theme.curtain} opacity="0.95" />
      {/* Curtain detail */}
      <path d="M 36 6 Q 30 12 31 22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
      <path d="M 74 6 Q 80 12 79 22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />

      {/* Bed frame */}
      <rect x="6" y="50" width="58" height="22" rx="3" fill={theme.bedColor} />
      {/* Mattress */}
      <rect x="7" y="51" width="56" height="18" rx="2" fill={theme.bedSheet} />
      {/* Blanket */}
      <rect x="20" y="52" width="42" height="15" rx="2" fill={theme.bedColor} opacity="0.7" />
      {/* Blanket folds */}
      <path d="M 22 56 Q 38 53 54 57" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" fill="none" />
      <path d="M 22 61 Q 38 58 54 62" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
      {/* Pillow */}
      <rect x="9" y="53" width="18" height="11" rx="3" fill="rgba(255,255,255,0.1)" />
      <path d="M 11 56 Q 15 54 24 56" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />
      {/* Headboard */}
      <rect x="4" y="44" width="7" height="28" rx="3" fill={theme.bedColor} />
      {/* Footboard */}
      <rect x="61" y="47" width="5" height="12" rx="2" fill={theme.bedColor} />
      {/* Bed legs */}
      <rect x="6" y="70" width="3" height="6" rx="1" fill={theme.bedColor} opacity="0.6" />
      <rect x="58" y="70" width="3" height="6" rx="1" fill={theme.bedColor} opacity="0.6" />

      {/* Side table */}
      <rect x="72" y="58" width="14" height="12" rx="2" fill={theme.bedColor} opacity="0.7" />
      <rect x="70" y="56" width="18" height="3" rx="1" fill={theme.bedColor} opacity="0.6" />

      {/* Candle on table */}
      <rect x="78" y="46" width="4" height="12" rx="1" fill="#d4b896" />
      <ellipse cx="80" cy="46" rx="2" ry="1" fill="#c8a87a" />
      {/* Flame */}
      <path d="M 80 46 Q 78 40 80 36 Q 82 40 80 46" fill="#ffaa00" opacity="0.9" />
      <ellipse cx="80" cy="38" rx="2" ry="3" fill="#ffdd00" opacity="0.7" />
      {/* Candle glow */}
      <circle cx="80" cy="42" r="12" fill="#ffaa00" opacity="0.07" />
      {/* Wax drip */}
      <path d="M 79 46 Q 78 50 78 52" stroke="#d4b896" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Extra decoration */}
      {extras[theme.extra] || null}

      {/* Room number accent glow on floor near door area */}
      <rect x="88" y="62" width="28" height="26" rx="2" fill={theme.wall} opacity="0.5" />
      {/* Door */}
      <rect x="90" y="54" width="22" height="36" rx="2" fill="#0a0505" stroke={theme.curtain} strokeWidth="1" opacity="0.8" />
      <rect x="91" y="55" width="20" height="34" rx="1.5" fill="#050202" opacity="0.9" />
      <circle cx="99" cy="72" r="1.5" fill={theme.accent} opacity="0.8" />
      {/* Door panel details */}
      <rect x="92" y="57" width="8" height="12" rx="1" fill="rgba(255,255,255,0.03)" />
      <rect x="102" y="57" width="8" height="12" rx="1" fill="rgba(255,255,255,0.03)" />

      {/* Decoration emoji as text */}
      <text x="108" y="50" fontSize="11" textAnchor="middle">{theme.decoration}</text>
    </svg>
  )
}

function getRoomNumber(entrance: number, floor: number): number {
  return (floor - 1) * 2 + entrance
}

interface ModalProps {
  roomNum: number
  theme: typeof roomThemes[0]
  onClose: () => void
  onSelect: () => void
  isSelected: boolean
  occupant?: OccupiedRoom | null
  loading?: boolean
}

function RoomModal({ roomNum, theme, onClose, onSelect, isSelected, occupant, loading }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }} />

      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden"
        initial={{ scale: 0.7, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
        style={{
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 0 60px ${theme.accent}55, 0 0 120px ${theme.accent}22`,
        }}
      >
        {/* Room image large */}
        <div style={{ aspectRatio: "4/3", background: theme.wall }}>
          <RoomSVG theme={theme} large />
        </div>

        {/* Info panel */}
        <div className="p-5" style={{ background: "#0a0505" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: theme.accent, fontFamily: "serif", textShadow: `0 0 12px ${theme.accent}` }}>
                Комната {roomNum}
              </h2>
              <p className="text-gray-500 text-sm">Этаж {Math.ceil(roomNum / 2)} · Подъезд {roomNum % 2 === 1 ? 1 : 2}</p>
            </div>
            <span className="text-4xl">{theme.decoration}</span>
          </div>

          {/* Occupant info */}
          {occupant && !isSelected && (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: "#111", border: `1px solid ${theme.accent}44` }}>
              {occupant.player_avatar ? (
                <img src={occupant.player_avatar} alt={occupant.player_nickname} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${theme.accent}` }} />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: theme.accent + "22", border: `2px solid ${theme.accent}` }}>👤</div>
              )}
              <div>
                <div className="text-sm font-bold text-white">{occupant.player_nickname}</div>
                <div className="text-xs text-gray-500">уже заселился</div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {isSelected ? (
              <div className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center"
                style={{ background: "#1a1a1a", color: theme.accent, border: `1px solid ${theme.accent}` }}>
                ✓ Твоя комната
              </div>
            ) : occupant ? (
              <div className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center text-gray-600"
                style={{ background: "#111", border: "1px solid #333" }}>
                🔒 Занято
              </div>
            ) : (
              <button
                onClick={onSelect}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${theme.accent}cc, ${theme.accent}88)`,
                  color: "white",
                  boxShadow: `0 0 20px ${theme.accent}44`,
                }}
              >
                {loading ? "Заселяю..." : "Заселиться сюда"}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
              style={{ background: "#111", border: "1px solid #333" }}
            >
              Закрыть
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Checkin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)
  const [openRoom, setOpenRoom] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [occupiedRooms, setOccupiedRooms] = useState<OccupiedRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("night")

  const user = location.state || JSON.parse(sessionStorage.getItem("mafia_user") || "{}")

  const floors = [6, 5, 4, 3, 2, 1]
  const openTheme = openRoom ? roomThemes[openRoom - 1] : null

  const fetchRooms = useCallback(async () => {
    const res = await fetch(ROOMS_API)
    const data = await res.json()
    setOccupiedRooms(data.rooms || [])
    if (data.time_of_day) setTimeOfDay(data.time_of_day)
  }, [])

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000)
    return () => clearInterval(interval)
  }, [fetchRooms])

  const handleCheckin = async (roomNum: number) => {
    if (loading) return
    setLoading(true)
    await fetch(ROOMS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_number: roomNum,
        nickname: user.nickname || "Игрок",
        avatar: user.avatar || "",
        role: user.role || "citizen",
      }),
    })
    setSelectedRoom(roomNum)
    await fetchRooms()
    setLoading(false)
    setOpenRoom(null)
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden py-8 px-4"
      style={{ background: "radial-gradient(ellipse at center, #1a0505 0%, #050505 100%)" }}
    >
      {/* Bats */}
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="pointer-events-none fixed text-xl opacity-25 z-0"
          initial={{ x: -80, y: 60 + i * 140 }}
          animate={{ x: "110vw", y: [60 + i * 140, 40 + i * 140, 70 + i * 140] }}
          transition={{ duration: 14 + i * 5, repeat: Infinity, ease: "linear", delay: i * 4 }}>
          🦇
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-5">
          <button onClick={() => navigate("/login")} className="text-gray-600 text-xs hover:text-gray-400 transition-colors mb-3 block mx-auto">
            ← Назад
          </button>
          <h1 className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: "serif", textShadow: "0 0 20px rgba(220,0,0,0.5)" }}>
            ЖК «Мафия»
          </h1>
          <p className="text-gray-500 text-sm">Кликни на комнату, чтобы рассмотреть её</p>
        </div>

        {/* Building */}
        <div
          className="relative rounded-2xl overflow-hidden border border-red-950/50"
          style={{ background: "#080303", boxShadow: "0 0 80px rgba(100,0,0,0.35), 0 0 160px rgba(40,0,0,0.25)" }}
        >
          {/* Roof decor */}
          <div className="flex items-end justify-between px-8 pt-3 pb-1" style={{ background: "linear-gradient(to bottom, #030101, #080303)" }}>
            <span className="text-xl opacity-40">👿</span>
            <div className="flex gap-1 items-end">
              {[16,22,18].map((h,i) => (
                <div key={i} className="w-3 rounded-t" style={{ height: h, background: "#0d0303", border: "1px solid #200505" }} />
              ))}
            </div>
            <span className="text-xl opacity-40">👿</span>
          </div>

          {/* Cobweb top-left */}
          <svg className="absolute top-8 left-2 opacity-15 pointer-events-none" width="70" height="50" viewBox="0 0 70 50">
            {[10,20,30,40].map(r => <ellipse key={r} cx="5" cy="5" rx={r} ry={r*0.65} fill="none" stroke="#aaa" strokeWidth="0.7" />)}
            {[0,30,60,90,120,150,180].map((a,i) => {
              const rad = a*Math.PI/180
              return <line key={i} x1="5" y1="5" x2={5+45*Math.cos(rad)} y2={5+45*Math.sin(rad)} stroke="#999" strokeWidth="0.5" />
            })}
          </svg>

          {/* Floors grid */}
          <div className="px-4 pt-1 pb-2 space-y-1.5">
            {floors.map(floor => (
              <div key={floor} className="flex items-center gap-2">
                {/* Floor label */}
                <span className="text-xs text-red-950 w-4 text-right font-mono shrink-0">{floor}</span>

                {/* 2 rooms */}
                <div className="flex-1 grid grid-cols-2 gap-1.5">
                  {[1, 2].map(entrance => {
                    const roomNum = getRoomNumber(entrance, floor)
                    const theme = roomThemes[roomNum - 1]
                    const isHovered = hoveredRoom === roomNum
                    const isSelected = selectedRoom === roomNum
                    const occupant = occupiedRooms.find(r => r.room_number === roomNum)

                    return (
                      <motion.div
                        key={entrance}
                        className="relative cursor-pointer rounded-lg overflow-hidden"
                        style={{
                          aspectRatio: "4/3",
                          border: isSelected
                            ? `2px solid ${theme.accent}`
                            : occupant
                            ? `1.5px solid ${theme.accent}66`
                            : isHovered
                            ? `1.5px solid ${theme.accent}88`
                            : "1px solid #1a0505",
                          boxShadow: isSelected
                            ? `0 0 16px ${theme.accent}55`
                            : occupant
                            ? `0 0 6px ${theme.accent}33`
                            : isHovered
                            ? `0 0 8px ${theme.accent}33`
                            : "none",
                        }}
                        onMouseEnter={() => setHoveredRoom(roomNum)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        onClick={() => setOpenRoom(roomNum)}
                        whileHover={{ scale: 1.04, zIndex: 2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <RoomSVG theme={theme} />

                        {/* Occupant avatar overlay */}
                        {occupant && !isSelected && (
                          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-1 pb-1" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
                            {occupant.player_avatar ? (
                              <img src={occupant.player_avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" style={{ border: `1px solid ${theme.accent}` }} />
                            ) : (
                              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs" style={{ background: theme.accent + "33", border: `1px solid ${theme.accent}` }}>👤</div>
                            )}
                            <span className="text-white truncate font-medium" style={{ fontSize: "8px", textShadow: "0 1px 3px #000" }}>
                              {occupant.player_nickname}
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "rgba(0,0,0,0.5)" }}
                            >
                              <div className="text-center">
                                <div className="text-xl font-bold" style={{ color: theme.accent, textShadow: `0 0 8px ${theme.accent}`, fontFamily: "serif" }}>
                                  {roomNum}
                                </div>
                                <div className="text-xs text-gray-400">{occupant ? "посмотреть" : "открыть"}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Selected badge */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 text-xs font-bold rounded px-1" style={{ background: theme.accent, color: "#000", fontSize: "9px" }}>
                            ТЫ
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Staircase */}
                <div className="w-5 h-full flex flex-col items-center justify-center gap-0.5 shrink-0">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-4 rounded" style={{ height: 2, background: `rgba(80,10,10,${0.4 - i*0.07})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Entrance doors */}
          <div className="flex gap-2 px-4 pt-0 pb-3">
            <div className="w-4 shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-1.5">
              {[1, 2].map(e => (
                <div key={e} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-12 h-10 rounded-t-full flex items-end justify-center pb-1.5"
                    style={{ background: "linear-gradient(to bottom, #1a0505, #0a0202)", border: "1px solid #300a0a" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#8B0000" }} />
                  </div>
                  <span className="text-xs" style={{ color: "#400a0a", fontSize: "9px" }}>Подъезд {e}</span>
                </div>
              ))}
            </div>
            <div className="w-5 shrink-0" />
          </div>

          {/* Blood drips */}
          <div className="pointer-events-none absolute inset-0">
            {[12, 38, 68, 90].map((x, i) => (
              <div key={i} className="absolute top-0" style={{ left: `${x}%` }}>
                <div className="w-0.5 rounded-b-full" style={{ height: `${18 + i * 10}px`, background: "linear-gradient(to bottom, #8B0000cc, transparent)", }} />
                <div className="w-2 h-2 rounded-full -mt-1 -ml-0.5" style={{ background: "#8B0000", opacity: 0.25 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-4 space-y-3">
          {selectedRoom ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-red-400 text-sm font-medium">
                🔑 Ты заселился в комнату {selectedRoom}
              </span>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{ background: "linear-gradient(to right, #7a0000, #c00000)", color: "white", boxShadow: "0 0 14px rgba(180,0,0,0.4)" }}
              >
                Войти в игру →
              </button>
            </motion.div>
          ) : (
            <p className="text-gray-700 text-xs text-center">Нажми на любую комнату, чтобы рассмотреть и заселиться</p>
          )}

          {/* Negotiations button — shown at daytime when player is checked in */}
          <AnimatePresence>
            {selectedRoom && timeOfDay === "day" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={() => navigate("/negotiations", { state: { ...user, room_number: selectedRoom } })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, #1a1005, #2d1f08)",
                  color: "#f59e0b",
                  border: "2px solid #d97706",
                  boxShadow: "0 0 20px rgba(217,119,6,0.3)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-xl">🪑</span>
                <span>Стол переговоров</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Room modal */}
      <AnimatePresence>
        {openRoom && openTheme && (
          <RoomModal
            roomNum={openRoom}
            theme={openTheme}
            isSelected={selectedRoom === openRoom}
            occupant={occupiedRooms.find(r => r.room_number === openRoom)}
            loading={loading}
            onClose={() => setOpenRoom(null)}
            onSelect={() => handleCheckin(openRoom)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}