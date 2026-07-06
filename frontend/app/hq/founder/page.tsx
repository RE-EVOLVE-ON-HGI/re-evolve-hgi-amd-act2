"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Crown,
  Shield,
  Rocket,
  Globe,
  Zap,
  TrendingUp,
  AlertTriangle,
  Lock,
  Eye,
  Target,
  Layers,
  Activity,
  Brain,
  Network,
  ChevronRight,
  Play,
  Pause,
  Settings,
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, HolographicBorder, DataStream } from '@/components/hgi/design-system'
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

// Dynamic import for 3D
const NeuralEarthVisualization = dynamic(
  () => import('@/components/hgi/neural-earth').then(mod => mod.NeuralEarthVisualization),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" /> }
)

const ecosystemData = [
  { month: 'Jan', revenue: 1.2, users: 45, agents: 120 },
  { month: 'Feb', revenue: 1.8, users: 62, agents: 145 },
  { month: 'Mar', revenue: 2.4, users: 78, agents: 172 },
  { month: 'Apr', revenue: 3.1, users: 95, agents: 198 },
  { month: 'May', revenue: 4.2, users: 124, agents: 231 },
  { month: 'Jun', revenue: 5.8, users: 156, agents: 267 },
]

const governanceData = [
  { subject: 'Ethics', A: 98, fullMark: 100 },
  { subject: 'Compliance', A: 95, fullMark: 100 },
  { subject: 'Security', A: 99, fullMark: 100 },
  { subject: 'Transparency', A: 92, fullMark: 100 },
  { subject: 'Human Alignment', A: 97, fullMark: 100 },
  { subject: 'Anti-Drift', A: 94, fullMark: 100 },
]

const strategicInitiatives = [
  { 
    name: 'Global Expansion Phase III',
    status: 'active',
    progress: 67,
    impact: 'critical',
    eta: '45 days'
  },
  { 
    name: 'AGI Safety Protocol v2.0',
    status: 'active',
    progress: 83,
    impact: 'critical',
    eta: '12 days'
  },
  { 
    name: 'Enterprise Vertical Launch',
    status: 'pending',
    progress: 35,
    impact: 'high',
    eta: '90 days'
  },
  { 
    name: 'Neural Architecture Upgrade',
    status: 'active',
    progress: 52,
    impact: 'high',
    eta: '60 days'
  },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  return (
    <span className="telemetry-number">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

export default function FounderCockpitPage() {
  const [simulationActive, setSimulationActive] = useState(false)
  
  return (
    <div className="space-y-6">
      {/* Header with Founder Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.16_85)] to-[oklch(0.68_0.18_65)] flex items-center justify-center">
            <Crown className="w-6 h-6 text-[oklch(0.08_0_0)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Founder Cockpit</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[oklch(0.78_0.16_85)] text-[oklch(0.08_0_0)] rounded">
                SUPREME ACCESS
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Strategic command and civilization-scale oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status="online" label="FOUNDER AUTHENTICATED" />
          <CommandButton variant="gold" size="sm">
            <Lock className="w-3 h-3 mr-2" />
            Alpha Omega Chamber
          </CommandButton>
        </div>
      </div>
      
      {/* Supreme Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <TelemetryCard
          label="Total Ecosystem Value"
          value={<AnimatedNumber value={847} prefix="$" suffix="M" />}
          status="nominal"
          trend="up"
          trendValue="+23.4%"
        />
        <TelemetryCard
          label="Global Users"
          value={<AnimatedNumber value={2847392} />}
          status="nominal"
          trend="up"
          trendValue="+18.2%"
        />
        <TelemetryCard
          label="Active Deployments"
          value={<AnimatedNumber value={156} />}
          status="nominal"
        />
        <TelemetryCard
          label="Governance Score"
          value="99.7"
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Capital Runway"
          value="48"
          unit="months"
          status="nominal"
        />
        <TelemetryCard
          label="Market Position"
          value="#1"
          status="nominal"
          trend="up"
          trendValue="Secured"
        />
      </div>
      
      {/* Main Strategic Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Strategic Simulation */}
        <HolographicBorder className="lg:col-span-2">
          <GlassPanel variant="strong" className="p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full">
              <DataStream direction="vertical" color="gold" speed="slow" />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-[oklch(0.78_0.16_85)]" />
                  Strategic Simulation Engine
                </h3>
                <p className="text-xs text-muted-foreground font-mono">CIVILIZATION TRAJECTORY MODELING</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={simulationActive ? 'syncing' : 'standby'} label={simulationActive ? 'SIMULATING' : 'STANDBY'} />
                <CommandButton 
                  variant={simulationActive ? 'danger' : 'primary'} 
                  size="sm"
                  onClick={() => setSimulationActive(!simulationActive)}
                >
                  {simulationActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </CommandButton>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ecosystemData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.78 0.16 85)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.78 0.16 85)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.12 0.02 265)',
                      border: '1px solid oklch(0.25 0.03 265)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="oklch(0.78 0.16 85)" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenue ($M)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="oklch(0.65 0.18 250)" 
                    strokeWidth={2}
                    dot={false}
                    name="Users (K)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="agents" 
                    stroke="oklch(0.72 0.18 165)" 
                    strokeWidth={2}
                    dot={false}
                    name="Agents"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Projected ARR (12mo)</p>
                <p className="text-lg font-bold text-[oklch(0.78_0.16_85)]">$124M</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">User Growth Rate</p>
                <p className="text-lg font-bold text-primary">+34%</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Market Capture</p>
                <p className="text-lg font-bold text-accent">67%</p>
              </div>
            </div>
          </GlassPanel>
        </HolographicBorder>
        
        {/* Governance Radar */}
        <GlassPanel className="p-6" glow="gold">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">HGI Governance Matrix</h3>
              <p className="text-xs text-muted-foreground font-mono">ETHICAL ALIGNMENT</p>
            </div>
            <Shield className="w-5 h-5 text-[oklch(0.78_0.16_85)]" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={governanceData}>
                <PolarGrid stroke="oklch(0.25 0.03 265)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 8 }}
                />
                <Radar
                  name="Governance"
                  dataKey="A"
                  stroke="oklch(0.78 0.16 85)"
                  fill="oklch(0.78 0.16 85)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-[oklch(0.78_0.16_85)]">96.2%</p>
            <p className="text-xs text-muted-foreground">Overall Governance Score</p>
          </div>
        </GlassPanel>
      </div>
      
      {/* Strategic Initiatives & Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strategic Initiatives */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Strategic Initiatives</h3>
              <p className="text-xs text-muted-foreground font-mono">CIVILIZATION-SCALE PROJECTS</p>
            </div>
            <CommandButton variant="ghost" size="sm">
              View All
              <ChevronRight className="w-3 h-3 ml-1" />
            </CommandButton>
          </div>
          
          <div className="space-y-4">
            {strategicInitiatives.map((initiative, i) => (
              <motion.div
                key={initiative.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      initiative.status === 'active' ? 'bg-[oklch(0.72_0.18_165)]' :
                      initiative.status === 'pending' ? 'bg-[oklch(0.78_0.16_85)]' :
                      'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{initiative.name}</p>
                      <p className="text-xs text-muted-foreground">ETA: {initiative.eta}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    initiative.impact === 'critical' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {initiative.impact.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono">{initiative.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${initiative.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        initiative.impact === 'critical' 
                          ? 'bg-[oklch(0.78_0.16_85)]' 
                          : 'bg-primary'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
        
        {/* Supreme Override Controls */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[oklch(0.78_0.16_85)]" />
                Supreme Override Controls
              </h3>
              <p className="text-xs text-muted-foreground font-mono">FOUNDER-ONLY SYSTEMS</p>
            </div>
            <Lock className="w-4 h-4 text-[oklch(0.78_0.16_85)]" />
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Emergency Halt Protocol', icon: AlertTriangle, color: 'destructive', desc: 'Stop all agent operations' },
              { name: 'Capital Reallocation', icon: Zap, color: 'gold', desc: 'Override treasury systems' },
              { name: 'Global Override', icon: Globe, color: 'blue', desc: 'Universal system control' },
              { name: 'Governance Bypass', icon: Shield, color: 'violet', desc: 'Temporary policy override' },
            ].map((control, i) => (
              <motion.div
                key={control.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-lg border transition-colors cursor-pointer group ${
                  control.color === 'destructive' 
                    ? 'border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10'
                    : control.color === 'gold'
                    ? 'border-[oklch(0.78_0.16_85_/_0.3)] hover:border-[oklch(0.78_0.16_85_/_0.5)] hover:bg-[oklch(0.78_0.16_85_/_0.1)]'
                    : control.color === 'blue'
                    ? 'border-primary/30 hover:border-primary/50 hover:bg-primary/10'
                    : 'border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    control.color === 'destructive' ? 'bg-destructive/20' :
                    control.color === 'gold' ? 'bg-[oklch(0.78_0.16_85_/_0.2)]' :
                    control.color === 'blue' ? 'bg-primary/20' : 'bg-secondary/20'
                  }`}>
                    <control.icon className={`w-5 h-5 ${
                      control.color === 'destructive' ? 'text-destructive' :
                      control.color === 'gold' ? 'text-[oklch(0.78_0.16_85)]' :
                      control.color === 'blue' ? 'text-primary' : 'text-secondary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{control.name}</p>
                    <p className="text-xs text-muted-foreground">{control.desc}</p>
                  </div>
                  <Lock className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-[oklch(0.78_0.16_85_/_0.1)] border border-[oklch(0.78_0.16_85_/_0.3)]">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-[oklch(0.78_0.16_85)]" />
              <div>
                <p className="text-sm font-medium">Biometric Required</p>
                <p className="text-xs text-muted-foreground">All overrides require founder authentication</p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
      
      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Alpha Omega Chamber', icon: Crown, href: '/hq/alpha-omega', color: 'gold' },
          { name: 'Genesis Engine', icon: Rocket, href: '/hq/genesis', color: 'violet' },
          { name: 'Singularity Observatory', icon: Eye, href: '/hq/singularity', color: 'blue' },
          { name: 'Situation Room', icon: Activity, href: '/hq/situation', color: 'emerald' },
        ].map((item) => (
          <Link key={item.name} href={item.href}>
            <GlassPanel className="p-4 hover:border-primary/30 transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.color === 'gold' ? 'bg-[oklch(0.78_0.16_85_/_0.2)] group-hover:bg-[oklch(0.78_0.16_85_/_0.3)]' :
                  item.color === 'violet' ? 'bg-secondary/20 group-hover:bg-secondary/30' :
                  item.color === 'blue' ? 'bg-primary/20 group-hover:bg-primary/30' :
                  'bg-accent/20 group-hover:bg-accent/30'
                } transition-colors`}>
                  <item.icon className={`w-5 h-5 ${
                    item.color === 'gold' ? 'text-[oklch(0.78_0.16_85)]' :
                    item.color === 'violet' ? 'text-secondary' :
                    item.color === 'blue' ? 'text-primary' : 'text-accent'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">FOUNDER ONLY</p>
                </div>
              </div>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </div>
  )
}
