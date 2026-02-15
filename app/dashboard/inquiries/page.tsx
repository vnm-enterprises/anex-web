import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Mail, Clock } from "lucide-react"
import { formatDate } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inquiries",
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Get user's listing IDs
  const { data: userListings } = await supabase
    .from("listings")
    .select("id, title")
    .eq("user_id", user.id)

  if (!userListings || userListings.length === 0) {
    return (
      <div>
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
          Inquiries
        </h1>
        <Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No inquiries yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Post a listing to start receiving inquiries
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const listingIds = userListings.map((l) => l.id)
  const listingMap = new Map(userListings.map((l) => [l.id, l.title]))

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .in("listing_id", listingIds)
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        Inquiries
      </h1>

      {!inquiries || inquiries.length === 0 ? (
        <Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No inquiries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className={`border-border transition-all ${
                !inquiry.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {inquiry.sender_name}
                      </h3>
                      {!inquiry.is_read && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Re: {listingMap.get(inquiry.listing_id) || "Listing"}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      {inquiry.message}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <a
                        href={`tel:${inquiry.sender_phone}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {inquiry.sender_phone}
                      </a>
                      {inquiry.sender_email && (
                        <a
                          href={`mailto:${inquiry.sender_email}`}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {inquiry.sender_email}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(inquiry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
