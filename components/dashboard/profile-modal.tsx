"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, User, Camera } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile | null
  onUpdate: (updatedProfile: Profile) => void
}

export function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: "", phone: "", avatar_url: "" })

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
      })
    }
  }, [profile, isOpen])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        avatar_url: form.avatar_url,
      })
      .eq("id", profile.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated successfully")
      onUpdate({
        ...profile,
        full_name: form.full_name,
        phone: form.phone,
        avatar_url: form.avatar_url,
      })
      onClose()
    }
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        overlayClassName="bg-black/70"
        className="sm:max-w-[425px] rounded-[2rem] border-none soft-shadow p-8"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">Edit Profile</DialogTitle>
          <DialogDescription className="font-medium">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-[2rem] bg-primary flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20 overflow-hidden">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  form.full_name?.charAt(0)?.toUpperCase() || <User size={40} />
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-white soft-shadow text-primary border border-border group-hover:scale-110 transition-transform"
                title="Change Avatar"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1">Full Name</Label>
              <Input
                id="name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="rounded-xl h-12 bg-muted/50 border-none focus-visible:ring-primary"
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest ml-1">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl h-12 bg-muted/50 border-none focus-visible:ring-primary"
                placeholder="07X XXX XXXX"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
