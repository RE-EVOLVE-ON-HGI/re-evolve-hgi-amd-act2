"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Database,
  Zap,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  LogOut,
  Trash2,
  Download,
  Upload,
  ExternalLink,
} from "lucide-react"
import {
  GlassPanel,
  StatusIndicator,
  HolographicBorder,
} from "@/components/hgi/design-system"

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "data", label: "Data & Privacy", icon: Database },
]

const integrations = [
  { name: "OpenAI", status: "connected", icon: "🤖" },
  { name: "Anthropic", status: "connected", icon: "🧠" },
  { name: "AWS", status: "connected", icon: "☁️" },
  { name: "Slack", status: "disconnected", icon: "💬" },
  { name: "GitHub", status: "connected", icon: "🐙" },
  { name: "Stripe", status: "connected", icon: "💳" },
]

const notificationSettings = [
  { id: "email", label: "Email Notifications", description: "Receive updates via email", enabled: true },
  { id: "push", label: "Push Notifications", description: "Browser push notifications", enabled: true },
  { id: "sms", label: "SMS Alerts", description: "Critical alerts via SMS", enabled: false },
  { id: "agent", label: "Agent Updates", description: "Notifications about agent activity", enabled: true },
  { id: "security", label: "Security Alerts", description: "Immediate security notifications", enabled: true },
  { id: "reports", label: "Weekly Reports", description: "Weekly summary digest", enabled: true },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [notifications, setNotifications] = useState(
    notificationSettings.reduce((acc, n) => ({ ...acc, [n.id]: n.enabled }), {} as Record<string, boolean>)
  )
  const [showPassword, setShowPassword] = useState(false)

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-foreground" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <GlassPanel>
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-hgi-blue/20 text-hgi-blue border border-hgi-blue/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? "rotate-90" : ""
                  }`} />
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Content */}
        <div className="col-span-9">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassPanel>
                <HolographicBorder />
                <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>

                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hgi-blue to-hgi-violet flex items-center justify-center text-3xl font-bold text-white">
                      FA
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-hgi-blue flex items-center justify-center text-white">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="Founder"
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Alpha"
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="founder@re-evolve.ai"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Role</label>
                      <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50">
                        <option>Founder / CEO</option>
                        <option>Administrator</option>
                        <option>Operator</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground">
                    Cancel
                  </button>
                  <motion.button
                    className="px-6 py-2 rounded-lg bg-hgi-blue text-white font-medium flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  {notificationSettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          {setting.id === "email" && <Mail className="w-5 h-5 text-hgi-blue" />}
                          {setting.id === "push" && <Bell className="w-5 h-5 text-hgi-violet" />}
                          {setting.id === "sms" && <Smartphone className="w-5 h-5 text-hgi-emerald" />}
                          {setting.id === "agent" && <Zap className="w-5 h-5 text-hgi-gold" />}
                          {setting.id === "security" && <Shield className="w-5 h-5 text-red-400" />}
                          {setting.id === "reports" && <Database className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{setting.label}</h3>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleNotification(setting.id)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          notifications[setting.id] ? "bg-hgi-blue" : "bg-white/20"
                        }`}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow-lg"
                          animate={{ x: notifications[setting.id] ? 26 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-hgi-blue/50"
                      />
                    </div>
                  </div>

                  <motion.button
                    className="px-6 py-2 rounded-lg bg-hgi-blue text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Password
                  </motion.button>
                </div>
              </GlassPanel>

              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Two-Factor Authentication</h2>

                <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">2FA Enabled</h3>
                      <p className="text-sm text-muted-foreground">Your account is protected with authenticator app</p>
                    </div>
                  </div>
                  <StatusIndicator status="success" label="Active" />
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-4">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "light", label: "Light", icon: Sun },
                        { id: "system", label: "System", icon: Monitor },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id as "dark" | "light" | "system")}
                          className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                            theme === option.id
                              ? "bg-hgi-blue/20 border-hgi-blue/50 text-hgi-blue"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <option.icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{option.label}</span>
                          {theme === option.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Connected Services</h2>

                <div className="grid grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-medium text-foreground">{integration.name}</h3>
                          <StatusIndicator
                            status={integration.status === "connected" ? "success" : "neutral"}
                            label={integration.status}
                          />
                        </div>
                      </div>
                      <button
                        className={`px-3 py-1.5 rounded text-sm font-medium ${
                          integration.status === "connected"
                            ? "bg-white/5 text-muted-foreground hover:text-foreground"
                            : "bg-hgi-blue/20 text-hgi-blue"
                        }`}
                      >
                        {integration.status === "connected" ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Data & Privacy Section */}
          {activeSection === "data" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassPanel>
                <h2 className="text-xl font-semibold text-foreground mb-6">Data Management</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                      <Download className="w-5 h-5 text-hgi-blue" />
                      <div>
                        <h3 className="font-medium text-foreground">Export Data</h3>
                        <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-hgi-blue/20 text-hgi-blue font-medium">
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-4">
                      <Trash2 className="w-5 h-5 text-red-400" />
                      <div>
                        <h3 className="font-medium text-foreground">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
