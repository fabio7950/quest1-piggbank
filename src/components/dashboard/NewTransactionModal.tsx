"use client"

import * as React from "react"

import { formatDisplayDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogPopup,
  DialogBackdrop,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from "@/components/ui/select"
import { ToggleGroup, Toggle } from "@/components/ui/toggle"

const categories = [
  { label: "Alimentação", value: "alimentacao" },
  { label: "Salário", value: "salario" },
  { label: "Lazer", value: "lazer" },
]

type TransactionType = "income" | "expense"

type NewTransactionModalProps = {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  onCreate?: (transaction: {
    type: TransactionType
    amount: number
    date: Date
    category: string
  }) => void
}

export function NewTransactionModal({
  isOpen: controlledIsOpen,
  onOpenChange,
  showTrigger = true,
  onCreate,
}: NewTransactionModalProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false)
  const [transactionType, setTransactionType] = React.useState<TransactionType>("income")
  const [amount, setAmount] = React.useState("")
  const [amountError, setAmountError] = React.useState<string | null>(null)
  const [category, setCategory] = React.useState(categories[0].value)
  const [date, setDate] = React.useState<Date>(new Date())
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  const isOpen = controlledIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const isAmountValid = React.useMemo(() => {
    const value = Number(amount)
    return amount.trim().length > 0 && !Number.isNaN(value) && value > 0
  }, [amount])

  const handleReset = () => {
    setTransactionType("income")
    setAmount("")
    setAmountError(null)
    setCategory(categories[0].value)
    setDate(new Date())
    setDatePickerOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAmountValid) {
      setAmountError("O valor precisa ser maior que zero")
      return
    }

    setAmountError(null)

    onCreate?.({
      type: transactionType,
      amount: Number(amount),
      date,
      category,
    })

    setIsOpen(false)
    handleReset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button>Nova transação</Button>
        </DialogTrigger>
      ) : null}

      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <DialogTitle>Nova transação</DialogTitle>
              <DialogDescription>
                Preencha os dados da transação para adicioná-la ao seu histórico.
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Tipo</span>
                <ToggleGroup<"income" | "expense"> 
                  value={[transactionType]}
                  onValueChange={(values) => {
                    const next = values[0]
                    if (next === "income" || next === "expense") {
                      setTransactionType(next)
                    }
                  }}
                  orientation="horizontal"
                >
                  <Toggle value="income">Entrada</Toggle>
                  <Toggle value="expense">Saída</Toggle>
                </ToggleGroup>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="transaction-value">
                  Valor
                </label>
                <Input
                  id="transaction-value"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onValueChange={(value) => setAmount(String(value ?? ""))}
                />
                {amountError ? (
                  <span className="text-sm text-destructive">{amountError}</span>
                ) : null}
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium">Data</span>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger className="inline-flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm">
                    {formatDisplayDate(date)}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => {
                        if (selected) {
                          setDate(selected)
                          setDatePickerOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium">Categoria</span>
                <SelectRoot<string>
                  value={category}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setCategory(value)
                    }
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                    <SelectIcon />
                  </SelectTrigger>

                  <SelectPortal>
                    <SelectPositioner align="start" side="bottom" sideOffset={6}>
                      <SelectPopup>
                        <SelectList>
                          {categories.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <SelectItemText>{option.label}</SelectItemText>
                              <SelectItemIndicator>✓</SelectItemIndicator>
                            </SelectItem>
                          ))}
                        </SelectList>
                      </SelectPopup>
                    </SelectPositioner>
                  </SelectPortal>
                </SelectRoot>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!isAmountValid}>
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
