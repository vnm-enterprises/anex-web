"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bolt, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  onSuccess: () => void;
}

export function BoostModal({
  isOpen,
  onClose,
  listingId,
  onSuccess,
}: BoostModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"options" | "payment" | "success">(
    "options",
  );
  const [selectedPlan, setSelectedPlan] = useState<
    "quick" | "premium" | "featured"
  >("quick");

  const handleBoost = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listingId,
          plan_slug: selectedPlan,
          type: "boost",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate checkout");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-none soft-shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-6">
            <div
              className={`p-4 rounded-[2rem] ${step === "success" ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"}`}
            >
              {step === "success" ? (
                <CheckCircle size={48} />
              ) : (
                <Bolt size={48} />
              )}
            </div>
          </div>
          <DialogTitle className="text-3xl font-black text-center tracking-tighter">
            {step === "options"
              ? "Boost Your Listing"
              : step === "payment"
                ? "Checkout"
                : "Listing Boosted!"}
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            {step === "options"
              ? "Get up to 10x more views by appearing at the top of search results."
              : step === "payment"
                ? "Secure payment via mock gateway."
                : "Your property is now featured at the top of search results."}
          </DialogDescription>
        </DialogHeader>

        {step === "options" && (
          <div className="grid gap-4 py-8">
            <div
              onClick={() => setSelectedPlan("quick")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === "quick" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-foreground">Quick Boost</h4>
                <span className="font-black text-primary">Rs 500</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                7 Days of high-visibility placement.
              </p>
            </div>

            <div
              onClick={() => setSelectedPlan("premium")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === "premium" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-foreground">Premium Boost</h4>
                  <Badge className="bg-primary border-none text-[8px] font-black uppercase">
                    Popular
                  </Badge>
                </div>
                <span className="font-black text-primary">Rs 900</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Top Priority placement for 14 days.
              </p>
            </div>

            <div
              onClick={() => setSelectedPlan("featured")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === "featured" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-foreground">
                    Featured Spotlight
                  </h4>
                  <Badge className="bg-primary border-none text-[8px] font-black uppercase">
                    Ultimate Reach
                  </Badge>
                </div>
                <span className="font-black text-primary">Rs 1,500</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Featured badge + Maximum exposure for 30 days.
              </p>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="py-10 space-y-6">
            <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-foreground capitalize">
                  {selectedPlan.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between text-xl font-black">
                <span>Total Amount</span>
                <span className="text-primary">
                  Rs{" "}
                  {selectedPlan === "quick"
                    ? "500"
                    : selectedPlan === "premium"
                      ? "900"
                      : "1,500"}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
              This is a mock payment gateway for testing purposes.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-3">
          {step === "options" && (
            <Button
              className="w-full h-14 rounded-2xl font-black text-lg"
              onClick={() => setStep("payment")}
            >
              Continue to Payment
            </Button>
          )}
          {step === "payment" && (
            <>
              <Button
                variant="ghost"
                className="rounded-xl font-bold"
                onClick={() => setStep("options")}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                className="flex-1 h-14 rounded-2xl font-black text-lg"
                onClick={handleBoost}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Pay & Boost Now"
                )}
              </Button>
            </>
          )}
          {step === "success" && (
            <Button
              className="w-full h-14 rounded-2xl font-black text-lg"
              onClick={onClose}
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
