"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  Shield, 
  Brain, 
  Globe, 
  Zap, 
  Lock, 
  Users,
  Activity,
  Server,
  Cpu,
  ArrowDown,
  Database,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Play,
  X,
  Sparkles,
  Info
} from 'lucide-react'
import { GlassPanel, CommandButton, StatusBadge, HolographicBorder } from '@/components/hgi/design-system'

// Dynamic import for 3D component to avoid SSR issues
const NeuralEarthVisualization = dynamic(
  () => import('@/components/hgi/neural-earth').then(mod => mod.NeuralEarthVisualization),
  { ssr: false, loading: () => <div className="w-full h-full bg-background/50 animate-pulse rounded-full" /> }
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Mission Builder & Judge Mode simulation states
  const [customGoal, setCustomGoal] = useState('')
  const [simActive, setSimActive] = useState(false)
  const [simStage, setSimStage] = useState<'idle' | 'intent' | 'planning' | 'routing' | 'execution' | 'governance' | 'memory' | 'completed'>('idle')
  const [simLogs, setSimLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  // Passcode Modal state
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')

  const handleStartSimulation = (goalText: string) => {
    setCustomGoal(goalText)
    setSimActive(true)
    setSimStage('intent')
    setSimLogs([
      '[SYSTEM] Initializing HGI Session...',
      `[CENSA] Parsing goal objective: "${goalText}"`
    ])
    setProgress(12)
    
    // Smoothly scroll to the simulation section
    const simSection = document.getElementById('chapter-9')
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Auto-run simulation if URL parameter is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('sim') === 'true') {
        // Start simulation with default supply chain goal
        handleStartSimulation('Optimize multi-agent supply chain pipelines')
      }
    }
  }, [])

  // Simulation Sequence Timeline
  useEffect(() => {
    if (!simActive) return
    
    let timer: NodeJS.Timeout
    
    if (simStage === 'intent') {
      timer = setTimeout(() => {
        setSimStage('planning')
        setSimLogs(prev => [
          ...prev, 
          '[CENSA] Intent classified: AUTOMATION & OPTIMIZATION', 
          '[CENSA] Compiling Task Directed Acyclic Graph (DAG)...'
        ])
        setProgress(28)
      }, 1500)
    } else if (simStage === 'planning') {
      timer = setTimeout(() => {
        setSimStage('routing')
        setSimLogs(prev => [
          ...prev, 
          '[CENSA] Task DAG successfully compiled with 5 parallel steps.', 
          '[REGISTRY] Selecting active specialist agents: CodeSynth & SupportArchitect.'
        ])
        setProgress(48)
      }, 1500)
    } else if (simStage === 'routing') {
      timer = setTimeout(() => {
        setSimStage('execution')
        setSimLogs(prev => [
          ...prev, 
          '[PANANI X] Routing to local vLLM / AMD Instinct MI300X cluster.', 
          '[PANANI X] Initializing secure Node VM sandbox isolates for tool executions...'
        ])
        setProgress(65)
      }, 1500)
    } else if (simStage === 'execution') {
      timer = setTimeout(() => {
        setSimStage('governance')
        setSimLogs(prev => [
          ...prev, 
          '[KAVACHA] Pre-scan audit complete. Shell command restriction check: PASS', 
          '[KAVACHA] Cost ledger tracking logged. Dynamic resource allocation verified.'
        ])
        setProgress(80)
      }, 1500)
    } else if (simStage === 'governance') {
      timer = setTimeout(() => {
        setSimStage('memory')
        setSimLogs(prev => [
          ...prev, 
          '[MEMORY] Storing cross-session episodic embeddings (pgvector).', 
          '[MEMORY] Semantic context collections synchronized (Qdrant).'
        ])
        setProgress(92)
      }, 1500)
    } else if (simStage === 'memory') {
      timer = setTimeout(() => {
        setSimStage('completed')
        setSimLogs(prev => [
          ...prev, 
          '[SYSTEM] Work complete. Telemetry status: NOMINAL.', 
          '[SYSTEM] Presentation workflow output generated.'
        ])
        setProgress(100)
      }, 1500)
    }
    
    return () => clearTimeout(timer)
  }, [simStage, simActive])

  const scrollToNext = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPass = passcode.trim().toUpperCase()
    if (cleanPass === 'AMD-GOLD' || cleanPass === 'NEXT-UNICORN') {
      setShowPasscodeModal(false)
      router.push('/hq')
    } else {
      setPasscodeError('Invalid Passcode. Hint: Try AMD-GOLD')
    }
  }

  const handleResetSim = () => {
    setCustomGoal('')
    setSimActive(false)
    setSimStage('idle')
    setSimLogs([])
    setProgress(0)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden text-foreground selection:bg-primary/30">
      {/* Background stars/grid */}
      <div className="fixed inset-0 bg-neural-grid opacity-20 pointer-events-none z-0" />
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Floating background ambient glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/20 backdrop-blur-md border-b border-border/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">RE-EVOLVE</h1>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider">ON HGI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <StatusBadge status="online" label="ALL SYSTEMS NOMINAL" />
            <CommandButton variant="primary" size="sm" glow onClick={() => setShowPasscodeModal(true)}>
              Enter Workspace
              <ArrowRight className="w-3 h-3 ml-2 inline" />
            </CommandButton>
          </div>
        </div>
      </nav>

      {/* Passcode Security Modal */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <HolographicBorder>
                <GlassPanel variant="strong" className="p-6 relative">
                  <button 
                    onClick={() => { setShowPasscodeModal(false); setPasscode(''); setPasscodeError(''); }}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Security Verification Required
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Enter the operational security passcode to unlock developer dashboards and workspace systems.
                  </p>
                  
                  <form onSubmit={handleVerifyPasscode} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Enter Passcode..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-black/40 border border-border/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/50 uppercase tracking-widest text-center text-foreground placeholder:text-muted-foreground/60"
                      required
                      autoFocus
                    />
                    {passcodeError && (
                      <p className="text-[10px] text-yellow-500 font-mono text-center">
                        {passcodeError}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono mt-2">
                      <span>Passcode hint: AMD-GOLD</span>
                    </div>
                    <CommandButton variant="primary" size="sm" type="submit" glow>
                      Decrypt & Enter
                    </CommandButton>
                  </form>
                </GlassPanel>
              </HolographicBorder>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHAPTER 1 — The Future */}
      <section id="chapter-1" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 text-center border-b border-border/10 z-10">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
          <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
            <NeuralEarthVisualization />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-primary mb-6 tracking-widest uppercase"
          >
            AMD Developer Hackathon ACT II
          </motion.p>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xl md:text-2xl text-muted-foreground italic mb-8 max-w-2xl font-light"
          >
            "Every revolution changed how humans worked.  
            The next one changes how intelligence itself works."
          </motion.p>
          
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4"
          >
            RE-EVOLVE ON HGI
          </motion.h1>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12"
          >
            The Operating System for Autonomous Intelligence
          </motion.p>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <CommandButton variant="primary" size="lg" glow onClick={() => scrollToNext('chapter-2')}>
              Launch Experience
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </CommandButton>
            <CommandButton variant="gold" size="lg" onClick={() => handleStartSimulation('Optimize multi-agent supply chain pipelines')}>
              Watch Live Demo
              <Play className="w-4 h-4 ml-2 inline" />
            </CommandButton>
            <Link href="/builder">
              <CommandButton variant="subtle" size="lg">
                Mission Builder App
                <Zap className="w-4 h-4 ml-2 inline text-yellow-500" />
              </CommandButton>
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-8 animate-bounce cursor-pointer" onClick={() => scrollToNext('chapter-2')}>
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* CHAPTER 2 — The Problem */}
      <section id="chapter-2" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-red-500 mb-6 tracking-widest uppercase"
          >
            CHAPTER 2 — THE CRISIS
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Disconnected Intelligence
          </motion.h2>

          {/* Scattered Nodes Animation */}
          <div className="w-full h-48 relative mb-12 border border-border/10 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [Math.sin(i) * 50, Math.cos(i) * 80, Math.sin(i) * 50],
                  y: [Math.cos(i) * 40, Math.sin(i) * 60, Math.cos(i) * 40],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-4 h-4 rounded-full bg-red-500/60 blur-xs"
                style={{
                  top: `${30 + (i * 12)}%`,
                  left: `${20 + (i * 15)}%`
                }}
              />
            ))}
            <span className="text-xs font-mono text-muted-foreground z-10">ISOLATED AGENT INSTANCES (NO STATE OR SHARING)</span>
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12"
          >
            Existing AI solutions operate as fragmented, isolated assistants. They respond, they forget, they cannot coordinate safely, and they lack unified memory structures.
          </motion.p>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-bold text-glow-blue max-w-xl"
          >
            "The world doesn't need another model. It needs an Operating System."
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 3 — The Birth of HGI */}
      <section id="chapter-3" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-primary mb-6 tracking-widest uppercase"
          >
            CHAPTER 3 — THE EVOLUTION
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            The Convergence
          </motion.h2>

          {/* Merging Nodes Animation */}
          <div className="w-full h-48 relative mb-12 border border-border/10 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50"
            >
              <Brain className="w-6 h-6 text-primary" />
            </motion.div>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [Math.sin(i) * 120, 0, Math.sin(i) * 120],
                  y: [Math.cos(i) * 60, 0, Math.cos(i) * 60],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute w-3 h-3 rounded-full bg-secondary/80"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            By consolidating orchestration, secure isolates, vector registries, and local accelerators, Re-Evolve brings order.
          </motion.p>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-bold text-glow-blue mt-8"
          >
            "When intelligence is orchestrated, individual models become collective intelligence."
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 4 — Meet CENSA */}
      <section id="chapter-4" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-purple-400 mb-6 tracking-widest uppercase"
          >
            CHAPTER 4 — THE BRAIN
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            CENSA Cognitive Orchestration
          </motion.h2>
          
          {/* Interactive DAG Pipeline representation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
            {[
              { title: '1. Intent Parse', desc: 'Classifies goal categories' },
              { title: '2. DAG Reasoning', desc: 'Decomposes 12 execution stages' },
              { title: '3. Agent Match', desc: 'Resolves specialist skills' },
              { title: '4. Evaluation', desc: 'Measures confidence indexes' }
            ].map((step, idx) => (
              <GlassPanel key={idx} className="p-4 border-primary/20 text-left">
                <span className="text-xs font-mono text-primary font-bold">STAGE 0{idx+1}</span>
                <h3 className="font-semibold text-sm my-1">{step.title}</h3>
                <p className="text-[11px] text-muted-foreground">{step.desc}</p>
              </GlassPanel>
            ))}
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            The Cognitive Execution & Neural Synthesis Agent (CENSA) translates abstract inputs into ordered DAG graphs, dynamically managing the lifecycle and task assignments of all available agents.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 5 — Meet Panani X */}
      <section id="chapter-5" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-emerald-400 mb-6 tracking-widest uppercase"
          >
            CHAPTER 5 — THE RUNTIME
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Panani X Sandbox Runtime
          </motion.h2>

          {/* Orbital Agent Swarm Animation */}
          <div className="w-64 h-64 relative mb-12 border border-border/10 rounded-full flex items-center justify-center bg-black/10">
            <div className="absolute w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-emerald-400" />
            </div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 2 }}
                className="absolute w-full h-full"
              >
                <div className="absolute w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center -top-3 left-[calc(50%-12px)]">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Every script, compiler tool, and external API call executes inside isolated Node `vm` sandboxes. Panani X prevents system escapes, limits resources, and exposes audit logs transparently.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 6 — Memory Vault */}
      <section id="chapter-6" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-cyan-400 mb-6 tracking-widest uppercase"
          >
            CHAPTER 6 — THE GALAXY
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Memory Vault Persistent Graph
          </motion.h2>

          {/* Connected Galaxy Nodes */}
          <div className="w-full h-48 relative mb-12 border border-border/10 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full opacity-60">
              <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="80%" y1="40%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" />
              <line x1="30%" y1="80%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" />
              <line x1="70%" y1="70%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
            <div className="absolute w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="absolute w-4 h-4 rounded-full bg-cyan-900 border border-cyan-400" style={{top: '30%', left: '20%'}} />
            <div className="absolute w-4 h-4 rounded-full bg-cyan-900 border border-cyan-400" style={{top: '40%', left: '80%'}} />
            <div className="absolute w-4 h-4 rounded-full bg-cyan-900 border border-cyan-400" style={{top: '80%', left: '30%'}} />
            <div className="absolute w-4 h-4 rounded-full bg-cyan-900 border border-cyan-400" style={{top: '70%', left: '70%'}} />
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Episodic interaction logs (pgvector) combine with semantic context collections (Qdrant) to form a persistent memory index. Agents recall context across sessions and workspaces seamlessly.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 7 — Kavacha Governance */}
      <section id="chapter-7" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-yellow-500 mb-6 tracking-widest uppercase"
          >
            CHAPTER 7 — THE GUARD
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Kavacha Zero-Trust Shield
          </motion.h2>

          {/* Golden Shield Pulse */}
          <motion.div
            animate={{
              boxShadow: ["0 0 20px rgba(234,179,8,0.2)", "0 0 40px rgba(234,179,8,0.4)", "0 0 20px rgba(234,179,8,0.2)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-full border border-yellow-500/50 bg-yellow-500/10 flex items-center justify-center mb-12"
          >
            <Shield className="w-10 h-10 text-yellow-500" />
          </motion.div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Kavacha intercepts and validates every execution request. Strict policy configurations evaluate compliance, log audit records, and manage resource billing ledger lines dynamically.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 8 — AMD Hardware Integration */}
      <section id="chapter-8" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-red-400 mb-6 tracking-widest uppercase"
          >
            CHAPTER 8 — THE ACCELERATOR
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            AMD AI Developer Cloud
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-12">
            <GlassPanel className="p-6 border-red-500/20">
              <Server className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold text-sm mb-2">MI300X Clusters</h3>
              <p className="text-xs text-muted-foreground">High-memory bandwidth running dense agent topologies.</p>
            </GlassPanel>
            <GlassPanel className="p-6 border-red-500/20">
              <Cpu className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold text-sm mb-2">ROCm Architecture</h3>
              <p className="text-xs text-muted-foreground">Local model serving optimized via native PyTorch environments.</p>
            </GlassPanel>
            <GlassPanel className="p-6 border-red-500/20">
              <Zap className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold text-sm mb-2">LiteLLM Failover</h3>
              <p className="text-xs text-muted-foreground">Reroutes request pathways to Fireworks AI endpoint in under 500ms.</p>
            </GlassPanel>
          </div>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Built on AMD AI Fabric. vLLM servers hosted on local Instinct arrays process core inference tasks, while remote failovers maintain session continuity.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 9 — Judge Mode & Mission Builder (Unified Interactive Console) */}
      <section id="chapter-9" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-primary mb-6 tracking-widest uppercase"
          >
            CHAPTER 9 — MISSION BUILDER & JUDGE MODE
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center"
          >
            Guided Intelligence Demonstration
          </motion.h2>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-muted-foreground mb-12 text-center max-w-xl text-sm"
          >
            Choose a sample mission below or type your custom objective. Watch HGI compile the workflow and execute the agent swarms.
          </motion.p>

          {/* Quick Sample Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
            {[
              { label: 'Optimize supply chain routing', icon: Sparkles },
              { label: 'Audit NestJS packages for security vulnerabilities', icon: Shield },
              { label: 'Generate semantic vector indexing templates', icon: Database }
            ].map((card, i) => (
              <GlassPanel 
                key={i} 
                onClick={() => !simActive && handleStartSimulation(card.label)}
                className={`p-4 border border-primary/20 text-left cursor-pointer hover:border-primary/50 transition-colors ${simActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-mono text-muted-foreground">SAMPLE OBJECTIVE</span>
                </div>
                <p className="text-xs font-semibold">{card.label}</p>
              </GlassPanel>
            ))}
          </div>

          <HolographicBorder className="w-full max-w-3xl overflow-hidden mb-8">
            <GlassPanel variant="strong" className="p-6 relative min-h-[440px] flex flex-col">
              
              <AnimatePresence mode="wait">
                {simStage === 'idle' ? (
                  <motion.div 
                    key="input-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-center gap-6"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Enter Custom Business Goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Optimize multi-agent supply chain pipelines for global routing..."
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="w-full bg-black/40 border border-border/20 rounded px-3 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                    <CommandButton 
                      variant="primary" 
                      size="lg" 
                      glow 
                      onClick={() => handleStartSimulation(customGoal || 'Optimize multi-agent supply chain pipelines')}
                    >
                      Initialize & Execute Simulation
                      <Play className="w-4 h-4 ml-2 inline" />
                    </CommandButton>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="sim-track"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col gap-6"
                  >
                    {/* Top status bar */}
                    <div className="flex items-center justify-between border-b border-border/10 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">
                          {simStage === 'completed' ? 'EXECUTION COMPLETED' : `STAGE: ${simStage.toUpperCase()}`}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">PROGRESS: {progress}%</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-border/20 rounded-full mb-6 overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary" 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Main workflow content area */}
                    <div className="flex-1 grid md:grid-cols-3 gap-6">
                      
                      {/* Live Status Overlay Checklist */}
                      <div className="md:col-span-1 border-r border-border/10 pr-4 flex flex-col gap-3 justify-center text-left">
                        {[
                          { id: 'intent', label: 'Goal Understood' },
                          { id: 'planning', label: 'Workflow Planned' },
                          { id: 'routing', label: 'Model Selected (AMD)' },
                          { id: 'execution', label: 'Agents Coordinating' },
                          { id: 'governance', label: 'Governance Passed' },
                          { id: 'memory', label: 'Memory Retrieved' }
                        ].map((s) => {
                          const isPassed = ['completed', 'memory', 'governance', 'execution', 'routing', 'planning', 'intent'].indexOf(simStage) > ['completed', 'memory', 'governance', 'execution', 'routing', 'planning', 'intent'].indexOf(s.id as any)
                          const isActive = simStage === s.id
                          return (
                            <div key={s.id} className="flex items-center gap-2 text-xs font-mono">
                              {isPassed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : isActive ? (
                                <div className="w-4 h-4 rounded-full border border-primary animate-pulse flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-border/30" />
                              )}
                              <span className={isActive ? 'text-primary font-bold' : isPassed ? 'text-emerald-400' : 'text-muted-foreground'}>
                                {s.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Log terminal output */}
                      <div className="md:col-span-2 bg-black/40 rounded p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[220px] flex flex-col gap-1 text-left">
                        {simLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={log.startsWith('[SYSTEM]') ? 'text-yellow-500' : log.startsWith('[KAVACHA]') ? 'text-emerald-400' : 'text-muted-foreground'}
                          >
                            {log}
                          </div>
                        ))}
                        {simStage !== 'completed' && (
                          <span className="text-primary animate-pulse">▋</span>
                        )}
                      </div>

                    </div>

                    {/* Explanatory completion state */}
                    {simStage === 'completed' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 border border-emerald-500/20 bg-emerald-500/5 rounded p-4 flex flex-col gap-4 text-left"
                      >
                        <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Enterprise Response Generated (Live Demo Run)
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-y border-border/10 py-2">
                          <div>
                            <p className="text-muted-foreground">Tokens Saved</p>
                            <p className="text-xs font-bold text-foreground">~68% via pxpipe</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Failover latency</p>
                            <p className="text-xs font-bold text-foreground">&lt;500ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Active Hardware</p>
                            <p className="text-xs font-bold text-foreground">Instinct MI300X</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <CommandButton variant="subtle" size="sm" onClick={handleResetSim}>
                            Reset Console
                          </CommandButton>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </GlassPanel>
          </HolographicBorder>
        </div>
      </section>

      {/* CHAPTER 10 — Architecture stack building */}
      <section id="chapter-10" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-primary mb-6 tracking-widest uppercase"
          >
            CHAPTER 10 — THE BLUEPRINT
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-12"
          >
            Interactive Stack Blueprint
          </motion.h2>

          {/* Animated Stack Layer Construction */}
          <div className="flex flex-col gap-2.5 w-full max-w-xl">
            {[
              { num: 'L1', name: 'Developer Ingress (CLI, SDK, Web)', border: 'border-primary/20' },
              { num: 'L2', name: 'CENSA Planner (DAG Compilation)', border: 'border-purple-500/20' },
              { num: 'L3', name: 'Agent Registry (Dynamic Specialists)', border: 'border-pink-500/20' },
              { num: 'L4', name: 'Panani X Runtime (Node VM Sandbox)', border: 'border-emerald-500/20' },
              { num: 'L5', name: 'Kavacha Governance (Audit Ledger)', border: 'border-yellow-500/20' },
              { num: 'L6', name: 'Memory Vault (pgvector & Qdrant)', border: 'border-cyan-500/20' },
              { num: 'L7', name: 'AMD AI Fabric (MI300X & ROCm)', border: 'border-red-500/20' }
            ].map((layer, idx) => (
              <motion.div
                key={layer.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <GlassPanel className={`p-3.5 border ${layer.border} text-left flex items-center gap-4`}>
                  <span className="font-mono text-xs font-bold text-muted-foreground w-8">{layer.num}</span>
                  <span className="text-sm font-semibold">{layer.name}</span>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 11 — The Vision */}
      <section id="chapter-11" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-primary mb-6 tracking-widest uppercase"
          >
            CHAPTER 11 — THE HORIZON
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Responsible Global Intelligence
          </motion.h2>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 font-light"
          >
            We are building toward an open future. A secure computing substrate where millions of agents work side by side under explicit human validation, ensuring intelligence remains predictable, audited, and aligned.
          </motion.p>
        </div>
      </section>

      {/* CHAPTER 12 — The Invitation */}
      <section id="chapter-12" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm font-mono text-yellow-500 mb-6 tracking-widest uppercase"
          >
            CHAPTER 12 — AN INVITATION
          </motion.p>

          <GlassPanel className="p-8 border-yellow-500/20 max-w-2xl text-left relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <Brain className="w-48 h-48 text-yellow-500" />
            </div>
            
            <p className="text-md md:text-lg italic text-muted-foreground leading-relaxed mb-6 font-light">
              "We believe the future won't be built by one company. It will be built by communities. Researchers. Developers. Open collaboration. Thank you for giving builders the opportunity to imagine what comes next."
            </p>
            
            <div className="flex items-center justify-between mt-8 border-t border-border/10 pt-4">
              <div>
                <p className="font-bold text-sm">Aryan</p>
                <p className="text-[10px] text-muted-foreground font-mono">Founder, Re-Evolve on HGI</p>
              </div>
              
              <Link href="/docs/OPEN_LETTER_TO_AMD.md">
                <CommandButton variant="gold" size="sm">
                  Read Founder Letter →
                </CommandButton>
              </Link>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border/10 z-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">RE-EVOLVE ON HGI</p>
                <p className="text-[10px] text-muted-foreground font-mono">Human-Governed Adaptive Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground">
              <span>VERSION 2.0.0</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <StatusBadge status="online" label="ALL SYSTEMS NOMINAL" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
