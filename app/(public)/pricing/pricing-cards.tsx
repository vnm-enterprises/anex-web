"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"
import type { Plan } from "@/lib/types"
import { formatPrice } from "@/lib/constants"

export function PricingCards({ plans }: { plans: Plan[] }) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const isPro = plan.slug === "pro"
        return (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              isPro
                ? "border-2 border-primary shadow-lg"
                : "border-border"
            }`}
          >
            {isPro && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                {plan.name}
              </CardTitle>
              <div className="mt-3">
                {plan.price_monthly === 0 ? (
                  <span className="text-3xl font-bold text-foreground">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(plan.price_monthly)}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-3">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {plan.listing_limit >= 999
                    ? "Unlimited listings"
                    : `${plan.listing_limit} listings per month`}
                </li>
                {plan.free_boosts > 0 && (
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {plan.free_boosts} free boosts
                  </li>
                )}
                {plan.featured_eligible && (
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    Featured listing eligibility
                  </li>
                )}
                {plan.analytics_access && (
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    Analytics dashboard
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Full marketplace access
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Inquiry notifications
                </li>
              </ul>
              <Button
                asChild
                className="mt-6 w-full"
                variant={isPro ? "default" : "outline"}
              >
                <Link href="/auth/sign-up">
                  {plan.price_monthly === 0 ? "Get Started Free" : "Choose Plan"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
