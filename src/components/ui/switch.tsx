"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-all duration-300 outline-none",
        "data-[state=unchecked]:bg-[hsl(var(--switch-background))] data-[state=unchecked]:border-border",
        "data-[state=checked]:bg-[hsl(var(--switch-background-checked))] data-[state=checked]:border-[hsl(var(--switch-background-checked))]",
        "data-[state=checked]:shadow-[0_0_16px_hsla(195,100%,70%,0.5)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full transition-all duration-300",
          "data-[state=unchecked]:bg-[hsl(var(--switch-thumb))] data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:bg-[hsl(var(--switch-thumb-checked))] data-[state=checked]:translate-x-[18px]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
