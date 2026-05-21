import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientButton } from "@/components/ui-library/buttons/gradient-button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function HeroSection() {
  return (
    <section id="home" className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <AnimatedBackground variant="gradient" color="rgba(220, 38, 38, 0.08)" secondaryColor="rgba(75, 85, 99, 0.08)" />

      <div className="container px-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <ScrollReveal>
            <motion.div
              className="flex flex-col justify-center space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl xl:text-7xl/none">
                  <span className="gradient-text">Мафия онлайн</span>
                  <br />
                  <span className="text-foreground">играй, блефуй, побеждай</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 opacity-70">
                  Классическая психологическая игра в браузере. Собери компанию, выбери роли и выясни — кто из вас мафия?
                </p>
              </motion.div>

              <motion.div className="flex flex-col gap-6 sm:flex-row sm:items-center" variants={itemVariants}>
                <GradientButton
                  glowAmount={5}
                  className="px-6 py-2.5 text-base"
                  gradientFrom="from-red-500"
                  gradientTo="to-red-700"
                  asChild
                >
                  <a href="#play" className="flex items-center">
                    Начать игру
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </a>
                </GradientButton>

                <MagneticButton className="neumorphic-button">
                  <a href="#features" className="px-6 py-2.5 block">
                    Как играть
                  </a>
                </MagneticButton>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Сейчас онлайн: игроки ждут тебя за столом
                </p>
              </motion.div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center"
            >
              <img
                src="https://cdn.poehali.dev/projects/2e60d71c-d072-4223-b892-7e38f25a119a/bucket/99fa4246-9d10-486c-a69f-a41faf818e76.png"
                alt="Мафия Онлайн"
                className="w-full max-w-[560px] drop-shadow-[0_0_40px_rgba(220,38,38,0.4)]"
              />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}