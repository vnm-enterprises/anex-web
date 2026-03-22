"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Search, Filter, CreditCard, ExternalLink } from "lucide-react";

interface Payment {
  id: string;
  lemonsqueezy_order_id: string;
  amount: number;
  status: string;
  payment_type: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
  listings: {
    title: string;
  } | null;
}

interface AdminPaymentsClientProps {
  initialPayments: any[];
}

export function AdminPaymentsClient({
  initialPayments,
}: AdminPaymentsClientProps) {
  const [payments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.lemonsqueezy_order_id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.profiles?.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.listings?.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesType =
      typeFilter === "all" || payment.payment_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order ID, user, or listing..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="rounded-xl">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ad_listing">Ad Listing</SelectItem>
            <SelectItem value="boost">Boost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none soft-shadow-xl rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-none">
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest">
                  Order ID
                </TableHead>
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest">
                  User & Listing
                </TableHead>
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest">
                  Amount
                </TableHead>
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest">
                  Type
                </TableHead>
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest">
                  Status
                </TableHead>
                <TableHead className="py-4 px-6 font-black uppercase text-[10px] tracking-widest text-right">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground font-medium"
                  >
                    No payments found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2 font-black text-foreground">
                        {payment.lemonsqueezy_order_id}
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {payment.profiles?.full_name || "Unknown User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">
                          {payment.listings?.title || "Deleted Listing"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="font-black text-primary">
                        Rs {(payment.amount / 100).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className="rounded-lg font-black uppercase text-[9px] bg-muted/50 border-none"
                      >
                        {payment.payment_type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge
                        className={`rounded-lg font-black uppercase text-[9px] border-none ${
                          payment.status === "paid"
                            ? "bg-accent/100/10 text-accent"
                            : payment.status === "pending"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <span className="text-xs font-bold text-muted-foreground">
                        {format(new Date(payment.created_at), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
