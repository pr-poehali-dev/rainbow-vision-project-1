import { Icons } from "@/components/icons"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-lg">
      <div className="container flex flex-col gap-10 py-16">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <a href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-heading text-xl tracking-tight">Мафия</span>
            </a>
            <p className="text-muted-foreground max-w-sm opacity-70">
              Онлайн-игра в Мафию прямо в браузере. Собирай друзей, раздавай роли и выясняй — кто среди вас преступник.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.gitHub className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.discord className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight">Игра</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Как играть
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Тарифы
                  </a>
                </li>
                <li>
                  <a href="#play" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Играть онлайн
                  </a>
                </li>
                <li>
                  <a href="#roles" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Все роли
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight">Сообщество</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    О проекте
                  </a>
                </li>
                <li>
                  <a href="https://discord.com" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#tournaments" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Турниры
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight">Правовая информация</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="#privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Конфиденциальность
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Условия
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground opacity-70">
            &copy; {new Date().getFullYear()} Мафия Онлайн. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a href="#terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
              Условия
            </a>
            <a href="#privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground opacity-70">
              Конфиденциальность
            </a>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </footer>
  )
}
