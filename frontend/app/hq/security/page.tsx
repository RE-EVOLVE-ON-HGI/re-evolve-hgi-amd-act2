"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Server,
  Key,
  Fingerprint,
  Scan,
  Radio,
  Zap,
  TrendingUp,
  Users,
  FileWarning,
  ShieldCheck,
  ShieldAlert,
  Network,
} from "lucide-react"
import {
  GlassPanel,
  StatusIndicator,
  MetricCard,
  NeuralPulse,
  HolographicBorder,
  ScanLine,
} from "@/components/hgi/design-system"

const securityMetrics = [
  { label: "Threat Level", value: "LOW", status: "success" as const, icon: Shield },
  { label: "Active Shields", value: "847", status: "success" as const, icon: ShieldCheck },
  { label: "Blocked Attempts", value: "12.4K", status: "warning" as const, icon: ShieldAlert },
  { label: "System Integrity", value: "99.97%", status: "success" as const, icon: CheckCircle },
]

const threatFeeds = [
  { id: 1, type: "INTRUSION", source: "External API", severity: "low", status: "blocked", time: "2m ago" },
  { id: 2, type: "ANOMALY", source: "Agent Network", severity: "medium", status: "investigating", time: "5m ago" },
  { id: 3, type: "BREACH_ATTEMPT", source: "Auth Gateway", severity: "high", status: "blocked", time: "12m ago" },
  { id: 4, type: "MALWARE", source: "Data Pipeline", severity: "low", status: "quarantined", time: "18m ago" },
  { id: 5, type: "DDoS", source: "CDN Edge", severity: "medium", status: "mitigated", time: "25m ago" },
]

const accessLogs = [
  { user: "SARATHI-CORE", action: "System Override", resource: "Mission Control", granted: true, time: "1m ago" },
  { user: "Agent-Nexus-7", action: "Data Access", resource: "Financial Vault", granted: true, time: "3m ago" },
  { user: "Unknown-IP", action: "Authentication", resource: "Admin Portal", granted: false, time: "5m ago" },
  { user: "Founder-Alpha", action: "Config Change", resource: "Governance Grid", granted: true, time: "8m ago" },
  { user: "Agent-Scout-12", action: "API Call", resource: "External Services", granted: true, time: "11m ago" },
]

const encryptionStatus = [
  { layer: "Transport Layer (TLS 1.3)", status: "active", strength: "256-bit AES-GCM" },
  { layer: "Data at Rest", status: "active", strength: "AES-256-XTS" },
  { layer: "Agent Communication", status: "active", strength: "Quantum-Safe Lattice" },
  { layer: "Vault Storage", status: "active", strength: "Multi-Party Computation" },
]

const networkNodes = [
  { id: 1, name: "Primary Gateway", status: "secure", load: 34, connections: 1247 },
  { id: 2, name: "Agent Mesh", status: "secure", load: 67, connections: 8934 },
  { id: 3, name: "Data Pipeline", status: "monitoring", load: 45, connections: 2341 },
  { id: 4, name: "External APIs", status: "secure", load: 23, connections: 567 },
  { id: 5, name: "Backup Systems", status: "secure", load: 12, connections: 89 },
]

export default function SecurityNexusPage() {
  const [selectedThreat, setSelectedThreat] = useState<number | null>(null)
  const [scanActive, setScanActive] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-amber-400"
      default:
        return "text-emerald-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
      case "quarantined":
      case "mitigated":
        return "text-emerald-400"
      case "investigating":
        return "text-amber-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            Security Nexus
          </h1>
          <p className="text-muted-foreground mt-1">Enterprise-grade threat detection and access control</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setScanActive(!scanActive)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              scanActive
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-hgi-blue/20 text-hgi-blue border border-hgi-blue/30"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Scan className={`w-5 h-5 ${scanActive ? "animate-pulse" : ""}`} />
            {scanActive ? "Scanning..." : "Full System Scan"}
          </motion.button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">All Systems Secure</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              status={metric.status}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Threat Monitor - Left */}
        <div className="col-span-5">
          <GlassPanel className="h-full">
            <HolographicBorder />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Live Threat Feed
              </h2>
              <span className="text-xs text-muted-foreground">Real-time monitoring</span>
            </div>

            <div className="space-y-3">
              {threatFeeds.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedThreat === threat.id
                      ? "bg-white/10 border-hgi-blue/50"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          threat.severity === "high"
                            ? "bg-red-400"
                            : threat.severity === "medium"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                      />
                      <span className="font-mono text-sm text-foreground">{threat.type}</span>
                    </div>
                    <span className={`text-xs font-medium uppercase ${getStatusColor(threat.status)}`}>
                      {threat.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Source: {threat.source}</span>
                    <span>{threat.time}</span>
                  </div>

                  <AnimatePresence>
                    {selectedThreat === threat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Severity</span>
                            <p className={`font-medium ${getSeverityColor(threat.severity)}`}>
                              {threat.severity.toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response Time</span>
                            <p className="text-foreground font-medium">{"<"}50ms</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Center - Network Visualization */}
        <div className="col-span-4">
          <GlassPanel className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Network className="w-5 h-5 text-hgi-blue" />
                Network Topology
              </h2>
            </div>

            {/* Network Visualization */}
            <div className="relative h-64 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Node */}
                <motion.div
                  className="absolute w-20 h-20 rounded-full bg-hgi-blue/20 border-2 border-hgi-blue flex items-center justify-center z-10"
                  animate={{ boxShadow: ["0 0 20px rgba(91,140,255,0.3)", "0 0 40px rgba(91,140,255,0.5)", "0 0 20px rgba(91,140,255,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Server className="w-8 h-8 text-hgi-blue" />
                </motion.div>

                {/* Orbiting Nodes */}
                {networkNodes.map((node, index) => {
                  const angle = (index / networkNodes.length) * Math.PI * 2
                  const radius = 90
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <motion.div
                      key={node.id}
                      className="absolute"
                      style={{ left: `calc(50% + ${x}px - 16px)`, top: `calc(50% + ${y}px - 16px)` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Connection Line */}
                      <svg
                        className="absolute"
                        style={{
                          width: Math.abs(x) + 20,
                          height: Math.abs(y) + 20,
                          left: x < 0 ? 16 : -Math.abs(x),
                          top: y < 0 ? 16 : -Math.abs(y),
                        }}
                      >
                        <line
                          x1={x < 0 ? Math.abs(x) : 0}
                          y1={y < 0 ? Math.abs(y) : 0}
                          x2={x < 0 ? 0 : Math.abs(x)}
                          y2={y < 0 ? 0 : Math.abs(y)}
                          stroke={node.status === "secure" ? "#00E5B0" : "#F6B73C"}
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          className="opacity-40"
                        />
                      </svg>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          node.status === "secure" ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-amber-500/20 border border-amber-500/50"
                        }`}
                      >
                        <Globe className={`w-4 h-4 ${node.status === "secure" ? "text-emerald-400" : "text-amber-400"}`} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Node List */}
            <div className="space-y-2">
              {networkNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        node.status === "secure" ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span className="text-sm text-foreground">{node.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Load: {node.load}%</span>
                    <span>{node.connections.toLocaleString()} conn</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {/* Encryption Status */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-hgi-violet" />
                Encryption Layers
              </h2>
            </div>

            <div className="space-y-3">
              {encryptionStatus.map((layer, index) => (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{layer.layer}</span>
                    <StatusIndicator status="success" label="Active" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{layer.strength}</span>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* Biometric Auth */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-hgi-emerald" />
                Biometric Auth
              </h2>
            </div>

            <div className="relative h-32 flex items-center justify-center">
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-hgi-emerald/50 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0,229,176,0.4)",
                    "0 0 0 20px rgba(0,229,176,0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Fingerprint className="w-12 h-12 text-hgi-emerald" />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">247</p>
                <p className="text-xs text-muted-foreground">Verified Today</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-2xl font-bold text-red-400">3</p>
                <p className="text-xs text-muted-foreground">Failed Attempts</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Access Logs */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-hgi-gold" />
            Access Control Log
          </h2>
          <button className="text-sm text-hgi-blue hover:underline">View Full Audit Trail</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">User/Agent</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Action</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Resource</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Time</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.map((log, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-foreground">{log.user}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.action}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.resource}</td>
                  <td className="py-3 px-4">
                    {log.granted ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm">
                        <CheckCircle className="w-4 h-4" /> Granted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {scanActive && <ScanLine />}
    </div>
  )
}
