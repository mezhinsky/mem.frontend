"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { SearchDialog } from "@/components/Search";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
        <Button
          variant="outline"
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 rounded-md transition outline-none text-xs  font-semibold"
        >
          <span className="hidden lg:flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            Поиск
          </span>
          <Kbd className="">⌘K</Kbd>
        </Button>
      }
    />
  );
}
