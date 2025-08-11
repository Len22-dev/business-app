"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Upload } from "lucide-react"

export function SystemSettingsTab() {
  const [settings, setSettings] = useState({
    currency: "NGN",
    dateFormat: "DD/MM/YYYY",
    timeZone: "Africa/Lagos",
    language: "en",
    fiscalYearStart: "01",
    taxRate: "7.5",
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    debugMode: false,
  })

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving system settings:", settings)
  }

  const handleBackup = () => {
    console.log("Creating system backup...")
  }

  const handleRestore = () => {
    console.log("Restoring from backup...")
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic system preferences and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange("dateFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select value={settings.timeZone} onValueChange={(value) => handleSettingChange("timeZone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
          <CardDescription>Configure financial and accounting preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fiscal-year">Fiscal Year Start Month</Label>
              <Select
                value={settings.fiscalYearStart}
                onValueChange={(value) => handleSettingChange("fiscalYearStart", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">January</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="07">July</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => handleSettingChange("taxRate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked: boolean) => handleSettingChange("emailNotifications", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked: boolean) => handleSettingChange("smsNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Maintenance</CardTitle>
          <CardDescription>Manage system backups and maintenance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup system data</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked: boolean) => handleSettingChange("autoBackup", checked)}
            />
          </div>

          {settings.autoBackup && (
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => handleSettingChange("backupFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackup}>
              <Download className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
            <Button variant="outline" onClick={handleRestore}>
              <Upload className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked: boolean) => handleSettingChange("maintenanceMode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
