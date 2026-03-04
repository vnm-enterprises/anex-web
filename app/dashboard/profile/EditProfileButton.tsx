"use client";

import { Button } from "@/components/ui/button";

export default function EditProfileButton() {
  return (
    <Button
      variant="outline"
      className="w-full rounded-2xl font-bold"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-profile-modal"));
      }}
    >
      Edit Profile
    </Button>
  );
}
