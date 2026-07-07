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
  ChevronRight,
  Volume2,
  VolumeX
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
  const blueprintCanvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  
  // Custom Cursor Particle state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeScene, setActiveScene] = useState(1)
  const [showTimelineIndex, setShowTimelineIndex] = useState(0)
  const [wokenAgents, setWokenAgents] = useState<string[]>(['Planner', 'Coding'])
  
  // EIR interactive stage
  const [activeEirStage, setActiveEirStage] = useState(0)
  
  // Roadmap interactive stage
  const [activeRoadmapStage, setActiveRoadmapStage] = useState(0)

  // Audio Context State
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const humOscRef = useRef<OscillatorNode | null>(null)
  const humGainRef = useRef<GainNode | null>(null)

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

  // Toggle Sound with Web Audio API Initialization
  const toggleSound = () => {
    if (typeof window === 'undefined') return
    
    if (soundEnabled) {
      // Mute
      if (humOscRef.current) {
        try {
          humOscRef.current.stop()
        } catch(e){}
        humOscRef.current = null;
      }
      setSoundEnabled(false)
    } else {
      // Unmute & Initialize
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx

        // Create low hum oscillator
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(55, ctx.currentTime) // 55Hz bass hum

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(120, ctx.currentTime)

        gain.gain.setValueAtTime(0.06, ctx.currentTime) // low volume hum

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start()
        
        humOscRef.current = osc
        humGainRef.current = gain
        setSoundEnabled(true)
        playFeedbackSound(440, 0.08) // Soft boot tone
      } catch (err) {
        console.error("Web Audio API failed to load:", err)
      }
    }
  }

  // Play a brief high-frequency confirmation tick
  const playFeedbackSound = (frequency = 600, duration = 0.05) => {
    if (!soundEnabled || !audioCtxRef.current) return
    try {
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch(e){}
  }

  // Monitor Scroll Position to Track Active Scene Index (1 to 15)
  useEffect(() => {
    const handleScroll = () => {
      const sceneElements = Array.from({ length: 15 }, (_, i) => document.getElementById(`scene-${i + 1}`))
      const scrollPos = window.scrollY + window.innerHeight / 2

      for (let i = 0; i < sceneElements.length; i++) {
        const el = sceneElements[i]
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            if (activeScene !== i + 1) {
              setActiveScene(i + 1)
              playFeedbackSound(200 + (i * 40), 0.04) // Dynamic orbital sound feedback
            }
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeScene, soundEnabled])

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
      if (mousePos.x > 0 && mousePos.y > 0 && Math.random() < 0.35) {
        particles.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2 + 1,
          alpha: 0.85
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

  // Vehicle wireframe blueprint generator for Scene 9
  useEffect(() => {
    if (simStage !== 'completed') return
    const canvas = blueprintCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 480
    canvas.height = 180
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render glowing vehicle blueprint
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)' // Golden glow
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgba(234, 179, 8, 0.5)'

    // Chassis sleek lines
    ctx.beginPath()
    ctx.moveTo(40, 130)
    ctx.lineTo(80, 130)
    ctx.arc(110, 130, 24, Math.PI, 0) // Front wheel arch
    ctx.lineTo(310, 130)
    ctx.arc(340, 130, 24, Math.PI, 0) // Rear wheel arch
    ctx.lineTo(440, 130)
    ctx.lineTo(420, 90)
    ctx.lineTo(340, 70)
    ctx.lineTo(240, 30) // Windshield peak
    ctx.lineTo(150, 30) // Roof
    ctx.lineTo(90, 80) // Hood
    ctx.lineTo(40, 90)
    ctx.closePath()
    ctx.stroke()

    // Inner cabin / seats
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)'
    ctx.beginPath()
    ctx.moveTo(170, 45)
    ctx.lineTo(180, 85)
    ctx.lineTo(210, 85)
    ctx.moveTo(250, 45)
    ctx.lineTo(260, 85)
    ctx.lineTo(290, 85)
    ctx.stroke()

    // Drive axles & Battery pack
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)'
    ctx.strokeRect(140, 115, 170, 15)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.1)'
    ctx.fillRect(140, 115, 170, 15)

    // Wheels
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.9)'
    ctx.beginPath()
    ctx.arc(110, 130, 20, 0, Math.PI * 2)
    ctx.arc(340, 130, 20, 0, Math.PI * 2)
    ctx.stroke()

    // Wheels inner spokes
    ctx.beginPath()
    ctx.moveTo(110, 110)
    ctx.lineTo(110, 150)
    ctx.moveTo(90, 130)
    ctx.lineTo(130, 130)
    ctx.moveTo(340, 110)
    ctx.lineTo(340, 150)
    ctx.moveTo(320, 130)
    ctx.lineTo(360, 130)
    ctx.stroke()

    // Sensors & LIDAR lines
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)'
    ctx.beginPath()
    ctx.moveTo(200, 30)
    ctx.lineTo(180, 10)
    ctx.moveTo(200, 30)
    ctx.lineTo(220, 10)
    ctx.stroke()

    // Technical Labels
    ctx.fillStyle = 'rgba(234, 179, 8, 0.8)'
    ctx.font = '9px monospace'
    ctx.fillText("LIDAR MATRIX - OK", 140, 10)
    ctx.fillText("HGI OS CORE CONNECTED", 260, 125)
    ctx.fillText("ROCm VERIFIED RUNTIME", 40, 170)

  }, [simStage])

  const handleStartSimulation = (goalText: string) => {
    playFeedbackSound(800, 0.1)
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

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPass = passcode.trim().toUpperCase()
    if (cleanPass === 'AMD-GOLD' || cleanPass === 'NEXT-UNICORN') {
      playFeedbackSound(1200, 0.15)
      setShowPasscodeModal(false)
      router.push('/hq')
    } else {
      playFeedbackSound(300, 0.2)
      setPasscodeError('Invalid Passcode. Hint: Try AMD-GOLD')
    }
  }

  const handleResetSim = () => {
    playFeedbackSound(500, 0.05)
    setCustomGoal('')
    setSimActive(false)
    setSimStage('idle')
    setSimLogs([])
    setProgress(0)
  }

  const handleWakeAgent = (agent: string) => {
    playFeedbackSound(700, 0.05)
    if (!wokenAgents.includes(agent)) {
      setWokenAgents(prev => [...prev, agent])
    } else {
      setWokenAgents(prev => prev.filter(a => a !== agent))
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden text-foreground selection:bg-yellow-500/30 font-sans">
      
      {/* Fixed Ambient Stars / Cosmos */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(24,24,27,0.8),black)]" />
      <div className="fixed top-10 left-10 w-2 h-2 rounded-full bg-white/20 animate-pulse pointer-events-none" />
      <div className="fixed top-1/3 right-20 w-1.5 h-1.5 rounded-full bg-white/10 animate-ping pointer-events-none" />
      <div className="fixed bottom-24 left-1/4 w-2 h-2 rounded-full bg-white/15 animate-pulse pointer-events-none" />

      {/* Floating background ambient glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none opacity-50" />

      {/* ======================================================== */}
      {/* THE MAIN CHARACTER: INTELLIGENCE CORE (FIXED CONTAINER) */}
      {/* ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          
          {/* Main Core Body */}
          <motion.div
            animate={{
              scale: activeScene === 1 ? 0.2 : activeScene === 2 ? 1 : activeScene === 3 ? 1.3 : activeScene === 4 ? 0.8 : activeScene === 5 ? 1.5 : 1,
              opacity: activeScene === 15 ? 0 : [0.8, 1, 0.8]
            }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 15,
              opacity: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }}
            className={`rounded-full transition-all duration-700 flex items-center justify-center ${
              activeScene === 1 
                ? 'w-6 h-6 bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,1)]' 
                : activeScene === 11
                ? 'w-24 h-24 bg-gradient-to-br from-red-600 via-amber-500 to-yellow-500 shadow-[0_0_60px_rgba(220,38,38,0.7)]'
                : 'w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-[0_0_50px_rgba(234,179,8,0.6)]'
            }`}
          >
            {activeScene > 1 && (
              <Brain className={`w-10 h-10 ${activeScene === 11 ? 'text-white' : 'text-black'}`} />
            )}
          </motion.div>

          {/* Subsystems & Satellite Orbits (Scene 3 & 4) */}
          {(activeScene === 3 || activeScene === 4) && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-44 h-44 border border-dashed border-yellow-500/20 rounded-full"
            >
              <div className="absolute -top-1.5 left-[86px] w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,1)]" />
              <div className="absolute top-[86px] -left-1.5 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
              <div className="absolute top-[86px] -right-1.5 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)]" />
            </motion.div>
          )}

          {/* Galaxy Constellations (Scene 5) */}
          {activeScene === 5 && (
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-64 h-64 border border-dashed border-white/5 rounded-full flex items-center justify-center"
            >
              <div className="absolute top-0 w-2.5 h-2.5 bg-yellow-500 rounded-full" />
              <div className="absolute bottom-0 w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <div className="absolute left-0 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
              <div className="absolute right-0 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </motion.div>
          )}

          {/* circular Telemetry progress rings (Scene 10) */}
          {activeScene === 10 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute w-32 h-32 border-4 border-dashed border-yellow-500/30 rounded-full"
            />
          )}

        </div>
      </div>

      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5">
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
            <button 
              onClick={toggleSound}
              className="p-2 bg-zinc-900/60 rounded-full border border-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
              title={soundEnabled ? "Mute ambient audio" : "Unmute ambient audio"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

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

      {/* ======================================================== */}
      {/* SCENE 1: THE AWAKENING */}
      {/* ======================================================== */}
      <section id="scene-1" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-30 pt-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full mb-6">
            CHAPTER 01 — THE SINGULAR POINT
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            RE-EVOLVE ON <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">HGI</span>
          </motion.h1>
          <p className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mb-12 leading-relaxed">
            Witness the birth of a new computing paradigm. A single living core expanding into an autonomous enterprise engineering operating system.
          </p>
          <div className="flex gap-4">
            <CommandButton variant="primary" size="lg" glow onClick={() => scrollToNext('scene-9')}>
              Launch Simulator
            </CommandButton>
            <CommandButton variant="subtle" size="lg" onClick={() => scrollToNext('scene-2')}>
              Begin Journey
              <ArrowDown className="w-4 h-4 ml-2 inline animate-bounce" />
            </CommandButton>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 2: THE PROBLEM */}
      {/* ======================================================== */}
      <section id="scene-2" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 02 — THE COLLAPSE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Disconnected Weights
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The visitor observes the Core expanding—but finding only isolated, stateless chat wrappers that degrade under complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="border border-red-500/10 bg-zinc-900/10 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Traditional LLMs</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Stateless prompts that lose repository context, trigger security errors, and fail to test or execute.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-500">Traditional wrappers fail under enterprise loads.</div>
            </div>
            <div className="border border-yellow-500/15 bg-zinc-900/20 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">HGI Statefulness</h3>
                <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                  Persistent token caching, recursive AST parsing, and zero-trust shell compliance active.
                </p>
              </div>
              <div className="text-xs font-mono text-yellow-500">Persistent memory and secure sandboxes active.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 3: THE JOURNEY */}
      {/* ======================================================== */}
      <section id="scene-3" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 03 — THE TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Orbits of Learning
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core connects with past configurations, loading chronological models to understand its capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
            {[
              { year: '2023', stage: 'CORE SEED', title: 'Conceptualization', desc: 'Defining memory-persistent agent boundaries.' },
              { year: '2024', stage: 'EXECUTION', title: 'Panani X Engine', desc: 'Secure sandbox VMs built directly.' },
              { year: 'Early 2025', stage: 'SHIELD', title: 'Kavacha Active', desc: 'AST code scanners and cost tracking.' },
              { year: 'Late 2025', stage: 'COMPUTE', title: 'AMD Instinct', desc: 'Local ROCm 7.2 serve capability.' },
              { year: '2026', stage: 'LAUNCH', title: 'HGI OS Core', desc: 'The complete software workspace OS.' }
            ].map((node, idx) => (
              <GlassPanel 
                key={idx} 
                onClick={() => { setShowTimelineIndex(idx); playFeedbackSound(600 + (idx * 100), 0.05); }}
                className={`p-5 cursor-pointer border transition-all duration-300 ${showTimelineIndex === idx ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
              >
                <span className="text-[9px] font-mono text-yellow-500 block mb-1">{node.year} — {node.stage}</span>
                <h4 className="font-bold text-white text-xs mb-1">{node.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-normal">{node.desc}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 4: THE BIRTH OF HGI */}
      {/* ======================================================== */}
      <section id="scene-4" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 04 — DIVISION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-6">
              Splitting the Core
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Watch the central intelligence core split into five co-dependent systems orbiting the human-governed integration layer.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">1.</span> CENSA — Goal Decomposition Engine</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">2.</span> Panani X — Sandbox Agent Swarms</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">3.</span> Memory Vault — pgvector Semantic Stars</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">4.</span> Kavacha — Zero-Trust Policy Shields</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">5.</span> EIR — Code Compilation Runtime</div>
            </div>
          </div>
          <div className="text-center text-zinc-500 text-xs font-mono">
            {/* Visual spacing for orbiting cores */}
            Orbit simulation active. Look at the center of your screen.
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 5: ARCHITECTURE GALAXY */}
      {/* ======================================================== */}
      <section id="scene-5" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 05 — ARCHITECTURE GALAXY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Connecting the Nodes
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The cores form constellations, linking sub-agents, database pools, and hardware sockets dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Swarm Registry', desc: 'Syncs functional handles directly to code AST maps.' },
              { title: 'Routing Mesh', desc: 'Directs tokens between Instinct GPUs and cloud standby nodes.' },
              { title: 'Vector Mesh', desc: 'Bridges episodic and semantic memory context trees.' }
            ].map((card, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/10 border border-zinc-800 hover:border-yellow-500/20 transition-all text-left">
                <h4 className="font-bold text-white mb-2">{card.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 6: ENGINEERING INTELLIGENCE RUNTIME */}
      {/* ======================================================== */}
      <section id="scene-6" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 06 — THE ASSEMBLY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              The Coding Factory (EIR)
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The cores align. Watch ideas convert into structured, compilable code units.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-2">
              {['1. Parsing requirements', '2. AST codebase indexing', '3. Task DAG planning', '4. Swarm build loops', '5. Kavacha secure scan', '6. Sandbox tests', '7. Semantic memory save'].map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveEirStage(idx); playFeedbackSound(700 + (idx * 50), 0.04); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-mono ${activeEirStage === idx ? 'border-yellow-500 bg-yellow-500/10 text-white font-semibold' : 'border-zinc-800 text-zinc-400 bg-zinc-900/10'}`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <HolographicBorder>
                <GlassPanel variant="strong" className="p-8 min-h-[300px] flex flex-col justify-between text-left">
                  <div>
                    <h4 className="font-bold text-white mb-2">EIR State Machine Phase</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                      {activeEirStage === 0 && 'Extracts functional metrics and tags from raw specs to outline the mission.'}
                      {activeEirStage === 1 && 'Prunes target directories to feed AST syntax structure directly to specialist LLM buffers.'}
                      {activeEirStage === 2 && 'Determines parallel steps and dependency trees.'}
                      {activeEirStage === 3 && 'Agents write, modify, and edit file blocks directly.'}
                      {activeEirStage === 4 && 'Pre-scan evaluates prompt limits, syntax safety, and command boundaries.'}
                      {activeEirStage === 5 && 'Runs package checks and unit tests in secure isolated shells.'}
                      {activeEirStage === 6 && 'Indexes results to pgvector to optimize the next execution cycle.'}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-4">
                    Stage status: Nominal. Loop duration: 226ms.
                  </div>
                </GlassPanel>
              </HolographicBorder>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 7: PANANI X */}
      {/* ======================================================== */}
      <section id="scene-7" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 07 — AGENT REGISTRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Agent Registry Swarm
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core spawns specialist registry sub-agents. Click to wake or standby.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {['Planner', 'Research', 'Coding', 'Testing', 'Security', 'Docs', 'Deploy', 'Performance'].map((agent) => {
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
                  <p className="text-[10px] text-zinc-500">
                    {isWoken ? 'ACTIVE (Consensus voting open)' : 'STANDBY (Click to register)'}
                  </p>
                </GlassPanel>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 8: CENSA */}
      {/* ======================================================== */}
      <section id="scene-8" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 08 — REASONING
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              CENSA Decision Trees
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The cores arrange into a reasoning tree to parse intents, check dependencies, and route hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              { id: '01', title: 'Intent Graph', desc: 'Calculates context weights and matches keywords to registry skills.' },
              { id: '02', title: 'Task DAG', desc: 'Sorts parallelizable loops and structures compilation modules.' },
              { id: '03', title: 'Routing Sockets', desc: 'Selects the optimum cluster: Instinct local or remote fallback.' },
              { id: '04', title: 'Verification', desc: 'Invokes Kavacha rules to audit command blocks before execution.' }
            ].map((node) => (
              <div key={node.id} className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800">
                <span className="text-xs font-mono text-yellow-500 block mb-2">{node.id}</span>
                <h4 className="font-bold text-white text-sm mb-2">{node.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 9: THE UNFORGETTABLE MISSION SIMULATOR */}
      {/* ======================================================== */}
      <section id="scene-9" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/60 py-24">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 09 — SOLUTION BUILDER
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Watch Intelligence Think
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
              Input a customized mission objective below. Watch HGI parse intent, wake memory, spawn agents, evaluate compute, and compile a dynamic blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Design an Automotive Intelligence Platform')} className="p-4 cursor-pointer hover:border-yellow-500/50 text-left">
              <span className="text-[10px] font-mono text-yellow-500">PRESET SCENARIO A</span>
              <h4 className="font-bold text-sm my-1 text-white">"Design an Automotive Intelligence Platform"</h4>
              <p className="text-[10px] text-zinc-400">Decomposes manufacturing metrics, routing, and safety audits.</p>
            </GlassPanel>
            <GlassPanel onClick={() => !simActive && handleStartSimulation('Optimize supply chain routing')} className="p-4 cursor-pointer hover:border-yellow-500/50 text-left">
              <span className="text-[10px] font-mono text-yellow-500">PRESET SCENARIO B</span>
              <h4 className="font-bold text-sm my-1 text-white">"Optimize supply chain routing"</h4>
              <p className="text-[10px] text-zinc-400">Balances token savings and model execution latency layers.</p>
            </GlassPanel>
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
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider text-left">
                        Mission Objective Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Design an Automotive Intelligence Platform..."
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-500/50 text-white"
                      />
                    </div>
                    <CommandButton 
                      variant="primary" 
                      size="lg" 
                      glow 
                      onClick={() => handleStartSimulation(customGoal || 'Design an Automotive Intelligence Platform')}
                    >
                      Execute Swarm Planning
                      <Play className="w-4 h-4 ml-2 inline animate-pulse" />
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
                          {simStage === 'completed' ? 'MISSION COMPLETED' : `STAGE: ${simStage.toUpperCase()}`}
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
                          { id: 'intent', label: 'Intent Classified' },
                          { id: 'planning', label: 'Task Graph Formed' },
                          { id: 'routing', label: 'AMD Cluster Active' },
                          { id: 'execution', label: 'Registry Spawned' },
                          { id: 'governance', label: 'Kavacha Passed' },
                          { id: 'memory', label: 'Memory Retrieved' }
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

                      <div className="md:col-span-2 bg-zinc-950/80 rounded p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[160px] flex flex-col gap-1 text-left border border-white/5">
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
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 border border-yellow-500/20 bg-zinc-950/60 rounded-xl p-4 flex flex-col gap-4 text-left"
                      >
                        <h4 className="font-bold text-xs text-yellow-500 font-mono uppercase tracking-wider">
                          Generated Vehicle Architecture Blueprint (HTML5 Canvas Vector)
                        </h4>
                        
                        <div className="flex justify-center bg-black/60 rounded border border-white/5 p-2 overflow-hidden">
                          <canvas ref={blueprintCanvasRef} className="w-full max-w-[480px] h-[180px]" />
                        </div>

                        <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
                          <span className="text-[10px] font-mono text-zinc-500">Inference node: AMD Instinct MI300X</span>
                          <CommandButton variant="subtle" size="sm" onClick={handleResetSim}>
                            Reset Simulator
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
      {/* SCENE 10: SELF MONITORING */}
      {/* ======================================================== */}
      <section id="scene-10" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 10 — TELEMETRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Intelligence Self-Monitoring
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core scans its own performance metrics, monitoring queues, latency bounds, and VRAM footprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Mean Latency', val: '226ms', label: '-42% via local cache' },
              { name: 'Registry Load', val: '78.2%', label: 'Active sub-nodes: 14' },
              { name: 'Sandbox Uptime', val: '100%', label: 'VM isolates active' },
              { name: 'Queue Bottlenecks', val: '0', label: 'Scheduler nominal' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-2">{stat.name}</span>
                  <span className="text-3xl font-bold text-white font-mono">{stat.val}</span>
                </div>
                <span className="text-[10px] font-mono text-yellow-500 mt-4 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 11: AMD COMPUTE */}
      {/* ======================================================== */}
      <section id="scene-11" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 11 — HARDWARE ROUTER
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Deciding Compute Routes
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Watch the Core morph as it evaluates cost vs latency constraints to select the local Instinct cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="border border-red-500/20 bg-zinc-900/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-red-500 block mb-2">PRIMARY NODE</span>
                <h3 className="text-2xl font-bold text-white mb-4">AMD Instinct MI300X (ROCm 7.2)</h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Serving localized parameters with zero external egress. Peak performance: 2.1x speedup relative to virtual machines.
                </p>
              </div>
              <div className="text-[10px] font-mono text-red-400">Status: Active & Serving. VRAM: 14.2 GB used.</div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 block mb-2">STANDBY NODE</span>
                <h3 className="text-2xl font-bold text-white mb-4">Fireworks Cloud API Failover</h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Provides fallback token pipelines when large cluster compute queues exceed 500ms bounds.
                </p>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">Status: Standby. Average response: 145ms.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 12: ENTERPRISE USE CASES */}
      {/* ======================================================== */}
      <section id="scene-12" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 12 — CONSTELLATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Powering Complex Domains
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core orbits through critical industrial targets, proving it is built for software systems where reliability is non-negotiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { industry: 'Automotive Systems', desc: 'Decomposes vehicle parameters, translating signals and verifying firmware builds.' },
              { industry: 'Aerospace Engineering', desc: 'Validates structural mission plans, scanning command tokens recursively.' },
              { industry: 'Clinical Logistics', desc: 'Structured patient intake pipelines with zero-egress data privacy.' }
            ].map((node, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/10 border border-zinc-800 hover:border-yellow-500/30 transition-all text-left">
                <h4 className="font-bold text-white text-base mb-2">{node.industry}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 13: WHY IT MATTERS */}
      {/* ======================================================== */}
      <section id="scene-13" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full mb-8">
            CHAPTER 13 — THE EVOLUTION
          </span>
          <p className="text-xl md:text-3xl text-zinc-300 italic mb-12 max-w-2xl font-light leading-relaxed">
            "Models answer questions. Assistants write drafts. HGI orchestrates whole engineering architectures."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
            {[
              { title: '1. AI Assistants', desc: 'Simple chat windows answering basic queries.' },
              { title: '2. Autonomous Teams', desc: 'Coordinated script agents with minimal constraints.' },
              { title: '3. AI Organizations', desc: 'Parallel task graphs solving complex workflows.' },
              { title: '4. Intelligence OS', desc: 'A persistent, safe, self-improving execution layer.' }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-800">
                <span className="text-[10px] font-mono text-yellow-500 block mb-2">{item.title}</span>
                <p className="text-xs text-zinc-400 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 14: THE FUTURE */}
      {/* ======================================================== */}
      <section id="scene-14" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/40 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              CHAPTER 14 — ROADMAP
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Horizon Roadmap
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Click on roadmap milestones to explore the launch schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { p: 'Phase 1', t: 'Hackathon Freeze', d: 'Validated Instinct clusters, baseline memory vectors.' },
              { p: 'Phase 2', t: 'Developer Preview', d: 'Spawning first workspace integrations to select teams.' },
              { p: 'Phase 3', t: 'SDK Launch', d: 'Open registry access, custom skill manifest exports.' },
              { p: 'Phase 4', t: 'Unified ecosystem', d: 'Community-led agent networks coordinating globally.' }
            ].map((phase, idx) => (
              <div
                key={idx}
                onClick={() => { setActiveRoadmapStage(idx); playFeedbackSound(800 + (idx * 50), 0.05); }}
                className={`p-6 rounded-2xl cursor-pointer border text-left transition-all ${activeRoadmapStage === idx ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
              >
                <span className="text-xs font-mono text-yellow-500 block mb-2">{phase.p} — {phase.t}</span>
                <p className="text-xs text-zinc-400 leading-normal">{phase.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 15: FINAL PORTAL & COLLAPSE */}
      {/* ======================================================== */}
      <section id="scene-15" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-30 bg-black py-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full mb-12">
            CHAPTER 15 — CONVERGENCE
          </span>
          
          <h2 className="text-3xl md:text-5xl font-light text-zinc-500 mb-4">
            The Future Doesn't Need Another AI Assistant.
          </h2>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-16 tracking-tight">
            It Needs an Intelligence Operating System.
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
            <CommandButton variant="primary" size="lg" glow onClick={() => setShowPasscodeModal(true)}>
              Launch Judge Workspace
            </CommandButton>
            <CommandButton variant="subtle" size="lg" onClick={() => router.push('/hq')}>
              Explore Reference Agent
            </CommandButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5 z-30 bg-black/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">RE-EVOLVE ON HGI</p>
              <p className="text-[10px] text-zinc-500 font-mono">Human-Governed Integration OS</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-zinc-500">
            <span>VERSION 2.0.0</span>
            <StatusBadge status="online" label="NOMINAL" />
          </div>
        </div>
      </footer>
    </div>
  )
}
