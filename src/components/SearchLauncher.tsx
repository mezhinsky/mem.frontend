"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { SearchDialog } from "@/components/Search";

export function SearchLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const hotkey = isMac
        ? event.metaKey && event.key.toLowerCase() === "k"
        : event.ctrlKey && event.key.toLowerCase() === "k";

      if (hotkey) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <SearchDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 rounded-md bg-gray-100 transition hover:bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-500  outline-none focus:ring-gray-300 dark:bg-gray-100 dark:text-gray-900 dark:focus:ring-gray-700"
        >
          <span className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            Поиск статей
          </span>
          <Kbd className="md-1 bg-white/20 text-gray dark:bg-black/10 dark:text-gray-900">
            ⌘K
          </Kbd>
        </button>
      }
    />
  );
}
