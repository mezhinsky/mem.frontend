import type { Metadata } from "next";
import { Mail, Send, Github, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Резюме",
  description: "Frontend Lead разработчик — Дмитрий Межинский",
};

function TerminalLine({
  command,
  children,
}: {
  command: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <span className="text-blue-600 dark:text-blue-400">~/mezhinsky</span>
        <span className="text-gray-400 dark:text-gray-500">$</span>
        <span className="text-gray-800 dark:text-gray-100">{command}</span>
      </div>
      {children && (
        <div className="mt-2 pl-0 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}

function SkillGroup({
  title,
  skills,
}: {
  title: string;
  skills: string[];
}) {
  return (
    <div className="mb-3">
      <span className="text-yellow-600 dark:text-yellow-400 text-xs">
        {title}:
      </span>
      <span className="ml-2 text-cyan-600 dark:text-cyan-400 text-sm">
        {skills.join(" • ")}
      </span>
    </div>
  );
}

function ExperienceItem({
  period,
  role,
  company,
  industry,
  description,
  stack,
}: {
  period: string;
  role: string;
  company: string;
  industry?: string;
  description: string;
  stack: string[];
}) {
  return (
    <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-3">
      <div className="text-yellow-600 dark:text-yellow-400 text-sm">
        {period}
      </div>
      <div className="text-green-600 dark:text-green-400 font-bold">{role}</div>
      <div className="text-blue-600 dark:text-blue-400">{company}</div>
      {industry && (
        <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          {industry}
        </div>
      )}
      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal window */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-gray-500 dark:text-gray-400 text-sm">
              mezhinsky@dev: ~/resume
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 text-sm leading-relaxed">
            {/* ASCII Art Header - Desktop */}
            <pre className="hidden sm:block text-green-600 dark:text-green-500 text-xs mb-8 overflow-x-auto">
{`
 ███╗   ███╗███████╗███████╗██╗  ██╗██╗███╗   ██╗███████╗██╗  ██╗██╗   ██╗
 ████╗ ████║██╔════╝╚══███╔╝██║  ██║██║████╗  ██║██╔════╝██║ ██╔╝╚██╗ ██╔╝
 ██╔████╔██║█████╗    ███╔╝ ███████║██║██╔██╗ ██║███████╗█████╔╝  ╚████╔╝
 ██║╚██╔╝██║██╔══╝   ███╔╝  ██╔══██║██║██║╚██╗██║╚════██║██╔═██╗   ╚██╔╝
 ██║ ╚═╝ ██║███████╗███████╗██║  ██║██║██║ ╚████║███████║██║  ██╗   ██║
 ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝
`}
            </pre>

            {/* Styled text header - Mobile */}
            <div className="sm:hidden mb-8">
              <div className="text-green-600 dark:text-green-500 text-2xl font-bold tracking-wider">
                <span className="text-gray-400 dark:text-gray-600">{">"}</span>{" "}
                MEZHINSKY
                <span className="inline-block w-2 h-5 ml-1 bg-green-600 dark:bg-green-500 animate-pulse align-middle" />
              </div>
              <div className="text-gray-500 dark:text-gray-600 text-xs mt-1">
                // frontend lead developer
              </div>
            </div>

            {/* whoami */}
            <TerminalLine command="whoami">
              <div className="text-xl text-gray-900 dark:text-white mb-2">
                Дмитрий Межинский
              </div>
              <div className="text-green-600 dark:text-green-400">
                Frontend Lead Developer
              </div>
              <div className="text-gray-500 text-sm mt-1">
                10+ лет опыта • Москва • Удалённо
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
                Проектирую архитектуру и руковожу разработкой сложных
                frontend-приложений. Специализируюсь на React, TypeScript и
                real-time системах. Опыт в нефтегазе, финтехе, ритейле и Web3.
              </p>
            </TerminalLine>

            {/* cat навыки.json */}
            <TerminalLine command="cat навыки.json">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-4">
                <div className="text-purple-600 dark:text-purple-400 mb-2">
                  {"{"}
                </div>
                <div className="pl-4">
                  <SkillGroup
                    title="core"
                    skills={["TypeScript", "React", "Next.js", "JavaScript"]}
                  />
                  <SkillGroup
                    title="styling"
                    skills={["TailwindCSS", "MUI", "styled-components", "shadcn/ui", "SCSS", "Ant Design"]}
                  />
                  <SkillGroup
                    title="state"
                    skills={["Redux Toolkit", "React Query", "Zustand"]}
                  />
                  <SkillGroup
                    title="backend"
                    skills={["NestJS", "Node.js", "Prisma", "REST API", "WebSocket", "GraphQL"]}
                  />
                  <SkillGroup
                    title="tools"
                    skills={["Git", "Docker", "CI/CD", "PostgreSQL", "Redis"]}
                  />
                  <SkillGroup
                    title="web3"
                    skills={["wagmi", "web3.js", "ethers.js", "DeFi"]}
                  />
                </div>
                <div className="text-purple-600 dark:text-purple-400 mt-2">
                  {"}"}
                </div>
              </div>
            </TerminalLine>

            {/* ls опыт/ */}
            <TerminalLine command="ls -la опыт/">
              <div className="space-y-6 mt-2">
                <ExperienceItem
                  period="Март 2022 — Январь 2026"
                  role="Lead Frontend Developer"
                  company="ROGII"
                  industry="Нефтегаз • Real-time мониторинг"
                  description="Платформа мониторинга бурения скважин в реальном времени. Спроектировал архитектуру real-time приложения для работы с высокочастотными потоками телеметрических данных. Руководил frontend-командой, внедрил WebSocket-интеграции, оптимизировал рендеринг больших объёмов данных и графиков."
                  stack={[
                    "React",
                    "TypeScript",
                    "WebSocket",
                    "Redux Toolkit",
                    "React Query",
                    "MUI",
                    "REST API",
                  ]}
                />

                <ExperienceItem
                  period="Март 2022 — Май 2024"
                  role="Tech Lead Developer"
                  company="UBDN"
                  industry="Финтех • DeFi • Криптовалюта"
                  description="Финтех-платформа для управления цифровыми активами: собственная криптовалюта, трастовые схемы, распределение активов. Спроектировал fullstack-архитектуру, реализовал систему ролевого доступа к активам, интерфейсы управления в стиле банковских приложений."
                  stack={[
                    "React",
                    "NestJS",
                    "Prisma",
                    "PostgreSQL",
                    "MUI",
                    "Web3",
                    "wagmi",
                  ]}
                />

                <ExperienceItem
                  period="Февраль 2019 — Март 2022"
                  role="Lead Frontend Developer"
                  company="Норильский никель"
                  industry="Enterprise • Закупки и логистика"
                  description="Корпоративная система автоматизации закупок, согласований и логистики. Спроектировал архитектуру для сложной доменной области, руководил командой, оптимизировал работу с большими таблицами и формами, внедрил стандарты разработки."
                  stack={[
                    "React",
                    "TypeScript",
                    "Redux Toolkit",
                    "React Query",
                    "MUI",
                    "REST API",
                  ]}
                />

                <ExperienceItem
                  period="Апрель 2015 — Январь 2019"
                  role="Lead Frontend Developer"
                  company="М.Видео-Эльдорадо"
                  industry="Ритейл • Корпоративный портал"
                  description="EM.Life — внутренний портал для сотрудников группы компаний. Спроектировал модульную архитектуру, организовал работу команды, внедрил единые стандарты разработки, оптимизировал производительность при высокой нагрузке."
                  stack={[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Redux Toolkit",
                    "MUI",
                    "CSS-in-JS",
                  ]}
                />
              </div>
            </TerminalLine>

            {/* cat образование.txt */}
            <TerminalLine command="cat образование.txt">
              <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-2">
                <div className="text-yellow-600 dark:text-yellow-400 text-sm">
                  2012
                </div>
                <div className="text-green-600 dark:text-green-400 font-bold">
                  Высшее образование
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  МЭСИ (Московский государственный университет экономики,
                  статистики и информатики)
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Прикладная информатика в экономике
                </div>
              </div>
            </TerminalLine>

            {/* cat языки.txt */}
            <TerminalLine command="cat языки.txt">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    Русский
                  </span>
                  <span className="text-gray-500 ml-2">— родной</span>
                </div>
                <div>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    English
                  </span>
                  <span className="text-gray-500 ml-2">— C1 Advanced</span>
                </div>
              </div>
            </TerminalLine>

            {/* cat контакты.txt */}
            <TerminalLine command="cat контакты.txt">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <a
                  href="tel:+79967839810"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>+7 (996) 783-98-10</span>
                </a>
                <a
                  href="mailto:mezhinsky.dmitry@gmail.com"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>mezhinsky.dmitry@gmail.com</span>
                </a>
                <a
                  href="https://t.me/mezhinsky"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>@mezhinsky</span>
                </a>
                <a
                  href="https://github.com/mezhinsky"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>github.com/mezhinsky</span>
                </a>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Москва • Удалённо</span>
                </div>
              </div>
            </TerminalLine>

            {/* Blinking cursor */}
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-4">
              <span className="text-blue-600 dark:text-blue-400">
                ~/mezhinsky
              </span>
              <span className="text-gray-400 dark:text-gray-500">$</span>
              <span className="w-2 h-5 bg-gray-600 dark:bg-gray-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-gray-500 dark:text-gray-600 text-sm mt-6">
          Нажми{" "}
          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400 text-xs">
            Ctrl+P
          </kbd>{" "}
          чтобы распечатать или сохранить в PDF
        </p>
      </div>
    </div>
  );
}
