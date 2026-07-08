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

  // Hover states for the final scene portal
  const [portalHovered, setPortalHovered] = useState(false)

  // Toggle Sound with Web Audio API Initialization
  const toggleSound = () => {
    if (typeof window === 'undefined') return
    
    if (soundEnabled) {
      if (humOscRef.current) {
        try {
          humOscRef.current.stop()
        } catch(e){}
        humOscRef.current = null
      }
      setSoundEnabled(false)
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx

        // Create low hum oscillator
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(55, ctx.currentTime) // 55Hz low hum

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(110, ctx.currentTime)

        gain.gain.setValueAtTime(0.05, ctx.currentTime)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start()
        
        humOscRef.current = osc
        humGainRef.current = gain
        setSoundEnabled(true)
        playFeedbackSound(440, 0.08) // boot chime
      } catch (err) {
        console.error("Web Audio API failed:", err)
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

      gain.gain.setValueAtTime(0.03, ctx.currentTime)
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
              playFeedbackSound(220 + (i * 35), 0.04) // Dynamic tone
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
      
      // Add particle at cursor pos with gravitational attraction towards center
      if (mousePos.x > 0 && mousePos.y > 0 && Math.random() < 0.4) {
        particles.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.9
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
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * 0.75})` // Golden yellow glow
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
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)' // Golden glow
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 12
    ctx.shadowColor = 'rgba(251, 191, 36, 0.6)'

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
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)'
    ctx.beginPath()
    ctx.moveTo(170, 45)
    ctx.lineTo(180, 85)
    ctx.lineTo(210, 85)
    ctx.moveTo(250, 45)
    ctx.lineTo(260, 85)
    ctx.lineTo(290, 85)
    ctx.stroke()

    // Drive axles & Battery pack
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'
    ctx.strokeRect(140, 115, 170, 15)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.15)'
    ctx.fillRect(140, 115, 170, 15)

    // Wheels
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)'
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
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'
    ctx.beginPath()
    ctx.moveTo(200, 30)
    ctx.lineTo(180, 10)
    ctx.moveTo(200, 30)
    ctx.lineTo(220, 10)
    ctx.stroke()

    // Technical Labels
    ctx.fillStyle = 'rgba(251, 191, 36, 0.9)'
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

  const scrollToNext = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Camera glide / Intelligence Core position mapping per scene
  const getCoreTransform = () => {
    switch(activeScene) {
      case 1:
        // Scene 1: Tiny particle, middle center
        return { x: 0, y: 0, scale: 0.18, rotate: 0, filter: 'blur(0px)', opacity: 1 }
      case 2:
        // Scene 2: Growing consciousness, larger breathing orb in center
        return { x: 0, y: -20, scale: 1.1, rotate: 30, filter: 'blur(0px)', opacity: 1 }
      case 3:
        // Scene 3: Learning, shifts right, learning paths flow
        return { x: 180, y: 0, scale: 1.2, rotate: 90, filter: 'blur(0px)', opacity: 0.95 }
      case 4:
        // Scene 4: Splitting, scales down in middle
        return { x: 0, y: 0, scale: 0.6, rotate: 180, filter: 'blur(0px)', opacity: 1 }
      case 5:
        // Scene 5: Galaxy, scales up, orbits expand
        return { x: -200, y: -40, scale: 1.4, rotate: 270, filter: 'blur(0px)', opacity: 0.9 }
      case 6:
        // Scene 6: EIR Assembly, shifts to top left
        return { x: -320, y: -220, scale: 0.8, rotate: 360, filter: 'blur(0px)', opacity: 0.85 }
      case 7:
        // Scene 7: Spawning Agents, middle right
        return { x: 300, y: 80, scale: 1.1, rotate: 420, filter: 'blur(0px)', opacity: 1 }
      case 8:
        // Scene 8: Reasoning DAG, top right
        return { x: 260, y: -180, scale: 0.9, rotate: 480, filter: 'blur(0px)', opacity: 0.9 }
      case 9:
        // Scene 9: Solution simulator, shifts to middle left
        return { x: -280, y: 120, scale: 1.3, rotate: 540, filter: 'blur(0px)', opacity: 1 }
      case 10:
        // Scene 10: Telemetry, middle center, circular rings
        return { x: 0, y: -10, scale: 1.0, rotate: 600, filter: 'blur(0px)', opacity: 1 }
      case 11:
        // Scene 11: Compute router, dual node balance red/gold shifts left
        return { x: -160, y: 0, scale: 1.2, rotate: 660, filter: 'blur(0px)', opacity: 1 }
      case 12:
        // Scene 12: Industry segments, shifts right
        return { x: 220, y: -30, scale: 1.1, rotate: 720, filter: 'blur(0px)', opacity: 0.95 }
      case 13:
        // Scene 13: Evolution pyramid, middle center
        return { x: 0, y: 0, scale: 1.3, rotate: 780, filter: 'blur(0px)', opacity: 1 }
      case 14:
        // Scene 14: Future horizon, scales down, perspective path
        return { x: 0, y: -100, scale: 0.5, rotate: 840, filter: 'blur(1px)', opacity: 0.8 }
      case 15:
        // Scene 15: Returns as HGI Emblem
        return { 
          x: 0, 
          y: 0, 
          scale: portalHovered ? 4.5 : 1.0, 
          rotate: 900, 
          filter: 'blur(0px)',
          opacity: 1
        }
      default:
        return { x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)', opacity: 1 }
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden text-foreground selection:bg-yellow-500/30 font-sans">
      
      {/* ======================================================== */}
      {/* 3D-LIKE CINEMATIC SPACE GRID BACKDROP */}
      {/* ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(24,24,37,0.75),black)]" />
      
      {/* Perspective Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(251,191,36,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Ambient Volumetric Glow Circles */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Constellation Stars */}
      <div className="fixed top-20 left-20 w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse pointer-events-none" />
      <div className="fixed top-1/3 right-32 w-1 h-1 rounded-full bg-white/10 animate-ping pointer-events-none" />
      <div className="fixed bottom-36 left-1/5 w-2 h-2 rounded-full bg-white/15 animate-pulse pointer-events-none" />

      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none opacity-50" />

      {/* ======================================================== */}
      {/* THE MAIN CHARACTER: INTELLIGENCE CORE (GLIDING CAMERA) */}
      {/* ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
        <motion.div
          animate={getCoreTransform()}
          transition={{
            type: 'spring',
            stiffness: 45,
            damping: 18,
            mass: 1.2
          }}
          className="relative flex items-center justify-center"
        >
          {/* Pulsing Outer Aura */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`absolute rounded-full filter blur-xl ${
              activeScene === 11 
                ? 'w-40 h-40 bg-red-500' 
                : 'w-36 h-36 bg-yellow-500'
            }`}
          />

          {/* Main Core Body */}
          <div
            className={`rounded-full transition-all duration-700 flex items-center justify-center border ${
              activeScene === 1 
                ? 'w-8 h-8 bg-yellow-500 border-yellow-400 shadow-[0_0_40px_rgba(251,191,36,1)]' 
                : activeScene === 11
                ? 'w-24 h-24 bg-gradient-to-br from-red-600 via-amber-500 to-yellow-500 border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.8)]'
                : 'w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 border-yellow-500 shadow-[0_0_50px_rgba(251,191,36,0.7)]'
            }`}
          >
            {activeScene > 1 && (
              <Brain className={`w-10 h-10 transition-colors duration-500 ${activeScene === 11 ? 'text-white' : 'text-black'}`} />
            )}
          </div>

          {/* Orbiting Satellite Subsystems (Scene 3 & 4) */}
          {(activeScene === 3 || activeScene === 4) && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-48 h-48 border border-dashed border-yellow-500/25 rounded-full"
            >
              <div className="absolute -top-1.5 left-[90px] w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,1)]" />
              <div className="absolute top-[90px] -left-1.5 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,1)]" />
              <div className="absolute top-[90px] -right-1.5 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,1)]" />
            </motion.div>
          )}

          {/* Galaxy Constellations (Scene 5) */}
          {activeScene === 5 && (
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-72 h-72 border border-dashed border-white/10 rounded-full flex items-center justify-center"
            >
              <div className="absolute top-0 w-2.5 h-2.5 bg-yellow-500 rounded-full" />
              <div className="absolute bottom-0 w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <div className="absolute left-0 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
              <div className="absolute right-0 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </motion.div>
          )}

          {/* Telemetry Progress Rings (Scene 10) */}
          {activeScene === 10 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute w-36 h-36 border-4 border-dashed border-yellow-500/40 rounded-full"
            />
          )}

        </motion.div>
      </div>

      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/45 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/15">
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
              title={soundEnabled ? "Mute ambient hum" : "Unmute ambient hum"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
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

      {/* Security Passcode Gate Modal */}
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
                    Security Decryption
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Enter the operational passcode to unlock the live workspaces and sub-agent terminals.
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
                      <span>Passcode: AMD-GOLD</span>
                    </div>
                    <CommandButton variant="primary" size="sm" type="submit" glow>
                      Decrypt & Unlock
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
      <section id="scene-1" className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center z-30 pt-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full mb-8">
            प्रज्ञा / Intelligence · ACT I: WONDER — THE SINGULAR POINT
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
            A single living intelligence core, architected to orchestrate autonomous multi-agent networks on AMD Instinct compute.
          </p>
          <div className="flex gap-4">
            <CommandButton variant="primary" size="lg" glow onClick={() => scrollToNext('scene-9')}>
              Run Simulation
            </CommandButton>
            <CommandButton variant="subtle" size="lg" onClick={() => scrollToNext('scene-2')}>
              Scroll to Begin
              <ArrowDown className="w-4 h-4 ml-2 inline animate-bounce" />
            </CommandButton>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 2: THE CRISIS */}
      {/* ======================================================== */}
      <section id="scene-2" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/30 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full">
              ACT I: WONDER — THE COLLAPSE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              AI Fragmentation Collapse
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The visitor observes the Core expanding, finding only isolated, stateless chat wrappers that degrade under codebase complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="border border-red-500/10 bg-zinc-900/10 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Fragmented Weights</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Stateless query prompts, copy-pasting loops, zero testing validation, and raw script interfaces.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-500">Traditional wrappers degrade quickly.</div>
            </div>
            <div className="border border-yellow-500/15 bg-zinc-900/20 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Unified Statefulness</h3>
                <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                  Episodic context vectors, automated AST indexing, and pre-scan command shields active.
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
      <section id="scene-3" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/30 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              विद्या / Knowledge · ACT I: WONDER — ORBITS OF LEARNING
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Chronological Path
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core connects with past configurations, loading chronological models to understand its capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
            {[
              { year: '2023', stage: 'SEEDED', title: 'Conceptualization', desc: 'Defining memory-persistent agent boundaries.' },
              { year: '2024', stage: 'SANDBOXED', title: 'Panani X Engine', desc: 'Secure sandbox VMs built directly.' },
              { year: 'Early 2025', stage: 'SHIELDED', title: 'Kavacha Active', desc: 'AST code scanners and cost tracking.' },
              { year: 'Late 2025', stage: 'POWERED', title: 'AMD Instinct', desc: 'Local ROCm 7.2 serve capability.' },
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
      <section id="scene-4" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/30 py-24">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              ACT II: DISCOVERY — DIVISION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-6">
              Core Subsystems Division
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Watch the central intelligence core split into five co-dependent systems orbiting the human-governed integration layer.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">1.</span> CENSA — Goal Decomposition Engine</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">2.</span> Panani X — Sandbox Agent Swarms</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">3.</span> Memory Vault — pgvector Semantic Stars</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">4.</span> Kavacha — Zero-Trust Policy Shields</div>
              <div className="flex gap-3 items-center text-zinc-300"><span className="text-yellow-500">5.</span> Engineering Runtime — Code AST Compiler</div>
            </div>
          </div>
          <div className="text-center text-zinc-500 text-xs font-mono">
            Orbit simulation active. The sub-cores are spinning around the central node.
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 5: ARCHITECTURE GALAXY */}
      {/* ======================================================== */}
      <section id="scene-5" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/30 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              ACT II: DISCOVERY — CONSTELLATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Constellation Nodes Formed
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The sub-cores expand into a complex constellation grid, linking sub-agents, memory partitions, and hardware.
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
      <section id="scene-6" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-30 bg-black/30 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              ACT II: DISCOVERY — ASSEMBLY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Engineering Factory (EIR)
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Watch structural requirements convert into compiled, verified code modules.
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
              ACT III: UNDERSTANDING — SWARM
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Persistent Agent swarm
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              The Core spawns specialist registry sub-agents to collaborate.
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
              विवेक / Discernment · ACT III: UNDERSTANDING — REASONING
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Visual Reasoning DAGs
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Watch the cores arrange into a clean tree shape, mapping functional requirements to dependency routes.
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
              ACT III: UNDERSTANDING — SOLUTION BUILDER
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
              स्मृति / Memory · ACT IV: BELIEF — TELEMETRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-6 mb-4">
              Core Self-Monitoring
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
              ACT IV: BELIEF — HARDWARE ROUTER
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
              ACT IV: BELIEF — CONSTELLATIONS
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
            ACT V: LAUNCH — THE EVOLUTION
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
              ACT V: LAUNCH — ROADMAP
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
              { phase: 'Phase 1', title: 'Hackathon Freeze', desc: 'Validated Instinct clusters, baseline memory vectors.' },
              { phase: 'Phase 2', title: 'Developer Preview', desc: 'Spawning first workspace integrations to select teams.' },
              { phase: 'Phase 3', title: 'SDK Launch', desc: 'Open registry access, custom skill manifest exports.' },
              { phase: 'Phase 4', title: 'Unified ecosystem', desc: 'Community-led agent networks coordinating globally.' }
            ].map((phase, idx) => (
              <div
                key={idx}
                onClick={() => { setActiveRoadmapStage(idx); playFeedbackSound(800 + (idx * 50), 0.05); }}
                className={`p-6 rounded-2xl cursor-pointer border text-left transition-all ${activeRoadmapStage === idx ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800'}`}
              >
                <span className="text-xs font-mono text-yellow-500 block mb-2">{phase.phase} — {phase.title}</span>
                <p className="text-xs text-zinc-400 leading-normal">{phase.desc}</p>
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
            सिद्धम् / Completed · ACT V: LAUNCH — CONVERGENCE
          </span>
          
          <h2 className="text-3xl md:text-5xl font-light text-zinc-500 mb-4">
            The Future Doesn't Need Another AI Assistant.
          </h2>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            It Needs an Intelligence Operating System.
          </h1>
          <p className="text-sm font-mono text-yellow-500/80 mb-16 tracking-widest uppercase">
            As Above, So Below.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
            <motion.div
              onHoverStart={() => { setPortalHovered(true); playFeedbackSound(1000, 0.1); }}
              onHoverEnd={() => setPortalHovered(false)}
              className="w-full"
            >
              <CommandButton variant="primary" size="lg" glow onClick={() => setShowPasscodeModal(true)}>
                Launch Judge Workspace
              </CommandButton>
            </motion.div>
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
