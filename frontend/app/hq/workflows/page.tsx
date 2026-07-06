"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Sparkles, 
  Cpu, 
  Brain, 
  Workflow, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  Search, 
  Eye, 
  Sliders, 
  RotateCw,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  Database,
  Activity,
  Shield,
  EyeOff
} from 'lucide-react'
import { GlassPanel, TelemetryCard, CommandButton, StatusBadge, HolographicBorder, DataStream } from '@/components/hgi/design-system'

// Timeline execution stages
interface Stage {
  id: string
  name: string
  time: string
  agent: string
  model: string
  confidence: number
  status: 'pending' | 'active' | 'completed' | 'failed'
  trace: string
  nodeId: string // Matches the node in CENSA graph
}

const INITIAL_STAGES: Stage[] = [
  { id: '1', name: 'Goal Ingestion', time: '--', agent: 'System Gateway', model: 'Gateway', confidence: 100, status: 'pending', trace: 'Awaiting user input...', nodeId: 'user' },
  { id: '2', name: 'Intent Classification', time: '--', agent: 'CENSA Classifier', model: 'Fireworks/Llama-3-8b', confidence: 0, status: 'pending', trace: 'Awaiting intent parsing...', nodeId: 'intent' },
  { id: '3', name: 'DAG Planning', time: '--', agent: 'Dynamic Planner', model: 'Fireworks/Llama-3-70b', confidence: 0, status: 'pending', trace: 'Awaiting DAG generation...', nodeId: 'planner' },
  { id: '4', name: 'Task Graph Verification', time: '--', agent: 'Kavacha Verifier', model: 'Deterministic', confidence: 0, status: 'pending', trace: 'Awaiting security clearance...', nodeId: 'taskGraph' },
  { id: '5', name: 'Agent Selection', time: '--', agent: 'Registry Selector', model: 'Registry Engine', confidence: 0, status: 'pending', trace: 'Awaiting worker binding...', nodeId: 'registry' },
  { id: '6', name: 'Memory Retrieval', time: '--', agent: 'Memory Vault', model: 'Qdrant Vector DB', confidence: 0, status: 'pending', trace: 'Awaiting semantic lookup...', nodeId: 'memory' },
  { id: '7', name: 'Reasoning Process', time: '--', agent: 'Specialist Node', model: 'AMD AI Cloud / Llama-3-70b', confidence: 0, status: 'pending', trace: 'Awaiting LLM response...', nodeId: 'selectedAgent' },
  { id: '8', name: 'Tool Execution', time: '--', agent: 'Sandbox Runtime', model: 'Panani X Execution', confidence: 0, status: 'pending', trace: 'Awaiting tool calls...', nodeId: 'tools' },
  { id: '9', name: 'Compliance Check', time: '--', agent: 'Kavacha Shield', model: 'Policy Engine', confidence: 0, status: 'pending', trace: 'Awaiting policy checks...', nodeId: 'models' },
  { id: '10', name: 'Model Integration', time: '--', agent: 'LiteLLM Gateway', model: 'Fallback Resolver', confidence: 0, status: 'pending', trace: 'Awaiting aggregator...', nodeId: 'execution' },
  { id: '11', name: 'Memory Ingestion', time: '--', agent: 'Memory Vault', model: 'pgvector / Qdrant', confidence: 0, status: 'pending', trace: 'Awaiting state write...', nodeId: 'result' },
  { id: '12', name: 'Completion', time: '--', agent: 'System Gateway', model: 'Gateway', confidence: 100, status: 'pending', trace: 'Awaiting final delivery...', nodeId: 'result' },
]

export default function WorkflowsPage() {
  const [goal, setGoal] = useState('')
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES)
  const [running, setRunning] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [activeEdge, setActiveEdge] = useState<string | null>(null)
  const [executionTime, setExecutionTime] = useState(0)
  const [explainData, setExplainData] = useState<any>(null)
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)

  // Judge Mode states
  const [isJudgeMode, setIsJudgeMode] = useState(false)
  const [judgeTelemetry, setJudgeTelemetry] = useState<any>(null)

  // Guided hackathon scenario simulation
  const runGuidedScenario = async () => {
    if (running) return
    setRunning(true)
    setIsJudgeMode(false)
    setGoal('Build an AI customer support workflow with risk evaluation and automated coding updates')
    setExecutionTime(0)
    setExplainData(null)
    setSelectedStage(null)
    setJudgeTelemetry(null)

    // Reset stages
    const reset = INITIAL_STAGES.map(s => ({ ...s, status: 'pending' as const, time: '--' }))
    setStages(reset)

    const timer = setInterval(() => {
      setExecutionTime(t => t + 45)
    }, 45)

    // Step 1: Goal Ingestion
    setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'active', trace: 'Ingesting goal: "Build an AI customer support workflow..."' } : s))
    setActiveNode('user')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'completed', time: '12ms' } : s))

    // Step 2: Intent Classification
    setStages(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'active', confidence: 99.2, trace: 'Parsing intent: Classified as [SYSTEM_WORKFLOW_CREATION]' } : s))
    setActiveNode('intent')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'completed', time: '82ms' } : s))

    // Step 3: DAG Planning
    setStages(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'active', confidence: 97.5, trace: 'Generating Dynamic Task DAG: [Research -> Coding -> Testing -> Security -> Compliance]' } : s))
    setActiveNode('planner')
    await delay(1200)
    setStages(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'completed', time: '210ms' } : s))

    // Step 4: Task Graph Verification
    setStages(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'active', confidence: 100, trace: 'Kavacha Governance verification: DAG structure contains no infinite loops or security policy violations. Passed.' } : s))
    setActiveNode('taskGraph')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'completed', time: '45ms' } : s))

    // Step 5: Agent Selection
    setStages(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'active', confidence: 98.8, trace: 'Binding specialist agents: SupportArchitect-v1.0 (Lead), CodeSynth-v2.3 (Worker), KavachaAudit-Core (Governance).' } : s))
    setActiveNode('registry')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'completed', time: '74ms' } : s))

    // Step 6: Memory Retrieval
    setStages(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'active', confidence: 94.1, trace: 'Searching Memory Vault: Retrieved 3 episodic customer support layout contexts (similarity > 0.88).' } : s))
    setActiveNode('memory')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'completed', time: '115ms' } : s))

    // Step 7: Reasoning Process
    setStages(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: 'active', confidence: 96.7, trace: 'Specialist Agents formulating action sequence: Generating Python backend controllers and React frontend components for routing customer tickets.' } : s))
    setActiveNode('selectedAgent')
    await delay(1500)
    setStages(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: 'completed', time: '840ms' } : s))

    // Step 8: Tool Execution
    setStages(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: 'active', confidence: 99.4, trace: 'Panani X Execution: Invoking tool `create_repository` followed by `execute_tests`. Build success: 14/14 tests passed.' } : s))
    setActiveNode('tools')
    await delay(1500)
    setStages(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: 'completed', time: '1120ms' } : s))

    // Step 9: Compliance Check
    setStages(prev => prev.map((s, idx) => idx === 8 ? { ...s, status: 'active', confidence: 100, trace: 'Kavacha Guard Rails check: Output matches system requirements. Risk scoring: 0.00. Transaction ledger recorded.' } : s))
    setActiveNode('models')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 8 ? { ...s, status: 'completed', time: '52ms' } : s))

    // Step 10: Model Integration
    setStages(prev => prev.map((s, idx) => idx === 9 ? { ...s, status: 'active', confidence: 99.9, trace: 'LiteLLM routing completed on AMD Developer Cloud. GPU inference execution duration: 1.4s.' } : s))
    setActiveNode('execution')
    await delay(1200)
    setStages(prev => prev.map((s, idx) => idx === 9 ? { ...s, status: 'completed', time: '410ms' } : s))

    // Step 11: Memory Ingestion
    setStages(prev => prev.map((s, idx) => idx === 10 ? { ...s, status: 'active', confidence: 99.0, trace: 'Persisting final episodic structure and logs to Memory Vault (Qdrant & PostgreSQL).' } : s))
    setActiveNode('result')
    await delay(1000)
    setStages(prev => prev.map((s, idx) => idx === 10 ? { ...s, status: 'completed', time: '142ms' } : s))

    // Step 12: Completion
    setStages(prev => prev.map((s, idx) => idx === 11 ? { ...s, status: 'completed', time: '5ms', trace: 'Task completed successfully. Deliverable: Customer Support System workflow and tests deployed.' } : s))
    
    clearInterval(timer)
    setRunning(false)
    setActiveNode(null)

    // Populate explainability panel
    setExplainData({
      intent: 'SYSTEM_WORKFLOW_CREATION',
      plannerOutput: {
        steps: [
          { id: 1, action: 'Web research on customer support workflow requirements', duration: '210ms' },
          { id: 2, action: 'Write node scripts and controllers in Python', duration: '520ms' },
          { id: 3, action: 'Assemble frontend React views', duration: '320ms' },
          { id: 4, action: 'Run local test harness', duration: '1120ms' },
          { id: 5, action: 'Perform policy scan and deploy to staging', duration: '52ms' },
        ]
      },
      reasoning: 'The system grouped three distinct specialist agents to deliver a verified, compliant support pipeline. The coding output was validated in a Panani sandbox and met all HGI policy guidelines.',
      selectedAgents: ['SupportArchitect-v1.0', 'CodeSynth-v2.3', 'KavachaAudit-Core'],
      toolsUsed: ['create_repository', 'run_linter', 'execute_tests', 'qdrant_semantic_search'],
      memoriesRetrieved: [
        { text: 'Previous support layout configuration for Enterprise client', similarity: 0.93 },
        { text: 'HGI Compliance template v1.4', similarity: 0.89 }
      ],
      compliance: 'VERIFIED - PASSED',
      score: 100,
      infrastructure: {
        provider: 'AMD AI Developer Cloud',
        hardware: 'AMD Instinct MI300X GPU',
        tokensUsed: 4892,
        estimatedCost: '$0.0098',
        model: 'Llama-3-70b-Instruct'
      }
    })
  }

  // Judge Mode Launcher (Phase 6)
  const runJudgeMode = async () => {
    if (running) return
    setRunning(true)
    setIsJudgeMode(true)
    setGoal('Deploy an audited multi-agent database synchronization service on AMD Instinct GPU cluster')
    setExecutionTime(0)
    setExplainData(null)
    setSelectedStage(null)

    // Reset stages
    const reset = INITIAL_STAGES.map(s => ({ ...s, status: 'pending' as const, time: '--' }))
    setStages(reset)

    const timer = setInterval(() => {
      setExecutionTime(t => t + 30)
    }, 30)

    // Stage 1: Goal Ingestion
    setJudgeTelemetry({ model: 'Gateway', agent: 'System Gateway', policy: 'None', memory: 'N/A', confidence: '100%', latency: '12ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'active', trace: 'Judge Goal Received: Database Sync Deployment request.' } : s))
    setActiveNode('user')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'completed', time: '12ms' } : s))

    // Stage 2: Intent Classification
    setJudgeTelemetry({ model: 'Fireworks/Llama-3-8b', agent: 'CENSA Classifier', policy: 'None', memory: 'N/A', confidence: '99.2%', latency: '82ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'active', confidence: 99.2, trace: 'Intent Engine resolved command: [DATABASE_MIGRATION_DEPLOYMENT].' } : s))
    setActiveNode('intent')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'completed', time: '82ms' } : s))

    // Stage 3: DAG Planning
    setJudgeTelemetry({ model: 'Fireworks/Llama-3-70b', agent: 'Dynamic Planner', policy: 'None', memory: 'N/A', confidence: '98.5%', latency: '210ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'active', confidence: 98.5, trace: 'DAG Planner output: [Inspect schema -> Sync DB -> Test validation -> Audit policy]' } : s))
    setActiveNode('planner')
    await delay(750)
    setStages(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'completed', time: '210ms' } : s))

    // Stage 4: Task Graph Verification
    setJudgeTelemetry({ model: 'Deterministic', agent: 'Kavacha Verifier', policy: 'kavacha:policy-auth', memory: 'N/A', confidence: '100%', latency: '45ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'active', confidence: 100, trace: 'Kavacha Security Scan: Path contains zero unverified external libraries. Clear.' } : s))
    setActiveNode('taskGraph')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'completed', time: '45ms' } : s))

    // Stage 5: Agent Selection
    setJudgeTelemetry({ model: 'Registry Engine', agent: 'Registry Selector', policy: 'None', memory: 'N/A', confidence: '99.0%', latency: '74ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'active', confidence: 99.0, trace: 'Orchestrator selected: DataMigrationAgent-v2.1 and KavachaAudit-Core.' } : s))
    setActiveNode('registry')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'completed', time: '74ms' } : s))

    // Stage 6: Memory Retrieval
    setJudgeTelemetry({ model: 'Qdrant Vector DB', agent: 'Memory Vault', policy: 'None', memory: 'Similarity 98.7%', confidence: '94.1%', latency: '115ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'active', confidence: 94.1, trace: 'Memory Vault retrieval: Loaded previous Spanner-to-PostgreSQL schema mapper (similarity 0.98).' } : s))
    setActiveNode('memory')
    await delay(750)
    setStages(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'completed', time: '115ms' } : s))

    // Stage 7: Reasoning Process
    setJudgeTelemetry({ model: 'AMD AI Cloud / Llama-3-70b', agent: 'Specialist Node', policy: 'None', memory: 'N/A', confidence: '97.2%', latency: '840ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: 'active', confidence: 97.2, trace: 'Agent Reasoning: Synthesizing database migration script using pgvector indexing logic.' } : s))
    setActiveNode('selectedAgent')
    await delay(900)
    setStages(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: 'completed', time: '840ms' } : s))

    // Stage 8: Tool Execution
    setJudgeTelemetry({ model: 'Panani X Execution', agent: 'Sandbox Runtime', policy: 'kavacha:sandbox-v2', memory: 'N/A', confidence: '99.4%', latency: '1120ms', tool: 'spanner_execute_sql' })
    setStages(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: 'active', confidence: 99.4, trace: 'Panani isolate executed `spanner_execute_sql` schema migration task. Success.' } : s))
    setActiveNode('tools')
    await delay(900)
    setStages(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: 'completed', time: '1120ms' } : s))

    // Stage 9: Compliance Check
    setJudgeTelemetry({ model: 'Policy Engine', agent: 'Kavacha Shield', policy: 'kavacha:audit-ledger', memory: 'N/A', confidence: '100%', latency: '52ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 8 ? { ...s, status: 'active', confidence: 100, trace: 'Kavacha Policy: Code contains zero malicious files or unverified skills. Saved.' } : s))
    setActiveNode('models')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 8 ? { ...s, status: 'completed', time: '52ms' } : s))

    // Stage 10: Model Integration
    setJudgeTelemetry({ model: 'Fallback Resolver', agent: 'LiteLLM Gateway', policy: 'None', memory: 'N/A', confidence: '99.9%', latency: '410ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 9 ? { ...s, status: 'active', confidence: 99.9, trace: 'LiteLLM resolved primary model via AMD Instinct MI300X cluster.' } : s))
    setActiveNode('execution')
    await delay(800)
    setStages(prev => prev.map((s, idx) => idx === 9 ? { ...s, status: 'completed', time: '410ms' } : s))

    // Stage 11: Memory Ingestion
    setJudgeTelemetry({ model: 'pgvector / Qdrant', agent: 'Memory Vault', policy: 'None', memory: 'pgvector write success', confidence: '99.0%', latency: '142ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 10 ? { ...s, status: 'active', confidence: 99.0, trace: 'Memory Vault: Logged transaction and updated episodic memory context.' } : s))
    setActiveNode('result')
    await delay(700)
    setStages(prev => prev.map((s, idx) => idx === 10 ? { ...s, status: 'completed', time: '142ms' } : s))

    // Stage 12: Completion
    setJudgeTelemetry({ model: 'Gateway', agent: 'System Gateway', policy: 'None', memory: 'N/A', confidence: '100%', latency: '5ms', tool: 'N/A' })
    setStages(prev => prev.map((s, idx) => idx === 11 ? { ...s, status: 'completed', time: '5ms', trace: 'Sync service successfully deployed on target AMD Instinct node.' } : s))

    clearInterval(timer)
    setRunning(false)
    setActiveNode(null)

    // Populate explainability panel
    setExplainData({
      intent: 'DATABASE_MIGRATION_DEPLOYMENT',
      plannerOutput: {
        steps: [
          { id: 1, action: 'Connect Spanner database and download schemas', duration: '115ms' },
          { id: 2, action: 'Audit schema queries for PostgreSQL compatibility', duration: '840ms' },
          { id: 3, action: 'Trigger migrations inside sandboxed DB instance', duration: '1120ms' },
          { id: 4, action: 'Record safety policies and write state to memory', duration: '142ms' }
        ]
      },
      reasoning: 'The orchestrator deployed the Spanner-to-PostgreSQL schema sync script. Sandbox runtime executed tests under the kavacha:sandbox-v2 policy, mapping logs onto local pgvector memory stores successfully.',
      selectedAgents: ['DataMigrationAgent-v2.1', 'KavachaAudit-Core'],
      toolsUsed: ['spanner_execute_sql', 'spanner_list_tables', 'execute_tests'],
      memoriesRetrieved: [
        { text: 'Spanner-to-PostgreSQL schema mapping schema rules', similarity: 0.98 }
      ],
      compliance: 'VERIFIED - PASSED',
      score: 100,
      infrastructure: {
        provider: 'AMD AI Developer Cloud',
        hardware: 'AMD Instinct MI300X GPU',
        tokensUsed: 6248,
        estimatedCost: '$0.0125',
        model: 'Llama-3-70b-Instruct'
      }
    })
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Workflow className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CENSA Cognitive Orchestration</h1>
            <p className="text-muted-foreground text-sm">Design, trace, and audit autonomous agent workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={running ? 'syncing' : 'online'} label={running ? 'EXECUTING TASK' : 'ORCHESTRATOR ONLINE'} />
          <CommandButton 
            variant="gold" 
            size="sm"
            onClick={runGuidedScenario}
            disabled={running}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Run Guided Demo Scenario
          </CommandButton>
          <CommandButton 
            variant="gold" 
            size="sm"
            onClick={runJudgeMode}
            disabled={running}
            glow
          >
            <Activity className="w-4 h-4 mr-2 text-yellow-400" />
            Launch Judge Mode Demo
          </CommandButton>
        </div>
      </div>

      {/* User Console */}
      <GlassPanel className="p-6 relative overflow-hidden" glow="blue">
        <div className="absolute right-0 top-0 h-full w-px opacity-30">
          <DataStream direction="vertical" color="blue" speed="normal" />
        </div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          Task Dispatch Console
        </h3>
        <div className="flex gap-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={running}
            placeholder="Enter goal for the agentic operating system (e.g. 'Audit the financial logs of vertical ARTOIES, verify compliance, and report drift'...)"
            className="flex-1 p-3 rounded-lg bg-muted/20 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-sm resize-none h-16"
          />
          <div className="flex flex-col justify-between gap-2">
            <CommandButton 
              variant="primary" 
              className="h-full px-6" 
              onClick={runGuidedScenario} 
              disabled={running || !goal.trim()}
            >
              <Play className="w-4 h-4 mr-2" />
              Dispatch
            </CommandButton>
          </div>
        </div>
      </GlassPanel>

      {/* Real-time Judge Telemetry Matrix (Phase 6 Overlay) */}
      <AnimatePresence>
        {isJudgeMode && judgeTelemetry && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassPanel className="p-4 border border-yellow-500/20 bg-yellow-500/5" glow="amber">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 mb-3 uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                Live Judge Telemetry Matrix (ROCm Accelerated) [EMULATED RUNTIME]
              </div>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3 font-mono text-[10px]">
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">ACTIVE MODEL</span>
                  <span className="text-foreground font-bold">{judgeTelemetry.model}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">ACTIVE AGENT</span>
                  <span className="text-primary font-bold">{judgeTelemetry.agent}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">ACTIVE POLICY</span>
                  <span className="text-red-400 font-bold">{judgeTelemetry.policy}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">MEMORY STATE</span>
                  <span className="text-emerald-400 font-bold">{judgeTelemetry.memory}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">CONFIDENCE</span>
                  <span className="text-yellow-400 font-bold">{judgeTelemetry.confidence}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">STAGE LATENCY</span>
                  <span className="text-foreground font-bold">{judgeTelemetry.latency}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[8px]">ACTIVE TOOL</span>
                  <span className="text-secondary font-bold">{judgeTelemetry.tool}</span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid containing visual steps and graph */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Cinematic Step-by-Step Timeline (Phase 1) */}
        <GlassPanel className="lg:col-span-5 p-6 flex flex-col h-[750px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm">Cinematic Execution Trace</h3>
              <p className="text-[10px] text-muted-foreground font-mono">12-STAGE ORCHESTRATION PIPELINE [EMULATED DATA FLOW]</p>
            </div>
            {running && (
              <span className="text-xs font-mono text-primary flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin" />
                {executionTime}ms
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {stages.map((stage) => {
              const isActive = stage.status === 'active'
              const isCompleted = stage.status === 'completed'
              return (
                <motion.div
                  key={stage.id}
                  layoutId={`stage-${stage.id}`}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isActive ? 'bg-primary/20 border-primary shadow-[0_0_15px_oklch(0.65_0.18_250_/_0.2)] opacity-100 scale-[1.01]' :
                    isCompleted ? 'bg-muted/10 border-border/60 opacity-90 hover:bg-muted/25' :
                    'border-border/30 opacity-40'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isActive ? 'bg-primary animate-pulse' :
                        isCompleted ? 'bg-emerald-400' : 'bg-muted-foreground/30'
                      }`} />
                      <span className="font-medium text-xs font-mono">{stage.id}. {stage.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{stage.time}</span>
                  </div>
                  {(isActive || isCompleted) && (
                    <div className="mt-2 text-[10px] font-mono text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Agent: <strong className="text-foreground">{stage.agent}</strong></span>
                        <span>Model: <span className="text-foreground">{stage.model}</span></span>
                      </div>
                      {stage.confidence > 0 && (
                        <div>Confidence: <span className="text-primary font-bold">{stage.confidence}%</span></div>
                      )}
                      <p className="text-foreground/80 line-clamp-1 border-t border-white/5 pt-1 mt-1 text-[9px] italic">
                        {stage.trace}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </GlassPanel>

        {/* Live CENSA Orchestration Graph (Phase 2) */}
        <GlassPanel className="lg:col-span-7 p-6 flex flex-col h-[750px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm">Live CENSA Orchestration Graph</h3>
              <p className="text-[10px] text-muted-foreground font-mono">REAL-TIME DATA FLOW NETWORK [EMULATED GRAPH]</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-primary" /> Active Node
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed
            </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-lg relative overflow-hidden flex items-center justify-center">
            {/* SVG Orchestration Graph */}
            <svg className="w-full h-full absolute inset-0" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 165)" stopOpacity={0.8} />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.65 0.02 265)" />
                </marker>
              </defs>

              {/* Render glowing animated paths when running */}
              {running && (
                <>
                  <motion.path
                    d="M 120,60 L 280,60"
                    fill="none"
                    stroke="url(#edgeGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 280,60 L 440,60"
                    fill="none"
                    stroke="url(#edgeGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
              )}
            </svg>

            {/* Nodes Layout */}
            <div className="absolute inset-0 flex flex-col justify-around p-8">
              
              {/* Row 1: Intake & Intent */}
              <div className="flex justify-around items-center">
                <GraphNode id="user" label="User Input" icon={Terminal} activeNode={activeNode} stages={stages} />
                <GraphNode id="intent" label="Intent Engine" icon={Brain} activeNode={activeNode} stages={stages} />
                <GraphNode id="planner" label="Dynamic Planner" icon={Workflow} activeNode={activeNode} stages={stages} />
              </div>

              {/* Row 2: Graph & Registry */}
              <div className="flex justify-around items-center">
                <GraphNode id="taskGraph" label="Task Graph (DAG)" icon={Layers} activeNode={activeNode} stages={stages} />
                <GraphNode id="registry" label="Agent Registry" icon={Sliders} activeNode={activeNode} stages={stages} />
                <GraphNode id="selectedAgent" label="Selected Agent" icon={Cpu} activeNode={activeNode} stages={stages} />
              </div>

              {/* Row 3: Reasoning & Tools */}
              <div className="flex justify-around items-center">
                <GraphNode id="memory" label="Memory Vault" icon={Database} activeNode={activeNode} stages={stages} />
                <GraphNode id="tools" label="Panani Runtime" icon={Sliders} activeNode={activeNode} stages={stages} />
                <GraphNode id="models" label="Kavacha Policy" icon={CheckCircle} activeNode={activeNode} stages={stages} />
              </div>

              {/* Row 4: Models & Result */}
              <div className="flex justify-around items-center">
                <GraphNode id="execution" label="LLM/AMD Infrastructure" icon={Cpu} activeNode={activeNode} stages={stages} />
                <GraphNode id="result" label="Final Response" icon={CheckCircle} activeNode={activeNode} stages={stages} />
              </div>

            </div>
          </div>
        </GlassPanel>

      </div>

      {/* Selected Stage Detail Inspector Modal / Panel */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full"
          >
            <GlassPanel className="p-6 border border-primary/30" glow="blue">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Detailed Stage Inspector: {selectedStage.name}
                </h4>
                <button 
                  onClick={() => setSelectedStage(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-mono"
                >
                  [CLOSE]
                </button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-muted/10 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">RESPONSIBLE AGENT</span>
                  <span className="text-foreground font-semibold text-sm">{selectedStage.agent}</span>
                </div>
                <div className="p-3 bg-muted/10 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">MODEL / PROTOCOL</span>
                  <span className="text-foreground font-semibold text-sm">{selectedStage.model}</span>
                </div>
                <div className="p-3 bg-muted/10 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">LATENCY</span>
                  <span className="text-foreground font-semibold text-sm">{selectedStage.time}</span>
                </div>
                <div className="p-3 bg-muted/10 rounded border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">CONFIDENCE</span>
                  <span className="text-primary font-semibold text-sm">{selectedStage.confidence}%</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-black/60 rounded border border-border/20">
                <span className="text-muted-foreground block text-[10px] font-mono mb-2">RAW LOGS & TRACE OUT</span>
                <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-emerald-400">
                  {selectedStage.trace}
                </p>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explainability Panel (Phase 6) */}
      <AnimatePresence>
        {explainData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <GlassPanel className="p-6 border border-emerald-500/30" glow="emerald">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-base">HGI Explainability & Decision Panel</h3>
                </div>
                <StatusBadge status="online" label="EXPLAINABILITY RECONCILED" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left: Decision Logic */}
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Intent Classification</h4>
                    <p className="text-sm font-semibold font-mono text-primary">{explainData.intent}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Orchestrated Planning Logic</h4>
                    <div className="space-y-2 mt-2">
                      {explainData.plannerOutput.steps.map((s: any) => (
                        <div key={s.id} className="flex items-center gap-3 text-xs bg-muted/10 p-2 rounded border border-border/40 font-mono">
                          <span className="text-emerald-400 font-bold">Step {s.id}</span>
                          <span className="flex-1 text-foreground">{s.action}</span>
                          <span className="text-muted-foreground">{s.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Reasoning Summary</h4>
                    <p className="text-xs leading-relaxed bg-muted/20 p-3 rounded border border-border/40 italic">
                      "{explainData.reasoning}"
                    </p>
                  </div>
                </div>

                {/* Right: Technical bindings */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Selected Agents</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {explainData.selectedAgents.map((a: string) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-mono">{a}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Selected Sandbox Tools</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {explainData.toolsUsed.map((t: string) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30 font-mono">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Retrieved Knowledge Memories</h4>
                    <div className="space-y-2 mt-1">
                      {explainData.memoriesRetrieved.map((m: any, idx: number) => (
                        <div key={idx} className="p-2 bg-muted/15 rounded border border-border/30 text-[10px] font-mono">
                          <p className="line-clamp-1">{m.text}</p>
                          <span className="text-[9px] text-emerald-400">Similarity: {m.similarity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground font-mono">Compliance Evaluation</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {explainData.compliance}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">Score: {explainData.score}%</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Infrastructure Footprint */}
              <div className="mt-6 pt-4 border-t border-border flex flex-wrap justify-between items-center text-xs font-mono text-muted-foreground">
                <div>AMD Hardware Instance: <span className="text-foreground font-bold">{explainData.infrastructure.hardware}</span></div>
                <div>Tokens Ingested: <span className="text-primary font-bold">{explainData.infrastructure.tokensUsed}</span></div>
                <div>Model Provider: <span className="text-foreground">{explainData.infrastructure.provider} ({explainData.infrastructure.model})</span></div>
                <div>Estimated Transaction Cost: <span className="text-emerald-400 font-bold">{explainData.infrastructure.estimatedCost}</span></div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Graph node subcomponent
interface GraphNodeProps {
  id: string
  label: string
  icon: any
  activeNode: string | null
  stages: Stage[]
}

function GraphNode({ id, label, icon: Icon, activeNode, stages }: GraphNodeProps) {
  const matchStage = stages.find(s => s.nodeId === id)
  const isCompleted = matchStage && matchStage.status === 'completed'
  const isActive = activeNode === id

  return (
    <motion.div
      className={`flex flex-col items-center p-3 rounded-lg border w-36 relative transition-all ${
        isActive ? 'bg-primary/20 border-primary shadow-[0_0_15px_oklch(0.65_0.18_250_/_0.3)] scale-105' :
        isCompleted ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
        'bg-white/5 border-white/10 text-muted-foreground'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`p-2 rounded-full mb-1 bg-black/40 ${isActive ? 'text-primary' : isCompleted ? 'text-emerald-400' : 'text-muted-foreground'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-mono text-center font-bold tracking-tight">{label}</span>
      
      {/* Node status indicators */}
      {isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
      )}
      {isCompleted && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
      )}
    </motion.div>
  )
}
