"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Orbit, 
  Bot, 
  Cpu, 
  Activity, 
  MessageSquare, 
  Heart, 
  Clock, 
  Layers, 
  Settings, 
  HelpCircle,
  TrendingUp,
  Brain
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, DataStream, HolographicBorder } from '@/components/hgi/design-system'

interface GalaxyAgent {
  id: string
  name: string
  avatar: string
  status: 'active' | 'thinking' | 'idle' | 'error'
  task: string
  memory: string
  load: number
  cpuTime: string
  queueSize: number
  messagesCount: number
  health: number
  recentActions: string[]
  coords: { x: number; y: number }
}

const INITIAL_AGENTS: GalaxyAgent[] = [
  {
    id: 'AGT-001',
    name: 'Orchestrator-Prime',
    avatar: 'OP',
    status: 'active',
    task: 'Coordinating support system coding task',
    memory: 'Context bound to support workflow v1.2',
    load: 42,
    cpuTime: '124.5s',
    queueSize: 0,
    messagesCount: 1482,
    health: 100,
    recentActions: ['Created dynamic Task DAG', 'Routed workflow task to CodeSynth', 'Initiated compliance policy evaluation'],
    coords: { x: 300, y: 250 } // Center node
  },
  {
    id: 'AGT-002',
    name: 'ResearchAgent-Alpha',
    avatar: 'RA',
    status: 'idle',
    task: 'None (listening)',
    memory: 'Last search: support tickets layouts',
    load: 0,
    cpuTime: '82.1s',
    queueSize: 0,
    messagesCount: 521,
    health: 99.4,
    recentActions: ['Scanned web docs for routing policies', 'Delivered semantic context keys to Memory Vault'],
    coords: { x: 150, y: 120 }
  },
  {
    id: 'AGT-003',
    name: 'CodeSynth-v2.3',
    avatar: 'CS',
    status: 'thinking',
    task: 'Writing React dashboard views and routing controllers',
    memory: 'Panani compiler context scope active',
    load: 85,
    cpuTime: '482.7s',
    queueSize: 2,
    messagesCount: 2391,
    health: 100,
    recentActions: ['Compiled Python API models', 'Passed linter check', 'Writing React views'],
    coords: { x: 450, y: 120 }
  },
  {
    id: 'AGT-004',
    name: 'QATester-Agent',
    avatar: 'QA',
    status: 'idle',
    task: 'None (listening)',
    memory: 'Harness validation schema: PASS',
    load: 0,
    cpuTime: '23.4s',
    queueSize: 0,
    messagesCount: 129,
    health: 98.8,
    recentActions: ['Executed test suite with 14 assertions', 'Reported zero compilation errors'],
    coords: { x: 150, y: 380 }
  },
  {
    id: 'AGT-005',
    name: 'KavachaAudit-Core',
    avatar: 'KA',
    status: 'active',
    task: 'Evaluating security policies on sandbox code',
    memory: 'Active policy schema: strict_compliance',
    load: 28,
    cpuTime: '52.9s',
    queueSize: 1,
    messagesCount: 892,
    health: 100,
    recentActions: ['Logged transaction ledger for compliance', 'Scanned code for unauthorized connections'],
    coords: { x: 450, y: 380 }
  }
]

export default function AgentGalaxyPage() {
  const [agents, setAgents] = useState<GalaxyAgent[]>(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<GalaxyAgent | null>(INITIAL_AGENTS[0])
  const [activePulse, setActivePulse] = useState<{ from: string; to: string } | null>(null)

  // Simulation: communication pulses & activity status shifts
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random sender and receiver for messaging animation (Phase 7)
      const sender = agents[Math.floor(Math.random() * agents.length)]
      let receiver = agents[Math.floor(Math.random() * agents.length)]
      while (receiver.id === sender.id) {
        receiver = agents[Math.floor(Math.random() * agents.length)]
      }

      setActivePulse({ from: sender.id, to: receiver.id })

      // Update sender messages count and load slightly
      setAgents(prev => prev.map(a => {
        if (a.id === sender.id) {
          return {
            ...a,
            messagesCount: a.messagesCount + 1,
            load: Math.min(100, Math.max(10, a.load + Math.floor(Math.random() * 15) - 7))
          }
        }
        return a
      }))

      // Clear pulse after animation
      setTimeout(() => {
        setActivePulse(null)
      }, 1500)

    }, 3000)

    return () => clearInterval(interval)
  }, [agents])

  const senderNode = agents.find(a => a.id === activePulse?.from)
  const receiverNode = agents.find(a => a.id === activePulse?.to)

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Orbit className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ecosystem Agent Galaxy</h1>
            <p className="text-muted-foreground text-sm">Constellation map of active agents and inter-agent communication channels</p>
          </div>
        </div>
        <StatusBadge status="online" label="GALAXY TOPOLOGY LIVE" />
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          label="Total Specialist Nodes"
          value="5"
          status="nominal"
        />
        <TelemetryCard
          label="Average CPU Load"
          value={`${Math.floor(agents.reduce((acc, curr) => acc + curr.load, 0) / agents.length)}%`}
          status="nominal"
        />
        <TelemetryCard
          label="Total Messages Exchanged"
          value={agents.reduce((acc, curr) => acc + curr.messagesCount, 0).toLocaleString()}
          status="nominal"
        />
        <TelemetryCard
          label="Average Health Score"
          value="99.6%"
          status="nominal"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Agent Galaxy Constellation Map (Phase 7) */}
        <GlassPanel className="lg:col-span-8 p-6 flex flex-col h-[550px] relative">
          <h3 className="font-semibold text-sm mb-2">Interstellar Network Topology</h3>
          <p className="text-xs text-muted-foreground font-mono mb-4">CLICK NODES TO INSPECT CONSCIOUSNESS SPECS</p>
          
          <div className="flex-1 bg-black/40 rounded-lg relative overflow-hidden flex items-center justify-center">
            
            {/* SVG Link lines and pulses */}
            <svg className="w-full h-full absolute inset-0" style={{ pointerEvents: 'none' }}>
              <defs>
                <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 165)" stopOpacity="1" />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 165)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Render linking lines */}
              {agents.map((agent) => {
                if (agent.id === 'AGT-001') return null // skip linking to self
                return (
                  <line
                    key={`line-${agent.id}`}
                    x1="300" y1="250"
                    x2={agent.coords.x} y2={agent.coords.y}
                    stroke="#222"
                    strokeWidth="1.5"
                  />
                )
              })}

              {/* Animated communication pulse (Phase 7) */}
              {senderNode && receiverNode && (
                <motion.circle
                  r="6"
                  fill="url(#pulseGlow)"
                  initial={{ cx: senderNode.coords.x, cy: senderNode.coords.y }}
                  animate={{ cx: receiverNode.coords.x, cy: receiverNode.coords.y }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              )}
            </svg>

            {/* Render Agent Nodes */}
            {agents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id
              const isSending = activePulse?.from === agent.id
              const isReceiving = activePulse?.to === agent.id

              return (
                <motion.div
                  key={agent.id}
                  className="absolute cursor-pointer flex flex-col items-center z-10"
                  style={{ left: agent.coords.x - 32, top: agent.coords.y - 32 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className={`w-16 h-16 rounded-full bg-slate-900 border flex items-center justify-center relative transition-all ${
                    isSelected ? 'border-primary shadow-[0_0_15px_oklch(0.65_0.18_250_/_0.4)]' :
                    isSending ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' :
                    isReceiving ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]' :
                    'border-white/10'
                  }`}>
                    <span className="font-bold text-sm font-mono text-foreground">{agent.avatar}</span>
                    
                    {/* Status Dot */}
                    <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      agent.status === 'active' ? 'bg-emerald-400' :
                      agent.status === 'thinking' ? 'bg-primary animate-pulse' :
                      agent.status === 'idle' ? 'bg-slate-500' : 'bg-destructive'
                    }`} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground mt-2 font-bold tracking-tight bg-black/60 px-1.5 py-0.5 rounded border border-border/20">
                    {agent.name}
                  </span>
                </motion.div>
              )
            })}

          </div>
        </GlassPanel>

        {/* Selected Agent Consciousness Inspector */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel className="p-6 h-[550px] flex flex-col">
            <h3 className="font-semibold text-sm mb-4">Agent Consciousness Inspector</h3>
            {selectedAgent ? (
              <div className="flex-1 flex flex-col justify-between font-mono text-xs">
                
                {/* Agent Header Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/10 rounded border border-border/40">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-primary flex items-center justify-center font-bold font-mono text-foreground">
                      {selectedAgent.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{selectedAgent.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{selectedAgent.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-muted/5 rounded border border-border/30">
                      <span className="text-muted-foreground block">STATUS</span>
                      <span className="text-foreground font-bold uppercase">{selectedAgent.status}</span>
                    </div>
                    <div className="p-2 bg-muted/5 rounded border border-border/30">
                      <span className="text-muted-foreground block">HEALTH LEVEL</span>
                      <span className="text-emerald-400 font-bold">{selectedAgent.health}%</span>
                    </div>
                    <div className="p-2 bg-muted/5 rounded border border-border/30">
                      <span className="text-muted-foreground block">ACTIVE LOAD</span>
                      <span className="text-foreground font-bold">{selectedAgent.load}%</span>
                    </div>
                    <div className="p-2 bg-muted/5 rounded border border-border/30">
                      <span className="text-muted-foreground block">CPU TIME</span>
                      <span className="text-foreground font-bold">{selectedAgent.cpuTime}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">Active Task Binding</span>
                    <p className="text-foreground leading-relaxed text-[11px] bg-black/30 p-2 rounded border border-border/20">
                      {selectedAgent.task}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">Memory Context</span>
                    <p className="text-foreground leading-relaxed text-[11px] bg-black/30 p-2 rounded border border-border/20">
                      {selectedAgent.memory}
                    </p>
                  </div>
                </div>

                {/* Recent Actions List */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <span className="text-muted-foreground block text-[9px] uppercase mb-2">Recent Execution Trace</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedAgent.recentActions.map((action, idx) => (
                      <div key={idx} className="flex gap-2 text-[10px] items-start">
                        <span className="text-primary mt-0.5">➔</span>
                        <p className="text-foreground/80">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground font-mono text-xs">
                <p>Click any agent node in the constellation map to inspect its telemetry.</p>
              </div>
            )}
          </GlassPanel>
        </div>

      </div>
    </div>
  )
}
