"use client";

import { useEffect, useRef } from "react";

type TelegramDiscussionProps = {
  /** username канала без @, например "rozetked" */
  channel: string;
  /** id поста в канале, например 43831 */
  post: number | string;

  /** ширина: "100%" или число */
  width?: string | number;

  /** светлая/тёмная тема (Telegram ждёт 0/1) */
  dark?: boolean;

  /**
   * Сколько комментариев показывать “сразу” (у TG параметр data-comments)
   * Если не указать — будет дефолт TG.
   */
  comments?: number;

  /**
   * Чтобы форсировать пересоздание виджета при смене post
   * (удобно для динамических страниц).
   */
  keyId?: string;
};

export function TelegramDiscussion({
  channel,
  post,
  width = "100%",
  dark = false,
  comments,
  keyId,
}: TelegramDiscussionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // очищаем контейнер при повторном рендере/смене props
    el.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";

    // виджет "discussion" в TG задаётся через data-telegram-discussion
    script.setAttribute("data-telegram-discussion", `${channel}/${post}`);

    // опции
    script.setAttribute(
      "data-width",
      typeof width === "number" ? String(width) : width
    );
    script.setAttribute("data-dark", dark ? "1" : "0");

    if (typeof comments === "number") {
      script.setAttribute("data-comments", String(comments));
    }

    el.appendChild(script);

    // cleanup на размонтирование
    return () => {
      el.innerHTML = "";
    };
  }, [channel, post, width, dark, comments, keyId]);

  return <div ref={containerRef} />;
}
