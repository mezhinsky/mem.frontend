import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Резюме",
  description: "Frontend-разработчик — Дмитрий Межинский",
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

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 text-cyan-600 dark:text-cyan-400">{name}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={
              i < level
                ? "text-green-500 dark:text-green-400"
                : "text-gray-300 dark:text-gray-700"
            }
          >
            █
          </span>
        ))}
      </div>
      <span className="text-gray-500">{level * 10}%</span>
    </div>
  );
}

function ExperienceItem({
  period,
  role,
  company,
  description,
}: {
  period: string;
  role: string;
  company: string;
  description: string[];
}) {
  return (
    <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-2">
      <div className="text-yellow-600 dark:text-yellow-400 text-sm">
        {period}
      </div>
      <div className="text-green-600 dark:text-green-400 font-bold">{role}</div>
      <div className="text-blue-600 dark:text-blue-400">{company}</div>
      <ul className="mt-2 text-gray-600 dark:text-gray-400 text-sm list-none">
        {description.map((item, i) => (
          <li
            key={i}
            className="before:content-['→'] before:mr-2 before:text-gray-400 dark:before:text-gray-600"
          >
            {item}
          </li>
        ))}
      </ul>
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
                // frontend developer
              </div>
            </div>

            {/* whoami */}
            <TerminalLine command="whoami">
              <div className="text-xl text-gray-900 dark:text-white mb-2">
                Дмитрий Межинский
              </div>
              <div className="text-green-600 dark:text-green-400">
                Frontend Developer
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
                Создаю современные веб-приложения с фокусом на производительность
                и пользовательский опыт. Люблю чистый код, TypeScript и
                экспериментировать с новыми технологиями.
              </p>
            </TerminalLine>

            {/* cat skills.json */}
            <TerminalLine command="cat skills.json">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-4 space-y-2">
                <div className="text-purple-600 dark:text-purple-400 mb-3">
                  {"{"}
                </div>
                <div className="pl-4 space-y-1">
                  <SkillBar name="React" level={9} />
                  <SkillBar name="TypeScript" level={9} />
                  <SkillBar name="Next.js" level={8} />
                  <SkillBar name="TailwindCSS" level={9} />
                  <SkillBar name="Node.js" level={7} />
                  <SkillBar name="PostgreSQL" level={6} />
                  <SkillBar name="Docker" level={6} />
                  <SkillBar name="Git" level={8} />
                </div>
                <div className="text-purple-600 dark:text-purple-400 mt-3">
                  {"}"}
                </div>
              </div>
            </TerminalLine>

            {/* ls experience/ */}
            <TerminalLine command="ls -la experience/">
              <div className="space-y-4 mt-2">
                <ExperienceItem
                  period="2022 — настоящее время"
                  role="Senior Frontend Developer"
                  company="Company Name"
                  description={[
                    "Разработка и поддержка React-приложений",
                    "Внедрение TypeScript и улучшение DX",
                    "Код-ревью и менторинг джунов",
                  ]}
                />
                <ExperienceItem
                  period="2020 — 2022"
                  role="Frontend Developer"
                  company="Another Company"
                  description={[
                    "Разработка SPA на React + Redux",
                    "Интеграция с REST API",
                    "Оптимизация производительности",
                  ]}
                />
                <ExperienceItem
                  period="2018 — 2020"
                  role="Junior Developer"
                  company="Startup Inc"
                  description={[
                    "Вёрстка и JavaScript",
                    "Работа с jQuery, Bootstrap",
                    "Первый опыт с React",
                  ]}
                />
              </div>
            </TerminalLine>

            {/* cat projects.md */}
            <TerminalLine command="cat projects.md">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-500 dark:text-yellow-400">★</span>
                  <div>
                    <a
                      href="/"
                      className="text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      mezhinsky.me
                    </a>
                    <span className="text-gray-500 ml-2">
                      — личный блог на Next.js
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-500 dark:text-yellow-400">★</span>
                  <div>
                    <span className="text-cyan-600 dark:text-cyan-400">
                      project-name
                    </span>
                    <span className="text-gray-500 ml-2">— описание проекта</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-500 dark:text-yellow-400">★</span>
                  <div>
                    <span className="text-cyan-600 dark:text-cyan-400">
                      another-project
                    </span>
                    <span className="text-gray-500 ml-2">
                      — ещё один крутой проект
                    </span>
                  </div>
                </div>
              </div>
            </TerminalLine>

            {/* cat contact.txt */}
            <TerminalLine command="cat contact.txt">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">email:</span>{" "}
                  <a
                    href="mailto:hello@mezhinsky.me"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    hello@mezhinsky.me
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">telegram:</span>{" "}
                  <a
                    href="https://t.me/mezhinsky"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    @mezhinsky
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">github:</span>{" "}
                  <a
                    href="https://github.com/mezhinsky"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    github.com/mezhinsky
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">location:</span>{" "}
                  <span className="text-gray-700 dark:text-gray-300">
                    Москва, Россия
                  </span>
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
            Ctrl+C
          </kbd>{" "}
          чтобы выйти... или просто закрой вкладку
        </p>
      </div>
    </div>
  );
}
