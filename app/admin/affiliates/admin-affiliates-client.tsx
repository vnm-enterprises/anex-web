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
} from "lucide-react";
import { formatDate } from "@/lib/constants";
import { toast } from "sonner";

export function AdminAffiliatesClient() {
  const supabase = createClient();

  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);

    // Fetch existing affiliates with profile data
    const { data: affData } = await supabase
      .from("affiliates")
      .select("*, profiles(full_name, phone)")
      .order("created_at", { ascending: false });

    // Fetch users who are NOT affiliates yet to allow promoting them
    const affUserIds = affData?.map((a) => a.user_id) || [];

    let userQuery = supabase
      .from("profiles")
      .select("id, full_name, phone, affiliate_code")
      .order("full_name");

    if (affUserIds.length > 0) {
      userQuery = userQuery.not("id", "in", `(${affUserIds.join(",")})`);
    }

    const { data: userData } = await userQuery;

    setAffiliates(affData || []);
    setUsers(userData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateAffiliateCode = async (userId: string, fullName: string) => {
    // Generate a random code based on name or random string
    const code = (
      fullName.split(" ")[0].toUpperCase() +
      Math.floor(1000 + Math.random() * 9000)
    ).replace(/[^A-Z0-9]/g, "");

    const { error: affError } = await supabase.from("affiliates").insert({
      user_id: userId,
      code: code,
    });

    if (affError) {
      toast.error(affError.message);
      return;
    }

    // Also update the profile with the code for easier access
    await supabase
      .from("profiles")
      .update({ affiliate_code: code })
      .eq("id", userId);

    toast.success(`Affiliate code ${code} generated for ${fullName}`);
    fetchData();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
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
                    Commission
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
                          {aff.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(aff.code)}
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold">
                        {aff.total_referrals}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-black text-primary">
                        Rs. {aff.total_commission.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {aff.commission_rate}% rate
                      </p>
                    </TableCell>
                    <TableCell>
                      {aff.is_active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
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
