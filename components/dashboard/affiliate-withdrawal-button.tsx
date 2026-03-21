"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AffiliateWithdrawalButtonProps {
  requestAction: (formData: FormData) => Promise<void>;
  availableAmount: number;
}

export function AffiliateWithdrawalButton({
  requestAction,
  availableAmount,
}: AffiliateWithdrawalButtonProps) {
  const [open, setOpen] = useState(false);

  const defaultAmount = useMemo(() => {
    return availableAmount > 0 ? availableAmount.toFixed(2) : "";
  }, [availableAmount]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-2xl"
          disabled={availableAmount <= 0}
        >
          Request Withdrawal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            Request Affiliate Withdrawal
          </DialogTitle>
          <DialogDescription>
            Enter your bank details. Your request will be reviewed by admin and
            marked as deposited once payment is sent.
          </DialogDescription>
        </DialogHeader>

        <form action={requestAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount_lkr">Amount (LKR)</Label>
            <Input
              id="amount_lkr"
              name="amount_lkr"
              type="number"
              step="0.01"
              min="1"
              max={Math.max(availableAmount, 0)}
              required
              defaultValue={defaultAmount}
              placeholder="0.00"
            />
            <p className="text-xs font-medium text-muted-foreground">
              Available now: Rs {availableAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bank_account_name">Account Holder Name</Label>
            <Input
              id="bank_account_name"
              name="bank_account_name"
              required
              placeholder="John Perera"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                required
                placeholder="Commercial Bank"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_branch">Branch</Label>
              <Input
                id="bank_branch"
                name="bank_branch"
                placeholder="Kandy"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bank_account_number">Account Number</Label>
            <Input
              id="bank_account_number"
              name="bank_account_number"
              required
              placeholder="1234567890"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any payment instruction for admin"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="rounded-2xl">
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
