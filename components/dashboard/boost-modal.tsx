"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bolt, Sparkles, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  onSuccess: () => void
}

export function BoostModal({ isOpen, onClose, listingId, onSuccess }: BoostModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"options" | "payment" | "success">("options")
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("basic")

  const handleBoost = async () => {
    setLoading(true)
    // Mock Payment Delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const supabase = createClient()
    const { error } = await supabase
      .from("listings")
      .update({
        is_boosted: true,
        boost_weight: selectedPlan === "premium" ? 2 : 1,
        boost_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", listingId)

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      setStep("success")
      setLoading(false)
      onSuccess()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-none soft-shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-[2rem] ${step === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
              {step === 'success' ? <CheckCircle size={48} /> : <Bolt size={48} />}
            </div>
          </div>
          <DialogTitle className="text-3xl font-black text-center tracking-tighter">
            {step === 'options' ? "Boost Your Listing" : step === 'payment' ? "Checkout" : "Listing Boosted!"}
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            {step === 'options' ? "Get up to 10x more views by appearing at the top of search results." :
             step === 'payment' ? "Secure payment via mock gateway." :
             "Your property is now featured at the top of search results."}
          </DialogDescription>
        </DialogHeader>

        {step === "options" && (
          <div className="grid gap-4 py-8">
            <div
              onClick={() => setSelectedPlan("basic")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'basic' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-foreground">Basic Boost</h4>
                <span className="font-black text-primary">Rs 500</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">7 Days of high-visibility placement.</p>
            </div>

            <div
              onClick={() => setSelectedPlan("premium")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'premium' ? 'border-amber-500 bg-amber-500/5' : 'border-border/50 hover:border-amber-500/30'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-foreground">Premium Boost</h4>
                  <Badge className="bg-amber-500 border-none text-[8px] font-black uppercase">Most Viral</Badge>
                </div>
                <span className="font-black text-amber-500">Rs 1,200</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Top Priority placement for 7 days + Featured badge.</p>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="py-10 space-y-6">
             <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-4">
                <div className="flex justify-between text-sm font-bold">
                   <span className="text-muted-foreground">Plan</span>
                   <span className="text-foreground capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between text-xl font-black">
                   <span>Total Amount</span>
                   <span className="text-primary">Rs {selectedPlan === 'basic' ? '500' : '1,200'}</span>
                </div>
             </div>
             <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
                This is a mock payment gateway for testing purposes.
             </p>
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-3">
          {step === "options" && (
            <Button className="w-full h-14 rounded-2xl font-black text-lg" onClick={() => setStep("payment")}>
              Continue to Payment
            </Button>
          )}
          {step === "payment" && (
            <>
              <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setStep("options")} disabled={loading}>
                Back
              </Button>
              <Button className="flex-1 h-14 rounded-2xl font-black text-lg" onClick={handleBoost} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Pay & Boost Now"}
              </Button>
            </>
          )}
          {step === "success" && (
            <Button className="w-full h-14 rounded-2xl font-black text-lg" onClick={onClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
