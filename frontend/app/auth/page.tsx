"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Shield, 
  Lock, 
  Brain, 
  Scan,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { GlassPanel, CommandButton, StatusBadge, DataStream, HolographicBorder } from '@/components/hgi/design-system'
import { login } from '@/lib/api'

type AuthStage = 'identity' | 'biometric' | 'governance' | 'complete'

export default function AuthPage() {
  const router = useRouter()
  const [stage, setStage] = useState<AuthStage>('identity')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [validating, setValidating] = useState(false)
  const [errors, setErrors] = useState<string | null>(null)
  
  // Simulate biometric scan
  const startBiometricScan = () => {
    setScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          setStage('governance')
          return 100
        }
        return prev + 2
      })
    }, 50)
  }
  
  // Simulate governance validation
  const startGovernanceValidation = () => {
    setValidating(true)
    
    setTimeout(() => {
      setValidating(false)
      setStage('complete')
      
      // Redirect after completion
      setTimeout(() => {
        router.push('/hq')
      }, 1500)
    }, 2000)
  }
  
  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) {
      setErrors('Please enter your credentials')
      return
    }
    setErrors(null)
    setValidating(true)
    const ok = await login(identifier, password)
    setValidating(false)
    if (ok) {
      setStage('biometric')
    } else {
      setErrors('Invalid founder credentials')
    }
  }
  
  useEffect(() => {
    if (stage === 'governance') {
      startGovernanceValidation()
    }
  }, [stage])
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-neural-grid opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Data Streams */}
      <div className="fixed left-20 top-0 h-full opacity-30">
        <DataStream direction="vertical" color="blue" speed="slow" />
      </div>
      <div className="fixed right-20 top-0 h-full opacity-30">
        <DataStream direction="vertical" color="violet" speed="slow" />
      </div>
      
      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">RE-EVOLVE ON HGI</h1>
          <p className="text-sm text-muted-foreground font-mono">SECURE ACCESS PORTAL</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['identity', 'biometric', 'governance', 'complete'] as AuthStage[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <motion.div
                animate={{
                  backgroundColor: 
                    stage === s ? 'oklch(0.65 0.18 250)' :
                    ['identity', 'biometric', 'governance', 'complete'].indexOf(stage) > i 
                      ? 'oklch(0.72 0.18 165)' 
                      : 'oklch(0.25 0.03 265)',
                }}
                className="w-3 h-3 rounded-full"
              />
              {i < 3 && (
                <div className={`w-12 h-0.5 ${
                  ['identity', 'biometric', 'governance', 'complete'].indexOf(stage) > i 
                    ? 'bg-[oklch(0.72_0.18_165)]' 
                    : 'bg-[oklch(0.25_0.03_265)]'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <HolographicBorder>
          <GlassPanel variant="strong" className="p-8">
            <AnimatePresence mode="wait">
              {/* Stage 1: Identity Verification */}
              {stage === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">Identity Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your founder credentials</p>
                  </div>
                  
                  <form onSubmit={handleIdentitySubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Identifier
                      </label>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="founder@re-evolve.ai"
                        className="w-full mt-1 px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Access Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full mt-1 px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {errors && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        {errors}
                      </div>
                    )}
                    
                    <CommandButton type="submit" variant="primary" className="w-full" glow>
                      Verify Identity
                    </CommandButton>
                  </form>
                </motion.div>
              )}
              
              {/* Stage 2: Biometric Scan */}
              {stage === 'biometric' && (
                <motion.div
                  key="biometric"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/20 mb-4">
                    <Fingerprint className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Biometric Authentication</h2>
                  <p className="text-sm text-muted-foreground mb-8">Neural identity scan required</p>
                  
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Scan Animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/30 animate-spin" style={{ animationDuration: '10s' }} />
                    <div className="absolute inset-4 rounded-full border border-secondary/50" />
                    <div className="absolute inset-8 rounded-full border border-secondary/70" />
                    
                    {scanning && (
                      <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"
                      />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      {scanning ? (
                        <div className="text-center">
                          <Scan className="w-12 h-12 text-secondary animate-pulse mx-auto mb-2" />
                          <span className="text-2xl font-mono font-bold text-secondary">{scanProgress}%</span>
                        </div>
                      ) : (
                        <Fingerprint className="w-16 h-16 text-secondary/50" />
                      )}
                    </div>
                  </div>
                  
                  {!scanning && (
                    <CommandButton onClick={startBiometricScan} variant="secondary" glow>
                      Initialize Scan
                    </CommandButton>
                  )}
                </motion.div>
              )}
              
              {/* Stage 3: Governance Validation */}
              {stage === 'governance' && (
                <motion.div
                  key="governance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[oklch(0.78_0.16_85_/_0.2)] mb-4">
                    <Shield className="w-6 h-6 text-[oklch(0.78_0.16_85)]" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Governance Validation</h2>
                  <p className="text-sm text-muted-foreground mb-8">Verifying founder authority</p>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Identity Verified', done: true },
                      { label: 'Biometric Confirmed', done: true },
                      { label: 'Governance Check', done: false },
                      { label: 'Access Authorization', done: false },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
                      >
                        {item.done || (validating && i < 4) ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.3, type: 'spring' }}
                          >
                            <CheckCircle className="w-5 h-5 text-[oklch(0.72_0.18_165)]" />
                          </motion.div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 animate-pulse" />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Stage 4: Complete */}
              {stage === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[oklch(0.72_0.18_165_/_0.2)] mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-[oklch(0.72_0.18_165)]" />
                  </motion.div>
                  <h2 className="text-xl font-semibold mb-2 text-[oklch(0.72_0.18_165)]">Access Granted</h2>
                  <p className="text-sm text-muted-foreground mb-4">Welcome, Founder</p>
                  <StatusBadge status="online" label="INITIALIZING HQ..." />
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </HolographicBorder>
        
        {/* Security Notice */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          ENCRYPTED CONNECTION • ZERO-TRUST ARCHITECTURE
        </p>
      </motion.div>
    </div>
  )
}
