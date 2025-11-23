"use client";

import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function VisuallyHidden({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 m-[-1px] clip-[rect(0,0,0,0)]",
        className
      )}
      {...props}
    />
  );
}
