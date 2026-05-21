import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/ui/animated-background"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Артём Волков",
      role: "Играет 2 года · 340 игр",
      content:
        "Лучшая онлайн-Мафия из всех, что я пробовал. Интерфейс понятный, роли сбалансированы, а голосовой чат делает игру живой. Засиживаемся с друзьями до утра!",
      avatar: "АВ",
    },
    {
      name: "Наташа Лебедева",
      role: "Играет 1 год · 180 игр",
      content:
        "Открыла для себя этот сайт случайно и теперь играю каждый вечер. Удобно, что можно зайти с телефона и сразу начать — никаких скачиваний.",
      avatar: "НЛ",
    },
    {
      name: "Максим Орлов",
      role: "Организатор турниров",
      content:
        "Провожу еженедельные турниры для своего клуба. Функции хоста — огонь: можно задать свои правила, назначить роли вручную и вести статистику.",
      avatar: "МО",
    },
  ]

  return (
    <section id="testimonials" className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <AnimatedBackground variant="waves" color="rgba(220, 38, 38, 0.05)" />

      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <AnimatedText
                text="Что говорят игроки"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl"
                animation="slide"
              />
              <AnimatedText
                text="Тысячи игр сыграно, сотни блефов раскрыто — вот истории наших игроков."
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full glassmorphic-card group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className="glassmorphic-avatar border-2 border-transparent group-hover:border-red-500 transition-colors">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-medium tracking-tight group-hover:text-red-500 transition-colors">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-muted-foreground opacity-70">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
