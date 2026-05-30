"use client";

import { useState, useEffect } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({
  transactions: initialTransactions,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleEdit = (id: string) => {
    // Placeholder para funcionalidade de edição
    alert(`Editar transação: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Categoria
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Valor
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="transition-colors hover:bg-accent/30"
            >
              <td className="px-4 py-3 text-muted-foreground">
                {formatDisplayDate(transaction.date)}
              </td>
              <td className="px-4 py-3 text-foreground">
                {transaction.description}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                  {transaction.category}
                </span>
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  transaction.type === "income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Math.abs(transaction.amount))}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleEdit(transaction.id)}
                    title="Editar"
                    aria-label="Editar"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    title="Excluir"
                    aria-label="Excluir"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
