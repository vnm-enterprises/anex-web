import { Suspense } from "react";
import PaymentSuccessContent from "./payment-success-content";

function LoadingFallback() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="h-6 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
