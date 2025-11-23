"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Article, ArticleResponse } from "@/app/articles/types";

interface SearchDialogProps {
  trigger: ReactNode;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function mergeUniqueById(existing: Article[], incoming: Article[]) {
  const map = new Map<string | number, Article>();
  existing.forEach((item) => map.set(item.id, item));
  incoming.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

export function SearchDialog({ trigger }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [nextCursor, setNextCursor] = useState<ArticleResponse["nextCursor"]>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasMore =
    Boolean(submittedQuery) &&
    nextCursor !== null &&
    nextCursor !== undefined;

  const handleSearch = async (
    searchTerm: string,
    cursorId?: ArticleResponse["nextCursor"],
    append = false
  ) => {
    if (!apiUrl) {
      setError("API URL не настроен.");
      return;
    }

    const params = new URLSearchParams({
      limit: "10",
      sortBy: "createdAt",
      order: "desc",
      search: searchTerm,
    });

    if (cursorId) {
      params.set("cursorId", String(cursorId));
    }

    try {
      append ? setIsMoreLoading(true) : setIsLoading(true);
      setError(null);

      const res = await fetch(`${apiUrl}/articles?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data: ArticleResponse = await res.json();

      setResults((prev) =>
        append ? mergeUniqueById(prev, data.items ?? []) : data.items ?? []
      );
      setNextCursor(data.nextCursor ?? null);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Не удалось выполнить поиск. Попробуйте снова.");
      if (!append) {
        setResults([]);
        setNextCursor(null);
      }
    } finally {
      append ? setIsMoreLoading(false) : setIsLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const triggerSearch = (term: string) => {
    if (!term) return;
    setSubmittedQuery(term);
    handleSearch(term);
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setSubmittedQuery("");
      setResults([]);
      setNextCursor(null);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      triggerSearch(trimmed);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && submittedQuery && !isLoading && !isMoreLoading) {
      handleSearch(submittedQuery, nextCursor, true);
    }
  }, [hasMore, submittedQuery, isLoading, isMoreLoading, nextCursor]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!hasMore || isLoading || isMoreLoading) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
        handleLoadMore();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, isLoading, isMoreLoading, submittedQuery, nextCursor, handleLoadMore]);

  const resultInfo = useMemo(() => {
    if (query.trim().length < 3) return "Введите минимум 3 символа.";
    if (!submittedQuery) return null;
    if (isLoading) return "Ищем...";
    if (results.length === 0) return "Ничего не найдено.";
    return null;
  }, [isLoading, submittedQuery, results.length, query]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Поиск по статьям</DialogTitle>
          <DialogDescription>
            Поиск стартует автоматически после 3 символов. Результаты можно
            догружать скроллом вниз.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="search-input">Запрос</Label>
            <Input
              id="search-input"
              placeholder="например: адаптивность"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Минимум 3 символа, поиск без кнопки.
            </p>
          </div>
        </form>

        <div className="grid gap-3">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {resultInfo && <p className="text-sm text-gray-500">{resultInfo}</p>}

          <div
            ref={listRef}
            className="space-y-2 max-h-80 overflow-auto pr-1"
          >
            {results.map((article) => (
              <div
                key={article.id}
                className="rounded-md border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {article.title}
                </div>
                {article.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          {isMoreLoading && (
            <p className="text-sm text-center text-gray-500">Загрузка...</p>
          )}
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
