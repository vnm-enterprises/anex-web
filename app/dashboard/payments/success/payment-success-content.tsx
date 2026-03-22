"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const listingId = searchParams.get("listing_id");
  const orderId = searchParams.get("order_id");

  // useEffect(() => {
  //   async function updateStatus() {
  //     const uuidRegex =
  //       /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  //     if (listingId && uuidRegex.test(listingId)) {
  //       console.log(`[SuccessPage] Updating status for listing ${listingId}`);
  //       const result = await updateListingStatusAfterPayment(
  //         listingId,
  //         orderId,
  //       );
  //       if (result.success) {
  //         router.refresh();
  //       }
  //     }
  //   }
  //   updateStatus();
  // }, [listingId, orderId, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.refresh();
      router.push("/dashboard");
    }
  }, [countdown, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-none soft-shadow-2xl rounded-[2.5rem] p-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-[2rem] bg-accent/100/10 text-accent">
              <CheckCircle size={64} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="font-medium text-muted-foreground">
            Thank you for your payment. Your listing or boost is being processed
            and will be updated shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary italic">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to dashboard in {countdown} seconds...
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full h-14 rounded-2xl font-black text-lg"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
