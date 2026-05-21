import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Icons } from "@/components/icons"
import { useScrollPosition } from "@/hooks/use-scroll-position"

const navItems = [
  { name: "Главная", href: "#home" },
  { name: "Как играть", href: "#features" },
  { name: "Отзывы", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  const scrollPosition = useScrollPosition()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrollPosition > 10 ? "bg-background/80 backdrop-blur-lg border-b border-border/40" : "bg-transparent",
      )}
    >
      <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
        <a href="/" className="flex items-center space-x-2 z-10">
          <Icons.logo className="h-6 w-6" />
          <span className="font-heading text-xl tracking-tight">Мафия</span>
        </a>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector(item.href)?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
            >
              {item.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="neumorphic-button" onClick={() => navigate("/login")}>
              Войти
            </Button>
            <Button size="sm" className="neumorphic-button-primary" asChild>
              <a href="#register">
                Играть
                <motion.div
                  className="ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.8 }}
                >
                  {'>'}
                </motion.div>
              </a>
            </Button>
          </div>

          <button
            className="md:hidden flex items-center justify-center p-2 rounded-md bg-background/90 border border-border/40 shadow-sm"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="text-foreground h-5 w-5" /> : <List className="text-foreground h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl border-l border-border"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <a href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <Icons.logo className="h-6 w-6" />
                  <span className="font-heading text-lg">Мафия</span>
                </a>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="text-foreground h-5 w-5" />
                </button>
              </div>

              <div className="py-4 px-2">
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        document.querySelector(item.href)?.scrollIntoView({
                          behavior: "smooth",
                        })
                        closeMobileMenu()
                      }}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-auto p-4 border-t border-border">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full" onClick={() => { closeMobileMenu(); navigate("/login") }}>
                    Войти
                  </Button>
                  <Button className="w-full neumorphic-button-primary" asChild>
                    <a href="#register" onClick={closeMobileMenu}>
                      Играть
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}