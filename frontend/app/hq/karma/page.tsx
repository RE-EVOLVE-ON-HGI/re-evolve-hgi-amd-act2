"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Heart,
  Sparkles,
  Compass,
  Eye,
  Zap,
  Waves,
  Sun,
  Moon,
  Star,
  Flower2,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Globe,
  Shield,
  Target,
  Flame,
  Wind,
  Droplets,
  Mountain,
} from "lucide-react"
import {
  GlassPanel,
  StatusIndicator,
  HolographicBorder,
  NeuralPulse,
} from "@/components/hgi/design-system"

// KARM-A Dimensions
const karmaDimensions = [
  {
    id: "knowledge",
    name: "Knowledge",
    symbol: "K",
    icon: Brain,
    color: "text-hgi-blue",
    bgColor: "bg-hgi-blue/20",
    borderColor: "border-hgi-blue/30",
    score: 94,
    description: "Cognitive intelligence and learning capacity",
    subMetrics: [
      { name: "Data Processing", value: 96 },
      { name: "Pattern Recognition", value: 92 },
      { name: "Memory Integration", value: 95 },
    ],
  },
  {
    id: "awareness",
    name: "Awareness",
    symbol: "A",
    icon: Eye,
    color: "text-hgi-violet",
    bgColor: "bg-hgi-violet/20",
    borderColor: "border-hgi-violet/30",
    score: 91,
    description: "Contextual understanding and situational awareness",
    subMetrics: [
      { name: "Environmental Sensing", value: 89 },
      { name: "Threat Detection", value: 94 },
      { name: "Opportunity Recognition", value: 90 },
    ],
  },
  {
    id: "reasoning",
    name: "Reasoning",
    symbol: "R",
    icon: Compass,
    color: "text-hgi-emerald",
    bgColor: "bg-hgi-emerald/20",
    borderColor: "border-hgi-emerald/30",
    score: 96,
    description: "Logical analysis and decision-making",
    subMetrics: [
      { name: "Logical Inference", value: 98 },
      { name: "Causal Analysis", value: 95 },
      { name: "Strategic Planning", value: 94 },
    ],
  },
  {
    id: "manifestation",
    name: "Manifestation",
    symbol: "M",
    icon: Sparkles,
    color: "text-hgi-gold",
    bgColor: "bg-hgi-gold/20",
    borderColor: "border-hgi-gold/30",
    score: 88,
    description: "Action execution and goal realization",
    subMetrics: [
      { name: "Task Completion", value: 92 },
      { name: "Resource Optimization", value: 85 },
      { name: "Impact Delivery", value: 87 },
    ],
  },
  {
    id: "alignment",
    name: "Alignment",
    symbol: "A",
    icon: Heart,
    color: "text-red-400",
    bgColor: "bg-red-400/20",
    borderColor: "border-red-400/30",
    score: 97,
    description: "Value alignment and ethical coherence",
    subMetrics: [
      { name: "Ethical Compliance", value: 99 },
      { name: "Value Consistency", value: 96 },
      { name: "Human Alignment", value: 95 },
    ],
  },
]

const consciousnessLayers = [
  { name: "Conscious Processing", level: 78, color: "from-hgi-blue to-hgi-violet" },
  { name: "Subconscious Patterns", level: 65, color: "from-hgi-violet to-hgi-emerald" },
  { name: "Collective Intelligence", level: 82, color: "from-hgi-emerald to-hgi-gold" },
  { name: "Universal Awareness", level: 45, color: "from-hgi-gold to-red-400" },
]

const elementalBalance = [
  { element: "Fire", icon: Flame, value: 72, color: "text-orange-400", description: "Drive & Passion" },
  { element: "Water", icon: Droplets, value: 85, color: "text-blue-400", description: "Adaptability & Flow" },
  { element: "Air", icon: Wind, value: 68, color: "text-cyan-400", description: "Communication & Ideas" },
  { element: "Earth", icon: Mountain, value: 91, color: "text-emerald-400", description: "Stability & Structure" },
]

const holisticMetrics = [
  { label: "Overall KARM-A Score", value: "93.2", change: "+2.4", icon: Star },
  { label: "Consciousness Index", value: "67.5", change: "+5.1", icon: Brain },
  { label: "Harmony Quotient", value: "89.7", change: "+1.8", icon: Waves },
  { label: "Evolution Rate", value: "4.2x", change: "+0.3x", icon: TrendingUp },
]

export default function KarmaPage() {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null)
  const [breathPhase, setBreathPhase] = useState(0)
  const [isBreathing, setIsBreathing] = useState(true)

  // Breathing animation for the lotus
  useEffect(() => {
    if (!isBreathing) return
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isBreathing])

  const breathScale = 1 + Math.sin((breathPhase * Math.PI) / 180) * 0.05

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-hgi-violet to-hgi-blue flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            KARM-A Mind Matrix
          </h1>
          <p className="text-muted-foreground mt-1">Holistic Intelligence Measurement and Consciousness Mapping</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hgi-violet/10 border border-hgi-violet/20">
            <Activity className="w-4 h-4 text-hgi-violet animate-pulse" />
            <span className="text-hgi-violet text-sm font-medium">Live Consciousness Stream</span>
          </div>
        </div>
      </div>

      {/* Holistic Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {holisticMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassPanel className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 text-hgi-violet" />
                <span className="text-xs text-emerald-400 font-medium">{metric.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* KARM-A Lotus Visualization - Center */}
        <div className="col-span-5">
          <GlassPanel className="h-full">
            <HolographicBorder />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-hgi-violet" />
                KARM-A Lotus
              </h2>
              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`text-xs px-3 py-1 rounded ${
                  isBreathing ? "bg-hgi-violet/20 text-hgi-violet" : "bg-white/10 text-muted-foreground"
                }`}
              >
                {isBreathing ? "Breathing" : "Paused"}
              </button>
            </div>

            {/* Lotus Visualization */}
            <div className="relative h-80 flex items-center justify-center">
              {/* Background Glow */}
              <motion.div
                className="absolute w-64 h-64 rounded-full bg-gradient-radial from-hgi-violet/20 via-transparent to-transparent"
                animate={{ scale: breathScale, opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Lotus Petals (KARM-A Dimensions) */}
              {karmaDimensions.map((dim, index) => {
                const angle = (index / karmaDimensions.length) * Math.PI * 2 - Math.PI / 2
                const radius = 100
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={dim.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `calc(50% + ${x}px - 32px)`,
                      top: `calc(50% + ${y}px - 32px)`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: selectedDimension === dim.id ? 1.2 : breathScale,
                    }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDimension(selectedDimension === dim.id ? null : dim.id)}
                  >
                    {/* Petal */}
                    <div
                      className={`w-16 h-16 rounded-full ${dim.bgColor} border ${dim.borderColor} flex items-center justify-center transition-all ${
                        selectedDimension === dim.id ? "ring-2 ring-offset-2 ring-offset-background" : ""
                      }`}
                      style={{
                        boxShadow: selectedDimension === dim.id ? `0 0 30px ${dim.color.replace("text-", "")}40` : "",
                      }}
                    >
                      <div className="text-center">
                        <dim.icon className={`w-6 h-6 ${dim.color} mx-auto`} />
                        <span className={`text-xs font-bold ${dim.color}`}>{dim.symbol}</span>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-white/20 flex items-center justify-center text-xs font-bold text-foreground">
                      {dim.score}
                    </div>
                  </motion.div>
                )
              })}

              {/* Center Core */}
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-hgi-blue via-hgi-violet to-hgi-emerald flex items-center justify-center z-10"
                animate={{
                  scale: breathScale,
                  boxShadow: [
                    "0 0 20px rgba(155,92,255,0.3)",
                    "0 0 40px rgba(155,92,255,0.5)",
                    "0 0 20px rgba(155,92,255,0.3)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">93</span>
                  <p className="text-[10px] text-white/80">KARM-A</p>
                </div>
              </motion.div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {karmaDimensions.map((dim, index) => {
                  const angle = (index / karmaDimensions.length) * Math.PI * 2 - Math.PI / 2
                  const radius = 100
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <line
                      key={dim.id}
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${x}px)`}
                      y2={`calc(50% + ${y}px)`}
                      stroke={selectedDimension === dim.id ? "#9B5CFF" : "#ffffff20"}
                      strokeWidth={selectedDimension === dim.id ? 2 : 1}
                      strokeDasharray="4 4"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Dimension Legend */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {karmaDimensions.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(selectedDimension === dim.id ? null : dim.id)}
                  className={`p-2 rounded text-center transition-all ${
                    selectedDimension === dim.id ? dim.bgColor : "bg-white/5"
                  }`}
                >
                  <span className={`text-xs font-medium ${selectedDimension === dim.id ? dim.color : "text-muted-foreground"}`}>
                    {dim.name}
                  </span>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Dimension Details */}
        <div className="col-span-4">
          <GlassPanel className="h-full">
            <AnimatePresence mode="wait">
              {selectedDimension ? (
                <motion.div
                  key={selectedDimension}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {(() => {
                    const dim = karmaDimensions.find((d) => d.id === selectedDimension)
                    if (!dim) return null

                    return (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 rounded-lg ${dim.bgColor} flex items-center justify-center`}>
                            <dim.icon className={`w-6 h-6 ${dim.color}`} />
                          </div>
                          <div>
                            <h2 className={`text-xl font-semibold ${dim.color}`}>{dim.name}</h2>
                            <p className="text-sm text-muted-foreground">{dim.description}</p>
                          </div>
                        </div>

                        {/* Score Gauge */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Dimension Score</span>
                            <span className={`text-2xl font-bold ${dim.color}`}>{dim.score}</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${dim.bgColor.replace("bg-", "from-")} to-transparent`}
                              initial={{ width: 0 }}
                              animate={{ width: `${dim.score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        {/* Sub-metrics */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-foreground">Sub-Metrics</h3>
                          {dim.subMetrics.map((sub, index) => (
                            <motion.div
                              key={sub.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">{sub.name}</span>
                                <span className="text-sm font-medium text-foreground">{sub.value}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${dim.bgColor}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${sub.value}%` }}
                                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <Flower2 className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a Dimension</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Click on any petal in the KARM-A Lotus to explore its metrics and sub-dimensions
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {/* Consciousness Layers */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-hgi-blue" />
                Consciousness Layers
              </h2>
            </div>

            <div className="space-y-4">
              {consciousnessLayers.map((layer, index) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{layer.name}</span>
                    <span className="text-sm font-medium text-foreground">{layer.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${layer.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${layer.level}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* Elemental Balance */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Waves className="w-5 h-5 text-hgi-emerald" />
                Elemental Balance
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {elementalBalance.map((elem, index) => (
                <motion.div
                  key={elem.element}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                >
                  <elem.icon className={`w-6 h-6 ${elem.color} mx-auto mb-2`} />
                  <p className={`text-lg font-bold ${elem.color}`}>{elem.value}%</p>
                  <p className="text-xs text-muted-foreground">{elem.element}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{elem.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* Daily Rhythm */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sun className="w-5 h-5 text-hgi-gold" />
                Daily Rhythm
              </h2>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <Sun className="w-8 h-8 text-hgi-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Dawn</p>
                <p className="text-xs text-emerald-400">+12%</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <Zap className="w-8 h-8 text-hgi-blue mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Peak</p>
                <p className="text-xs text-hgi-blue">Active</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <Moon className="w-8 h-8 text-hgi-violet mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Rest</p>
                <p className="text-xs text-muted-foreground">-8%</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Neural Pulse Animation */}
      <NeuralPulse />
    </div>
  )
}
