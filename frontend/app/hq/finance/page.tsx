"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Briefcase,
  CreditCard,
  Target,
  ChevronRight,
  Download,
  Calendar,
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, HolographicBorder } from '@/components/hgi/design-system'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from 'recharts'

const revenueData = [
  { month: 'Jan', arr: 12.4, mrr: 1.03, growth: 12 },
  { month: 'Feb', arr: 14.2, mrr: 1.18, growth: 14 },
  { month: 'Mar', arr: 16.8, mrr: 1.4, growth: 18 },
  { month: 'Apr', arr: 19.5, mrr: 1.62, growth: 16 },
  { month: 'May', arr: 22.3, mrr: 1.86, growth: 14 },
  { month: 'Jun', arr: 24.5, mrr: 2.04, growth: 10 },
]

const portfolioBreakdown = [
  { name: 'ARTOIES', value: 8.2, color: 'oklch(0.65 0.18 250)' },
  { name: 'REALTIFY\'U\'', value: 5.4, color: 'oklch(0.55 0.2 290)' },
  { name: 'AHERMESon', value: 3.8, color: 'oklch(0.72 0.18 165)' },
  { name: 'Enterprise Grid', value: 7.1, color: 'oklch(0.78 0.16 85)' },
]

const treasuryAllocations = [
  { category: 'Operations', allocated: 45, spent: 38, remaining: 7 },
  { category: 'R&D', allocated: 30, spent: 24, remaining: 6 },
  { category: 'Marketing', allocated: 15, spent: 12, remaining: 3 },
  { category: 'Infrastructure', allocated: 10, spent: 8, remaining: 2 },
]

const transactions = [
  { id: 'TXN-001', type: 'income', description: 'Enterprise License - Acme Corp', amount: 125000, date: '2 hours ago' },
  { id: 'TXN-002', type: 'expense', description: 'GPU Cluster Expansion', amount: -45000, date: '5 hours ago' },
  { id: 'TXN-003', type: 'income', description: 'Monthly Subscription Revenue', amount: 847000, date: '1 day ago' },
  { id: 'TXN-004', type: 'expense', description: 'Team Payroll', amount: -320000, date: '2 days ago' },
  { id: 'TXN-005', type: 'income', description: 'API Usage Fees', amount: 67000, date: '3 days ago' },
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
        setDisplay(current)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  return (
    <span className="telemetry-number">
      {prefix}{display.toFixed(1)}{suffix}
    </span>
  )
}

export default function FinancePage() {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M')
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.16_85)] to-[oklch(0.68_0.18_65)] flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[oklch(0.08_0_0)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Financial Command Center</h1>
            <p className="text-muted-foreground text-sm">ARR intelligence, treasury systems, and economic pulse</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted/20 rounded-lg p-1">
            {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <CommandButton variant="ghost" size="sm">
            <Download className="w-3 h-3 mr-2" />
            Export
          </CommandButton>
        </div>
      </div>
      
      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <TelemetryCard
          label="Annual Recurring Revenue"
          value={<AnimatedNumber value={24.5} prefix="$" suffix="M" />}
          status="nominal"
          trend="up"
          trendValue="+10% MoM"
        />
        <TelemetryCard
          label="Monthly Recurring Revenue"
          value={<AnimatedNumber value={2.04} prefix="$" suffix="M" />}
          status="nominal"
          trend="up"
          trendValue="+9.6%"
        />
        <TelemetryCard
          label="Net Revenue Retention"
          value="127"
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Customer LTV"
          value={<AnimatedNumber value={48.5} prefix="$" suffix="K" />}
          status="nominal"
        />
        <TelemetryCard
          label="CAC Payback"
          value="8.2"
          unit="months"
          status="nominal"
          trend="down"
          trendValue="-1.2"
        />
        <TelemetryCard
          label="Runway"
          value="48"
          unit="months"
          status="nominal"
        />
      </div>
      
      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ARR Chart */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">ARR Intelligence</h3>
              <p className="text-xs text-muted-foreground font-mono">REVENUE TRAJECTORY</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.78_0.16_85)]" />
                <span className="text-muted-foreground">ARR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">MRR</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => `$${value}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.02 265)',
                    border: '1px solid oklch(0.25 0.03 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`$${value}M`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="arr" 
                  stroke="oklch(0.78 0.16 85)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#arrGradient)"
                  name="ARR"
                />
                <Line 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="oklch(0.65 0.18 250)" 
                  strokeWidth={2}
                  dot={false}
                  name="MRR"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        {/* Portfolio Breakdown */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenue Topology</h3>
              <p className="text-xs text-muted-foreground font-mono">BY VERTICAL</p>
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={portfolioBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.02 265)',
                    border: '1px solid oklch(0.25 0.03 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`$${value}M`, '']}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-4">
            {portfolioBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-mono">${item.value}M</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
      
      {/* Treasury & Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Treasury Allocations */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Treasury Systems</h3>
              <p className="text-xs text-muted-foreground font-mono">BUDGET ALLOCATION</p>
            </div>
            <CommandButton variant="ghost" size="sm">
              Manage
              <ChevronRight className="w-3 h-3 ml-1" />
            </CommandButton>
          </div>
          
          <div className="space-y-4">
            {treasuryAllocations.map((allocation) => (
              <div key={allocation.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{allocation.category}</span>
                  <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-muted-foreground">
                      ${allocation.spent}M / ${allocation.allocated}M
                    </span>
                    <span className={allocation.remaining > 5 ? 'text-[oklch(0.72_0.18_165)]' : 'text-[oklch(0.78_0.16_85)]'}>
                      ${allocation.remaining}M left
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(allocation.spent / allocation.allocated) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      (allocation.spent / allocation.allocated) > 0.9 
                        ? 'bg-[oklch(0.78_0.16_85)]' 
                        : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-[oklch(0.72_0.18_165_/_0.1)] border border-[oklch(0.72_0.18_165_/_0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Treasury</p>
                <p className="text-2xl font-bold text-[oklch(0.72_0.18_165)]">$847M</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Burn Rate</p>
                <p className="text-lg font-mono">$1.2M/mo</p>
              </div>
            </div>
          </div>
        </GlassPanel>
        
        {/* Recent Transactions */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Capital Movement</h3>
              <p className="text-xs text-muted-foreground font-mono">RECENT TRANSACTIONS</p>
            </div>
            <CommandButton variant="ghost" size="sm">
              View All
              <ChevronRight className="w-3 h-3 ml-1" />
            </CommandButton>
          </div>
          
          <div className="space-y-3">
            {transactions.map((txn) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  txn.type === 'income' 
                    ? 'bg-[oklch(0.72_0.18_165_/_0.2)]' 
                    : 'bg-destructive/20'
                }`}>
                  {txn.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5 text-[oklch(0.72_0.18_165)]" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <p className={`font-mono font-medium ${
                  txn.type === 'income' ? 'text-[oklch(0.72_0.18_165)]' : 'text-destructive'
                }`}>
                  {txn.type === 'income' ? '+' : ''}{(txn.amount / 1000).toFixed(0)}K
                </p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>
      
      {/* Financial Forecasting */}
      <HolographicBorder>
        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-[oklch(0.78_0.16_85)]" />
                Financial Forecasting
              </h3>
              <p className="text-xs text-muted-foreground font-mono">AI-POWERED PROJECTIONS</p>
            </div>
            <StatusBadge status="syncing" label="CALCULATING" />
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Q3 2024 Projection', value: '$28.5M', confidence: '94%', trend: 'up' },
              { label: 'Q4 2024 Projection', value: '$34.2M', confidence: '87%', trend: 'up' },
              { label: 'FY 2024 Target', value: '$42M', confidence: '91%', trend: 'up' },
              { label: 'Break-even Timeline', value: 'Q2 2025', confidence: '89%', trend: 'down' },
            ].map((forecast, i) => (
              <motion.div
                key={forecast.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-muted/20"
              >
                <p className="text-xs text-muted-foreground mb-1">{forecast.label}</p>
                <p className="text-xl font-bold mb-2">{forecast.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${
                    forecast.trend === 'up' ? 'text-[oklch(0.72_0.18_165)]' : 'text-primary'
                  }`}>
                    {forecast.trend === 'up' ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{forecast.confidence} confidence</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </HolographicBorder>
    </div>
  )
}
