import type { Metadata } from "next";
import { Mail, MapPin, Github, Send, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Резюме",
  description: "Frontend-разработчик — Дмитрий Межинский",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
      {children}
    </h2>
  );
}

function TimelineItem({
  period,
  title,
  subtitle,
  children,
  current,
}: {
  period: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  current?: boolean;
}) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gray-200 dark:bg-gray-700 last:hidden" />
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-[3px] ${
          current
            ? "bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      />
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {period}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-400 mb-2">{subtitle}</div>
      {children && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {children}
        </div>
      )}
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
      {children}
    </span>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </a>
  );
}

function ProjectCard({
  title,
  description,
  href,
  tags,
}: {
  title: string;
  description: string;
  href?: string;
  tags: string[];
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      className={`block p-4 rounded-xl border border-gray-100 dark:border-gray-800 ${
        href
          ? "hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {href && (
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}

export default function Resume1Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 flex items-center justify-center text-white text-3xl font-bold">
            ДМ
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Дмитрий Межинский
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Frontend Developer
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            Создаю современные веб-приложения с фокусом на производительность и
            пользовательский опыт. 5+ лет опыта в разработке на React и
            TypeScript.
          </p>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <ContactLink href="mailto:hello@mezhinsky.me" icon={Mail}>
              hello@mezhinsky.me
            </ContactLink>
            <ContactLink href="https://t.me/mezhinsky" icon={Send}>
              @mezhinsky
            </ContactLink>
            <ContactLink href="https://github.com/mezhinsky" icon={Github}>
              mezhinsky
            </ContactLink>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Москва</span>
            </div>
          </div>
        </header>

        {/* Experience */}
        <section className="mb-16">
          <SectionTitle>Опыт работы</SectionTitle>
          <div>
            <TimelineItem
              period="2022 — настоящее время"
              title="Senior Frontend Developer"
              subtitle="Company Name"
              current
            >
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Разработка и поддержка React-приложений</li>
                <li>Внедрение TypeScript и улучшение Developer Experience</li>
                <li>Код-ревью и менторинг младших разработчиков</li>
                <li>Оптимизация производительности и Core Web Vitals</li>
              </ul>
            </TimelineItem>

            <TimelineItem
              period="2020 — 2022"
              title="Frontend Developer"
              subtitle="Another Company"
            >
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Разработка SPA на React + Redux</li>
                <li>Интеграция с REST API и GraphQL</li>
                <li>Написание unit и e2e тестов</li>
              </ul>
            </TimelineItem>

            <TimelineItem
              period="2018 — 2020"
              title="Junior Developer"
              subtitle="Startup Inc"
            >
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Вёрстка и JavaScript</li>
                <li>Работа с jQuery, Bootstrap</li>
                <li>Первый опыт с React</li>
              </ul>
            </TimelineItem>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <SectionTitle>Навыки</SectionTitle>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                <SkillTag>React</SkillTag>
                <SkillTag>TypeScript</SkillTag>
                <SkillTag>Next.js</SkillTag>
                <SkillTag>TailwindCSS</SkillTag>
                <SkillTag>Redux</SkillTag>
                <SkillTag>React Query</SkillTag>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backend & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                <SkillTag>Node.js</SkillTag>
                <SkillTag>PostgreSQL</SkillTag>
                <SkillTag>Docker</SkillTag>
                <SkillTag>Git</SkillTag>
                <SkillTag>REST API</SkillTag>
                <SkillTag>GraphQL</SkillTag>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <SectionTitle>Проекты</SectionTitle>
          <div className="grid gap-4">
            <ProjectCard
              title="mezhinsky.me"
              description="Личный блог и портфолио на Next.js с админкой на React"
              href="/"
              tags={["Next.js", "React", "TailwindCSS", "NestJS", "Prisma"]}
            />
            <ProjectCard
              title="Project Name"
              description="Описание проекта и его основные особенности"
              tags={["React", "TypeScript", "Node.js"]}
            />
            <ProjectCard
              title="Another Project"
              description="Ещё один интересный проект с подробным описанием"
              href="#"
              tags={["Next.js", "PostgreSQL", "Docker"]}
            />
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <SectionTitle>Образование</SectionTitle>
          <TimelineItem
            period="2014 — 2018"
            title="Бакалавр"
            subtitle="Название университета"
          >
            Информатика и вычислительная техника
          </TimelineItem>
        </section>

        {/* Languages */}
        <section>
          <SectionTitle>Языки</SectionTitle>
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-gray-900 dark:text-white font-medium">
                Русский
              </span>
              <span className="text-gray-500 ml-2">— родной</span>
            </div>
            <div>
              <span className="text-gray-900 dark:text-white font-medium">
                English
              </span>
              <span className="text-gray-500 ml-2">— B2 Upper-Intermediate</span>
            </div>
          </div>
        </section>

        {/* Print hint */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
          Нажмите{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            Ctrl+P
          </kbd>{" "}
          для печати или сохранения в PDF
        </div>
      </div>
    </div>
  );
}
