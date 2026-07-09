"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Sphere, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const count = 2000
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 2
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })
  
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#5B8CFF"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

function NeuralConnections() {
  const linesRef = useRef<THREE.Group>(null)
  const connectionCount = 50
  
  const lines = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    for (let i = 0; i < connectionCount; i++) {
      const theta1 = Math.random() * Math.PI * 2
      const phi1 = Math.acos(2 * Math.random() - 1)
      const r1 = 2.5 + Math.random() * 0.5
      
      const theta2 = theta1 + (Math.random() - 0.5) * 0.5
      const phi2 = phi1 + (Math.random() - 0.5) * 0.5
      const r2 = 2.5 + Math.random() * 0.5
      
      result.push({
        start: new THREE.Vector3(
          r1 * Math.sin(phi1) * Math.cos(theta1),
          r1 * Math.sin(phi1) * Math.sin(theta1),
          r1 * Math.cos(phi1)
        ),
        end: new THREE.Vector3(
          r2 * Math.sin(phi2) * Math.cos(theta2),
          r2 * Math.sin(phi2) * Math.sin(theta2),
          r2 * Math.cos(phi2)
        ),
      })
    }
    return result
  }, [])
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            {/* @ts-ignore */}
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line.start.x, line.start.y, line.start.z,
                line.end.x, line.end.y, line.end.z,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#9B5CFF" opacity={0.3} transparent />
        </line>
      ))}
    </group>
  )
}

function GlobeCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0B1026"
        transparent
        opacity={0.9}
        wireframe={false}
      />
    </Sphere>
  )
}

function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[2.1, 32, 32]}>
      <meshBasicMaterial
        color="#5B8CFF"
        wireframe
        transparent
        opacity={0.2}
      />
    </Sphere>
  )
}

function PulseRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
      ring1Ref.current.rotation.x = Math.PI / 2
      ring1Ref.current.rotation.z = t * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.scale.setScalar(1 + Math.sin(t * 2 + 1) * 0.05)
      ring2Ref.current.rotation.x = Math.PI / 3
      ring2Ref.current.rotation.z = -t * 0.08
    }
    if (ring3Ref.current) {
      ring3Ref.current.scale.setScalar(1 + Math.sin(t * 2 + 2) * 0.05)
      ring3Ref.current.rotation.x = Math.PI / 4
      ring3Ref.current.rotation.z = t * 0.12
    }
  })
  
  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#5B8CFF" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#9B5CFF" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00E5B0" transparent opacity={0.2} />
      </mesh>
    </>
  )
}

function OrbitingNodes() {
  const group1Ref = useRef<THREE.Group>(null)
  const group2Ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group1Ref.current) {
      group1Ref.current.rotation.y = t * 0.3
      group1Ref.current.rotation.x = Math.PI / 6
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.y = -t * 0.2
      group2Ref.current.rotation.x = -Math.PI / 4
    }
  })
  
  return (
    <>
      <group ref={group1Ref}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 3, 0, Math.sin(i * Math.PI / 2) * 3]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00E5B0" />
          </mesh>
        ))}
      </group>
      <group ref={group2Ref}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 3) * 3.5, 0, Math.sin(i * Math.PI * 2 / 3) * 3.5]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#F6B73C" />
          </mesh>
        ))}
      </group>
    </>
  )
}

export function NeuralEarthVisualization({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#5B8CFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9B5CFF" />
        
        <GlobeCore />
        <GlobeWireframe />
        <ParticleField />
        <NeuralConnections />
        <PulseRings />
        <OrbitingNodes />
      </Canvas>
    </div>
  )
}

export default NeuralEarthVisualization
