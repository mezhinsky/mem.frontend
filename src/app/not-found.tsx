import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-10">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="flex min-h-[calc(100svh-var(--header-height)-var(--footer-height))] flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-8">
            <Image
              src="/goose/gooseConfused.png"
              alt="Растерянный гусь"
              width={100}
              height={100}
              className="drop-shadow-xl"
              priority
            />
          </div>
          <p className="text-muted-foreground text-7xl font-bold opacity-20">
            404
          </p>
          <h1 className="title mt-4 text-center">Страница не найдена</h1>
          <p className="text-muted-foreground mt-4 max-w-md">
            Даже наш гусь не может понять, куда делась эта страница. Возможно,
            она никогда не существовала или была перемещена.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/articles">Статьи</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
