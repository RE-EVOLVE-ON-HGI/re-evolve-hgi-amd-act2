"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Cpu,
  Network,
  Activity,
  Zap,
  Server,
  GitBranch,
  Layers,
  Binary,
  Workflow,
  CircuitBoard,
  Sparkles,
  TrendingUp,
  Eye,
  Shield,
  RefreshCw,
  Play,
  Pause,
  Settings,
} from "lucide-react"
import {
  GlassPanel,
  TelemetryCard,
  HolographicBorder,
} from "@/components/hgi/design-system"

const neuralMetrics = [
  { label: "Neural Throughput", value: "2.4M", unit: "ops/s", status: "nominal" as const, icon: Zap },
  { label: "Active Synapses", value: "847K", unit: "connections", status: "nominal" as const, icon: Network },
  { label: "Processing Cores", value: "128", unit: "units", status: "nominal" as const, icon: Cpu },
  { label: "Memory Utilization", value: "67.4", unit: "%", status: "nominal" as const, icon: Server },
]

const neuralLayers = [
  { name: "Input Layer", nodes: 1024, active: 892, latency: "2ms", status: "active" },
  { name: "Hidden Layer 1", nodes: 2048, active: 1847, latency: "4ms", status: "active" },
  { name: "Hidden Layer 2", nodes: 4096, active: 3921, latency: "6ms", status: "active" },
  { name: "Hidden Layer 3", nodes: 2048, active: 1956, latency: "4ms", status: "active" },
  { name: "Attention Layer", nodes: 1024, active: 1024, latency: "8ms", status: "active" },
  { name: "Output Layer", nodes: 512, active: 489, latency: "2ms", status: "active" },
]

const processingPipelines = [
  { id: 1, name: "Language Processing", load: 78, tasks: 1247, status: "running" },
  { id: 2, name: "Vision Analysis", load: 45, tasks: 834, status: "running" },
  { id: 3, name: "Reasoning Engine", load: 92, tasks: 2341, status: "running" },
  { id: 4, name: "Memory Integration", load: 34, tasks: 456, status: "running" },
  { id: 5, name: "Action Planning", load: 56, tasks: 923, status: "running" },
]

const modelVersions = [
  { version: "v3.2.1", type: "Production", accuracy: 98.7, deployed: "2h ago" },
  { version: "v3.2.0", type: "Stable", accuracy: 98.2, deployed: "3d ago" },
  { version: "v3.1.9", type: "Previous", accuracy: 97.8, deployed: "1w ago" },
]

const recentInferences = [
  { id: 1, type: "Text Generation", tokens: 2847, latency: "45ms", confidence: 97.2 },
  { id: 2, type: "Classification", tokens: 128, latency: "12ms", confidence: 99.1 },
  { id: 3, type: "Embedding", tokens: 512, latency: "8ms", confidence: 100 },
  { id: 4, type: "Reasoning", tokens: 4096, latency: "234ms", confidence: 94.7 },
  { id: 5, type: "Code Analysis", tokens: 1024, latency: "67ms", confidence: 96.3 },
]

export default function NeuralCorePage() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-hgi-blue/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-hgi-blue" />
            </div>
            Neural Core
          </h1>
          <p className="text-muted-foreground mt-1">Deep learning infrastructure and model management</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setIsProcessing(!isProcessing)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isProcessing
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isProcessing ? "Processing Active" : "Processing Paused"}
          </motion.button>

          <motion.button
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-4 h-4" />
            Configure
          </motion.button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {neuralMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TelemetryCard
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              icon={metric.icon}
              trend={metric.status === "nominal" ? "up" : "down"}
              trendValue="+2.4%"
            />
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Neural Architecture Visualization */}
        <div className="col-span-5">
          <GlassPanel className="h-full">
            <HolographicBorder />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-hgi-blue" />
                Neural Architecture
              </h2>
              <span className="text-xs text-muted-foreground">Transformer-XL</span>
            </div>

            {/* Layer Visualization */}
            <div className="space-y-3 mb-6">
              {neuralLayers.map((layer, index) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedLayer(selectedLayer === layer.name ? null : layer.name)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedLayer === layer.name
                      ? "bg-hgi-blue/10 border-hgi-blue/50"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isProcessing ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                        }`}
                      />
                      <span className="font-medium text-foreground">{layer.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{layer.latency}</span>
                  </div>

                  {/* Progress bar showing active nodes */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-hgi-blue to-hgi-violet rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(layer.active / layer.nodes) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {layer.active}/{layer.nodes}
                    </span>
                  </div>

                  <AnimatePresence>
                    {selectedLayer === layer.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <span className="text-muted-foreground">Activation</span>
                          <p className="text-foreground font-medium">ReLU</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dropout</span>
                          <p className="text-foreground font-medium">0.1</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gradient</span>
                          <p className="text-emerald-400 font-medium">Stable</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Connection Visualization */}
            <div className="relative h-20 overflow-hidden rounded-lg bg-white/5">
              {/* Animated neural connections */}
              <svg className="absolute inset-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1={`${5 + (i % 5) * 20}%`}
                    y1="0"
                    x2={`${15 + ((i + 2) % 5) * 20}%`}
                    y2="100%"
                    stroke={isProcessing ? "#5B8CFF" : "#ffffff20"}
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isProcessing ? [0, 1, 0] : 1,
                      opacity: isProcessing ? [0.2, 0.6, 0.2] : 0.2,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: isProcessing ? Infinity : 0,
                    }}
                  />
                ))}
              </svg>

              {/* Nodes */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${
                    isProcessing ? "bg-hgi-blue" : "bg-white/30"
                  }`}
                  style={{
                    left: `${10 + (i % 5) * 20}%`,
                    top: i < 5 ? "10%" : "80%",
                  }}
                  animate={
                    isProcessing
                      ? {
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Processing Pipelines */}
        <div className="col-span-4">
          <GlassPanel className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Workflow className="w-5 h-5 text-hgi-violet" />
                Processing Pipelines
              </h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {processingPipelines.filter((p) => p.status === "running").length} active
              </span>
            </div>

            <div className="space-y-4">
              {processingPipelines.map((pipeline, index) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          pipeline.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                        }`}
                      />
                      <span className="font-medium text-foreground">{pipeline.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pipeline.tasks.toLocaleString()} tasks</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          pipeline.load > 80
                            ? "bg-gradient-to-r from-amber-500 to-red-500"
                            : "bg-gradient-to-r from-emerald-500 to-hgi-blue"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pipeline.load}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span
                      className={`text-sm font-mono ${
                        pipeline.load > 80 ? "text-amber-400" : "text-foreground"
                      }`}
                    >
                      {pipeline.load}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {/* Model Versions */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-hgi-emerald" />
                Model Versions
              </h2>
            </div>

            <div className="space-y-3">
              {modelVersions.map((model, index) => (
                <motion.div
                  key={model.version}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    model.type === "Production"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-foreground">{model.version}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        model.type === "Production"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {model.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Accuracy: <span className="text-emerald-400">{model.accuracy}%</span></span>
                    <span>{model.deployed}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* Recent Inferences */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Binary className="w-5 h-5 text-hgi-gold" />
                Recent Inferences
              </h2>
            </div>

            <div className="space-y-2">
              {recentInferences.map((inference, index) => (
                <motion.div
                  key={inference.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 rounded bg-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm text-foreground">{inference.type}</span>
                    <span className="text-xs text-muted-foreground ml-2">{inference.tokens} tokens</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{inference.latency}</span>
                    <span className="text-emerald-400">{inference.confidence}%</span>
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
