"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  Sparkles,
  Zap,
  Trash2,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/constants"
import type { Listing } from "@/lib/types"
import { toast } from "sonner"

export function AdminListingsClient() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchListings = async () => {
    setLoading(true)
    let query = supabase
      .from("listings")
      .select("*, districts(name), cities(name), profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(50)

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data } = await query
    if (data) setListings(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update status")
    } else {
      toast.success(`Listing ${status}`)
      fetchListings()
    }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("listings")
      .update({
        is_featured: !current,
        featured_weight: !current ? 10 : 0,
        featured_expires_at: !current
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update featured status")
    } else {
      toast.success(!current ? "Listing featured" : "Featured removed")
      fetchListings()
    }
  }

  const toggleBoosted = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("listings")
      .update({
        is_boosted: !current,
        boost_weight: !current ? 5 : 0,
        boost_expires_at: !current
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update boost status")
    } else {
      toast.success(!current ? "Listing boosted" : "Boost removed")
      fetchListings()
    }
  }

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete listing")
    } else {
      toast.success("Listing deleted")
      fetchListings()
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-primary/10 text-primary border-0">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-accent/10 text-accent border-0">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-0">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="secondary">Expired</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Manage Listings
        </h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border">
          <p className="font-medium text-foreground">No listings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {listing.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {listing.cities?.name}, {listing.districts?.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {listing.profiles?.full_name || "Unknown"}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {formatPrice(listing.price)}
                  </TableCell>
                  <TableCell>{statusBadge(listing.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {listing.is_featured && (
                        <Sparkles className="h-4 w-4 text-accent" />
                      )}
                      {listing.is_boosted && (
                        <Zap className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(listing.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {listing.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-primary hover:text-primary"
                            onClick={() =>
                              updateStatus(listing.id, "approved")
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-destructive hover:text-destructive"
                            onClick={() =>
                              updateStatus(listing.id, "rejected")
                            }
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() =>
                          toggleFeatured(listing.id, listing.is_featured)
                        }
                        title={
                          listing.is_featured
                            ? "Remove featured"
                            : "Make featured"
                        }
                      >
                        <Sparkles
                          className={`h-4 w-4 ${
                            listing.is_featured
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="sr-only">Toggle featured</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() =>
                          toggleBoosted(listing.id, listing.is_boosted)
                        }
                        title={
                          listing.is_boosted ? "Remove boost" : "Boost"
                        }
                      >
                        <Zap
                          className={`h-4 w-4 ${
                            listing.is_boosted
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="sr-only">Toggle boost</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => deleteListing(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
