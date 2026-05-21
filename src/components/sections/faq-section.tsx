import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/scroll-reveal"

export function FaqSection() {
  const faqs = [
    {
      question: "Как начать играть?",
      answer:
        "Зарегистрируйся, создай комнату или вступи в существующую. Как только наберётся нужное количество игроков, хост запускает игру — роли раздаются автоматически.",
    },
    {
      question: "Сколько игроков нужно для игры?",
      answer:
        "Минимум 4 игрока, оптимально — 8–12. Чем больше участников, тем интереснее и сложнее игра. Максимум зависит от тарифа.",
    },
    {
      question: "Какие роли есть в игре?",
      answer:
        "Базовый набор: Мафия, Мирный житель, Детектив, Доктор. В расширенном режиме доступны: Маньяк, Любовница, Адвокат, Снайпер и другие специальные роли.",
    },
    {
      question: "Можно ли играть с незнакомцами?",
      answer:
        "Да! Присоединяйся к публичным комнатам — там всегда есть активные игры. Или создай приватную комнату и пригласи друзей по ссылке.",
    },
    {
      question: "Нужно ли скачивать приложение?",
      answer:
        "Нет, игра работает прямо в браузере — на компьютере, планшете или телефоне. Просто открой сайт и начинай играть.",
    },
  ]

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">
                Частые вопросы
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70">
                Всё, что нужно знать перед первой игрой.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl py-12">
          <ScrollReveal>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glassmorphic-accordion-item">
                  <AccordionTrigger className="text-left font-medium tracking-tight">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground opacity-70">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
