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
  Loader2,
  Trash2,
  Eye,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/constants"
import { toast } from "sonner"
import Link from "next/link"

export function AdminListingsClient() {
  const supabase = createClient()

  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchListings = async () => {
    setLoading(true)

    let query = supabase
      .from("listings")
      .select(`
        *,
        districts(name),
        cities(name),
        profiles!listings_user_id_fkey(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [statusFilter])

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("listings")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Status changed to ${newStatus}`)
      fetchListings()
    }
  }

  const deleteListing = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this listing?")
    if (!confirmed) return

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error(error.message)
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
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
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
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed">
          <p className="font-medium">No listings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">
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

                  <TableCell className="font-medium">
                    {formatPrice(listing.price)}
                  </TableCell>

                  <TableCell>
                    {statusBadge(listing.status)}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(listing.created_at)}
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">

                    {/* VIEW */}
                    <Link href={`/listings/${listing.slug}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* STATUS DROPDOWN */}
                    <Select
                      value={listing.status}
                      onValueChange={(value) =>
                        updateStatus(listing.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

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
