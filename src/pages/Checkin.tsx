import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const roomThemes = [
  {
    id: 1,
    bg: "from-gray-900 to-red-950",
    wall: "#1a0a0a",
    floor: "#2d1515",
    bedColor: "#8B0000",
    bedSheet: "#3d0000",
    curtain: "#4a0000",
    decoration: "🩸",
    extra: "spider",
    windowGlow: "rgba(180,0,0,0.3)",
  },
  {
    id: 2,
    bg: "from-slate-900 to-purple-950",
    wall: "#0d0a1a",
    floor: "#1a1530",
    bedColor: "#2d1b69",
    bedSheet: "#1a0d3d",
    curtain: "#1f0d4a",
    decoration: "💀",
    extra: "cobweb",
    windowGlow: "rgba(100,0,180,0.3)",
  },
  {
    id: 3,
    bg: "from-zinc-900 to-green-950",
    wall: "#0a1a0a",
    floor: "#0d1f0d",
    bedColor: "#1a3d1a",
    bedSheet: "#0d2b0d",
    curtain: "#0a2a0a",
    decoration: "🕷️",
    extra: "slime",
    windowGlow: "rgba(0,150,0,0.2)",
  },
  {
    id: 4,
    bg: "from-stone-900 to-orange-950",
    wall: "#1a0f00",
    floor: "#2a1a00",
    bedColor: "#6b3a00",
    bedSheet: "#3d2000",
    curtain: "#4a2800",
    decoration: "🔥",
    extra: "fire",
    windowGlow: "rgba(200,80,0,0.3)",
  },
  {
    id: 5,
    bg: "from-gray-900 to-blue-950",
    wall: "#030a1a",
    floor: "#050f2a",
    bedColor: "#0a1f5c",
    bedSheet: "#050f3d",
    curtain: "#03082e",
    decoration: "👻",
    extra: "ghost",
    windowGlow: "rgba(0,50,200,0.3)",
  },
  {
    id: 6,
    bg: "from-neutral-900 to-red-900",
    wall: "#1a0505",
    floor: "#2a0808",
    bedColor: "#7a0000",
    bedSheet: "#4a0000",
    curtain: "#5a0000",
    decoration: "🩸",
    extra: "cracks",
    windowGlow: "rgba(220,0,0,0.4)",
  },
  {
    id: 7,
    bg: "from-gray-950 to-violet-950",
    wall: "#0f0a1f",
    floor: "#1a1530",
    bedColor: "#3d1a6b",
    bedSheet: "#2a0d4a",
    curtain: "#280a5a",
    decoration: "🕸️",
    extra: "cobweb",
    windowGlow: "rgba(120,0,220,0.3)",
  },
  {
    id: 8,
    bg: "from-zinc-950 to-teal-950",
    wall: "#00100f",
    floor: "#001a18",
    bedColor: "#003d35",
    bedSheet: "#002820",
    curtain: "#002520",
    decoration: "☠️",
    extra: "bones",
    windowGlow: "rgba(0,180,150,0.2)",
  },
  {
    id: 9,
    bg: "from-gray-900 to-rose-950",
    wall: "#1a0510",
    floor: "#2a0818",
    bedColor: "#7a002a",
    bedSheet: "#4a001a",
    curtain: "#5a0022",
    decoration: "🦇",
    extra: "bat",
    windowGlow: "rgba(200,0,80,0.3)",
  },
  {
    id: 10,
    bg: "from-stone-950 to-amber-950",
    wall: "#1a0f00",
    floor: "#2a1800",
    bedColor: "#6b3d00",
    bedSheet: "#4a2800",
    curtain: "#3d1f00",
    decoration: "💀",
    extra: "skull",
    windowGlow: "rgba(180,80,0,0.3)",
  },
  {
    id: 11,
    bg: "from-slate-950 to-cyan-950",
    wall: "#000f1a",
    floor: "#00182a",
    bedColor: "#003d5c",
    bedSheet: "#002840",
    curtain: "#00253d",
    decoration: "👁️",
    extra: "eye",
    windowGlow: "rgba(0,150,200,0.3)",
  },
  {
    id: 12,
    bg: "from-gray-950 to-gray-800",
    wall: "#0a0a0a",
    floor: "#151515",
    bedColor: "#2a2a2a",
    bedSheet: "#1a1a1a",
    curtain: "#1f1f1f",
    decoration: "⚰️",
    extra: "coffin",
    windowGlow: "rgba(150,150,150,0.2)",
  },
]

function RoomSVG({ theme, isHovered }: { theme: typeof roomThemes[0]; isHovered: boolean }) {
  const extras: Record<string, JSX.Element> = {
    spider: (
      <g>
        <circle cx="72" cy="18" r="3" fill="#111" />
        <line x1="72" y1="8" x2="72" y2="18" stroke="#555" strokeWidth="0.7" />
        {[-6,-3,0,3,6].map((x,i) => (
          <line key={i} x1="72" y1="18" x2={72+x*3} y2="24" stroke="#444" strokeWidth="0.5" />
        ))}
      </g>
    ),
    cobweb: (
      <g opacity="0.7">
        {[0,1,2,3].map(i => (
          <path key={i} d={`M 90 8 Q ${80-i*8} ${15+i*5} ${70-i*4} ${10+i*8}`} fill="none" stroke="#888" strokeWidth="0.5" />
        ))}
        <path d="M 90 8 L 70 8 L 60 20 M 90 8 L 90 22 M 90 8 L 105 20" fill="none" stroke="#777" strokeWidth="0.5" />
      </g>
    ),
    slime: (
      <g>
        <ellipse cx="20" cy="10" rx="8" ry="4" fill="#00aa44" opacity="0.5" />
        <path d="M 15 10 Q 17 18 14 20 M 22 10 Q 24 16 22 22" stroke="#00bb44" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>
    ),
    ghost: (
      <g opacity="0.5">
        <ellipse cx="85" cy="18" rx="7" ry="9" fill="white" />
        <path d="M 78 24 Q 80 28 82 24 Q 84 28 86 24 Q 88 28 90 24 L 92 18 Q 92 9 85 9 Q 78 9 78 18 Z" fill="white" />
        <circle cx="82" cy="16" r="1.5" fill="#222" />
        <circle cx="88" cy="16" r="1.5" fill="#222" />
      </g>
    ),
    bat: (
      <g opacity="0.7">
        <ellipse cx="30" cy="12" rx="4" ry="3" fill="#333" />
        <path d="M 26 12 Q 18 6 14 12 Q 18 10 22 14 Z" fill="#333" />
        <path d="M 34 12 Q 42 6 46 12 Q 42 10 38 14 Z" fill="#333" />
      </g>
    ),
    bones: (
      <g opacity="0.6">
        <line x1="10" y1="60" x2="25" y2="75" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="60" r="3" fill="#ccc" />
        <circle cx="25" cy="75" r="3" fill="#ccc" />
      </g>
    ),
    skull: (
      <g opacity="0.5" transform="translate(5,55) scale(0.5)">
        <ellipse cx="20" cy="15" rx="15" ry="13" fill="#ddd" />
        <rect x="10" y="24" width="20" height="10" rx="2" fill="#ddd" />
        <circle cx="14" cy="16" r="4" fill="#333" />
        <circle cx="26" cy="16" r="4" fill="#333" />
        <rect x="14" y="26" width="3" height="7" rx="1" fill="#333" />
        <rect x="19" y="26" width="3" height="7" rx="1" fill="#333" />
        <rect x="24" y="26" width="3" height="7" rx="1" fill="#333" />
      </g>
    ),
    eye: (
      <g>
        <ellipse cx="70" cy="20" rx="8" ry="5" fill="#111" stroke="#ff2020" strokeWidth="0.8" />
        <circle cx="70" cy="20" r="3" fill="#ff0000" />
        <circle cx="71" cy="19" r="1" fill="#fff" />
      </g>
    ),
    fire: (
      <g opacity="0.7">
        <path d="M 15 70 Q 12 60 18 55 Q 16 65 22 60 Q 20 50 28 45 Q 24 58 30 55 Q 28 65 24 70 Z" fill="url(#fireGrad)" />
        <defs>
          <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6600" />
            <stop offset="100%" stopColor="#ffcc00" />
          </linearGradient>
        </defs>
      </g>
    ),
    cracks: (
      <g stroke="#8B0000" strokeWidth="0.7" opacity="0.5">
        <path d="M 10 30 L 20 45 L 15 55 M 20 45 L 28 50" fill="none" />
        <path d="M 90 20 L 95 38 L 88 50 M 95 38 L 105 42" fill="none" />
      </g>
    ),
    coffin: (
      <g opacity="0.5" transform="translate(5,50) scale(0.45)">
        <path d="M 20 0 L 30 0 L 40 15 L 40 50 L 25 58 L 10 50 L 10 15 Z" fill="#1a1a1a" stroke="#555" strokeWidth="1.5" />
        <line x1="10" y1="25" x2="40" y2="25" stroke="#444" strokeWidth="1" />
        <ellipse cx="25" cy="35" rx="5" ry="8" fill="#555" opacity="0.5" />
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wall */}
      <rect width="120" height="90" fill={theme.wall} />
      {/* Wallpaper pattern */}
      {[0,1,2,3,4,5].map(col =>
        [0,1,2,3].map(row => (
          <text key={`${col}-${row}`} x={col*22+8} y={row*22+14} fontSize="6" fill="rgba(255,255,255,0.04)" fontFamily="serif">✝</text>
        ))
      )}
      {/* Floor */}
      <rect y="68" width="120" height="22" fill={theme.floor} />
      {/* Floor planks */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={i*30} y1="68" x2={i*30+20} y2="90" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
      ))}
      {/* Blood stains on floor */}
      <ellipse cx="45" cy="78" rx="8" ry="3" fill="#8B000040" />
      <ellipse cx="90" cy="82" rx="5" ry="2" fill="#8B000030" />

      {/* Window */}
      <rect x="38" y="8" width="34" height="26" rx="2" fill="#050505" stroke={theme.curtain} strokeWidth="1.5" />
      <rect x="38" y="8" width="34" height="26" rx="2" fill={theme.windowGlow} />
      {/* Moon */}
      <circle cx="62" cy="21" r="8" fill="#e8e0c0" opacity="0.6" />
      <circle cx="65" cy="19" r="7" fill={theme.wall} opacity="0.85" />
      {/* Window cross */}
      <line x1="55" y1="8" x2="55" y2="34" stroke={theme.curtain} strokeWidth="1" />
      <line x1="38" y1="21" x2="72" y2="21" stroke={theme.curtain} strokeWidth="1" />
      {/* Curtains */}
      <path d={`M 38 8 Q 32 15 34 28 Q 38 22 38 34`} fill={theme.curtain} opacity="0.9" />
      <path d={`M 72 8 Q 78 15 76 28 Q 72 22 72 34`} fill={theme.curtain} opacity="0.9" />

      {/* Bed frame */}
      <rect x="8" y="52" width="50" height="20" rx="2" fill={theme.bedColor} />
      {/* Mattress */}
      <rect x="9" y="53" width="48" height="16" rx="1" fill={theme.bedSheet} />
      {/* Pillow */}
      <rect x="11" y="54" width="14" height="8" rx="2" fill="rgba(255,255,255,0.12)" />
      {/* Blanket folds */}
      <path d="M 25 55 Q 35 53 45 56 Q 40 58 30 57 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M 27 60 Q 38 58 50 61" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />
      {/* Headboard */}
      <rect x="6" y="46" width="6" height="26" rx="2" fill={theme.bedColor} />
      {/* Bedpost */}
      <rect x="55" y="49" width="4" height="8" rx="1" fill={theme.bedColor} />

      {/* Extra decoration */}
      {extras[theme.extra]}

      {/* Candle */}
      <rect x="95" y="52" width="4" height="10" rx="1" fill="#d4b896" />
      <path d="M 97 52 Q 96 47 97 44 Q 98 47 97 52" fill="#ffaa00" opacity="0.9" />
      <ellipse cx="97" cy="45" rx="1.5" ry="2" fill="#ffdd00" opacity="0.7" />
      {/* Candle glow */}
      {isHovered && <circle cx="97" cy="48" r="10" fill="#ffaa0020" />}

      {/* Decoration text */}
      <text x="95" y="50" fontSize="9" textAnchor="middle">{theme.decoration}</text>
    </svg>
  )
}

// Layout: 2 entrances × 6 floors
// Rooms numbered 1-12 bottom to top: entrance1 floor1=1, entrance2 floor1=2, entrance1 floor2=3, entrance2 floor2=4, ...
function getRoomNumber(entrance: number, floor: number): number {
  return (floor - 1) * 2 + entrance
}

export default function Checkin() {
  const navigate = useNavigate()
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [settled, setSettled] = useState(false)

  const handleRoomClick = (roomNum: number) => {
    setSelectedRoom(roomNum)
    setTimeout(() => setSettled(true), 600)
  }

  const floors = [6, 5, 4, 3, 2, 1]

  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden py-8 px-4"
      style={{ background: "radial-gradient(ellipse at center, #1a0a0a 0%, #050505 100%)" }}>

      {/* Fog effect */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(100,0,0,0.08) 0%, transparent 70%)" }} />

      {/* Flying bats */}
      {[0,1,2].map(i => (
        <motion.div key={i} className="pointer-events-none fixed text-xl opacity-30 z-0"
          initial={{ x: -100, y: 80 + i * 120 }}
          animate={{ x: "110vw", y: [80 + i * 120, 60 + i * 120, 90 + i * 120] }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3 }}>
          🦇
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-500 mb-1" style={{ fontFamily: "serif", textShadow: "0 0 20px rgba(220,0,0,0.6)" }}>
            ЖК «Мафия»
          </h1>
          <p className="text-gray-500 text-sm">Выбери комнату для заселения</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
            <span>🕷️ Подъезд 1</span>
            <span>💀 Подъезд 2</span>
          </div>
        </div>

        {/* Building */}
        <div className="relative rounded-2xl overflow-hidden border border-red-950/60"
          style={{ background: "#0a0505", boxShadow: "0 0 60px rgba(100,0,0,0.4), 0 0 120px rgba(50,0,0,0.3)" }}>

          {/* Roof */}
          <div className="relative flex items-end justify-center pt-4 pb-0"
            style={{ background: "linear-gradient(to bottom, #050505, #0d0505)" }}>
            {/* Gargoyles */}
            <span className="absolute left-8 bottom-0 text-2xl opacity-50">👿</span>
            <span className="absolute right-8 bottom-0 text-2xl opacity-50">👿</span>
            {/* Chimney */}
            <div className="w-8 h-10 rounded-t" style={{ background: "#0d0505", border: "1px solid #2a0505" }} />
            {/* Big cobweb */}
            <svg className="absolute top-2 left-2 opacity-20" width="60" height="40" viewBox="0 0 60 40">
              {[10,20,30].map(r => <ellipse key={r} cx="30" cy="5" rx={r} ry={r*0.6} fill="none" stroke="#888" strokeWidth="0.7" />)}
              {[0,30,60,90,120,150].map((a,i) => {
                const rad = a * Math.PI / 180
                return <line key={i} x1="30" y1="5" x2={30+35*Math.cos(rad)} y2={5+35*Math.sin(rad)} stroke="#888" strokeWidth="0.5" />
              })}
            </svg>
          </div>

          {/* Floors */}
          <div className="px-3 pb-0">
            {floors.map((floor) => (
              <div key={floor} className="flex gap-2 mb-1">
                {/* Floor number */}
                <div className="flex items-center w-5">
                  <span className="text-xs text-red-900/60 font-mono">{floor}</span>
                </div>

                {/* Entrance 1 */}
                {[1, 2].map((entrance) => {
                  const roomNum = getRoomNumber(entrance, floor)
                  const theme = roomThemes[roomNum - 1]
                  const isHovered = hoveredRoom === roomNum
                  const isSelected = selectedRoom === roomNum

                  return (
                    <motion.div key={entrance}
                      className="flex-1 relative cursor-pointer rounded overflow-hidden"
                      style={{
                        height: "80px",
                        border: isSelected
                          ? "2px solid #ff0000"
                          : isHovered
                          ? "1.5px solid #8B000080"
                          : "1px solid #1a0505",
                        boxShadow: isSelected
                          ? "0 0 20px rgba(255,0,0,0.5), inset 0 0 15px rgba(255,0,0,0.1)"
                          : isHovered
                          ? "0 0 10px rgba(139,0,0,0.4)"
                          : "none",
                      }}
                      onMouseEnter={() => setHoveredRoom(roomNum)}
                      onMouseLeave={() => setHoveredRoom(null)}
                      onClick={() => !settled && !selectedRoom && handleRoomClick(roomNum)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}>

                      <RoomSVG theme={theme} isHovered={isHovered} />

                      {/* Hover overlay with room number */}
                      <AnimatePresence>
                        {isHovered && !isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.55)" }}>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-400"
                                style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)", fontFamily: "serif" }}>
                                {roomNum}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">Комната {roomNum}</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Selected overlay */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(139,0,0,0.5)" }}>
                          <div className="text-center">
                            <div className="text-2xl">✓</div>
                            <div className="text-xs text-red-300 font-bold">Твоя</div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}

                {/* Staircase divider */}
                <div className="flex items-center w-6">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="w-4 h-px" style={{ background: `rgba(80,0,0,${0.3 - i*0.04})` }} />
                    ))}
                  </div>
                </div>

                {/* Entrance 3 and 4 — this is second stairwell */}
              </div>
            ))}
          </div>

          {/* Ground floor / entrance */}
          <div className="flex gap-2 px-3 pb-3 pt-1">
            <div className="w-5" />
            {/* Entrance doors */}
            <div className="flex-1 flex gap-2">
              {/* Door 1 */}
              <div className="flex-1 flex flex-col items-center justify-end" style={{ height: "48px" }}>
                <div className="w-10 h-10 rounded-t-full border border-red-900/40 flex items-end justify-center pb-1"
                  style={{ background: "linear-gradient(to bottom, #1a0505, #0a0202)" }}>
                  <div className="w-1 h-1 rounded-full bg-red-800" />
                </div>
                <div className="text-xs text-red-900/50 mt-1">Подъезд 1</div>
              </div>
            </div>
            <div className="w-6" />
            <div className="flex-1 flex flex-col items-center justify-end" style={{ height: "48px" }}>
              <div className="w-10 h-10 rounded-t-full border border-red-900/40 flex items-end justify-center pb-1"
                style={{ background: "linear-gradient(to bottom, #1a0505, #0a0202)" }}>
                <div className="w-1 h-1 rounded-full bg-red-800" />
              </div>
              <div className="text-xs text-red-900/50 mt-1">Подъезд 2</div>
            </div>
          </div>

          {/* Blood drips on building walls */}
          <div className="pointer-events-none absolute inset-0">
            {[15, 35, 75, 95].map((x, i) => (
              <div key={i} className="absolute top-0" style={{ left: `${x}%` }}>
                <div className="w-0.5 rounded-b-full" style={{
                  height: `${20 + i * 12}px`,
                  background: "linear-gradient(to bottom, #8B0000, transparent)",
                  opacity: 0.4,
                }} />
                <div className="w-1.5 h-1.5 rounded-full -mt-0.5 -ml-0.5" style={{ background: "#8B0000", opacity: 0.3 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Settlement confirmation */}
        <AnimatePresence>
          {settled && selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-6 p-4 rounded-xl border border-red-800/50 text-center"
              style={{ background: "rgba(50,0,0,0.6)", boxShadow: "0 0 30px rgba(139,0,0,0.3)" }}>
              <div className="text-3xl mb-2">🔑</div>
              <p className="text-red-300 font-bold text-lg">Добро пожаловать в комнату {selectedRoom}!</p>
              <p className="text-gray-500 text-sm mt-1">Выход запрещён до рассвета</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{ background: "linear-gradient(to right, #7a0000, #c00000)", color: "white", boxShadow: "0 0 16px rgba(180,0,0,0.4)" }}>
                Войти в игру →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!settled && (
          <p className="text-center text-xs text-gray-700 mt-4">Нажми на комнату, чтобы заселиться</p>
        )}
      </motion.div>
    </div>
  )
}
