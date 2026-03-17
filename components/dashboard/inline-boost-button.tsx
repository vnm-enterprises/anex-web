"use client";

import { useState } from "react";
import { Bolt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BoostModal } from "@/components/dashboard/boost-modal";

interface InlineBoostButtonProps {
  listingId: string;
  disabled?: boolean;
  isBoosted?: boolean;
}

export function InlineBoostButton({
  listingId,
  disabled = false,
  isBoosted = false,
}: InlineBoostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        variant="ghost"
        size="sm"
        className="h-9 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white font-black text-[10px] uppercase tracking-widest border border-primary/20"
      >
        <Bolt className="h-3 w-3 mr-1 fill-current" />
        {isBoosted ? "Re-Boost" : "Boost Ad"}
      </Button>

      <BoostModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        listingId={listingId}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
