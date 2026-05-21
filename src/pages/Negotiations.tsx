import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

const ROOMS_API = "https://functions.poehali.dev/9d8dc40f-548f-4a38-b857-de8c0359ae9d"

interface Player {
  room_number: number
  player_nickname: string
  player_avatar: string
  player_role: string
  is_eliminated: boolean
  votes: number
  coins: number
  voted_for: number | null
}

function CoinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <circle cx="8" cy="8" r="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold">₽</text>
    </svg>
  )
}

interface VoteModalProps {
  target: Player
  myCoins: number
  onVote: (bet: number) => void
  onClose: () => void
}

function VoteModal({ target, myCoins, onVote, onClose }: VoteModalProps) {
  const [bet, setBet] = useState(1)
  const maxBet = Math.min(10, myCoins)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }} />

      <motion.div
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#0f0a05", border: "2px solid #8b4513", boxShadow: "0 0 60px rgba(139,69,19,0.4)" }}
      >
        {/* Header */}
        <div className="p-5 pb-3" style={{ background: "linear-gradient(to bottom, #1a0f05, #0f0a05)", borderBottom: "1px solid #2a1a08" }}>
          <h2 className="text-lg font-bold text-amber-400 text-center" style={{ fontFamily: "serif" }}>
            🗳️ Голосование
          </h2>
          <p className="text-gray-500 text-xs text-center mt-1">Укажи ставку монет</p>
        </div>

        {/* Target player */}
        <div className="p-5">
          <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ background: "rgba(139,69,19,0.15)", border: "1px solid #3a2008" }}>
            {target.player_avatar ? (
              <img src={target.player_avatar} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" style={{ border: "2px solid #d97706" }} />
            ) : (
              <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-2xl" style={{ background: "#3a2008", border: "2px solid #d97706" }}>👤</div>
            )}
            <div>
              <div className="text-white font-bold text-base">{target.player_nickname}</div>
              <div className="text-amber-600 text-sm">Комната {target.room_number}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">Голосов:</span>
                <span className="text-sm font-bold text-amber-400">{target.votes}</span>
              </div>
            </div>
          </div>

          {/* Bet selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Ставка монет</span>
              <div className="flex items-center gap-1.5">
                <CoinIcon size={16} />
                <span className="text-amber-400 font-bold">{bet}</span>
                <span className="text-gray-600 text-xs">из {myCoins}</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={maxBet}
              value={bet}
              onChange={e => setBet(Number(e.target.value))}
              className="w-full accent-amber-500"
              style={{ accentColor: "#f59e0b" }}
            />

            {/* Quick pick buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[1, 2, 3, 5, maxBet].filter((v, i, a) => a.indexOf(v) === i && v <= maxBet).map(v => (
                <button
                  key={v}
                  onClick={() => setBet(v)}
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: bet === v ? "#d97706" : "#1a1005",
                    color: bet === v ? "#000" : "#d97706",
                    border: `1px solid ${bet === v ? "#d97706" : "#3a2008"}`,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Remaining after bet */}
          <div className="flex items-center justify-between p-3 rounded-xl mb-4" style={{ background: "#0a0803", border: "1px solid #1a1005" }}>
            <span className="text-xs text-gray-500">Останется монет</span>
            <div className="flex items-center gap-1">
              <CoinIcon size={14} />
              <span className="text-sm font-bold" style={{ color: myCoins - bet < 5 ? "#ef4444" : "#f59e0b" }}>
                {myCoins - bet}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onVote(bet)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "linear-gradient(to right, #d97706, #f59e0b)",
                color: "#000",
                boxShadow: "0 0 20px rgba(245,158,11,0.3)",
              }}
            >
              Проголосовать за {bet} 🪙
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
              style={{ background: "#111", border: "1px solid #333" }}
            >
              Отмена
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Negotiations() {
  const navigate = useNavigate()
  const location = useLocation()
  const [players, setPlayers] = useState<Player[]>([])
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null)
  const [voteTarget, setVoteTarget] = useState<Player | null>(null)
  const [voting, setVoting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const state = location.state as { nickname?: string; role?: string; avatar?: string; room_number?: number } | null
  const user = state || JSON.parse(sessionStorage.getItem("mafia_user") || "{}")
  const isHost = user.role === "host"

  const fetchPlayers = useCallback(async () => {
    const res = await fetch(ROOMS_API)
    const data = await res.json()
    const all: Player[] = data.rooms || []
    // Живые сначала по номеру комнаты, выбывшие в конце
    all.sort((a, b) => {
      if (a.is_eliminated !== b.is_eliminated) return a.is_eliminated ? 1 : -1
      return a.room_number - b.room_number
    })
    setPlayers(all)
  }, [])

  useEffect(() => {
    fetchPlayers()
    const interval = setInterval(fetchPlayers, 3000)
    return () => clearInterval(interval)
  }, [fetchPlayers])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  // Найти текущего игрока по нику (если не ведущий)
  const myPlayer = players.find(p => p.player_nickname === user.nickname)
  const myCoins = myPlayer?.coins ?? 20
  const hasVoted = myPlayer?.voted_for !== null && myPlayer?.voted_for !== undefined

  const handleVote = async (bet: number) => {
    if (!voteTarget || !myPlayer || voting) return
    setVoting(true)
    try {
      const res = await fetch(ROOMS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vote",
          voter_room: myPlayer.room_number,
          target_room: voteTarget.room_number,
          bet,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        showNotification(`Голос за ${voteTarget.player_nickname} принят! −${bet} 🪙`)
        await fetchPlayers()
        setVoteTarget(null)
      } else {
        showNotification(data.error || "Ошибка голосования")
      }
    } finally {
      setVoting(false)
    }
  }

  const alivePlayers = players.filter(p => !p.is_eliminated)
  const eliminatedPlayers = players.filter(p => p.is_eliminated)

  return (
    <div
      className="min-h-screen"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1000 0%, #0a0800 100%)" }}
    >
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-4 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold text-center"
            style={{ transform: "translateX(-50%)", background: "#1a1005", border: "1px solid #d97706", color: "#f59e0b", boxShadow: "0 0 20px rgba(217,119,6,0.4)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "#666" }}
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "serif" }}>
              🪑 Стол переговоров
            </h1>
            <p className="text-gray-600 text-xs mt-0.5">
              {alivePlayers.length} активных · {eliminatedPlayers.length} выбывших
            </p>
          </div>

          {/* My coins (for players) */}
          {!isHost && myPlayer && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "#1a1005", border: "1px solid #3a2008" }}>
              <CoinIcon size={18} />
              <span className="text-amber-400 font-bold text-lg">{myCoins}</span>
              <span className="text-gray-600 text-xs">монет</span>
            </div>
          )}
        </div>

        {/* Voted badge for player */}
        {!isHost && hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl text-center text-sm"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}
          >
            ✅ Ты уже проголосовал в этом раунде
          </motion.div>
        )}

        {/* Players list */}
        <div className="space-y-2">
          {players.map((player, idx) => {
            const isMe = player.player_nickname === user.nickname
            const isEliminated = player.is_eliminated
            const canVote = !isHost && !isMe && !isEliminated && !hasVoted && !myPlayer?.is_eliminated && myCoins > 0

            return (
              <motion.div
                key={player.room_number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative rounded-2xl overflow-hidden"
                onMouseEnter={() => canVote ? setHoveredPlayer(player.room_number) : null}
                onMouseLeave={() => setHoveredPlayer(null)}
                style={{
                  background: isEliminated
                    ? "rgba(20,10,5,0.6)"
                    : isMe
                    ? "rgba(245,158,11,0.08)"
                    : "rgba(255,255,255,0.04)",
                  border: isMe
                    ? "1px solid rgba(245,158,11,0.4)"
                    : isEliminated
                    ? "1px solid rgba(60,30,10,0.4)"
                    : "1px solid rgba(255,255,255,0.06)",
                  opacity: isEliminated ? 0.5 : 1,
                }}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {player.player_avatar ? (
                      <img
                        src={player.player_avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                        style={{
                          border: isMe ? "2px solid #f59e0b" : isEliminated ? "2px solid #3a1a0a" : "2px solid #2a1a08",
                          filter: isEliminated ? "grayscale(80%)" : "none",
                        }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ background: isEliminated ? "#1a0a05" : "#2a1a08", border: isMe ? "2px solid #f59e0b" : "2px solid #3a2008" }}
                      >
                        {isEliminated ? "💀" : "👤"}
                      </div>
                    )}
                    {/* Room number badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold"
                      style={{ background: "#0a0803", border: "1px solid #3a2008", color: "#d97706", fontSize: "9px" }}
                    >
                      {player.room_number}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate" style={{ color: isEliminated ? "#4a3020" : isMe ? "#f59e0b" : "#e5e7eb" }}>
                        {player.player_nickname}
                      </span>
                      {isMe && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b55" }}>ты</span>}
                      {isEliminated && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#3a1a0a", color: "#6b3a20" }}>выбыл</span>}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#4a3520" }}>Комната {player.room_number}</div>
                  </div>

                  {/* Votes counter */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {player.votes > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">голосов</span>
                        <span className="text-sm font-bold text-red-400">{player.votes}</span>
                      </div>
                    )}
                    {!isHost && !isEliminated && (
                      <div className="flex items-center gap-1">
                        <CoinIcon size={12} />
                        <span className="text-xs" style={{ color: player.coins < 5 ? "#ef4444" : "#a16207" }}>{player.coins}</span>
                      </div>
                    )}
                  </div>

                  {/* Vote button on hover */}
                  <AnimatePresence>
                    {canVote && hoveredPlayer === player.room_number && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        onClick={() => setVoteTarget(player)}
                        className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: "linear-gradient(to right, #b45309, #d97706)",
                          color: "#000",
                          boxShadow: "0 0 12px rgba(217,119,6,0.5)",
                        }}
                      >
                        Проголосовать
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Voted-for indicator */}
                {!isHost && myPlayer?.voted_for === player.room_number && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)" }}>
                      ✓ твой голос
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {players.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 text-sm">Игроки ещё не заселились</p>
          </div>
        )}

        {/* Leaderboard — votes summary */}
        {alivePlayers.some(p => p.votes > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl"
            style={{ background: "#0f0a05", border: "1px solid #2a1a08" }}
          >
            <h3 className="text-sm font-bold text-amber-600 mb-3" style={{ fontFamily: "serif" }}>
              📊 Счёт голосов
            </h3>
            <div className="space-y-2">
              {[...alivePlayers]
                .filter(p => p.votes > 0)
                .sort((a, b) => b.votes - a.votes)
                .map(p => (
                  <div key={p.room_number} className="flex items-center gap-2">
                    {p.player_avatar ? (
                      <img src={p.player_avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" style={{ border: "1px solid #3a2008" }} />
                    ) : (
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#1a0f05", border: "1px solid #3a2008", fontSize: 10 }}>👤</div>
                    )}
                    <span className="text-sm text-gray-300 flex-1 truncate">{p.player_nickname}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: p.votes }).map((_, i) => (
                        <div key={i} className="w-2 h-4 rounded-sm" style={{ background: "#ef4444" }} />
                      ))}
                      <span className="text-xs text-red-400 ml-1 font-bold">{p.votes}</span>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Vote modal */}
      <AnimatePresence>
        {voteTarget && (
          <VoteModal
            target={voteTarget}
            myCoins={myCoins}
            onVote={handleVote}
            onClose={() => setVoteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
