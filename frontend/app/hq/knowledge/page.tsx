"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Brain,
  Database,
  Search,
  Filter,
  Plus,
  FileText,
  Video,
  Image as ImageIcon,
  Code,
  Link2,
  Star,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Folder,
  Tag,
  Eye,
  Download,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react"
import {
  GlassPanel,
  StatusIndicator,
  MetricCard,
  NeuralPulse,
  HolographicBorder,
} from "@/components/hgi/design-system"

const knowledgeStats = [
  { label: "Total Documents", value: "147.8K", change: "+2.4K", icon: FileText },
  { label: "Active Models", value: "89", change: "+12", icon: Brain },
  { label: "Knowledge Graphs", value: "34", change: "+3", icon: Layers },
  { label: "API Queries/Day", value: "2.1M", change: "+18%", icon: Zap },
]

const categories = [
  { name: "Technical Docs", count: 45234, icon: Code, color: "text-hgi-blue" },
  { name: "Research Papers", count: 23456, icon: BookOpen, color: "text-hgi-violet" },
  { name: "Case Studies", count: 12345, icon: FileText, color: "text-hgi-emerald" },
  { name: "Media Assets", count: 34567, icon: ImageIcon, color: "text-hgi-gold" },
  { name: "Training Data", count: 32198, icon: Database, color: "text-red-400" },
]

const recentDocuments = [
  {
    id: 1,
    title: "SARATHI Core Architecture v3.2",
    type: "Technical",
    author: "System",
    views: 1247,
    updated: "2h ago",
    starred: true,
  },
  {
    id: 2,
    title: "Agent Swarm Optimization Patterns",
    type: "Research",
    author: "AI Team",
    views: 892,
    updated: "4h ago",
    starred: true,
  },
  {
    id: 3,
    title: "Quantum-Safe Encryption Implementation",
    type: "Security",
    author: "SecOps",
    views: 567,
    updated: "6h ago",
    starred: false,
  },
  {
    id: 4,
    title: "Multi-Modal LLM Integration Guide",
    type: "Technical",
    author: "ML Team",
    views: 2341,
    updated: "8h ago",
    starred: true,
  },
  {
    id: 5,
    title: "Governance Framework 2024",
    type: "Policy",
    author: "Legal",
    views: 445,
    updated: "12h ago",
    starred: false,
  },
]

const knowledgeGraphs = [
  {
    name: "Agent Capabilities",
    nodes: 12847,
    edges: 89234,
    accuracy: 98.7,
    status: "active",
  },
  {
    name: "Market Intelligence",
    nodes: 45123,
    edges: 234567,
    accuracy: 97.2,
    status: "active",
  },
  {
    name: "Technical Dependencies",
    nodes: 8934,
    edges: 45678,
    accuracy: 99.1,
    status: "active",
  },
  {
    name: "User Behavior Patterns",
    nodes: 23456,
    edges: 123456,
    accuracy: 96.8,
    status: "training",
  },
]

const aiModels = [
  { name: "SARATHI-CORE-7B", type: "Foundation", status: "active", accuracy: 94.2, latency: "45ms" },
  { name: "AGENT-REASON-3B", type: "Reasoning", status: "active", accuracy: 92.8, latency: "23ms" },
  { name: "VISION-MULTI-2B", type: "Multi-Modal", status: "active", accuracy: 91.5, latency: "67ms" },
  { name: "CODE-GEN-5B", type: "Code", status: "training", accuracy: 89.3, latency: "34ms" },
]

export default function KnowledgeVaultPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-hgi-violet/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-hgi-violet" />
            </div>
            Knowledge Vault
          </h1>
          <p className="text-muted-foreground mt-1">Centralized intelligence repository and AI model management</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            className="px-4 py-2 rounded-lg bg-hgi-violet/20 text-hgi-violet border border-hgi-violet/30 font-medium flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </motion.button>
          <motion.button
            className="px-4 py-2 rounded-lg bg-hgi-blue/20 text-hgi-blue border border-hgi-blue/30 font-medium flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            AI Search
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <GlassPanel className="!p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents, models, knowledge graphs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hgi-blue/50"
            />
          </div>
          <button className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {knowledgeStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassPanel className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-hgi-blue" />
                <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="col-span-3">
          <GlassPanel>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-hgi-gold" />
              Categories
            </h2>

            <div className="space-y-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    selectedCategory === category.name
                      ? "bg-white/10 border border-hgi-blue/50"
                      : "bg-white/5 border border-transparent hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    <span className="text-sm text-foreground">{category.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{category.count.toLocaleString()}</span>
                </motion.button>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {["AI", "Security", "API", "Agents", "ML", "Data", "Docs", "Guide"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded bg-white/5 text-muted-foreground hover:bg-white/10 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Center - Documents */}
        <div className="col-span-5">
          <GlassPanel>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-hgi-blue" />
                Recent Documents
              </h2>
              <button className="text-sm text-hgi-blue hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground group-hover:text-hgi-blue transition-colors">
                          {doc.title}
                        </h3>
                        {doc.starred && <Star className="w-4 h-4 text-hgi-gold fill-hgi-gold" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-white/10">{doc.type}</span>
                        <span>by {doc.author}</span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {doc.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {doc.updated}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Download className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          {/* Knowledge Graphs */}
          <GlassPanel>
            <HolographicBorder />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-hgi-emerald" />
                Knowledge Graphs
              </h2>
            </div>

            <div className="space-y-3">
              {knowledgeGraphs.map((graph, index) => (
                <motion.div
                  key={graph.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{graph.name}</span>
                    <StatusIndicator
                      status={graph.status === "active" ? "success" : "warning"}
                      label={graph.status}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Nodes</span>
                      <p className="text-foreground font-mono">{graph.nodes.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Edges</span>
                      <p className="text-foreground font-mono">{graph.edges.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy</span>
                      <p className="text-emerald-400 font-mono">{graph.accuracy}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          {/* AI Models */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-hgi-violet" />
                AI Models
              </h2>
            </div>

            <div className="space-y-3">
              {aiModels.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono text-sm text-foreground">{model.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({model.type})</span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        model.status === "active" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Accuracy: <span className="text-emerald-400">{model.accuracy}%</span></span>
                    <span>Latency: <span className="text-hgi-blue">{model.latency}</span></span>
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
