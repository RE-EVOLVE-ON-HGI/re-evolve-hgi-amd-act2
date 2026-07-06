"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Shield,
  Scale,
  Eye,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  FileText,
  Users,
  Gavel,
  BookOpen,
  Activity,
  Clock,
  Bell,
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, HolographicBorder } from '@/components/hgi/design-system'
import { 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const governanceMetrics = [
  { subject: 'Human Alignment', A: 97, fullMark: 100 },
  { subject: 'Ethical Compliance', A: 99, fullMark: 100 },
  { subject: 'Transparency', A: 94, fullMark: 100 },
  { subject: 'Anti-Drift', A: 96, fullMark: 100 },
  { subject: 'Accountability', A: 98, fullMark: 100 },
  { subject: 'Auditability', A: 95, fullMark: 100 },
]

const complianceHistory = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  score: 95 + Math.random() * 5,
  violations: Math.floor(Math.random() * 3),
}))

interface Policy {
  id: string
  name: string
  category: 'ethics' | 'security' | 'compliance' | 'operations'
  status: 'active' | 'pending' | 'review'
  lastUpdated: string
  enforcement: 'strict' | 'moderate' | 'advisory'
  violations: number
}

const policies: Policy[] = [
  { id: 'POL-001', name: 'Human-in-the-Loop Decision Making', category: 'ethics', status: 'active', lastUpdated: '2 days ago', enforcement: 'strict', violations: 0 },
  { id: 'POL-002', name: 'Data Privacy & Retention', category: 'compliance', status: 'active', lastUpdated: '1 week ago', enforcement: 'strict', violations: 2 },
  { id: 'POL-003', name: 'Agent Autonomy Limits', category: 'ethics', status: 'active', lastUpdated: '3 days ago', enforcement: 'strict', violations: 0 },
  { id: 'POL-004', name: 'Financial Transaction Oversight', category: 'operations', status: 'active', lastUpdated: '5 days ago', enforcement: 'moderate', violations: 1 },
  { id: 'POL-005', name: 'Security Threat Response', category: 'security', status: 'review', lastUpdated: '1 day ago', enforcement: 'strict', violations: 0 },
  { id: 'POL-006', name: 'Model Bias Detection', category: 'ethics', status: 'pending', lastUpdated: '4 hours ago', enforcement: 'advisory', violations: 0 },
]

const pendingApprovals = [
  { id: 'APR-001', title: 'Deploy New Market Analysis Agent', requester: 'SARATHI Engine', risk: 'medium', submitted: '2 hours ago' },
  { id: 'APR-002', title: 'Expand GPU Cluster Access', requester: 'Infrastructure Team', risk: 'low', submitted: '4 hours ago' },
  { id: 'APR-003', title: 'Enable Cross-Region Data Sync', requester: 'Data Pipeline', risk: 'high', submitted: '1 day ago' },
]

function PolicyCard({ policy }: { policy: Policy }) {
  const categoryColors = {
    ethics: 'from-[oklch(0.78_0.16_85)] to-[oklch(0.78_0.16_85_/_0.5)]',
    security: 'from-destructive to-destructive/50',
    compliance: 'from-primary to-primary/50',
    operations: 'from-secondary to-secondary/50',
  }
  
  const categoryIcons = {
    ethics: Scale,
    security: Shield,
    compliance: FileText,
    operations: Activity,
  }
  
  const Icon = categoryIcons[policy.category]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[policy.category]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{policy.name}</h4>
            <span className={`w-2 h-2 rounded-full ${
              policy.status === 'active' ? 'bg-[oklch(0.72_0.18_165)]' :
              policy.status === 'pending' ? 'bg-[oklch(0.78_0.16_85)]' :
              'bg-primary animate-pulse'
            }`} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{policy.id}</span>
            <span>Updated {policy.lastUpdated}</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
            policy.enforcement === 'strict' 
              ? 'bg-destructive/20 text-destructive' 
              : policy.enforcement === 'moderate'
              ? 'bg-[oklch(0.78_0.16_85_/_0.2)] text-[oklch(0.78_0.16_85)]'
              : 'bg-muted/50 text-muted-foreground'
          }`}>
            {policy.enforcement.toUpperCase()}
          </span>
          {policy.violations > 0 && (
            <p className="text-xs text-destructive mt-1">{policy.violations} violations</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'policies' | 'approvals' | 'audit'>('policies')
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.16_85)] to-[oklch(0.68_0.18_65)] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[oklch(0.08_0_0)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Governance Grid</h1>
            <p className="text-muted-foreground text-sm">Human-governed intelligence architecture and policy systems</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status="online" label="GOVERNANCE ACTIVE" />
          <CommandButton variant="gold">
            <Bell className="w-3 h-3 mr-2" />
            {pendingApprovals.length} Pending
          </CommandButton>
        </div>
      </div>
      
      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <TelemetryCard
          label="Governance Score"
          value="96.5"
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Active Policies"
          value={policies.filter(p => p.status === 'active').length}
          status="nominal"
        />
        <TelemetryCard
          label="Pending Reviews"
          value={pendingApprovals.length}
          status="warning"
        />
        <TelemetryCard
          label="Violations (30d)"
          value="3"
          status="nominal"
          trend="down"
          trendValue="-5"
        />
        <TelemetryCard
          label="Compliance Rate"
          value="99.2"
          unit="%"
          status="nominal"
        />
        <TelemetryCard
          label="Audit Coverage"
          value="100"
          unit="%"
          status="nominal"
        />
      </div>
      
      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Governance Radar */}
        <GlassPanel className="p-6" glow="gold">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">HGI Governance Matrix</h3>
              <p className="text-xs text-muted-foreground font-mono">ETHICAL ALIGNMENT SCORE</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={governanceMetrics}>
                <PolarGrid stroke="oklch(0.25 0.03 265)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 9 }}
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
          
          <div className="text-center mt-4 p-4 rounded-lg bg-[oklch(0.78_0.16_85_/_0.1)] border border-[oklch(0.78_0.16_85_/_0.3)]">
            <p className="text-3xl font-bold text-[oklch(0.78_0.16_85)]">96.5%</p>
            <p className="text-xs text-muted-foreground">Overall Governance Score</p>
          </div>
        </GlassPanel>
        
        {/* Compliance History */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Compliance Intelligence</h3>
              <p className="text-xs text-muted-foreground font-mono">12-MONTH HISTORY</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_165)]" />
                <span className="text-muted-foreground">Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Violations</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceHistory}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                  domain={[90, 100]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.65 0.02 265)', fontSize: 10 }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.02 265)',
                    border: '1px solid oklch(0.25 0.03 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="score" 
                  stroke="oklch(0.72 0.18 165)" 
                  strokeWidth={2}
                  dot={false}
                  name="Score %"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="violations" 
                  stroke="oklch(0.55 0.22 25)" 
                  strokeWidth={2}
                  dot={false}
                  name="Violations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {[
          { id: 'policies', label: 'Active Policies', count: policies.length },
          { id: 'approvals', label: 'Pending Approvals', count: pendingApprovals.length },
          { id: 'audit', label: 'Audit Trail', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      {activeTab === 'policies' && (
        <div className="grid lg:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
      
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {pendingApprovals.map((approval, i) => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <HolographicBorder>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      approval.risk === 'high' ? 'bg-destructive/20' :
                      approval.risk === 'medium' ? 'bg-[oklch(0.78_0.16_85_/_0.2)]' :
                      'bg-[oklch(0.72_0.18_165_/_0.2)]'
                    }`}>
                      <Gavel className={`w-6 h-6 ${
                        approval.risk === 'high' ? 'text-destructive' :
                        approval.risk === 'medium' ? 'text-[oklch(0.78_0.16_85)]' :
                        'text-[oklch(0.72_0.18_165)]'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{approval.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Requester: {approval.requester}</span>
                        <span>Submitted: {approval.submitted}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        approval.risk === 'high' 
                          ? 'bg-destructive/20 text-destructive' 
                          : approval.risk === 'medium'
                          ? 'bg-[oklch(0.78_0.16_85_/_0.2)] text-[oklch(0.78_0.16_85)]'
                          : 'bg-[oklch(0.72_0.18_165_/_0.2)] text-[oklch(0.72_0.18_165)]'
                      }`}>
                        {approval.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CommandButton variant="ghost" size="sm">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </CommandButton>
                      <CommandButton variant="primary" size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </CommandButton>
                    </div>
                  </div>
                </GlassPanel>
              </HolographicBorder>
            </motion.div>
          ))}
        </div>
      )}
      
      {activeTab === 'audit' && (
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">AI Explainability Audit Trail</h3>
              <p className="text-xs text-muted-foreground font-mono">DECISION TRACKING & GOVERNANCE VALIDATION</p>
            </div>
            <CommandButton variant="ghost" size="sm">
              Export Audit Log
              <ChevronRight className="w-3 h-3 ml-1" />
            </CommandButton>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '14:32:15', action: 'Agent Deployment Approved', actor: 'GovernanceAI-Core', result: 'success' },
              { time: '14:28:42', action: 'Policy Violation Detected', actor: 'ComplianceMonitor', result: 'warning' },
              { time: '14:15:08', action: 'Human Override Requested', actor: 'TradingAgent-v2', result: 'pending' },
              { time: '14:02:33', action: 'Governance Check Passed', actor: 'SARATHI Engine', result: 'success' },
              { time: '13:45:19', action: 'Risk Assessment Complete', actor: 'RiskAnalyzer-v1', result: 'success' },
            ].map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/10"
              >
                <span className="text-xs font-mono text-muted-foreground w-20">{entry.time}</span>
                <div className={`w-2 h-2 rounded-full ${
                  entry.result === 'success' ? 'bg-[oklch(0.72_0.18_165)]' :
                  entry.result === 'warning' ? 'bg-[oklch(0.78_0.16_85)]' :
                  'bg-primary animate-pulse'
                }`} />
                <span className="flex-1 text-sm">{entry.action}</span>
                <span className="text-xs text-muted-foreground">{entry.actor}</span>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
