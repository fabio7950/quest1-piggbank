"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal"

export function DashboardHeader() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Visão geral
        </p>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => setIsOpen(true)}>Nova transação</Button>
        <NewTransactionModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          showTrigger={false}
        />
      </div>
    </header>
  )
}
