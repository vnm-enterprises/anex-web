"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentErrorPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-none soft-shadow-2xl rounded-[2.5rem] p-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-[2rem] bg-destructive/10 text-destructive">
              <XCircle size={64} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="font-medium text-muted-foreground">
            We couldn't process your payment. This could be due to a cancelled
            transaction, insufficient funds, or a temporary issue with the
            payment provider.
          </p>
          <p className="text-sm border-t pt-4 text-muted-foreground/60">
            No charges were made to your account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={() => window.history.back()}
            className="w-full h-14 rounded-2xl font-black text-lg"
          >
            <RefreshCcw className="mr-2 h-5 w-5" /> Try Again
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 rounded-xl font-bold text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
