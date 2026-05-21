import { useState } from "react"
import { motion } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientButton } from "@/components/ui-library/buttons/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

const roles = [
  {
    id: "boss",
    name: "Босс-мафия",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/8d2f6b99-d71d-442a-a7f9-cdd9f2945267.png",
  },
  {
    id: "mafia",
    name: "Мафия",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/0fffda4f-cc18-4f3e-a7b8-391da9c304cf.png",
  },
  {
    id: "sheriff",
    name: "Шериф",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/db860d75-72eb-4db7-a04c-1b14dd066ab9.png",
  },
  {
    id: "doctor",
    name: "Доктор",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/58ae62d8-bb6f-450f-8b55-1bab66610790.png",
  },
  {
    id: "citizen",
    name: "Мирный",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/2517821a-ff36-4c20-a54d-6f9ff283a272.png",
  },
  {
    id: "host",
    name: "Ведущий",
    image: "https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/5787001c-52d1-41a4-a5f4-2a31473077e9.png",
  },
]

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
        <AnimatedBackground variant="gradient" color="rgba(220, 38, 38, 0.08)" secondaryColor="rgba(75, 85, 99, 0.08)" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl px-4 py-10"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <a href="/" className="flex items-center gap-2 mb-2">
              <Icons.logo className="h-7 w-7" />
              <span className="font-heading text-2xl tracking-tight">Мафия</span>
            </a>
            <p className="text-muted-foreground text-sm opacity-70">Войди и садись за стол</p>
          </div>

          <div className="glassmorphic-card rounded-2xl border border-border/40 p-8 space-y-8">
            {/* Поля входа */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  placeholder="Введи никнейм"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="bg-muted/30 border-border/50 focus:border-red-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-border/50 focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Выбор роли */}
            <div className="space-y-4">
              <Label>Выбери роль</Label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "relative flex flex-col items-center rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none",
                      selectedRole === role.id
                        ? "border-red-500 shadow-[0_0_18px_rgba(220,38,38,0.5)]"
                        : "border-border/40 hover:border-red-500/50"
                    )}
                  >
                    <img
                      src={role.image}
                      alt={role.name}
                      className="w-full object-cover"
                    />
                    {selectedRole === role.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-red-500/10"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              {selectedRole && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 text-center"
                >
                  Выбрана роль: {roles.find((r) => r.id === selectedRole)?.name}
                </motion.p>
              )}
            </div>

            {/* Кнопка */}
            <GradientButton
              glowAmount={5}
              className="w-full py-3 text-base"
              gradientFrom="from-red-500"
              gradientTo="to-red-700"
              disabled={!login || !password || !selectedRole}
            >
              Войти в игру
            </GradientButton>

            <p className="text-center text-sm text-muted-foreground opacity-60">
              Нет аккаунта?{" "}
              <a href="#register" className="text-red-400 hover:text-red-300 transition-colors">
                Зарегистрироваться
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}
