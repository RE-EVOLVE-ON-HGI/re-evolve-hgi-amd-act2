"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Cpu,
  Globe,
  Users,
  Zap,
  Shield,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Server,
  Brain,
  Boxes,
  Wallet,
} from 'lucide-react'
import { GlassPanel, TelemetryCard, StatusBadge, CommandButton, DataStream } from '@/components/hgi/design-system'
import { getTelemetry } from '@/lib/api'
import { useRealtime } from '@/hooks/use-realtime'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  BarChart,
  Bar,
} from 'recharts'

// Dynamic import for 3D
const NeuralEarthVisualization = dynamic(
  () => import('@/components/hgi/neural-earth').then(mod => mod.NeuralEarthVisualization),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" /> }
)

// Generate sample data
const generateTimeSeriesData = (points: number, base: number, variance: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.floor(base + Math.random() * variance - variance / 2),
    value2: Math.floor(base * 0.8 + Math.random() * variance * 0.5),
  }))
}

const activityData = generateTimeSeriesData(24, 150, 80)
const agentData = generateTimeSeriesData(12, 200, 60)
const revenueData = [
  { name: 'Jan', arr: 1200000, mrr: 100000 },
  { name: 'Feb', arr: 1350000, mrr: 112500 },
  { name: 'Mar', arr: 1580000, mrr: 131667 },
  { name: 'Apr', arr: 1820000, mrr: 151667 },
  { name: 'May', arr: 2100000, mrr: 175000 },
  { name: 'Jun', arr: 2450000, mrr: 204167 },
]

function LiveClock() {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <span className="font-mono text-3xl font-bold text-primary">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  )
}

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

export default function MissionControlPage() {
  const [activeAgents, setActiveAgents] = useState(247)
  const [tasksPerHour, setTasksPerHour] = useState(84392)
  const [latency, setLatency] = useState(12)
  const [govScore, setGovScore] = useState(99.7)
  const [monthlyArr, setMonthlyArr] = useState(2450000)
  const [infraLoad, setInfraLoad] = useState(67)

  // Real-time listener
  useRealtime('re-evolve', (event, msg) => {
    if (event === 'telemetry.event') {
      if (msg.data.metric === 'cpu_load') {
        setInfraLoad(msg.data.value)
      } else if (msg.data.metric === 'latency') {
        setLatency(msg.data.value)
      }
    } else if (event === 'agent.task.completed') {
      setTasksPerHour(prev => prev + 1)
      setActiveAgents(prev => Math.min(1000, prev + (Math.random() > 0.5 ? 1 : 0)))
    } else if (event === 'economy.transaction') {
      setMonthlyArr(prev => prev + Math.floor(msg.data.amountCents / 100))
    } else if (event === 'governance.violation') {
      setGovScore(Number(msg.data.score.toFixed(1)))
    }
  })

  const [alerts] = useState([
    { id: 1, type: 'warning', message: 'High CPU utilization on GPU Cluster Alpha', time: '2 min ago' },
    { id: 2, type: 'info', message: 'SARATHI Engine completed batch optimization', time: '5 min ago' },
    { id: 3, type: 'success', message: 'New agent deployed: MarketIntel-v2.3', time: '12 min ago' },
  ])
  
  const portfolioVerticals = [
    { name: 'ARTOIES', status: 'online', revenue: '$4.2M', growth: '+23%' },
    { name: 'REALTIFY\'U\'', status: 'online', revenue: '$2.8M', growth: '+18%' },
    { name: 'AHERMESon', status: 'syncing', revenue: '$1.5M', growth: '+45%' },
    { name: 'Enterprise Grid', status: 'online', revenue: '$8.1M', growth: '+12%' },
  ]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mission Control HQ</h1>
          <p className="text-muted-foreground text-sm">Real-time ecosystem telemetry and operational oversight</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status="online" label="ALL SYSTEMS NOMINAL" />
          <LiveClock />
        </div>
      </div>
      
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <TelemetryCard
          label="Active Agents"
          value={<AnimatedNumber value={activeAgents} />}
          status="nominal"
          trend="up"
          trendValue="+12 today"
        />
        <TelemetryCard
          label="Tasks / Hour"
          value={<AnimatedNumber value={tasksPerHour} />}
          status="nominal"
          trend="up"
          trendValue="+23%"
        />
        <TelemetryCard
          label="Global Latency"
          value={latency}
          unit="ms"
          status="nominal"
          trend="down"
          trendValue="-2ms"
        />
        <TelemetryCard
          label="Governance Score"
          value={govScore}
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Monthly ARR"
          value={<AnimatedNumber value={monthlyArr} prefix="$" />}
          status="nominal"
          trend="up"
          trendValue="+16.7%"
        />
        <TelemetryCard
          label="Infrastructure Load"
          value={infraLoad}
          unit="%"
          status="nominal"
        />
      </div>
      
      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Neural Core Visualization */}
        <GlassPanel className="lg:col-span-1 p-6" glow="blue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Neural Command Core</h3>
              <p className="text-xs text-muted-foreground font-mono">GLOBAL TOPOLOGY</p>
            </div>
            <StatusBadge status="online" />
          </div>
          <div className="h-64 relative">
            <NeuralEarthVisualization />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-xs text-muted-foreground">Regions</p>
              <p className="font-mono font-bold text-primary">12</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-xs text-muted-foreground">Nodes</p>
              <p className="font-mono font-bold text-accent">847</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="font-mono font-bold text-[oklch(0.72_0.18_165)]">99.99%</p>
            </div>
          </div>
        </GlassPanel>
        
        {/* Activity Chart */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Ecosystem Activity</h3>
              <p className="text-xs text-muted-foreground font-mono">24-HOUR TASK THROUGHPUT</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Agents</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.2 290)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.55 0.2 290)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
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
                  dataKey="value" 
                  stroke="oklch(0.65 0.18 250)" 
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="value2" 
                  stroke="oklch(0.55 0.2 290)" 
                  fillOpacity={1} 
                  fill="url(#colorAgents)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
      
      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Alerts Panel */}
        <GlassPanel className="lg:col-span-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">System Alerts</h3>
            <span className="text-xs font-mono text-muted-foreground">{alerts.length} ACTIVE</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${
                  alert.type === 'warning' 
                    ? 'border-[oklch(0.78_0.16_85_/_0.3)] bg-[oklch(0.78_0.16_85_/_0.1)]'
                    : alert.type === 'success'
                    ? 'border-[oklch(0.72_0.18_165_/_0.3)] bg-[oklch(0.72_0.18_165_/_0.1)]'
                    : 'border-primary/30 bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[oklch(0.78_0.16_85)] flex-shrink-0 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                  {alert.type === 'success' && <Zap className="w-4 h-4 text-[oklch(0.72_0.18_165)] flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/hq/alerts" className="block mt-4">
            <CommandButton variant="ghost" size="sm" className="w-full">
              View All Alerts
              <ChevronRight className="w-3 h-3 ml-2" />
            </CommandButton>
          </Link>
        </GlassPanel>
        
        {/* Revenue Chart */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">ARR Intelligence</h3>
              <p className="text-xs text-muted-foreground font-mono">FINANCIAL TRAJECTORY</p>
            </div>
            <Link href="/hq/finance">
              <CommandButton variant="ghost" size="sm">
                <ArrowUpRight className="w-3 h-3" />
              </CommandButton>
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.02 265)',
                    border: '1px solid oklch(0.25 0.03 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                />
                <Bar dataKey="arr" fill="oklch(0.65 0.18 250)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        {/* Portfolio Verticals */}
        <GlassPanel className="lg:col-span-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Portfolio Verticals</h3>
            <Link href="/hq/portfolio">
              <ArrowUpRight className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
          <div className="space-y-3">
            {portfolioVerticals.map((vertical) => (
              <div 
                key={vertical.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    vertical.status === 'online' ? 'bg-[oklch(0.72_0.18_165)]' :
                    vertical.status === 'syncing' ? 'bg-primary animate-pulse' :
                    'bg-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium">{vertical.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">{vertical.revenue}</p>
                  <p className={`text-[10px] ${
                    vertical.growth.startsWith('+') ? 'text-[oklch(0.72_0.18_165)]' : 'text-destructive'
                  }`}>
                    {vertical.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/hq/sarathi">
          <GlassPanel className="p-4 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">SARATHI Engine</p>
                <p className="text-xs text-muted-foreground">Agent Orchestration</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </div>
          </GlassPanel>
        </Link>
        
        <Link href="/hq/governance">
          <GlassPanel className="p-4 hover:border-[oklch(0.78_0.16_85_/_0.3)] transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[oklch(0.78_0.16_85_/_0.2)] flex items-center justify-center group-hover:bg-[oklch(0.78_0.16_85_/_0.3)] transition-colors">
                <Shield className="w-5 h-5 text-[oklch(0.78_0.16_85)]" />
              </div>
              <div>
                <p className="font-medium">Governance Grid</p>
                <p className="text-xs text-muted-foreground">Policy Systems</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </div>
          </GlassPanel>
        </Link>
        
        <Link href="/hq/infrastructure">
          <GlassPanel className="p-4 hover:border-secondary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <Server className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Infrastructure</p>
                <p className="text-xs text-muted-foreground">System Matrix</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </div>
          </GlassPanel>
        </Link>
        
        <Link href="/hq/agents">
          <GlassPanel className="p-4 hover:border-accent/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Agent Foundry</p>
                <p className="text-xs text-muted-foreground">AI Generation</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </div>
          </GlassPanel>
        </Link>
      </div>
    </div>
  )
}
