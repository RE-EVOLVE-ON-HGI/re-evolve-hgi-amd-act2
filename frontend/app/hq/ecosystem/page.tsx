"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Briefcase,
  Target,
  Radar,
  Map,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  Bell,
  Filter,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"
import {
  GlassPanel,
  StatusIndicator,
  MetricCard,
  HolographicBorder,
} from "@/components/hgi/design-system"

const marketMetrics = [
  { label: "Market Sentiment", value: "Bullish", trend: "up", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Tracked Companies", value: "2,847", trend: "up", icon: Building2, color: "text-hgi-blue" },
  { label: "Active Signals", value: "156", trend: "neutral", icon: Radar, color: "text-hgi-violet" },
  { label: "Intelligence Score", value: "94.7", trend: "up", icon: Target, color: "text-hgi-gold" },
]

const competitors = [
  {
    name: "TechCorp AI",
    sector: "Enterprise AI",
    threat: "high",
    funding: "$2.4B",
    growth: 45,
    employees: 1200,
    sentiment: "positive",
  },
  {
    name: "NeuralSoft",
    sector: "ML Platform",
    threat: "medium",
    funding: "$890M",
    growth: 32,
    employees: 450,
    sentiment: "neutral",
  },
  {
    name: "DataMind Inc",
    sector: "Analytics",
    threat: "low",
    funding: "$340M",
    growth: -5,
    employees: 280,
    sentiment: "negative",
  },
  {
    name: "CloudAI Systems",
    sector: "Infrastructure",
    threat: "medium",
    funding: "$1.2B",
    growth: 28,
    employees: 680,
    sentiment: "positive",
  },
  {
    name: "Quantum Labs",
    sector: "Research",
    threat: "high",
    funding: "$560M",
    growth: 67,
    employees: 120,
    sentiment: "positive",
  },
]

const marketSignals = [
  {
    id: 1,
    type: "ACQUISITION",
    title: "TechCorp acquires DataFlow for $450M",
    impact: "high",
    time: "2h ago",
    relevance: 92,
  },
  {
    id: 2,
    type: "FUNDING",
    title: "NeuralSoft raises Series D at $3.2B valuation",
    impact: "medium",
    time: "5h ago",
    relevance: 85,
  },
  {
    id: 3,
    type: "PRODUCT",
    title: "CloudAI launches enterprise agent platform",
    impact: "high",
    time: "8h ago",
    relevance: 94,
  },
  {
    id: 4,
    type: "REGULATION",
    title: "EU AI Act compliance deadline announced",
    impact: "medium",
    time: "12h ago",
    relevance: 78,
  },
  {
    id: 5,
    type: "TALENT",
    title: "Key ML researcher joins Quantum Labs",
    impact: "low",
    time: "1d ago",
    relevance: 65,
  },
]

const sectorPerformance = [
  { sector: "Enterprise AI", growth: 34, share: 28, trend: "up" },
  { sector: "ML Platforms", growth: 28, share: 22, trend: "up" },
  { sector: "Data Analytics", growth: 15, share: 18, trend: "neutral" },
  { sector: "AI Infrastructure", growth: 42, share: 15, trend: "up" },
  { sector: "AI Research", growth: 56, share: 12, trend: "up" },
  { sector: "Other", growth: 8, share: 5, trend: "down" },
]

const geographicData = [
  { region: "North America", companies: 1247, value: "$45.2B", growth: 32 },
  { region: "Europe", companies: 623, value: "$18.7B", growth: 28 },
  { region: "Asia Pacific", companies: 834, value: "$32.1B", growth: 45 },
  { region: "Rest of World", companies: 143, value: "$4.8B", growth: 21 },
]

export default function EcosystemPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("7d")

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "high":
        return "text-red-400 bg-red-400/10 border-red-400/30"
      case "medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/30"
      default:
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />
      case "negative":
        return <ArrowDownRight className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-hgi-emerald/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-hgi-emerald" />
            </div>
            Ecosystem Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Real-time market monitoring and competitive analysis</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-hgi-blue/20 text-hgi-blue"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <motion.button
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {marketMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassPanel className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Competitor Radar - Left */}
        <div className="col-span-5">
          <GlassPanel className="h-full">
            <HolographicBorder />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Radar className="w-5 h-5 text-hgi-blue" />
                Competitor Radar
              </h2>
              <button className="text-sm text-hgi-blue hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <motion.div
                  key={competitor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() =>
                    setSelectedCompetitor(selectedCompetitor === competitor.name ? null : competitor.name)
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCompetitor === competitor.name
                      ? "bg-white/10 border-hgi-blue/50"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{competitor.name}</h3>
                        <p className="text-xs text-muted-foreground">{competitor.sector}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${getThreatColor(competitor.threat)}`}
                    >
                      {competitor.threat.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Funding</span>
                      <p className="text-sm font-medium text-foreground">{competitor.funding}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Growth</span>
                      <p
                        className={`text-sm font-medium ${
                          competitor.growth > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {competitor.growth > 0 ? "+" : ""}
                        {competitor.growth}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Team</span>
                      <p className="text-sm font-medium text-foreground">{competitor.employees}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Sentiment</span>
                      <div className="flex items-center gap-1">{getSentimentIcon(competitor.sentiment)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Market Signals - Center */}
        <div className="col-span-4">
          <GlassPanel className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-hgi-gold" />
                Live Market Signals
              </h2>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
            </div>

            <div className="space-y-3">
              {marketSignals.map((signal, index) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono rounded ${
                          signal.impact === "high"
                            ? "bg-red-400/20 text-red-400"
                            : signal.impact === "medium"
                            ? "bg-amber-400/20 text-amber-400"
                            : "bg-emerald-400/20 text-emerald-400"
                        }`}
                      >
                        {signal.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{signal.time}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-sm text-foreground mb-2">{signal.title}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Relevance</span>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-hgi-blue rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${signal.relevance}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-hgi-blue">{signal.relevance}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {/* Sector Performance */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <PieChart className="w-5 h-5 text-hgi-violet" />
                Sector Performance
              </h2>
            </div>

            <div className="space-y-3">
              {sectorPerformance.map((sector, index) => (
                <motion.div
                  key={sector.sector}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{sector.sector}</span>
                      <span
                        className={`text-xs font-medium ${
                          sector.trend === "up"
                            ? "text-emerald-400"
                            : sector.trend === "down"
                            ? "text-red-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        +{sector.growth}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-hgi-blue to-hgi-violet rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sector.share * 3}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* Geographic Distribution */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Map className="w-5 h-5 text-hgi-emerald" />
                Geographic Distribution
              </h2>
            </div>

            <div className="space-y-3">
              {geographicData.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{region.region}</span>
                    <span className="text-xs text-emerald-400">+{region.growth}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{region.companies.toLocaleString()} companies</span>
                    <span className="text-hgi-blue">{region.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
