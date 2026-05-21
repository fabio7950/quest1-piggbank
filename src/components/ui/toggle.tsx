"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"

import { cn } from "@/lib/utils"

function ToggleGroup<Value extends string>({ className, ...props }: ToggleGroupPrimitive.Props<Value>) {
  return (
    <ToggleGroupPrimitive
      className={cn(
        "inline-flex overflow-hidden rounded-2xl border border-input bg-background",
        className
      )}
      {...props}
    />
  )
}

function Toggle<Value extends string>({ className, ...props }: TogglePrimitive.Props<Value>) {
  return (
    <TogglePrimitive
      className={cn(
        "inline-flex min-h-[2.5rem] items-center justify-center rounded-none px-4 text-sm font-medium text-foreground transition hover:bg-muted data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, Toggle }
