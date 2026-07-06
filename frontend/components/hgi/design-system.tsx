"use client"

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode, forwardRef } from 'react'

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode
  variant?: 'default' | 'strong' | 'subtle'
  glow?: 'none' | 'blue' | 'violet' | 'emerald' | 'gold'
  animated?: boolean
  className?: string
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, variant = 'default', glow = 'none', animated = false, className, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[oklch(0.12_0.02_265_/_0.6)] backdrop-blur-xl border border-[oklch(0.35_0.04_265_/_0.3)]',
      strong: 'bg-[oklch(0.12_0.02_265_/_0.8)] backdrop-blur-2xl border border-[oklch(0.35_0.04_265_/_0.4)]',
      subtle: 'bg-[oklch(0.12_0.02_265_/_0.4)] backdrop-blur-md border border-[oklch(0.35_0.04_265_/_0.2)]',
    }
    
    const glowStyles = {
      none: '',
      blue: 'shadow-[0_0_20px_oklch(0.65_0.18_250_/_0.3),0_0_40px_oklch(0.65_0.18_250_/_0.1)]',
      violet: 'shadow-[0_0_20px_oklch(0.55_0.2_290_/_0.3),0_0_40px_oklch(0.55_0.2_290_/_0.1)]',
      emerald: 'shadow-[0_0_20px_oklch(0.72_0.18_165_/_0.3),0_0_40px_oklch(0.72_0.18_165_/_0.1)]',
      gold: 'shadow-[0_0_20px_oklch(0.78_0.16_85_/_0.3),0_0_40px_oklch(0.78_0.16_85_/_0.1)]',
    }
    
    return (
      <motion.div
        ref={ref}
        initial={animated ? { opacity: 0, y: 20 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'rounded-lg overflow-hidden',
          variantStyles[variant],
          glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

interface TelemetryCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  status?: 'nominal' | 'warning' | 'critical' | 'standby'
  className?: string
  animated?: boolean
}

export function TelemetryCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  status = 'nominal',
  className,
  animated = true,
}: TelemetryCardProps) {
  const statusColors = {
    nominal: 'text-[oklch(0.72_0.18_165)]',
    warning: 'text-[oklch(0.78_0.16_85)]',
    critical: 'text-[oklch(0.55_0.22_25)]',
    standby: 'text-muted-foreground',
  }
  
  const statusIndicator = {
    nominal: 'bg-[oklch(0.72_0.18_165)]',
    warning: 'bg-[oklch(0.78_0.16_85)]',
    critical: 'bg-[oklch(0.55_0.22_25)]',
    standby: 'bg-muted-foreground',
  }
  
  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }
  
  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.95 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass p-4 rounded-lg relative overflow-hidden group',
        className
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full animate-pulse', statusIndicator[status])} />
      </div>
      
      {/* Label */}
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-mono">
        {label}
      </p>
      
      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className={cn(
          'text-2xl font-bold telemetry-number',
          statusColors[status]
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
      
      {/* Trend */}
      {trend && trendValue && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs',
          trend === 'up' ? 'text-[oklch(0.72_0.18_165)]' : 
          trend === 'down' ? 'text-[oklch(0.55_0.22_25)]' : 
          'text-muted-foreground'
        )}>
          <span>{trendIcons[trend]}</span>
          <span>{trendValue}</span>
        </div>
      )}
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      </div>
    </motion.div>
  )
}

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'syncing' | 'error' | 'standby'
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: 'bg-[oklch(0.72_0.18_165)]', text: 'ONLINE', textColor: 'text-[oklch(0.72_0.18_165)]' },
    offline: { color: 'bg-muted-foreground', text: 'OFFLINE', textColor: 'text-muted-foreground' },
    syncing: { color: 'bg-[oklch(0.65_0.18_250)]', text: 'SYNCING', textColor: 'text-[oklch(0.65_0.18_250)]' },
    error: { color: 'bg-[oklch(0.55_0.22_25)]', text: 'ERROR', textColor: 'text-[oklch(0.55_0.22_25)]' },
    standby: { color: 'bg-[oklch(0.78_0.16_85)]', text: 'STANDBY', textColor: 'text-[oklch(0.78_0.16_85)]' },
  }
  
  const config = statusConfig[status]
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('w-2 h-2 rounded-full', config.color, status === 'syncing' && 'animate-pulse')} />
      <span className={cn('text-xs font-mono uppercase tracking-wider', config.textColor)}>
        {label || config.text}
      </span>
    </div>
  )
}

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'online' | 'offline' | 'syncing' | 'standby' | string
  label?: string
  className?: string
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const statusConfig: Record<string, { color: string; text: string; textColor: string }> = {
    success: { color: 'bg-[oklch(0.72_0.18_165)]', text: 'SUCCESS', textColor: 'text-[oklch(0.72_0.18_165)]' },
    active: { color: 'bg-[oklch(0.72_0.18_165)]', text: 'ACTIVE', textColor: 'text-[oklch(0.72_0.18_165)]' },
    online: { color: 'bg-[oklch(0.72_0.18_165)]', text: 'ONLINE', textColor: 'text-[oklch(0.72_0.18_165)]' },
    warning: { color: 'bg-[oklch(0.78_0.16_85)]', text: 'WARNING', textColor: 'text-[oklch(0.78_0.16_85)]' },
    standby: { color: 'bg-[oklch(0.78_0.16_85)]', text: 'STANDBY', textColor: 'text-[oklch(0.78_0.16_85)]' },
    syncing: { color: 'bg-[oklch(0.65_0.18_250)]', text: 'SYNCING', textColor: 'text-[oklch(0.65_0.18_250)]' },
    info: { color: 'bg-[oklch(0.65_0.18_250)]', text: 'INFO', textColor: 'text-[oklch(0.65_0.18_250)]' },
    error: { color: 'bg-[oklch(0.55_0.22_25)]', text: 'ERROR', textColor: 'text-[oklch(0.55_0.22_25)]' },
    offline: { color: 'bg-muted-foreground', text: 'OFFLINE', textColor: 'text-muted-foreground' },
  }

  const config = statusConfig[status] || {
    color: 'bg-[oklch(0.65_0.18_250)]',
    text: status.toUpperCase(),
    textColor: 'text-[oklch(0.65_0.18_250)]'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('w-2 h-2 rounded-full', config.color, (status === 'syncing' || status === 'training') && 'animate-pulse')} />
      <span className={cn('text-xs font-mono uppercase tracking-wider', config.textColor)}>
        {label || config.text}
      </span>
    </div>
  )
}

interface CommandButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  className?: string
}

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ children, variant = 'primary', size = 'md', glow = false, className, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      ghost: 'bg-transparent hover:bg-muted text-foreground',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      gold: 'bg-[oklch(0.78_0.16_85)] text-[oklch(0.08_0_0)] hover:bg-[oklch(0.78_0.16_85_/_0.9)]',
    }
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }
    
    const glowStyle = glow ? 'shadow-[0_0_20px_oklch(0.65_0.18_250_/_0.4)]' : ''
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'font-mono uppercase tracking-wider rounded-md transition-colors',
          'border border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
          variantStyles[variant],
          sizeStyles[size],
          glowStyle,
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

CommandButton.displayName = 'CommandButton'

interface DataStreamProps {
  direction?: 'horizontal' | 'vertical'
  speed?: 'slow' | 'normal' | 'fast'
  color?: 'blue' | 'violet' | 'emerald' | 'gold'
  className?: string
}

export function DataStream({ 
  direction = 'vertical', 
  speed = 'normal',
  color = 'blue',
  className 
}: DataStreamProps) {
  const speedDuration = {
    slow: '6s',
    normal: '3s',
    fast: '1.5s',
  }
  
  const colorGradients = {
    blue: 'from-transparent via-[oklch(0.65_0.18_250)] to-transparent',
    violet: 'from-transparent via-[oklch(0.55_0.2_290)] to-transparent',
    emerald: 'from-transparent via-[oklch(0.72_0.18_165)] to-transparent',
    gold: 'from-transparent via-[oklch(0.78_0.16_85)] to-transparent',
  }
  
  return (
    <div className={cn(
      'overflow-hidden',
      direction === 'vertical' ? 'w-px h-full' : 'h-px w-full',
      className
    )}>
      <motion.div
        className={cn(
          'bg-gradient-to-b',
          colorGradients[color],
          direction === 'vertical' ? 'w-full h-1/2' : 'h-full w-1/2'
        )}
        animate={{
          [direction === 'vertical' ? 'y' : 'x']: ['0%', '200%'],
        }}
        transition={{
          duration: parseFloat(speedDuration[speed]),
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

interface HolographicBorderProps {
  children: ReactNode
  className?: string
  animated?: boolean
}

export function HolographicBorder({ children, className, animated = true }: HolographicBorderProps) {
  return (
    <div className={cn('relative p-[1px] rounded-lg overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[oklch(0.65_0.18_250)] via-[oklch(0.55_0.2_290)] to-[oklch(0.72_0.18_165)]"
        animate={animated ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : undefined}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ backgroundSize: '200% 200%' }}
      />
      <div className="relative bg-background rounded-lg">
        {children}
      </div>
    </div>
  )
}

export function ScanlineOverlay({ className }: { className?: string }) {
  return (
    <div 
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }}
    />
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  icon?: any
  status?: 'success' | 'warning' | 'error' | 'nominal' | 'critical' | 'standby' | string
  className?: string
  animated?: boolean
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  status = 'success',
  className,
  animated = true,
}: MetricCardProps) {
  const statusColors = {
    success: 'text-[oklch(0.72_0.18_165)]',
    nominal: 'text-[oklch(0.72_0.18_165)]',
    warning: 'text-[oklch(0.78_0.16_85)]',
    critical: 'text-[oklch(0.55_0.22_25)]',
    error: 'text-[oklch(0.55_0.22_25)]',
    standby: 'text-muted-foreground',
  }
  
  const statusIndicator = {
    success: 'bg-[oklch(0.72_0.18_165)]',
    nominal: 'bg-[oklch(0.72_0.18_165)]',
    warning: 'bg-[oklch(0.78_0.16_85)]',
    critical: 'bg-[oklch(0.55_0.22_25)]',
    error: 'bg-[oklch(0.55_0.22_25)]',
    standby: 'bg-muted-foreground',
  }
  
  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.95 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md group',
        className
      )}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full animate-pulse', statusIndicator[status as keyof typeof statusIndicator] || 'bg-blue-400')} />
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
          {label}
        </p>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          'text-2xl font-bold font-mono',
          statusColors[status as keyof typeof statusColors] || 'text-foreground'
        )}>
          {value}
        </span>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>
    </motion.div>
  )
}

export function NeuralPulse({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-24 h-24 flex items-center justify-center", className)}>
      <motion.div
        className="absolute w-20 h-20 rounded-full border border-[oklch(0.65_0.18_250)]"
        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-full border border-[oklch(0.55_0.2_290)]"
        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
      />
      <div className="w-4 h-4 rounded-full bg-[oklch(0.65_0.18_250)] shadow-[0_0_10px_oklch(0.65_0.18_250)]" />
    </div>
  )
}

export function ScanLine({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[oklch(0.72_0.18_165)] to-transparent opacity-80 shadow-[0_0_15px_oklch(0.72_0.18_165)] pointer-events-none z-50",
        className
      )}
      animate={{
        top: ['0%', '100%', '0%'],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
