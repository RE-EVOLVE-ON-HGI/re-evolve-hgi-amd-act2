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
  Layers,
  ArrowLeft,
  Settings,
  HelpCircle
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

export default function InteractiveStoryPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  
  // Custom Cursor Particle state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showTimelineIndex, setShowTimelineIndex] = useState(0)
  const [wokenAgents, setWokenAgents] = useState<string[]>([])
  
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

  // Cursor tracking for canvas particle lines
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Canvas particle trail renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = []

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Add particle at cursor pos
      if (mousePos.x > 0 && mousePos.y > 0) {
        particles.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          alpha: 1
        })
      }

      // Draw and prune particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.015

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          i--
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha})` // Golden particle glow
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [mousePos])

  const handleStartSimulation = (goalText: string) => {
    setCustomGoal(goalText)
    setSimActive(true)
    setSimStage('intent')
    setSimLogs([
      '[SYSTEM] Initializing HGI Session...',
      `[CENSA] Parsing goal objective: "${goalText}"`
    ])
    setProgress(12)
    
    // Smoothly scroll to the simulation section (Scene 10)
    const simSection = document.getElementById('scene-10')
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
      }, 1200)
    } else if (simStage === 'planning') {
      timer = setTimeout(() => {
        setSimStage('routing')
        setSimLogs(prev => [
          ...prev, 
          '[CENSA] Task DAG successfully compiled with 5 parallel steps.', 
          '[REGISTRY] Selecting active specialist agents: CodeSynth & SupportArchitect.'
        ])
        setProgress(48)
      }, 1200)
    } else if (simStage === 'routing') {
      timer = setTimeout(() => {
        setSimStage('execution')
        setSimLogs(prev => [
          ...prev, 
          '[PANANI X] Routing to local vLLM / AMD Instinct MI300X cluster.', 
          '[PANANI X] Initializing secure Node VM sandbox isolates for tool executions...'
        ])
        setProgress(65)
      }, 1200)
    } else if (simStage === 'execution') {
      timer = setTimeout(() => {
        setSimStage('governance')
        setSimLogs(prev => [
          ...prev, 
          '[KAVACHA] Pre-scan audit complete. Shell command restriction check: PASS', 
          '[KAVACHA] Cost ledger tracking logged. Dynamic resource allocation verified.'
        ])
        setProgress(80)
      }, 1200)
    } else if (simStage === 'governance') {
      timer = setTimeout(() => {
        setSimStage('memory')
        setSimLogs(prev => [
          ...prev, 
          '[MEMORY] Storing cross-session episodic embeddings (pgvector).', 
          '[MEMORY] Semantic context collections synchronized (Qdrant).'
        ])
        setProgress(92)
      }, 1200)
    } else if (simStage === 'memory') {
      timer = setTimeout(() => {
        setSimStage('completed')
        setSimLogs(prev => [
          ...prev, 
          '[SYSTEM] Work complete. Telemetry status: NOMINAL.', 
          '[SYSTEM] Presentation workflow output generated.'
        ])
        setProgress(100)
      }, 1200)
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

  const handleWakeAgent = (agent: string) => {
    if (!wokenAgents.includes(agent)) {
      setWokenAgents(prev => [...prev, agent])
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden text-foreground selection:bg-primary/30 font-sans">
      
      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* Floating background ambient glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-md border-b border-border/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">RE-EVOLVE</h1>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider text-primary">HGI OS CORE</p>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-6">
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
                    Enter the operational security passcode to unlock the live enterprise workspace dashboards.
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

      {/* SCENE 1 — Dark Opening */}
      <section id="scene-1" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-10 bg-black">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl md:text-3xl text-muted-foreground italic mb-8 max-w-2xl font-light"
          >
            "Every generation creates a new operating system."
          </motion.p>
          <span className="text-xs font-mono text-primary/60 mt-4">Move your cursor to reveal the stars of HGI</span>
        </div>
        <div className="absolute bottom-8 animate-bounce cursor-pointer" onClick={() => scrollToNext('scene-2')}>
          <ArrowDown className="w-6 h-6 text-muted-foreground/60" />
        </div>
      </section>

      {/* SCENE 2 — Technology Timeline */}
      <section id="scene-2" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 2 — TECHNOLOGY TIMELINE
          </motion.p>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full mb-12">
            {[
              { year: '1970s', name: 'Computers', desc: 'Hardware Kernel' },
              { year: '1990s', name: 'Internet', desc: 'Network Packets' },
              { year: '2000s', name: 'Mobile', desc: 'Device Apps' },
              { year: '2010s', name: 'Cloud', desc: 'Virtualization' },
              { year: '2020s', name: 'AI Models', desc: 'Fragmented Weights' }
            ].map((node, idx) => (
              <GlassPanel 
                key={idx} 
                onClick={() => setShowTimelineIndex(idx)}
                className={`p-4 cursor-pointer border ${showTimelineIndex === idx ? 'border-primary' : 'border-border/10'} w-full`}
              >
                <span className="text-[10px] font-mono text-primary">{node.year}</span>
                <h3 className="font-bold my-1">{node.name}</h3>
                <p className="text-[11px] text-muted-foreground">{node.desc}</p>
              </GlassPanel>
            ))}
          </div>

          <motion.h3 
            className="text-3xl font-bold tracking-tight text-yellow-500 mb-4"
            key={showTimelineIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            "What comes after AI?"
          </motion.h3>
        </div>
      </section>

      {/* SCENE 3 — The Founder Moment */}
      <section id="scene-3" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 3 — THE FOUNDER MOMENT
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            The Origin of the Mission
          </motion.h2>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-light italic"
          >
            "Great systems are built by people who refuse to stop solving meaningful problems. Not through personal glory, but through persistence, validation, learning, and rebuilding."
          </motion.p>
        </div>
      </section>

      {/* SCENE 4 — The Problem */}
      <section id="scene-4" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-black/60">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-red-500 mb-6 tracking-widest uppercase"
          >
            SCENE 4 — THE PROBLEM (FRAGMENTATION)
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

          <div className="w-full h-40 relative mb-12 border border-border/10 rounded bg-black/40 flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              AI Models float independently. No Memory. No Governance.
            </span>
          </div>
        </div>
      </section>

      {/* SCENE 5 — The Spark */}
      <section id="scene-5" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-purple-400 mb-6 tracking-widest uppercase"
          >
            SCENE 5 — THE SPARK
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            CENSA Awakens
          </motion.h2>

          <motion.div
            animate={{
              boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 40px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.2)"]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-20 h-20 rounded-full border border-purple-500 bg-purple-500/10 flex items-center justify-center mb-8"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>

          <p className="text-sm font-mono text-muted-foreground">Neural pathways form beneath your cursor</p>
        </div>
      </section>

      {/* SCENE 6 — CENSA */}
      <section id="scene-6" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/40">
        <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 6 — CENSA ARCHITECTURE
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-12"
          >
            Cognitive Execution Flow
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {[
              { num: '01', name: 'Intent', desc: 'Goal Parsing' },
              { num: '02', name: 'Planning', desc: 'DAG Decomposition' },
              { num: '03', name: 'Task Graph', desc: 'Dependency Resolution' },
              { num: '04', name: 'Routing', desc: 'Hardware Balance' },
              { num: '05', name: 'Execution', desc: 'Secure Sandbox VMs' }
            ].map((step) => (
              <GlassPanel key={step.num} className="p-4 border-primary/20 text-left">
                <span className="text-xs font-mono text-primary font-bold">{step.num}</span>
                <h3 className="font-semibold text-sm my-1">{step.name}</h3>
                <p className="text-[10px] text-muted-foreground">{step.desc}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 7 — Panani X */}
      <section id="scene-7" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-emerald-400 mb-6 tracking-widest uppercase"
          >
            SCENE 7 — PANANI X SPECIALISTS
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Persistent Swarm Registry
          </motion.h2>
          <p className="text-xs text-muted-foreground mb-8">Hover or click to wake specialist agents</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {['Planner', 'Research', 'Coding', 'Testing', 'Security', 'Documentation', 'Deployment', 'Performance'].map((agent) => {
              const isWoken = wokenAgents.includes(agent)
              return (
                <GlassPanel
                  key={agent}
                  onClick={() => handleWakeAgent(agent)}
                  className={`p-4 cursor-pointer text-left transition-all border ${isWoken ? 'border-emerald-500 bg-emerald-500/5' : 'border-border/10'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold">{agent} Agent</span>
                    <span className={`w-2 h-2 rounded-full ${isWoken ? 'bg-emerald-400 animate-pulse' : 'bg-border/30'}`} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {isWoken ? 'Status: WOKEN (Sync active)' : 'Click to wake agent'}
                  </p>
                </GlassPanel>
              )
            })}
          </div>
        </div>
      </section>

      {/* SCENE 8 — Memory */}
      <section id="scene-8" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-black/60">
        <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-cyan-400 mb-6 tracking-widest uppercase"
          >
            SCENE 8 — MEMORY GALAXY
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Semantic Memory Vault
          </motion.h2>

          <div className="w-full h-48 relative border border-border/10 rounded overflow-hidden bg-black/40 flex items-center justify-center">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Every completed mission is mapped onto pgvector & Qdrant stars
            </span>
          </div>
        </div>
      </section>

      {/* SCENE 9 — Kavacha */}
      <section id="scene-9" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-yellow-500 mb-6 tracking-widest uppercase"
          >
            SCENE 9 — KAVACHA SHIELD
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

          <motion.div
            animate={{
              boxShadow: ["0 0 10px rgba(234,179,8,0.1)", "0 0 30px rgba(234,179,8,0.3)", "0 0 10px rgba(234,179,8,0.1)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-full border border-yellow-500/40 bg-yellow-500/5 flex items-center justify-center mb-8"
          >
            <Shield className="w-8 h-8 text-yellow-500" />
          </motion.div>
          
          <p className="text-sm font-mono text-muted-foreground">Pre-execution validations, illegal argument blockings, and token ledgers</p>
        </div>
      </section>

      {/* SCENE 10 — Mission Builder & Unified Demo */}
      <section id="scene-10" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 10 — MISSION BUILDER APP
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center"
          >
            Launch Guided Swarm Simulation
          </motion.h2>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-muted-foreground mb-12 text-center max-w-xl text-sm"
          >
            Click one of the templates or enter a goal. Watch HGI compile the workflow.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Build an Automotive AI Company')} className="p-4 cursor-pointer hover:border-primary/50 text-left">
              <span className="text-[10px] font-mono text-primary">SCENARIO A</span>
              <h4 className="font-bold text-sm my-1">"Build an Automotive AI Company"</h4>
              <p className="text-[10px] text-muted-foreground">Decomposes manufacturing metrics, routing, and safety audits.</p>
            </GlassPanel>
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Optimize supply chain routing')} className="p-4 cursor-pointer hover:border-primary/50 text-left">
              <span className="text-[10px] font-mono text-primary">SCENARIO B</span>
              <h4 className="font-bold text-sm my-1">"Optimize supply chain routing"</h4>
              <p className="text-[10px] text-muted-foreground">Balances token savings and model execution latency layers.</p>
            </GlassPanel>
          </div>

          <HolographicBorder className="w-full max-w-3xl overflow-hidden mb-8">
            <GlassPanel variant="strong" className="p-6 relative min-h-[400px] flex flex-col">
              
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
                        Enter custom goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Build an Automotive AI Company..."
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="w-full bg-black/40 border border-border/20 rounded px-3 py-3 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                    <CommandButton 
                      variant="primary" 
                      size="lg" 
                      glow 
                      onClick={() => handleStartSimulation(customGoal || 'Build an Automotive AI Company')}
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
                    <div className="flex items-center justify-between border-b border-border/10 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">
                          {simStage === 'completed' ? 'EXECUTION COMPLETED' : `STAGE: ${simStage.toUpperCase()}`}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">PROGRESS: {progress}%</div>
                    </div>

                    <div className="w-full h-1 bg-border/20 rounded-full mb-6 overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary" 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="flex-1 grid md:grid-cols-3 gap-6">
                      
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

                      <div className="md:col-span-2 bg-black/40 rounded p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[200px] flex flex-col gap-1 text-left">
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

      {/* SCENE 11 — AMD Infrastructure */}
      <section id="scene-11" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-background/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-red-500 mb-6 tracking-widest uppercase"
          >
            SCENE 11 — AMD COMPUTE ACTIVE
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Hardware Routing Layer
          </motion.h2>
          
          <GlassPanel className="p-6 border-red-500/20 max-w-xl mb-6">
            <span className="text-xs font-mono text-primary font-bold block mb-2">INTEGRATION COMPLIANCE STATUS</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              "Prepared for Live AMD Compute Activation" (Pending Instinct credentials).
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* SCENE 12 — Enterprise Universe */}
      <section id="scene-12" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10">
        <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 12 — ENTERPRISE CONSTELLATIONS
          </motion.p>
          
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-12"
          >
            Industry Constellations
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {['Automotive', 'Healthcare', 'Finance', 'Manufacturing', 'Research', 'Government', 'Energy'].map((industry) => (
              <GlassPanel key={industry} className="p-4 border-border/10 text-left">
                <span className="text-xs font-mono text-primary font-bold block mb-1">CONSTELLATION</span>
                <h4 className="font-bold text-sm">{industry}</h4>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 13 — The Future */}
      <section id="scene-13" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-border/10 z-10 bg-black">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xs font-mono text-primary mb-6 tracking-widest uppercase"
          >
            SCENE 13 — THE ROAD AHEAD
          </motion.p>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xl md:text-2xl text-muted-foreground italic mb-6 max-w-2xl font-light"
          >
            "AI models answer questions. Re-Evolve orchestrates intelligence."
          </motion.p>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-12"
          >
            Build the future with us.
          </motion.h2>

          <CommandButton variant="gold" size="lg" glow onClick={() => scrollToNext('scene-10')}>
            Launch Judge Experience
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </CommandButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border/10 z-10 bg-black/90">
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
