import { useQuery } from "@tanstack/react-query";
import { expensesApi } from "@/api/expenses";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExpenseRecord } from "./schemas";

export function ExpensesTable() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.getAll,
  });

  if (isLoading) {
    return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-20 w-full" /></div>;
  }

  const expenses: ExpenseRecord[] = response?.data || [];

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground">No expenses found</h3>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">{new Date(expense.incurredAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {expense.vehicle.registrationNumber} - {expense.vehicle.nameModel}
              </td>
              <td className="px-4 py-3">{expense.category}</td>
              <td className="px-4 py-3">${Number(expense.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
