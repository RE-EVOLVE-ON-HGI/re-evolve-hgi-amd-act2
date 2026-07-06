"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Bot,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Zap,
  Shield,
  Brain,
  Activity,
  Settings,
  Trash2,
  Copy,
  Play,
  Pause,
  Code,
  Database,
  MessageSquare,
  Eye,
  Layers,
  Network,
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, HolographicBorder } from '@/components/hgi/design-system'

interface AgentBlueprint {
  id: string
  name: string
  type: 'analysis' | 'generation' | 'coordination' | 'security' | 'custom'
  description: string
  capabilities: string[]
  status: 'deployed' | 'draft' | 'testing'
  instances: number
  performance: number
  lastModified: string
}

const agentBlueprints: AgentBlueprint[] = [
  {
    id: 'BP-001',
    name: 'Market Intelligence Analyst',
    type: 'analysis',
    description: 'Real-time market data analysis and trend prediction',
    capabilities: ['Data Analysis', 'Trend Prediction', 'Report Generation'],
    status: 'deployed',
    instances: 12,
    performance: 98.2,
    lastModified: '2 hours ago',
  },
  {
    id: 'BP-002',
    name: 'Content Generation Engine',
    type: 'generation',
    description: 'Multi-modal content creation and optimization',
    capabilities: ['Text Generation', 'Image Analysis', 'SEO Optimization'],
    status: 'deployed',
    instances: 8,
    performance: 94.7,
    lastModified: '1 day ago',
  },
  {
    id: 'BP-003',
    name: 'Security Sentinel',
    type: 'security',
    description: 'Threat detection and compliance monitoring',
    capabilities: ['Threat Detection', 'Compliance Check', 'Incident Response'],
    status: 'deployed',
    instances: 5,
    performance: 99.9,
    lastModified: '3 hours ago',
  },
  {
    id: 'BP-004',
    name: 'Workflow Orchestrator',
    type: 'coordination',
    description: 'Multi-agent task coordination and optimization',
    capabilities: ['Task Routing', 'Load Balancing', 'Priority Management'],
    status: 'testing',
    instances: 2,
    performance: 96.1,
    lastModified: '5 hours ago',
  },
  {
    id: 'BP-005',
    name: 'Custom Research Agent',
    type: 'custom',
    description: 'Domain-specific research and data synthesis',
    capabilities: ['Web Research', 'Data Synthesis', 'Citation Management'],
    status: 'draft',
    instances: 0,
    performance: 0,
    lastModified: '1 week ago',
  },
]

const agentCapabilities = [
  { name: 'Natural Language', icon: MessageSquare, color: 'blue' },
  { name: 'Data Analysis', icon: Database, color: 'violet' },
  { name: 'Code Generation', icon: Code, color: 'emerald' },
  { name: 'Vision', icon: Eye, color: 'gold' },
  { name: 'Reasoning', icon: Brain, color: 'blue' },
  { name: 'Coordination', icon: Network, color: 'violet' },
]

function AgentCard({ blueprint }: { blueprint: AgentBlueprint }) {
  const typeColors = {
    analysis: 'from-primary to-primary/50',
    generation: 'from-secondary to-secondary/50',
    coordination: 'from-[oklch(0.78_0.16_85)] to-[oklch(0.78_0.16_85_/_0.5)]',
    security: 'from-destructive to-destructive/50',
    custom: 'from-accent to-accent/50',
  }
  
  const typeIcons = {
    analysis: Activity,
    generation: Zap,
    coordination: Network,
    security: Shield,
    custom: Layers,
  }
  
  const Icon = typeIcons[blueprint.type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <GlassPanel className="p-6 h-full transition-all hover:border-primary/30">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[blueprint.type]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge 
              status={
                blueprint.status === 'deployed' ? 'online' :
                blueprint.status === 'testing' ? 'syncing' : 'standby'
              } 
              label={blueprint.status.toUpperCase()}
            />
          </div>
        </div>
        
        <h3 className="font-semibold mb-1">{blueprint.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{blueprint.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {blueprint.capabilities.map((cap) => (
            <span 
              key={cap}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
            >
              {cap}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              {blueprint.instances} instances
            </span>
            {blueprint.performance > 0 && (
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {blueprint.performance}%
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded hover:bg-muted/50 transition-colors">
              <Settings className="w-3 h-3 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted/50 transition-colors">
              <Copy className="w-3 h-3 text-muted-foreground" />
            </button>
            {blueprint.status === 'deployed' ? (
              <button className="p-1.5 rounded hover:bg-muted/50 transition-colors">
                <Pause className="w-3 h-3 text-muted-foreground" />
              </button>
            ) : (
              <button className="p-1.5 rounded hover:bg-primary/20 transition-colors">
                <Play className="w-3 h-3 text-primary" />
              </button>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}

export default function AgentFoundryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  
  const filteredBlueprints = agentBlueprints.filter((bp) => {
    const matchesSearch = bp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterType || bp.type === filterType
    return matchesSearch && matchesFilter
  })
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Agent Foundry</h1>
            <p className="text-muted-foreground text-sm">AI agent generation and consciousness blueprint systems</p>
          </div>
        </div>
        <CommandButton variant="primary" glow>
          <Plus className="w-4 h-4 mr-2" />
          New Agent Blueprint
        </CommandButton>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          label="Total Blueprints"
          value={agentBlueprints.length}
          status="nominal"
        />
        <TelemetryCard
          label="Deployed Agents"
          value="27"
          status="nominal"
          trend="up"
          trendValue="+3 this week"
        />
        <TelemetryCard
          label="Avg Performance"
          value="97.2"
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Active Instances"
          value="247"
          status="nominal"
        />
      </div>
      
      {/* Capabilities */}
      <GlassPanel className="p-6">
        <h3 className="font-semibold mb-4">Available Capabilities</h3>
        <div className="flex flex-wrap gap-3">
          {agentCapabilities.map((cap) => (
            <motion.div
              key={cap.name}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                cap.color === 'blue' ? 'bg-primary/20 hover:bg-primary/30' :
                cap.color === 'violet' ? 'bg-secondary/20 hover:bg-secondary/30' :
                cap.color === 'emerald' ? 'bg-accent/20 hover:bg-accent/30' :
                'bg-[oklch(0.78_0.16_85_/_0.2)] hover:bg-[oklch(0.78_0.16_85_/_0.3)]'
              }`}
            >
              <cap.icon className={`w-4 h-4 ${
                cap.color === 'blue' ? 'text-primary' :
                cap.color === 'violet' ? 'text-secondary' :
                cap.color === 'emerald' ? 'text-accent' :
                'text-[oklch(0.78_0.16_85)]'
              }`} />
              <span className="text-sm font-medium">{cap.name}</span>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
      
      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blueprints..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/20 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['analysis', 'generation', 'coordination', 'security', 'custom'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterType === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Blueprint Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlueprints.map((blueprint, i) => (
          <AgentCard key={blueprint.id} blueprint={blueprint} />
        ))}
        
        {/* Create New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
        >
          <HolographicBorder className="h-full">
            <div className="h-full p-6 flex flex-col items-center justify-center text-center cursor-pointer group bg-background rounded-lg">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
              <h3 className="font-semibold mb-1">Create New Blueprint</h3>
              <p className="text-sm text-muted-foreground">Design a custom AI agent</p>
            </div>
          </HolographicBorder>
        </motion.div>
      </div>
      
      {/* Evolution Matrix Preview */}
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Agent Evolution Matrix</h3>
            <p className="text-xs text-muted-foreground font-mono">CAPABILITY PROGRESSION TRACKING</p>
          </div>
          <CommandButton variant="ghost" size="sm">
            View Full Matrix
            <ChevronRight className="w-3 h-3 ml-1" />
          </CommandButton>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          {['Genesis', 'Learning', 'Specialization', 'Mastery'].map((stage, i) => (
            <div 
              key={stage}
              className={`p-4 rounded-lg border ${
                i === 0 ? 'border-muted-foreground/30 bg-muted/10' :
                i === 1 ? 'border-primary/30 bg-primary/10' :
                i === 2 ? 'border-secondary/30 bg-secondary/10' :
                'border-accent/30 bg-accent/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{stage}</span>
                <span className="text-xs font-mono text-muted-foreground">Stage {i + 1}</span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {i === 0 ? '12' : i === 1 ? '8' : i === 2 ? '5' : '2'}
              </p>
              <p className="text-xs text-muted-foreground">agents</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
