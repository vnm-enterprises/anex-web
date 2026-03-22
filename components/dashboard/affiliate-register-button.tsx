"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AffiliateRegisterButtonProps {
  registerAction: () => Promise<void>;
}

export function AffiliateRegisterButton({ registerAction }: AffiliateRegisterButtonProps) {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button type="button" className="rounded-2xl h-12 px-8 font-black" onClick={() => setOpen(true)}>
        Register as Affiliate User
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Affiliate Terms & Disclaimers
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 font-medium text-muted-foreground">
              Please review and accept the terms before becoming an affiliate user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            <p>Commission is credited only when referred users complete paid listing or boost purchases.</p>
            <p>Standard payout basis is 10% of qualifying purchase amounts, subject to platform policy updates.</p>
            <p>Fraudulent/self-referral behavior may lead to affiliate code suspension and reversal of receivables.</p>
            <p>You are responsible for complying with local advertising and disclosure regulations when promoting your code.</p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              By proceeding, you agree to the affiliate terms, commission rules, and platform anti-abuse policies.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm font-bold cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(Boolean(checked))}
            />
            I have read and agree to the terms and disclaimers.
          </label>

          <DialogFooter>
            <form
              action={registerAction}
              onSubmit={(event) => {
                if (submitLockRef.current) {
                  event.preventDefault();
                  return;
                }
                submitLockRef.current = true;
                setSubmitting(true);
              }}
            >
              <Button type="submit" className="rounded-2xl" disabled={!agreed || submitting}>
                {submitting ? "Registering..." : "Confirm & Register"}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
