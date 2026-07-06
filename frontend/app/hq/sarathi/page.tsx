"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  Network, 
  Zap, 
  Activity, 
  Brain, 
  Play, 
  Pause, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Database, 
  Sliders, 
  ActivitySquare, 
  HardDrive 
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, DataStream, HolographicBorder } from '@/components/hgi/design-system'
import { getAgents } from '@/lib/api'
import { useRealtime } from '@/hooks/use-realtime'
import { 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Area, 
  AreaChart,
  BarChart,
  Bar
} from 'recharts'

interface RuntimeJob {
  id: string
  name: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  agent: string
  model: string
  duration: string
  progress: number
}

const INITIAL_JOBS: RuntimeJob[] = [
  { id: 'JOB-948', name: 'Web Research: AI Support workflows', status: 'completed', agent: 'ResearchAgent', model: 'Llama-3-8b', duration: '1.2s', progress: 100 },
  { id: 'JOB-949', name: 'Generate Support Controller Python', status: 'completed', agent: 'CodeSynth-v2.3', model: 'Llama-3-70b', duration: '2.5s', progress: 100 },
  { id: 'JOB-950', name: 'Render UI views components', status: 'running', agent: 'CodeSynth-v2.3', model: 'Llama-3-70b', duration: '1.8s', progress: 68 },
  { id: 'JOB-951', name: 'Risk & Policy verification scan', status: 'queued', agent: 'KavachaAudit-Core', model: 'Kavacha Policy', duration: '--', progress: 0 },
  { id: 'JOB-952', name: 'Local Test suite execution', status: 'queued', agent: 'QATester-Agent', model: 'Deterministic', duration: '--', progress: 0 },
]

const INITIAL_MEM_WRITES = [
  { id: 1, type: 'pgvector', text: 'Ingested support layout context ref: TSK-089. Similarity: 0.94', time: '1s ago' },
  { id: 2, type: 'Qdrant', text: 'Retrieved 3 vectors for episodic memory context match.', time: '4s ago' },
  { id: 3, type: 'PostgreSQL', text: 'Committed compliance transaction log id: TXN-8472.', time: '12s ago' },
  { id: 4, type: 'pgvector', text: 'Created semantic representation of client config policy.', time: '1m ago' },
  { id: 5, type: 'Qdrant', text: 'Re-indexed semantic memory database cluster core.', time: '3m ago' },
]

const INITIAL_SYSTEM_EVENTS = [
  { id: 1, text: 'Agent CodeGenerator-v2 activated inside sandbox boundary.', time: '3s ago' },
  { id: 2, text: 'Panani X starting isolated Docker container build.', time: '8s ago' },
  { id: 3, text: 'Governance policy check: check_unauthorized_network passed.', time: '15s ago' },
  { id: 4, text: 'LiteLLM routed request to AMD AI Developer Cloud (MI300X).', time: '20s ago' },
  { id: 5, text: 'EPISODIC_DRIFT: Alert warning. System variance <= 0.02%.', time: '2m ago' },
]

export default function SarathiRuntimePage() {
  const [jobs, setJobs] = useState<RuntimeJob[]>(INITIAL_JOBS)
  const [memWrites, setMemWrites] = useState(INITIAL_MEM_WRITES)
  const [events, setEvents] = useState(INITIAL_SYSTEM_EVENTS)
  const [runningAgents, setRunningAgents] = useState(14)
  const [queuedJobs, setQueuedJobs] = useState(2)
  const [completedJobs, setCompletedJobs] = useState(847)
  const [runtimeHealth, setRuntimeHealth] = useState(99.8)
  const [playbackActive, setPlaybackActive] = useState(true)

  // Real-time graph data
  const [performanceData, setPerformanceData] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      time: `${i + 1}m ago`,
      throughput: Math.floor(120 + Math.random() * 40),
      latency: Math.floor(15 + Math.random() * 10),
    }))
  )

  // Simulation loop for live monitoring
  useEffect(() => {
    if (!playbackActive) return
    const interval = setInterval(() => {
      // Simulate running job progress
      setJobs(prev => prev.map(job => {
        if (job.status === 'running') {
          const nextProg = job.progress + Math.floor(Math.random() * 12)
          if (nextProg >= 100) {
            return { ...job, progress: 100, status: 'completed', duration: '2.4s' }
          }
          return { ...job, progress: nextProg }
        }
        return job
      }))

      // Randomly trigger new running jobs from queue
      setJobs(prev => {
        const hasRunning = prev.some(j => j.status === 'running')
        if (!hasRunning) {
          const queuedIdx = prev.findIndex(j => j.status === 'queued')
          if (queuedIdx !== -1) {
            const nextJobs = [...prev]
            nextJobs[queuedIdx] = { ...nextJobs[queuedIdx], status: 'running', progress: 10 }
            setQueuedJobs(q => Math.max(0, q - 1))
            return nextJobs
          }
        }
        return prev
      })

      // Add random memory writes
      if (Math.random() > 0.6) {
        const dbTypes = ['pgvector', 'Qdrant', 'PostgreSQL']
        const randomType = dbTypes[Math.floor(Math.random() * dbTypes.length)]
        const newWrite = {
          id: Date.now(),
          type: randomType,
          text: randomType === 'pgvector' ? `Indexed dynamic task node embedding. Score: 0.91` :
                randomType === 'Qdrant' ? `Retrieved memory context keys: [SUPPORT_AGENT_V2]` :
                `Updated transaction ledger: OK. Ledger Balance: $1.42`,
          time: 'Just now'
        }
        setMemWrites(prev => [newWrite, ...prev.slice(0, 5)])
      }

      // Add random system events
      if (Math.random() > 0.7) {
        const randomEvents = [
          'Panani Runtime garbage collector recycled 12 expired sandbox scopes.',
          'LiteLLM executed fallback switch. Current primary: Fireworks AI.',
          'Model routing completed on AMD Instinct MI300X.',
          'SARATHI DAG Planner completed re-optimization of active queue.',
        ]
        const newEvent = {
          id: Date.now(),
          text: randomEvents[Math.floor(Math.random() * randomEvents.length)],
          time: 'Just now'
        }
        setEvents(prev => [newEvent, ...prev.slice(0, 5)])
      }

      // Randomly update system metrics
      setRunningAgents(prev => Math.max(8, Math.min(24, prev + (Math.random() > 0.5 ? 1 : -1))))
      setRuntimeHealth(prev => Math.max(99.4, Math.min(100, Number((prev + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2)))))
      setCompletedJobs(prev => prev + 1)

      // Add a data point to throughput chart
      setPerformanceData(prev => [
        ...prev.slice(1),
        {
          time: 'Now',
          throughput: Math.floor(130 + Math.random() * 30),
          latency: Math.floor(14 + Math.random() * 8)
        }
      ])

    }, 2000)

    return () => clearInterval(interval)
  }, [playbackActive])

  // Mock model metrics
  const modelUsage = [
    { name: 'Llama-3-70b', value: 65 },
    { name: 'Llama-3-8b', value: 20 },
    { name: 'Qwen-2.5-Coder', value: 10 },
    { name: 'Ollama/Local', value: 5 },
  ]

  // Mock tool call metrics
  const toolCalls = [
    { name: 'execute_tests', count: 341 },
    { name: 'create_repo', count: 182 },
    { name: 'fetch_web', count: 98 },
    { name: 'spanner_sql', count: 47 },
  ]

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Panani X Runtime Monitor</h1>
            <p className="text-muted-foreground text-sm">Real-time execution stats, sandbox metrics, and memory writes [EMULATED FEED]</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={playbackActive ? 'online' : 'standby'} label={playbackActive ? 'MONITORING ACTIVE' : 'MONITORING PAUSED'} />
          <CommandButton 
            variant={playbackActive ? 'primary' : 'secondary'} 
            size="sm"
            onClick={() => setPlaybackActive(!playbackActive)}
          >
            {playbackActive ? <Pause className="w-3 h-3 mr-2" /> : <Play className="w-3 h-3 mr-2" />}
            {playbackActive ? 'Pause Stream' : 'Resume Stream'}
          </CommandButton>
        </div>
      </div>

      {/* Telemetry Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          label="Running Agents"
          value={runningAgents}
          status="nominal"
        />
        <TelemetryCard
          label="Queued Jobs"
          value={queuedJobs}
          status={queuedJobs > 5 ? 'warning' : 'nominal'}
        />
        <TelemetryCard
          label="Completed Jobs"
          value={completedJobs}
          status="nominal"
          trend="up"
          trendValue="+1"
        />
        <TelemetryCard
          label="Runtime Health"
          value={`${runtimeHealth}%`}
          status="nominal"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Queue & Logs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Job Queue */}
          <GlassPanel className="p-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Active Job Execution Queue [EMULATED]
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground">
                    <th className="py-2">JOB ID</th>
                    <th className="py-2">NAME</th>
                    <th className="py-2">AGENT</th>
                    <th className="py-2">MODEL</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2">PROGRESS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/10">
                      <td className="py-3 text-primary">{job.id}</td>
                      <td className="py-3 text-foreground font-semibold">{job.name}</td>
                      <td className="py-3 text-muted-foreground">{job.agent}</td>
                      <td className="py-3 text-muted-foreground">{job.model}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          job.status === 'running' ? 'bg-primary/20 text-primary border border-primary/30 animate-pulse' :
                          'bg-muted/20 text-muted-foreground border border-border/30'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${job.progress}%` }} />
                          </div>
                          <span className="text-[10px]">{job.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>

          {/* Memory Writes (pgvector/Qdrant reads/writes) */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Live Memory Reads/Writes [EMULATED]
              </h3>
              <div className="space-y-3 h-[250px] overflow-y-auto font-mono text-xs pr-1">
                {memWrites.map((write) => (
                  <div key={write.id} className="p-2 rounded bg-muted/10 border border-border/30">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className={`font-bold ${
                        write.type === 'pgvector' ? 'text-primary' :
                        write.type === 'Qdrant' ? 'text-secondary' : 'text-emerald-400'
                      }`}>{write.type.toUpperCase()}</span>
                      <span className="text-muted-foreground">{write.time}</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-[11px]">{write.text}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                System Event Logs [EMULATED]
              </h3>
              <div className="space-y-3 h-[250px] overflow-y-auto font-mono text-xs pr-1">
                {events.map((e) => (
                  <div key={e.id} className="p-2 rounded bg-muted/10 border border-border/30">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-primary font-bold">SYSTEM</span>
                      <span className="text-muted-foreground">{e.time}</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-[11px]">{e.text}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

        </div>

        {/* Right Column: Model & Tool stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Performance telemetry */}
          <GlassPanel className="p-6">
            <h3 className="font-semibold text-sm mb-4">Throughput Telemetry</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                  <Area type="monotone" dataKey="throughput" stroke="oklch(0.65 0.18 250)" fill="url(#latencyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center border-t border-border/30 pt-3">
              <div>
                <span className="text-[10px] text-muted-foreground block font-mono">AVG JOB LATENCY</span>
                <span className="text-sm font-bold font-mono">15.4ms</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-mono">THROUGHPUT</span>
                <span className="text-sm font-bold font-mono">148 ops/s</span>
              </div>
            </div>
          </GlassPanel>

          {/* Model selection percentages */}
          <GlassPanel className="p-6">
            <h3 className="font-semibold text-sm mb-4">Active Model Distribution</h3>
            <div className="space-y-3 font-mono text-xs">
              {modelUsage.map((model) => (
                <div key={model.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{model.name}</span>
                    <span className="text-primary font-bold">{model.value}%</span>
                  </div>
                  <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${model.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Tool Calls count */}
          <GlassPanel className="p-6">
            <h3 className="font-semibold text-sm mb-4">Top Sandbox Tool Calls</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolCalls}>
                  <XAxis dataKey="name" tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 9 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                  <Bar dataKey="count" fill="oklch(0.72 0.18 165)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

        </div>

      </div>
    </div>
  )
}
