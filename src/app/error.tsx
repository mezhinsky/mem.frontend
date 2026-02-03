"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-10">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="flex min-h-[calc(100svh-var(--header-height)-var(--footer-height))] flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-sm">500</p>
          <h1 className="title mt-2 text-center">Что-то пошло не так</h1>
          <p className="text-muted-foreground mt-4 max-w-md">
            Произошла ошибка на сервере. Попробуйте обновить страницу или
            вернуться позже.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={reset}>Повторить запрос</Button>
            <Button asChild variant="secondary">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
