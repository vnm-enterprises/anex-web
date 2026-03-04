"use client";

import { useState, useEffect } from "react";
import { ProfileModal } from "./profile-modal";
import type { Profile } from "@/lib/types";

interface ProfileModalWrapperProps {
  initialProfile: Profile | null;
}

export function ProfileModalWrapper({
  initialProfile,
}: ProfileModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-profile-modal", handleOpen);
    return () => window.removeEventListener("open-profile-modal", handleOpen);
  }, []);

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      profile={profile}
      onUpdate={(updated) => setProfile(updated)}
    />
  );
}
