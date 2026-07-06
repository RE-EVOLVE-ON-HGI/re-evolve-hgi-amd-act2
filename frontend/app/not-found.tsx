"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Play, ShieldAlert } from 'lucide-react'
import { GlassPanel, CommandButton, HolographicBorder } from '@/components/hgi/design-system'

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()
  const [isHqRoute, setIsHqRoute] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (pathname && pathname.startsWith('/hq/')) {
      setIsHqRoute(true)
    } else {
      // Auto-redirect other unknown paths to home
      setIsHqRoute(false)
      setRedirecting(true)
      const timer = setTimeout(() => {
        router.push('/')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [pathname, router])

  if (redirecting) {
    return (
      <div className="min-h-screen bg-[#050816] text-foreground flex flex-col items-center justify-center font-mono p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border border-primary/30 animate-pulse flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary animate-spin" />
          </div>
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">ROUTE NOT FOUND</h2>
          <p className="text-xs text-muted-foreground">Redirecting to Hackathon Experience landing page...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-neural-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <HolographicBorder>
          <GlassPanel variant="strong" className="p-8 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-yellow-500" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Enterprise Platform Modules</h2>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              These enterprise platform modules are intentionally gated during the AMD Hackathon demonstration to focus on the core CENSA cognitive orchestration, Panani X secure runtime, and Kavacha governance flows. The complete HGI Operating System includes these additional multi-region, financial command, and risk control panels for production clusters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
              <CommandButton 
                variant="subtle" 
                size="md" 
                onClick={() => router.push('/')}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Return to Hackathon Experience
              </CommandButton>
              
              <CommandButton 
                variant="primary" 
                size="md" 
                glow
                onClick={() => router.push('/?sim=true')}
                className="w-full sm:w-auto"
              >
                Go to Judge Mode
                <Play className="w-4 h-4 ml-2 inline" />
              </CommandButton>
            </div>
          </GlassPanel>
        </HolographicBorder>
      </motion.div>
    </div>
  )
}
