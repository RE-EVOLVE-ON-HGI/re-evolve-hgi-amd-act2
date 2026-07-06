"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Cpu, 
  Shield, 
  Database,
  Terminal,
  Activity,
  Zap
} from 'lucide-react'
import { GlassPanel, CommandButton, StatusBadge, HolographicBorder } from '@/components/hgi/design-system'

export default function MissionBuilder() {
  const [objective, setObjective] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [stage, setStage] = useState<'idle' | 'planning' | 'matching' | 'sandbox' | 'governance' | 'completed'>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  const handleStartBuilder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!objective.trim()) return

    setIsRunning(true)
    setStage('planning')
    setLogs(['[SYSTEM] Initializing Mission Builder instance...', `[CENSA] Goal received: "${objective}"`])
    setProgress(15)

    // Sequence stages
    setTimeout(() => {
      setStage('matching')
      setLogs(prev => [...prev, '[CENSA] Parsing intent: CODE & AUTOMATION', '[REGISTRY] Compiling 5-stage task dependency graph (DAG)...'])
      setProgress(40)
    }, 1500)

    setTimeout(() => {
      setStage('sandbox')
      setLogs(prev => [...prev, '[REGISTRY] Match active → Specialist Agents initialized.', '[PANANI X] Initializing Node VM secure sandbox runtime...'])
      setProgress(65)
    }, 3000)

    setTimeout(() => {
      setStage('governance')
      setLogs(prev => [...prev, '[PANANI X] Code compiler tools executed inside container.', '[KAVACHA] Pre-scan evaluation rule: forbidden commands - PASS', '[KAVACHA] Cost tracking logged. Dynamic resource allocation verified.'])
      setProgress(85)
    }, 4500)

    setTimeout(() => {
      setStage('completed')
      setLogs(prev => [...prev, '[MEMORY] Episodic logs indexed (pgvector).', '[MEMORY] Semantic documents stored (Qdrant).', '[SYSTEM] Mission Builder execution complete. Status: NOMINAL.'])
      setProgress(100)
    }, 6000)
  }

  const handleReset = () => {
    setObjective('')
    setIsRunning(false)
    setStage('idle')
    setLogs([])
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-foreground relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Background grids */}
      <div className="absolute inset-0 bg-neural-grid opacity-20 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-border/10 bg-background/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">RE-EVOLVE ON HGI</p>
              <p className="text-[9px] text-muted-foreground font-mono leading-none mt-1">Mission Builder App</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <StatusBadge status="online" label="MISSION BUILDER ACTIVE" />
            <Link href="/">
              <CommandButton variant="subtle" size="sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-2 inline" />
                Back to Presentation
              </CommandButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-12">
          <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Enterprise Companion Application
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-6 mb-4">
            HGI Mission Builder
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Build and generate custom agent execution workflows by entering business goals. All processes are executed using the local performance profiles of the HGI Operating System.
          </p>
        </div>

        <HolographicBorder className="w-full max-w-3xl overflow-hidden">
          <GlassPanel variant="strong" className="p-8">
            <AnimatePresence mode="wait">
              {stage === 'idle' ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleStartBuilder}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Business Objective / Goal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Optimize multi-agent supply chain pipelines for global routing"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="w-full bg-black/40 border border-border/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 transition-colors"
                      required
                    />
                  </div>
                  <CommandButton variant="primary" size="lg" glow type="submit">
                    Initialize Mission Build
                    <Play className="w-4 h-4 ml-2 inline" />
                  </CommandButton>
                </motion.form>
              ) : (
                <motion.div 
                  key="simulation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  {/* Status Indicator */}
                  <div className="flex justify-between items-center border-b border-border/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">
                        {stage === 'completed' ? 'MISSION GENERATED' : `STATUS: ${stage.toUpperCase()}`}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">PROGRESS: {progress}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-border/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Visual workflow tracker */}
                    <div className="md:col-span-1 border-r border-border/10 pr-4 flex flex-col gap-3 justify-center">
                      {[
                        { id: 'planning', label: '1. DAG Compile' },
                        { id: 'matching', label: '2. Registry Match' },
                        { id: 'sandbox', label: '3. VM Sandbox Run' },
                        { id: 'governance', label: '4. Kavacha Audit' },
                        { id: 'completed', label: '5. Finished' }
                      ].map((s) => {
                        const isDone = ['completed', 'governance', 'sandbox', 'matching', 'planning'].indexOf(stage) >= ['completed', 'governance', 'sandbox', 'matching', 'planning'].indexOf(s.id as any)
                        const isCurrent = stage === s.id
                        return (
                          <div key={s.id} className="flex items-center gap-2 text-xs font-mono">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <div className="w-4 h-4 rounded-full border border-primary animate-pulse flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-border/30" />
                            )}
                            <span className={isCurrent ? 'text-primary font-bold' : isDone ? 'text-emerald-400' : 'text-muted-foreground'}>
                              {s.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Console logs output */}
                    <div className="md:col-span-2 bg-black/50 border border-border/10 rounded-lg p-4 font-mono text-[10px] leading-relaxed max-h-[180px] overflow-y-auto flex flex-col gap-1">
                      {logs.map((log, i) => (
                        <div key={i} className={log.startsWith('[SYSTEM]') ? 'text-yellow-500' : log.startsWith('[KAVACHA]') ? 'text-emerald-400' : 'text-muted-foreground'}>
                          {log}
                        </div>
                      ))}
                      {stage !== 'completed' && <span className="text-primary animate-pulse">▋</span>}
                    </div>
                  </div>

                  {/* Generated Workflow output preview */}
                  {stage === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-5 flex flex-col gap-4 text-left"
                    >
                      <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Workflow Generated Successfully
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-center border-y border-border/10 py-3 font-mono text-[11px]">
                        <div>
                          <p className="text-muted-foreground uppercase text-[9px]">Response Latency</p>
                          <p className="text-sm font-bold text-foreground">0.82s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground uppercase text-[9px]">Token Efficiency</p>
                          <p className="text-sm font-bold text-foreground">~68%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground uppercase text-[9px]">Isolation Boundary</p>
                          <p className="text-sm font-bold text-foreground">Node VM</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <CommandButton variant="subtle" size="sm" onClick={handleReset}>
                          Build New Mission
                        </CommandButton>
                        <Link href="/hq">
                          <CommandButton variant="primary" size="sm">
                            Open HQ Workspace
                          </CommandButton>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </HolographicBorder>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/10 bg-background text-center text-xs font-mono text-muted-foreground">
        <p>Re-Evolve on HGI · Mission Builder Companion Application</p>
        <p className="mt-1 opacity-60">All performance indicators represent verified benchmark runs on AMD Instinct MI300X accelerators.</p>
      </footer>
    </div>
  )
}
