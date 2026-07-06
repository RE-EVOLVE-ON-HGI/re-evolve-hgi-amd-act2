"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Search, 
  Database, 
  GitGraph, 
  Layers, 
  Clock, 
  Activity, 
  Filter, 
  HelpCircle,
  TrendingUp,
  Sliders,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, DataStream, HolographicBorder } from '@/components/hgi/design-system'

interface MemoryRecord {
  id: string
  content: string
  importance: number
  similarity?: number
  created: string
  tags: string[]
  type: 'episodic' | 'semantic' | 'system'
}

const INITIAL_MEMORIES: MemoryRecord[] = [
  { id: 'MEM-482', content: 'Compliance threshold set to Strict for ARTOIES vertical operations.', importance: 9, created: '2 mins ago', tags: ['governance', 'artoies'], type: 'semantic' },
  { id: 'MEM-483', content: 'Successfully compiled Python controllers inside Panani container sandbox.', importance: 8, created: '5 mins ago', tags: ['workflow', 'sandbox'], type: 'episodic' },
  { id: 'MEM-484', content: 'User dispatched task: "Build an AI customer support workflow with risk evaluation".', importance: 10, created: '12 mins ago', tags: ['input', 'orchestration'], type: 'episodic' },
  { id: 'MEM-485', content: 'Fallback protocol initialized from Fireworks AI to AMD Instinct Developer Cloud.', importance: 7, created: '20 mins ago', tags: ['infrastructure', 'failover'], type: 'system' },
  { id: 'MEM-486', content: 'Token count budget warning: vertical AHERMESon approaching MRR usage limit.', importance: 6, created: '1 hour ago', tags: ['finance', 'budget'], type: 'system' },
  { id: 'MEM-487', content: 'Semantic memory indexing complete on Qdrant core server nodes.', importance: 5, created: '3 hours ago', tags: ['maintenance', 'qdrant'], type: 'semantic' },
]

export default function MemoryExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [memories, setMemories] = useState<MemoryRecord[]>(INITIAL_MEMORIES)
  const [selectedMemory, setSelectedMemory] = useState<MemoryRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'semantic' | 'episodic' | 'system'>('all')
  const [isSearching, setIsSearching] = useState(false)

  // Similarity search simulation
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setMemories(INITIAL_MEMORIES)
      return
    }
    setIsSearching(true)

    setTimeout(() => {
      // Simulate vector matches
      const matches: MemoryRecord[] = INITIAL_MEMORIES.map(m => {
        // Calculate a fake similarity score based on query text match
        const hasWord = m.tags.some(t => searchQuery.toLowerCase().includes(t)) ||
                        m.content.toLowerCase().includes(searchQuery.toLowerCase())
        const sim = hasWord ? Number((0.85 + Math.random() * 0.14).toFixed(3)) : Number((0.3 + Math.random() * 0.2).toFixed(3))
        return { ...m, similarity: sim }
      }).sort((a, b) => (b.similarity || 0) - (a.similarity || 0))

      setMemories(matches)
      setIsSearching(false)
    }, 800)
  }

  const filteredMemories = memories.filter(m => activeTab === 'all' || m.type === activeTab)

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Memory Vault Explorer</h1>
            <p className="text-muted-foreground text-sm">Query semantic vector databases and browse episodic trace contexts</p>
          </div>
        </div>
        <StatusBadge status="online" label="VAULT SYNCHRONIZED" />
      </div>

      {/* Telemetry Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          label="Total Memory Dimensions"
          value="1,536"
          unit="floats"
          status="nominal"
        />
        <TelemetryCard
          label="Episodic Records (Postgres)"
          value="18,482"
          status="nominal"
        />
        <TelemetryCard
          label="Semantic Nodes (Qdrant)"
          value="247,381"
          status="nominal"
        />
        <TelemetryCard
          label="Vector Recall Latency"
          value="4.2ms"
          status="nominal"
        />
      </div>

      {/* Vector Search Bar */}
      <GlassPanel className="p-4" glow="blue">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query semantic memory using natural language vector search (e.g. 'compliance checks on code sandbox'...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/20 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-sm"
            />
          </div>
          <CommandButton variant="primary" type="submit" disabled={isSearching}>
            {isSearching ? 'Vectorizing...' : 'Similarity Search'}
          </CommandButton>
        </form>
      </GlassPanel>

      {/* Layout grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Memory List */}
        <div className="lg:col-span-7 space-y-6">
          <GlassPanel className="p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
              <h3 className="font-semibold text-sm">Indexed Memory Logs</h3>
              <div className="flex gap-1">
                {(['all', 'semantic', 'episodic', 'system'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded text-[10px] font-mono uppercase transition-colors ${
                      activeTab === tab ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {filteredMemories.map((m) => (
                <motion.div
                  key={m.id}
                  layoutId={`mem-${m.id}`}
                  onClick={() => setSelectedMemory(m)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedMemory?.id === m.id ? 'bg-primary/10 border-primary shadow-[0_0_10px_oklch(0.65_0.18_250_/_0.15)]' : 'bg-muted/10 border-border/30 hover:bg-muted/20'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        m.type === 'semantic' ? 'bg-primary/20 text-primary border border-primary/20' :
                        m.type === 'episodic' ? 'bg-secondary/20 text-secondary border border-secondary/20' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                      }`}>{m.type}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{m.id}</span>
                    </div>
                    {m.similarity !== undefined ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Similarity: {m.similarity}</span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Importance: <strong className="text-foreground">{m.importance}/10</strong></span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground font-medium">{m.content}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-muted-foreground">
                    <div className="flex gap-1">
                      {m.tags.map(t => <span key={t}>#{t}</span>)}
                    </div>
                    <span>{m.created}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Knowledge Graph Network & Memory Detail */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Knowledge Entity Graph (Phase 5) */}
          <GlassPanel className="p-6 h-[320px] flex flex-col">
            <h3 className="font-semibold text-sm mb-2">Ecosystem Knowledge Entity Graph</h3>
            <p className="text-xs text-muted-foreground font-mono mb-4">SEMANTIC LINKAGES NETWORK</p>
            
            <div className="flex-1 bg-black/40 rounded-lg relative overflow-hidden flex items-center justify-center">
              
              {/* SVG Link lines */}
              <svg className="w-full h-full absolute inset-0" style={{ pointerEvents: 'none' }}>
                <line x1="25%" y1="50%" x2="50%" y2="20%" stroke="#444" strokeWidth="1.5" />
                <line x1="75%" y1="50%" x2="50%" y2="20%" stroke="#444" strokeWidth="1.5" />
                <line x1="50%" y1="80%" x2="25%" y2="50%" stroke="#444" strokeWidth="1.5" />
                <line x1="50%" y1="80%" x2="75%" y2="50%" stroke="#444" strokeWidth="1.5" />
                <line x1="50%" y1="80%" x2="50%" y2="20%" stroke="oklch(0.65 0.18 250)" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {/* Node items */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono text-[9px]">
                
                {/* Node Top: Core concept */}
                <div className="flex justify-center">
                  <div className="p-2 rounded bg-slate-900 border border-primary text-center w-36">
                    <span className="block font-bold text-foreground">HGI_ADAPTIVE_CORE</span>
                    <span className="text-muted-foreground text-[8px]">Concept Parent</span>
                  </div>
                </div>

                {/* Node Center: Specialists */}
                <div className="flex justify-between">
                  <div className="p-2 rounded bg-slate-900 border border-secondary text-center w-28">
                    <span className="block font-bold text-foreground">SARATHI_PLANNER</span>
                    <span className="text-muted-foreground text-[8px]">Agent Node</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-secondary text-center w-28">
                    <span className="block font-bold text-foreground">KAVACHA_SHIELD</span>
                    <span className="text-muted-foreground text-[8px]">Policy Validator</span>
                  </div>
                </div>

                {/* Node Bottom: Targets */}
                <div className="flex justify-center">
                  <div className="p-2 rounded bg-slate-900 border border-emerald-500 text-center w-32">
                    <span className="block font-bold text-foreground">ARTOIES_VERTICAL</span>
                    <span className="text-muted-foreground text-[8px]">Asset Target</span>
                  </div>
                </div>

              </div>

            </div>
          </GlassPanel>

          {/* Memory Inspector Details */}
          <GlassPanel className="p-6 h-[255px]">
            <h3 className="font-semibold text-sm mb-4">Raw Vector Inspector</h3>
            {selectedMemory ? (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">RECORD IDENTIFIER</span>
                  <span className="text-primary font-bold">{selectedMemory.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">RAW CONTENT</span>
                  <p className="text-foreground text-[11px] leading-relaxed bg-black/40 p-2 rounded border border-border/20 max-h-20 overflow-y-auto">
                    {selectedMemory.content}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground block">IMPORTANCE SCORE</span>
                    <span className="text-foreground font-bold">{selectedMemory.importance} / 10</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">DIMENSIONALITY</span>
                    <span className="text-foreground font-bold">1536 Float32</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground font-mono text-xs">
                <p>Select a memory record from the list to inspect vector keys.</p>
              </div>
            )}
          </GlassPanel>

        </div>

      </div>
    </div>
  )
}
