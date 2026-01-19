Реализация тематических тем для тегов

Созданные файлы:

1. src/config/tag-themes.ts - конфигурация тем


    - Маппинг slug → тема (typescript, react, devops, ai и др.)
    - Хелперы: getTagTheme(), getTagThemeName(), hasTagTheme()

2. src/components/theme/tag-theme-setter.tsx - клиентский компонент


    - Устанавливает класс theme-{name} на body
    - Автоматически сбрасывает тему при уходе со страницы

3. Обновлён src/app/globals.css - добавлены CSS темы:


    - theme-typescript (синий)
    - theme-javascript (жёлтый)
    - theme-react (циан)
    - theme-nextjs (нейтральный)
    - theme-nodejs / theme-devops (зелёный)
    - theme-docker / theme-kubernetes (синий)
    - theme-ai (фиолетовый)
    - theme-design (розовый)
    - theme-security (оранжевый)
    - theme-database (бирюзовый)
    - Плюс dark mode варианты для каждой

4. Обновлён src/app/tags/[slug]/page.tsx


    - Добавлен <TagThemeSetter tagSlug={slug} />
    - Бейдж тега использует градиент для тематизированных тегов

Как добавить новую тему:

1. Добавь запись в src/config/tag-themes.ts:
   "my-tag": {
   name: "my-tag",
   label: "My Tag",
   hue: 120, // для справки
   },

2. Добавь CSS в globals.css:
   .theme-my-tag {
   --primary: oklch(0.6 0.2 120);
   --primary-foreground: oklch(0.98 0 0);
   --accent: oklch(0.95 0.05 120);
   /_ ... _/
   }

.dark .theme-my-tag {
/_ dark mode _/
}

Использование:

При переходе на /tags/typescript → body получит класс theme-typescript → все элементы использующие --primary, --accent и т.д. изменят цвет.
