"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Gift,
  User as UserIcon,
  Plus,
  Copy,
  CheckCircle2,
  Landmark,
} from "lucide-react";
import { formatDate } from "@/lib/constants";
import { toast } from "sonner";

export function AdminAffiliatesClient() {
  const supabase = createClient();

  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);

    const response = await fetch("/api/admin/affiliates/overview", {
      method: "GET",
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      toast.error(payload.error || "Failed to load affiliate data");
      setAffiliates([]);
      setUsers([]);
      setWithdrawals([]);
      setLoading(false);
      return;
    }

    setAffiliates(payload.affiliates || []);
    setUsers(payload.users || []);
    setWithdrawals(payload.withdrawals || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateAffiliateCode = async (userId: string, fullName: string) => {
    const response = await fetch("/api/admin/affiliates/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "generateCode",
        userId,
        fullName,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      toast.error(payload.error || "Failed to generate affiliate code");
      return;
    }

    toast.success(`Affiliate code ${payload.code} generated for ${fullName}`);
    fetchData();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  };

  const updateWithdrawalStatus = async (
    requestId: string,
    status: "processing" | "deposited" | "rejected",
  ) => {
    const response = await fetch("/api/admin/affiliates/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "updateWithdrawalStatus",
        requestId,
        status,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      toast.error(payload.error || "Failed to update withdrawal status");
      return;
    }

    toast.success(`Withdrawal marked as ${status}`);
    fetchData();
  };

  return (
    <div className="space-y-12">
      {/* AFFILIATES SECTION */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Active Affiliates
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your affiliate partners and their performance.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : affiliates.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30">
            <Gift className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
            <p className="font-bold text-muted-foreground">
              No active affiliates yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest pl-6">
                    Partner
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Code
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Referrals
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                      Qualified Purchases
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">
                      Amount Receivable
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Status
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((aff) => (
                  <TableRow
                    key={aff.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">
                            {aff.profiles?.full_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {aff.profiles?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-xs font-black text-primary">
                          {aff.ref_code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(aff.ref_code)}
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold">
                        {aff.total_users_brought_in}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-black text-foreground">
                        {(aff.qualified_purchases || 0).toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-black text-primary">
                        Rs. {Number(aff.amount_receivable || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </TableCell>
                    <TableCell>
                      {(!aff.expires_at || new Date(aff.expires_at) > new Date()) ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Expired</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 text-muted-foreground font-medium text-xs">
                      {formatDate(aff.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* WITHDRAWAL REQUESTS SECTION */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight">
            Affiliate Withdrawal Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            Process payout requests and mark them as deposited after payment.
          </p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30">
            <Landmark className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
            <p className="font-bold text-muted-foreground">
              No withdrawal requests yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest pl-6">
                    Affiliate
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Bank Details
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Status
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((requestItem) => {
                  const affiliate = requestItem.affiliate;
                  const affiliateProfile = affiliate?.profiles;

                  return (
                    <TableRow
                      key={requestItem.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <p className="font-bold text-foreground line-clamp-1">
                          {affiliateProfile?.full_name || "Unknown Affiliate"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Code: {affiliate?.ref_code || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-foreground text-sm">
                          {requestItem.bank_name} {requestItem.bank_branch ? `· ${requestItem.bank_branch}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {requestItem.bank_account_name} · {requestItem.bank_account_number}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-black text-primary">
                          Rs. {Number(requestItem.amount_lkr || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            requestItem.status === "deposited"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none"
                              : requestItem.status === "rejected"
                                ? "bg-destructive/10 text-destructive border-destructive/20 shadow-none"
                                : requestItem.status === "processing"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-none"
                                  : "bg-primary/10 text-primary border-primary/20 shadow-none"
                          }
                        >
                          {requestItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8"
                            onClick={() =>
                              updateWithdrawalStatus(requestItem.id, "processing")
                            }
                            disabled={requestItem.status === "deposited"}
                          >
                            Processing
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-xl h-8"
                            onClick={() =>
                              updateWithdrawalStatus(requestItem.id, "deposited")
                            }
                            disabled={requestItem.status === "deposited"}
                          >
                            Mark Done
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* POTENTIAL AFFILIATES SECTION */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight">
            Convert Users to Affiliates
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a user to generate an affiliate code for them.
          </p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search users by name..."
              className="h-12 rounded-2xl bg-muted/40 border-border/50 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {!loading && (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest pl-6">
                    User
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">
                    Contact
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((u) =>
                    u.full_name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .slice(0, 10) // Limit to 10 for performance
                  .map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <p className="font-bold text-foreground">
                          {user.full_name}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-sm">
                        {user.phone || "No phone number provided"}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          size="sm"
                          className="rounded-xl h-9 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-widest gap-2"
                          onClick={() =>
                            generateAffiliateCode(user.id, user.full_name)
                          }
                        >
                          <Plus size={14} /> Promote to Affiliate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground font-medium"
                    >
                      No potential affiliates found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
