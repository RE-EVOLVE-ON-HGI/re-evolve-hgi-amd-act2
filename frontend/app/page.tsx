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
  HelpCircle,
  Network,
  CpuIcon,
  Compass,
  FileText,
  Workflow,
  Search,
  Check,
  TrendingUp,
  ExternalLink,
  ChevronRight
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
  const [wokenAgents, setWokenAgents] = useState<string[]>(['Planner', 'Coding'])
  
  // EIR interactive stage
  const [activeEirStage, setActiveEirStage] = useState(0)
  
  // Roadmap interactive stage
  const [activeRoadmapStage, setActiveRoadmapStage] = useState(0)

  // AMD vs Fireworks router simulator states
  const [selectedRouteMetric, setSelectedRouteMetric] = useState<'latency' | 'cost' | 'vram'>('latency')

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
      if (mousePos.x > 0 && mousePos.y > 0 && Math.random() < 0.3) {
        particles.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2 + 1,
          alpha: 0.8
        })
      }

      // Draw and prune particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.012

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          i--
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha * 0.7})` // Golden particle glow
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
      '[SYSTEM] Booting HGI intelligence session...',
      `[CENSA] Parsing mission objective: "${goalText}"`,
      '[CENSA] Analyzing syntactic constraints...'
    ])
    setProgress(15)
    
    // Smoothly scroll to the simulation section (Scene 9)
    const simSection = document.getElementById('scene-9')
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
          '[CENSA] Intent classified: REPOSITORY_INTELLIGENCE & CODEGEN', 
          '[CENSA] Initiating Task Directed Acyclic Graph (DAG) generation...',
          '[EIR] Analyzing codebase structure and AST tokens...'
        ])
        setProgress(32)
      }, 1000)
    } else if (simStage === 'planning') {
      timer = setTimeout(() => {
        setSimStage('routing')
        setSimLogs(prev => [
          ...prev, 
          '[CENSA] Compiled Task DAG with 4 dependencies resolved.', 
          '[ROUTER] Dynamic routing trigger: AMD Instinct MI300X cluster.',
          '[ROUTER] Fallback check: Fireworks Llama-3.1-405B standby.'
        ])
        setProgress(50)
      }, 1000)
    } else if (simStage === 'routing') {
      timer = setTimeout(() => {
        setSimStage('execution')
        setSimLogs(prev => [
          ...prev, 
          '[PANANI X] Waking specialist agents: Planner, Coding, Testing.', 
          '[PANANI X] Initiating context compression (pxpipe reduced token payload by 52%).',
          '[SANDBOX] Instantiating isolated Node VM environments for testing...'
        ])
        setProgress(68)
      }, 1000)
    } else if (simStage === 'execution') {
      timer = setTimeout(() => {
        setSimStage('governance')
        setSimLogs(prev => [
          ...prev, 
          '[KAVACHA] Pre-scan audit starting.', 
          '[KAVACHA] Shell command injection protection: PASS', 
          '[KAVACHA] Cost limit checker: PASS (0.012/1.00 USD consumed)'
        ])
        setProgress(82)
      }, 1000)
    } else if (simStage === 'governance') {
      timer = setTimeout(() => {
        setSimStage('memory')
        setSimLogs(prev => [
          ...prev, 
          '[MEMORY] Querying episodic memories in Memory Vault...',
          '[MEMORY] 3 relevant semantic blocks discovered.',
          '[MEMORY] Injecting historical lessons into execution context.'
        ])
        setProgress(93)
      }, 1000)
    } else if (simStage === 'memory') {
      timer = setTimeout(() => {
        setSimStage('completed')
        setSimLogs(prev => [
          ...prev, 
          '[SYSTEM] Swarm coordination completed successfully.', 
          '[SYSTEM] Telemetry nominal. Deliverables compiled.',
          '[SYSTEM] Release audit verified.'
        ])
        setProgress(100)
      }, 1000)
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
    } else {
      setWokenAgents(prev => prev.filter(a => a !== agent))
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden text-foreground selection:bg-yellow-500/30 font-sans">
      
      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-50" />

      {/* Floating background ambient glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/10">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                RE-EVOLVE <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded font-mono">HGI OS</span>
              </h1>
              <p className="text-[9px] text-zinc-400 font-mono tracking-wider">HUMAN-GOVERNED INTEGRATION</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/60 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-300">ROCm 7.2 INSTINCT MI300X ACTIVE</span>
            </div>
            <CommandButton variant="primary" size="sm" glow onClick={() => setShowPasscodeModal(true)}>
              Enter Workspace
              <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </CommandButton>
          </div>
        </div>
      </nav>

      {/* Passcode Security Modal */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md px-6">
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
                    className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    Security Verification Required
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Enter the operational passcode to decrypt and unlock the live enterprise workspace and agent logs.
                  </p>
                  
                  <form onSubmit={handleVerifyPasscode} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Enter Passcode..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 uppercase tracking-widest text-center text-white placeholder:text-zinc-600"
                      required
                      autoFocus
                    />
                    {passcodeError && (
                      <p className="text-xs text-yellow-500 font-mono text-center">
                        {passcodeError}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-1">
                      <span>Passcode hint: AMD-GOLD</span>
                    </div>
                    <CommandButton variant="primary" size="sm" type="submit" glow>
                      Decrypt & Enter Workspace
                    </CommandButton>
                  </form>
                </GlassPanel>
              </HolographicBorder>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* SCENE 1: THE AWAKENING */}
      {/* ======================================================== */}
      <section id="scene-1" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-10 bg-black pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.06),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-0.5 shadow-2xl shadow-yellow-500/20 mb-8"
          >
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <Brain className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            RE-EVOLVE ON <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">HGI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mb-12 leading-relaxed"
          >
            The Operating System for Engineering Intelligence. Orchestrating multi-agent networks on AMD Instinct architecture with zero-friction compliance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12"
          >
            {[
              { label: 'Specialist Agents', value: '14+' },
              { label: 'Engineering Skills', value: '36+' },
              { label: 'Missions Orchestrated', value: '128+' },
              { label: 'Compute Speedup', value: '2.1x AMD' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm text-center">
                <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full"
          >
            <CommandButton variant="primary" size="lg" glow onClick={() => scrollToNext('scene-9')}>
              Initialize Swarm Demo
            </CommandButton>
            <CommandButton variant="subtle" size="lg" onClick={() => scrollToNext('scene-2')}>
              Start Presentation Scroll
              <ArrowDown className="w-4 h-4 ml-2 inline animate-bounce" />
            </CommandButton>
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 2: THE PROBLEM */}
      {/* ======================================================== */}
      <section id="scene-2" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full">
              SCENE 2 — THE CRISIS IN MODERN AI
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              The Fragmentation Collapse
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Why traditional LLM wrappers, fragmented agents, and stateless pipelines collapse under enterprise workloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="border border-red-500/10 bg-zinc-900/20 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Fragmented AI (The Old Way)</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Isolated chat windows, stateless workflows, manual copy-pasting, and raw prompt engineering that fails when files scale.
                </p>
                <ul className="space-y-3 font-mono text-xs text-zinc-500">
                  <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Stateless context decay</li>
                  <li className="flex items-center gap-2"><span className="text-red-500">✗</span> No integration with git or testing</li>
                  <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Zero policy audits or cost control</li>
                  <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Single-prompt execution traps</li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-xs font-mono text-zinc-500">
                Result: Developer fatigue & pipeline fragmentation.
              </div>
            </div>

            {/* Re-Evolve Way */}
            <div className="border border-yellow-500/20 bg-zinc-900/30 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl" />
              <div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Re-Evolve Statefulness (The HGI Way)</h3>
                <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                  A comprehensive, memory-persistent framework where agents cooperate under a unified, sandboxed runtime environment.
                </p>
                <ul className="space-y-3 font-mono text-xs text-yellow-400">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Infinite episodic memory vectors</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Complete AST codebase intelligence</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Kavacha zero-trust governance limits</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Automatic hardware cost routing</li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-xs font-mono text-yellow-400/80">
                Result: Fully verified production systems.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 3: THE JOURNEY */}
      {/* ======================================================== */}
      <section id="scene-3" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 3 — THE TIMELINE OF INNOVATION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              The Path to Production
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              A timeline of relentless engineering, scaling from early concepts to verified hardware validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
            {[
              { year: '2023', stage: 'THE SEED', title: 'Conceptualization', desc: 'First draft of memory-persistent agents.' },
              { year: '2024', stage: 'THE RUNTIME', title: 'Panani X Engine', desc: 'Created sandbox VM execution loops.' },
              { year: 'Early 2025', stage: 'GOVERNANCE', title: 'Kavacha Active', desc: 'Secure AST scanning and shell validation.' },
              { year: 'Late 2025', stage: 'HARDWARE', title: 'AMD Instinct MI300X', desc: 'GPU-accelerated vLLM clusters with ROCm.' },
              { year: '2026', stage: 'ENTERPRISE', title: 'Production OS', desc: 'Automotive and aerospace systems integration.' }
            ].map((node, idx) => (
              <GlassPanel 
                key={idx} 
                onClick={() => setShowTimelineIndex(idx)}
                className={`p-5 cursor-pointer border transition-all duration-300 ${showTimelineIndex === idx ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-yellow-500">{node.year}</span>
                  <span className="text-[9px] font-mono text-zinc-500">{node.stage}</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{node.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{node.desc}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 4: THE BIRTH OF HGI */}
      {/* ======================================================== */}
      <section id="scene-4" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 4 — THE HGI ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-6">
              The Five Core Pillars
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              HGI is not an abstraction layer—it is an engine built with five co-dependent runtimes working in continuous feedback loops.
            </p>

            <div className="space-y-4">
              {[
                { name: 'CENSA', desc: 'The orchestrator parsing goals into structured Task DAGs.' },
                { name: 'Panani X', desc: 'The specialist registry spawning safe isolated task agents.' },
                { name: 'Memory Vault', desc: 'Episodic memory vector store providing cross-mission learnings.' },
                { name: 'Kavacha', desc: 'Real-time structural security shielding the host environment.' },
                { name: 'Engineering Runtime', desc: 'AST parsing and automated compilation lifecycle.' }
              ].map((pillar, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center font-mono text-yellow-500 text-xs font-bold border border-yellow-500/20 shrink-0">
                    0{idx+1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{pillar.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-md mx-auto flex items-center justify-center">
            {/* Spinning orbital elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border border-dashed border-white/10 rounded-full flex items-center justify-center"
            >
              <div className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="absolute bottom-0 w-3 h-3 bg-amber-500 rounded-full" />
            </motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-12 border border-dashed border-white/10 rounded-full flex items-center justify-center"
            >
              <div className="absolute left-0 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
              <div className="absolute right-0 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </motion.div>
            
            <div className="z-10 text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-yellow-500/10">
                <Brain className="w-10 h-10 text-yellow-400" />
              </div>
              <span className="text-[10px] font-mono text-yellow-500 tracking-wider">HGI CORE RUNTIME</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 5: ARCHITECTURE GALAXY */}
      {/* ======================================================== */}
      <section id="scene-5" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 5 — INTERACTIVE GALAXY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              The Architecture Galaxy Map
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Hover over modules to understand data flows and hardware interconnectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:border-yellow-500/30 transition-all group">
              <Network className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2">Swarm Node Registry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Dynamic resolution of agent capabilities. Registry matches request AST markers to specialized capabilities.
              </p>
              <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">Registry Sync Active</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:border-yellow-500/30 transition-all group">
              <CpuIcon className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2">Hardware Routing Mesh</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Balances workloads dynamically between local Instinct GPU cluster (vLLM ROCm) and remote Fireworks API endpoints.
              </p>
              <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">Latency Map Loaded</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:border-yellow-500/30 transition-all group">
              <Database className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2">Vector Memory Mesh</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Bi-directional vector links between pgvector and Qdrant clusters. Captures context tags for sub-agent planning.
              </p>
              <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">Vault Schema Valid</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 6: ENGINEERING INTELLIGENCE RUNTIME */}
      {/* ======================================================== */}
      <section id="scene-6" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 6 — THE EIR ASSEMBLY LINE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Engineering Intelligence Runtime (EIR)
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The lifecycle of a code compilation task. Select a step to trace the execution cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-2">
              {[
                { name: '1. Requirement Parsing', icon: FileText },
                { name: '2. Codebase AST Indexing', icon: Search },
                { name: '3. Task DAG Compilation', icon: Workflow },
                { name: '4. Swarm Execution', icon: Users },
                { name: '5. Pre-Scan Validation', icon: Shield },
                { name: '6. Sandbox Testing', icon: Terminal },
                { name: '7. Continuous Learning', icon: Brain }
              ].map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveEirStage(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all ${activeEirStage === idx ? 'border-yellow-500 bg-yellow-500/10 text-white font-semibold' : 'border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-zinc-700'}`}
                >
                  <step.icon className={`w-4 h-4 ${activeEirStage === idx ? 'text-yellow-400' : 'text-zinc-500'}`} />
                  <span className="text-xs font-mono">{step.name}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <HolographicBorder>
                <GlassPanel variant="strong" className="p-8 min-h-[340px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {activeEirStage === 0 && 'Requirement Parsing'}
                      {activeEirStage === 1 && 'Codebase AST Indexing'}
                      {activeEirStage === 2 && 'Task DAG Compilation'}
                      {activeEirStage === 3 && 'Swarm Execution'}
                      {activeEirStage === 4 && 'Pre-Scan Validation'}
                      {activeEirStage === 5 && 'Sandbox Testing'}
                      {activeEirStage === 6 && 'Continuous Learning'}
                    </h3>
                    
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                      {activeEirStage === 0 && 'CENSA parses the natural language description, extract functional specifications, and produces a normalized prompt map.'}
                      {activeEirStage === 1 && 'The EIR extracts token coordinates and function definitions directly, filtering noise to reduce sub-agent token overhead by 52%.'}
                      {activeEirStage === 2 && 'Decomposes tasks into a parallelized graph where execution orders are enforced strictly based on import requirements.'}
                      {activeEirStage === 3 && 'Agents from the registry are spawned in safe virtual environments to execute their designated tasks.'}
                      {activeEirStage === 4 && 'Kavacha monitors token scopes, illegal commands, and verifies syntax before writing files to the workspace.'}
                      {activeEirStage === 5 && 'Tests are executed inside secure sandboxed shell environments to ensure code builds without throwing errors.'}
                      {activeEirStage === 6 && 'On success, logs, AST diffs, and context maps are embedded and stored in the vector vault for future reference.'}
                    </p>

                    <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[11px] text-yellow-500">
                      {activeEirStage === 0 && '>> [EIR-LOG] Specs loaded: 14 parameters identified.'}
                      {activeEirStage === 1 && '>> [EIR-LOG] AST coordinates updated for backend services.'}
                      {activeEirStage === 2 && '>> [EIR-LOG] Task DAG ready. Parallel steps: 3.'}
                      {activeEirStage === 3 && '>> [EIR-LOG] Specialist swarm launched. Active sockets: 4.'}
                      {activeEirStage === 4 && '>> [EIR-LOG] Pre-scan complete. Security threat: NULL.'}
                      {activeEirStage === 5 && '>> [EIR-LOG] Run command: "pnpm test" completed. Status: PASS.'}
                      {activeEirStage === 6 && '>> [EIR-LOG] Episode serialized to pgvector vault. Embeddings updated.'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-zinc-500 font-mono pt-6 border-t border-white/5">
                    <span>Active Stage: {activeEirStage + 1} of 7</span>
                    <span>System State: NOMINAL</span>
                  </div>
                </GlassPanel>
              </HolographicBorder>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 7: PANANI X - AGENT ORCHESTRATION */}
      {/* ======================================================== */}
      <section id="scene-7" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 7 — SWARM REGISTRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Panani X Agent Registry
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Toggle agent status to witness swarm behavior and context coordination.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['Planner', 'Research', 'Coding', 'Testing', 'Security', 'Documentation', 'Deployment', 'Performance'].map((agent) => {
              const isWoken = wokenAgents.includes(agent)
              return (
                <GlassPanel
                  key={agent}
                  onClick={() => handleWakeAgent(agent)}
                  className={`p-4 cursor-pointer text-left transition-all border ${isWoken ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white">{agent} Agent</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${isWoken ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-800'}`} />
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    {isWoken ? 'STATUS: ACTIVE (Swarm registry listening)' : 'STATUS: STANDBY (Click to activate)'}
                  </p>
                </GlassPanel>
              )
            })}
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 text-center max-w-xl mx-auto">
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Swarm sync completed. Active registry handles are coordinating with the <span className="text-yellow-500 font-bold">Memory Vault</span> pgvector cluster.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 8: CENSA - THE ORCHESTRATION BRAIN */}
      {/* ======================================================== */}
      <section id="scene-8" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 8 — EXECUTION GRAPH
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              CENSA Reasoning Graph
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The internal dependency DAG generated for complex requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { title: '1. Goal Intent', desc: 'Identify core deliverables and compile target AST dependencies.' },
              { title: '2. Task Extraction', desc: 'Break goal down into independent modules with strict interfaces.' },
              { title: '3. Routing Layer', desc: 'Select models based on context requirements (AMD GPU vs Fireworks).' },
              { title: '4. Verification Scan', desc: 'Perform security scan, execute testing pipelines, compile reports.' }
            ].map((node, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xs font-mono text-yellow-400 font-bold">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{node.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 9: LIVE MISSION & SIMULATOR */}
      {/* ======================================================== */}
      <section id="scene-9" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 9 — INTERACTIVE SIMULATION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Execution Control Center
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
              Input a customized mission objective or click a preset below to see the HGI state machine coordinate in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Build an Automotive AI Company')} className="p-4 cursor-pointer hover:border-yellow-500/50 text-left">
              <span className="text-[10px] font-mono text-yellow-500">SCENARIO A</span>
              <h4 className="font-bold text-sm my-1 text-white">"Build an Automotive AI Company"</h4>
              <p className="text-[10px] text-zinc-400">Decomposes manufacturing metrics, routing, and safety audits.</p>
            </GlassPanel>
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Optimize supply chain routing')} className="p-4 cursor-pointer hover:border-yellow-500/50 text-left">
              <span className="text-[10px] font-mono text-yellow-500">SCENARIO B</span>
              <h4 className="font-bold text-sm my-1 text-white">"Optimize supply chain routing"</h4>
              <p className="text-[10px] text-zinc-400">Balances token savings and model execution latency layers.</p>
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
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        Enter custom mission goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Design a space station telemetry scanner..."
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-500/50 text-white"
                      />
                    </div>
                    <CommandButton 
                      variant="primary" 
                      size="lg" 
                      glow 
                      onClick={() => handleStartSimulation(customGoal || 'Build an Automotive AI Company')}
                    >
                      Launch Simulation
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
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                          {simStage === 'completed' ? 'EXECUTION COMPLETED' : `STAGE: ${simStage.toUpperCase()}`}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-400">PROGRESS: {progress}%</div>
                    </div>

                    <div className="w-full h-1 bg-zinc-900 rounded-full mb-6 overflow-hidden">
                      <motion.div 
                        className="h-full bg-yellow-500" 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="flex-1 grid md:grid-cols-3 gap-6">
                      
                      <div className="md:col-span-1 border-r border-white/5 pr-4 flex flex-col gap-3 justify-center text-left">
                        {[
                          { id: 'intent', label: 'Goal Parsed' },
                          { id: 'planning', label: 'DAG Created' },
                          { id: 'routing', label: 'AMD GPU Selected' },
                          { id: 'execution', label: 'Swarm Active' },
                          { id: 'governance', label: 'Kavacha Passed' },
                          { id: 'memory', label: 'Memory Injected' }
                        ].map((s) => {
                          const isPassed = ['completed', 'memory', 'governance', 'execution', 'routing', 'planning', 'intent'].indexOf(simStage) > ['completed', 'memory', 'governance', 'execution', 'routing', 'planning', 'intent'].indexOf(s.id as any)
                          const isActive = simStage === s.id
                          return (
                            <div key={s.id} className="flex items-center gap-2 text-xs font-mono">
                              {isPassed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : isActive ? (
                                <div className="w-4 h-4 rounded-full border border-yellow-500 animate-pulse flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-zinc-800" />
                              )}
                              <span className={isActive ? 'text-yellow-500 font-bold' : isPassed ? 'text-emerald-400' : 'text-zinc-500'}>
                                {s.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="md:col-span-2 bg-zinc-950/80 rounded p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[220px] flex flex-col gap-1 text-left border border-white/5">
                        {simLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={log.startsWith('[SYSTEM]') ? 'text-yellow-500' : log.startsWith('[KAVACHA]') ? 'text-emerald-400' : 'text-zinc-400'}
                          >
                            {log}
                          </div>
                        ))}
                        {simStage !== 'completed' && (
                          <span className="text-yellow-500 animate-pulse">▋</span>
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
                          Compliance & Verification Report Compiled Successfully
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-y border-white/5 py-2">
                          <div>
                            <p className="text-zinc-500">Token Efficiency</p>
                            <p className="text-xs font-bold text-white">~52% via pxpipe</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Failover Latency</p>
                            <p className="text-xs font-bold text-white">&lt;226ms</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Primary Cluster</p>
                            <p className="text-xs font-bold text-white">ROCm 7.2 Instinct</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <CommandButton variant="subtle" size="sm" onClick={handleResetSim}>
                            Reset Control Console
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

      {/* ======================================================== */}
      {/* SCENE 10: LIVE INTELLIGENCE DASHBOARD */}
      {/* ======================================================== */}
      <section id="scene-10" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 10 — TELEMETRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Real-Time OS Telemetry
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Monitor execution layers, API latency bounds, memory indexes, and hardware queues directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Inference Latency', value: '226ms', change: '-48% (cached)', desc: 'Mean token production bounds.' },
              { title: 'Vector Memory Load', value: '78.2%', change: 'Nominal', desc: 'Memory Vault indexing metrics.' },
              { title: 'Task Success Rate', value: '96.7%', change: '+1.4% this week', desc: 'Auto-recovery success rating.' },
              { title: 'Job Queue Size', value: '32 items', change: '0 bottleneck', desc: 'Parallel swarm task scheduler.' }
            ].map((metric, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-2">{metric.title}</span>
                  <span className="text-3xl font-bold text-white font-mono">{metric.value}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">{metric.desc}</span>
                  <span className="text-yellow-500 font-semibold">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 11: AMD + FIREWORKS */}
      {/* ======================================================== */}
      <section id="scene-11" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 11 — ROUTER ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Adaptive Router Selection
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Trace routing calculations based on model size, target latency constraints, and hardware status.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* AMD Instinct local */}
            <div className="border border-white/5 bg-zinc-900/20 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono text-yellow-400">PRIMARY NODE</span>
                  <StatusBadge status="online" label="ROCm 7.2 ACTIVE" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AMD Instinct MI300X</h3>
                <p className="text-zinc-400 text-xs mb-6">
                  Private localized hardware endpoint serving large weight models securely without egress pipelines.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>GPU Utilization</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[68%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>VRAM Allocation</span>
                      <span>14.2 GB / 192 GB</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[8%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                Primary use case: Secure Code Generation & Context Parsing.
              </div>
            </div>

            {/* Fireworks Cloud */}
            <div className="border border-white/5 bg-zinc-900/20 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono text-zinc-500">STANDBY ROUTE</span>
                  <StatusBadge status="online" label="ENDPOINT NOMINAL" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Fireworks AI API</h3>
                <p className="text-zinc-400 text-xs mb-6">
                  Cloud failover cluster hosting multi-hundred billion parameter parameters with extremely rapid tokens-per-second capabilities.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>Tokens / Sec</span>
                      <span>18.7K / sec</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-yellow-500/50 h-full w-[88%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>Endpoint Latency</span>
                      <span>145ms</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-yellow-500/50 h-full w-[12%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                Fallback use case: Complex Reasoning & Swarm Consensus Voting.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 12: ENTERPRISE USE CASES */}
      {/* ======================================================== */}
      <section id="scene-12" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 12 — ENTERPRISE CONSTELLATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Verified Industry Segments
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              HGI is architected for complex software domains where system failure is not an option.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Automotive Intelligence', desc: 'Real-time vehicle firmware, CAN bus message translation, and safety verification loops.', metric: 'ROCm validated' },
              { title: 'Clinical Diagnostics', desc: 'Traceable healthcare decisions, patient intake sanitization, and structured health charts.', metric: 'HIPAA sanitization ready' },
              { title: 'Financial Risk Systems', desc: 'Secure asset management, portfolio simulation, and automated regulatory reporting.', metric: 'Kavacha isolated' },
              { title: 'Aerospace Engineering', desc: 'Structural flight mission planning, command orchestration, and system reliability auditing.', metric: 'AST mapping active' },
              { title: 'Robotics Perception', desc: 'Decentralized control swarm coordination, sensor telemetry validation, and failure recovery.', metric: '226ms latency limit' },
              { title: 'Manufacturing Operations', desc: 'Predictive maintenance planning, supply chain graph orchestration, and automated inventory.', metric: 'DTS integrated' }
            ].map((useCase, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-yellow-500/20 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-wider block mb-2">{useCase.metric}</span>
                  <h4 className="font-bold text-white text-base mb-3">{useCase.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{useCase.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    Explore reference agent <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 13: WHY IT MATTERS */}
      {/* ======================================================== */}
      <section id="scene-13" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-black py-24">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full mb-8">
            SCENE 13 — THE EVOLUTION ARROW
          </span>
          
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl md:text-3xl text-zinc-300 italic mb-12 max-w-2xl font-light leading-relaxed"
          >
            "Models answer questions. Assistants write drafts. Re-Evolve orchestrates entire engineering departments."
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
            {[
              { stage: 'AI Assistants', desc: 'Single user interactions answering basic questions. Short session lifespan.' },
              { stage: 'AI Teams', desc: 'Multiple agents coordinating under simple script parameters. No compliance limits.' },
              { stage: 'AI Organizations', desc: 'Complex cross-functional swarms mapping business deliverables.' },
              { stage: 'Intelligence OS', desc: 'Fully persistent, self-auditing, hardware-bound runtime running operations.' }
            ].map((evo, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-yellow-500 block mb-2">STAGE 0{idx+1}</span>
                <h4 className="font-bold text-white text-sm mb-2">{evo.stage}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{evo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 14: EXPLORATIVE ROADMAP */}
      {/* ======================================================== */}
      <section id="scene-14" className="relative min-h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-zinc-950/60 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              SCENE 14 — DEVELOPER ROADMAP
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              The Horizon Roadmap
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Click on roadmap milestones to explore the launch schedule and capability milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { phase: 'Phase 1', title: 'Hackathon Lock', date: 'TODAY (July 2026)', desc: 'Validated ROCm backend and multi-agent core execution loops.' },
              { phase: 'Phase 2', title: 'Developer Preview', date: 'Q3 2026', desc: 'Initial SDK release to selected enterprise sandbox testers.' },
              { phase: 'Phase 3', title: 'Enterprise Release', date: 'Q1 2027', desc: 'Production deployment configurations with secure HSM key locks.' },
              { phase: 'Phase 4', title: 'Open Ecosystem', date: 'Q3 2027', desc: 'Self-hosted agent registry hubs and shared community skills.' }
            ].map((item, idx) => (
              <GlassPanel
                key={idx}
                onClick={() => setActiveRoadmapStage(idx)}
                className={`p-6 cursor-pointer border text-left transition-all duration-300 ${activeRoadmapStage === idx ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-yellow-500 font-bold">{item.phase}</span>
                  <span className="text-[9px] font-mono text-zinc-500">{item.date}</span>
                </div>
                <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 15: THE IMPACT */}
      {/* ======================================================== */}
      <section id="scene-15" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-10 bg-black py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,179,8,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full mb-8">
            SCENE 15 — THE IMPACT
          </span>
          
          <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Enter the living intelligence.
          </h2>

          <p className="text-zinc-400 text-sm md:text-lg max-w-xl mb-12 leading-relaxed">
            The future does not need another SaaS dashboard. It needs an Intelligence Operating System that executes, validates, and learns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <CommandButton variant="primary" size="lg" glow onClick={() => setShowPasscodeModal(true)}>
              Launch Judge Workspace
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </CommandButton>
            <CommandButton variant="subtle" size="lg" onClick={() => router.push('/hq')}>
              Explore Reference Agent
              <ExternalLink className="w-4 h-4 ml-2 inline" />
            </CommandButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5 z-10 bg-black/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">RE-EVOLVE ON HGI</p>
                <p className="text-[10px] text-zinc-500 font-mono">Human-Governed Adaptive Intelligence OS</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs font-mono text-zinc-500">
              <span>VERSION 2.0.0</span>
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              <StatusBadge status="online" label="ALL SYSTEMS NOMINAL" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
