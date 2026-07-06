"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Server, 
  Cpu, 
  Zap, 
  Activity, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle,
  Database,
  ArrowRight,
  Sparkles,
  Terminal,
  ShieldAlert
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, DataStream, HolographicBorder } from '@/components/hgi/design-system'
import { 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  AreaChart, 
  Area 
} from 'recharts'

interface Provider {
  id: string
  name: string
  status: 'nominal' | 'degraded' | 'offline'
  latency: number
  costPerMillion: string
  avgDuration: string
  hardware: string
  isPrimary: boolean
  isFallback: boolean
}

const INITIAL_PROVIDERS: Provider[] = [
  { id: 'fireworks', name: 'Fireworks AI', status: 'nominal', latency: 45, costPerMillion: '$0.80', avgDuration: '1.2s', hardware: 'Nvidia H100 GPU Cluster', isPrimary: true, isFallback: false },
  { id: 'amd-cloud', name: 'AMD AI Developer Cloud', status: 'nominal', latency: 32, costPerMillion: '$0.40', avgDuration: '0.9s', hardware: 'AMD Instinct MI300X', isPrimary: false, isFallback: true },
  { id: 'litellm', name: 'LiteLLM Gateway', status: 'nominal', latency: 52, costPerMillion: '$0.75', avgDuration: '1.4s', hardware: 'Unified Proxy Router', isPrimary: false, isFallback: false },
  { id: 'ollama', name: 'Local Ollama Instance', status: 'nominal', latency: 85, costPerMillion: '$0.00', avgDuration: '2.8s', hardware: 'Local Compute (Ryzen AI)', isPrimary: false, isFallback: false },
]

export default function InfrastructurePage() {
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS)
  const [latencyData, setLatencyData] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      time: `${i + 1}m ago`,
      'Fireworks AI': Math.floor(40 + Math.random() * 10),
      'AMD AI Developer Cloud': Math.floor(30 + Math.random() * 5),
    }))
  )
  const [totalTokens, setTotalTokens] = useState(3847291)
  const [estCost, setEstCost] = useState(3.07)
  const [isFailingOver, setIsFailingOver] = useState(false)
  const [currentCarrier, setCurrentCarrier] = useState<'fireworks' | 'amd-cloud'>('fireworks')
  const [simulationStep, setSimulationStep] = useState<'normal' | 'spike' | 'rerouting' | 'recovered'>('normal')

  // pxpipe Token Compression state
  const [inputText, setInputText] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionResult, setCompressionResult] = useState<any>(null)
  const [hasVerbatimRisk, setHasVerbatimRisk] = useState(false)

  // Presets for the pxpipe compression console
  const loadPreset = (type: 'system' | 'tooldocs' | 'densejson') => {
    if (type === 'system') {
      setInputText(`You are an advanced AI engineering assistant operating within a highly-isolated code execution container.
Your responsibilities cover decomposing developer instructions, compiling task Directed Acyclic Graphs, and invoking governance safety checking pipelines.
Always verify code functionality by running test suites prior to committing any change.
Enforce zero-trust multi-tenant workspace isolation at all times. Current context includes active variables:
ORGANIZATION_ID: "re-evolve"
TENANT_CLASS: "ADMIN"
LEDGER_BALANCE_CENTS: 148290`)
    } else if (type === 'tooldocs') {
      setInputText(`Available tool definitions:
- create_repository(orgId: string, path: string): Creates an isolated file repository on disk.
- execute_tests(orgId: string, testPath: string): Triggers deterministic Mocha/Jest verification runners.
- fetch_web_assets(query: string, domain?: string): Conducts semantic web research.
- read_knowledge_catalog(entryId: string): Fetches catalog schemas from local catalog instance.
- spanner_execute_sql(instanceId: string, databaseId: string, sql: string): Performs read/write Spanner operations.`)
    } else {
      setInputText(`[
  {"id": "TXN-8472", "amount": 142.90, "status": "COMPLETED", "hash": "0b9899852c7443789965"},
  {"id": "TXN-8473", "amount": 520.00, "status": "COMPLETED", "hash": "ecc2a867cc33ae67abf5"},
  {"id": "TXN-8474", "amount": 12.00, "status": "PENDING", "hash": "f4e5013731b5426f83bb"}
]`)
    }
  }

  // Run pxpipe compression simulation
  const handleCompress = () => {
    if (!inputText.trim()) return
    setIsCompressing(true)
    setCompressionResult(null)
    setHasVerbatimRisk(false)

    setTimeout(() => {
      const charCount = inputText.length
      const originalTokens = Math.ceil(charCount / 1.1) // typical dense token ratio
      const compressedTokens = Math.ceil(charCount / 12) + 200 // high pxpipe compression ratio + vision constant
      const ratio = Number(((1 - (compressedTokens / originalTokens)) * 100).toFixed(1))
      
      // Verbatim Risk Guard (Phase 5 check for hex / IDs)
      const hasHex = /[0-9a-fA-F]{8,}/.test(inputText) || /TXN-|JOB-|AGT-/.test(inputText)
      
      setCompressionResult({
        originalChars: charCount,
        originalTokens,
        compressedTokens,
        ratio,
        originalCost: `$${(originalTokens * 0.000015).toFixed(4)}`,
        compressedCost: `$${(compressedTokens * 0.000015).toFixed(4)}`,
        canvasPages: 1
      })
      setHasVerbatimRisk(hasHex)
      setIsCompressing(false)
    }, 1000)
  }

  // Run provider simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationStep === 'normal') {
        // Normal jitter
        setProviders(prev => prev.map(p => {
          if (p.id === 'fireworks') return { ...p, latency: Math.floor(42 + Math.random() * 6) }
          if (p.id === 'amd-cloud') return { ...p, latency: Math.floor(30 + Math.random() * 4) }
          return p
        }))
        setLatencyData(prev => [
          ...prev.slice(1),
          {
            time: 'Now',
            'Fireworks AI': Math.floor(42 + Math.random() * 6),
            'AMD AI Developer Cloud': Math.floor(30 + Math.random() * 4),
          }
        ])
      }
      setTotalTokens(t => t + Math.floor(Math.random() * 200))
      setEstCost(c => Number((c + Math.random() * 0.002).toFixed(4)))
    }, 3000)

    return () => clearInterval(interval)
  }, [simulationStep])

  // Trigger failover simulation (Phase 4)
  const triggerFailoverSim = async () => {
    if (isFailingOver) return
    setIsFailingOver(true)
    setSimulationStep('spike')

    // Step 1: Fireworks latency spikes to 800ms, turns degraded
    setProviders(prev => prev.map(p => 
      p.id === 'fireworks' ? { ...p, latency: 840, status: 'degraded' } : p
    ))
    setLatencyData(prev => [
      ...prev.slice(1),
      {
        time: 'Spike',
        'Fireworks AI': 840,
        'AMD AI Developer Cloud': 31,
      }
    ])
    await delay(2000)

    // Step 2: System detects anomaly, initiates rerouting
    setSimulationStep('rerouting')
    await delay(2500)

    // Step 3: Route successfully shifted to AMD AI Developer Cloud (latency drops, turns green primary)
    setCurrentCarrier('amd-cloud')
    setProviders(prev => prev.map(p => {
      if (p.id === 'fireworks') return { ...p, isPrimary: false, status: 'degraded' }
      if (p.id === 'amd-cloud') return { ...p, isPrimary: true, latency: 28 }
      return p
    }))
    setLatencyData(prev => [
      ...prev.slice(1),
      {
        time: 'Shift',
        'Fireworks AI': 840,
        'AMD AI Developer Cloud': 28,
      }
    ])
    await delay(4000)

    // Step 4: Recover Fireworks to normal status, AMD Cloud remains primary due to performance
    setSimulationStep('recovered')
    setProviders(prev => prev.map(p => 
      p.id === 'fireworks' ? { ...p, latency: 44, status: 'nominal' } : p
    ))
    setLatencyData(prev => [
      ...prev.slice(1),
      {
        time: 'Recovery',
        'Fireworks AI': 44,
        'AMD AI Developer Cloud': 29,
      }
    ])
    setIsFailingOver(false)
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Server className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AMD Infrastructure Matrix</h1>
            <p className="text-muted-foreground text-sm">GPU clusters telemetry, model routing, and automatic failovers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="online" label="INFRASTRUCTURE SYNCED" />
          <CommandButton 
            variant="gold" 
            size="sm"
            onClick={triggerFailoverSim}
            disabled={isFailingOver}
            glow
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFailingOver ? 'animate-spin' : ''}`} />
            Simulate Provider Latency Spike & Failover
          </CommandButton>
        </div>
      </div>

      {/* Telemetry metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          label="Active Provider Carrier"
          value={currentCarrier === 'fireworks' ? 'Fireworks AI' : 'AMD Instinct'}
          status={simulationStep === 'spike' ? 'warning' : 'nominal'}
        />
        <TelemetryCard
          label="Active Router Latency"
          value={`${providers.find(p => p.isPrimary)?.latency ?? 30}ms`}
          status="nominal"
        />
        <TelemetryCard
          label="Token Throughput"
          value={totalTokens.toLocaleString()}
          status="nominal"
        />
        <TelemetryCard
          label="Cumulative Cost"
          value={`$${estCost.toFixed(4)}`}
          status="nominal"
        />
      </div>

      {/* Interactive Anomaly Status Banner */}
      <AnimatePresence>
        {simulationStep !== 'normal' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={`p-4 rounded-lg border font-mono text-xs flex items-center justify-between ${
              simulationStep === 'spike' ? 'bg-destructive/10 border-destructive text-destructive' :
              simulationStep === 'rerouting' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {simulationStep === 'spike' && <span>[EMULATED ANOMALY] DETECTED: Primary provider (Fireworks AI) latency spiked &gt; 800ms!</span>}
                {simulationStep === 'rerouting' && <span>[EMULATED FAILOVER] REROUTING ACTIONS: Shifted primary route to AMD AI Developer Cloud (MI300X). Ingress in progress.</span>}
                {simulationStep === 'recovered' && <span>[EMULATED FAILOVER] FAILOVER STABLE: Route redirected. Primary carrier bound to AMD Instinct cluster.</span>}
              </div>
              <span className="text-[10px]">TIME: {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Visual Failover Network (Phase 4) */}
        <GlassPanel className="lg:col-span-7 p-6 flex flex-col h-[550px] relative">
          <h3 className="font-semibold text-sm mb-2">Live Model Route Topology</h3>
          <p className="text-xs text-muted-foreground font-mono mb-4">REAL-TIME MULTI-PROVIDER HIGH AVAILABILITY</p>
          
          <div className="flex-1 bg-black/40 rounded-lg relative overflow-hidden flex items-center justify-center">
            
            {/* SVG Connector Lines */}
            <svg className="w-full h-full absolute inset-0" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 165)" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              {/* Central Router ➔ Fireworks line */}
              <motion.line
                x1="50%" y1="55%" x2="20%" y2="25%"
                stroke={simulationStep === 'spike' ? '#ef4444' : currentCarrier === 'fireworks' ? 'oklch(0.65 0.18 250)' : '#333'}
                strokeWidth={currentCarrier === 'fireworks' ? '3' : '1'}
                strokeDasharray={currentCarrier === 'fireworks' && simulationStep !== 'spike' ? '5 5' : 'none'}
                animate={currentCarrier === 'fireworks' && simulationStep !== 'spike' ? { strokeDashoffset: [0, -20] } : {}}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />

              {/* Central Router ➔ AMD Instinct line */}
              <motion.line
                x1="50%" y1="55%" x2="80%" y2="25%"
                stroke={currentCarrier === 'amd-cloud' ? 'oklch(0.72 0.18 165)' : '#333'}
                strokeWidth={currentCarrier === 'amd-cloud' ? '3' : '1'}
                strokeDasharray={currentCarrier === 'amd-cloud' ? '5 5' : 'none'}
                animate={currentCarrier === 'amd-cloud' ? { strokeDashoffset: [0, -20] } : {}}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />

              {/* Central Router ➔ LiteLLM line */}
              <line
                x1="50%" y1="55%" x2="20%" y2="75%"
                stroke="#333" strokeWidth="1"
              />

              {/* Central Router ➔ Ollama line */}
              <line
                x1="50%" y1="55%" x2="80%" y2="75%"
                stroke="#333" strokeWidth="1"
              />
            </svg>

            {/* Central Router Node */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <motion.div 
                className="w-16 h-16 rounded-full bg-slate-900 border border-primary flex items-center justify-center shadow-lg shadow-primary/20"
                animate={simulationStep === 'rerouting' ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <RefreshCw className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-[10px] font-mono text-muted-foreground mt-2 uppercase">LiteLLM Router</span>
            </div>

            {/* Provider Nodes */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              
              {/* Row 1: Primary Options */}
              <div className="flex justify-between">
                
                {/* Fireworks Node */}
                <div className={`p-3 rounded-lg border w-44 font-mono text-[10px] bg-black/60 relative ${
                  simulationStep === 'spike' ? 'border-destructive text-destructive' :
                  currentCarrier === 'fireworks' ? 'border-primary text-foreground' : 'border-white/10 text-muted-foreground'
                }`}>
                  <div className="flex justify-between font-bold mb-1">
                    <span>FIREWORKS AI</span>
                    <span className={`w-2 h-2 rounded-full ${simulationStep === 'spike' ? 'bg-destructive animate-ping' : 'bg-emerald-400'}`} />
                  </div>
                  <p>Latency: {simulationStep === 'spike' ? '840ms' : '45ms'}</p>
                  <p>Carrier: {currentCarrier === 'fireworks' ? 'PRIMARY' : 'STANDBY'}</p>
                  <p>Hardware: Nvidia H100</p>
                </div>

                {/* AMD Instinct Node */}
                <div className={`p-3 rounded-lg border w-44 font-mono text-[10px] bg-black/60 relative ${
                  currentCarrier === 'amd-cloud' ? 'border-emerald-500 text-foreground' : 'border-white/10 text-muted-foreground'
                }`}>
                  <div className="flex justify-between font-bold mb-1">
                    <span>AMD INSTINCT MI300X</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p>Latency: 28ms</p>
                  <p>Carrier: {currentCarrier === 'amd-cloud' ? 'PRIMARY' : 'FALLBACK'}</p>
                  <p>Hardware: MI300X GPU</p>
                  {currentCarrier === 'amd-cloud' && (
                    <span className="absolute -top-2 -right-2 text-[8px] bg-emerald-500 text-black px-1 rounded font-bold">ACTIVE ROUTE</span>
                  )}
                </div>

              </div>

              {/* Row 2: Secondary Options */}
              <div className="flex justify-between mt-24">
                
                {/* LiteLLM Node */}
                <div className="p-3 rounded-lg border w-44 font-mono text-[10px] bg-black/60 border-white/10 text-muted-foreground">
                  <div className="flex justify-between font-bold mb-1">
                    <span>LITELLM PROXY</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p>Latency: 52ms</p>
                  <p>Carrier: ROUTER</p>
                  <p>Hardware: Virtual Gateway</p>
                </div>

                {/* Local Ollama Node */}
                <div className="p-3 rounded-lg border w-44 font-mono text-[10px] bg-black/60 border-white/10 text-muted-foreground">
                  <div className="flex justify-between font-bold mb-1">
                    <span>OLLAMA LOCAL</span>
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                  </div>
                  <p>Latency: 85ms</p>
                  <p>Carrier: OFFLINE_STANDBY</p>
                  <p>Hardware: Ryzen AI</p>
                </div>

              </div>

            </div>

          </div>
        </GlassPanel>

        {/* Right Column: Latency Chart & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Latency History Chart */}
          <GlassPanel className="p-6 h-[290px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm">Real-time Latency (ms)</h3>
                <p className="text-[10px] text-muted-foreground font-mono">FIREWORKS VS AMD AI DEVELOPER CLOUD</p>
              </div>
            </div>
            
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <XAxis dataKey="time" hide />
                  <YAxis tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                  <Line type="monotone" dataKey="Fireworks AI" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="AMD AI Developer Cloud" stroke="oklch(0.72 0.18 165)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          {/* Infrastructure Provider Health Card */}
          <GlassPanel className="p-6 h-[235px]">
            <h3 className="font-semibold text-sm mb-4">Hardware Cluster Status</h3>
            <div className="space-y-3 font-mono text-[11px]">
              {providers.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2 rounded bg-muted/10 border border-border/30">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      p.status === 'nominal' ? 'bg-emerald-400' :
                      p.status === 'degraded' ? 'bg-amber-400 animate-pulse' : 'bg-destructive'
                    }`} />
                    <span className="font-bold text-foreground">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[9px]">HARDWARE</span>
                    <span className="text-foreground">{p.hardware}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

      </div>

      {/* pxpipe Token Compression Sandbox Console */}
      <GlassPanel className="p-6" glow="blue">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-base">pxpipe Text➔PNG Token Compression Sandbox</h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
            POWERED BY PXPIPE-HGI
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Input side */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-muted-foreground">INPUT BUFFER (CONTEXT / PROMPT / LOGS)</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => loadPreset('system')}
                  className="text-[9px] font-mono px-2 py-0.5 bg-muted/30 rounded border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  System Prompt
                </button>
                <button 
                  onClick={() => loadPreset('tooldocs')}
                  className="text-[9px] font-mono px-2 py-0.5 bg-muted/30 rounded border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  Tool Definitions
                </button>
                <button 
                  onClick={() => loadPreset('densejson')}
                  className="text-[9px] font-mono px-2 py-0.5 bg-muted/30 rounded border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  Dense JSON Logs
                </button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste bulk system prompt, tool schemas, or JSON history context here..."
              className="w-full p-3 rounded-lg bg-muted/20 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-xs h-40 resize-none"
            />

            <CommandButton 
              variant="primary" 
              className="w-full"
              onClick={handleCompress}
              disabled={isCompressing || !inputText.trim()}
            >
              {isCompressing ? 'Compressing via pxpipe...' : 'Run pxpipe Compressor'}
            </CommandButton>
          </div>

          {/* Output / Results side */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {compressionResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-muted/10 rounded border border-border/30">
                      <span className="text-muted-foreground block text-[9px]">ORIGINAL SIZE</span>
                      <span className="text-foreground font-bold">{compressionResult.originalTokens.toLocaleString()} tokens</span>
                    </div>
                    <div className="p-2 bg-muted/10 rounded border border-border/30">
                      <span className="text-muted-foreground block text-[9px]">COMPRESSED SIZE</span>
                      <span className="text-primary font-bold">{compressionResult.compressedTokens.toLocaleString()} tokens</span>
                    </div>
                    <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
                      <span className="text-emerald-400 block text-[9px]">TOKEN SAVED</span>
                      <span className="font-bold">-{compressionResult.ratio}%</span>
                    </div>
                  </div>

                  {/* Render Visual Representation (Phase 2 simulated grid) */}
                  <div className="flex-1 bg-black/60 rounded border border-border/30 p-4 relative overflow-hidden flex flex-col justify-center items-center h-28">
                    {/* Simulated dense text rendering map */}
                    <div className="w-full max-w-[200px] h-12 border border-primary/40 rounded bg-black relative flex flex-wrap gap-[1px] p-[2px] overflow-hidden">
                      {Array.from({ length: 80 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-[6px] h-[3px] bg-primary rounded-[1px] opacity-80"
                          style={{
                            backgroundColor: hasVerbatimRisk ? 'oklch(0.78 0.16 85)' : 'oklch(0.65 0.18 250)',
                            opacity: Math.random() > 0.4 ? 0.9 : 0.2
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground mt-2">
                      pxpipe 1928px Dense Render · {compressionResult.canvasPages} Page(s) Generated
                    </span>
                  </div>

                  {/* Warnings & cost details */}
                  <div className="space-y-2">
                    {hasVerbatimRisk && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] font-mono text-amber-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>VERBATIM RISK WARNING:</strong> Input contains raw transaction IDs or hex hashes. Rerouting via escape hatch to avoid silent OCR confabulations.
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                      <span>Input character count: <strong className="text-foreground">{compressionResult.originalChars}</strong></span>
                      <span>Estimated Turn Cost: <del className="text-destructive/80 mr-1">{compressionResult.originalCost}</del> ➔ <strong className="text-emerald-400">{compressionResult.compressedCost}</strong></span>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground font-mono text-xs border border-dashed border-border/30 rounded-lg p-6">
                  <p>Paste context text on the left and run the compressor to visualize text-to-image token reduction and proxy savings.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </GlassPanel>

    </div>
  )
}
