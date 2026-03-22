import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  ArrowLeft,
  Calendar,
  Phone,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/constants"

export default async function AllInquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch all inquiries for listings owned by the user
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select(`
      *,
      listings!inner (
        id,
        title,
        user_id
      )
    `)
    .eq("listings.user_id", user.id)
    .order("created_at", { ascending: false })

  async function markAsRead(formData: FormData) {
    "use server"
    const inquiryId = formData.get("inquiry_id") as string
    const supabase = await createClient()
    await supabase.from("inquiries").update({ is_read: true }).eq("id", inquiryId)
    revalidatePath("/dashboard/all-inquiries")
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
        >
          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black tracking-tighter">Communication Center</h1>
        <p className="text-muted-foreground font-medium">View and manage all inquiries received for your listings.</p>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <Card className="rounded-[3rem] border-dashed p-20 text-center bg-muted/20">
          <div className="h-24 w-24 rounded-[2.5rem] bg-muted flex items-center justify-center mx-auto text-muted-foreground/30 mb-8">
            <MessageCircle size={48} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">No inquiries yet</h2>
          <p className="max-w-md mx-auto text-muted-foreground font-medium">
            When potential tenants message you about your listings, they will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inq: any) => (
            <Card
              key={inq.id}
              className={`rounded-[2rem] overflow-hidden border-none soft-shadow transition-all duration-300 ${
                inq.is_read ? 'opacity-70 grayscale-[30%]' : 'bg-primary/5 ring-1 ring-primary/20'
              }`}
            >
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                       <Badge variant="outline" className="rounded-lg font-black uppercase tracking-widest text-[9px] px-2 py-1 bg-white/50 border-border/50">
                         {inq.listings?.title}
                       </Badge>
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(inq.created_at)}
                       </span>
                    </div>

                    <p className={`text-lg leading-relaxed ${inq.is_read ? 'text-muted-foreground font-medium' : 'text-foreground font-bold'}`}>
                      &quot;{inq.message}&quot;
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                       <div className="flex items-center gap-2 font-bold text-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          {inq.sender_phone}
                       </div>
                       <Link
                         href={`/dashboard/listings/${inq.listings?.id}`}
                         className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                       >
                         View Listing
                         <ExternalLink className="h-3 w-3" />
                       </Link>
                    </div>
                  </div>

                  <form action={markAsRead} className="shrink-0">
                    <input type="hidden" name="inquiry_id" value={inq.id} />
                    <Button
                      type="submit"
                      disabled={inq.is_read}
                      variant={inq.is_read ? "ghost" : "default"}
                      className={`h-14 px-8 rounded-2xl font-black shadow-lg transition-all ${
                        inq.is_read
                          ? 'text-accent bg-accent/10 hover:bg-accent/10 cursor-default'
                          : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                      }`}
                    >
                      {inq.is_read ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Read
                        </>
                      ) : (
                        "Mark as Read"
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
