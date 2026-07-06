"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
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
  Cpu
} from 'lucide-react'
import { GlassPanel, CommandButton, TelemetryCard, StatusBadge, HolographicBorder, DataStream } from '@/components/hgi/design-system'

// Dynamic import for 3D component to avoid SSR issues
const NeuralEarthVisualization = dynamic(
  () => import('@/components/hgi/neural-earth').then(mod => mod.NeuralEarthVisualization),
  { ssr: false, loading: () => <div className="w-full h-full bg-background animate-pulse rounded-full" /> }
)

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = value
    const incrementTime = (duration * 1000) / end
    
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)
    
    return () => clearInterval(timer)
  }, [value, duration])
  
  return <span className="telemetry-number">{count.toLocaleString()}</span>
}

function LiveClock() {
  const [time, setTime] = useState<string | null>(null)
  
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])
  
  if (!time) return <span className="font-mono">--:--:--</span>
  
  return (
    <span className="font-mono" suppressHydrationWarning>
      {time}
    </span>
  )
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-neural-grid opacity-30 pointer-events-none" />
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
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
            <div className="hidden md:flex items-center gap-6">
              <StatusBadge status="online" label="GLOBAL SYSTEMS" />
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span>UTC</span>
                <LiveClock />
              </div>
            </div>
            <Link href="/hq">
              <CommandButton variant="primary" size="sm" glow>
                Enter HQ
                <ArrowRight className="w-3 h-3 ml-2 inline" />
              </CommandButton>
            </Link>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div 
          style={{ opacity, scale, y }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
            <NeuralEarthVisualization />
          </div>
        </motion.div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_165)] animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">ADAPTIVE INTELLIGENCE OPERATING SYSTEM</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-glow-blue">Human-Governed</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Adaptive Intelligence
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Civilization-scale orchestration with ethical governance, 
            neural intelligence architecture, and human-aligned AI systems.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/hq">
              <CommandButton variant="primary" size="lg" glow>
                Access Mission Control
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </CommandButton>
            </Link>
            <Link href="/hq/founder">
              <CommandButton variant="gold" size="lg">
                Founder Gateway
                <Lock className="w-4 h-4 ml-2 inline" />
              </CommandButton>
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">SCROLL TO EXPLORE</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border border-muted-foreground/30 flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-primary rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Live Telemetry Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider">REAL-TIME ECOSYSTEM TELEMETRY</h2>
            <p className="text-3xl md:text-4xl font-bold">Global Intelligence Pulse</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TelemetryCard
              label="Active Agents"
              value={<AnimatedCounter value={247} />}
              unit="nodes"
              status="nominal"
              trend="up"
              trendValue="+12 today"
            />
            <TelemetryCard
              label="Tasks Processed"
              value={<AnimatedCounter value={1847293} duration={3} />}
              unit="/ day"
              status="nominal"
              trend="up"
              trendValue="+23.4%"
            />
            <TelemetryCard
              label="Global Latency"
              value="12"
              unit="ms"
              status="nominal"
              trend="down"
              trendValue="-2ms"
            />
            <TelemetryCard
              label="Governance Score"
              value="99.7"
              unit="%"
              status="nominal"
            />
          </div>
        </div>
      </section>
      
      {/* Capabilities Grid */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider">CORE CAPABILITIES</h2>
            <p className="text-3xl md:text-4xl font-bold">Intelligence Architecture</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Neural Command Core',
                description: 'Living AI nervous system with adaptive topology and global ecosystem heartbeat.',
                color: 'blue',
              },
              {
                icon: Shield,
                title: 'Human Governance',
                description: 'Hierarchical Intent Governed Intelligence with anti-drift architecture.',
                color: 'gold',
              },
              {
                icon: Globe,
                title: 'Global Infrastructure',
                description: 'Planet-scale operational mesh with multi-region failover and edge compute.',
                color: 'emerald',
              },
              {
                icon: Cpu,
                title: 'SARATHI Engine',
                description: 'Multi-agent orchestration with neural routing and task evolution matrix.',
                color: 'violet',
              },
              {
                icon: Users,
                title: 'Agent Council',
                description: 'Autonomous AI parliament with consensus systems and governance orchestration.',
                color: 'blue',
              },
              {
                icon: Activity,
                title: 'Real-time Telemetry',
                description: 'Bloomberg-terminal inspired metrics with civilization-scale monitoring.',
                color: 'emerald',
              },
            ].map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  className="p-6 h-full group hover:border-primary/30 transition-colors"
                  glow={capability.color as 'blue' | 'violet' | 'emerald' | 'gold'}
                >
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                    capability.color === 'blue' ? 'bg-primary/20' :
                    capability.color === 'violet' ? 'bg-secondary/20' :
                    capability.color === 'emerald' ? 'bg-accent/20' :
                    'bg-[oklch(0.78_0.16_85_/_0.2)]'
                  }`}>
                    <capability.icon className={`w-6 h-6 ${
                      capability.color === 'blue' ? 'text-primary' :
                      capability.color === 'violet' ? 'text-secondary' :
                      capability.color === 'emerald' ? 'text-accent' :
                      'text-[oklch(0.78_0.16_85)]'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{capability.description}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <HolographicBorder className="overflow-hidden">
            <GlassPanel variant="strong" className="p-12 text-center relative overflow-hidden">
              {/* Data streams */}
              <div className="absolute left-0 top-0 h-full">
                <DataStream direction="vertical" color="blue" speed="slow" />
              </div>
              <div className="absolute right-0 top-0 h-full">
                <DataStream direction="vertical" color="violet" speed="slow" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(0.78_0.16_85_/_0.2)] mb-6">
                  <Lock className="w-4 h-4 text-[oklch(0.78_0.16_85)]" />
                  <span className="text-sm font-mono text-[oklch(0.78_0.16_85)]">FOUNDER ACCESS</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Enter the Alpha Omega Chamber
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Supreme operational layer for strategic simulations, ecosystem control, 
                  and civilization-scale intelligence orchestration.
                </p>
                
                <Link href="/auth">
                  <CommandButton variant="gold" size="lg" glow>
                    Initialize Biometric Authentication
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </CommandButton>
                </Link>
              </motion.div>
            </GlassPanel>
          </HolographicBorder>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border">
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
              <span>VERSION 1.0.0</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <StatusBadge status="online" label="ALL SYSTEMS NOMINAL" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
