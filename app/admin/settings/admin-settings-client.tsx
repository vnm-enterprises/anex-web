"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AdminSettingsClient() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState<any>(null)

  const fetchSettings = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("system_config")
      .select("*")
      .limit(1)
      .single()

    setSettings(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)

    const { error } = await supabase
      .from("system_config")
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Settings updated successfully")
    }

    setSaving(false)
  }

  if (loading || !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10">

      <h1 className="font-display text-3xl font-bold">
        Platform Settings
      </h1>

      {/* === PLATFORM INFO === */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div>
            <Label>Site Name</Label>
            <Input
              value={settings.site_name}
              onChange={(e) =>
                setSettings({ ...settings, site_name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Support Email</Label>
            <Input
              value={settings.support_email || ""}
              onChange={(e) =>
                setSettings({ ...settings, support_email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Default Listing Duration (Days)</Label>
            <Input
              type="number"
              value={settings.default_listing_days}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  default_listing_days: Number(e.target.value),
                })
              }
            />
          </div>

        </CardContent>
      </Card>

      {/* === PRICING CONTROLS === */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Pricing Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div>
            <Label>Boost Price (Rs)</Label>
            <Input
              type="number"
              value={settings.boost_price}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  boost_price: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>Featured Price (Rs)</Label>
            <Input
              type="number"
              value={settings.featured_price}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  featured_price: Number(e.target.value),
                })
              }
            />
          </div>

        </CardContent>
      </Card>

      {/* === MODERATION CONTROLS === */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Moderation & System Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Approve Listings</p>
              <p className="text-sm text-muted-foreground">
                Automatically approve new listings
              </p>
            </div>

            <Switch
              checked={settings.auto_approve}
              onCheckedChange={(val) =>
                setSettings({ ...settings, auto_approve: val })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Phone Verification</p>
              <p className="text-sm text-muted-foreground">
                Users must verify phone before posting
              </p>
            </div>

            <Switch
              checked={settings.require_phone_verification}
              onCheckedChange={(val) =>
                setSettings({
                  ...settings,
                  require_phone_verification: val,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">
                Maintenance Mode
              </p>
              <p className="text-sm text-muted-foreground">
                Disable platform access for users
              </p>
            </div>

            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(val) =>
                setSettings({
                  ...settings,
                  maintenance_mode: val,
                })
              }
            />
          </div>

        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

    </div>
  )
}
