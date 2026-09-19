import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface BillingInvoice {
  id: string
  date: string
  plan?: string
  amount: string
  status: string
}

export function BillingHistoryCard({ history }: { history: BillingInvoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>Your recent invoices and payments.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No billing history yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">
                    {invoice.plan ? `${invoice.plan} — ` : ""}{invoice.date}
                  </p>
                  <p className="text-xs text-muted-foreground">{invoice.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{invoice.amount}</span>
                  <Badge variant={invoice.status.toLowerCase() === "paid" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
