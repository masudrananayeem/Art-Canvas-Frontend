import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface CurrentPlan {
  id: string
  name: string
  description?: string
  price: string
  frequency?: string
  status?: string
  renewsOn?: string
  paymentMethod?: string
}

export function CurrentPlanCard({ plan }: { plan: CurrentPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your active subscription details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{plan.name}</p>
            {plan.description ? (
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            ) : null}
          </div>
          {plan.status ? <Badge>{plan.status}</Badge> : null}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{plan.price}</span>
          {plan.frequency ? (
            <span className="text-sm text-muted-foreground">{plan.frequency}</span>
          ) : null}
        </div>
        <dl className="space-y-2 text-sm">
          {plan.renewsOn ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Renews on</dt>
              <dd className="font-medium">{plan.renewsOn}</dd>
            </div>
          ) : null}
          {plan.paymentMethod ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd className="font-medium">{plan.paymentMethod}</dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  )
}
