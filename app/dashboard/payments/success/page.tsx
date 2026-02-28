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

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-none soft-shadow-2xl rounded-[2.5rem] p-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-[2rem] bg-emerald-500/10 text-emerald-500">
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
