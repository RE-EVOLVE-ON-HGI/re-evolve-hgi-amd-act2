"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Globe, 
  Cpu, 
  Shield, 
  Wallet, 
  Network, 
  Eye, 
  Boxes,
  Workflow,
  Scale,
  AlertTriangle,
  FileSearch,
  BookOpen,
  Server,
  Map,
  Database,
  Lock,
  Bot,
  Sparkles,
  Brain,
  GitGraph,
  Orbit,
  Users,
  Crown,
  Rocket,
  Telescope,
  Radio,
  Layers,
  Settings,
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { GlassPanel, StatusBadge } from './design-system'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
  status?: 'online' | 'offline' | 'syncing' | 'error' | 'standby'
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: 'Command',
    items: [
      { name: 'Mission Control HQ', href: '/hq', icon: LayoutDashboard, status: 'online' },
      { name: 'Founder Cockpit', href: '/hq/founder', icon: Crown, badge: 'FOUNDER' },
      { name: 'Neural Command Core', href: '/hq/neural-core', icon: Brain, status: 'online' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { name: 'SARATHI Engine', href: '/hq/sarathi', icon: Cpu, status: 'syncing' },
      { name: 'Ecosystem Intelligence', href: '/hq/ecosystem', icon: Globe },
      { name: 'Agent Foundry', href: '/hq/agents', icon: Bot },
      { name: 'Agent Council', href: '/hq/council', icon: Users },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Financial Command', href: '/hq/finance', icon: Wallet },
      { name: 'Portfolio Verticals', href: '/hq/portfolio', icon: Boxes },
      { name: 'Workflow Studio', href: '/hq/workflows', icon: Workflow },
      { name: 'Vibe Code Studio', href: '/hq/vibe', icon: Sparkles },
    ],
  },
  {
    title: 'Governance',
    items: [
      { name: 'Governance Grid', href: '/hq/governance', icon: Scale, status: 'online' },
      { name: 'Risk & Compliance', href: '/hq/risk', icon: AlertTriangle },
      { name: 'Audit Intelligence', href: '/hq/audit', icon: FileSearch },
      { name: 'Policy & Ethics', href: '/hq/ethics', icon: BookOpen },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { name: 'Infrastructure Matrix', href: '/hq/infrastructure', icon: Server },
      { name: 'Multi-Region Ops', href: '/hq/regions', icon: Map },
      { name: 'Data Pipeline', href: '/hq/data', icon: Database },
      { name: 'Security Center', href: '/hq/security', icon: Lock },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { name: 'Memory Vault', href: '/hq/memory', icon: Brain },
      { name: 'Knowledge Graph', href: '/hq/knowledge', icon: GitGraph },
      { name: 'Global Atlas', href: '/hq/atlas', icon: Globe },
      { name: 'Ecosystem Galaxy', href: '/hq/galaxy', icon: Orbit },
    ],
  },
  {
    title: 'Command Chambers',
    items: [
      { name: 'Alpha Omega Chamber', href: '/hq/alpha-omega', icon: Crown, badge: 'SUPREME' },
      { name: 'Genesis Engine', href: '/hq/genesis', icon: Rocket },
      { name: 'Singularity Observatory', href: '/hq/singularity', icon: Telescope },
      { name: 'Situation Room', href: '/hq/situation', icon: Radio },
    ],
  },
]

interface HQNavigationProps {
  className?: string
}

export function HQNavigation({ className }: HQNavigationProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 h-screen z-50',
        'bg-sidebar border-r border-sidebar-border',
        'flex flex-col',
        className
      )}
    >
      {/* Logo & Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">RE-EVOLVE</h1>
                <p className="text-[10px] text-muted-foreground font-mono tracking-wider whitespace-nowrap">HGI COMMAND</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Command Search */}
      <div className="p-3 border-b border-sidebar-border">
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-md',
            'bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors',
            'text-muted-foreground hover:text-foreground',
            collapsed && 'justify-center px-2'
          )}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm flex-1 text-left"
              >
                Command Search
              </motion.span>
            )}
          </AnimatePresence>
          {!collapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
              <Command className="w-3 h-3 inline" />K
            </kbd>
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {!collapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 px-3"
                >
                  {section.title}
                </motion.h2>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200',
                        'hover:bg-sidebar-accent group relative',
                        isActive && 'bg-sidebar-accent text-sidebar-primary',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full"
                        />
                      )}
                      
                      <Icon className={cn(
                        'w-4 h-4 flex-shrink-0 transition-colors',
                        isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-foreground'
                      )} />
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm flex-1 truncate"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {!collapsed && item.badge && (
                        <span className={cn(
                          'text-[9px] font-mono px-1.5 py-0.5 rounded',
                          item.badge === 'FOUNDER' || item.badge === 'SUPREME'
                            ? 'bg-[oklch(0.78_0.16_85)] text-[oklch(0.08_0_0)]'
                            : 'bg-primary/20 text-primary'
                        )}>
                          {item.badge}
                        </span>
                      )}
                      
                      {!collapsed && item.status && (
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          item.status === 'online' && 'bg-[oklch(0.72_0.18_165)]',
                          item.status === 'syncing' && 'bg-[oklch(0.65_0.18_250)] animate-pulse',
                          item.status === 'error' && 'bg-[oklch(0.55_0.22_25)]',
                          item.status === 'standby' && 'bg-[oklch(0.78_0.16_85)]',
                          item.status === 'offline' && 'bg-muted-foreground'
                        )} />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      {/* System Status */}
      <div className="p-3 border-t border-sidebar-border">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">SYSTEM STATUS</span>
                <StatusBadge status="online" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">AGENTS ACTIVE</span>
                <span className="font-mono text-primary">247</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_165)] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-1/2 -translate-y-1/2',
          'w-6 h-6 rounded-full',
          'bg-sidebar-accent border border-sidebar-border',
          'flex items-center justify-center',
          'hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
          'transition-colors z-10'
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
      
      {/* Settings Link */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          href="/hq/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md',
            'hover:bg-sidebar-accent transition-colors',
            'text-muted-foreground hover:text-foreground',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  )
}

export function HQTopBar({ className }: { className?: string }) {
  return (
    <header className={cn(
      'fixed top-0 right-0 h-14 z-40',
      'bg-background/80 backdrop-blur-xl border-b border-border',
      'flex items-center justify-between px-6',
      className
    )}>
      {/* Left: Breadcrumb / Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">HQ</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Mission Control</span>
        </div>
      </div>
      
      {/* Center: System Telemetry */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_165)] animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">CORE: NOMINAL</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">LATENCY:</span>
          <span className="text-xs font-mono text-primary">12ms</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">AGENTS:</span>
          <span className="text-xs font-mono text-[oklch(0.72_0.18_165)]">247 ACTIVE</span>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-mono text-muted-foreground">UTC TIME</p>
          <p className="text-sm font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">F</span>
        </div>
      </div>
    </header>
  )
}
