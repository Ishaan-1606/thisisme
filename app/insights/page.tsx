import type { Metadata } from "next"
import { isAuthenticated, isPasswordConfigured } from "@/lib/insights-auth"
import { InsightsLogin } from "@/components/insights/insights-login"
import { InsightsDashboard } from "@/components/insights/insights-dashboard"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Insights",
  // Keep the dashboard out of search results even though it is password gated.
  robots: { index: false, follow: false },
}

export default async function InsightsPage() {
  const authed = await isAuthenticated()

  if (!authed) {
    return <InsightsLogin configured={isPasswordConfigured()} />
  }

  return <InsightsDashboard />
}
